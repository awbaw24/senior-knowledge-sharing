-- 🗄️ Senior Knowledge Sharing Platform - 데이터베이스 초기화
-- PostgreSQL 스키마 및 초기 데이터 설정

-- =============================================
-- 🔧 기본 설정
-- =============================================

-- 확장 기능 활성화
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 타임존 설정
SET timezone = 'Asia/Seoul';

-- =============================================
-- 👥 사용자 관리 테이블
-- =============================================

-- 사용자 기본 정보
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    profile_image TEXT,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    email_verified_at TIMESTAMP,
    reset_password_token VARCHAR(255),
    reset_password_expires TIMESTAMP,
    last_login_at TIMESTAMP,
    login_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active', -- active, suspended, deleted
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 사용자 프로필 추가 정보
CREATE TABLE user_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    birth_year INTEGER,
    gender VARCHAR(10),
    location VARCHAR(100),
    bio TEXT,
    interests TEXT[], -- 관심 분야 배열
    education VARCHAR(200),
    career_summary TEXT,
    social_links JSONB, -- {github, linkedin, website, etc}
    preferences JSONB, -- 알림 설정 등
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 🧑‍🏫 멘토 관리 테이블
-- =============================================

-- 멘토 기본 정보
CREATE TABLE mentors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    field VARCHAR(50) NOT NULL, -- construction, manufacturing, agriculture, services
    experience_years INTEGER NOT NULL,
    specialties TEXT[] NOT NULL,
    career_highlights TEXT,
    introduction TEXT,
    hourly_rate DECIMAL(10,2),
    available_hours INTEGER, -- 주당 가능 시간
    rating DECIMAL(3,2) DEFAULT 0.0,
    total_reviews INTEGER DEFAULT 0,
    total_mentoring_hours INTEGER DEFAULT 0,
    verification_status VARCHAR(20) DEFAULT 'pending', -- pending, verified, rejected
    verification_documents TEXT[], -- 증빙 서류 URL
    verified_at TIMESTAMP,
    verified_by UUID REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'active', -- active, inactive, suspended
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 멘토 가능 시간대
CREATE TABLE mentor_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mentor_id UUID REFERENCES mentors(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL, -- 0=일요일, 1=월요일, ...
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 🎓 멘티 관리 테이블
-- =============================================

CREATE TABLE mentees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    interested_fields TEXT[] NOT NULL,
    current_status VARCHAR(50), -- student, newcomer, career_change, entrepreneur
    learning_goals TEXT NOT NULL,
    preferred_mentoring_type VARCHAR(50), -- online, offline, hybrid
    budget_range VARCHAR(50),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 💬 멘토링 관계 및 신청
-- =============================================

-- 멘토링 신청
CREATE TABLE mentoring_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mentor_id UUID REFERENCES mentors(id) ON DELETE CASCADE,
    mentee_id UUID REFERENCES mentees(id) ON DELETE CASCADE,
    requested_field VARCHAR(100),
    message TEXT NOT NULL,
    preferred_schedule JSONB, -- 선호 일정 정보
    status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, rejected, cancelled
    response_message TEXT,
    responded_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 멘토링 세션
CREATE TABLE mentoring_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mentor_id UUID REFERENCES mentors(id) ON DELETE CASCADE,
    mentee_id UUID REFERENCES mentees(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    scheduled_at TIMESTAMP NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    type VARCHAR(20) DEFAULT 'online', -- online, offline
    location VARCHAR(200), -- 오프라인인 경우 장소
    meeting_link TEXT, -- 온라인인 경우 회의 링크
    status VARCHAR(20) DEFAULT 'scheduled', -- scheduled, completed, cancelled, no_show
    mentor_notes TEXT,
    mentee_feedback TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 📚 지식 저장소
-- =============================================

-- 지식 아티클
CREATE TABLE knowledge_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(300) NOT NULL,
    content TEXT NOT NULL,
    summary TEXT,
    category VARCHAR(50) NOT NULL,
    tags TEXT[],
    difficulty_level VARCHAR(20), -- beginner, intermediate, advanced
    estimated_read_time INTEGER, -- 분 단위
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'published', -- draft, published, archived
    featured BOOLEAN DEFAULT FALSE,
    seo_meta JSONB, -- title, description, keywords
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 지식 아티클 첨부파일
CREATE TABLE knowledge_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID REFERENCES knowledge_articles(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_type VARCHAR(50),
    file_size INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 사용자 아티클 상호작용
CREATE TABLE article_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    article_id UUID REFERENCES knowledge_articles(id) ON DELETE CASCADE,
    interaction_type VARCHAR(20) NOT NULL, -- view, like, bookmark, share
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, article_id, interaction_type)
);

-- =============================================
-- 🏘️ 커뮤니티 및 지역 활성화
-- =============================================

-- 지역 커뮤니티
CREATE TABLE communities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    region VARCHAR(100) NOT NULL,
    focus_area VARCHAR(100), -- agriculture, manufacturing, tourism, etc
    member_count INTEGER DEFAULT 0,
    project_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 커뮤니티 멤버십
CREATE TABLE community_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member', -- admin, moderator, member
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(community_id, user_id)
);

