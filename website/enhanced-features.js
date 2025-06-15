// 향상된 기능들을 위한 JavaScript 파일

// 글로벌 변수
let isDataLoaded = false;
let currentUser = null;
let liveUpdateInterval = null;

// 향상된 기능 초기화
function initializeEnhancedFeatures() {
    console.log('🚀 향상된 기능 초기화 시작...');
    
    // 데이터 로드 확인
    if (typeof MENTORS_DATABASE === 'undefined') {
        console.error('❌ 멘토 데이터베이스가 로드되지 않았습니다.');
        return;
    }
    
    isDataLoaded = true;
    console.log('✅ 데이터베이스 로드 완료');
    
    // 기능 초기화
    loadCategoryCards();
    loadSuccessStories();
    loadCommunityCards();
    setupSearchFunctionality();
    setupLiveFeatures();
    
    console.log('🎉 모든 기능 초기화 완료!');
}

// 실시간 데이터 로드
function loadRealTimeData() {
    const mentorCount = getAllMentors().length;
    const successCount = getSuccessStories().length;
    const fieldCount = Object.keys(MENTORS_DATABASE).length;
    const communityCount = Object.keys(COMMUNITIES).length;
    
    // 통계 업데이트
    animateCountUp('mentorCount', mentorCount);
    animateCountUp('successCount', successCount);
    animateCountUp('fieldCount', fieldCount);
    animateCountUp('communityCount', communityCount);
}

// 숫자 카운트업 애니메이션
function animateCountUp(elementId, targetValue) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    let currentValue = 0;
    const increment = Math.ceil(targetValue / 30);
    
    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= targetValue) {
            currentValue = targetValue;
            clearInterval(timer);
        }
        element.textContent = currentValue;
    }, 50);
}

// 카테고리 카드 로드
function loadCategoryCards() {
    const categoryGrid = document.getElementById('categoryGrid');
    if (!categoryGrid) return;
    
    const categories = [
        {
            field: 'construction',
            icon: '🏗️',
            title: '건축/토목',
            description: '35년 경력 건축사들의 실무 노하우',
            mentorCount: MENTORS_DATABASE.construction.length
        },
        {
            field: 'manufacturing',
            icon: '⚙️',
            title: '제조업',
            description: '정밀가공과 품질관리의 실전 기법',
            mentorCount: MENTORS_DATABASE.manufacturing.length
        },
        {
            field: 'agriculture',
            icon: '🌾',
            title: '농업/어업',
            description: '스마트팜과 친환경 농법의 선구자들',
            mentorCount: MENTORS_DATABASE.agriculture.length
        },
        {
            field: 'services',
            icon: '🏢',
            title: '서비스업',
            description: '고객 서비스와 경영 전략의 베테랑들',
            mentorCount: MENTORS_DATABASE.services.length
        }
    ];
    
    categoryGrid.innerHTML = categories.map(category => `
        <div class="category-card enhanced" data-field="${category.field}" onclick="showMentorsByFieldEnhanced('${category.field}')">
            <div class="category-icon">${category.icon}</div>
            <h3>${category.title}</h3>
            <p>${category.description}</p>
            <div class="mentor-count">
                <strong>${category.mentorCount}명의 전문가</strong>
            </div>
            <div class="category-stats">
                <span>⭐ 평균 4.8점</span>
                <span>📈 활동 중: ${Math.floor(category.mentorCount * 0.7)}명</span>
            </div>
            <button class="btn-view-mentors">멘토 보기</button>
        </div>
    `).join('');
}

