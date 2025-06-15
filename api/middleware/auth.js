// 🔐 Senior Knowledge Sharing Platform - JWT 인증 미들웨어
// JSON Web Token 기반 사용자 인증 시스템

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { promisify } from 'util';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh-token-secret';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

// JWT 토큰 생성
export const generateTokens = async (user) => {
    const payload = {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role || 'user'
    };

    const accessToken = jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
        issuer: 'knowledge-sharing-platform',
        audience: 'knowledge-sharing-users'
    });

    const refreshToken = jwt.sign(
        { userId: user.id, tokenType: 'refresh' }, 
        REFRESH_TOKEN_SECRET, 
        { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
    );

    return {
        accessToken,
        refreshToken,
        expiresIn: JWT_EXPIRES_IN
    };
};

// JWT 토큰 검증 미들웨어
export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.startsWith('Bearer ') 
            ? authHeader.slice(7) 
            : null;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: '인증 토큰이 필요합니다.',
                code: 'TOKEN_REQUIRED'
            });
        }

        // 토큰 검증
        const decoded = jwt.verify(token, JWT_SECRET, {
            issuer: 'knowledge-sharing-platform',
            audience: 'knowledge-sharing-users'
        });

        // 토큰 만료 시간 체크 (추가 보안)
        const currentTimestamp = Math.floor(Date.now() / 1000);
        if (decoded.exp < currentTimestamp) {
            return res.status(401).json({
                success: false,
                message: '토큰이 만료되었습니다.',
                code: 'TOKEN_EXPIRED'
            });
        }

        // 사용자 정보를 req.user에 저장
        req.user = decoded;
        
        // 로그 기록 (메트릭용)
        req.authTimestamp = Date.now();
        
        next();
    } catch (error) {
        console.error('JWT 인증 오류:', error);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: '토큰이 만료되었습니다.',
                code: 'TOKEN_EXPIRED'
            });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: '유효하지 않은 토큰입니다.',
                code: 'INVALID_TOKEN'
            });
        } else {
            return res.status(500).json({
                success: false,
                message: '인증 처리 중 오류가 발생했습니다.',
                code: 'AUTH_ERROR'
            });
        }
    }
};

// 선택적 인증 미들웨어 (토큰이 있으면 검증, 없어도 통과)
export const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.startsWith('Bearer ') 
            ? authHeader.slice(7) 
            : null;

        if (token) {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;
        }
        
        next();
    } catch (error) {
        // 토큰이 유효하지 않아도 계속 진행
        next();
    }
};

// 관리자 권한 확인 미들웨어
export const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: '인증이 필요합니다.',
            code: 'AUTH_REQUIRED'
        });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: '관리자 권한이 필요합니다.',
            code: 'ADMIN_REQUIRED'
        });
    }

    next();
};

// 멘토 권한 확인 미들웨어
export const requireMentor = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: '인증이 필요합니다.',
            code: 'AUTH_REQUIRED'
        });
    }

    if (!['mentor', 'admin'].includes(req.user.role)) {
        return res.status(403).json({
            success: false,
            message: '멘토 권한이 필요합니다.',
            code: 'MENTOR_REQUIRED'
        });
    }

    next();
};

// 비밀번호 해싱
export const hashPassword = async (password) => {
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    return await bcrypt.hash(password, saltRounds);
};

// 비밀번호 검증
export const verifyPassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

// 이메일 인증 토큰 생성
export const generateEmailVerificationToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

// 비밀번호 재설정 토큰 생성
export const generatePasswordResetToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

// 리프레시 토큰으로 새 액세스 토큰 생성
export const refreshAccessToken = async (refreshToken) => {
    try {
        const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
        
        if (decoded.tokenType !== 'refresh') {
            throw new Error('Invalid refresh token type');
        }

        // TODO: 데이터베이스에서 사용자 정보 조회
        const user = {
            id: decoded.userId,
            // ... 실제로는 DB에서 조회
        };

        const { accessToken } = await generateTokens(user);
        
        return {
            accessToken,
            expiresIn: JWT_EXPIRES_IN
        };
    } catch (error) {
        throw new Error('Invalid refresh token');
    }
};

// Rate Limiting 데이터 저장을 위한 간단한 메모리 스토어
class MemoryStore {
    constructor() {
        this.store = new Map();
        this.resetTime = new Map();
    }

