// 🚀 Senior Knowledge Sharing Platform - API Server
// Express.js 기반 백엔드 API 서버

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ES 모듈에서 __dirname 구현
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 환경 변수 로드
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// =============================================
// 🔧 미들웨어 설정
// =============================================

// 보안 헤더
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:", "https:"],
            fontSrc: ["'self'", "https://cdnjs.cloudflare.com"],
        },
    },
}));

// CORS 설정
const corsOptions = {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:8080'],
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// 압축
app.use(compression());

// 요청 제한
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15분
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // 최대 100 요청
    message: {
        error: 'Too many requests, please try again later.',
        retryAfter: 15 * 60 // 15분 후 재시도
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api', limiter);

// 로깅
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// JSON 파싱
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 정적 파일 서빙
app.use(express.static(path.join(__dirname, '../website')));

// =============================================
// 📊 API 라우트
// =============================================

// 건강 상태 체크
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development'
    });
});

// 🧑‍🏫 멘토 관련 API
app.get('/api/mentors', (req, res) => {
    // TODO: 데이터베이스에서 멘토 목록 조회
    res.json({
        success: true,
        data: [
            {
                id: 'M001',
                name: '김기계',
                field: 'manufacturing',
                experience: '40년 경력',
                specialties: ['정밀가공', '품질관리', '설비관리'],
                rating: 4.9,
                verified: true
            },
            {
                id: 'M002',
                name: '이건축',
                field: 'construction',
                experience: '35년 경력',
                specialties: ['아파트 설계', '인허가', '구조 설계'],
                rating: 4.8,
                verified: true
            }
        ],
        total: 150,
        page: 1,
        limit: 10
    });
});

app.post('/api/mentors', (req, res) => {
    // TODO: 멘토 등록 처리
    const { name, field, experience, specialties, email, phone } = req.body;
    
    // 유효성 검사
    if (!name || !field || !experience || !email) {
        return res.status(400).json({
            success: false,
            message: '필수 정보가 누락되었습니다.',
            required: ['name', 'field', 'experience', 'email']
        });
    }
    
    // TODO: 데이터베이스에 저장
    res.status(201).json({
        success: true,
        message: '멘토 등록 신청이 완료되었습니다. 검토 후 연락드리겠습니다.',
        data: {
            id: 'M' + Date.now(),
            name,
            field,
            status: 'pending'
        }
    });
});

// 🎓 멘티 관련 API
app.post('/api/mentees', (req, res) => {
    // TODO: 멘티 등록 처리
    const { name, field, status, goals, email, phone } = req.body;
    
    if (!name || !field || !goals || !email) {
        return res.status(400).json({
            success: false,
            message: '필수 정보가 누락되었습니다.',
            required: ['name', 'field', 'goals', 'email']
        });
    }
    
    res.status(201).json({
        success: true,
        message: '멘티 등록이 완료되었습니다. 매칭된 멘토를 찾으면 연락드리겠습니다.',
        data: {
            id: 'T' + Date.now(),
            name,
            field,
            status: 'active'
        }
    });
});

// 💬 멘토링 신청 API
app.post('/api/mentoring/requests', (req, res) => {
    // TODO: 멘토링 신청 처리
    const { mentorId, mentorName, name, phone, email, field, message } = req.body;
    
    if (!mentorId || !name || !email || !message) {
        return res.status(400).json({
            success: false,
            message: '필수 정보가 누락되었습니다.',
            required: ['mentorId', 'name', 'email', 'message']
        });
    }
    
    res.status(201).json({
        success: true,
        message: `${mentorName} 멘토님께 멘토링 신청이 완료되었습니다!`,
        data: {
            requestId: 'R' + Date.now(),
            mentorId,
            status: 'pending'
        }
    });
});

// 📚 지식 저장소 API
app.get('/api/knowledge', (req, res) => {
    // TODO: 지식 저장소 데이터 조회
    res.json({
        success: true,
        data: [
            {
                id: 'K001',
                title: '정밀가공 불량률 50% 감소 사례',
                category: 'manufacturing',
                author: '김철수 마이스터',
                views: 156,
                date: '2024-06-10',
                tags: ['정밀가공', '품질관리', '불량률개선']
            }
        ]
    });
});

