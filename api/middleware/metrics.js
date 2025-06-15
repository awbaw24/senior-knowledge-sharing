// 📊 Senior Knowledge Sharing Platform - Metrics 미들웨어
// Prometheus 메트릭 수집 및 비즈니스 지표 추적

import promClient from 'prom-client';

// Prometheus 클라이언트 설정
const register = new promClient.Registry();

// 기본 시스템 메트릭 수집 활성화
promClient.collectDefaultMetrics({
    register,
    prefix: 'knowledge_sharing_',
    labels: {
        app: 'senior-knowledge-sharing',
        version: process.env.npm_package_version || '1.0.0'
    }
});

// =============================================
// 📈 HTTP 메트릭
// =============================================

// HTTP 요청 총 개수
const httpRequestsTotal = new promClient.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code', 'user_type'],
    registers: [register]
});

// HTTP 요청 처리 시간
const httpRequestDuration = new promClient.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10],
    registers: [register]
});

// 현재 처리 중인 요청 수
const httpRequestsInProgress = new promClient.Gauge({
    name: 'http_requests_in_progress',
    help: 'Number of HTTP requests currently being processed',
    labelNames: ['method', 'route'],
    registers: [register]
});

// HTTP 응답 크기
const httpResponseSize = new promClient.Histogram({
    name: 'http_response_size_bytes',
    help: 'Size of HTTP responses in bytes',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [100, 500, 1000, 5000, 10000, 50000, 100000],
    registers: [register]
});

// =============================================
// 👥 사용자 관련 메트릭
// =============================================

// 사용자 등록 수
const userRegistrationsTotal = new promClient.Counter({
    name: 'user_registrations_total',
    help: 'Total number of user registrations',
    labelNames: ['user_type', 'registration_source'],
    registers: [register]
});

// 로그인 시도 수
const loginAttemptsTotal = new promClient.Counter({
    name: 'login_attempts_total',
    help: 'Total number of login attempts',
    labelNames: ['status', 'user_type'],
    registers: [register]
});

// 현재 활성 사용자 수
const activeUsersGauge = new promClient.Gauge({
    name: 'active_users_current',
    help: 'Current number of active users',
    labelNames: ['user_type'],
    registers: [register]
});

// =============================================
// 🧑‍🏫 멘토링 관련 메트릭
// =============================================

// 멘토링 신청 수
const mentoringRequestsTotal = new promClient.Counter({
    name: 'mentoring_requests_total',
    help: 'Total number of mentoring requests',
    labelNames: ['field', 'status'],
    registers: [register]
});

// 완료된 멘토링 세션 수
const mentoringSessionsCompletedTotal = new promClient.Counter({
    name: 'mentoring_sessions_completed_total',
    help: 'Total number of completed mentoring sessions',
    labelNames: ['field', 'session_type'],
    registers: [register]
});

// 멘토링 세션 시간
const mentoringSessionDuration = new promClient.Histogram({
    name: 'mentoring_session_duration_minutes',
    help: 'Duration of mentoring sessions in minutes',
    labelNames: ['field', 'session_type'],
    buckets: [15, 30, 45, 60, 90, 120, 180, 240],
    registers: [register]
});

// 현재 진행 중인 멘토링 세션 수
const ongoingMentoringSessions = new promClient.Gauge({
    name: 'mentoring_sessions_ongoing',
    help: 'Number of currently ongoing mentoring sessions',
    labelNames: ['field'],
    registers: [register]
});

// =============================================
// 📚 지식 저장소 메트릭
// =============================================

// 지식 아티클 생성 수
const knowledgeArticlesCreatedTotal = new promClient.Counter({
    name: 'knowledge_articles_created_total',
    help: 'Total number of knowledge articles created',
    labelNames: ['category', 'author_type'],
    registers: [register]
});

// 지식 아티클 조회 수
const knowledgeArticleViewsTotal = new promClient.Counter({
    name: 'knowledge_article_views_total',
    help: 'Total number of knowledge article views',
    labelNames: ['category', 'article_id'],
    registers: [register]
});

// 지식 아티클 좋아요 수
const knowledgeArticleLikesTotal = new promClient.Counter({
    name: 'knowledge_article_likes_total',
    help: 'Total number of knowledge article likes',
    labelNames: ['category'],
    registers: [register]
});

