# Docker 설치

Docker와 Docker Compose를 사용하여 AdminCraft를 설치합니다. 운영 환경에 권장하는 설치 방법입니다.

## 사전 요구사항

- Docker 20.10 이상
- Docker Compose v2 이상

## 설치

### 1. docker-compose.yml 준비

```bash
curl -fsSL https://raw.githubusercontent.com/xxx/admincraft/main/docker/docker-compose.yml \
  -o docker-compose.yml
```

또는 직접 작성합니다:

```yaml
services:
  admincraft:
    image: admincraft/admincraft:latest
    ports:
      - "3000:3000"
    volumes:
      - ./data:/app/data          # SQLite DB 영속화
    environment:
      - OIDC_PROVIDER=keycloak
      - OIDC_CLIENT_ID=${OIDC_CLIENT_ID}
      - OIDC_CLIENT_SECRET=${OIDC_CLIENT_SECRET}
      - KEYCLOAK_SERVER_URL=${KEYCLOAK_SERVER_URL}
      - KEYCLOAK_REALM=${KEYCLOAK_REALM}
      - ADMINCRAFT_SECRET_KEY=${ADMINCRAFT_SECRET_KEY}  # AI 키 암호화용
      # AI 설정은 Admin Settings Page에서 런타임 관리
    restart: unless-stopped
```

### 2. 환경변수 설정

`.env` 파일을 생성합니다:

```bash
# .env
# === 필수 (OIDC 인증) ===
OIDC_PROVIDER=keycloak               # keycloak 또는 issuer URL
OIDC_CLIENT_ID=your-client-id
OIDC_CLIENT_SECRET=your-client-secret
KEYCLOAK_SERVER_URL=https://keycloak.example.com
KEYCLOAK_REALM=my-company

# === AI 키 암호화 ===
# ADMINCRAFT_SECRET_KEY=   # 자동 생성됨, 직접 지정도 가능
# AI 설정(provider, API 키, 모델)은 Admin Settings Page에서 관리합니다
```

::: tip AI 설정은 Admin Settings Page에서
서버 시작 후 admin 계정으로 로그인하여 **관리 > 시스템 설정**에서 AI provider와 API 키를 설정합니다. AI를 설정하지 않아도 TSX를 직접 작성하여 페이지를 만드는 것은 가능합니다.
:::

### 3. 실행

```bash
docker compose up -d
```

### 4. 접속

브라우저에서 `http://localhost:3000` 에 접속합니다.
최초 실행 시 SQLite DB가 자동으로 생성되고 마이그레이션이 적용됩니다.

### 다음 단계

서버가 실행되면 [시작하기 > 초기 설정](/guide/getting-started#_4-초기-설정)을 따라 AI 설정과 API 스펙을 등록하세요.

## 데이터 관리

### 데이터 위치

SQLite DB 파일은 컨테이너 내부의 `/app/data` 디렉토리에 저장됩니다. `docker-compose.yml`에서 `./data:/app/data`로 볼륨 마운트하여 호스트에 영속화합니다.

```
./data/
└── admincraft.db          # SQLite 데이터베이스
```

### 백업

```bash
# DB 파일 복사
cp ./data/admincraft.db ./backup/admincraft-$(date +%Y%m%d).db
```

### 업데이트

```bash
docker compose pull
docker compose up -d
```

## 리버스 프록시 (Nginx)

외부에서 HTTPS로 접속하려면 리버스 프록시를 설정합니다.

```nginx
server {
    listen 443 ssl;
    server_name admin.example.com;

    ssl_certificate     /etc/ssl/certs/your-cert.pem;
    ssl_certificate_key /etc/ssl/private/your-key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # SSE 스트리밍 (AI 코드 생성)
    location /api/ai/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Connection '';
        proxy_buffering off;
        proxy_cache off;
    }
}
```

::: warning SSE 스트리밍 주의
AI 코드 생성은 SSE(Server-Sent Events)를 사용합니다. 리버스 프록시에서 `/api/ai/` 경로에 대해 `proxy_buffering off`를 설정해야 스트리밍이 정상 작동합니다.
:::

## 문제 해결

### 포트 충돌

3000번 포트가 이미 사용 중이면 `docker-compose.yml`에서 포트를 변경합니다:

```yaml
ports:
  - "8080:3000"   # 호스트 8080 → 컨테이너 3000
```

### 권한 오류

데이터 디렉토리에 쓰기 권한이 필요합니다:

```bash
mkdir -p ./data
chmod 777 ./data
```
