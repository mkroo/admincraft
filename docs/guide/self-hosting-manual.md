# 수동 설치

소스코드를 직접 빌드하여 AdminCraft를 실행합니다. 커스터마이징이 필요한 개발자에게 권장하는 방법입니다.

## 사전 요구사항

- Node.js 20 이상
- pnpm 9 이상

## npx로 프로젝트 생성

```bash
npx create-admincraft my-admin
cd my-admin
```

생성되는 구조:

```
my-admin/
├── admincraft.config.ts     # AdminCraft 설정
├── .env.example             # 환경변수 예시
├── package.json
└── ...
```

## 설정

### 1. 환경변수

```bash
cp .env.example .env
```

`.env` 파일을 편집합니다:

```bash
# === 필수 (OIDC 인증) ===
OIDC_PROVIDER=keycloak               # keycloak 또는 issuer URL
OIDC_CLIENT_ID=your-client-id
OIDC_CLIENT_SECRET=your-client-secret
KEYCLOAK_SERVER_URL=https://keycloak.example.com
KEYCLOAK_REALM=my-company

# === AI 키 암호화 ===
# ADMINCRAFT_SECRET_KEY=   # 자동 생성됨, 직접 지정도 가능
# AI 설정(provider, API 키)은 Admin Settings Page에서 관리
```

### 2. AdminCraft 설정 파일

`admincraft.config.ts`에서 Auth Adapter, Storage Adapter, UI 프리셋을 커스터마이징할 수 있습니다 (AI 설정은 Admin Settings Page에서 관리):

```typescript
import { defineConfig } from '@admincraft/core'

export default defineConfig({
  // 기본 설정 - 별도 커스터마이징 없이도 동작합니다
})
```

커스터마이징 예시는 다음 문서를 참고하세요:
- [인증 설정 (OIDC)](/configuration/oauth)
- [Storage Adapter 교체](/configuration/storage-adapter)
- [AI Provider 설정](/configuration/ai-provider)
- [디자인 시스템 교체](/configuration/design-system)

## 실행

### 개발 모드

```bash
pnpm dev
```

`http://localhost:3000` 에서 접속합니다. 코드 변경 시 자동으로 새로고침됩니다.

서버가 실행되면 [시작하기 > 초기 설정](/guide/getting-started#_4-초기-설정)을 따라 AI 설정과 API 스펙을 등록하세요.

### 프로덕션 빌드

```bash
pnpm build
pnpm start
```

## 소스코드에서 직접 빌드

저장소를 클론하여 전체 모노레포를 빌드할 수도 있습니다:

```bash
git clone https://github.com/xxx/admincraft.git
cd admincraft
pnpm install
pnpm build
```

### 개발 서버 실행

```bash
pnpm dev
```

### 특정 패키지만 빌드

```bash
# 프리셋 패키지만 빌드
pnpm turbo build --filter=@admincraft/preset-antd

# AI 패키지만 빌드
pnpm turbo build --filter=@admincraft/ai
```

## 프로젝트 구조

```
admincraft/
├── packages/
│   ├── core/          # Storage Adapter, 컴파일러, 공통 타입
│   ├── preset-antd/   # Ant Design 프리셋
│   ├── preset-shadcn/ # shadcn/ui 프리셋
│   ├── preset-mui/    # MUI 프리셋
│   ├── ai/            # AI Adapter, 하네스, OAS3 추출기
│   └── cli/           # 프로젝트 생성 CLI (향후)
├── apps/
│   └── web/           # Next.js 앱 (UI + API)
├── docs/              # VitePress 문서
└── docker/            # Docker 관련 파일
```
