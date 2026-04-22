# Goal Events Implementation TODO

## 목적

이 문서는 골 데이터를 `GoalEvents` 방식으로 바꾸기 위해
실제로 해야 할 작업을 순서대로 정리한 체크리스트다.

핵심 목표:

- 골 1개 = 이벤트 1개 저장
- 수정 화면 정확 복원
- 도움 없는 골 오류 제거
- 팀원 골 / 상대 자책골 / 용병 골 구분

## 큰 흐름

작업은 아래 순서로 진행하는 것이 안전하다.

1. 데이터 타입 정리
2. 로컬 저장 구조 추가
3. 구글 시트 구조 추가
4. 저장 로직 변경
5. 불러오기 로직 변경
6. 과거 데이터 fallback 유지
7. 검증

## 1. 타입 정의

- [ ] `GoalType` 추가
- [ ] `GoalEvent` 타입 확정
- [ ] 골 종류를 아래 4개로 확정
- [ ] `team_player`
- [ ] `opponent_own_goal`
- [ ] `mercenary`
- [ ] `opponent_team`

확인 포인트:

- 도움이 없을 때 `assistId`, `assistName`은 `null` 또는 빈값으로 일관되게 유지
- 실점은 `goalType = opponent_team`으로 구분

## 2. 로컬 저장소 추가

- [ ] `soccer_goal_events` 키 추가
- [ ] `saveGoalEvents()` 추가
- [ ] `getGoalEvents()` 추가
- [ ] `replaceGoalEventsByMatchId()` 추가
- [ ] 경기 삭제 시 관련 goal events도 함께 삭제
- [ ] export/import 데이터에도 `goalEvents` 포함

목표:

- 브라우저 안에서도 골 이벤트 원본을 유지할 수 있어야 한다

## 3. 구글 시트 구조 추가

- [ ] `GoalEvents` 탭 추가
- [ ] 헤더 생성
- [ ] 아래 열 순서 확정
- [ ] `id`
- [ ] `matchId`
- [ ] `quarter`
- [ ] `goalType`
- [ ] `scorerId`
- [ ] `scorerName`
- [ ] `scorerIsMercenary`
- [ ] `assistId`
- [ ] `assistName`
- [ ] `assistIsMercenary`
- [ ] `isOpponentGoal`
- [ ] `timestamp`
- [ ] `createdAt`

목표:

- 구글 시트 안에서 골 사건 원본을 따로 보관

## 4. Apps Script 읽기/쓰기 추가

- [ ] `getGoalEvents` 액션 추가
- [ ] `saveGoalEvents` 액션 추가
- [ ] `deleteMatchGoalEvents` 액션 추가
- [ ] `matchId` 기준 필터링 지원

목표:

- 앱이 `GoalEvents`를 읽고 저장할 수 있어야 한다

## 5. 입력 화면 저장 로직 변경

대상:

- `ScoreTracking`

해야 할 일:

- [ ] 골 입력 시 내부 상태를 이벤트 기준으로 유지
- [ ] 일반 선수 골은 `goalType = team_player`
- [ ] 상대 자책골은 `goalType = opponent_own_goal`
- [ ] 용병 골은 `goalType = mercenary`
- [ ] 상대팀 득점은 `goalType = opponent_team`
- [ ] 도움이 없으면 `assist = null`
- [ ] 최종 저장 시 `goalRecords -> GoalEvents` 변환
- [ ] `GoalEvents`를 로컬에 저장
- [ ] `GoalEvents`를 구글 시트에 저장

중요:

- 기존 `Scores` 저장은 유지하되, `GoalEvents`를 기준으로 계산해서 저장

## 6. 수정 화면 불러오기 로직 변경

대상:

- `ScoreTracking` 수정 모드

해야 할 일:

