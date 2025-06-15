// 메인 JavaScript 파일

// DOM 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// 앱 초기화
function initializeApp() {
    setupNavigation();
    setupScrollEffects();
    loadInitialData();
    setupEventListeners();
}

// 네비게이션 설정
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // 외부 링크는 별도 처리
            if (this.getAttribute('href').includes('.html')) {
                return;
            }
            
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // 모바일 메뉴 닫기
                closeMobileMenu();
            }
        });
    });
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 모바일 메뉴 외부 클릭 시 닫기
    document.addEventListener('click', function(e) {
        const mobileMenu = document.getElementById('mobileMenu');
        const menuBtn = document.querySelector('.mobile-menu-btn');
        
        if (mobileMenu && mobileMenu.style.display === 'block') {
            if (!mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
                closeMobileMenu();
            }
        }
    });
}

// 모바일 메뉴 토글
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu.style.display === 'block') {
        closeMobileMenu();
    } else {
        mobileMenu.style.display = 'block';
        mobileMenu.style.animation = 'slideIn 0.3s ease';
    }
}

// 모바일 메뉴 닫기
function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.style.display = 'none';
}

// 탭 전환
function switchTab(tabName, button) {
    // 모든 탭 버튼에서 active 클래스 제거
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 모든 탭 콘텐츠 숨기기
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // 선택된 탭 활성화
    button.classList.add('active');
    const targetContent = document.getElementById(tabName);
    if (targetContent) {
        targetContent.classList.add('active');
    }
}

// 분야별 멘토 표시
function showMentorsByField(field) {
    const mentors = getMentorsByField(field);
    
    const modalContent = `
        <div class="mentor-list">
            <h2>🎯 ${getFieldName(field)} 전문가</h2>
            <p style="text-align: center; margin-bottom: 2rem; color: #666;">
                해당 분야의 전문가들과 직접 연결됩니다.
            </p>
            <div class="mentor-grid">
                ${mentors.map(mentor => `
                    <div class="mentor-card">
                        <div class="mentor-avatar">
                            <i class="fas fa-user-circle"></i>
                        </div>
                        <h3>${mentor.name}</h3>
                        <p class="mentor-title">${mentor.title}</p>
                        <p class="mentor-experience">${mentor.experience}</p>
                        <div class="mentor-specialties">
                            ${mentor.specialties.map(s => `<span class="specialty">${s}</span>`).join('')}
                        </div>
                        <button class="btn-contact" onclick="contactMentor('${mentor.id}', '${mentor.name}')">
                            💬 멘토링 신청
                        </button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    showModal(modalContent);
}

// 멘토 데이터
function getMentorsByField(field) {
    const mentorData = {
        construction: [
            {
                id: 'c001',
                name: '이건축',
                title: '건축사 / 전 OO건설 설계부장',
                experience: '35년 경력 • 아파트 설계 전문',
                specialties: ['아파트 설계', '인허가', '구조 설계']
            },
            {
                id: 'c002',
                name: '박토목',
                title: '토목기사 / 전 도로공사 과장',
                experience: '28년 경력 • 도로/교량 시공',
                specialties: ['도로 시공', '교량 설계', '현장 관리']
            },
            {
                id: 'c003',
                name: '김현장',
                title: '건설 현장소장',
                experience: '30년 경력 • 대형 건설현장',
                specialties: ['현장관리', '안전관리', '공정관리']
            }
        ],
        manufacturing: [
            {
                id: 'm001',
                name: '김기계',
                title: '기계가공 마이스터',
                experience: '40년 경력 • 정밀가공 전문',
                specialties: ['정밀가공', '품질관리', '설비관리']
            },
            {
                id: 'm002',
                name: '최용접',
                title: '용접 전문가',
                experience: '32년 경력 • 특수용접 기법',
                specialties: ['특수용접', '용접검사', '안전관리']
            },
            {
                id: 'm003',
                name: '박품질',
                title: '품질관리 전문가',
                experience: '25년 경력 • ISO 인증',
                specialties: ['품질시스템', '검사기법', '개선활동']
            }
        ],
        agriculture: [
            {
                id: 'a001',
                name: '송농부',
                title: '스마트팜 전문가',
                experience: '25년 경력 • 친환경 농법',
                specialties: ['스마트팜', '친환경농법', '직거래']
            },
            {
                id: 'a002',
                name: '정어부',
                title: '양식업 전문가',
                experience: '30년 경력 • 해상 양식',
                specialties: ['해상양식', '수산가공', '유통관리']
            },
            {
                id: 'a003',
                name: '한유기농',
                title: '유기농 인증 농부',
                experience: '20년 경력 • 유기농 전문',
                specialties: ['유기농법', '토양관리', '인증절차']
            }
        ],
        services: [
            {
                id: 's001',
                name: '한서비스',
                title: '고객서비스 전문가',
                experience: '20년 경력 • CS 관리',
                specialties: ['고객관리', '서비스기획', '교육훈련']
            },
            {
                id: 's002',
                name: '윤경영',
                title: '소상공인 컨설턴트',
                experience: '15년 경력 • 창업 지원',
                specialties: ['창업컨설팅', '경영전략', '마케팅']
            },
            {
                id: 's003',
                name: '이카페',
                title: '카페 운영 전문가',
                experience: '12년 경력 • 프랜차이즈',
                specialties: ['카페운영', '메뉴개발', '매장관리']
            }
        ]
    };
    
    return mentorData[field] || [];
}

