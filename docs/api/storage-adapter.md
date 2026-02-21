# StorageAdapter API

AdminCraft 내부 데이터 저장을 추상화하는 인터페이스입니다.

> **소스 코드**: [`packages/core/src/storage/types.ts`](https://github.com/mkroo/admincraft/blob/main/packages/core/src/storage/types.ts) · 기본 구현: [`sqlite.ts`](https://github.com/mkroo/admincraft/blob/main/packages/core/src/storage/sqlite.ts)

## 인터페이스

```typescript
interface StorageAdapter {
  pages: PageStorage
  menus: MenuStorage
  subscriptions: SubscriptionStorage
  specs: SpecStorage
  specEnvironments: SpecEnvironmentStorage
  aiSessions: AISessionStorage
  settings: SettingsStorage
}
```

## pages

페이지 CRUD.

```typescript
interface PageStorage {
  list(filter?: PageFilter): Promise<PageMeta[]>
  get(id: string): Promise<PageData>
  save(page: PageData): Promise<void>
  delete(id: string): Promise<void>
}
```

### PageFilter

```typescript
interface PageFilter {
  ownerId?: string
  visibility?: 'draft' | 'private' | 'published'
  specId?: string
}
```

### PageData

```typescript
interface PageData {
  id: string
  title: string
  slug: string
  source: string              // TSX 소스코드
  compiledJs?: string         // 컴파일된 JS 캐시
  compiledAt?: string         // 캐시 생성 시점
  specId?: string
  ownerId: string
  visibility: 'draft' | 'private' | 'published'
  createdAt: string
  updatedAt: string
}
```

## menus

사용자별 메뉴 트리 관리.

```typescript
interface MenuStorage {
  getTree(userId: string): Promise<MenuItem[]>
  update(userId: string, tree: MenuItem[]): Promise<void>
}
```

### MenuItem

```typescript
interface MenuItem {
  id: string
  label: string
  icon?: string
  pageId?: string             // 페이지 연결 (없으면 폴더)
  children?: MenuItem[]       // 하위 메뉴
  sortOrder: number
}
```

## subscriptions

페이지 구독 관리.

```typescript
interface SubscriptionStorage {
  list(userId: string): Promise<PageMeta[]>
  subscribe(userId: string, pageId: string): Promise<void>
  unsubscribe(userId: string, pageId: string): Promise<void>
}
```

## specs

OAS3 스펙 관리.

```typescript
interface SpecStorage {
  list(): Promise<SpecMeta[]>
  get(id: string): Promise<OAS3Spec>
  save(spec: SpecInput): Promise<void>
  delete(id: string): Promise<void>
}
```

### SpecInput

```typescript
interface SpecInput {
  name: string
  sourceType: 'file' | 'url'
  sourceRef: string           // 파일명 또는 URL
  content: string             // 파싱된 JSON 문자열
}
```

## specEnvironments

스펙별 서버 환경(dev/staging/prod) 관리. [API 환경 설정](/configuration/api-environments) 참고.

```typescript
interface SpecEnvironmentStorage {
  list(specId: string): Promise<SpecEnvironment[]>
  save(specId: string, envs: SpecEnvironmentInput[]): Promise<void>
  getBaseUrl(specId: string, label: string): Promise<string>
  getDefault(specId: string): Promise<SpecEnvironment>
}
```

### SpecEnvironment

```typescript
interface SpecEnvironment {
  id: string
  specId: string
  label: string              // 'dev' | 'staging' | 'prod' | 사용자 정의
  baseUrl: string            // https://dev-api.example.com
  description?: string
  isDefault: boolean         // 배포 페이지 기본 환경
}
```

### SpecEnvironmentInput

```typescript
interface SpecEnvironmentInput {
  label: string
  baseUrl: string
  description?: string
  isDefault: boolean
}
```

## aiSessions

AI 대화 세션 관리.

```typescript
interface AISessionStorage {
  create(userId: string, specId: string): Promise<AISession>
  get(sessionId: string): Promise<AISession>
  addMessage(sessionId: string, message: ConversationMessage): Promise<void>
  linkPage(sessionId: string, pageId: string): Promise<void>
}
```

### AISession

```typescript
interface AISession {
  id: string
  userId: string
  specId: string
  pageId?: string
  messages: ConversationMessage[]
  createdAt: string
  updatedAt: string
}
```

### ConversationMessage

```typescript
interface ConversationMessage {
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}
```

## settings

키-값 설정 저장.

```typescript
interface SettingsStorage {
  get(key: string): Promise<any>
  set(key: string, value: any): Promise<void>
}
```
