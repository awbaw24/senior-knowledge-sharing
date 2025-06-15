// 멘토 데이터베이스 (실제 서비스용)
const MENTORS_DATABASE = {
    construction: [
        {
            id: 'c001',
            name: '이건축',
            title: '건축사 / 전 대한건설 설계부장',
            experience: '35년 경력',
            specialties: ['아파트 설계', '인허가 절차', '구조 설계'],
            location: '서울 강남구',
            available: true,
            rating: 4.9,
            menteeCount: 12,
            profileImage: '👨‍💼',
            introduction: '35년간 대형 건설사에서 아파트 설계를 담당했습니다. 특히 인허가 절차와 구조 설계에 전문성을 가지고 있으며, 신규 건축사들의 실무 정착을 도와드립니다.',
            achievements: [
                '서울 강남 OO아파트 1,200세대 설계',
                '용적률 99.8% 달성으로 분양률 100% 기록',
                '건축사 실무교육 강사 8년 경력'
            ],
            mentoringAreas: [
                '아파트 설계 실무',
                '인허가 절차 완전 정복',
                '구조 설계 검토 요령',
                '건축법규 해석 및 적용'
            ],
            contactInfo: {
                phone: '010-1234-5678',
                email: 'architect.lee@example.com',
                preferredTime: '평일 오후 2-6시'
            }
        },
        {
            id: 'c002',
            name: '박토목',
            title: '토목기사 / 전 한국도로공사 과장',
            experience: '28년 경력',
            specialties: ['도로 시공', '교량 설계', '현장 관리'],
            location: '경기 수원시',
            available: true,
            rating: 4.8,
            menteeCount: 8,
            profileImage: '🏗️',
            introduction: '28년간 도로공사에서 근무하며 전국 주요 도로와 교량 건설을 담당했습니다. 현장 관리와 안전 관리에 특화된 노하우를 전수합니다.',
            achievements: [
                '경부고속도로 확장공사 현장소장',
                '한강대교 보수공사 총괄',
                '무사고 현장관리 15년 연속 달성'
            ],
            mentoringAreas: [
                '도로 시공 실무',
                '교량 설계 및 시공',
                '현장 안전관리',
                '공정관리 및 품질관리'
            ],
            contactInfo: {
                phone: '010-2345-6789',
                email: 'civil.park@example.com',
                preferredTime: '평일 오전 9-12시'
            }
        },
        {
            id: 'c003',
            name: '김현장',
            title: '건설 현장소장 / 전 삼성물산',
            experience: '30년 경력',
            specialties: ['현장관리', '안전관리', '공정관리'],
            location: '서울 송파구',
            available: true,
            rating: 4.9,
            menteeCount: 15,
            profileImage: '⛑️',
            introduction: '30년간 초고층 빌딩과 대형 건설현장의 현장소장으로 근무했습니다. 현장 관리의 A to Z를 체계적으로 가르쳐드립니다.',
            achievements: [
                '롯데월드타워 건설 현장소장',
                '무사고 건설현장 운영 20년',
                '건설업 안전관리 모범사례 선정'
            ],
            mentoringAreas: [
                '건설현장 관리 실무',
                '안전관리 체계 구축',
                '공정 계획 및 관리',
                '협력업체 관리'
            ],
            contactInfo: {
                phone: '010-3456-7890',
                email: 'site.kim@example.com',
                preferredTime: '평일 저녁 7-9시'
            }
        }
    ],
    manufacturing: [
        {
            id: 'm001',
            name: '김기계',
            title: '기계가공 마이스터 / 전 현대중공업',
            experience: '40년 경력',
            specialties: ['정밀가공', '품질관리', '설비관리'],
            location: '울산광역시',
            available: true,
            rating: 5.0,
            menteeCount: 20,
            profileImage: '⚙️',
            introduction: '40년간 조선업계에서 정밀가공 분야의 최고 전문가로 인정받았습니다. 불량률 50% 감소를 달성한 품질관리 노하우를 전수합니다.',
            achievements: [
                '정밀가공 불량률 8.5% → 4.2% 달성',
                '대한민국 기능장 선정',
                '조선업 기술혁신상 수상'
            ],
            mentoringAreas: [
                'CNC 가공 기법',
                '품질관리 시스템',
                '설비 최적화',
                '작업 표준화'
            ],
            contactInfo: {
                phone: '010-4567-8901',
                email: 'machine.kim@example.com',
                preferredTime: '평일 오후 1-5시'
            }
        },
        {
            id: 'm002',
            name: '최용접',
            title: '용접 전문가 / 전 두산중공업',
            experience: '32년 경력',
            specialties: ['특수용접', '용접검사', '안전관리'],
            location: '경남 창원시',
            available: true,
            rating: 4.9,
            menteeCount: 14,
            profileImage: '🔥',
            introduction: '32년간 발전소 건설과 화학플랜트에서 특수용접 업무를 담당했습니다. 고난도 용접 기법과 안전 관리를 교육합니다.',
            achievements: [
                '원자력발전소 주요부품 용접',
                '용접기능장 자격취득',
                '용접 교육과정 개발 및 운영'
            ],
            mentoringAreas: [
                '특수강 용접 기법',
                '용접부 품질검사',
                '용접 안전관리',
                '용접 자격증 취득 지도'
            ],
            contactInfo: {
                phone: '010-5678-9012',
                email: 'weld.choi@example.com',
                preferredTime: '주말 오전 10-12시'
            }
        }
    ],
    agriculture: [
        {
            id: 'a001',
            name: '송농부',
            title: '스마트팜 전문가 / 영농조합법인 대표',
            experience: '25년 경력',
            specialties: ['스마트팜', '친환경농법', '직거래'],
            location: '경북 안동시',
            available: true,
            rating: 4.8,
            menteeCount: 18,
            profileImage: '🌱',
            introduction: '25년간 농업에 종사하며 스마트팜 기술을 도입해 생산성을 300% 향상시켰습니다. 귀농인들의 성공적인 정착을 도와드립니다.',
            achievements: [
                '스마트팜 도입으로 생산성 300% 향상',
                '유기농 인증 농장 운영',
                '농림부 우수농가 선정'
            ],
            mentoringAreas: [
                '스마트팜 구축 및 운영',
                '친환경 농법',
                '농산물 직거래',
                '6차 산업 창업'
            ],
            contactInfo: {
                phone: '010-6789-0123',
                email: 'smart.song@example.com',
                preferredTime: '평일 오전 8-11시'
            }
        },
        {
            id: 'a002',
            name: '정어부',
            title: '양식업 전문가 / 수산업협동조합 이사',
            experience: '30년 경력',
            specialties: ['해상양식', '수산가공', '유통관리'],
            location: '경남 통영시',
            available: true,
            rating: 4.7,
            menteeCount: 9,
            profileImage: '🐟',
            introduction: '30년간 통영에서 양식업에 종사하며 굴, 멸치 양식 전문가로 활동했습니다. 해상양식의 모든 노하우를 전수합니다.',
            achievements: [
                '통영굴 브랜드화 성공',
                '수산물 수출 확대 기여',
                '어업인 교육센터 강사'
            ],
            mentoringAreas: [
                '해상양식 기법',
                '수산물 가공 및 저장',
                '수산물 유통 및 마케팅',
                '어업 창업 컨설팅'
            ],
            contactInfo: {
                phone: '010-7890-1234',
                email: 'sea.jung@example.com',
                preferredTime: '평일 오후 3-6시'
            }
        }
    ],
    services: [
        {
            id: 's001',
            name: '한서비스',
            title: '고객서비스 전문가 / 전 신세계백화점 부장',
            experience: '20년 경력',
            specialties: ['고객관리', '서비스기획', '교육훈련'],
            location: '서울 중구',
            available: true,
            rating: 4.8,
            menteeCount: 11,
            profileImage: '💼',
            introduction: '20년간 백화점 고객서비스 분야에서 근무하며 VIP 고객관리와 서비스 혁신을 이끌었습니다. 서비스업 창업과 운영 노하우를 전수합니다.',
            achievements: [
                'VIP 고객만족도 98% 달성',
                '서비스 혁신 프로그램 개발',
                '직원 교육프로그램 운영'
            ],
            mentoringAreas: [
                '고객 서비스 기획',
                'VIP 고객 관리',
                '서비스 교육 및 훈련',
                '서비스업 창업 컨설팅'
            ],
            contactInfo: {
                phone: '010-8901-2345',
                email: 'service.han@example.com',
                preferredTime: '평일 오후 2-5시'
            }
        },
        {
            id: 's002',
            name: '윤경영',
            title: '소상공인 컨설턴트 / 창업진흥원 수석연구원',
            experience: '15년 경력',
            specialties: ['창업컨설팅', '경영전략', '마케팅'],
            location: '서울 마포구',
            available: true,
            rating: 4.9,
            menteeCount: 22,
            profileImage: '📊',
            introduction: '15년간 창업진흥원에서 소상공인 창업 지원 업무를 담당했습니다. 성공적인 창업과 경영 안정화를 위한 실전 노하우를 제공합니다.',
            achievements: [
                '창업 성공률 85% 달성',
                '소상공인 정책 개발 참여',
                '창업 교육프로그램 운영'
            ],
            mentoringAreas: [
                '창업 아이템 발굴',
                '사업계획서 작성',
                '마케팅 전략 수립',
                '경영 안정화 방안'
            ],
            contactInfo: {
                phone: '010-9012-3456',
                email: 'startup.yoon@example.com',
                preferredTime: '평일 저녁 6-8시'
            }
        }
    ]
};