- [ ] 수정 화면 진입 시 먼저 `GoalEvents` 조회
- [ ] 있으면 `GoalEvents`로 바로 복원
- [ ] 없으면 기존 `Scores` 기반 복원 사용
- [ ] `GoalEvents`가 있을 때는 도움 추정 로직 사용하지 않기

핵심:

- 새 데이터는 정확 복원
- 과거 데이터는 fallback

## 7. 집계 로직 정리

대상:

- `Scores` 생성 로직
- 통계 계산 로직

해야 할 일:

- [ ] `GoalEvents`를 순회해서 선수별 골/도움 수 계산
- [ ] 팀원/용병/상대 자책골/실점을 구분 처리
- [ ] `quarterData`는 `GoalEvents` 기준으로 재계산
- [ ] `Scores`는 원본이 아니라 집계 결과로 취급

목표:

- 복원은 `GoalEvents`
- 통계는 `Scores`

## 8. UI 확인 포인트

- [ ] 도움 없는 골이 저장 후 다시 들어와도 도움 없음으로 유지되는지
- [ ] 같은 쿼터에 골이 여러 개 있어도 도움자가 섞이지 않는지
- [ ] 용병 득점이 일반 선수 골로 보이지 않는지
- [ ] 상대 자책골이 일반 선수 골로 잡히지 않는지
- [ ] 실점이 우리 팀 골로 잘못 계산되지 않는지

## 9. 기존 데이터 대응

- [ ] 예전 경기에는 `GoalEvents`가 없을 수 있음을 허용
- [ ] 과거 데이터는 `Scores` 기반 fallback 유지
- [ ] 새로 저장되는 경기부터 `GoalEvents` 원본 사용

원칙:

- 과거 데이터까지 한 번에 완벽 복구하려 하지 않는다
- 새 데이터부터 정확도를 높인다

## 10. 테스트 시나리오

### 시나리오 A. 도움 없는 일반 선수 골

- [ ] 팀원 골 입력
- [ ] 도움 없이 저장
- [ ] 수정 화면 재진입
- [ ] 도움이 붙지 않는지 확인

### 시나리오 B. 같은 쿼터 다중 골

- [ ] 같은 쿼터에 3골 입력
- [ ] 그중 1개만 도움 있음
- [ ] 저장 후 재진입
- [ ] 정확히 1개에만 도움 표시되는지 확인

### 시나리오 C. 용병 득점

- [ ] 용병 골 입력
- [ ] 저장 후 재진입
- [ ] 용병으로 복원되는지 확인

### 시나리오 D. 상대 자책골

- [ ] 자책골 입력
- [ ] 저장 후 재진입
- [ ] `자책골`로 그대로 복원되는지 확인

### 시나리오 E. 실점

- [ ] 상대팀 득점 입력
- [ ] 저장 후 재진입
- [ ] 우리 팀 골과 섞이지 않는지 확인

## 11. 완료 기준

아래가 되면 1차 구현 완료로 본다.

- [ ] 새 경기 저장 시 `GoalEvents`가 만들어진다
- [ ] 수정 화면이 `GoalEvents`로 복원된다
- [ ] 도움 없는 골에 엉뚱한 이름이 붙지 않는다
- [ ] 팀원 골 / 상대 자책골 / 용병 골 / 실점이 구분된다
- [ ] 기존 `Scores` 기반 통계가 계속 나온다

## 추천 작업 순서

가장 현실적인 순서는 아래다.

1. 타입/스토리지 추가
2. Apps Script에 `GoalEvents` 탭 읽기/쓰기 추가
3. 저장 시 `GoalEvents` 같이 저장
4. 수정 화면에서 `GoalEvents` 우선 복원
5. 마지막으로 테스트

## 가장 쉬운 요약

이 작업은 "골 숫자를 저장하는 방식"에서
"골 사건을 저장하는 방식"으로 바꾸는 일이다.

그래야 나중에 수정 화면에 다시 들어와도
그때 입력한 그대로 복원할 수 있다.
