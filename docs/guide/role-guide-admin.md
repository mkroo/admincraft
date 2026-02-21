# Admin 가이드

Admin은 AdminCraft를 설치하고 운영하는 시스템 관리자입니다. 인프라를 세팅하면 Editor와 Viewer가 자급자족할 수 있는 환경을 만들어줍니다.

## 해야 할 것

### 1. AdminCraft 설치

Docker 또는 수동 빌드로 서버를 띄웁니다.

| 방법 | 설명 |
|------|------|
| [Docker 설치](/guide/self-hosting-docker) | `docker compose up` 한 줄로 시작 |
| [수동 설치](/guide/self-hosting-manual) | 소스코드를 직접 빌드하여 실행 |

### 2. OIDC 인증 설정

사용자가 로그인하고 역할을 부여받으려면 OIDC provider 연동이 필요합니다.

→ [인증 (OIDC) 설정](/configuration/oauth)

### 3. AI Provider 설정

Editor가 AI로 페이지를 생성하려면 AI provider와 API 키가 설정되어 있어야 합니다. 서버 시작 후 **관리 > 시스템 설정**에서 설정합니다.

→ [AI Provider 설정](/configuration/ai-provider)

### 4. OAS3 API 스펙 등록

AI가 어떤 API를 호출할 수 있는지 알아야 페이지를 생성할 수 있습니다. Editor가 페이지를 만들 때 사용할 API 스펙(JSON/YAML)을 등록합니다.

→ [시작하기 — 초기 설정](/guide/getting-started#_4-초기-설정)

### 5. 디자인 시스템 선택 (선택사항)

기본 shadcn/ui가 아닌 사내 디자인 시스템을 사용하려면 커스텀 프리셋을 등록합니다.

→ [디자인 시스템 설정](/configuration/design-system)

::: tip 설정 순서
위 순서대로 진행하면 가장 빠르게 환경을 구성할 수 있습니다. 설치 → 인증 → AI → API 스펙 순서가 권장됩니다.
:::

## 할 수 있는 것

### 시스템 설정 런타임 변경

AI provider, API 환경 등 시스템 설정을 **서버 재시작 없이** 변경할 수 있습니다. 관리 > 시스템 설정에서 바로 반영됩니다.

### 전체 페이지 거버넌스

모든 사용자의 페이지를 조회·편집·삭제할 수 있습니다. 부적절한 콘텐츠 관리 등 관리 목적으로 사용됩니다.

### Editor의 모든 기능

Admin은 Editor 역할을 포함합니다. AI로 페이지를 만들고, 코드를 직접 작성하고, 갤러리에 공유할 수 있습니다.

→ [Editor 가이드](/guide/role-guide-editor)에서 Editor 기능 상세 확인

::: info Admin이 할 수 없는 것
Admin은 모든 권한을 가지지만, 다른 사용자의 비밀번호를 변경하거나 OIDC provider를 우회할 수는 없습니다. 사용자 인증은 전적으로 OIDC provider가 담당합니다.
:::

## 장점

### 한 번 설정하면 팀 전체가 자급자족

인프라를 세팅하면 Editor는 개발자 없이 페이지를 만들고, Viewer는 IT 티켓 없이 어드민을 사용합니다. 개발팀 병목이 해소됩니다.

### 보안은 프레임워크가 담당

비개발자가 페이지를 만들어도 보안 걱정이 없습니다. iframe sandbox, CSP, OAS3 allowlist가 자동으로 적용됩니다.

→ [보안 모델 상세](/guide/what-is-admincraft#보안-모델)

### 교체 가능한 어댑터 설계

UI 라이브러리, 저장소, AI provider를 어댑터 패턴으로 추상화했습니다. 기술 스택이 바뀌어도 어댑터만 교체하면 됩니다.

## 다음 단계

- [역할과 권한](/guide/roles-and-permissions) — Admin 권한 전체 매트릭스
- [Editor 가이드](/guide/role-guide-editor) — 페이지 생성 기능 상세
- [Storage Adapter API](/api/storage-adapter) — 저장소 커스터마이징
