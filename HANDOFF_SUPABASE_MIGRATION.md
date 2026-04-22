# Handoff: Supabase Migration Work

## 목적

이 문서는 다른 채팅에서 바로 이어서 작업할 수 있도록 현재까지 진행한 내용을 정리한 인수인계 문서다.

핵심 목표:

- 기존 Google Sheets 기반 앱을 Supabase로 점진 이전
- UI는 최대한 유지
- 먼저 `경기 등록 -> Supabase 저장 -> 매치 목록 조회`를 테스트
- 이후 득점 데이터는 `GoalEvents` 방식으로 전환

## 현재 큰 전제

- 기존 원본 데이터는 Google Sheets다.
- 지금은 전체 마이그레이션이 아니라 Supabase 연결 테스트 단계다.
- 우선 `matches` 테이블만 Supabase에 붙였다.
- 기존 Google Sheets 데이터는 Supabase에 아직 이관하지 않았다.
- 따라서 Supabase 매치 리스트는 현재 비어 있는 것이 정상이다.

## Supabase 정보

Project ref:

```txt
rteqastcfrywbqxlpihb
```

Project URL:

```txt
https://rteqastcfrywbqxlpihb.supabase.co
```

Publishable key:

```txt
sb_publishable_cP-KIH6SUyHD6GIQPHDhyQ_Ohhd2hwu
```

주의:

- 이 키는 브라우저 앱에서 쓰는 publishable key다.
- secret key는 절대 프론트 코드에 넣으면 안 된다.

## 설치/환경 설정

추가 설치:

```bash
npm install @supabase/supabase-js
```

추가된 환경 파일:

- `.env.local`
- `.env.example`

`.env.local` 내용:

```env
VITE_SUPABASE_URL=https://rteqastcfrywbqxlpihb.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_cP-KIH6SUyHD6GIQPHDhyQ_Ohhd2hwu
```

## Supabase 테이블

현재 테스트용으로 `matches` 테이블만 만든 상태다.

스키마 파일:

- `SUPABASE_MATCHES_SCHEMA.sql`

Supabase SQL Editor에서 이 파일 내용을 실행했다.

테이블 접근 확인 결과:

```txt
[]
```

의미:

- `matches` 테이블은 접근 가능
- 아직 저장된 데이터는 없음

## 추가된 Supabase 코드

### `src/app/lib/supabase.ts`

역할:

- Supabase 클라이언트 생성
- `.env.local`의 URL/key 사용
- 설정 여부 확인용 `isSupabaseConfigured` 제공

### `src/app/services/supabaseMatches.ts`

역할:

- 앱의 `Match` 타입을 Supabase row 형태로 변환
- Supabase row를 앱의 `Match` 타입으로 변환
- `saveMatchToSupabase(match)` 제공
- `fetchMatchesFromSupabase()` 제공

## 현재 Supabase로 연결된 기능

### 1. 경기 등록 저장

파일:

- `src/app/components/MatchRegistration.tsx`

현재 동작:

- 기존처럼 LocalStorage에 저장
- Supabase 설정이 있으면 `matches` 테이블에도 저장
- 기존 Google Sheets 저장 코드도 아직 유지

중요:

- UI는 바꾸지 않았다.
- 저장 경로만 하나 추가한 상태다.

### 2. 매치 리스트 조회

파일:

- `src/app/components/MatchListScreen.tsx`

현재 동작:

- Supabase 설정이 있으면 `matches` 테이블에서 읽음
- 읽은 결과를 `localStorage.soccer_matches`에 넣음
- 기존 `useMatchData()`가 LocalStorage를 읽어 화면에 표시

주의:

- Supabase `matches`가 비어 있으면 기존 Google Sheets 매치가 안 보인다.
- 이건 테스트용 전환 상태라 정상이다.
- 그래서 빈 상태 안내를 추가했다.

## 빈 화면 문제와 수정 내용

문제:

- 메인 화면에서 매치 우측 화살표를 눌렀을 때, `매치 추가` 버튼만 보이고 본문은 흰 화면처럼 보였다.
- 매치 추가 화면에서도 `다음`, `이전` 버튼은 보이는데 본문이 안 보이는 문제가 있었다.

원인:

- 앱 루트가 스크롤 가능한 구조였다.
- 메인 화면에서 스크롤된 위치가 새 화면으로 넘어가며 유지됐다.
- 새 화면의 본문은 위로 밀리고, 하단 fixed 버튼만 계속 보였다.

수정:

- `App.tsx`
  - 화면 전환 시 스크롤을 맨 위로 초기화
  - 루트 컨테이너를 `h-screen min-h-screen` 기준으로 변경
- `MatchListScreen.tsx`
  - 화면을 `fixed inset-0`으로 viewport에 고정
  - 본문 영역에 `top`과 `bottom`을 모두 줘서 높이를 명확히 잡음
  - 빈 상태 안내 추가
- `MatchRegistration.tsx`
  - 등록 플로우를 `fixed inset-0` 화면으로 감쌈
- `MatchRegistrationStep1.tsx`
- `MatchRegistrationStep2.tsx`
- `MatchRegistrationStep3.tsx`
  - 각 단계 화면을 `h-screen min-h-screen` 기준으로 안정화

빌드 확인:

```bash
npm run build
```

결과:

```txt
✓ built
```

## 현재 사용자가 테스트해야 할 흐름

개발 서버 실행:

```bash
npm run dev
```

테스트 주소:

```txt
http://127.0.0.1:4173/
```

