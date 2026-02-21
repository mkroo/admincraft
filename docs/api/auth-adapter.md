# AuthAdapter

OIDC(OpenID Connect) 기반 인증을 추상화하는 어댑터 인터페이스입니다. OIDC Discovery로 엔드포인트를 자동 구성합니다.

| 구현체 | 설명 | 소스 코드 |
|--------|------|-----------|
| 역할 & 권한 | `AdminCraftRole`, `resolveRole`, 권한 매트릭스 | [`packages/core/src/auth/permissions.ts`](https://github.com/mkroo/admincraft/blob/main/packages/core/src/auth/permissions.ts) |
| NextAuth 설정 | Keycloak OIDC 연동, JWT 콜백 | [`apps/web/auth.ts`](https://github.com/mkroo/admincraft/blob/main/apps/web/auth.ts) |

## 인터페이스

```typescript
interface AuthAdapter {
  provider: OIDCProvider
  discover(): Promise<OIDCConfiguration>
  handleCallback(code: string, state?: string): Promise<AuthResult>
  refreshToken(refreshToken: string): Promise<TokenPair>
  resolveRole(user: AuthUser, idTokenClaims: Record<string, any>): AdminCraftRole
  logout(sessionId: string): Promise<{ redirectUrl?: string }>
}
```

## 타입

### OIDCProvider

```typescript
interface OIDCProvider {
  issuer: string               // OIDC issuer URL (Discovery 기반)
  clientId: string
  clientSecret: string
  scopes: string[]             // 기본: ['openid', 'profile', 'email']

  // 방법 1: ID Token claim 기반 (Keycloak 등)
  rolesClaim?: string
  roleMapping?: Record<string, AdminCraftRole>

  // 방법 2: 커스텀 정책 함수 (Google 등)
  rolePolicy?: (user: AuthUser) => AdminCraftRole
}
```

### OIDCConfiguration

```typescript
interface OIDCConfiguration {
  authorization_endpoint: string
  token_endpoint: string
  userinfo_endpoint: string
  end_session_endpoint?: string
  jwks_uri: string
}
```

### AuthResult

```typescript
interface AuthResult {
  user: AuthUser
  tokens: TokenPair
  idToken: string              // JWT
}
```

### AuthUser

```typescript
interface AuthUser {
  sub: string                  // OIDC subject (고유 ID)
  email: string
  name: string
  picture?: string
}
```

### TokenPair

```typescript
interface TokenPair {
  accessToken: string
  refreshToken: string
  idToken: string
  expiresIn: number            // seconds
}
```

### AdminCraftRole

```typescript
type AdminCraftRole = 'admin' | 'editor' | 'viewer'
```

## 메서드

### `discover()`

OIDC Discovery를 수행하여 provider의 엔드포인트를 자동 구성합니다.

**반환**: `Promise<OIDCConfiguration>`

### `handleCallback(code, state?)`

OIDC 콜백을 처리합니다. authorization code를 ID Token + Access Token으로 교환합니다.

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| `code` | `string` | authorization code |
| `state` | `string?` | CSRF 방지용 state |

**반환**: `Promise<AuthResult>`

### `refreshToken(refreshToken)`

만료된 토큰을 갱신합니다.

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| `refreshToken` | `string` | refresh token |

**반환**: `Promise<TokenPair>`

### `resolveRole(user, idTokenClaims)`

사용자의 AdminCraft 역할을 결정합니다. `rolePolicy`가 설정되어 있으면 커스텀 함수를 호출하고, `rolesClaim`이 설정되어 있으면 ID Token claims에서 역할을 추출하여 `roleMapping`을 적용합니다.

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| `user` | `AuthUser` | 인증된 사용자 정보 |
| `idTokenClaims` | `Record<string, any>` | ID Token의 decoded claims |

**반환**: `AdminCraftRole`

**우선순위:**
1. `rolePolicy` 설정됨 → `rolePolicy(user)` 호출
2. `rolesClaim` 설정됨 → claims에서 추출 → `roleMapping` 적용
3. 둘 다 없음 → `'viewer'`

### `logout(sessionId)`

세션을 정리하고, provider가 `end_session_endpoint`를 지원하면 해당 URL을 반환합니다.

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| `sessionId` | `string` | AdminCraft 세션 ID |

**반환**: `Promise<{ redirectUrl?: string }>`

## 기본 제공

### `keycloakOidc(options)`

Keycloak 프리셋. `issuer`, `rolesClaim`, `scopes`를 자동 설정합니다.

```typescript
import { keycloakOidc } from '@admincraft/core/auth'

keycloakOidc({
  serverUrl: string,           // Keycloak 서버 URL
  realm: string,               // Realm 이름
  clientId: string,
  clientSecret: string,
  rolesClaim?: string,         // 기본: 'realm_access.roles'
  roleMapping?: Record<string, AdminCraftRole>,
})
// issuer: '{serverUrl}/realms/{realm}' 자동 설정
```

### `oidc(options)`

범용 OIDC. 모든 OIDC 호환 provider에 사용합니다.

```typescript
import { oidc } from '@admincraft/core/auth'

oidc({
  issuer: string,              // OIDC issuer URL
  clientId: string,
  clientSecret: string,
  scopes?: string[],           // 기본: ['openid', 'profile', 'email']

  // rolesClaim 기반 (사내 IdP 등)
  rolesClaim?: string,
  roleMapping?: Record<string, AdminCraftRole>,

  // 또는 rolePolicy 기반 (Google 등)
  rolePolicy?: (user: AuthUser) => AdminCraftRole,
})
```

## 커스텀 어댑터 작성

```typescript
import type { AuthAdapter } from '@admincraft/core/auth/types'

function createMyAuth(): AuthAdapter {
  return {
    provider: {
      issuer: 'https://my-idp.com',
      clientId: '...',
      clientSecret: '...',
      scopes: ['openid', 'profile'],
    },
    async discover() { /* ... */ },
    async handleCallback(code, state) { /* ... */ },
    async refreshToken(refreshToken) { /* ... */ },
    resolveRole(user, claims) { return 'viewer' },
    async logout(sessionId) { return {} },
  }
}
```

설정 방법은 [인증 설정](/configuration/oauth) 문서를 참고하세요.
