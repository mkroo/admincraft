# 시작하기

AdminCraft를 설치하고 첫 페이지를 만들어보는 과정을 안내합니다.

## 설치 방법 선택

| 방법 | 대상 | 설명 |
|------|------|------|
| [Docker 설치](/guide/self-hosting-docker) | 운영자/시스템 관리자 | `docker compose up` 한 줄로 시작 |
| [수동 설치](/guide/self-hosting-manual) | 개발자/커스터마이징 | 소스코드를 직접 빌드하여 실행 |

## 빠른 시작 (Docker)

### 1. Docker Compose 파일 다운로드

```bash
curl -fsSL https://raw.githubusercontent.com/xxx/admincraft/main/docker/docker-compose.yml \
  -o docker-compose.yml
```

### 2. 환경변수 설정

인증(OIDC) 정보만 설정합니다. AI 설정(provider, API 키)은 환경변수가 아닌 서버 시작 후 **Admin Settings Page**에서 관리합니다.

```bash
# .env 파일 생성
cat <<EOF > .env
# 인증 (OIDC)
OIDC_PROVIDER=keycloak               # keycloak 또는 issuer URL
OIDC_CLIENT_ID=your-client-id
OIDC_CLIENT_SECRET=your-client-secret
KEYCLOAK_SERVER_URL=https://keycloak.example.com
KEYCLOAK_REALM=my-company
EOF
```

### 3. 실행

```bash
docker compose up -d
```

브라우저에서 `http://localhost:3000` 에 접속합니다.

### 4. 초기 설정

1. OIDC provider로 로그인 (Keycloak 등)
2. **관리 > 시스템 설정**에서 AI 설정 (admin 역할 필요)
   - Provider 선택 (Claude, OpenAI, Ollama 등)
   - API Key 입력
   - [연결 테스트]로 확인 후 저장
3. **관리 > OAS3 스펙 관리**에서 API 스펙 등록
   - 파일 업로드 (JSON/YAML)
   - 또는 URL 입력 (예: `https://api.example.com/openapi.json`)
4. 스펙 파싱 완료 확인

### 5. 첫 페이지 만들기

1. **새 페이지 만들기** 클릭
2. **AI로 만들기** 선택
3. 등록한 API 스펙 선택
4. 프롬프트 입력: "주문 목록을 테이블로 보여주는 페이지를 만들어줘"
5. AI가 생성한 코드와 미리보기 확인
6. **저장** 클릭 후 메뉴에 등록

## 다음 단계

- [역할별 가이드](/guide/role-guides) - 내 역할(Admin/Editor/Viewer)에 맞는 시작점 찾기
- [AI로 페이지 만들기](/guide/creating-pages-ai) - AI 페이지 생성의 자세한 사용법
- [코드로 페이지 만들기](/guide/creating-pages-code) - TSX를 직접 작성하여 페이지 생성
- [인증 설정 (OIDC)](/configuration/oauth) - Keycloak, 커스텀 OIDC, rolePolicy 설정
- [AI Provider 설정](/configuration/ai-provider) - Claude, OpenAI, Ollama 등 AI 설정
