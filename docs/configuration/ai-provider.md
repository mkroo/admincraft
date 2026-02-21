# AI Provider 설정

AdminCraft는 AI를 활용하여 자연어 프롬프트만으로 어드민 페이지를 생성합니다. Claude, OpenAI, Ollama 등 다양한 provider를 지원하며, 시스템 관리자가 **Admin Settings Page**에서 런타임에 설정합니다.

## AI 없이 사용

AI 설정을 하지 않아도 AdminCraft를 사용할 수 있습니다. AI 페이지 생성 기능만 비활성화되고, TSX를 직접 작성하여 페이지를 만들거나, 갤러리에서 다른 사람이 만든 페이지를 구독하는 것은 가능합니다.

> AI를 사용하려면 아래 설정을 진행하세요.

## 설정 방법 (Admin Settings Page)

AI 설정은 `admincraft.config.ts`가 아닌 **Admin Settings Page**에서 관리합니다. 시스템 관리자(admin 역할)가 런타임에 UI에서 설정하며, 서버 재시작 없이 즉시 적용됩니다.

### 1. Admin Settings 접근

로그인 후 사이드바에서 **관리 > 시스템 설정** 메뉴로 이동합니다.

> admin 역할만 접근 가능합니다.

### 2. AI Provider 설정

| 필드 | 설명 | 필수 |
|------|------|:---:|
| Provider | AI 서비스 선택 (Claude, OpenAI, Ollama, OpenAI Compatible) | ✅ |
| API Key | AI 서비스의 API 키 | ✅ |
| Base URL | API 엔드포인트 URL (기본값 자동 설정) | ❌ |
| Model | 사용할 모델 (기본값 자동 설정) | ❌ |

### 3. 연결 테스트

설정 저장 전 **[연결 테스트]** 버튼으로 연결을 확인할 수 있습니다.

## Provider별 설정

### Claude (Anthropic) - 기본

| 필드 | 값 |
|------|------|
| Provider | Claude (Anthropic) |
| API Key | `sk-ant-xxxxxxxxxxxx` |
| Base URL | (비워두면 기본값 사용) |
| Model | (비워두면 기본값 사용) |

### OpenAI

| 필드 | 값 |
|------|------|
| Provider | OpenAI |
| API Key | `sk-xxxxxxxxxxxx` |
| Base URL | (비워두면 `https://api.openai.com/v1`) |
| Model | `gpt-4o` (또는 원하는 모델) |

### Ollama (로컬)

무료로 사용할 수 있는 로컬 AI입니다. GPU가 있으면 성능이 좋습니다.

```bash
# 1. Ollama 설치 (https://ollama.com)
# 2. 모델 다운로드
ollama pull llama3
```

| 필드 | 값 |
|------|------|
| Provider | Ollama |
| API Key | (아무 문자열, 예: `ollama`) |
| Base URL | `http://localhost:11434/v1` |
| Model | `llama3` |

::: tip Docker 환경에서 Ollama
Docker 컨테이너 내부에서 호스트의 Ollama에 접속하려면 `http://host.docker.internal:11434/v1`을 Base URL로 입력합니다.
:::

### 기타 OpenAI 호환 서비스

OpenAI 호환 API를 제공하는 서비스(vLLM, Together AI 등)는 모두 **OpenAI Compatible** provider로 사용할 수 있습니다.

| 필드 | 값 |
|------|------|
| Provider | OpenAI Compatible |
| API Key | 해당 서비스의 API 키 |
| Base URL | 해당 서비스의 API 엔드포인트 |
| Model | 사용할 모델명 |

## API 키 보안

- API 키는 DB에 **AES-256-GCM**으로 암호화되어 저장됩니다
- 암호화 키는 `ADMINCRAFT_SECRET_KEY` 환경변수로 관리됩니다
- Admin Settings UI에서 키는 마스킹(`••••••••`)되어 표시됩니다

## 환경변수에서 마이그레이션

기존에 `AI_API_KEY` 환경변수를 사용하던 경우, 서버 최초 시작 시 자동으로 DB로 마이그레이션됩니다. 마이그레이션 후에는 `.env`에서 `AI_API_KEY`를 제거해도 됩니다.

## 커스텀 AI Adapter

`AIAdapter` 인터페이스를 직접 구현하여 임의의 AI provider를 사용할 수 있습니다.

```typescript
import type { AIAdapter } from '@admincraft/ai/adapters/types'

function createMyAdapter(): AIAdapter {
  return {
    async *generatePage(request) {
      // 스트리밍으로 코드를 생성하여 yield
      yield 'import { Card } from "antd"\n'
      yield '...'
    },
    async *refinePage(request) {
      // 기존 코드를 수정하여 yield
      yield '...'
    },
  }
}
```

자세한 인터페이스는 [AIAdapter API 레퍼런스](/api/ai-adapter)를 참고하세요.
