// 관리자 대시보드 JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeAdmin();
});

function initializeAdmin() {
    setupNavigation();
    loadPendingMentors();
    loadNewMentees();
    loadMatchingRequests();
    updateStats();
    setupRealTimeUpdates();
}

// 네비게이션 설정
function setupNavigation() {
    const navLinks = document.querySelectorAll('.sidebar a');
    const sections = document.querySelectorAll('.section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 모든 링크에서 active 클래스 제거
            navLinks.forEach(l => l.classList.remove('active'));
            // 현재 링크에 active 클래스 추가
            this.classList.add('active');
            
            // 모든 섹션 숨기기
            sections.forEach(s => s.style.display = 'none');
            
            // 선택된 섹션 보이기
            const targetSection = this.getAttribute('data-section');
            const target = document.getElementById(targetSection);
            if (target) {
                target.style.display = 'block';
            }
        });
    });
}

// 승인 대기 중인 멘토 로드
function loadPendingMentors() {
    const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
    const pendingMentors = registrations.filter(r => r.type === 'mentor');
    
    const tbody = document.getElementById('pendingMentors');
    if (!tbody) return;
    
    tbody.innerHTML = pendingMentors.map(mentor => `
        <tr>
            <td>${mentor.name}</td>
            <td>${getFieldName(mentor.field)}</td>
            <td>${mentor.experience}</td>
            <td>${formatDate(mentor.timestamp)}</td>
            <td><span class="status-pending">승인 대기</span></td>
            <td>
                <button class="btn btn-approve" onclick="approveMentor('${mentor.email}')">승인</button>
                <button class="btn btn-reject" onclick="rejectMentor('${mentor.email}')">거절</button>
                <button class="btn btn-view" onclick="viewMentorDetail('${mentor.email}')">상세</button>
            </td>
        </tr>
    `).join('');
}

// 신규 멘티 로드
function loadNewMentees() {
    const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
    const newMentees = registrations.filter(r => r.type === 'mentee');
    
    const tbody = document.getElementById('newMentees');
    if (!tbody) return;
    
    tbody.innerHTML = newMentees.map(mentee => `
        <tr>
            <td>${mentee.name}</td>
            <td>${getFieldName(mentee.field)}</td>
            <td>${getStatusName(mentee.status)}</td>
            <td>${formatDate(mentee.timestamp)}</td>
            <td><span class="status-pending">매칭 대기</span></td>
            <td>
                <button class="btn btn-view" onclick="viewMenteeDetail('${mentee.email}')">상세</button>
                <button class="btn btn-match" onclick="matchMentee('${mentee.email}')">매칭</button>
            </td>
        </tr>
    `).join('');
}

// 매칭 요청 로드
function loadMatchingRequests() {
    const requests = JSON.parse(localStorage.getItem('mentoringRequests') || '[]');
    
    const tbody = document.getElementById('matchingRequests');
    if (!tbody) return;
    
    tbody.innerHTML = requests.map(request => `
        <tr>
            <td>${request.name}</td>
            <td>${request.field}</td>
            <td>${request.message.substring(0, 50)}...</td>
            <td>${formatDate(request.timestamp)}</td>
            <td>
                <button class="btn btn-view" onclick="viewRequestDetail('${request.email}')">상세</button>
                <button class="btn btn-match" onclick="processMatchingRequest('${request.email}')">처리</button>
            </td>
        </tr>
    `).join('');
}

// 멘토 승인
function approveMentor(email) {
    if (confirm('이 멘토를 승인하시겠습니까?')) {
        // 실제 환경에서는 서버 API 호출
        const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
        const mentorIndex = registrations.findIndex(r => r.email === email && r.type === 'mentor');
        
        if (mentorIndex !== -1) {
            registrations[mentorIndex].status = 'approved';
            localStorage.setItem('registrations', JSON.stringify(registrations));
        }
        
        showNotification(`멘토 승인이 완료되었습니다. (${email})`);
        loadPendingMentors(); // 목록 새로고침
        updateStats(); // 통계 업데이트
    }
}

// 멘토 거절
function rejectMentor(email) {
    const reason = prompt('거절 사유를 입력해주세요:');
    if (reason) {
        // 실제 환경에서는 서버 API 호출
        const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
        const mentorIndex = registrations.findIndex(r => r.email === email && r.type === 'mentor');
        
        if (mentorIndex !== -1) {
            registrations[mentorIndex].status = 'rejected';
            registrations[mentorIndex].rejectionReason = reason;
            localStorage.setItem('registrations', JSON.stringify(registrations));
        }
        
        showNotification(`멘토 신청이 거절되었습니다. (${email})`);
        loadPendingMentors(); // 목록 새로고침
    }
}

