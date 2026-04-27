# JJFC Worklog

이 문서는 `team-bulgaemi` 코드베이스에서 `JJFC` 팀을 같은 기능으로 별도 운영하기 위해 진행한 작업 맥락을 정리한 기록이다.

## 목표

- 기존 `불개미` 기능을 유지한다.
- 같은 코드베이스로 `JJFC`도 운영한다.
- URL은 분리한다.
- 팀별 데이터는 분리한다.
- 앞으로 기능 개선은 한 번만 개발해도 두 팀에 같이 반영되게 한다.

## 현재 전략

- 코드베이스는 하나 유지
- Vercel 프로젝트는 팀별로 분리
- Supabase 프로젝트도 팀별로 분리
- 팀 전용 값은 환경변수 기반 `teamConfig`로 분리

즉, 코드 복제가 아니라 `배포/데이터만 팀별 분리` 구조다.

## 생성/변경된 핵심 파일

- [src/app/config/team.ts](/Users/jihwang/Documents/team-bulgaemi/src/app/config/team.ts:1)
  팀명, slug, logo, 기본 이미지, 선수명단, 저지 색상 등을 환경변수에서 읽는 설정 파일

- [JJFC_ENV_EXAMPLE.txt](/Users/jihwang/Documents/team-bulgaemi/JJFC_ENV_EXAMPLE.txt:1)
  JJFC용 환경변수 예시

- [JJFC_SUPABASE_SETUP.sql](/Users/jihwang/Documents/team-bulgaemi/JJFC_SUPABASE_SETUP.sql:1)
  JJFC Supabase 초기 스키마/스토리지 생성 SQL

- [JJFC_SETUP_CHECKLIST.md](/Users/jihwang/Documents/team-bulgaemi/JJFC_SETUP_CHECKLIST.md:1)
  JJFC Supabase 설정 체크리스트

- [.env.bulgaemi.local](/Users/jihwang/Documents/team-bulgaemi/.env.bulgaemi.local:1)
  불개미 로컬 전용 env

- [.env.jjfc.local](/Users/jihwang/Documents/team-bulgaemi/.env.jjfc.local:1)
  JJFC 로컬 전용 env

- [scripts/run-dev.mjs](/Users/jihwang/Documents/team-bulgaemi/scripts/run-dev.mjs:1)
  `npm run dev` 실행 시 팀 선택 프롬프트를 제공하는 스크립트

## Vercel

- 기존 프로젝트:
  - `team-bulgaemi`
  - URL: `https://team-bulgaemi.vercel.app`

- 새 프로젝트:
  - `jjfc`
  - URL: `https://jjfc.vercel.app`

`jjfc` 프로젝트의 production env는 이미 넣어둔 상태다.

## JJFC Supabase

- 프로젝트 ref: `wfnqhtsxaxnrljzmdrxl`
- Project URL:
  - `https://wfnqhtsxaxnrljzmdrxl.supabase.co`
- Publishable key:
  - `sb_publishable_M0wN_vwaBvpZzT-bKL26Fg_-jGKixnk`

### 확인 결과

- Supabase URL/키는 정상
- `public.matches` 테이블 생성 완료
- REST 조회 확인 완료
- 이미지 업로드도 사용자 확인상 동작

## 팀 설정 분리 내용

`teamConfig`에서 아래 값을 분기한다.

- `VITE_TEAM_NAME`
- `VITE_TEAM_SLUG`
- `VITE_APP_TITLE`
- `VITE_STORAGE_NAMESPACE`
- `VITE_TEAM_LOGO_URL`
- `VITE_DEFAULT_MATCH_IMAGE_URL`
- `VITE_DOWNLOAD_FILE_PREFIX`
- `VITE_TEAM_PLAYERS`
- `VITE_PLAYER_JERSEY_SELECTED_COLOR`
- `VITE_PLAYER_JERSEY_UNSELECTED_COLOR`
- `VITE_PLAYER_NUMBER_SELECTED_COLOR`
- `VITE_PLAYER_NUMBER_UNSELECTED_COLOR`
- `VITE_PLAYER_SELECTION_CHECK_COLOR`
- `VITE_LEADERBOARD_JERSEY_PRIMARY_COLOR`
- `VITE_LEADERBOARD_JERSEY_SECONDARY_COLOR`
- `VITE_LEADERBOARD_JERSEY_NUMBER_COLOR`
- `VITE_IGNORE_REMOTE_MATCH_IMAGES`
- `VITE_SHOW_DEV_MODE_BADGE`

