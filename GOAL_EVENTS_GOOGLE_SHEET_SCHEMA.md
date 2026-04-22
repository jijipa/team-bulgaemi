# Goal Events Google Sheet Schema

## 목적

이 문서는 `GoalEvents`를 구글 시트 원본 데이터로 저장할 때
어떤 탭을 만들고, 어떤 열을 두고, 각 열이 무슨 의미인지 정리한 문서다.

핵심 목적:

- 골 1개를 이벤트 1개로 저장한다
- 수정 화면에서 정확히 복원할 수 있게 한다
- 득점자와 도움자를 추정하지 않고 그대로 다시 불러온다

## 새로 추가할 탭

추천 탭 이름:

- `GoalEvents`

이 탭은 앞으로 골 데이터의 원본 탭이 된다.

정리하면:

- `GoalEvents` = 원본 사건 기록
- `Scores` = 통계/집계 기록

## 권장 열 구조

`GoalEvents` 탭의 권장 열은 아래와 같다.

1. `id`
2. `matchId`
3. `quarter`
4. `goalType`
5. `scorerId`
6. `scorerName`
7. `scorerIsMercenary`
8. `assistId`
9. `assistName`
10. `assistIsMercenary`
11. `isOpponentGoal`
12. `timestamp`
13. `createdAt`

## 각 열 설명

### `id`

- 각 골 이벤트의 고유 ID
- 골 하나당 하나

예:

- `goal_event_1713450000_ab12cd`

### `matchId`

- 어떤 경기의 골인지 연결하는 ID

예:

- `match_1713440000_xyz123`

### `quarter`

- 몇 쿼터에서 나온 골인지

값 예시:

- `1`
- `2`
- `3`
- `4`

### `goalType`

- 이 골이 어떤 종류인지 구분하는 값

권장 값:

- `team_player`
- `opponent_own_goal`
- `mercenary`
- `opponent_team`

설명:

- `team_player` = 우리 팀 등록 선수 득점
- `opponent_own_goal` = 상대팀 자책골
- `mercenary` = 용병 득점
- `opponent_team` = 상대팀 득점, 즉 우리 팀 실점

### `scorerId`

- 득점자 ID
- 자책골이나 상대팀 득점도 구분용 값이 있어야 한다

예시:

- 일반 선수: `player_7`
- 용병: `mercenary_guest_1`
- 상대 자책골: `opponent_own_goal`
- 상대팀 득점: `opponent`

### `scorerName`

- 득점자 이름

예시:

- `홍길동`
- `용병1`
- `자책골`
- `상대팀 득점`

### `scorerIsMercenary`

- 득점자가 용병인지 여부

값:

- `true`
- `false`

주의:

- `opponent_own_goal`와 `opponent_team`은 `false`로 두는 쪽이 단순하다

### `assistId`

- 도움자 ID
- 없으면 비워둔다

예시:

- `player_10`
- `mercenary_guest_2`
- 빈값

### `assistName`

- 도움자 이름
- 없으면 비워둔다

예시:

- `김철수`
- `용병2`
- 빈값

### `assistIsMercenary`

- 도움자가 용병인지 여부

값:

- `true`
- `false`

주의:

- 도움이 없으면 `false` 또는 빈값 중 하나로 규칙을 정해 일관되게 쓴다
- 추천은 `false`

### `isOpponentGoal`

- 우리 팀 실점인지 여부

값:

- `true`
- `false`

규칙:

- `goalType = opponent_team` 이면 `true`
- 나머지는 `false`

### `timestamp`

- 실제 저장 순간 시각
- 정렬이나 디버깅에 유용하다

예:

- `2026-04-20T12:01:00.000Z`

### `createdAt`

- 생성 시각
- `timestamp`와 같게 써도 된다

## 예시 행

### 1. 우리 팀 선수 득점

```json
{
  "id": "goal_event_001",
  "matchId": "match_123",
  "quarter": 1,
  "goalType": "team_player",
  "scorerId": "player_7",
  "scorerName": "홍길동",
  "scorerIsMercenary": false,
  "assistId": "player_10",
  "assistName": "김철수",
  "assistIsMercenary": false,
  "isOpponentGoal": false,
  "timestamp": "2026-04-20T12:00:00.000Z",
  "createdAt": "2026-04-20T12:00:00.000Z"
}
```

