# seunghyeon1004.github.io

백승현의 작업 색인. 정적 페이지이며 빌드 도구 의존성이 없습니다.

## 고치는 법

1. 프로젝트를 더하거나 고치려면 `site/projects.mjs`만 수정합니다.
2. 결과 화면은 `assets/work/<slug>.webp`(가로 1600 이하)와 `assets/work/thumb/<slug>.webp`(가로 800 이하)에 넣고, 해당 항목에 `img: true`를 줍니다.
3. `node build.mjs`를 실행하면 `index.html`, `work/<slug>/index.html`, `sitemap.xml`이 다시 만들어집니다. (ImageMagick 필요)
4. 미리보기: `python3 -m http.server 18790 --bind 127.0.0.1`

## 건드리면 안 되는 경로

- `/pawrelay/` 앱의 약관과 개인정보 처리방침 주소
- `/fox-after-school-lab/`, `/app-ads.txt` 외부 서비스가 참조
- `.github/workflows/daily-report.yml` 지갑 주소는 저장소 시크릿 `HL_WALLET`에서 읽음

## 원칙

- 숫자는 각 프로젝트 기록에서 확인한 값만 씁니다. 근거 범위는 `docs/portfolio-evidence.md`.
- X 자동화와 가족 관련 프로젝트는 싣지 않습니다.
