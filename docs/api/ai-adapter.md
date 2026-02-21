# AIAdapter API

AI 페이지 생성 기능을 추상화하는 인터페이스입니다.

| 구현체 | 설명 | 소스 코드 |
|--------|------|-----------|
| AI 타입 정의 | `AIProvider`, `AISettings` 등 타입 | [`packages/core/src/types/`](https://github.com/mkroo/admincraft/tree/main/packages/core/src/types) |
| AI 설정 UI | Provider 선택, API 키 입력 폼 | [`apps/web/app/admin/settings/_components/ai-settings-form.tsx`](https://github.com/mkroo/admincraft/blob/main/apps/web/app/admin/settings/_components/ai-settings-form.tsx) |
| 연결 테스트 API | Provider 연결 검증 엔드포인트 | [`apps/web/app/api/admin/test-connection/route.ts`](https://github.com/mkroo/admincraft/blob/main/apps/web/app/api/admin/test-connection/route.ts) |

## 인터페이스

```typescript
interface AIAdapter {
  generatePage(request: GenerateRequest): AsyncIterable<string>
  refinePage(request: RefineRequest): AsyncIterable<string>
}
```

두 메서드 모두 `AsyncIterable<string>`을 반환하여 SSE 스트리밍을 지원합니다.

## generatePage

새 페이지를 생성합니다.

```typescript
interface GenerateRequest {
  prompt: string              // 사용자 자연어 요청
  spec: PartialSpec           // 관련 OAS3 엔드포인트만 추출된 스펙
  systemPrompt: string        // AI 시스템 프롬프트 하네스
}
```

### 사용 예시

```typescript
const adapter = createClaudeAdapter(apiKey)

const stream = adapter.generatePage({
  prompt: '주문 목록 페이지를 만들어줘',
  spec: partialSpec,
  systemPrompt: buildHarnessPrompt(),
})

let fullCode = ''
for await (const chunk of stream) {
  fullCode += chunk
  // SSE로 프론트엔드에 전달
}
```

## refinePage

기존 페이지를 대화형으로 수정합니다.

```typescript
interface RefineRequest {
  prompt: string              // "날짜 필터 추가해줘"
  currentSource: string       // 현재 TSX 소스
  history: ConversationMessage[]  // 이전 대화 이력
  spec: PartialSpec
  systemPrompt: string
}
```

### 사용 예시

```typescript
const stream = adapter.refinePage({
  prompt: '검색에 날짜 필터도 추가해줘',
  currentSource: existingCode,
  history: [
    { role: 'user', content: '주문 목록 페이지를 만들어줘', createdAt: '...' },
    { role: 'assistant', content: '... 이전 생성 코드 ...', createdAt: '...' },
  ],
  spec: partialSpec,
  systemPrompt: buildHarnessPrompt(),
})
```

## PartialSpec

전체 OAS3 스펙에서 프롬프트와 관련된 부분만 추출한 축소 스펙입니다.

```typescript
interface PartialSpec {
  openapi: string
  info: { title: string; version: string }
  paths: Record<string, any>          // 관련 엔드포인트만
  components: {
    schemas: Record<string, any>      // 참조된 스키마만
  }
}
```

토큰 절약을 위해 `@admincraft/ai`의 `extractRelevantSpec` 함수가 자동으로 관련 엔드포인트와 스키마를 추출합니다.

## 기본 제공 어댑터

### createClaudeAdapter

```typescript
import { createClaudeAdapter } from '@admincraft/ai/adapters/claude'

const adapter = createClaudeAdapter(apiKey: string)
```

Anthropic Claude API를 사용합니다.

### createOpenAICompatibleAdapter

```typescript
import { createOpenAICompatibleAdapter } from '@admincraft/ai/adapters/openai-compatible'

const adapter = createOpenAICompatibleAdapter({
  apiKey: string,
  baseURL: string,    // API 엔드포인트
  model: string,      // 모델명
})
```

OpenAI, Ollama, vLLM, Together AI 등 OpenAI 호환 API를 사용합니다.

## 커스텀 어댑터 구현

```typescript
import type { AIAdapter } from '@admincraft/ai/adapters/types'

function createMyAdapter(): AIAdapter {
  return {
    async *generatePage(request) {
      // 1. request.systemPrompt을 system message로 설정
      // 2. request.prompt + request.spec을 user message로 전달
      // 3. AI 응답을 스트리밍으로 yield
      const response = await myAI.chat({
        system: request.systemPrompt,
        message: `${request.prompt}\n\nAPI Spec:\n${JSON.stringify(request.spec)}`,
        stream: true,
      })

      for await (const chunk of response) {
        yield chunk.text
      }
    },

    async *refinePage(request) {
      // 1. request.history를 메시지 히스토리로 변환
      // 2. request.currentSource를 컨텍스트로 포함
      // 3. request.prompt를 최신 메시지로 추가
      // 4. 스트리밍으로 yield
    },
  }
}
```
