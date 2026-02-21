# 아키텍처

AdminCraft의 내부 아키텍처를 설명합니다.

## 전체 구조

```mermaid
block-beta
  columns 1

  block:admincraft["AdminCraft (Next.js 단일 애플리케이션)"]
    columns 1

    block:ui["UI (App Router)"]
      shell["app/(shell)/ - 사이드바, 헤더"]
      gallery["app/gallery/ - 페이지 갤러리"]
      editor["app/editor/[id]/ - Monaco 에디터 + AI 채팅"]
      settings["app/settings/ - 설정"]
      specs_ui["app/admin/specs/ - OAS3 스펙 관리"]
      page["app/p/[slug]/ - 사용자 페이지 (iframe)"]
    end

    block:api["API (Route Handlers)"]
      pages_api["app/api/pages/ - 페이지 CRUD"]
      menus_api["app/api/menus/ - 메뉴 CRUD"]
      specs_api["app/api/specs/ - OAS3 스펙 관리"]
      proxy_api["app/api/proxy/ - 외부 API 프록시"]
      ai_api["app/api/ai/generate/ - AI 생성 (SSE)"]
      compile_api["app/api/compile/ - TSX 컴파일"]
    end

    block:adapters["Adapters"]
      storage["Storage Adapter\n(SQLite 기본)"]
      ai_adapter["AI Adapter\n(Claude 기본)"]
      auth_adapter["Auth Adapter\n(OIDC)"]
    end

    middleware["middleware.ts - OIDC 인증"]
  end

  ext_api["외부 API 서버 (OAS3 스펙)"]

  proxy_api --> ext_api
```

## 핵심 원칙

- **Next.js 단일 구조**: UI(App Router)와 API(Route Handlers)가 하나의 프레임워크에서 동작
- **어댑터 패턴**: Storage, AI, Auth, 디자인 시스템 모두 교체 가능한 인터페이스로 추상화
- **iframe 샌드박스**: 사용자 페이지는 격리된 환경에서 실행
- **프록시 아키텍처**: 사용자 페이지의 외부 API 호출은 서버를 통해 중계

## 보안 아키텍처

6개 보안 레이어로 사용자 생성 코드를 보호합니다.

```mermaid
flowchart TD
  A["정적 코드 검증\n(저장 시점)"] -->|통과| B["iframe sandbox\n(실행 시점)"]
  B --> C["CSP\n(실행 시점)"]
  C --> D["postMessage 브릿지\n(통신 시점)"]
  D --> E["OAS3 Allowlist\n(통신 시점)"]
  E --> F["API Proxy\n(서버 시점)"]

  A -.-|"위험 패턴 포함 시 저장 거부"| a1[ ]
  B -.-|"DOM/쿠키/네비게이션 격리"| b1[ ]
  C -.-|"네트워크 요청 원천 차단"| c1[ ]
  D -.-|"유일한 외부 통신 수단"| d1[ ]
  E -.-|"등록된 엔드포인트만 허용"| e1[ ]
  F -.-|"rate limit + 요청 로깅"| f1[ ]

  style a1 fill:none,stroke:none
  style b1 fill:none,stroke:none
  style c1 fill:none,stroke:none
  style d1 fill:none,stroke:none
  style e1 fill:none,stroke:none
  style f1 fill:none,stroke:none
```

### iframe sandbox

```html
<iframe sandbox="allow-scripts">
  <!-- allow-same-origin ❌ 부모 DOM/쿠키 접근 차단 -->
  <!-- allow-forms       ❌ 폼 직접 제출 차단 -->
  <!-- allow-popups      ❌ 팝업/새 창 차단 -->
</iframe>
```

### CSP

```
Content-Security-Policy:
  default-src 'none';
  script-src  'unsafe-eval';
  style-src   'unsafe-inline';
  connect-src 'none';          ← 모든 네트워크 요청 차단
  img-src     data: blob:;
```

### postMessage 브릿지

사용자 페이지의 `useApi()` 훅은 내부적으로 `postMessage`를 사용하여 부모 프레임에 요청을 전달합니다. 부모 프레임은 OAS3 allowlist를 확인하고, access token을 주입하여 `/api/proxy`로 요청합니다. 이때 현재 환경(dev/prod)에 맞는 base URL이 자동으로 선택됩니다. ([API 환경 설정](/configuration/api-environments) 참고)