// 👥 사용자 관리 API
app.post('/api/users/register', (req, res) => {
    // TODO: 사용자 등록 및 이메일 인증
    const { name, email, password, phone, interest } = req.body;
    
    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: '필수 정보가 누락되었습니다.',
            required: ['name', 'email', 'password']
        });
    }
    
    // TODO: 비밀번호 해싱, 이메일 중복 체크, 인증 이메일 발송
    res.status(201).json({
        success: true,
        message: '회원가입이 완료되었습니다. 이메일을 확인해주세요.',
        data: {
            userId: 'U' + Date.now(),
            email,
            emailVerified: false
        }
    });
});

app.post('/api/users/login', (req, res) => {
    // TODO: 로그인 처리 및 JWT 토큰 발급
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: '이메일과 비밀번호를 입력해주세요.'
        });
    }
    
    // TODO: 비밀번호 검증, JWT 토큰 생성
    res.json({
        success: true,
        message: '로그인에 성공했습니다.',
        data: {
            token: 'jwt_token_here',
            user: {
                id: 'U123',
                name: '홍길동',
                email,
                emailVerified: true
            }
        }
    });
});

// 📊 통계 API
app.get('/api/stats', (req, res) => {
    // TODO: 실시간 통계 데이터
    res.json({
        success: true,
        data: {
            totalMentors: 150,
            totalMentees: 280,
            activeMentoring: 65,
            knowledgeArticles: 230,
            lastUpdated: new Date().toISOString()
        }
    });
});

// =============================================
// 🔧 관리자 API
// =============================================

// 관리자 인증 미들웨어 (간단한 버전)
const adminAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_TOKEN}`) {
        return res.status(401).json({
            success: false,
            message: '관리자 권한이 필요합니다.'
        });
    }
    next();
};

app.get('/api/admin/dashboard', adminAuth, (req, res) => {
    // TODO: 관리자 대시보드 데이터
    res.json({
        success: true,
        data: {
            pendingMentors: 12,
            pendingMentees: 8,
            pendingRequests: 25,
            todayRegistrations: 5,
            systemHealth: 'good'
        }
    });
});

// =============================================
// 🌐 프론트엔드 라우트 (SPA 지원)
// =============================================

// 모든 비API 요청을 index.html로 리다이렉트 (SPA 라우팅)
app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, '../website/index.html'));
    } else {
        res.status(404).json({
            success: false,
            message: 'API endpoint not found',
            path: req.path
        });
    }
});

// =============================================
// 🔧 에러 핸들링
// =============================================

// 글로벌 에러 핸들러
app.use((err, req, res, next) => {
    console.error('Error:', err);
    
    res.status(err.status || 500).json({
        success: false,
        message: process.env.NODE_ENV === 'production' 
            ? '서버 오류가 발생했습니다.' 
            : err.message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
});

// 404 핸들러
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.originalUrl
    });
});

// =============================================
// 🚀 서버 시작
// =============================================

const server = app.listen(PORT, () => {
    console.log(`
🚀 Senior Knowledge Sharing API Server Started!

🌐 Server URL: http://localhost:${PORT}
📊 Health Check: http://localhost:${PORT}/api/health
📋 API Docs: http://localhost:${PORT}/api
🔧 Environment: ${process.env.NODE_ENV || 'development'}

=== Available Endpoints ===
GET  /api/health          - 서버 상태 확인
GET  /api/mentors         - 멘토 목록 조회
POST /api/mentors         - 멘토 등록
POST /api/mentees         - 멘티 등록
POST /api/mentoring/requests - 멘토링 신청
GET  /api/knowledge       - 지식 저장소
POST /api/users/register  - 회원가입
POST /api/users/login     - 로그인
GET  /api/stats           - 통계 정보
GET  /api/admin/dashboard - 관리자 대시보드

🔗 GitHub: https://github.com/awbaw24/senior-knowledge-sharing
📧 Contact: comensee24@gmail.com
    `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

export default app;