### 2. 도움 없는 우리 팀 선수 득점

```json
{
  "id": "goal_event_002",
  "matchId": "match_123",
  "quarter": 1,
  "goalType": "team_player",
  "scorerId": "player_9",
  "scorerName": "박민수",
  "scorerIsMercenary": false,
  "assistId": "",
  "assistName": "",
  "assistIsMercenary": false,
  "isOpponentGoal": false,
  "timestamp": "2026-04-20T12:03:00.000Z",
  "createdAt": "2026-04-20T12:03:00.000Z"
}
```

### 3. 상대팀 자책골

```json
{
  "id": "goal_event_003",
  "matchId": "match_123",
  "quarter": 2,
  "goalType": "opponent_own_goal",
  "scorerId": "opponent_own_goal",
  "scorerName": "자책골",
  "scorerIsMercenary": false,
  "assistId": "",
  "assistName": "",
  "assistIsMercenary": false,
  "isOpponentGoal": false,
  "timestamp": "2026-04-20T12:10:00.000Z",
  "createdAt": "2026-04-20T12:10:00.000Z"
}
```

### 4. 용병 득점

```json
{
  "id": "goal_event_004",
  "matchId": "match_123",
  "quarter": 3,
  "goalType": "mercenary",
  "scorerId": "mercenary_guest_1",
  "scorerName": "용병1",
  "scorerIsMercenary": true,
  "assistId": "player_10",
  "assistName": "김철수",
  "assistIsMercenary": false,
  "isOpponentGoal": false,
  "timestamp": "2026-04-20T12:20:00.000Z",
  "createdAt": "2026-04-20T12:20:00.000Z"
}
```

### 5. 상대팀 득점

```json
{
  "id": "goal_event_005",
  "matchId": "match_123",
  "quarter": 4,
  "goalType": "opponent_team",
  "scorerId": "opponent",
  "scorerName": "상대팀 득점",
  "scorerIsMercenary": false,
  "assistId": "",
  "assistName": "",
  "assistIsMercenary": false,
  "isOpponentGoal": true,
  "timestamp": "2026-04-20T12:30:00.000Z",
  "createdAt": "2026-04-20T12:30:00.000Z"
}
```

## 다른 탭과의 관계

### `Matches`

- 한 경기에는 여러 개의 `GoalEvents`가 연결된다
- 연결 기준: `matchId`

### `Participants`

- `GoalEvents`의 득점자/도움자가 이번 경기 참가자인지 확인하는 기준으로 사용 가능

### `Players`

- 일반 선수의 기준 목록
- `team_player`일 때 연결 기준이 된다

### `Scores`

- `GoalEvents`를 바탕으로 계산한 집계 결과
- 수정 화면의 원본이 아니라 요약 통계용

## 저장 규칙

권장 규칙:

1. 골이 생길 때마다 `GoalEvents`에 1행 추가
2. 경기 저장 완료 시 `Scores`는 `GoalEvents`를 바탕으로 다시 계산
3. 수정 저장 시에는 해당 `matchId`의 기존 `GoalEvents`를 지우고 새로 저장

즉:

- `GoalEvents`는 원본
- `Scores`는 계산 결과

## 수정 화면 복원 규칙

복원은 아래 순서가 안전하다.

1. `GoalEvents` 조회
2. `matchId`로 해당 경기 이벤트만 필터링
3. `quarter`와 `timestamp` 순으로 정렬
4. 그대로 화면에 복원

이렇게 하면:

- 도움 없는 골은 도움 없이 복원되고
- 용병 골도 정확히 구분되고
- 상대 자책골도 일반 골과 섞이지 않는다

## 가장 쉬운 요약

이 탭은 "골 통계표"가 아니라
"골이 실제로 어떻게 발생했는지 적는 사건 기록표"다.

`GoalEvents`가 있어야 수정 화면에서 같은 장면을 다시 살릴 수 있다.