-- 커뮤니티 프로젝트
CREATE TABLE community_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    project_type VARCHAR(50), -- agricultural, tourism, manufacturing, etc
    start_date DATE,
    end_date DATE,
    budget DECIMAL(15,2),
    funding_source VARCHAR(100),
    participants_count INTEGER DEFAULT 0,
    success_metrics JSONB,
    status VARCHAR(20) DEFAULT 'planning', -- planning, active, completed, cancelled
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 📊 통계 및 로그
-- =============================================

-- 플랫폼 통계 (일별)
CREATE TABLE daily_stats (
    date DATE PRIMARY KEY,
    new_users INTEGER DEFAULT 0,
    new_mentors INTEGER DEFAULT 0,
    new_mentees INTEGER DEFAULT 0,
    completed_sessions INTEGER DEFAULT 0,
    published_articles INTEGER DEFAULT 0,
    total_active_users INTEGER DEFAULT 0,
    total_page_views INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 사용자 활동 로그
CREATE TABLE user_activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 🔍 인덱스 생성
-- =============================================

-- 성능 최적화를 위한 인덱스
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_mentors_field ON mentors(field);
CREATE INDEX idx_mentors_verification_status ON mentors(verification_status);
CREATE INDEX idx_knowledge_articles_category ON knowledge_articles(category);
CREATE INDEX idx_knowledge_articles_tags ON knowledge_articles USING GIN(tags);
CREATE INDEX idx_article_interactions_user_article ON article_interactions(user_id, article_id);
CREATE INDEX idx_mentoring_sessions_mentor_date ON mentoring_sessions(mentor_id, scheduled_at);
CREATE INDEX idx_communities_region ON communities(region);
CREATE INDEX idx_user_activity_logs_created_at ON user_activity_logs(created_at);

-- =============================================
-- 🔧 트리거 함수
-- =============================================

-- 업데이트 시간 자동 갱신 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 적용
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mentors_updated_at BEFORE UPDATE ON mentors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 📊 초기 데이터 삽입
-- =============================================

-- 관리자 계정 생성
INSERT INTO users (email, password_hash, name, email_verified, status) VALUES 
('admin@knowledge-sharing.com', crypt('admin123!@#', gen_salt('bf')), '시스템 관리자', true, 'active');

-- 샘플 멘토 데이터
INSERT INTO users (email, password_hash, name, phone, email_verified, status) VALUES 
('mentor1@example.com', crypt('password123', gen_salt('bf')), '김기계', '010-1234-5678', true, 'active'),
('mentor2@example.com', crypt('password123', gen_salt('bf')), '이건축', '010-2345-6789', true, 'active'),
('mentor3@example.com', crypt('password123', gen_salt('bf')), '박농업', '010-3456-7890', true, 'active');

-- 샘플 멘토 등록
INSERT INTO mentors (user_id, field, experience_years, specialties, introduction, verification_status, status)
SELECT 
    u.id,
    CASE 
        WHEN u.name = '김기계' THEN 'manufacturing'
        WHEN u.name = '이건축' THEN 'construction'
        WHEN u.name = '박농업' THEN 'agriculture'
    END,
    CASE 
        WHEN u.name = '김기계' THEN 40
        WHEN u.name = '이건축' THEN 35
        WHEN u.name = '박농업' THEN 25
    END,
    CASE 
        WHEN u.name = '김기계' THEN ARRAY['정밀가공', '품질관리', '설비관리']
        WHEN u.name = '이건축' THEN ARRAY['아파트 설계', '인허가', '구조 설계']
        WHEN u.name = '박농업' THEN ARRAY['스마트팜', '친환경농법', '직거래']
    END,
    CASE 
        WHEN u.name = '김기계' THEN '40년간 제조업 현장에서 쌓은 정밀가공 전문 지식을 공유합니다.'
        WHEN u.name = '이건축' THEN '35년 건축 설계 경험으로 실무 중심의 멘토링을 제공합니다.'
        WHEN u.name = '박농업' THEN '25년 농업 경험을 바탕으로 스마트팜 기술을 가르쳐드립니다.'
    END,
    'verified',
    'active'
FROM users u 
WHERE u.name IN ('김기계', '이건축', '박농업');

-- 샘플 커뮤니티 생성
INSERT INTO communities (name, description, region, focus_area, created_by) VALUES 
('경상북도 농어촌 활성화', '안동, 영주, 봉화 지역을 중심으로 한 농업 혁신 프로젝트', '경상북도', 'agriculture', 
 (SELECT id FROM users WHERE email = 'admin@knowledge-sharing.com')),
('울산 제조업 혁신', '자동차, 조선업 은퇴 전문가들의 경험 전수', '울산광역시', 'manufacturing',
 (SELECT id FROM users WHERE email = 'admin@knowledge-sharing.com'));

-- 샘플 지식 아티클
INSERT INTO knowledge_articles (author_id, title, content, summary, category, tags, difficulty_level, estimated_read_time, status) VALUES 
((SELECT id FROM users WHERE name = '김기계'),
 '정밀가공 불량률 50% 감소 사례',
 '40년 경력의 기계가공 전문가가 전수한 품질관리 노하우...',
 '정밀가공 현장에서 불량률을 50% 이상 줄인 실제 사례와 구체적인 방법론',
 'manufacturing',
 ARRAY['정밀가공', '품질관리', '불량률개선'],
 'intermediate',
 15,
 'published');

-- 일별 통계 초기 데이터
INSERT INTO daily_stats (date, new_users, new_mentors, total_active_users) VALUES 
(CURRENT_DATE - INTERVAL '1 day', 5, 2, 150),
(CURRENT_DATE, 3, 1, 153);

-- =============================================
-- 🔧 권한 설정
-- =============================================

-- 읽기 전용 사용자 생성 (모니터링용)
CREATE USER monitoring_user WITH PASSWORD 'monitoring_password_change_me';
GRANT CONNECT ON DATABASE knowledge_sharing TO monitoring_user;
GRANT USAGE ON SCHEMA public TO monitoring_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO monitoring_user;

-- 백업 사용자 생성
CREATE USER backup_user WITH PASSWORD 'backup_password_change_me';
GRANT CONNECT ON DATABASE knowledge_sharing TO backup_user;
GRANT USAGE ON SCHEMA public TO backup_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO backup_user;

-- =============================================
-- 📝 완료 메시지
-- =============================================

-- 초기화 완료 확인
DO $$
BEGIN
    RAISE NOTICE '🎉 데이터베이스 초기화가 완료되었습니다!';
    RAISE NOTICE '👥 총 사용자: %', (SELECT COUNT(*) FROM users);
    RAISE NOTICE '🧑‍🏫 총 멘토: %', (SELECT COUNT(*) FROM mentors);
    RAISE NOTICE '🏘️ 총 커뮤니티: %', (SELECT COUNT(*) FROM communities);
    RAISE NOTICE '📚 총 지식 아티클: %', (SELECT COUNT(*) FROM knowledge_articles);
    RAISE NOTICE '⏰ 초기화 시간: %', CURRENT_TIMESTAMP;
END
$$;