## JJFC 표시명

- 팀 표기명은 `JJFC`
- slug 및 URL은 `jjfc`

## 로컬 개발 흐름

### 실행 방법

선택형:

```bash
npm run dev
```

직접 실행:

```bash
npm run dev -- jjfc
npm run dev -- bulgaemi
```

명시 실행:

```bash
npm run dev:jjfc -- --host 127.0.0.1 --port 4177
npm run dev:bulgaemi -- --host 127.0.0.1 --port 4178
```

### 의도한 localhost 주소

- JJFC: `http://127.0.0.1:4177`
- 불개미: `http://127.0.0.1:4178`

## 현재까지 반영한 JJFC 컬러

### 선수 선택 카드 저지

- 선택 저지: `#173763`
- 비선택 저지: `#CAD3DF`
- 선택 번호: `#D5A52D`
- 비선택 번호: `#6D7683`
- 체크 배경: `#173763`

### 팀원 순위 저지

- 메인색: `#173763`
- 보조색: `#0E223F`
- 번호색: `#D5A52D`

## 로컬 테스트 중 확인된 문제와 조치

### 1. localhost에서 기본 매치 이미지 403

원인:
- 기본 이미지가 외부 Imgur URL이었고 localhost에서 403 발생

조치:
- [src/app/components/MainScreen.tsx](/Users/jihwang/Documents/team-bulgaemi/src/app/components/MainScreen.tsx:1) 에서 localhost일 때 로컬 에셋을 기본 매치 이미지로 사용하도록 변경

### 2. localhost에서 과거에 등록된 이상한 카드 이미지가 보임

원인:
- JJFC Supabase에 이미 저장된 `imageUrl`을 그대로 읽어와서 원격 이미지를 표시

조치:
- `.env.jjfc.local`에 `VITE_IGNORE_REMOTE_MATCH_IMAGES=true`
- localhost + JJFC 모드에서는 원격 `match.imageUrl` 대신 로컬 기본 이미지를 쓰도록 변경

### 3. 팀원 순위 저지 색이 안 바뀌어 보임

원인:
- 처음엔 `CardMom`만 수정했지만, 실제 `팀원 순위`의 작은 저지는 [src/app/components/MainScreen.tsx](/Users/jihwang/Documents/team-bulgaemi/src/app/components/MainScreen.tsx:1737) 안에 SVG가 직접 하드코딩되어 있었음

조치:
- 해당 SVG fill과 번호색을 `teamConfig.leaderboardJersey*` 계열 값으로 연결

### 4. 현재 localhost에서 정말 JJFC 모드인지 헷갈림

조치:
- `.env.jjfc.local`에 `VITE_SHOW_DEV_MODE_BADGE=true`
- [src/app/App.tsx](/Users/jihwang/Documents/team-bulgaemi/src/app/App.tsx:180) 루트에 `JJFC local` 배지 표시 추가

## 중요한 현재 상태

코드/빌드 기준으로는 `JJFC` 분기 값이 정상적으로 들어가고 있다.

확인 완료:

- `npm run build:jjfc` 성공
- `npm run build:bulgaemi` 성공
- `jjfc.vercel.app` 배포 성공

다만 사용자 로컬 브라우저에서 아직

- 과거 카드 이미지가 보이거나
- 저지 색상이 불개미처럼 보인다면

다음 가능성이 크다.

- 오래된 dev 서버를 보고 있음
- `npm run dev`로 잘못된 팀을 선택했음
- 브라우저 캐시가 남아 있음

## 다음 확인 절차

1. 기존 dev 서버 완전히 종료

```bash
Ctrl + C
```

2. JJFC만 직접 실행

```bash
npm run dev:jjfc -- --host 127.0.0.1 --port 4177
```

3. 브라우저에서 아래 주소 접속

```text
http://127.0.0.1:4177
```

4. 강력 새로고침

- `Cmd + Shift + R`

5. 아래 3개 확인

- 우측 상단에 `JJFC local` 배지가 보이는지
- 매치 카드가 이상한 옛날 이미지 대신 기본 이미지로 보이는지
- 팀원 순위 저지가 네이비/골드로 보이는지

## 주의

- 이 작업은 `JJFC`용 분기 작업이다.
- 기존 `불개미` Supabase 데이터는 건드리지 않는다.
- 기존 `team-bulgaemi.vercel.app` 운영을 깨지 않도록 기본값은 불개미 기준으로 유지한다.
