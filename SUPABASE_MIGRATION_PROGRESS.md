# Supabase Migration Progress

작성 시각: 2026-04-22 15:39:25 KST

## 목표

기존 Google Apps Script 기반 데이터 저장/조회 흐름을 제거하고, Supabase를 원본 저장소로 사용한다.

현재 의도한 구조는 다음과 같다.

- Supabase: 운영 데이터 원본
- localStorage: 화면 갱신과 오프라인성 보조를 위한 로컬 캐시
- Google Apps Script: 더 이상 앱 런타임에서 사용하지 않음

## 완료된 작업

### 1. Supabase 스키마 추가

새 SQL 파일을 추가했다.

- `SUPABASE_APP_DATA_SCHEMA.sql`

이 파일은 다음 테이블을 생성/보강한다.

- `matches`
- `scores`
- `participants`
- `moms`
- `goal_events`

또한 각 테이블에 RLS를 켜고, 현재 프론트 앱이 읽기/쓰기/수정/삭제를 할 수 있도록 public policy를 생성한다.

주의: Supabase SQL Editor에서 `SUPABASE_APP_DATA_SCHEMA.sql` 내용을 전체 복사해 실행해야 실제 DB에 반영된다. 실행 중 `drop policy if exists ...` 때문에 Supabase가 destructive operation 경고를 띄우는데, 이는 테이블 데이터 삭제가 아니라 기존 RLS policy를 재생성하기 위한 것이다.

### 2. Supabase 서비스 레이어 추가

추가된 파일:

- `src/app/lib/supabase.ts`
- `src/app/services/supabaseMatches.ts`
- `src/app/services/supabaseAppData.ts`

역할:

- `supabase.ts`: Vite 환경변수 기반 Supabase 클라이언트 생성
- `supabaseMatches.ts`: matches 저장, 조회, 수정, 삭제
- `supabaseAppData.ts`: scores, participants, moms, goal_events 조회 및 match 단위 replace 저장

Supabase 문서 기준으로 `select`, `upsert`, `delete`, `update`를 사용한다.

### 3. App Script 런타임 의존 제거

삭제한 파일:

- `src/app/utils/googleDrive.ts`
- `src/app/utils/googleSheets.ts`
- `src/app/utils/jsonp.ts`

앱 내부에서 제거한 주요 App Script 동작:

- `getMatches`
- `getScores`
- `getParticipants`
- `getMOMs`
- `registerPlayers`
- `saveParticipants`
- `deleteMatchParticipants`
- `saveScores`
- `deleteMatchScores`
- `saveMOM`
- `deleteMatch`
- `updateMatch`

현재 `src/app` 안에는 App Script URL 또는 JSONP 호출이 남아 있지 않다.

### 4. 앱 데이터 흐름 변경

`App.tsx`

- 앱 시작 시 Supabase에서 matches를 가져온다.
- 이어서 scores, participants, moms, goal_events를 가져온다.
- 가져온 데이터를 localStorage에 캐시한다.
- MainScreen과 MatchListScreen은 이 캐시를 기반으로 표시한다.

`MatchRegistration.tsx`

- 매치 등록 시 Supabase `matches` 테이블에 저장한다.
- localStorage에는 화면 갱신용 캐시로 저장한다.

`MatchListScreen.tsx`

- 매치 목록 진입 시 Supabase에서 최신 데이터를 다시 읽어 localStorage 캐시를 갱신한다.
- 매치 삭제는 Supabase `matches` 삭제로 처리한다.
- FK cascade에 의해 관련 scores, participants, moms, goal_events가 DB에서 같이 삭제된다.
- localStorage 삭제 시 MOM도 함께 삭제하도록 보강했다.

`ScoreTracking.tsx`

- 스코어 저장 시 Supabase에 다음 데이터를 저장한다.
  - `matches`: 완료 상태와 최종 스코어 업데이트
  - `scores`: 선수/용병/상대팀/자책골 집계
  - `participants`: 해당 경기 참가자
  - `goal_events`: 골 이벤트 단위 원본 로그
- 수정 모드에서 기존 스코어 복원은 localStorage에 캐시된 `goal_events`를 사용한다.
- 기존처럼 골/도움 집계만으로 추정 복원하는 구조보다 정확하다.

### 5. 기존 버그 일부 수정

수정한 문제:

- 스코어 수정 시 localStorage 점수가 중복 누적되던 문제
- 매치 삭제 시 localStorage의 `soccer_moms`가 남던 문제
- “용병 없음” 선택 직후 React state 반영 전에 저장되어 플래그가 누락될 수 있던 문제
- `Score` 타입에 `playerNumber`, `isOpponentGoal` 누락
- `Player` 타입에 실제 앱에서 쓰는 `number` 필드 누락