// =============================================
// 🗄️ 데이터베이스 메트릭
// =============================================

// 데이터베이스 쿼리 수행 시간
const dbQueryDuration = new promClient.Histogram({
    name: 'db_query_duration_seconds',
    help: 'Duration of database queries in seconds',
    labelNames: ['operation', 'table', 'status'],
    buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 2],
    registers: [register]
});

// 데이터베이스 연결 풀 상태
const dbConnectionPoolGauge = new promClient.Gauge({
    name: 'db_connection_pool_size',
    help: 'Current database connection pool size',
    labelNames: ['status'],
    registers: [register]
});

// =============================================
// 🔧 시스템 메트릭
// =============================================

// 메모리 사용량
const memoryUsageGauge = new promClient.Gauge({
    name: 'memory_usage_bytes',
    help: 'Memory usage in bytes',
    labelNames: ['type'],
    registers: [register]
});

// CPU 사용량
const cpuUsageGauge = new promClient.Gauge({
    name: 'cpu_usage_percent',
    help: 'CPU usage percentage',
    registers: [register]
});

// 에러 발생 수
const errorsTotal = new promClient.Counter({
    name: 'errors_total',
    help: 'Total number of errors',
    labelNames: ['type', 'severity', 'component'],
    registers: [register]
});

// =============================================
// 📊 메트릭 미들웨어
// =============================================

// HTTP 메트릭 수집 미들웨어
export const httpMetricsMiddleware = (req, res, next) => {
    const startTime = Date.now();
    const route = req.route ? req.route.path : req.url;
    const method = req.method;
    
    // 진행 중인 요청 수 증가
    httpRequestsInProgress.inc({ method, route });
    
    // 응답 완료 시 메트릭 기록
    const originalSend = res.send;
    res.send = function(...args) {
        const duration = (Date.now() - startTime) / 1000;
        const statusCode = res.statusCode.toString();
        const userType = req.user ? req.user.role : 'anonymous';
        const responseSize = Buffer.byteLength(args[0] || '', 'utf8');
        
        // 메트릭 기록
        httpRequestsTotal.inc({ method, route, status_code: statusCode, user_type: userType });
        httpRequestDuration.observe({ method, route, status_code: statusCode }, duration);
        httpResponseSize.observe({ method, route, status_code: statusCode }, responseSize);
        httpRequestsInProgress.dec({ method, route });
        
        // 원래 send 함수 호출
        return originalSend.apply(this, args);
    };
    
    next();
};

// 비즈니스 메트릭 수집 함수들
export const recordUserRegistration = (userType = 'user', source = 'web') => {
    userRegistrationsTotal.inc({ user_type: userType, registration_source: source });
};

export const recordLoginAttempt = (success = false, userType = 'user') => {
    const status = success ? 'success' : 'failure';
    loginAttemptsTotal.inc({ status, user_type: userType });
};

export const updateActiveUsers = (count, userType = 'user') => {
    activeUsersGauge.set({ user_type: userType }, count);
};

export const recordMentoringRequest = (field, status = 'pending') => {
    mentoringRequestsTotal.inc({ field, status });
};

export const recordMentoringSessionCompleted = (field, sessionType = 'online', duration = 60) => {
    mentoringSessionsCompletedTotal.inc({ field, session_type: sessionType });
    mentoringSessionDuration.observe({ field, session_type: sessionType }, duration);
};

export const updateOngoingMentoringSessions = (count, field) => {
    ongoingMentoringSessions.set({ field }, count);
};

export const recordKnowledgeArticleCreated = (category, authorType = 'mentor') => {
    knowledgeArticlesCreatedTotal.inc({ category, author_type: authorType });
};

export const recordKnowledgeArticleView = (category, articleId) => {
    knowledgeArticleViewsTotal.inc({ category, article_id: articleId });
};

export const recordKnowledgeArticleLike = (category) => {
    knowledgeArticleLikesTotal.inc({ category });
};

export const recordDbQuery = (operation, table, duration, success = true) => {
    const status = success ? 'success' : 'error';
    dbQueryDuration.observe({ operation, table, status }, duration);
};