// 성공 사례 데이터
const SUCCESS_STORIES = [
    {
        id: 'story001',
        mentorName: '김기계',
        menteeName: '박신입',
        field: 'manufacturing',
        title: '정밀가공 불량률 50% 감소 달성',
        summary: '3개월 멘토링으로 CNC 가공 실력이 향상되어 불량률을 대폭 감소시켰습니다.',
        beforeAfter: {
            before: '불량률 8.5%, 일일 생산량 85개',
            after: '불량률 4.2%, 일일 생산량 142개'
        },
        period: '2024.03 - 2024.06',
        testimonial: '김기계 마이스터님의 체계적인 지도로 가공 기술이 완전히 달라졌습니다. 단순히 기술만이 아니라 품질에 대한 마인드까지 바뀌었어요.',
        image: '⚙️'
    },
    {
        id: 'story002',
        mentorName: '송농부',
        menteeName: '이귀농',
        field: 'agriculture',
        title: '귀농 첫해 목표 대비 133% 수확 성공',
        summary: '스마트팜 기술과 친환경 농법으로 첫해 농사에서 놀라운 성과를 달성했습니다.',
        beforeAfter: {
            before: '농업 경험 전무, 목표 수확량 6톤',
            after: '실제 수확량 8톤, 순이익 2,100만원'
        },
        period: '2024.01 - 2024.12',
        testimonial: '송농부님 덕분에 귀농이 이렇게 성공적일 줄 몰랐습니다. 단순한 농법이 아니라 사업적 관점까지 배울 수 있었어요.',
        image: '🌱'
    },
    {
        id: 'story003',
        mentorName: '이건축',
        menteeName: '최건축사',
        field: 'construction',
        title: '신규 건축사 실무 정착 성공',
        summary: '인허가 절차와 설계 실무를 체계적으로 학습하여 독립 사무소 개소에 성공했습니다.',
        beforeAfter: {
            before: '이론만 알고 실무 경험 부족',
            after: '독립 사무소 개소, 첫 프로젝트 수주'
        },
        period: '2024.02 - 2024.08',
        testimonial: '이건축 선배님의 40년 노하우를 6개월 만에 집약적으로 배울 수 있었습니다. 현장에서 바로 써먹을 수 있는 살아있는 지식이었어요.',
        image: '🏗️'
    }
];