// 멘토 상세 보기
function viewMentorDetail(email) {
    const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
    const mentor = registrations.find(r => r.email === email && r.type === 'mentor');
    
    if (mentor) {
        const detail = `
멘토 상세 정보
--------------
이름: ${mentor.name}
분야: ${getFieldName(mentor.field)}
경력: ${mentor.experience}
전문분야: ${mentor.specialties}
연락처: ${mentor.phone}
이메일: ${mentor.email}
신청일: ${formatDate(mentor.timestamp)}
        `;
        alert(detail);
    }
}

// 멘티 상세 보기
function viewMenteeDetail(email) {
    const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
    const mentee = registrations.find(r => r.email === email && r.type === 'mentee');
    
    if (mentee) {
        const detail = `
멘티 상세 정보
--------------
이름: ${mentee.name}
관심분야: ${getFieldName(mentee.field)}
현재상황: ${getStatusName(mentee.status)}
학습목표: ${mentee.goals}
연락처: ${mentee.phone}
이메일: ${mentee.email}
등록일: ${formatDate(mentee.timestamp)}
        `;
        alert(detail);
    }
}

// 멘티 매칭
function matchMentee(email) {
    const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
    const mentee = registrations.find(r => r.email === email && r.type === 'mentee');
    
    if (mentee) {
        // 해당 분야의 승인된 멘토 목록 가져오기
        const availableMentors = registrations.filter(r => 
            r.type === 'mentor' && 
            r.field === mentee.field && 
            r.status === 'approved'
        );
        
        if (availableMentors.length === 0) {
            alert('해당 분야에 활용 가능한 멘토가 없습니다.');
            return;
        }
        
        // 멘토 선택 UI (실제로는 더 복잡한 매칭 알고리즘 사용)
        const mentorOptions = availableMentors.map(m => `${m.name} (${m.experience})`).join('\n');
        const selectedMentor = prompt(`매칭할 멘토를 선택하세요:\n\n${mentorOptions}\n\n멘토 이름을 입력하세요:`);
        
        if (selectedMentor) {
            const matching = {
                menteeEmail: email,
                menteeName: mentee.name,
                mentorName: selectedMentor,
                field: mentee.field,
                startDate: new Date().toISOString(),
                status: 'active'
            };
            
            // 매칭 정보 저장
            const matchings = JSON.parse(localStorage.getItem('matchings') || '[]');
            matchings.push(matching);
            localStorage.setItem('matchings', JSON.stringify(matchings));
            
            showNotification(`${mentee.name} 멘티가 ${selectedMentor} 멘토와 매칭되었습니다.`);
            loadNewMentees(); // 목록 새로고침
            updateStats(); // 통계 업데이트
        }
    }
}

// 매칭 요청 상세 보기
function viewRequestDetail(email) {
    const requests = JSON.parse(localStorage.getItem('mentoringRequests') || '[]');
    const request = requests.find(r => r.email === email);
    
    if (request) {
        const detail = `
멘토링 요청 상세
-----------------
요청자: ${request.name}
연락처: ${request.phone}
이메일: ${request.email}
희망분야: ${request.field}
요청내용: ${request.message}
요청일: ${formatDate(request.timestamp)}
        `;
        alert(detail);
    }
}

// 매칭 요청 처리
function processMatchingRequest(email) {
    const action = confirm('이 매칭 요청을 승인하시겠습니까?\n\nOK: 승인\nCancel: 거절');
    
    if (action) {
        showNotification(`매칭 요청이 승인되었습니다. (${email})`);
        // 실제로는 멘토 배정 로직 실행
    } else {
        showNotification(`매칭 요청이 거절되었습니다. (${email})`);
    }
    
    // 요청 목록에서 제거
    let requests = JSON.parse(localStorage.getItem('mentoringRequests') || '[]');
    requests = requests.filter(r => r.email !== email);
    localStorage.setItem('mentoringRequests', JSON.stringify(requests));
    
    loadMatchingRequests(); // 목록 새로고침
}

