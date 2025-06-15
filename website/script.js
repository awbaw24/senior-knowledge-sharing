// 메인 JavaScript 파일

// DOM 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// 앱 초기화
function initializeApp() {
    setupNavigation();
    setupTabs();
    setupCategoryCards();
    loadMentors();
    loadKnowledgeBase();
    setupScrollEffects();
}

// 네비게이션 설정
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // 관리자 페이지는 별도 처리
            if (this.getAttribute('href') === 'admin.html') {
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
            }
        });
    });
}

// 탭 기능 설정
function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // 모든 탭 비활성화
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // 선택된 탭 활성화
            this.classList.add('active');
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// 카테고리 카드 클릭 이벤트
function setupCategoryCards() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const field = this.getAttribute('data-field');
            showMentorsByField(field);
        });
    });
}

// 분야별 멘토 표시
function showMentorsByField(field) {
    const mentors = getMentorsByField(field);
    
    const modalContent = `
        <div class="mentor-list">
            <h2>🎯 ${getFieldName(field)} 전문가</h2>
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
                        <button class="btn-contact" onclick="contactMentor('${mentor.id}')">
                            💬 멘토링 신청
                        </button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    showModal(modalContent);
}

// 멘토 데이터 (실제 환경에서는 데이터베이스에서 가져옴)
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
function contactMentor(mentorId) {
    const contactForm = `
        <div class="contact-form">
            <h3>🤝 멘토링 신청</h3>
            <form onsubmit="submitMentoringRequest(event, '${mentorId}')">
                <div class="form-group">
                    <label>이름</label>
                    <input type="text" name="name" required>
                </div>
                <div class="form-group">
                    <label>연락처</label>
                    <input type="tel" name="phone" required>
                </div>
                <div class="form-group">
                    <label>이메일</label>
                    <input type="email" name="email" required>
                </div>
                <div class="form-group">
                    <label>멘토링 희망 분야</label>
                    <input type="text" name="field" placeholder="예: 정밀가공 기법, 품질관리 등" required>
                </div>
                <div class="form-group">
                    <label>자기소개 및 질문사항</label>
                    <textarea name="message" rows="4" required></textarea>
                </div>
                <button type="submit" class="btn-primary">신청하기</button>
            </form>
        </div>
    `;
    
    showModal(contactForm);
}

// 멘토링 신청 처리
function submitMentoringRequest(event, mentorId) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const requestData = {
        mentorId,
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
    showSuccessMessage('멘토링 신청이 완료되었습니다! 곧 연락드리겠습니다.');
}

// 모달 관련 함수들
function openModal(type) {
    let content = '';
    
    if (type === 'mentor') {
        content = `
            <div class="signup-form">
                <h2>🧑‍🏫 멘토 등록</h2>
                <p>귀하의 소중한 경험을 후배들과 공유해주세요.</p>
                <form onsubmit="submitMentorRegistration(event)">
                    <div class="form-group">
                        <label>이름</label>
                        <input type="text" name="name" required>
                    </div>
                    <div class="form-group">
                        <label>전문 분야</label>
                        <select name="field" required>
                            <option value="">선택해주세요</option>
                            <option value="construction">건축/토목</option>
                            <option value="manufacturing">제조업</option>
                            <option value="agriculture">농업/어업</option>
                            <option value="services">서비스업</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>경력</label>
                        <input type="text" name="experience" placeholder="예: 30년" required>
                    </div>
                    <div class="form-group">
                        <label>전문 분야 상세</label>
                        <input type="text" name="specialties" placeholder="예: 정밀가공, 품질관리" required>
                    </div>
                    <div class="form-group">
                        <label>연락처</label>
                        <input type="tel" name="phone" required>
                    </div>
                    <div class="form-group">
                        <label>이메일</label>
                        <input type="email" name="email" required>
                    </div>
                    <button type="submit" class="btn-primary">멘토 등록하기</button>
                </form>
            </div>
        `;
    } else if (type === 'mentee') {
        content = `
            <div class="signup-form">
                <h2>🎓 멘티 등록</h2>
                <p>전문가들의 소중한 경험을 배워보세요.</p>
                <form onsubmit="submitMenteeRegistration(event)">
                    <div class="form-group">
                        <label>이름</label>
                        <input type="text" name="name" required>
                    </div>
                    <div class="form-group">
                        <label>관심 분야</label>
                        <select name="field" required>
                            <option value="">선택해주세요</option>
                            <option value="construction">건축/토목</option>
                            <option value="manufacturing">제조업</option>
                            <option value="agriculture">농업/어업</option>
                            <option value="services">서비스업</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>현재 상황</label>
                        <select name="status" required>
                            <option value="">선택해주세요</option>
                            <option value="student">학생</option>
                            <option value="newcomer">신입사원</option>
                            <option value="career_change">전직 희망</option>
                            <option value="entrepreneur">창업 준비</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>연락처</label>
                        <input type="tel" name="phone" required>
                    </div>
                    <div class="form-group">
                        <label>이메일</label>
                        <input type="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label>학습 목표</label>
                        <textarea name="goals" rows="3" placeholder="어떤 것을 배우고 싶으신가요?" required></textarea>
                    </div>
                    <button type="submit" class="btn-primary">멘티 등록하기</button>
                </form>
            </div>
        `;
    }
    
    showModal(content);
}

function showModal(content) {
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = content;
    modal.style.display = 'block';
    
    // 폼 스타일 적용
    const style = document.createElement('style');
    style.textContent = `
        .signup-form, .contact-form {
            max-width: 400px;
            margin: 0 auto;
        }
        .form-group {
            margin-bottom: 1rem;
        }
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: bold;
        }
        .form-group input, .form-group select, .form-group textarea {
            width: 100%;
            padding: 0.75rem;
            border: 2px solid #ddd;
            border-radius: 8px;
            font-size: 1rem;
        }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
            outline: none;
            border-color: #667eea;
        }
        .mentor-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
            margin-top: 2rem;
        }
        .mentor-card {
            background: #f8f9fa;
            padding: 1.5rem;
            border-radius: 10px;
            text-align: center;
        }
        .mentor-avatar i {
            font-size: 4rem;
            color: #667eea;
            margin-bottom: 1rem;
        }
        .mentor-title {
            color: #666;
            margin-bottom: 0.5rem;
        }
        .mentor-experience {
            color: #999;
            font-size: 0.9rem;
            margin-bottom: 1rem;
        }
        .mentor-specialties {
            margin-bottom: 1rem;
        }
        .specialty {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 0.3rem 0.8rem;
            border-radius: 15px;
            font-size: 0.8rem;
            margin: 0.2rem;
        }
        .btn-contact {
            background: #28a745;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 25px;
            cursor: pointer;
            transition: background 0.3s ease;
        }
        .btn-contact:hover {
            background: #218838;
        }
    `;
    document.head.appendChild(style);
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

// 외부 클릭 시 모달 닫기
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        closeModal();
    }
}

// 등록 처리 함수들
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
        timestamp: new Date().toISOString()
    };
    
    // 로컬 스토리지에 저장 (데모용)
    const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
    registrations.push(mentorData);
    localStorage.setItem('registrations', JSON.stringify(registrations));
    
    closeModal();
    showSuccessMessage('멘토 등록이 완료되었습니다! 검토 후 연락드리겠습니다.');
}

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
    showSuccessMessage('멘티 등록이 완료되었습니다! 매칭된 멘토를 찾으면 연락드리겠습니다.');
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
    `;
    successDiv.textContent = message;
    
    // 애니메이션 키프레임 추가
    const style = document.createElement('style');
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
    
    document.body.appendChild(successDiv);
    
    // 3초 후 제거
    setTimeout(() => {
        successDiv.remove();
        style.remove();
    }, 3000);
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
}

// 멘토 데이터 로드 (실제 환경에서는 API 호출)
function loadMentors() {
    // 데모용 데이터는 이미 getMentorsByField에서 정의됨
    console.log('멘토 데이터 로드 완료');
}

// 지식 저장소 로드
function loadKnowledgeBase() {
    // 실제 환경에서는 서버에서 데이터를 가져와서 동적으로 생성
    console.log('지식 저장소 로드 완료');
}