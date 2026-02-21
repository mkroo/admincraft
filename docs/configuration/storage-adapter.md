# Storage Adapter 설정

AdminCraft 내부 데이터(페이지, 메뉴, 설정 등)의 저장소를 어댑터 패턴으로 교체할 수 있습니다. 기본은 SQLite이며, Supabase 등 다른 저장소로 교체 가능합니다.

## 기본 저장소: SQLite

별도 설정 없이 바로 사용할 수 있습니다. 셀프호스팅에 적합합니다.

- 파일 기반 DB (서버 설치 불필요)
- 최초 실행 시 자동 마이그레이션
- `./data/admincraft.db` 파일에 저장

## 커스텀 어댑터 교체

### 1. StorageAdapter 인터페이스 구현

```typescript
import type { StorageAdapter } from '@admincraft/core/storage/types'

export function createMyAdapter(): StorageAdapter {
  return {
    pages: {
      async list(filter?) { /* ... */ },
      async get(id) { /* ... */ },
      async save(page) { /* ... */ },
      async delete(id) { /* ... */ },
    },
    menus: {
      async getTree(userId) { /* ... */ },
      async update(userId, tree) { /* ... */ },
    },
    subscriptions: {
      async list(userId) { /* ... */ },
      async subscribe(userId, pageId) { /* ... */ },
      async unsubscribe(userId, pageId) { /* ... */ },
    },
    specs: {
      async list() { /* ... */ },
      async get(id) { /* ... */ },
      async save(spec) { /* ... */ },
      async delete(id) { /* ... */ },
    },
    specEnvironments: {
      async list(specId) { /* ... */ },
      async save(specId, envs) { /* ... */ },
      async getBaseUrl(specId, label) { /* ... */ },
      async getDefault(specId) { /* ... */ },
    },
    componentRequests: {
      async list(filter?) { /* ... */ },
      async get(id) { /* ... */ },
      async create(request) { /* ... */ },
      async updateStatus(id, status) { /* ... */ },
      async countByName(name) { /* ... */ },
    },
    aiSessions: {
      async create(userId, specId) { /* ... */ },
      async get(sessionId) { /* ... */ },
      async addMessage(sessionId, message) { /* ... */ },
      async linkPage(sessionId, pageId) { /* ... */ },
    },
    settings: {
      async get(key) { /* ... */ },
      async set(key, value) { /* ... */ },
    },
  }
}
```

### 2. 설정에 주입

```typescript
// admincraft.config.ts
import { defineConfig } from '@admincraft/core'
import { createMyAdapter } from './my-adapter'

export default defineConfig({
  storage: createMyAdapter(),
})
```

## 예시: Supabase 어댑터

```typescript
import { createClient } from '@supabase/supabase-js'
import type { StorageAdapter } from '@admincraft/core/storage/types'

export function createSupabaseAdapter(url: string, key: string): StorageAdapter {
  const supabase = createClient(url, key)

  return {
    pages: {
      async list(filter) {
        let query = supabase.from('pages').select('*')
        if (filter?.ownerId) query = query.eq('owner_id', filter.ownerId)
        if (filter?.visibility) query = query.eq('visibility', filter.visibility)
        const { data } = await query
        return data ?? []
      },
      async get(id) {
        const { data } = await supabase
          .from('pages')
          .select('*')
          .eq('id', id)
          .single()
        return data
      },
      async save(page) {
        await supabase.from('pages').upsert(page)
      },
      async delete(id) {
        await supabase.from('pages').delete().eq('id', id)
      },
    },
    menus: { /* ... */ },
    subscriptions: { /* ... */ },
    specs: { /* ... */ },
    aiSessions: { /* ... */ },
    settings: { /* ... */ },
  }
}
```

```typescript
// admincraft.config.ts
import { defineConfig } from '@admincraft/core'
import { createSupabaseAdapter } from './supabase-adapter'

export default defineConfig({
  storage: createSupabaseAdapter(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!,
  ),
})
```

## DB 스키마

커스텀 어댑터를 구현할 때 참고할 테이블 구조입니다.

### pages

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | TEXT PK | 페이지 ID |
| title | TEXT | 제목 |
| slug | TEXT | URL 슬러그 |
| source | TEXT | TSX 소스코드 |
| compiled_js | TEXT | 컴파일된 JavaScript 캐시 |
| compiled_at | DATETIME | 캐시 생성 시점 |
| spec_id | TEXT FK | 사용하는 OAS3 스펙 |
| owner_id | TEXT | 소유자 |
| visibility | TEXT | draft / private / published |
### user_menus

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | TEXT PK | 메뉴 항목 ID |
| user_id | TEXT | 사용자 |
| parent_id | TEXT FK | 상위 메뉴 (폴더) |
| label | TEXT | 표시 이름 |
| page_id | TEXT FK | 연결된 페이지 |
| sort_order | INTEGER | 정렬 순서 |
| icon | TEXT | 아이콘 |

### page_subscriptions

| 컬럼 | 타입 | 설명 |
|------|------|------|
| user_id | TEXT PK | 구독자 |
| page_id | TEXT PK | 구독 대상 페이지 |

### specs

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | TEXT PK | 스펙 ID |
| name | TEXT | 이름 |
| source_type | TEXT | file / url |
| source_ref | TEXT | 파일명 또는 URL |
| content | TEXT | 파싱된 JSON |

### spec_environments

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | TEXT PK | 환경 ID |
| spec_id | TEXT FK | OAS3 스펙 |
| label | TEXT | dev / staging / prod / 사용자 정의 |
| base_url | TEXT | 서버 URL |
| description | TEXT | 설명 |
| is_default | BOOLEAN | 배포 페이지 기본 환경 여부 |

자세한 환경 설정 방법은 [API 환경 설정](/configuration/api-environments)을 참고하세요.

### ai_sessions / ai_messages

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | TEXT PK | 세션/메시지 ID |
| user_id | TEXT | 사용자 (sessions) |
| page_id | TEXT FK | 연결된 페이지 (sessions) |
| spec_id | TEXT FK | 사용한 스펙 (sessions) |
| session_id | TEXT FK | 소속 세션 (messages) |
| role | TEXT | user / assistant (messages) |
| content | TEXT | 메시지 내용 (messages) |

### settings

| 컬럼 | 타입 | 설명 |
|------|------|------|
| key | TEXT PK | 설정 키 |
| value | TEXT | 설정 값 |

전체 인터페이스는 [StorageAdapter API 레퍼런스](/api/storage-adapter)를 참고하세요.