```mermaid
sequenceDiagram
  participant iframe as iframe<br/>(사용자 페이지)
  participant parent as 부모 프레임<br/>(AdminCraft Shell)
  participant api as 외부 API 서버

  iframe->>parent: postMessage: api.get('/orders')
  parent->>parent: OAS3 allowlist 체크
  parent->>parent: access token 주입
  parent->>api: /api/proxy → 외부 API 호출
  api-->>parent: 응답 데이터
  parent-->>iframe: postMessage: 응답 전달
```

## TSX 컴파일 파이프라인

### 에디터 미리보기 (브라우저)

Sucrase로 브라우저에서 즉시 컴파일합니다. 보안 검증 없이 빠른 미리보기를 제공합니다.

### 저장 (서버)

```mermaid
flowchart LR
  A["TSX 소스"] --> B["정적 코드 검증"]
  B -->|통과| C["import 검증"]
  C -->|통과| D["SWC 컴파일"]
  D --> E["DB 저장"]
  E --> E1["source\n(TSX 원본)"]
  E --> E2["compiled_js\n(캐시)"]

  B -->|"실패"| X1["저장 거부"]
  C -->|"실패"| X2["저장 거부"]

  style X1 fill:#fee,stroke:#f66
  style X2 fill:#fee,stroke:#f66
```

### 페이지 로딩

```mermaid
flowchart LR
  A["페이지 요청"] --> B["DB에서\ncompiled_js 조회"]
  B -->|"컴파일 비용 0"| C["iframe으로 전달"]
  C --> D["Import Map 해석"]
  D --> E["실행"]
```

## AI 통합

### 시스템 프롬프트 하네스 (3 레이어)

1. **Design Constraints**: 프리셋 카탈로그 컴포넌트 우선 사용, 불가능 시 디자인 토큰 기반 커스텀 HTML/CSS 허용
2. **Component Catalog**: 사용 가능한 컴포넌트와 props 시그니처
3. **Few-shot Templates**: 페이지 유형별 (목록, 상세, 폼, 대시보드) 표준 패턴

### 커스텀 컴포넌트 폴백

기존 컴포넌트로 구현 불가능한 요청 시 AI가 자동으로:
1. 사용자에게 커스텀 컴포넌트 생성을 알림
2. 디자인 토큰을 활용한 커스텀 컴포넌트 생성

### OAS3 토큰 절약

전체 스펙 대신 프롬프트 키워드와 관련된 엔드포인트/스키마만 추출하여 AI에 전달합니다.

```mermaid
flowchart TD
  A["전체 OAS3 스펙\n200개 엔드포인트\n~50,000 토큰"] --> B["키워드 매칭\n+ 스키마 추출"]
  B --> C["축소 스펙\n5개 엔드포인트\n~3,000 토큰"]
  C -->|"94% 절약"| D["AI에 전달"]
```

### SSE 스트리밍

AI 응답은 Next.js Route Handler의 `ReadableStream`을 통해 SSE로 프론트엔드에 전달됩니다. 코드 생성 중 실시간 타이핑 효과를 제공합니다.

## 데이터 모델

```mermaid
erDiagram
  User ||--o{ Page : "소유 (owner_id)"
  User ||--o{ UserMenu : "메뉴 트리"
  User }o--o{ Page : "구독 (PageSubscription)"
  Page ||--o| AISession : "생성 세션"
  AISession ||--o{ AIMessage : "대화 메시지"
  Spec ||--o{ Page : "API 스펙 (spec_id)"
  Spec ||--o{ SpecEnvironment : "서버 환경"

  Page {
    string id PK
    string title
    string slug
    string source
    string compiled_js
    string owner_id FK
    string visibility
  }

  Spec {
    string id PK
    string name
    string source_type
    string content
  }

  AISession {
    string id PK
    string user_id FK
    string page_id FK
    string spec_id FK
  }

  SpecEnvironment {
    string id PK
    string spec_id FK
    string label
    string base_url
    boolean is_default
  }
```
