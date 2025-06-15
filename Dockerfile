# 🐳 Senior Knowledge Sharing Platform
# Multi-stage Docker build for optimized production deployment

# =============================================
# 🏗️ Build Stage - 파일 최적화 및 압축
# =============================================
FROM node:18-alpine AS builder

LABEL maintainer="awbaw24 <comensee24@gmail.com>"
LABEL description="Senior Knowledge Sharing Platform - Build Stage"

# 작업 디렉터리 설정
WORKDIR /app

# 빌드 도구 설치
RUN npm install -g clean-css-cli html-minifier-terser terser

# 소스 코드 복사
COPY website/ ./website/
COPY knowledge-base/ ./knowledge-base/
COPY templates/ ./templates/
COPY README.md ./
COPY *.md ./

# 빌드 디렉터리 생성
RUN mkdir -p /app/dist/website

# 🔧 HTML 파일 최적화
RUN echo "📄 HTML 파일 압축 중..." && \
    find website -name "*.html" -type f | while read file; do \
        filename=$(basename "$file"); \
        html-minifier-terser \
            --collapse-whitespace \
            --remove-comments \
            --remove-redundant-attributes \
            --remove-script-type-attrs \
            --remove-style-link-type-attrs \
            --minify-css true \
            --minify-js true \
            "$file" > "/app/dist/website/$filename"; \
        echo "✅ $filename 압축 완료"; \
    done

# 🎨 CSS 파일 최적화
RUN echo "🎨 CSS 파일 압축 중..." && \
    find website -name "*.css" -type f | while read file; do \
        filename=$(basename "$file"); \
        cleancss \
            --level 2 \
            --compatibility ie11 \
            -o "/app/dist/website/$filename" \
            "$file"; \
        echo "✅ $filename 압축 완료"; \
    done

# ⚡ JavaScript 파일 최적화
RUN echo "⚡ JavaScript 파일 압축 중..." && \
    find website -name "*.js" -type f | while read file; do \
        filename=$(basename "$file"); \
        terser "$file" \
            --compress \
            --mangle \
            --keep-fnames \
            --comments false \
            -o "/app/dist/website/$filename"; \
        echo "✅ $filename 압축 완료"; \
    done

# 📁 기타 파일 복사 (이미지, 폰트 등)
RUN find website -type f ! -name "*.html" ! -name "*.css" ! -name "*.js" -exec cp {} /app/dist/website/ \; 2>/dev/null || true

# 📊 압축 결과 출력
RUN echo "📊 최적화 결과:" && \
    echo "=== 원본 크기 ===" && \
    du -sh website/ && \
    echo "=== 압축 크기 ===" && \
    du -sh /app/dist/website/ && \
    echo "=== 파일 목록 ===" && \
    ls -la /app/dist/website/

# =============================================
# 🌐 Production Stage - Nginx 웹서버
# =============================================
FROM nginx:alpine AS production

LABEL maintainer="awbaw24 <comensee24@gmail.com>"
LABEL description="Senior Knowledge Sharing Platform - Production"
LABEL version="1.0.0"

# 보안 및 성능을 위한 패키지 설치
RUN apk add --no-cache \
    ca-certificates \
    tzdata \
    && rm -rf /var/cache/apk/*

# 한국 시간대 설정
RUN cp /usr/share/zoneinfo/Asia/Seoul /etc/localtime && \
    echo "Asia/Seoul" > /etc/timezone

# 최적화된 파일 복사
COPY --from=builder /app/dist/website/ /usr/share/nginx/html/website/
COPY --from=builder /app/knowledge-base/ /usr/share/nginx/html/knowledge-base/
COPY --from=builder /app/templates/ /usr/share/nginx/html/templates/
COPY --from=builder /app/README.md /usr/share/nginx/html/

# 🔧 Nginx 설정 파일
COPY <<EOF /etc/nginx/conf.d/default.conf
# 🌐 Senior Knowledge Sharing Platform - Nginx 설정

server {
    listen 80;
    server_name localhost;
    
    # 보안 헤더
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self' https:; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; img-src 'self' data: https:; font-src 'self' https://cdnjs.cloudflare.com;" always;
    
    # Gzip 압축
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;
    
    # 캐시 설정
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    location ~* \.(html)$ {
        expires 1h;
        add_header Cache-Control "public, must-revalidate";
    }
    
    # 메인 웹사이트
    location / {
        root /usr/share/nginx/html;
        index website/index.html;
        try_files \$uri \$uri/ /website/index.html;
    }
    
    # 웹사이트 디렉토리
    location /website/ {
        root /usr/share/nginx/html;
        index index.html;
        try_files \$uri \$uri/ /website/index.html;
    }
    
    # Knowledge Base API (정적 파일)
    location /api/knowledge/ {
        alias /usr/share/nginx/html/knowledge-base/;
        autoindex on;
        autoindex_format json;
    }
    
    # 템플릿 API (정적 파일)
    location /api/templates/ {
        alias /usr/share/nginx/html/templates/;
        autoindex on;
        autoindex_format json;
    }
    
    # 건강 상태 체크
    location /health {
        access_log off;
        return 200 "healthy\\n";
        add_header Content-Type text/plain;
    }
    
    # 404 에러 페이지
    error_page 404 /website/404.html;
    
    # 50x 에러 페이지
    error_page 500 502 503 504 /website/50x.html;
    
    # 로그 설정
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;
}
EOF

# 📁 필요한 에러 페이지 생성
RUN mkdir -p /usr/share/nginx/html/website
COPY <<EOF /usr/share/nginx/html/website/404.html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 - 페이지를 찾을 수 없습니다</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        h1 { color: #667eea; }
        .btn { background: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
    </style>
</head>
<body>
    <h1>404 - 페이지를 찾을 수 없습니다</h1>
    <p>요청하신 페이지가 존재하지 않습니다.</p>
    <a href="/website/" class="btn">홈으로 돌아가기</a>
</body>
</html>
EOF

COPY <<EOF /usr/share/nginx/html/website/50x.html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>서버 오류</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        h1 { color: #dc3545; }
        .btn { background: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
    </style>
</head>
<body>
    <h1>서버 오류가 발생했습니다</h1>
    <p>잠시 후 다시 시도해주세요.</p>
    <a href="/website/" class="btn">홈으로 돌아가기</a>
</body>
</html>
EOF

# 🔐 보안 설정
RUN addgroup -g 1001 -S nginx && \
    adduser -S -D -H -u 1001 -h /var/cache/nginx -s /sbin/nologin -G nginx -g nginx nginx

# 📊 헬스체크 설정
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

# 포트 설정
EXPOSE 80

# 실행 명령
CMD ["nginx", "-g", "daemon off;"]

# =============================================
# 🧪 Development Stage - 개발용 환경
# =============================================
FROM node:18-alpine AS development

LABEL description="Senior Knowledge Sharing Platform - Development"

WORKDIR /app

# 개발 도구 설치
RUN npm install -g \
    live-server \
    nodemon \
    concurrently \
    htmlhint \
    csslint \
    jshint

# 소스 코드 복사
COPY . .

# 포트 설정
EXPOSE 8080

# 개발 서버 실행
CMD ["live-server", "website", "--port=8080", "--host=0.0.0.0", "--no-browser"]