// 성공 사례 로드
function loadSuccessStories() {
    const storiesGrid = document.getElementById('storiesGrid');
    if (!storiesGrid) return;
    
    const stories = getSuccessStories();
    
    storiesGrid.innerHTML = stories.map(story => `
        <div class="story-card enhanced" onclick="showStoryDetail('${story.id}')">
            <div class="story-header">
                <div class="story-icon">${story.image}</div>
                <div class="story-field">${getFieldName(story.field)}</div>
            </div>
            <h3>${story.title}</h3>
            <div class="story-participants">
                <strong>멘토:</strong> ${story.mentorName} ↔ <strong>멘티:</strong> ${story.menteeName}
            </div>
            <p class="story-summary">${story.summary}</p>
            <div class="story-results">
                <div class="before-after">
                    <div class="before">
                        <span class="label">Before</span>
                        <span class="value">${story.beforeAfter.before}</span>
                    </div>
                    <div class="arrow">→</div>
                    <div class="after">
                        <span class="label">After</span>
                        <span class="value">${story.beforeAfter.after}</span>
                    </div>
                </div>
            </div>
            <div class="story-period">📅 ${story.period}</div>
        </div>
    `).join('');
}

// 커뮤니티 카드 로드
function loadCommunityCards() {
    const communityGrid = document.getElementById('communityGrid');
    if (!communityGrid) return;
    
    communityGrid.innerHTML = Object.entries(COMMUNITIES).map(([key, community]) => `
        <div class="community-card enhanced" onclick="openCommunityDetailEnhanced('${key}')">
            <div class="community-header">
                <div class="community-icon">${community.icon}</div>
                <div class="community-status ${community.members > 50 ? 'active' : 'growing'}">
                    ${community.members > 50 ? '🔥 활성화' : '🌱 성장중'}
                </div>
            </div>
            <h3>${community.name}</h3>
            <p>${community.description}</p>
            <div class="community-stats">
                <div class="stat">
                    <strong>${community.mentorCount}</strong>
                    <span>명의 멘토</span>
                </div>
                <div class="stat">
                    <strong>${community.projectCount}</strong>
                    <span>개 프로젝트</span>
                </div>
                <div class="stat">
                    <strong>${community.members}</strong>
                    <span>명 참여</span>
                </div>
            </div>
            <div class="community-projects">
                ${community.projects ? community.projects.slice(0, 2).map(project => `
                    <div class="mini-project">
                        <span class="project-title">${project.title}</span>
                        <span class="project-progress">${project.progress}%</span>
                    </div>
                `).join('') : ''}
            </div>
            <button class="btn-join-community">커뮤니티 참여</button>
        </div>
    `).join('');
}

// 향상된 멘토 표시
function showMentorsByFieldEnhanced(field) {
    const mentors = getMentorsByField(field);
    const fieldName = getFieldName(field);
    
    const modalContent = `
        <div class="mentor-list-enhanced">
            <div class="mentor-list-header">
                <h2>🎯 ${fieldName} 전문가 (${mentors.length}명)</h2>
                <div class="field-stats">
                    <span>평균 경력: ${Math.round(mentors.reduce((acc, m) => acc + parseInt(m.experience), 0) / mentors.length)}년</span>
                    <span>평균 평점: 4.8⭐</span>
                    <span>활동 중: ${Math.floor(mentors.length * 0.8)}명</span>
                </div>
            </div>
            
            <div class="mentor-filters">
                <button class="filter-btn active" onclick="filterMentors('all')">전체</button>
                <button class="filter-btn" onclick="filterMentors('available')">상담 가능</button>
                <button class="filter-btn" onclick="filterMentors('top-rated')">평점 높은순</button>
                <button class="filter-btn" onclick="filterMentors('experienced')">경력순</button>
            </div>
            
            <div class="mentor-grid-enhanced">
                ${mentors.map(mentor => `
                    <div class="mentor-card-enhanced" data-mentor-id="${mentor.id}">
                        <div class="mentor-header">
                            <div class="mentor-avatar">${mentor.profileImage}</div>
                            <div class="mentor-status ${mentor.available ? 'available' : 'busy'}">
                                ${mentor.available ? '🟢 상담가능' : '🔴 상담중'}
                            </div>
                        </div>
                        
                        <div class="mentor-info">
                            <h3>${mentor.name}</h3>
                            <p class="mentor-title">${mentor.title}</p>
                            <div class="mentor-experience">
                                <i class="fas fa-briefcase"></i> ${mentor.experience}
                                <span class="mentor-rating">⭐ ${mentor.rating} (${mentor.menteeCount}명)</span>
                            </div>
                            <div class="mentor-location">
                                <i class="fas fa-map-marker-alt"></i> ${mentor.location}
                            </div>
                        </div>
                        
                        <div class="mentor-specialties">
                            ${mentor.specialties.map(s => `<span class="specialty-tag">${s}</span>`).join('')}
                        </div>
                        
                        <div class="mentor-intro">
                            <p>"${mentor.introduction.substring(0, 80)}..."</p>
                        </div>
                        
                        <div class="mentor-actions">
                            <button class="btn-primary btn-sm" onclick="showMentorProfile('${mentor.id}')">
                                👤 프로필 보기
                            </button>
                            <button class="btn-secondary btn-sm" onclick="contactMentorEnhanced('${mentor.id}', '${mentor.name}')">
                                💬 멘토링 신청
                            </button>
                        </div>
                        
                        <div class="mentor-quick-info">
                            <span class="contact-time">📞 ${mentor.contactInfo.preferredTime}</span>
                            <span class="response-time">⚡ 평균 2시간 내 응답</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    showModal(modalContent);
}

