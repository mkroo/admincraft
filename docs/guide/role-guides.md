# 역할별 가이드

AdminCraft에는 세 가지 역할이 있습니다. "나는 어떤 역할이지?"가 궁금하다면 아래 표를 확인하세요.

## 내 역할 찾기

| 나는… | 역할 | 가이드 |
|-------|:---:|--------|
| 시스템을 설치하고, 인증·AI·API 스펙을 설정한다 | **Admin** | [Admin 가이드](/guide/role-guide-admin) |
| AI 또는 코드로 페이지를 만들고 갤러리에 공유한다 | **Editor** | [Editor 가이드](/guide/role-guide-editor) |
| 갤러리에서 페이지를 구독하고 업무에 사용한다 | **Viewer** | [Viewer 가이드](/guide/role-guide-viewer) |

## 역할 흐름

```mermaid
flowchart LR
  Admin["🔧 Admin<br/>설치 · 설정 · 거버넌스"]
  Editor["✏️ Editor<br/>페이지 생성 · 공유"]
  Viewer["👀 Viewer<br/>구독 · 사용"]

  Admin -->|"인프라 제공"| Editor
  Editor -->|"갤러리 공개"| Viewer
  Admin -->|"모든 Editor 기능 포함"| Editor
```

- **Admin**이 시스템을 세팅하면, **Editor**가 페이지를 만들고, **Viewer**가 사용합니다.
- Admin은 Editor의 모든 기능을 포함합니다.

## 역할별 요약

### Admin — 한 번 설정하면 팀 전체가 자급자족

- AdminCraft 설치 (Docker / 수동)
- OIDC 인증, AI Provider, OAS3 스펙 설정
- 전체 페이지 거버넌스 (모든 사용자 페이지 조회·편집·삭제)

→ [Admin 가이드 바로가기](/guide/role-guide-admin)

### Editor — 개발 요청 없이 직접 만든다

- AI 프롬프트 또는 TSX 코드로 페이지 생성
- 실시간 미리보기 & 대화형 수정
- 갤러리 공유 & 구독자 관리

→ [Editor 가이드 바로가기](/guide/role-guide-editor)

### Viewer — IT 티켓 없이 바로 사용

- 갤러리에서 페이지 검색 & 구독
- 나만의 사이드바 메뉴 구성
- 페이지 내 데이터 조회·수정 (API 호출)

→ [Viewer 가이드 바로가기](/guide/role-guide-viewer)

## 권한 상세

각 역할이 할 수 있는 작업의 전체 매트릭스는 [역할과 권한](/guide/roles-and-permissions) 문서를 참고하세요.
