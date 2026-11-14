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
    line: '동네 데이터를 말로 물어보면 직접 계산해서 답해 줘요. 답에 쓴 숫자가 맞는지도 하나씩 확인해요.',
    body: [
      '제주 주민이 지도에서 동네를 누르거나 한 줄로 물어보면, 제주데이터허브 자료 중에 필요한 걸 받아서 코드로 계산하고 짧은 한국어로 답해 줘요.',
      '답마다 질문을 어떻게 이해했는지, 답에 쓴 숫자가 계산값과 맞는지를 같이 보여 줘요. 자료에 없는 주제는 지어내지 않고, 대신 물어볼 수 있는 질문을 알려 줘요.',
    ],
    facts: [['대회', '제주 AI·빅데이터 AI Agent 챌린지'], ['쓰는 자료', '제주데이터허브 8종'], ['다루는 범위', '읍면동 43곳'], ['숫자 검증', '예시 답 29개의 숫자 200개 모두 일치']],
    links: [['시연 영상 보기', 'https://youtu.be/QegpU0ibnRc']],
  },
  {
    slug: 'seance', name: 'Séance', year: 2026, kind: 'contest', status: '라이브', state: 'in', img: true,
    line: '코드 한 줄을 고르면 그 줄의 git 기록만 가지고 왜 그렇게 짰는지 답해요. 인용이 진짜인지도 검사해요.',
    body: [
      '코드 한 줄을 고르면 그 줄을 거쳐 간 커밋을 모아 장부를 만들고, 원작자의 목소리로 왜 이렇게 짰는지 답해요.',
      '답에 나오는 주장은 전부 커밋을 인용해야 해요. 그 해시와 문장이 실제 기록에 있는지는 모델이 아니라 검사기가 대조하고, 없는 인용은 이유와 함께 지워져요.',
    ],
    facts: [['대회', 'Kiroween 2026, Costume Contest 부문'], ['검증 방식', '인용한 커밋과 문장을 코드로 대조'], ['만든 도구', 'Kiro']],
    links: [['라이브 열기', 'https://seance-kiro.onrender.com'], ['시연 영상', 'https://youtu.be/pHCNYkefrOI'], ['Devpost', 'https://devpost.com/software/seance-l35kt6'], ['저장소', 'https://github.com/seunghyeon1004/seance-kiro']],
    note: '무료 호스팅이라 처음 접속할 때는 1분쯤 걸릴 수 있어요.',
  },
  {
    slug: 'page100', name: 'Page 100', year: 2026, kind: 'contest', status: '라이브', state: 'in', img: true,
    line: '옛날 텔레텍스트를 되살려 봤어요. 오늘 뉴스와 날씨를 40열 24행 화면에서 세 자리 숫자로 넘겨 봐요.',
    body: [
      '뉴스, 날씨, 환율, 지진, 달의 위상을 옛 텔레텍스트 화면 규격 그대로 보여 줘요. 세 자리 페이지 번호를 치면 그 페이지로 넘어가요.',
      '규격을 지키는지 검사기가 모든 화면을 확인해요. 스크립트를 꺼도 읽을 수 있어요.',
    ],
    facts: [['대회', 'Kiroween 2026, Resurrection 부문'], ['화면 규격', '40열 24행, 8색'], ['분량', '30페이지, 43화면'], ['첫 방문 전송량', '11,515바이트'], ['단위와 속성 테스트', '1,211개']],
    links: [['라이브 열기', 'https://page100-kiro.onrender.com'], ['시연 영상', 'https://youtu.be/emK-JwUHP4U'], ['Devpost', 'https://devpost.com/software/page-100'], ['저장소', 'https://github.com/seunghyeon1004/page100-kiro']],
  },
  {
    slug: 'make-dinner', name: 'Make Dinner', year: 2026, kind: 'contest', status: '라이브', state: 'in', img: true,
    line: '레시피를 붙여 넣으면 모든 요리가 동시에 따뜻하게 끝나도록 순서를 짜 줘요.',
    body: [
      '빌드 시스템이 의존성을 계산하는 방식을 부엌으로 옮겨 봤어요. 화구와 오븐 수, 요리하는 사람 수를 넣으면 언제 뭘 시작해야 하는지 계산해 줘요.',
      '중간에 고기가 덜 익어서 시간을 늘리면, 영향받는 단계만 다시 계산해서 상 차리는 시각을 고쳐 줘요.',
    ],
    facts: [['대회', 'Kiroween 2026, Frankenstein 부문'], ['샘플 저녁', '5개'], ['예시', '일요일 로스트 4가지 요리, 17단계, 1시간 55분'], ['스펙 작업', '230개 중 230개 완료']],
    links: [['라이브 열기', 'https://make-dinner-kiro.onrender.com'], ['시연 영상', 'https://youtu.be/u6hX7Y6fl2M'], ['Devpost', 'https://devpost.com/software/make-dinner'], ['저장소', 'https://github.com/seunghyeon1004/make-dinner-kiro']],
  },
  {
    slug: 'bare-bones', name: 'Bare Bones', year: 2026, kind: 'contest', status: '라이브', state: 'in', img: true,
    line: '결정표 하나만 쓰면 질문형 앱이 돼요. 빠진 경우나 서로 부딪히는 규칙은 검사기가 찾아 줘요.',
    body: [
      '"이건 어느 통에 버리지?" 같은 판단을 표로 적어 두면, 가장 적은 질문으로 답에 닿는 순서를 엔진이 정해 줘요.',
      '같은 뼈대에서 분리배출 안내와 라이선스 고르기, 이렇게 앱 두 개가 나왔어요. 두 앱은 파일 3개만 달라요.',
    ],
    facts: [['대회', 'Kiroween 2026, Skeleton Crew 부문'], ['분리배출 표', '960가지 조합, 규칙 33개, 빈틈 0, 충돌 0'], ['라이선스 표', '32가지 조합, 규칙 7개, 빈틈 0, 충돌 0'], ['두 앱의 차이', '파일 3개']],
    links: [['라이브 열기', 'https://seunghyeon1004.github.io/bare-bones-kiro/'], ['시연 영상', 'https://youtu.be/DINqS8hQrLo'], ['저장소', 'https://github.com/seunghyeon1004/bare-bones-kiro']],
  },
  {
    slug: 'heirloom', name: 'Heirloom', year: 2026, kind: 'contest', status: '라이브', state: 'in', img: true,
    line: '정해 둔 기간 동안 안부 확인이 끊기면 상속인이 자기 몫을 찾아갈 수 있는 솔라나 금고예요.',
    body: [
      '소유자가 SOL을 금고에 넣고 상속인과 비율을 정해 둬요. 주기적으로 안부를 확인하지 않으면, 유예 기간이 지난 뒤 상속인이 자기 몫을 청구할 수 있어요.',
      'Claude는 안부 알림을 쓰고 서명하기 전에 거래 내용을 쉬운 말로 설명해 주기만 해요. 자금을 옮기거나 타이머를 되돌릴 수는 없어요.',
    ],
    facts: [['대회', 'MLH Solana Hackathon'], ['배포', '솔라나 devnet, 시험용 SOL'], ['성격', '시제품이고 법적 유언은 아니에요']],
    links: [['라이브 열기', 'https://heirloom-nine-gray.vercel.app'], ['시연 영상', 'https://youtu.be/LiBoJAFgH70'], ['저장소', 'https://github.com/seunghyeon1004/heirloom']],
  },
  {
    slug: 'pathfinder', name: 'Pathfinder', year: 2026, kind: 'contest', status: '제출', state: 'out', img: true,
    line: '1997년에 화성 탐사선을 멈춰 세운 버그를 QNX 8.0에서 다시 일으키고, 자동으로 잡아내요.',
    body: [
      'QNX 커널 트레이스를 읽고 뭐가 잘못됐는지, 왜 그런지, 어떻게 고치면 되는지 알려 줘요. 주장마다 증거가 되는 트레이스 이벤트를 가리켜요.',
      '우선순위 역전, 메시지 교착, 마감 누락을 찾아서 원인과 결과로 이어 주고, 파일 하나짜리 타임라인 보고서를 만들어요.',
    ],
    facts: [['대회', 'QNX 해커톤, Developer Tooling 부문'], ['검증 환경', 'QNX SDP 8.0 가상 머신에서 기록한 실제 트레이스'], ['찾는 문제', '우선순위 역전, 교착, 마감 누락, CPU 기아']],
    links: [['시연 영상 보기', 'https://youtu.be/BSZ6h-TZpr0'], ['저장소', 'https://github.com/seunghyeon1004/pathfinder-qnx']],
  },
  {
    slug: 'handover', name: 'Handover', year: 2026, kind: 'contest', status: '제출', state: 'out', img: true,
    line: '팀에서 한 사람만 아는 일을 찾아내고, 그 사람이 자리를 비울 때 인수인계 문서를 만들어 줘요.',
    body: [
      'Jira와 Confluence 활동을 보고 지식이 한 사람에게 몰린 영역을 찾아요. 누가 자리를 비우면 진행 중인 일, 댓글에 묻힌 결정, 대신 물어볼 사람을 묶어서 인수인계 키트를 만들어요.',
      '키트는 Confluence 페이지와 Jira 후속 작업으로 발행돼요. 발행하기 전에는 꼭 사람이 확인해요.',
    ],
    facts: [['대회', 'Atlassian Codegeist 2026'], ['플랫폼', 'Forge, Rovo 에이전트, MCP'], ['시연 데이터', '이슈 74개, 문서 14개, 가상 인물 5명']],
    links: [['시연 영상 보기', 'https://youtu.be/4RExDCLApl8'], ['저장소', 'https://github.com/seunghyeon1004/handover-codegeist']],
  },
  {
    slug: 'footnote', name: 'Footnote', year: 2026, kind: 'contest', status: '제출', state: 'out', img: true,
    line: 'AI가 답할 때마다 사용료를 조금씩 걷어서, 실제로 인용된 출처에 나눠 줘요.',
    body: [
      '답변마다 0.25~1달러의 지식 사용료를 붙이고, 기여도를 재서 출처에 PayPal로 나눠 줘요. 아직 가입하지 않은 작성자의 몫은 장부에 보관해 뒀다가, 소유를 증명하면 지급해요.',
      '인용한 페이지에 "나에게 전부 보내라" 같은 주입 문구가 있으면 걸러내고 영수증에 표시해요. NEAR 해커톤에서는 NEAR 지급 경로를 더했어요.',
    ],
    facts: [['대회', 'PayPal 해커톤, NEAR 해커톤'], ['결제', 'PayPal 샌드박스, NEAR 테스트넷'], ['라이선스', 'MIT']],
    links: [['시연 영상 보기', 'https://youtu.be/ybIdb08caAo'], ['저장소', 'https://github.com/seunghyeon1004/footnote']],
  },
  {
    slug: 'roadschool', name: '로드스쿨', year: 2026, kind: 'contest', status: '제출', state: 'out', img: true,
    line: '달리는 차를 교실로 만들었어요. 뒷좌석 아이가 지금 지나는 곳 이야기를 목소리로 들어요.',
    body: [
      '차가 지나는 장소에 맞춘 문제를 음성으로 내고, 아이는 말로 답해요. 달리는 동안에는 음성만 쓰고, 화면 터치는 차가 섰을 때만 열려요.',
      '서울 잠실에서 강릉 경포까지 가는 길을 시뮬레이션한 웹 시제품이에요. 도착하면 부모에게 "오늘 배운 지도"를 보여 줘요.',
    ],
    facts: [['대회', '현대자동차그룹 차량용 앱 개발 공모전'], ['형태', '웹 시제품, 주행 시뮬레이션'], ['시연 경로', '서울 잠실에서 강릉 경포']],
    links: [['시연 영상 보기', 'https://youtu.be/t3vJy4xiwxs'], ['저장소', 'https://github.com/seunghyeon1004/roadschool']],
  },
  {
    slug: 'olpark30', name: '올팍 30분', year: 2026, kind: 'contest', status: '라이브', state: 'in',
    line: '공연 끝나고 주차장에서 기다리는 시간을 올림픽공원 산책으로 바꿔 줘요.',
    body: [
      '공공데이터로 공연 뒤 출차 대기 시간을 추정하고, 그 시간에 맞는 공원 산책 코스를 권해 줘요. 휴대폰 화면에 맞춘 웹앱이에요.',
      '분석 결과는 미리 계산해 두고, 실시간 주차 대수만 기관의 공개 주소에서 받아 와요.',
    ],
    facts: [['대회', '한국체육산업개발 공공데이터 활용 경진대회'], ['자료', '공공데이터포털 입출차 기록, 공연 정보'], ['형태', '정적 웹앱']],
    links: [['라이브 열기', 'https://seunghyeon1004.github.io/olpark30/'], ['저장소', 'https://github.com/seunghyeon1004/olpark30']],
  },
  {
    slug: 'thesis-redteam', name: '가설 레드팀', year: 2026, kind: 'contest', status: '제출', state: 'out',
    line: '투자 가설에 깔린 사실을 미국 공시 원문으로 다시 계산해서, 틀린 전제를 걸러내요.',
    body: [
      'SEC 원공시를 받아서 자사주 매입, 주식 수, 순이익 같은 사실을 코드로 검산해요. 언어 모델과 가격 데이터는 쓰지 않아요.',
      '깨진 전제가 풀리지 않으면 보고서를 제출할 수 없게 막는 관문과, 고칠 수 없는 기록 장부를 같이 만들었어요.',
    ],
    facts: [['대회', 'KIC AI 에이전트 공모전'], ['자료', 'SEC EDGAR 원공시, 기준일까지 공개된 것만'], ['구현', '파이썬 표준 라이브러리']],
    links: [['저장소 보기', 'https://github.com/seunghyeon1004/thesis-redteam-live']],
    note: '투자 권유가 아니에요.',
  },
  {
    slug: 'pawrelay', name: 'PawRelay', year: 2026, kind: 'product', status: '출시', state: 'in', img: true,
    line: '가족이 같이 반려동물을 돌볼 때 밥, 약, 산책을 누가 했는지 한곳에 남겨요.',
    body: [
      '급여, 물, 투약, 산책, 배변, 증상, 병원 기록을 가족이 같이 적고 넘겨받는 안드로이드 앱이에요.',
      '기획부터 구글 플레이 출시, 약관과 개인정보 처리방침, 계정 삭제 절차까지 혼자 만들고 운영했어요.',
    ],
    facts: [['배포', '구글 플레이'], ['2026년 8월 8일 기록', '177개 국가와 지역에 버전 38 제공'], ['만든 범위', '앱, 서버, 법적 고지 페이지']],
    links: [['앱 소개 페이지', '/pawrelay/']],
  },
  {
    slug: 'mesh', name: '맥 미니 4대 영상 생성', year: 2026, kind: 'research', status: '공개', state: 'out', img: true,
    line: '맥 미니 4대를 썬더볼트로 묶어서, 한 대로는 버거운 영상 모델을 나눠 돌려 봤어요.',
    body: [
      '맥 미니 M4 Pro 4대를 썬더볼트 5 케이블 6가닥으로 서로 전부 잇고, 영상 생성 모델 MiniMax H3를 나눠서 돌렸어요.',
      '빨리 만드는 것보다, 어느 맥도 과부하 없이 30초 영상을 만들어 내는 게 목표였어요. 실측값과 빠지기 쉬운 함정은 스크립트와 함께 공개했어요.',
    ],
    facts: [['장비', '맥 미니 M4 Pro 24GB 4대'], ['3초 영상, 1대', '338.2초'], ['3초 영상, 2대', '209.0초'], ['3초 영상, 3대', '164.8초']],
    links: [['비교 영상 보기', 'https://youtube.com/shorts/9YtuoVPRdM0'], ['만든 영상', 'https://youtu.be/UWLWwA30DeU'], ['저장소', 'https://github.com/seunghyeon1004/mac-mini-mesh-ai-video']],
  },
  {
    slug: 'f301', name: 'F301', year: 2026, kind: 'research', status: '공개', state: 'out', img: true,
    line: '수익이 안 난 매매 전략이에요. 누구나 다시 계산해 볼 수 있게 마이너스 결과 그대로 남겼어요.',
    body: [
      '미국 레버리지 ETF 전략을 끝까지 검증해 보고 기각했어요. 원자료에서 따로 다시 계산해서 숫자가 맞는지도 확인했어요.',
      '수익 전략이 아니에요. 실패를 감추지 않고, 누구나 다시 따져 볼 수 있는 형태로 남긴 연구 기록이에요.',
    ],
    facts: [['거래 수', '190건'], ['기본 누적 수익률', '-24.24%'], ['같은 기간 UPRO 보유', '+26.40%'], ['독립 재계산 불일치', '0건']],
    links: [['저장소 보기', 'https://github.com/seunghyeon1004/stock-ai-negative-results-reproducibility']],
    note: '투자 권유가 아니고, 실거래 시스템도 아니에요.',
  },
  {
    slug: 'blog-auto', name: '블로그 자동 발행', year: 2026, kind: 'auto', status: '운영 중', state: 'in',
    line: '주제 고르기부터 근거 찾기, 쓰기, 검수, 발행까지 사람 손 없이 하루 다섯 편씩 올라가요.',
    body: [
      '네이버 블로그와 구글 블로거에 정해진 시각마다 글을 올려요. 글마다 근거 자료를 먼저 모으고, 따로 둔 검수 단계를 통과해야 발행돼요.',
      '발행에 실패하면 원인을 기록하고 같은 입력으로 다시 확인해요. 코드는 비공개이고, 결과물은 블로그에서 볼 수 있어요.',
    ],
    facts: [['발행처', '네이버 블로그, 구글 블로거'], ['주기', '하루 5편'], ['코드', '비공개']],
    links: [['블로그 보기', 'https://blog.naver.com/seunghyeonlab']],
  },
  {
    slug: 'video-pipeline', name: '영상 제작 파이프라인', year: 2026, kind: 'auto', status: '운영 중', state: 'in',
    line: '대본 파일 하나만 있으면 화면, 자막, 내레이션, 효과음까지 코드로 영상이 만들어져요.',
    body: [
      '화면 캡처와 대본을 넣으면 커서 움직임, 확대, 자막, 음성을 코드로 합쳐 줘요. 같은 입력이면 같은 영상이 나오는지 두 번 렌더해서 비교해요.',
      '이 페이지에 있는 해커톤 시연 영상들이 이 파이프라인으로 만든 거예요. 깜빡임, 음량, 자막이 맞는지는 자동으로 검사해요.',
    ],
    facts: [['렌더', 'HyperFrames, Remotion, ffmpeg'], ['검사', '두 번 렌더 일치, 한 프레임 깜빡임, 음량'], ['코드', '비공개']],
    links: [['만든 영상 예시', 'https://youtu.be/ybIdb08caAo']],
  },
  {
    slug: 'skillsets', name: 'Claude Code 스킬셋', year: 2026, kind: 'research', status: '보관', state: 'out',
    line: 'Claude Code 스킬을 어떻게 고르고 이어 붙일지 정리한 판단 체계예요. 한국어와 영어로 만들었어요.',
    body: [
      '스킬 패키지의 메타데이터를 검토하고, 어떤 요청을 어디로 보낼지 정하는 경로를 매번 같은 결과로 만들어 내는 시스템이에요.',
      '기술 미리보기 단계에서 멈췄어요. 20개 경로 모두 검토 보류 상태로 뒀고, 실행 가능하다고 표시한 경로는 없어요.',
    ],
    facts: [['단계', '기술 미리보기'], ['경로', '20개 모두 검토 보류'], ['코드', '보관']],
    links: [],
  },
  {
    slug: 'handoff-proof', name: 'Handoff Proof', year: 2026, kind: 'research', status: '공개', state: 'out',
    line: '남한테 넘길 파이썬 프로그램이 진짜 돌아가는지 새 환경에서 돌려 보고, 그 증거를 묶어 줘요.',
    body: [
      '로컬에서 도는 공개 모델이 소스를 읽고 실행 방법을 제안하면, 사람이 확인한 다음 새 폴더와 가상 환경에서 실제로 돌려 봐요.',
      '프로그램이 실패하거나 결과물이 틀리면, 종료 코드가 0이어도 실패로 남겨요. 고객이나 판매 실적은 없는 시제품이에요.',
    ],
    facts: [['계기', 'DEV Hacktoberfest 오픈소스 AI 챌린지'], ['모델', '로컬 Qwen, 클라우드 키 없음'], ['구현', '파이썬 표준 라이브러리']],
    links: [['저장소 보기', 'https://github.com/seunghyeon1004/handoff-proof']],
  },
  {
    slug: 'krx', name: 'KRX 스크리너와 매매 봇', year: 2026, kind: 'archive', status: '종료', state: 'out',
    line: '국내 주식을 골라서 자동으로 사고팔던 봇이에요. 2026년 5월에 운영을 끝냈어요.',
    body: [
      '종목 스크리너와 실시간 자동매매 봇을 만들어서 운영했어요. 그때 쓰던 대시보드는 그대로 남겨 뒀어요.',
      '2026년 5월 7일에 운영을 전부 끝냈어요. 코드는 비공개로 보관하고 있어요.',
    ],
    facts: [['종료일', '2026년 5월 7일'], ['코드', '비공개 보관']],
    links: [['당시 대시보드', '/krx-dashboard.html']],
    note: '투자 권유가 아니에요.',
  },
  {
    slug: 'trading-lab', name: '수익화 봇 실험', year: 2026, kind: 'archive', status: '종료', state: 'out',
    line: '예측 시장, 펀딩비, 차익거래 봇을 차례로 만들어 검증해 봤는데, 통과한 전략이 없어서 접었어요.',
    body: [
      '비트코인 신호 봇, 예측 시장 봇, 펀딩비 차익, 탈중앙 거래소 차익 감시를 차례로 만들고 같은 기준으로 검증했어요.',
      '2026년 11월에 다시 검토해 보니 수익이 입증된 전략은 0개였어요. 그 결과를 숨기지 않고 기록으로 남겨요.',
    ],
    facts: [['2026년 11월 재검토', '수익 입증 전략 0개'], ['코드', '비공개 보관']],
    links: [['당시 대시보드', '/dashboard.html']],
    note: '투자 권유가 아니에요.',
  },
  {
    slug: 'waning-moon', name: '잔월의 서약', year: 2026, kind: 'archive', status: '종료', state: 'out', img: true,
    line: '다크 판타지 액션 게임을 만들다가 2026년 10월에 멈췄어요. 기록만 남겨 뒀어요.',
    body: [
      '탐험, 장비 파밍, 이야기를 묶은 벨트 액션 게임이에요. 웹 버전으로 시작했다가 유니티 모바일로 방향을 바꿨어요.',
      '사람이 끝까지 이어서 플레이해 보는 검증과 실제 기기 검증을 마치지 못했고, 2026년 10월 19일에 개발을 끝냈어요.',
    ],
    facts: [['계기', 'OpenAI Game Builders Seoul, 트랙 1'], ['종료일', '2026년 10월 19일'], ['남긴 것', '기획과 결정 기록, 화면 308장']],
    links: [['웹 버전 저장소', 'https://github.com/seunghyeon1004/waning-moon-oath-bell-of-ash']],
  },
  {
    slug: 'history-exam', name: '한국사 실전 시험실', year: 2026, kind: 'product', status: '라이브', state: 'in',
    line: '한국사능력검정시험을 실제 시험처럼 풀어 볼 수 있는 웹 시험실이에요.',
    body: [
      '브라우저에서 바로 열어서 문제를 풀어 볼 수 있는 정적 웹페이지예요.',
    ],
    facts: [['형태', '정적 웹페이지']],
    links: [['라이브 열기', '/history-exam/']],
  },
  {
    slug: 'rl-swarm', name: 'RL-Swarm 맥 설치 스크립트', year: 2025, kind: 'archive', status: '공개', state: 'out',
    line: '맥에 RL-Swarm 노드를 설치하고 최적화하는 스크립트를 공개했어요.',
    body: [
      '맥에 RL-Swarm을 설치하고 최적화하는 과정을 스크립트로 묶어서 공개했어요.',
    ],
    facts: [['공개', '2025년 5월']],
    links: [['저장소 보기', 'https://github.com/seunghyeon1004/rl-swarm-mac-setup']],
  },
];