// 멘토 프로필 상세 보기
function showMentorProfile(mentorId) {
    const mentor = getMentorById(mentorId);
    if (!mentor) return;
    
    const profileContent = `
        <div class="mentor-profile">
            <div class="profile-header">
                <div class="profile-avatar">${mentor.profileImage}</div>
                <div class="profile-basic">
                    <h2>${mentor.name}</h2>
                    <p class="profile-title">${mentor.title}</p>
                    <div class="profile-stats">
                        <span>⭐ ${mentor.rating}점</span>
                        <span>👥 멘티 ${mentor.menteeCount}명</span>
                        <span>💼 ${mentor.experience}</span>
                        <span class="status-badge ${mentor.available ? 'available' : 'busy'}">
                            ${mentor.available ? '🟢 상담가능' : '🔴 상담중'}
                        </span>
                    </div>
                </div>
            </div>
            
            <div class="profile-content">
                <div class="profile-section">
                    <h3>🎯 전문 분야</h3>
                    <div class="specialties-list">
                        ${mentor.specialties.map(s => `<span class="specialty-item">${s}</span>`).join('')}
                    </div>
                </div>
                
                <div class="profile-section">
                    <h3>📝 소개</h3>
                    <p class="mentor-introduction">${mentor.introduction}</p>
                </div>
                
                <div class="profile-section">
                    <h3>🏆 주요 성과</h3>
                    <ul class="achievements-list">
                        ${mentor.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="profile-section">
                    <h3>📚 멘토링 분야</h3>
                    <div class="mentoring-areas">
                        ${mentor.mentoringAreas.map(area => `
                            <div class="mentoring-area">
                                <i class="fas fa-check-circle"></i>
                                <span>${area}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="profile-section">
                    <h3>📞 상담 정보</h3>
                    <div class="contact-info">
                        <div class="contact-item">
                            <i class="fas fa-clock"></i>
                            <span>선호 시간: ${mentor.contactInfo.preferredTime}</span>
                        </div>
                        <div class="contact-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>위치: ${mentor.location}</span>
                        </div>
                        <div class="contact-item">
                            <i class="fas fa-bolt"></i>
                            <span>평균 응답시간: 2시간</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="profile-actions">
                <button class="btn-primary btn-lg" onclick="contactMentorEnhanced('${mentor.id}', '${mentor.name}')">
                    💬 멘토링 신청하기
                </button>
                <button class="btn-secondary" onclick="addToFavorites('${mentor.id}')">
                    ❤️ 관심 멘토 추가
                </button>
                <button class="btn-secondary" onclick="shareMentor('${mentor.id}')">
                    📤 공유하기
                </button>
            </div>
        </div>
    `;
    
    showModal(profileContent);
}

// 향상된 멘토링 신청
function contactMentorEnhanced(mentorId, mentorName) {
    const mentor = getMentorById(mentorId);
    
    const contactForm = `
        <div class="contact-form-enhanced">
            <div class="form-header">
                <h3>🤝 ${mentorName} 멘토님께 멘토링 신청</h3>
                <div class="mentor-quick-info">
                    <span>📍 ${mentor.location}</span>
                    <span>⭐ ${mentor.rating}점</span>
                    <span>⏰ ${mentor.contactInfo.preferredTime}</span>
                </div>
            </div>
            
            <form onsubmit="submitMentoringRequestEnhanced(event, '${mentorId}', '${mentorName}')">
                <div class="form-row">
                    <div class="form-group">
                        <label>이름 *</label>
                        <input type="text" name="name" required placeholder="홍길동">
                    </div>
                    <div class="form-group">
                        <label>연락처 *</label>
                        <input type="tel" name="phone" required placeholder="010-1234-5678">
                    </div>
                </div>
                
                <div class="form-group">
                    <label>이메일 *</label>
                    <input type="email" name="email" required placeholder="example@email.com">
                </div>
                
                <div class="form-group">
                    <label>멘토링 희망 분야 *</label>
                    <select name="mentoringField" required>
                        <option value="">선택해주세요</option>
                        ${mentor.mentoringAreas.map(area => `<option value="${area}">${area}</option>`).join('')}
                    </select>
                </div>
                
                <div class="form-group">
                    <label>멘토링 방식 *</label>
                    <div class="radio-group">
                        <label><input type="radio" name="type" value="video" checked> 화상 멘토링</label>
                        <label><input type="radio" name="type" value="phone"> 전화 멘토링</label>
                        <label><input type="radio" name="type" value="meeting"> 대면 멘토링</label>
                    </div>
                </div>
                
                <div class="form-group">
                    <label>희망 일정</label>
                    <input type="datetime-local" name="preferredTime" 
                           min="${new Date().toISOString().slice(0, 16)}">
                </div>
                
                <div class="form-group">
                    <label>자기소개 및 질문사항 *</label>
                    <textarea name="message" rows="4" required 
                              placeholder="간단한 자기소개와 멘토님께 궁금한 점을 구체적으로 적어주세요."></textarea>
                </div>
                
                <div class="form-group">
                    <label>
                        <input type="checkbox" required>
                        개인정보 수집 및 이용에 동의합니다.
                    </label>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn-primary btn-lg">
                        📨 멘토링 신청하기
                    </button>
                    <button type="button" class="btn-secondary" onclick="saveDraft()">
                        💾 임시저장
                    </button>
                </div>
                
                <div class="expected-response">
                    <i class="fas fa-info-circle"></i>
                    <span>보통 2시간 내에 응답을 받으실 수 있습니다.</span>
                </div>
            </form>
        </div>
    `;
    
    showModal(contactForm);
}

// 향상된 멘토링 신청 처리
function submitMentoringRequestEnhanced(event, mentorId, mentorName) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const requestData = {
        id: 'req_' + Date.now(),
        mentorId,
        mentorName,
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        mentoringField: formData.get('mentoringField'),
        type: formData.get('type'),
        preferredTime: formData.get('preferredTime'),
        message: formData.get('message'),
        status: 'pending',
        timestamp: new Date().toISOString()
    };
    
    // 로컬 스토리지에 저장
    const requests = JSON.parse(localStorage.getItem('mentoringRequests') || '[]');
    requests.push(requestData);
    localStorage.setItem('mentoringRequests', JSON.stringify(requests));
    
    closeModal();
    
    // 성공 메시지와 함께 다음 단계 안내
    showSuccessMessageEnhanced(
        `${mentorName} 멘토님께 멘토링 신청이 완료되었습니다!`,
        `신청번호: ${requestData.id}<br>
         보통 2시간 내에 응답을 받으실 수 있습니다.<br>
         신청 현황은 마이페이지에서 확인하실 수 있습니다.`
    );
    
    // 실시간 알림 표시
    showLiveNotification('새로운 멘토링 신청이 접수되었습니다! 📨');
}

// 모든 멘토 보기
function showAllMentors() {
    const allMentors = getAllMentors();
    
    const modalContent = `
        <div class="all-mentors">
            <div class="mentors-header">
                <h2>🌟 전체 멘토 (${allMentors.length}명)</h2>
                <div class="mentors-controls">
                    <input type="text" id="mentorSearchModal" placeholder="이름, 분야, 전문성 검색..." 
                           onkeyup="filterMentorsInModal()" style="padding: 8px; margin-right: 10px; border: 1px solid #ddd; border-radius: 5px;">
                    <select id="fieldFilter" onchange="filterMentorsInModal()" style="padding: 8px; margin-right: 10px;">
                        <option value="">모든 분야</option>
                        <option value="construction">건축/토목</option>
                        <option value="manufacturing">제조업</option>
                        <option value="agriculture">농업/어업</option>
                        <option value="services">서비스업</option>
                    </select>
                    <select id="sortBy" onchange="sortMentorsInModal()" style="padding: 8px;">
                        <option value="name">이름순</option>
                        <option value="rating">평점순</option>
                        <option value="experience">경력순</option>
                        <option value="menteeCount">멘티수순</option>
                    </select>
                </div>
            </div>
            
            <div class="mentors-grid" id="allMentorsGrid">
                ${allMentors.map(mentor => `
                    <div class="mentor-card-compact" data-field="${mentor.id.charAt(0) === 'c' ? 'construction' : mentor.id.charAt(0) === 'm' ? 'manufacturing' : mentor.id.charAt(0) === 'a' ? 'agriculture' : 'services'}">
                        <div class="mentor-compact-header">
                            <span class="mentor-avatar-sm">${mentor.profileImage}</span>
                            <div class="mentor-compact-info">
                                <h4>${mentor.name}</h4>
                                <p>${mentor.title}</p>
                            </div>
                            <div class="mentor-compact-stats">
                                <span class="rating">⭐ ${mentor.rating}</span>
                                <span class="status ${mentor.available ? 'available' : 'busy'}">
                                    ${mentor.available ? '🟢' : '🔴'}
                                </span>
                            </div>
                        </div>
                        <div class="mentor-compact-specialties">
                            ${mentor.specialties.slice(0, 2).map(s => `<span class="tag-sm">${s}</span>`).join('')}
                        </div>
                        <div class="mentor-compact-actions">
                            <button class="btn-sm btn-primary" onclick="showMentorProfile('${mentor.id}')">프로필</button>
                            <button class="btn-sm btn-secondary" onclick="contactMentorEnhanced('${mentor.id}', '${mentor.name}')">신청</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    showModal(modalContent);
}

// 검색 기능 설정
function setupSearchFunctionality() {
    const searchInput = document.getElementById('mentorSearch');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(performSearch, 300));
    }
}

// 검색 실행
function performSearch() {
    const query = document.getElementById('mentorSearch').value;
    if (query.length < 2) return;
    
    const results = searchMentors(query);
    showSearchResults(results, query);
}

// 검색 결과 표시
function showSearchResults(results, query) {
    const modalContent = `
        <div class="search-results">
            <h2>🔍 "${query}" 검색 결과 (${results.length}명)</h2>
            ${results.length === 0 ? `
                <div class="no-results">
                    <p>검색 결과가 없습니다.</p>
                    <button class="btn-primary" onclick="showAllMentors()">전체 멘토 보기</button>
                </div>
            ` : `
                <div class="search-results-grid">
                    ${results.map(mentor => `
                        <div class="search-result-item">
                            <div class="result-header">
                                <span class="mentor-avatar-sm">${mentor.profileImage}</span>
                                <div>
                                    <h4>${mentor.name}</h4>
                                    <p>${mentor.title}</p>
                                </div>
                                <span class="rating">⭐ ${mentor.rating}</span>
                            </div>
                            <p class="result-intro">${mentor.introduction.substring(0, 100)}...</p>
                            <div class="result-specialties">
                                ${mentor.specialties.map(s => `<span class="tag-sm">${s}</span>`).join('')}
                            </div>
                            <div class="result-actions">
                                <button class="btn-sm btn-primary" onclick="showMentorProfile('${mentor.id}')">상세보기</button>
                                <button class="btn-sm btn-secondary" onclick="contactMentorEnhanced('${mentor.id}', '${mentor.name}')">멘토링 신청</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `}
        </div>
    `;
    
    showModal(modalContent);
}

// 실시간 기능 설정
function setupLiveFeatures() {
    // 실시간 알림 컨테이너 생성
    if (!document.getElementById('liveNotification')) {
        const notificationDiv = document.createElement('div');
        notificationDiv.id = 'liveNotification';
        notificationDiv.className = 'live-notification';
        document.body.appendChild(notificationDiv);
    }
    
    // 실시간 활동 피드 설정
    updateActivityFeed();
}

// 실시간 업데이트 시작
function startLiveUpdates() {
    if (liveUpdateInterval) {
        clearInterval(liveUpdateInterval);
    }
    
    liveUpdateInterval = setInterval(() => {
        updateLiveStats();
        updateActivityFeed();
        showRandomNotification();
    }, 30000); // 30초마다 업데이트
}

// 실시간 통계 업데이트
function updateLiveStats() {
    // 실시간 현황 업데이트
    const onlineMentors = document.getElementById('onlineMentors');
    const activeMentoring = document.getElementById('activeMentoring');
    const weeklySignup = document.getElementById('weeklySignup');
    const monthlySuccess = document.getElementById('monthlySuccess');
    
    if (onlineMentors) onlineMentors.textContent = Math.floor(Math.random() * 8) + 8 + '명';
    if (activeMentoring) activeMentoring.textContent = Math.floor(Math.random() * 10) + 25 + '건';
    if (weeklySignup) weeklySignup.textContent = Math.floor(Math.random() * 15) + 40 + '명';
    if (monthlySuccess) monthlySuccess.textContent = '+' + Math.floor(Math.random() * 5) + 5 + '건';
    
    // 방문자 수 업데이트
    const visitorCount = document.getElementById('visitorCount');
    if (visitorCount) {
        const currentCount = parseInt(visitorCount.textContent.match(/\d+/)[0]);
        visitorCount.textContent = `오늘 방문자: ${currentCount + Math.floor(Math.random() * 3)}명`;
    }
}

// 활동 피드 업데이트
function updateActivityFeed() {
    const activityFeed = document.getElementById('activityFeed');
    if (!activityFeed) return;
    
    const activities = [
        '김기계 마이스터가 새로운 CNC 가공 팁을 공유했습니다.',
        '박신입님이 정밀가공 멘토링을 완료했습니다.',
        '송농부님이 스마트팜 질문에 답변했습니다.',
        '이건축 건축사가 새로운 설계 사례를 등록했습니다.',
        '경북 농어촌 커뮤니티에 새 멤버가 가입했습니다.',
        '울산 제조업 혁신 프로젝트가 80% 진행되었습니다.'
    ];
    
    const randomActivities = activities.sort(() => 0.5 - Math.random()).slice(0, 3);
    
    activityFeed.innerHTML = `
        <h3>🔄 최근 활동</h3>
        <div class="activity-list">
            ${randomActivities.map((activity, index) => `
                <div class="activity-item" style="animation-delay: ${index * 0.2}s">
                    <div class="activity-time">${Math.floor(Math.random() * 60) + 1}분 전</div>
                    <div class="activity-content">${activity}</div>
                </div>
            `).join('')}
        </div>
        <button class="btn-secondary" onclick="showAllActivities()">모든 활동 보기</button>
    `;
}

// 랜덤 알림 표시
function showRandomNotification() {
    const notifications = [
        '새로운 멘토가 등록되었습니다! 🎉',
        '멘토링 성공사례가 업데이트되었습니다! 📈',
        '이번 주 인기 분야: 스마트팜 기술 🌱',
        '실시간 상담 가능한 멘토: 8명 온라인 💬'
    ];
    
    if (Math.random() < 0.3) { // 30% 확률로 알림 표시
        const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
        showLiveNotification(randomNotification);
    }
}

// 향상된 성공 메시지
function showSuccessMessageEnhanced(title, description) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message-enhanced';
    successDiv.innerHTML = `
        <div class="success-content">
            <div class="success-icon">✅</div>
            <h3>${title}</h3>
            <p>${description}</p>
        </div>
    `;
    
    successDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 2rem;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 3000;
        max-width: 400px;
        text-align: center;
        border: 3px solid #28a745;
    `;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

// 실시간 알림 표시
function showLiveNotification(message) {
    const notification = document.getElementById('liveNotification');
    if (!notification) return;
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-bell"></i>
            <span>${message}</span>
            <button onclick="hideLiveNotification()" class="notification-close">&times;</button>
        </div>
    `;
    
    notification.style.display = 'block';
    notification.style.animation = 'slideInFromTop 0.5s ease';
    
    // 5초 후 자동 숨김
    setTimeout(() => {
        hideLiveNotification();
    }, 5000);
}

function hideLiveNotification() {
    const notification = document.getElementById('liveNotification');
    if (notification) {
        notification.style.display = 'none';
    }
}

// 디바운스 함수
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 필드명 변환 함수
function getFieldName(field) {
    const fieldNames = {
        construction: '건축/토목',
        manufacturing: '제조업',
        agriculture: '농업/어업',
        services: '서비스업'
    };
    return fieldNames[field] || field;
}

// 서비스 가이드 표시
function showServiceGuide() {
    const guideContent = `
        <div class="service-guide">
            <h2>📋 서비스 이용 가이드</h2>
            <div class="guide-sections">
                <div class="guide-section">
                    <h3>🧑‍🏫 멘토가 되고 싶다면</h3>
                    <ol>
                        <li>상단 "멘토로 참여" 버튼 클릭</li>
                        <li>전문 분야와 경력 정보 입력</li>
                        <li>관리자 승인 대기 (보통 1-2일)</li>
                        <li>승인 후 멘토링 활동 시작</li>
                    </ol>
                </div>
                
                <div class="guide-section">
                    <h3>🎓 멘토링을 받고 싶다면</h3>
                    <ol>
                        <li>관심 분야의 멘토 찾기</li>
                        <li>멘토 프로필 확인</li>
                        <li>멘토링 신청서 작성</li>
                        <li>멘토의 연락 대기</li>
                    </ol>
                </div>
                
                <div class="guide-section">
                    <h3>💡 효과적인 멘토링 팁</h3>
                    <ul>
                        <li>구체적이고 명확한 목표 설정</li>
                        <li>정기적인 소통과 피드백</li>
                        <li>배운 내용의 실습과 적용</li>
                        <li>성과 공유와 네트워킹</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
    
    showModal(guideContent);
}

// 글로벌 함수 노출
window.initializeEnhancedFeatures = initializeEnhancedFeatures;
window.loadRealTimeData = loadRealTimeData;
window.startLiveUpdates = startLiveUpdates;
window.showMentorsByFieldEnhanced = showMentorsByFieldEnhanced;
window.showAllMentors = showAllMentors;
window.searchMentors = performSearch;
window.showServiceGuide = showServiceGuide;