// 분야명 변환
function getFieldName(field) {
    const fieldNames = {
        construction: '건축/토목',
        manufacturing: '제조업',
        agriculture: '농업/어업',
        services: '서비스업'
    };
    return fieldNames[field] || field;
}

// 멘토 연락
function contactMentor(mentorId, mentorName) {
    const contactForm = `
        <div class="contact-form">
            <h3>🤝 ${mentorName} 멘토님께 멘토링 신청</h3>
            <p style="text-align: center; margin-bottom: 2rem; color: #666;">
                멘토링 신청서를 작성해주세요. 멘토님이 직접 연락드립니다.
            </p>
            <form onsubmit="submitMentoringRequest(event, '${mentorId}', '${mentorName}')">
                <div class="form-group">
                    <label>이름 *</label>
                    <input type="text" name="name" required placeholder="홍길동">
                </div>
                <div class="form-group">
                    <label>연락처 *</label>
                    <input type="tel" name="phone" required placeholder="010-1234-5678">
                </div>
                <div class="form-group">
                    <label>이메일 *</label>
                    <input type="email" name="email" required placeholder="example@email.com">
                </div>
                <div class="form-group">
                    <label>멘토링 희망 분야 *</label>
                    <input type="text" name="field" placeholder="예: 정밀가공 기법, 품질관리, 현장 관리 등" required>
                </div>
                <div class="form-group">
                    <label>자기소개 및 질문사항 *</label>
                    <textarea name="message" rows="4" required placeholder="간단한 자기소개와 멘토님께 궁금한 점을 적어주세요."></textarea>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" required style="width: auto; margin-right: 8px;">
                        개인정보 수집 및 이용에 동의합니다.
                    </label>
                </div>
                <button type="submit" class="btn-primary" style="width: 100%; margin-top: 1rem;">
                    📨 멘토링 신청하기
                </button>
            </form>
        </div>
    `;
    
    showModal(contactForm);
}

// 멘토링 신청 처리
function submitMentoringRequest(event, mentorId, mentorName) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const requestData = {
        mentorId,
        mentorName,
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        field: formData.get('field'),
        message: formData.get('message'),
        timestamp: new Date().toISOString()
    };
    
    // 로컬 스토리지에 저장 (데모용)
    const requests = JSON.parse(localStorage.getItem('mentoringRequests') || '[]');
    requests.push(requestData);
    localStorage.setItem('mentoringRequests', JSON.stringify(requests));
    
    closeModal();
    showSuccessMessage(`${mentorName} 멘토님께 멘토링 신청이 완료되었습니다! 곧 연락드리겠습니다.`);
}