### 6. 매치 추가 흰 화면 문제 수정

증상:

- `http://127.0.0.1:5174/`
- `매치 > 매치 추가` 클릭 시 하단 “다음” 버튼만 보이고 본문이 흰 화면처럼 보임

원인:

- 이 프로젝트는 Tailwind JIT가 아니라 `generated-utilities.css`에 생성된 유틸만 실제로 존재한다.
- 그런데 화면에서 사용하던 `h-screen`, `min-h-screen`, `z-30` 등의 클래스가 CSS에 없었다.
- 그 결과 등록 화면 컨테이너 높이가 `0px`이 되고, `overflow-hidden` 때문에 본문이 잘렸다.

수정:

- `src/styles/theme.css`에 필요한 유틸을 명시적으로 추가했다.

추가한 주요 스타일:

- `html, body, #root`
- `.h-screen`
- `.min-h-screen`
- `.z-30`
- `.bottom-[116px]`
- `.pb-[48px]`

검증:

- `npm run build` 통과
- Playwright로 `매치 > 매치 추가` 플로우 확인
- “어떤 매치를 등록할까요?” 화면이 보이는 것 확인

## 현재 확인된 상태

빌드:

```bash
npm run build
```

결과:

```text
✓ built
```

개발 서버:

```text
http://127.0.0.1:5174/
```

현재 서버는 기존 5173 포트가 사용 중이라 Vite가 5174 포트로 띄운 상태였다.

브라우저에서 변경사항이 안 보이면 강력 새로고침이 필요하다.

```text
Cmd + Shift + R
```

## 사용자가 해야 할 일

Supabase 대시보드에서 SQL을 적용해야 한다.

1. Supabase 프로젝트 열기
2. SQL Editor 이동
3. New query 클릭
4. `SUPABASE_APP_DATA_SCHEMA.sql` 내용 전체 복사
5. SQL Editor에 붙여넣기
6. Run 실행
7. destructive operation 경고가 뜨면 Run this query 클릭

성공하면 `scores`, `participants`, `moms`, `goal_events` 테이블이 생기고, 기존 `matches` 테이블은 유지된다.

## 테스트해야 할 흐름

SQL 적용 후 브라우저에서 아래 순서로 확인한다.

1. `http://127.0.0.1:5174/` 접속
2. `Cmd + Shift + R` 강력 새로고침
3. 메인 화면의 매치 섹션 오른쪽 화살표 클릭
4. 매치 리스트에서 `매치 추가` 클릭
5. 1단계 화면 본문이 보이는지 확인
6. 매치 등록 완료
7. 새로고침 후 매치가 남아있는지 확인
8. 스코어 입력 저장
9. 새로고침 후 스코어와 완료 상태가 유지되는지 확인
10. MOM 선정/수정 확인
11. 매치 삭제 후 관련 데이터가 사라지는지 확인

## 남은 작업 후보

아직 완전히 정리하지 않은 부분:

- 레포 루트에 남은 여러 Apps Script 파일과 관련 문서 정리
- `MainScreen.tsx` 내부의 변수명/주석 일부는 Supabase 표현으로 정리했지만, 통계 계산 로직 자체는 더 단순화 가능
- `ScoreTracking.tsx`의 쿼터 수는 여전히 UI가 4쿼터 기준이다. 등록 단계의 2/6/8쿼터 선택을 실제 득점 입력에 반영하는 작업이 남아 있다.
- Supabase RLS policy는 현재 public read/write/delete로 열려 있다. 운영 보안을 강화하려면 Auth 또는 별도 관리자 정책이 필요하다.
- chunk size 경고가 남아 있다. 기능상 문제는 아니지만 추후 코드 스플리팅 가능.

## 주요 변경 파일

추가:

- `SUPABASE_APP_DATA_SCHEMA.sql`
- `SUPABASE_MIGRATION_PROGRESS.md`
- `src/app/lib/supabase.ts`
- `src/app/services/supabaseMatches.ts`
- `src/app/services/supabaseAppData.ts`

수정:

- `src/app/App.tsx`
- `src/app/components/MainScreen.tsx`
- `src/app/components/MatchListScreen.tsx`
- `src/app/components/MatchRegistration.tsx`
- `src/app/components/MatchRegistrationStep1.tsx`
- `src/app/components/MatchRegistrationStep2.tsx`
- `src/app/components/MatchRegistrationStep3.tsx`
- `src/app/components/ScoreTracking.tsx`
- `src/app/types/data.ts`
- `src/app/utils/storage.ts`
- `src/styles/theme.css`
- `package.json`
- `package-lock.json`

삭제:

- `src/app/utils/googleDrive.ts`
- `src/app/utils/googleSheets.ts`
- `src/app/utils/jsonp.ts`