    incr(key, windowMs) {
        const now = Date.now();
        const resetTime = this.resetTime.get(key);
        
        if (!resetTime || now > resetTime) {
            this.store.set(key, 1);
            this.resetTime.set(key, now + windowMs);
            return 1;
        }
        
        const current = this.store.get(key) || 0;
        this.store.set(key, current + 1);
        return current + 1;
    }

    get(key) {
        return this.store.get(key) || 0;
    }

    reset(key) {
        this.store.delete(key);
        this.resetTime.delete(key);
    }
}

const rateLimitStore = new MemoryStore();

// 커스텀 Rate Limiting 미들웨어
export const createRateLimit = (options = {}) => {
    const {
        windowMs = 15 * 60 * 1000, // 15분
        max = 100, // 최대 요청 수
        message = 'Too many requests, please try again later.',
        skipSuccessfulRequests = false,
        skipFailedRequests = false
    } = options;

    return (req, res, next) => {
        const key = req.ip || req.connection.remoteAddress;
        
        const hits = rateLimitStore.incr(key, windowMs);
        
        if (hits > max) {
            return res.status(429).json({
                success: false,
                message,
                retryAfter: Math.ceil(windowMs / 1000)
            });
        }

        // 헤더에 남은 요청 수 표시
        res.set({
            'X-RateLimit-Limit': max,
            'X-RateLimit-Remaining': Math.max(0, max - hits),
            'X-RateLimit-Reset': new Date(Date.now() + windowMs)
        });

        next();
    };
};

// API 키 기반 인증 (서버 간 통신용)
export const authenticateApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    const validApiKeys = process.env.API_KEYS ? process.env.API_KEYS.split(',') : [];

    if (!apiKey || !validApiKeys.includes(apiKey)) {
        return res.status(401).json({
            success: false,
            message: '유효하지 않은 API 키입니다.',
            code: 'INVALID_API_KEY'
        });
    }

    next();
};

// 사용자 세션 상태 확인
export const checkUserStatus = async (req, res, next) => {
    if (!req.user) {
        return next();
    }

    // TODO: 실제로는 데이터베이스에서 사용자 상태 확인
    // 예: 계정 정지, 이메일 미인증 등
    
    const userStatus = 'active'; // DB에서 조회한 상태
    
    if (userStatus === 'suspended') {
        return res.status(403).json({
            success: false,
            message: '계정이 정지되었습니다.',
            code: 'ACCOUNT_SUSPENDED'
        });
    }

    if (userStatus === 'email_unverified') {
        return res.status(403).json({
            success: false,
            message: '이메일 인증이 필요합니다.',
            code: 'EMAIL_VERIFICATION_REQUIRED'
        });
    }

    next();
};

// 토큰 블랙리스트 체크 (로그아웃된 토큰)
const blacklistedTokens = new Set();

export const checkTokenBlacklist = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') 
        ? authHeader.slice(7) 
        : null;

    if (token && blacklistedTokens.has(token)) {
        return res.status(401).json({
            success: false,
            message: '로그아웃된 토큰입니다.',
            code: 'TOKEN_BLACKLISTED'
        });
    }

    next();
};

// 토큰 블랙리스트에 추가 (로그아웃 시 사용)
export const blacklistToken = (token) => {
    blacklistedTokens.add(token);
    
    // 메모리 사용량 관리를 위해 만료된 토큰들 주기적으로 정리
    try {
        const decoded = jwt.decode(token);
        if (decoded && decoded.exp) {
            const expTime = decoded.exp * 1000;
            setTimeout(() => {
                blacklistedTokens.delete(token);
            }, expTime - Date.now());
        }
    } catch (error) {
        // 토큰 파싱 실패시 1시간 후 삭제
        setTimeout(() => {
            blacklistedTokens.delete(token);
        }, 60 * 60 * 1000);
    }
};

export default {
    generateTokens,
    authenticateToken,
    optionalAuth,
    requireAdmin,
    requireMentor,
    hashPassword,
    verifyPassword,
    generateEmailVerificationToken,
    generatePasswordResetToken,
    refreshAccessToken,
    createRateLimit,
    authenticateApiKey,
    checkUserStatus,
    checkTokenBlacklist,
    blacklistToken
};