// 모달 열기
function openModal(type) {
    let content = '';
    
    if (type === 'login') {
        content = `
            <div class="login-form">
                <h2>🔑 로그인</h2>
                <p style="text-align: center; margin-bottom: 2rem; color: #666;">
                    은퇴자 지식 공유 플랫폼에 오신 것을 환영합니다.
                </p>
                <form onsubmit="handleLogin(event)">
                    <div class="form-group">
                        <label>이메일</label>
                        <input type="email" name="email" required placeholder="example@email.com">
                    </div>
                    <div class="form-group">
                        <label>비밀번호</label>
                        <input type="password" name="password" required placeholder="비밀번호를 입력하세요">
                    </div>
                    <button type="submit" class="btn-primary" style="width: 100%; margin-top: 1rem;">
                        로그인
                    </button>
                </form>
                <p style="text-align: center; margin-top: 1rem;">
                    계정이 없으신가요? 
                    <a href="#" onclick="openModal('signup')" style="color: #667eea;">회원가입</a>
                </p>
            </div>
        `;
    } else if (type === 'signup') {
        content = `
            <div class="signup-form">
                <h2>📝 회원가입</h2>
                <p style="text-align: center; margin-bottom: 2rem; color: #666;">
                    지식 공유 커뮤니티에 참여해보세요.
                </p>
                <form onsubmit="handleSignup(event)">
                    <div class="form-group">
                        <label>이름 *</label>
                        <input type="text" name="name" required placeholder="홍길동">
                    </div>
                    <div class="form-group">
                        <label>이메일 *</label>
                        <input type="email" name="email" required placeholder="example@email.com">
                    </div>
                    <div class="form-group">
                        <label>비밀번호 *</label>
                        <input type="password" name="password" required placeholder="8자 이상 입력해주세요">
                    </div>
                    <div class="form-group">
                        <label>연락처 *</label>
                        <input type="tel" name="phone" required placeholder="010-1234-5678">
                    </div>
                    <div class="form-group">
                        <label>관심 분야</label>
                        <select name="interest">
                            <option value="">선택해주세요</option>
                            <option value="construction">건축/토목</option>
                            <option value="manufacturing">제조업</option>
                            <option value="agriculture">농업/어업</option>
                            <option value="services">서비스업</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" required style="width: auto; margin-right: 8px;">
                            이용약관 및 개인정보처리방침에 동의합니다.
                        </label>
                    </div>
                    <button type="submit" class="btn-primary" style="width: 100%; margin-top: 1rem;">
                        가입하기
                    </button>
                </form>
                <p style="text-align: center; margin-top: 1rem;">
                    이미 계정이 있으신가요? 
                    <a href="#" onclick="openModal('login')" style="color: #667eea;">로그인</a>
                </p>
            </div>
        `;
    } else if (type === 'mentor') {
        content = `
            <div class="signup-form">
                <h2>🧑‍🏫 멘토 등록</h2>
                <p style="text-align: center; margin-bottom: 2rem; color: #666;">
                    귀하의 소중한 경험을 후배들과 공유해주세요.
                </p>
                <form onsubmit="submitMentorRegistration(event)">
                    <div class="form-group">
                        <label>이름 *</label>
                        <input type="text" name="name" required placeholder="홍길동">
                    </div>
                    <div class="form-group">
                        <label>전문 분야 *</label>
                        <select name="field" required>
                            <option value="">선택해주세요</option>
                            <option value="construction">건축/토목</option>
                            <option value="manufacturing">제조업</option>
                            <option value="agriculture">농업/어업</option>
                            <option value="services">서비스업</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>경력 *</label>
                        <input type="text" name="experience" placeholder="예: 30년" required>
                    </div>
                    <div class="form-group">
                        <label>전문 분야 상세 *</label>
                        <input type="text" name="specialties" placeholder="예: 정밀가공, 품질관리, 현장관리" required>
                    </div>
                    <div class="form-group">
                        <label>연락처 *</label>
                        <input type="tel" name="phone" required placeholder="010-1234-5678">
                    </div>
                    <div class="form-group">
                        <label>이메일 *</label>
                        <input type="email" name="email" required placeholder="example@email.com">
                    </div>
                    <div class="form-group">
                        <label>간단한 자기소개</label>
                        <textarea name="intro" rows="3" placeholder="멘토링 경험이나 전문성을 간단히 소개해주세요."></textarea>
                    </div>
                    <button type="submit" class="btn-primary" style="width: 100%; margin-top: 1rem;">
                        멘토 등록 신청
                    </button>
                </form>
            </div>
        `;
    } else if (type === 'mentee') {
        content = `
            <div class="signup-form">
                <h2>🎓 멘티 등록</h2>
                <p style="text-align: center; margin-bottom: 2rem; color: #666;">
                    전문가들의 소중한 경험을 배워보세요.
                </p>
                <form onsubmit="submitMenteeRegistration(event)">
                    <div class="form-group">
                        <label>이름 *</label>
                        <input type="text" name="name" required placeholder="홍길동">
                    </div>
                    <div class="form-group">
                        <label>관심 분야 *</label>
                        <select name="field" required>
                            <option value="">선택해주세요</option>
                            <option value="construction">건축/토목</option>
                            <option value="manufacturing">제조업</option>
                            <option value="agriculture">농업/어업</option>
                            <option value="services">서비스업</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>현재 상황 *</label>
                        <select name="status" required>
                            <option value="">선택해주세요</option>
                            <option value="student">학생</option>
                            <option value="newcomer">신입사원</option>
                            <option value="career_change">전직 희망</option>
                            <option value="entrepreneur">창업 준비</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>연락처 *</label>
                        <input type="tel" name="phone" required placeholder="010-1234-5678">
                    </div>
                    <div class="form-group">
                        <label>이메일 *</label>
                        <input type="email" name="email" required placeholder="example@email.com">
                    </div>
                    <div class="form-group">
                        <label>학습 목표 *</label>
                        <textarea name="goals" rows="3" placeholder="어떤 것을 배우고 싶으신가요? 구체적으로 적어주세요." required></textarea>
                    </div>
                    <button type="submit" class="btn-primary" style="width: 100%; margin-top: 1rem;">
                        멘티 등록 신청
                    </button>
                </form>
            </div>
        `;
    }
    
    showModal(content);
}