export const updateDbConnectionPool = (available, used) => {
    dbConnectionPoolGauge.set({ status: 'available' }, available);
    dbConnectionPoolGauge.set({ status: 'used' }, used);
};

export const recordError = (type, severity = 'error', component = 'api') => {
    errorsTotal.inc({ type, severity, component });
};

// =============================================
// 📈 시스템 모니터링
// =============================================

// 메모리 및 CPU 사용량 주기적 업데이트
const updateSystemMetrics = () => {
    const memUsage = process.memoryUsage();
    
    memoryUsageGauge.set({ type: 'rss' }, memUsage.rss);
    memoryUsageGauge.set({ type: 'heapUsed' }, memUsage.heapUsed);
    memoryUsageGauge.set({ type: 'heapTotal' }, memUsage.heapTotal);
    memoryUsageGauge.set({ type: 'external' }, memUsage.external);
    
    // CPU 사용량 (간단한 구현)
    const usage = process.cpuUsage();
    const cpuPercent = (usage.user + usage.system) / 1000000; // 마이크로초를 초로 변환
    cpuUsageGauge.set(cpuPercent);
};

// 10초마다 시스템 메트릭 업데이트
setInterval(updateSystemMetrics, 10000);

// =============================================
// 📊 메트릭 엔드포인트
// =============================================

// Prometheus 메트릭 엔드포인트
export const getMetrics = async (req, res) => {
    try {
        res.set('Content-Type', register.contentType);
        const metrics = await register.metrics();
        res.send(metrics);
    } catch (error) {
        console.error('메트릭 수집 오류:', error);
        recordError('metrics_collection', 'error', 'monitoring');
        res.status(500).send('메트릭 수집 중 오류가 발생했습니다.');
    }
};

// 메트릭 요약 정보 (대시보드용)
export const getMetricsSummary = async (req, res) => {
    try {
        const summary = {
            timestamp: new Date().toISOString(),
            system: {
                uptime: process.uptime(),
                memory: process.memoryUsage(),
                cpu: process.cpuUsage()
            },
            counters: {
                totalRequests: await httpRequestsTotal.get(),
                totalUsers: await userRegistrationsTotal.get(),
                totalMentoringSessions: await mentoringSessionsCompletedTotal.get(),
                totalKnowledgeArticles: await knowledgeArticlesCreatedTotal.get()
            },
            gauges: {
                activeUsers: await activeUsersGauge.get(),
                ongoingSessions: await ongoingMentoringSessions.get(),
                requestsInProgress: await httpRequestsInProgress.get()
            }
        };
        
        res.json({
            success: true,
            data: summary
        });
    } catch (error) {
        console.error('메트릭 요약 오류:', error);
        recordError('metrics_summary', 'error', 'monitoring');
        res.status(500).json({
            success: false,
            message: '메트릭 요약 정보를 가져오는 중 오류가 발생했습니다.'
        });
    }
};

// 헬스체크 엔드포인트 (모니터링용)
export const healthCheck = (req, res) => {
    const healthData = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        environment: process.env.NODE_ENV || 'development',
        version: process.env.npm_package_version || '1.0.0'
    };
    
    res.json(healthData);
};

// 성능 데이터 수집 미들웨어
export const performanceMiddleware = (req, res, next) => {
    req.startTime = process.hrtime.bigint();
    
    const originalJson = res.json;
    res.json = function(data) {
        const endTime = process.hrtime.bigint();
        const duration = Number(endTime - req.startTime) / 1000000; // 나노초를 밀리초로
        
        // 성능 헤더 추가
        res.set('X-Response-Time', `${duration}ms`);
        res.set('X-Timestamp', new Date().toISOString());
        
        return originalJson.call(this, data);
    };
    
    next();
};

export default {
    register,
    httpMetricsMiddleware,
    recordUserRegistration,
    recordLoginAttempt,
    updateActiveUsers,
    recordMentoringRequest,
    recordMentoringSessionCompleted,
    updateOngoingMentoringSessions,
    recordKnowledgeArticleCreated,
    recordKnowledgeArticleView,
    recordKnowledgeArticleLike,
    recordDbQuery,
    updateDbConnectionPool,
    recordError,
    getMetrics,
    getMetricsSummary,
    healthCheck,
    performanceMiddleware
};