// 통계 업데이트
function updateStats() {
    const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
    const matchings = JSON.parse(localStorage.getItem('matchings') || '[]');
    const requests = JSON.parse(localStorage.getItem('mentoringRequests') || '[]');
    
    const mentorCount = registrations.filter(r => r.type === 'mentor').length;
    const menteeCount = registrations.filter(r => r.type === 'mentee').length;
    const activeMatchings = matchings.filter(m => m.status === 'active').length;
    
    // DOM 업데이트
    const mentorCountEl = document.getElementById('mentorCount');
    const menteeCountEl = document.getElementById('menteeCount');
    const matchingCountEl = document.getElementById('matchingCount');
    
    if (mentorCountEl) mentorCountEl.textContent = mentorCount + 156; // 기본값에 추가
    if (menteeCountEl) menteeCountEl.textContent = menteeCount + 423; // 기본값에 추가
    if (matchingCountEl) matchingCountEl.textContent = activeMatchings + 89; // 기본값에 추가
}

// 실시간 알림 시뮬레이션
function setupRealTimeUpdates() {
    setInterval(() => {
        // 실제 환경에서는 WebSocket이나 Server-Sent Events 사용
        const notifications = [
            '새로운 멘토 등록이 있습니다.',
            '멘토링 매칭이 완료되었습니다.',
            '새로운 지식이 공유되었습니다.',
            '멘토링 세션이 완료되었습니다.',
            '새로운 멘티 등록이 있습니다.'
        ];
        
        // 5% 확률로 알림 표시
        if (Math.random() < 0.05) {
            const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
            showNotification(randomNotification);
            
            // 통계 자동 업데이트
            updateStats();
        }
    }, 10000); // 10초마다 체크
}

// 알림 표시
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `<i class="fas fa-bell"></i> ${message}`;
    
    document.body.appendChild(notification);
    
    // 5초 후 제거
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// 유틸리티 함수들
function getFieldName(field) {
    const fieldNames = {
        construction: '건축/토목',
        manufacturing: '제조업',
        agriculture: '농업/어업',
        services: '서비스업'
    };
    return fieldNames[field] || field;
}

function getStatusName(status) {
    const statusNames = {
        student: '학생',
        newcomer: '신입사원',
        career_change: '전직 희망',
        entrepreneur: '창업 준비'
    };
    return statusNames[status] || status;
}

function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('ko-KR');
}

// 최근 활동 업데이트
function updateRecentActivities() {
    const activities = [
        {
            time: new Date().toLocaleString('ko-KR'),
            type: '멘토 신규 등록',
            user: '김신규',
            content: '건축 분야 멘토 등록'
        },
        {
            time: new Date(Date.now() - 300000).toLocaleString('ko-KR'),
            type: '매칭 완료',
            user: '이멘토 ↔ 박멘티',
            content: '제조업 분야 멘토링'
        }
    ];
    
    const tbody = document.getElementById('recentActivities');
    if (tbody) {
        // 기존 내용 유지하면서 새 활동 추가
        const newRows = activities.map(activity => `
            <tr>
                <td>${activity.time}</td>
                <td>${activity.type}</td>
                <td>${activity.user}</td>
                <td>${activity.content}</td>
            </tr>
        `).join('');
        
        tbody.innerHTML = newRows + tbody.innerHTML;
        
        // 최대 10개 활동만 표시
        const rows = tbody.querySelectorAll('tr');
        if (rows.length > 10) {
            for (let i = 10; i < rows.length; i++) {
                rows[i].remove();
            }
        }
    }
}

// 데이터 초기화 (테스트용)
function resetData() {
    if (confirm('모든 데이터를 초기화하시겠습니까?')) {
        localStorage.removeItem('registrations');
        localStorage.removeItem('mentoringRequests');
        localStorage.removeItem('matchings');
        
        loadPendingMentors();
        loadNewMentees();
        loadMatchingRequests();
        updateStats();
        
        showNotification('데이터가 초기화되었습니다.');
    }
}

// 데이터 내보내기
function exportData() {
    const data = {
        registrations: JSON.parse(localStorage.getItem('registrations') || '[]'),
        mentoringRequests: JSON.parse(localStorage.getItem('mentoringRequests') || '[]'),
        matchings: JSON.parse(localStorage.getItem('matchings') || '[]'),
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `mentoring_data_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showNotification('데이터가 내보내기되었습니다.');
}

// 키보드 단축키
document.addEventListener('keydown', function(e) {
    // Ctrl + R: 데이터 새로고침
    if (e.ctrlKey && e.key === 'r') {
        e.preventDefault();
        loadPendingMentors();
        loadNewMentees();
        loadMatchingRequests();
        updateStats();
        showNotification('데이터가 새로고침되었습니다.');
    }
    
    // Ctrl + E: 데이터 내보내기
    if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        exportData();
    }
});

// 페이지 로드 시 웰컴 메시지
setTimeout(() => {
    showNotification('관리자 대시보드에 오신 것을 환영합니다!');
}, 1000);