// 지역별 커뮤니티 데이터
const COMMUNITIES = {
    gyeongbuk: {
        name: '경상북도 농어촌 활성화',
        description: '안동, 영주, 봉화 지역 농업인들의 지식 공유',
        icon: '🌾',
        mentorCount: 12,
        projectCount: 8,
        members: 67,
        projects: [
            {
                title: '안동 딸기농장 스마트팜 전환',
                status: '진행중',
                participants: 8,
                goal: '생산성 300% 향상',
                progress: 65
            },
            {
                title: '영주 한방약초 체험관광',
                status: '기획중',
                participants: 5,
                goal: '6차 산업 모델 구축',
                progress: 30
            }
        ],
        recentNews: [
            '안동 스마트팜 시범사업 중간 성과 발표',
            '영주 한방약초 체험센터 부지 확정',
            '봉화 산채 직거래 플랫폼 론칭'
        ]
    },
    ulsan: {
        name: '울산 제조업 혁신',
        description: '자동차, 조선업 은퇴 전문가들의 경험 전수',
        icon: '🏭',
        mentorCount: 18,
        projectCount: 15,
        members: 89,
        projects: [
            {
                title: '중소기업 품질관리 시스템 구축',
                status: '진행중',
                participants: 12,
                goal: '불량률 50% 감소',
                progress: 80
            }
        ]
    },
    busan: {
        name: '부산 서비스업 창업',
        description: '관광, 물류업 베테랑들의 창업 지원',
        icon: '🏢',
        mentorCount: 9,
        projectCount: 6,
        members: 34,
        projects: [
            {
                title: '부산 관광 서비스 혁신',
                status: '완료',
                participants: 6,
                goal: '관광객 만족도 향상',
                progress: 100
            }
        ]
    }
};

// 유틸리티 함수들
function getMentorsByField(field) {
    return MENTORS_DATABASE[field] || [];
}

function getAllMentors() {
    return Object.values(MENTORS_DATABASE).flat();
}

function getMentorById(id) {
    return getAllMentors().find(mentor => mentor.id === id);
}

function getSuccessStories() {
    return SUCCESS_STORIES;
}

function getCommunityData(region) {
    return COMMUNITIES[region];
}

function searchMentors(query) {
    const allMentors = getAllMentors();
    const lowerQuery = query.toLowerCase();
    
    return allMentors.filter(mentor => 
        mentor.name.toLowerCase().includes(lowerQuery) ||
        mentor.title.toLowerCase().includes(lowerQuery) ||
        mentor.specialties.some(specialty => 
            specialty.toLowerCase().includes(lowerQuery)
        ) ||
        mentor.introduction.toLowerCase().includes(lowerQuery)
    );
}

// 전역 스코프에 노출
window.MENTORS_DATABASE = MENTORS_DATABASE;
window.SUCCESS_STORIES = SUCCESS_STORIES;
window.COMMUNITIES = COMMUNITIES;
window.getMentorsByField = getMentorsByField;
window.getMentorById = getMentorById;
window.getSuccessStories = getSuccessStories;
window.getCommunityData = getCommunityData;
window.searchMentors = searchMentors;
