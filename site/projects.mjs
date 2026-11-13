// 포트폴리오에 실리는 프로젝트 목록. 이 파일만 고치고 `node build.mjs`를 돌리면 전체 페이지가 다시 만들어진다.
// 숫자는 각 프로젝트의 NUMBERS.md / README / docs/portfolio-evidence.md 에서 확인된 값만 쓴다.
// state: 'in' = 지금 열어볼 수 있음(청록 표시), 'out' = 기록으로 남은 것(테두리 표시)

export const kinds = {
  contest: '해커톤과 공모전',
  product: '제품',
  auto: '자동화',
  research: '연구와 실측',
  archive: '실험 기록',
};

export const projects = [
  {
    slug: 'mureobopseo', name: '물어봅서', year: 2026, kind: 'contest', status: '제출', state: 'out', img: true,
    line: '동네 데이터를 말로 물으면 계산해서 답하고, 답에 쓴 숫자를 하나씩 검증합니다.',
    body: [
      '제주 주민이 지도에서 동네를 누르거나 한 줄로 물으면, 제주데이터허브 자료 가운데 필요한 것을 받아 코드로 계산하고 짧은 한국어로 답합니다.',
      '답마다 질문을 어떻게 이해했는지와, 답에 쓴 숫자가 계산값과 맞는지를 함께 보여 줍니다. 자료에 없는 주제는 지어내지 않고 대신 물을 수 있는 질문을 제안합니다.',
    ],
    facts: [['대회', '제주 AI·빅데이터 AI Agent 챌린지'], ['쓰는 자료', '제주데이터허브 8종'], ['다루는 범위', '읍면동 43곳'], ['숫자 검증', '예시 답 29개의 숫자 200개 모두 일치']],
    links: [['시연 영상 보기', 'https://youtu.be/QegpU0ibnRc']],
  },
  {
    slug: 'seance', name: 'Séance', year: 2026, kind: 'contest', status: '라이브', state: 'in', img: true,
    line: '코드 한 줄을 가리키면 그 줄의 git 기록만으로 답하고, 인용이 진짜인지 검사합니다.',
    body: [
      '코드 한 줄을 고르면 그 줄을 거쳐 간 커밋을 모아 장부를 만들고, 원작자의 목소리로 왜 이렇게 짰는지 답합니다.',
      '답의 모든 주장은 커밋을 인용해야 하고, 모델이 아닌 검사기가 그 해시와 문장이 실제 기록에 있는지 대조합니다. 없는 인용은 이유와 함께 지워집니다.',
    ],
    facts: [['대회', 'Kiroween 2026, Costume Contest 부문'], ['검증 방식', '인용한 커밋과 문장을 코드로 대조'], ['만든 도구', 'Kiro']],
    links: [['라이브 열기', 'https://seance-kiro.onrender.com'], ['시연 영상', 'https://youtu.be/pHCNYkefrOI'], ['Devpost', 'https://devpost.com/software/seance-l35kt6'], ['저장소', 'https://github.com/seunghyeon1004/seance-kiro']],
    note: '무료 호스팅이라 첫 접속은 1분쯤 걸릴 수 있습니다.',
  },
  {
    slug: 'page100', name: 'Page 100', year: 2026, kind: 'contest', status: '라이브', state: 'in', img: true,
    line: '텔레텍스트를 되살렸습니다. 오늘의 세상을 40열 24행, 세 자리 숫자로 봅니다.',
    body: [
      '뉴스, 날씨, 환율, 지진, 달의 위상을 옛 텔레텍스트 화면 규격 그대로 보여 줍니다. 세 자리 페이지 번호를 치면 이동합니다.',
      '규격을 지키는지 검사기가 모든 화면을 확인하고, 스크립트를 꺼도 읽을 수 있습니다.',
    ],
    facts: [['대회', 'Kiroween 2026, Resurrection 부문'], ['화면 규격', '40열 24행, 8색'], ['분량', '30페이지, 43화면'], ['첫 방문 전송량', '11,515바이트'], ['단위와 속성 테스트', '1,211개']],
    links: [['라이브 열기', 'https://page100-kiro.onrender.com'], ['시연 영상', 'https://youtu.be/emK-JwUHP4U'], ['Devpost', 'https://devpost.com/software/page-100'], ['저장소', 'https://github.com/seunghyeon1004/page100-kiro']],
  },
  {
    slug: 'make-dinner', name: 'Make Dinner', year: 2026, kind: 'contest', status: '라이브', state: 'in', img: true,
    line: '레시피를 붙여 넣으면 모든 요리가 동시에 뜨겁게 끝나는 일정 하나를 만듭니다.',
    body: [
      '빌드 시스템의 의존성 계산을 부엌에 옮겼습니다. 화구와 오븐 수, 요리하는 사람 수를 넣으면 언제 무엇을 시작할지 계산합니다.',
      '중간에 고기가 덜 익어 시간을 늘리면, 영향을 받는 단계만 다시 계산해 상 차리는 시각을 고칩니다.',
    ],
    facts: [['대회', 'Kiroween 2026, Frankenstein 부문'], ['샘플 저녁', '5개'], ['예시', '일요일 로스트 4가지 요리, 17단계, 1시간 55분'], ['스펙 작업', '230개 중 230개 완료']],
    links: [['라이브 열기', 'https://make-dinner-kiro.onrender.com'], ['시연 영상', 'https://youtu.be/u6hX7Y6fl2M'], ['Devpost', 'https://devpost.com/software/make-dinner'], ['저장소', 'https://github.com/seunghyeon1004/make-dinner-kiro']],
  },
  {
    slug: 'bare-bones', name: 'Bare Bones', year: 2026, kind: 'contest', status: '라이브', state: 'in', img: true,
    line: '결정표 하나로 질문형 앱을 만듭니다. 빠진 경우와 충돌하는 규칙은 검사기가 찾습니다.',
    body: [
      '"이건 어느 통에 버리지?" 같은 판단을 표로 적으면, 가장 적은 질문으로 답에 이르는 순서를 엔진이 정합니다.',
      '같은 뼈대에서 분리배출 안내와 라이선스 고르기, 두 앱이 나왔습니다. 두 앱은 파일 3개만 다릅니다.',
    ],
    facts: [['대회', 'Kiroween 2026, Skeleton Crew 부문'], ['분리배출 표', '960가지 조합, 규칙 33개, 빈틈 0, 충돌 0'], ['라이선스 표', '32가지 조합, 규칙 7개, 빈틈 0, 충돌 0'], ['두 앱의 차이', '파일 3개']],
    links: [['라이브 열기', 'https://seunghyeon1004.github.io/bare-bones-kiro/'], ['시연 영상', 'https://youtu.be/DINqS8hQrLo'], ['저장소', 'https://github.com/seunghyeon1004/bare-bones-kiro']],
  },
  {
    slug: 'heirloom', name: 'Heirloom', year: 2026, kind: 'contest', status: '라이브', state: 'in', img: true,
    line: '정해진 기간 안부 확인이 끊기면 상속인이 몫을 찾아가는 솔라나 금고입니다.',
    body: [
      '소유자가 SOL을 금고에 넣고 상속인과 비율을 정합니다. 주기적으로 안부를 확인하지 않으면 유예 기간 뒤 상속인이 자기 몫을 청구할 수 있습니다.',
      'Claude는 안부 알림을 쓰고 서명 전에 거래 내용을 쉬운 말로 설명할 뿐, 자금을 옮기거나 타이머를 되돌릴 수 없습니다.',
    ],
    facts: [['대회', 'MLH Solana Hackathon'], ['배포', '솔라나 devnet, 시험용 SOL'], ['성격', '시제품이며 법적 유언이 아닙니다']],
    links: [['라이브 열기', 'https://heirloom-nine-gray.vercel.app'], ['시연 영상', 'https://youtu.be/LiBoJAFgH70'], ['저장소', 'https://github.com/seunghyeon1004/heirloom']],
  },
  {
    slug: 'pathfinder', name: 'Pathfinder', year: 2026, kind: 'contest', status: '제출', state: 'out', img: true,
    line: '1997년 화성 탐사선을 멈추게 한 버그를 QNX 8.0에서 재현하고 자동으로 찾아냅니다.',
    body: [
      'QNX 커널 트레이스를 읽어 무엇이 잘못됐고 왜 그런지, 어떻게 고치는지 알려 줍니다. 모든 주장은 증거가 되는 트레이스 이벤트를 가리킵니다.',
      '우선순위 역전, 메시지 교착, 마감 누락을 찾아 인과 사슬로 잇고, 파일 하나짜리 타임라인 보고서를 만듭니다.',
    ],
    facts: [['대회', 'QNX 해커톤, Developer Tooling 부문'], ['검증 환경', 'QNX SDP 8.0 가상 머신에서 기록한 실제 트레이스'], ['찾는 문제', '우선순위 역전, 교착, 마감 누락, CPU 기아']],
    links: [['시연 영상 보기', 'https://youtu.be/BSZ6h-TZpr0'], ['저장소', 'https://github.com/seunghyeon1004/pathfinder-qnx']],
  },
  {
    slug: 'handover', name: 'Handover', year: 2026, kind: 'contest', status: '제출', state: 'out', img: true,
    line: '팀에서 한 사람만 아는 일을 찾아내고, 자리를 비울 때 인수인계 문서를 만들어 줍니다.',
    body: [
      'Jira와 Confluence 활동에서 지식이 한 사람에게 몰린 영역을 찾습니다. 누가 자리를 비우면 진행 중인 일, 댓글에 묻힌 결정, 대신 물어볼 사람을 묶어 인수인계 키트를 만듭니다.',
      '키트는 Confluence 페이지와 Jira 후속 작업으로 발행되며, 발행 전에는 반드시 사람의 확인을 받습니다.',
    ],
    facts: [['대회', 'Atlassian Codegeist 2026'], ['플랫폼', 'Forge, Rovo 에이전트, MCP'], ['시연 데이터', '이슈 74개, 문서 14개, 가상 인물 5명']],
    links: [['시연 영상 보기', 'https://youtu.be/4RExDCLApl8'], ['저장소', 'https://github.com/seunghyeon1004/handover-codegeist']],
  },
  {
    slug: 'footnote', name: 'Footnote', year: 2026, kind: 'contest', status: '제출', state: 'out', img: true,
    line: 'AI가 답할 때마다 소액의 사용료를 걷어, 실제로 인용한 출처에게 나눠 줍니다.',
    body: [
      '답변마다 0.25~1달러의 지식 사용료를 붙이고, 기여도를 재서 출처에게 PayPal로 나눕니다. 아직 가입하지 않은 작성자의 몫은 장부에 보관했다가 소유를 증명하면 지급합니다.',
      '인용한 페이지에 "나에게 전부 보내라" 같은 주입 문구가 있으면 걸러내고 영수증에 표시합니다. NEAR 해커톤에서는 NEAR 지급 경로를 더했습니다.',
    ],
    facts: [['대회', 'PayPal 해커톤, NEAR 해커톤'], ['결제', 'PayPal 샌드박스, NEAR 테스트넷'], ['라이선스', 'MIT']],
    links: [['시연 영상 보기', 'https://youtu.be/ybIdb08caAo'], ['저장소', 'https://github.com/seunghyeon1004/footnote']],
  },
  {
    slug: 'roadschool', name: '로드스쿨', year: 2026, kind: 'contest', status: '제출', state: 'out', img: true,
    line: '달리는 차가 교실이 됩니다. 뒷좌석 아이가 지나는 곳에 맞춰 목소리로 배웁니다.',
    body: [
      '차가 지나는 장소에 맞춘 문제를 음성으로 내고 아이가 말로 답합니다. 달리는 동안에는 음성만 쓰고, 화면 터치는 정차했을 때만 열립니다.',
      '서울 잠실에서 강릉 경포까지의 주행을 시뮬레이션한 웹 시제품이며, 도착하면 부모에게 "오늘 배운 지도"를 보여 줍니다.',
    ],
    facts: [['대회', '현대자동차그룹 차량용 앱 개발 공모전'], ['형태', '웹 시제품, 주행 시뮬레이션'], ['시연 경로', '서울 잠실에서 강릉 경포']],
    links: [['시연 영상 보기', 'https://youtu.be/t3vJy4xiwxs'], ['저장소', 'https://github.com/seunghyeon1004/roadschool']],
  },
  {
    slug: 'olpark30', name: '올팍 30분', year: 2026, kind: 'contest', status: '라이브', state: 'in',
    line: '공연이 끝난 뒤 주차장에서 기다리는 시간을 올림픽공원 산책으로 바꿉니다.',
    body: [
      '공공데이터로 공연 뒤 출차 대기 시간을 추정하고, 그 시간에 맞는 공원 산책 코스를 권합니다. 휴대폰 화면에 맞춘 웹앱입니다.',
      '분석 결과는 미리 계산해 두고, 실시간 주차 대수만 기관의 공개 주소에서 받아 옵니다.',
    ],
    facts: [['대회', '한국체육산업개발 공공데이터 활용 경진대회'], ['자료', '공공데이터포털 입출차 기록, 공연 정보'], ['형태', '정적 웹앱']],
    links: [['라이브 열기', 'https://seunghyeon1004.github.io/olpark30/'], ['저장소', 'https://github.com/seunghyeon1004/olpark30']],
  },
  {
    slug: 'thesis-redteam', name: '가설 레드팀', year: 2026, kind: 'contest', status: '제출', state: 'out',
    line: '투자 가설의 사실 전제를 미국 공시 원문으로 다시 계산해, 틀린 전제를 막습니다.',
    body: [
      'SEC 원공시를 받아 자사주 매입, 주식 수, 순이익 같은 사실을 코드로 검산합니다. 언어 모델과 가격 데이터를 쓰지 않습니다.',
      '깨진 전제가 풀리지 않으면 보고서를 제출할 수 없게 하는 관문과, 고칠 수 없는 기록 장부를 함께 만들었습니다.',
    ],
    facts: [['대회', 'KIC AI 에이전트 공모전'], ['자료', 'SEC EDGAR 원공시, 기준일까지 공개된 것만'], ['구현', '파이썬 표준 라이브러리']],
    links: [['저장소 보기', 'https://github.com/seunghyeon1004/thesis-redteam-live']],
    note: '투자 권유가 아닙니다.',
  },
  {
    slug: 'pawrelay', name: 'PawRelay', year: 2026, kind: 'product', status: '출시', state: 'in', img: true,
    line: '가족이 함께 반려동물을 돌볼 때 밥, 약, 산책을 누가 했는지 한곳에 남깁니다.',
    body: [
      '급여, 물, 투약, 산책, 배변, 증상, 병원 기록을 가족이 같이 적고 넘겨받는 안드로이드 앱입니다.',
      '기획부터 구글 플레이 출시, 약관과 개인정보 처리방침, 계정 삭제 절차까지 혼자 만들고 운영했습니다.',
    ],
    facts: [['배포', '구글 플레이'], ['2026년 8월 8일 기록', '177개 국가와 지역에 버전 38 제공'], ['만든 범위', '앱, 서버, 법적 고지 페이지']],
    links: [['앱 소개 페이지', '/pawrelay/']],
  },
  {
    slug: 'mesh', name: '맥 미니 4대 영상 생성', year: 2026, kind: 'research', status: '공개', state: 'out', img: true,
    line: '맥 미니 4대를 썬더볼트로 묶어, 한 대로는 버거운 영상 모델을 나눠 돌렸습니다.',
    body: [
      '맥 미니 M4 Pro 4대를 썬더볼트 5 케이블 6가닥으로 서로 모두 잇고, 영상 생성 모델 MiniMax H3를 나눠 실행했습니다.',
      '빠르게 만드는 것보다 어느 맥도 과부하 없이 30초 영상을 만드는 것이 목표였고, 실측값과 함정을 스크립트와 함께 공개했습니다.',
    ],
    facts: [['장비', '맥 미니 M4 Pro 24GB 4대'], ['3초 영상, 1대', '338.2초'], ['3초 영상, 2대', '209.0초'], ['3초 영상, 3대', '164.8초']],
    links: [['비교 영상 보기', 'https://youtube.com/shorts/9YtuoVPRdM0'], ['만든 영상', 'https://youtu.be/UWLWwA30DeU'], ['저장소', 'https://github.com/seunghyeon1004/mac-mini-mesh-ai-video']],
  },
  {
    slug: 'f301', name: 'F301', year: 2026, kind: 'research', status: '공개', state: 'out', img: true,
    line: '수익이 나지 않은 매매 전략을, 누구나 다시 계산할 수 있는 음성 결과로 남겼습니다.',
    body: [
      '미국 레버리지 ETF 전략을 끝까지 검증한 결과 기각했습니다. 원자료에서 독립적으로 다시 계산해 숫자가 맞는지 확인했습니다.',
      '수익 전략이 아니라, 실패를 감추지 않고 감사 가능한 형태로 남긴 연구 기록입니다.',
    ],
    facts: [['거래 수', '190건'], ['기본 누적 수익률', '-24.24%'], ['같은 기간 UPRO 보유', '+26.40%'], ['독립 재계산 불일치', '0건']],
    links: [['저장소 보기', 'https://github.com/seunghyeon1004/stock-ai-negative-results-reproducibility']],
    note: '투자 권유가 아니며 실거래 시스템이 아닙니다.',
  },
  {
    slug: 'blog-auto', name: '블로그 자동 발행', year: 2026, kind: 'auto', status: '운영 중', state: 'in',
    line: '주제 선정부터 근거 수집, 작성, 검수, 발행까지 사람 손 없이 하루 다섯 편을 올립니다.',
    body: [
      '네이버 블로그와 구글 블로거에 정해진 시각마다 글을 올립니다. 글마다 근거 자료를 먼저 모으고, 별도 검수 단계를 통과해야 발행됩니다.',
      '발행이 실패하면 원인을 기록하고 같은 입력으로 다시 확인합니다. 코드는 비공개이고 결과물은 블로그에서 볼 수 있습니다.',
    ],
    facts: [['발행처', '네이버 블로그, 구글 블로거'], ['주기', '하루 5편'], ['코드', '비공개']],
    links: [['블로그 보기', 'https://blog.naver.com/seunghyeonlab']],
  },
  {
    slug: 'video-pipeline', name: '영상 제작 파이프라인', year: 2026, kind: 'auto', status: '운영 중', state: 'in',
    line: '대본 파일 하나에서 화면, 자막, 내레이션, 효과음까지 코드로 영상을 만듭니다.',
    body: [
      '화면 캡처와 대본을 넣으면 커서 움직임, 확대, 자막, 음성을 코드로 합성합니다. 같은 입력이면 같은 영상이 나오는지 두 번 렌더해 비교합니다.',
      '이 페이지의 해커톤 시연 영상들이 이 파이프라인으로 만들어졌습니다. 깜빡임, 음량, 자막 일치를 자동으로 검사합니다.',
    ],
    facts: [['렌더', 'HyperFrames, Remotion, ffmpeg'], ['검사', '두 번 렌더 일치, 한 프레임 깜빡임, 음량'], ['코드', '비공개']],
    links: [['만든 영상 예시', 'https://youtu.be/ybIdb08caAo']],
  },
  {
    slug: 'skillsets', name: 'Claude Code 스킬셋', year: 2026, kind: 'research', status: '보관', state: 'out',
    line: 'Claude Code 스킬 묶음을 고르고 연결하는 판단 체계를 한국어와 영어로 설계했습니다.',
    body: [
      '스킬 패키지의 메타데이터를 검토하고, 어떤 요청을 어디로 보낼지 정하는 경로를 결정적으로 생성하는 시스템입니다.',
      '기술 미리보기 단계에서 멈췄습니다. 20개 경로 모두 검토 보류 상태로 두었고, 실행 가능하다고 표시한 경로는 없습니다.',
    ],
    facts: [['단계', '기술 미리보기'], ['경로', '20개 모두 검토 보류'], ['코드', '보관']],
    links: [],
  },
  {
    slug: 'handoff-proof', name: 'Handoff Proof', year: 2026, kind: 'research', status: '공개', state: 'out',
    line: '남에게 넘길 파이썬 프로그램이 정말 돌아가는지, 새 환경에서 실행해 증거를 묶습니다.',
    body: [
      '로컬에서 도는 공개 모델이 소스를 읽고 실행 방법을 제안하면, 사람이 확인한 뒤 새 폴더와 가상 환경에서 실제로 돌려 봅니다.',
      '프로그램이 실패하거나 결과물이 틀리면, 종료 코드가 0이어도 실패로 남깁니다. 고객이나 판매 실적은 없는 시제품입니다.',
    ],
    facts: [['계기', 'DEV Hacktoberfest 오픈소스 AI 챌린지'], ['모델', '로컬 Qwen, 클라우드 키 없음'], ['구현', '파이썬 표준 라이브러리']],
    links: [['저장소 보기', 'https://github.com/seunghyeon1004/handoff-proof']],
  },
  {
    slug: 'krx', name: 'KRX 스크리너와 매매 봇', year: 2026, kind: 'archive', status: '종료', state: 'out',
    line: '국내 주식을 걸러내고 자동으로 매매하던 봇입니다. 2026년 5월에 운영을 끝냈습니다.',
    body: [
      '종목 스크리너와 실시간 자동매매 봇을 만들어 운영했고, 당시 대시보드는 그대로 남겨 두었습니다.',
      '2026년 5월 7일에 전체 운영을 종료했습니다. 코드는 비공개로 보관 중입니다.',
    ],
    facts: [['종료일', '2026년 5월 7일'], ['코드', '비공개 보관']],
    links: [['당시 대시보드', '/krx-dashboard.html']],
    note: '투자 권유가 아닙니다.',
  },
  {
    slug: 'trading-lab', name: '수익화 봇 실험', year: 2026, kind: 'archive', status: '종료', state: 'out',
    line: '예측 시장, 펀딩비, 차익거래 봇을 차례로 만들어 검증했고, 통과한 전략이 없어 접었습니다.',
    body: [
      '비트코인 신호 봇, 예측 시장 봇, 펀딩비 차익, 탈중앙 거래소 차익 감시를 차례로 만들고 같은 기준으로 검증했습니다.',
      '2026년 11월 재검토에서 수익이 입증된 전략은 0개였습니다. 그 결과를 숨기지 않고 기록으로 남깁니다.',
    ],
    facts: [['2026년 11월 재검토', '수익 입증 전략 0개'], ['코드', '비공개 보관']],
    links: [['당시 대시보드', '/dashboard.html']],
    note: '투자 권유가 아닙니다.',
  },
  {
    slug: 'waning-moon', name: '잔월의 서약', year: 2026, kind: 'archive', status: '종료', state: 'out', img: true,
    line: '다크 판타지 액션 게임을 만들다 2026년 10월에 개발을 끝내고 기록만 남겼습니다.',
    body: [
      '탐험, 장비 파밍, 이야기를 묶은 벨트 액션 게임입니다. 웹 버전으로 시작해 유니티 모바일로 방향을 바꿨습니다.',
      '사람이 끝까지 이어서 플레이하는 검증과 실제 기기 검증을 마치지 못했고, 2026년 10월 19일에 개발을 종료했습니다.',
    ],
    facts: [['계기', 'OpenAI Game Builders Seoul, 트랙 1'], ['종료일', '2026년 10월 19일'], ['남긴 것', '기획과 결정 기록, 화면 308장']],
    links: [['웹 버전 저장소', 'https://github.com/seunghyeon1004/waning-moon-oath-bell-of-ash']],
  },
  {
    slug: 'history-exam', name: '한국사 실전 시험실', year: 2026, kind: 'product', status: '라이브', state: 'in',
    line: '한국사능력검정시험을 실제 시험처럼 풀어 보는 웹 시험실입니다.',
    body: [
      '브라우저에서 바로 열어 문제를 풀어 보는 정적 웹페이지입니다.',
    ],
    facts: [['형태', '정적 웹페이지']],
    links: [['라이브 열기', '/history-exam/']],
  },
  {
    slug: 'rl-swarm', name: 'RL-Swarm 맥 설치 스크립트', year: 2025, kind: 'archive', status: '공개', state: 'out',
    line: '맥에서 RL-Swarm 노드를 설치하고 최적화하는 스크립트를 공개했습니다.',
    body: [
      '맥에서 RL-Swarm을 설치하고 최적화하는 과정을 스크립트로 묶어 공개했습니다.',
    ],
    facts: [['공개', '2025년 5월']],
    links: [['저장소 보기', 'https://github.com/seunghyeon1004/rl-swarm-mac-setup']],
  },
];