// 로그인 처리
function handleLogin(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const email = formData.get('email');
    
    closeModal();
    showSuccessMessage(`${email}로 로그인되었습니다! (데모 버전)`);
}

// 회원가입 처리
function handleSignup(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const userData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        interest: formData.get('interest'),
        timestamp: new Date().toISOString()
    };
    
    // 로컬 스토리지에 저장 (데모용)
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push(userData);
    localStorage.setItem('users', JSON.stringify(users));
    
    closeModal();
    showSuccessMessage(`${userData.name}님, 회원가입이 완료되었습니다! 이메일을 확인해주세요.`);
}

// 멘토 등록 처리
function submitMentorRegistration(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const mentorData = {
        type: 'mentor',
        name: formData.get('name'),
        field: formData.get('field'),
        experience: formData.get('experience'),
        specialties: formData.get('specialties'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        intro: formData.get('intro'),
        timestamp: new Date().toISOString()
    };
    
    // 로컬 스토리지에 저장 (데모용)
    const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
    registrations.push(mentorData);
    localStorage.setItem('registrations', JSON.stringify(registrations));
    
    closeModal();
    showSuccessMessage(`${mentorData.name}님의 멘토 등록 신청이 완료되었습니다! 검토 후 연락드리겠습니다.`);
}

// 멘티 등록 처리
function submitMenteeRegistration(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const menteeData = {
        type: 'mentee',
        name: formData.get('name'),
        field: formData.get('field'),
        status: formData.get('status'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        goals: formData.get('goals'),
        timestamp: new Date().toISOString()
    };
    
    // 로컬 스토리지에 저장 (데모용)
    const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
    registrations.push(menteeData);
    localStorage.setItem('registrations', JSON.stringify(registrations));
    
    closeModal();
    showSuccessMessage(`${menteeData.name}님의 멘티 등록이 완료되었습니다! 매칭된 멘토를 찾으면 연락드리겠습니다.`);
}

// 지식 상세 보기
function openKnowledgeDetail(type) {
    let content = '';
    
    if (type === 'precision') {
        content = `
            <div class="knowledge-detail">
                <h2>⚙️ 정밀가공 불량률 50% 감소 사례</h2>
                <div class="knowledge-meta" style="margin-bottom: 2rem;">
                    <span><i class="fas fa-user"></i> 김철수 마이스터</span>
                    <span><i class="fas fa-calendar"></i> 2024.06.10</span>
                    <span><i class="fas fa-eye"></i> 156회 조회</span>
                </div>
                <div class="knowledge-content">
                    <h3>🎯 핵심 성과</h3>
                    <ul>
                        <li>불량률: 8.5% → 4.2% (50.6% 감소)</li>
                        <li>재작업률: 12.3% → 5.1% (58.5% 감소)</li>
                        <li>생산성: 85개/일 → 142개/일 (67.1% 향상)</li>
                        <li>원가절감: 월 2,300만원</li>
                    </ul>
                    
                    <h3>🔧 핵심 개선 전략</h3>
                    <p><strong>1. 공구 관리 혁신</strong></p>
                    <p>• 0.001mm 단위 마모 측정 시스템 도입<br>
                    • 적응형 가공 조건 설정<br>
                    • 냉각액 농도 최적화 (8-12%)</p>
                    
                    <p><strong>2. 3단계 품질 체크 시스템</strong></p>
                    <p>• 1차: CMM 자동 측정<br>
                    • 2차: 작업자 자가검사<br>
                    • 3차: 랜덤 샘플링</p>
                    
                    <p style="margin-top: 2rem;">
                        <a href="https://github.com/awbaw24/senior-knowledge-sharing/blob/main/knowledge-base/manufacturing/precision-machining-guide.md" 
                           target="_blank" class="btn-secondary">전체 가이드 보기</a>
                    </p>
                </div>
            </div>
        `;
    } else if (type === 'farming') {
        content = `
            <div class="knowledge-detail">
                <h2>🌱 귀농 첫해 성공 스토리</h2>
                <div class="knowledge-meta" style="margin-bottom: 2rem;">
                    <span><i class="fas fa-user"></i> 박영희 농업인</span>
                    <span><i class="fas fa-calendar"></i> 2024.06.08</span>
                    <span><i class="fas fa-eye"></i> 89회 조회</span>
                </div>
                <div class="knowledge-content">
                    <h3>🏆 실제 성공 사례</h3>
                    <p><strong>이귀농 씨 (경북 안동, 토마토 농장)</strong></p>
                    <ul>
                        <li>투자금: 3,000만원</li>
                        <li>첫해 수확: 8톤 (목표 대비 133%)</li>
                        <li>순이익: 2,100만원 (투자 회수율 70%)</li>
                    </ul>
                    
                    <h3>📅 월별 실행 계획</h3>
                    <p><strong>1-3월: 기초 준비</strong></p>
                    <p>• 토지 선정 및 분석<br>
                    • 물 확보 가능성 체크<br>
                    • 시설 계획 수립</p>
                    
                    <p><strong>4-6월: 파종 및 정착</strong></p>
                    <p>• 초보자 추천 작물 선택<br>
                    • 관수 시스템 구축<br>
                    • 친환경 방제법 적용</p>
                    
                    <p style="margin-top: 2rem;">
                        <a href="https://github.com/awbaw24/senior-knowledge-sharing/blob/main/knowledge-base/agriculture/farming-success-guide.md" 
                           target="_blank" class="btn-secondary">전체 가이드 보기</a>
                    </p>
                </div>
            </div>
        `;
    } else if (type === 'architecture') {
        content = `
            <div class="knowledge-detail">
                <h2>🏗️ 인허가 절차 완전 정복</h2>
                <div class="knowledge-meta" style="margin-bottom: 2rem;">
                    <span><i class="fas fa-user"></i> 이건축 건축사</span>
                    <span><i class="fas fa-calendar"></i> 2024.06.05</span>
                    <span><i class="fas fa-eye"></i> 234회 조회</span>
                </div>
                <div class="knowledge-content">
                    <h3>🎯 핵심 체크포인트</h3>
                    <p><strong>1. 법규 검토 단계</strong></p>
                    <ul>
                        <li>건축법, 주택법 최신 개정사항</li>
                        <li>지역별 건축 조례 확인</li>
                        <li>일조권, 조망권 분석</li>
                        <li>건폐율, 용적률 최대 활용</li>
                    </ul>
                    
                    <p><strong>2. 평면 계획</strong></p>
                    <p>• 현관 → 거실 → 침실 동선 효율성<br>
                    • 남향 배치 우선 (거실, 안방)<br>
                    • 맞통풍 가능한 창호 배치</p>
                    
                    <h3>📊 성공 사례</h3>
                    <p><strong>세종시 OO아파트 (2023년 준공)</strong></p>
                    <p>• 용적률 99.8% 활용<br>
                    • 전 세대 남향 배치 달성<br>
                    • 분양률 100%</p>
                    
                    <p style="margin-top: 2rem;">
                        <a href="https://github.com/awbaw24/senior-knowledge-sharing/blob/main/knowledge-base/construction/apartment-design-guide.md" 
                           target="_blank" class="btn-secondary">전체 가이드 보기</a>
                    </p>
                </div>
            </div>
        `;
    }
    
    showModal(content);
}

// 커뮤니티 상세 보기
function openCommunityDetail(region) {
    let content = '';
    
    if (region === 'gyeongbuk') {
        content = `
            <div class="community-detail">
                <h2>🌾 경상북도 농어촌 활성화</h2>
                <p>안동, 영주, 봉화 지역을 중심으로 한 농업 혁신 프로젝트</p>
                
                <h3>🚀 진행 중인 프로젝트</h3>
                <p><strong>1. 안동 딸기농장 스마트팜 전환</strong><br>
                8개 농가 참여, 생산성 300% 향상 목표</p>
                
                <p><strong>2. 영주 한방약초 체험관광</strong><br>
                한방약초 재배와 관광을 결합한 6차 산업</p>
                
                <h3>👥 참여 현황</h3>
                <ul>
                    <li>등록 멘토: 12명</li>
                    <li>진행 프로젝트: 8개</li>
                    <li>참여 농가: 67곳</li>
                    <li>연간 매출 증가: 평균 45%</li>
                </ul>
                
                <p style="margin-top: 2rem;">
                    <button class="btn-primary" onclick="alert('경상북도 커뮤니티 참여 신청이 접수되었습니다!')">
                        커뮤니티 참여하기
                    </button>
                </p>
            </div>
        `;
    }
    // 다른 지역도 추가 가능
    
    showModal(content);
}

// 모달 표시
function showModal(content) {
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = content;
    modal.style.display = 'block';
    
    // 모달 외부 클릭 시 닫기
    modal.onclick = function(event) {
        if (event.target === modal) {
            closeModal();
        }
    }
}

// 모달 닫기
function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

// 성공 메시지 표시
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: #28a745;
        color: white;
        padding: 1rem 2rem;
        border-radius: 25px;
        z-index: 3000;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        animation: slideDown 0.3s ease;
        max-width: 90%;
        text-align: center;
    `;
    successDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    
    // 애니메이션 키프레임 추가
    if (!document.querySelector('#successAnimation')) {
        const style = document.createElement('style');
        style.id = 'successAnimation';
        style.textContent = `
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(successDiv);
    
    // 4초 후 제거
    setTimeout(() => {
        successDiv.remove();
    }, 4000);
}

// 스크롤 효과 설정
function setupScrollEffects() {
    // 스크롤 시 네비게이션 효과
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(102, 126, 234, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            navbar.style.backdropFilter = 'none';
        }
    });
    
    // 요소가 뷰포트에 들어올 때 애니메이션
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 관찰할 요소들 설정
    document.querySelectorAll('.category-card, .knowledge-item, .story-card, .community-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// 초기 데이터 로드
function loadInitialData() {
    // 실제 환경에서는 서버에서 데이터를 가져옴
    console.log('초기 데이터 로드 완료');
    
    // 통계 업데이트 시뮬레이션
    setTimeout(() => {
        const stats = document.querySelectorAll('.stat-number');
        stats.forEach((stat, index) => {
            const finalValue = stat.textContent;
            stat.textContent = '0';
            
            setTimeout(() => {
                animateNumber(stat, parseInt(finalValue.replace(/\D/g, '')), finalValue);
            }, index * 200);
        });
    }, 1000);
}

// 숫자 애니메이션
function animateNumber(element, target, finalText) {
    let current = 0;
    const increment = target / 30;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
            element.textContent = finalText;
        } else {
            element.textContent = Math.floor(current) + (finalText.includes('+') ? '+' : '');
        }
    }, 50);
}