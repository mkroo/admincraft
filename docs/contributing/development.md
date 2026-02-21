# 개발 환경 구성

AdminCraft에 기여하기 위한 개발 환경을 설정합니다.

## 사전 요구사항

- Node.js 20 이상
- pnpm 9 이상
- Git

## 저장소 클론

```bash
git clone https://github.com/xxx/admincraft.git
cd admincraft
```

## 의존성 설치

```bash
pnpm install
```

## 개발 서버 실행

```bash
pnpm dev
```

Turborepo가 모든 패키지와 앱의 개발 서버를 동시에 실행합니다:
- `apps/web` (Next.js): http://localhost:3000
- `docs` (VitePress): http://localhost:5173

## 빌드

```bash
# 전체 빌드
pnpm build

# 특정 패키지만 빌드
pnpm turbo build --filter=@admincraft/preset-antd
pnpm turbo build --filter=@admincraft/core
pnpm turbo build --filter=@admincraft/ai
```

## 테스트

```bash
# 전체 테스트
pnpm test

# 특정 패키지 테스트
pnpm turbo test --filter=@admincraft/core
```

## 린트 및 타입 체크

```bash
# 린트
pnpm turbo lint

# 타입 체크
pnpm turbo typecheck
```

## 패키지 구조

| 패키지 | 경로 | 설명 |
|--------|------|------|
| `@admincraft/core` | `packages/core` | Storage Adapter, Auth Adapter, 컴파일러, 공통 타입 |
| `@admincraft/preset-antd` | `packages/preset-antd` | Ant Design 프리셋 |
| `@admincraft/preset-shadcn` | `packages/preset-shadcn` | shadcn/ui 프리셋 |
| `@admincraft/preset-mui` | `packages/preset-mui` | MUI 프리셋 |
| `@admincraft/ai` | `packages/ai` | AI Adapter, 하네스, OAS3 추출기 |
| `apps/web` | `apps/web` | Next.js 앱 |
| `docs` | `docs` | VitePress 문서 사이트 |

## PR 제출

### 1. 브랜치 생성

```bash
git checkout -b feat/my-feature
```

### 2. 변경사항 커밋

```bash
git add .
git commit -m "feat: 기능 설명"
```

### 3. Changeset 추가

릴리즈에 포함될 변경이면 changeset을 추가합니다:

```bash
pnpm changeset
```

- 변경된 패키지 선택
- 변경 수준 선택 (patch / minor / major)
- 변경 내용 설명

### 4. PR 제출

```bash
git push origin feat/my-feature
```

GitHub에서 PR을 생성합니다. CI가 자동으로 lint, typecheck, test, build를 실행합니다.

## 커밋 컨벤션

| 접두어 | 용도 |
|--------|------|
| `feat:` | 새 기능 |
| `fix:` | 버그 수정 |
| `refactor:` | 리팩토링 |
| `docs:` | 문서 |
| `test:` | 테스트 |
| `chore:` | 빌드/CI 등 |
