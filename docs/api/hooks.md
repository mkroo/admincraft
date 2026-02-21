# Hooks API

`@admincraft/hooks`는 사용자 페이지에서 사용할 수 있는 유틸리티 React 훅을 제공합니다.

> **소스 코드**: [`packages/ui/src/import-map.ts`](https://github.com/mkroo/admincraft/blob/main/packages/ui/src/import-map.ts) · 사용 예시: [`packages/ui/src/templates/`](https://github.com/mkroo/admincraft/tree/main/packages/ui/src/templates)

## useApi

API 호출을 위한 훅입니다. 내부적으로 postMessage 브릿지를 통해 부모 프레임에 요청을 전달합니다.

```typescript
function useApi(): ApiClient
```

### ApiClient

```typescript
interface ApiClient {
  get(path: string, options?: RequestOptions): Promise<ApiResponse>
  post(path: string, body?: any, options?: RequestOptions): Promise<ApiResponse>
  put(path: string, body?: any, options?: RequestOptions): Promise<ApiResponse>
  delete(path: string, options?: RequestOptions): Promise<ApiResponse>
}

interface RequestOptions {
  params?: Record<string, any>    // 쿼리 파라미터
}

interface ApiResponse {
  data: any                       // 응답 데이터
  status: number                  // HTTP 상태 코드
}
```

### 사용 예시

```tsx
import { useApi } from '@admincraft/hooks'

export default function MyPage() {
  const api = useApi()
  const [data, setData] = useState([])

  useEffect(() => {
    api.get('/orders', { params: { page: 1, size: 20 } })
      .then(res => setData(res.data.items))
  }, [])

  const handleDelete = async (id: string) => {
    await api.delete(`/orders/${id}`)
    // 목록 새로고침
  }

  // ...
}
```

### 동작 원리

1. `api.get('/orders')` 호출
2. iframe 내부에서 `postMessage`로 부모 프레임에 요청 전달
3. 부모 프레임이 OAS3 allowlist 확인
4. 확인 통과 시 access token을 주입하여 `/api/proxy`로 요청
5. AdminCraft 서버가 외부 API 서버로 프록시
6. 응답을 `postMessage`로 iframe에 반환

::: warning
`fetch()`, `XMLHttpRequest`, `WebSocket`은 CSP에 의해 차단됩니다. 반드시 `useApi` 훅을 사용하세요.
:::

## usePageParams

URL 쿼리 파라미터를 읽는 훅입니다. 상세 페이지에서 ID를 받을 때 사용합니다.

```typescript
function usePageParams(): Record<string, string>
```

### 사용 예시

```tsx
import { usePageParams } from '@admincraft/hooks'

export default function OrderDetail() {
  const { id } = usePageParams()
  // /p/order-detail?id=1001 → id = "1001"

  // ...
}
```

## useAuth

현재 로그인한 사용자 정보를 읽는 훅입니다.

```typescript
function useAuth(): AuthInfo
```

### AuthInfo

```typescript
interface AuthInfo {
  userId: string
  name: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
}
```

### 사용 예시

```tsx
import { useAuth } from '@admincraft/hooks'

export default function MyPage() {
  const auth = useAuth()

  return (
    <Page>
      <PageHeader title={`${auth.name}님의 대시보드`} />
      {/* ... */}
    </Page>
  )
}
```

## useNavigate

다른 사용자 페이지로 이동하는 훅입니다.

```typescript
function useNavigate(): (slug: string, params?: Record<string, string>) => void
```

### 사용 예시

```tsx
import { useNavigate } from '@admincraft/hooks'

export default function OrderList() {
  const navigate = useNavigate()

  return (
    <DataTable
      columns={columns}
      dataSource={data}
      onRowClick={(row) => navigate('order-detail', { id: row.id })}
    />
  )
}
```

## 전체 import

```tsx
import { useApi, usePageParams, useAuth, useNavigate } from '@admincraft/hooks'
```