테스트 순서:

1. 브라우저에서 `Cmd + Shift + R` 강력 새로고침
2. 메인 화면에서 매치 섹션 우측 화살표 클릭
3. 매치 리스트 화면 확인
4. Supabase에 데이터가 없으면 빈 상태 안내가 보여야 정상
5. `매치 추가` 클릭
6. 경기 등록 폼 본문이 보이는지 확인
7. 경기 등록 완료
8. 매치 리스트에 새 경기가 뜨는지 확인
9. 새로고침 후에도 남아 있으면 Supabase 저장/조회 1차 성공

## 현재 변경된 주요 파일

수정됨:

- `package.json`
- `package-lock.json`
- `src/app/App.tsx`
- `src/app/components/MatchListScreen.tsx`
- `src/app/components/MatchRegistration.tsx`
- `src/app/components/MatchRegistrationStep1.tsx`
- `src/app/components/MatchRegistrationStep2.tsx`
- `src/app/components/MatchRegistrationStep3.tsx`

추가됨:

- `src/app/lib/supabase.ts`
- `src/app/services/supabaseMatches.ts`
- `.env.local`
- `.env.example`
- `SUPABASE_MATCHES_SCHEMA.sql`
- `GOAL_DATA_STORAGE_CHANGE.md`
- `GOAL_EVENTS_GOOGLE_SHEET_SCHEMA.md`
- `GOAL_EVENTS_IMPLEMENTATION_TODO.md`

## GoalEvents 관련 정리

기존 문제:

- 현재 득점 데이터는 선수별/쿼터별 골 수와 도움 수만 저장한다.
- 그래서 수정 화면에 다시 들어가면 어떤 골에 어떤 도움자가 붙었는지 정확히 알 수 없다.
- 도움 없는 골에도 다른 선수 이름이 도움자로 붙는 문제가 있었다.

결정한 방향:

- `골 1개 = GoalEvent 1개`로 저장한다.
- `Scores`는 통계/집계용으로 유지한다.
- `GoalEvents`를 수정 화면 복원용 원본으로 쓴다.

골 종류:

- `team_player`: 우리 팀 등록 선수 득점
- `opponent_own_goal`: 상대팀 자책골
- `mercenary`: 용병 득점
- `opponent_team`: 상대팀 득점, 즉 실점

관련 문서:

- `GOAL_DATA_STORAGE_CHANGE.md`
- `GOAL_EVENTS_GOOGLE_SHEET_SCHEMA.md`
- `GOAL_EVENTS_IMPLEMENTATION_TODO.md`

## GoalEvents 현재 구현 상태

주의:

- GoalEvents는 아직 완전히 구현되지 않았다.
- 문서와 일부 타입/스토리지 작업이 진행되었거나 진행 중인 상태였다.
- 다음 작업자가 현재 코드 상태를 먼저 확인해야 한다.

확인할 파일:

- `src/app/types/data.ts`
- `src/app/utils/storage.ts`
- `src/app/components/ScoreTracking.tsx`

필요한 다음 구현:

1. `GoalEvent` 타입 최종 확인
2. 로컬 저장소 `soccer_goal_events` 확인
3. Apps Script 또는 Supabase에 `goal_events` 저장 경로 추가
4. `ScoreTracking` 저장 시 `goalRecords -> GoalEvents` 변환
5. 수정 화면 진입 시 `GoalEvents` 우선 복원
6. `GoalEvents`가 없는 과거 데이터만 기존 `Scores` 방식 fallback

## 다음 우선순위

### 우선순위 1. 현재 화면 표시 문제 최종 확인

- 매치 리스트 본문이 보이는지
- 매치 추가 화면 본문이 보이는지
- 모바일 responsive 모드에서도 보이는지

### 우선순위 2. Supabase 저장/조회 1차 테스트

- 경기 등록
- Supabase `matches`에 row 생성 확인
- 매치 리스트에 새 경기 표시 확인
- 새로고침 후 유지 확인

### 우선순위 3. Supabase 이관 범위 확장

다음 테이블 후보:

- `participants`
- `scores`
- `goal_events`
- `moms`
- `players`

### 우선순위 4. GoalEvents 구현

- 도움 없는 골 복원 문제를 근본 해결
- 용병 득점, 상대 자책골, 팀원 득점 구분

## 주의할 점

- 지금 Supabase에는 기존 Google Sheets 데이터가 없다.
- 따라서 Supabase 테스트 중에는 과거 매치가 안 보이는 것이 정상이다.
- 전체 앱이 Supabase로 이관된 것은 아니다.
- 현재는 `matches`만 Supabase 테스트 경로가 붙었다.
- Google Sheets 코드는 아직 대부분 남아 있다.
- 실제 운영 전에는 Google Sheets와 Supabase 중 어느 쪽을 읽을지 명확히 전환해야 한다.

## 마지막 확인 명령

빌드 확인:

```bash
npm run build
```

Supabase matches 조회 확인:

```bash
curl -s 'https://rteqastcfrywbqxlpihb.supabase.co/rest/v1/matches?select=id,opponent_name,match_date&limit=10' \
  -H 'apikey: sb_publishable_cP-KIH6SUyHD6GIQPHDhyQ_Ohhd2hwu' \
  -H 'Authorization: Bearer sb_publishable_cP-KIH6SUyHD6GIQPHDhyQ_Ohhd2hwu'
```

예상:

```json
[]
```

또는 새 경기를 등록했다면 등록된 match row들이 나온다.
