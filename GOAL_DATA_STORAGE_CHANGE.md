# Goal Data Storage Change

## 한 줄 요약

기존에는 `선수 1명당 쿼터별 골/도움 개수`를 저장했지만, 앞으로는 `골 1개 = 이벤트 1개` 방식으로 저장한다.

## 왜 바꾸나

기존 방식은 합계 데이터 중심이라서, 나중에 수정 화면에 다시 들어왔을 때

- 어떤 골이 누구의 골이었는지
- 그 골의 도움자가 누구였는지
- 도움 없는 골이었는지

를 정확하게 복원할 수 없었다.

특히 아래 문제가 생겼다.

- 같은 쿼터 안에서 골 수와 도움 수만 남아 있어서
- 실제로는 도움 없는 골인데도
- 나중에 복원할 때 다른 팀원의 이름이 도움자로 붙을 수 있었다

즉, **통계는 남아 있지만 사건 자체는 사라지는 구조**였다.

## 기존 방식

기존에는 `Scores` 중심으로 저장했다.

예를 들어 어떤 선수가 1쿼터에 2골 1도움을 기록하면 이런 식이었다.

```json
{
  "playerName": "홍길동",
  "goals": 2,
  "assists": 1,
  "quarterData": [
    { "quarter": 1, "goals": 2, "assists": 1 },
    { "quarter": 2, "goals": 0, "assists": 0 },
    { "quarter": 3, "goals": 0, "assists": 0 },
    { "quarter": 4, "goals": 0, "assists": 0 }
  ]
}
```

이 방식의 장점:

- 선수별 통계 계산이 쉽다
- 구글 시트로 보기 쉽다

이 방식의 한계:

- 첫 번째 골이 도움 있는 골인지, 두 번째 골이 도움 없는 골인지 알 수 없다
- 골 하나와 도움자 하나가 정확히 매칭되지 않는다
- 수정 화면 복원이 추측 기반이 된다

## 새 방식

앞으로는 `GoalEvents`라는 원본 데이터를 둔다.

핵심 원칙:

- 골 하나가 발생할 때마다 이벤트를 하나 저장한다
- 그 이벤트 안에 득점자와 도움자를 같이 넣는다
- 수정 화면은 `GoalEvents`를 그대로 읽어서 복원한다

즉:

- `Scores` = 통계/집계용
- `GoalEvents` = 수정/복원용 원본

## 골 종류

이번 변경에서 골은 아래 종류를 직접 구분해서 저장한다.

### 1. 팀원 득점

- 우리 팀 선수 데이터에 있는 선수가 넣은 골
- `goalType = "team_player"`

### 2. 상대팀 자책골

- 상대가 자책해서 우리 팀 득점으로 올라간 골
- `goalType = "opponent_own_goal"`

### 3. 용병 득점

- 팀원 데이터에는 없지만 이번 경기에 참가한 용병이 넣은 골
- `goalType = "mercenary"`

추가로 기존 실점 기록도 계속 필요하므로 아래도 유지한다.

### 4. 상대팀 득점

- 우리 팀이 실점한 경우
- `goalType = "opponent_team"`

## 새 데이터 구조

앞으로 골 하나는 대략 이런 식으로 저장된다.

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

도움이 없는 골은 이렇게 저장된다.

```json
{
  "id": "goal_event_002",
  "matchId": "match_123",
  "quarter": 1,
  "goalType": "team_player",
  "scorerId": "player_7",
  "scorerName": "홍길동",
  "scorerIsMercenary": false,
  "assistId": null,
  "assistName": null,
  "assistIsMercenary": false,
  "isOpponentGoal": false,
  "timestamp": "2026-04-20T12:01:00.000Z",
  "createdAt": "2026-04-20T12:01:00.000Z"
}
```

상대팀 자책골은 이렇게 저장된다.

```json
{
  "id": "goal_event_003",
  "matchId": "match_123",
  "quarter": 2,
  "goalType": "opponent_own_goal",
  "scorerId": "opponent_own_goal",
  "scorerName": "자책골",
  "scorerIsMercenary": false,
  "assistId": null,
  "assistName": null,
  "assistIsMercenary": false,
  "isOpponentGoal": false,
  "timestamp": "2026-04-20T12:10:00.000Z",
  "createdAt": "2026-04-20T12:10:00.000Z"
}
```

용병 득점은 이렇게 저장된다.

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

## 저장 흐름

앞으로 저장은 두 층으로 나뉜다.

### 1. GoalEvents 저장

수정 복원을 위한 원본 저장

- 골이 5개면 이벤트도 5개 저장
- 각 이벤트 안에 득점자와 도움자 정보가 들어감

### 2. Scores 저장

통계 계산용 집계 저장

- 선수별 총 골 수
- 선수별 총 도움 수
- 쿼터별 합계

즉, `GoalEvents`가 원본이고 `Scores`는 요약본이다.

## 불러오기 흐름

앞으로 수정 화면에서 데이터를 불러올 때는 아래 순서를 따른다.

### 우선순위 1. GoalEvents

- `GoalEvents`가 있으면 그걸 그대로 읽어서 화면 복원
- 누가 넣었는지, 도움이 있는지, 도움이 없는지 정확히 살아남

### 우선순위 2. Scores

- 예전 데이터처럼 `GoalEvents`가 없는 경우에만 기존 `Scores`를 사용
- 이 경우는 정확한 복원이 아니라 제한적인 fallback이다

즉, 오래된 데이터는 예전 방식으로만 어느 정도 복원하고,
새로 저장되는 경기부터는 정확 복원이 가능해진다.

## 로컬 저장 구조 변경

브라우저 임시 저장에도 `goalEvents`를 추가한다.

예상 키:

- `soccer_goal_events`

이렇게 하면:

- 수정 중 데이터 복구가 쉬워지고
- 매치 삭제 시 관련 골 이벤트도 같이 정리할 수 있다

## 구글 시트 구조 변경

구글 시트가 원본이므로, 시트에도 `GoalEvents` 탭이 추가되는 방향이 맞다.

예상 컬럼:

- `id`
- `matchId`
- `quarter`
- `goalType`
- `scorerId`
- `scorerName`
- `scorerIsMercenary`
- `assistId`
- `assistName`
- `assistIsMercenary`
- `isOpponentGoal`
- `timestamp`
- `createdAt`

기존 `Scores` 탭은 유지하되 용도를 바꾼다.

- `Scores` = 통계/집계용
- `GoalEvents` = 원본 사건 기록용

## 화면에서 기대되는 변화

사용자 입장에서는 UI가 크게 바뀌지 않을 수 있다.
하지만 내부적으로는 아래가 달라진다.

- 골을 입력하면 그 순간의 사건이 그대로 저장된다
- 수정 화면에 다시 들어왔을 때 같은 골 목록이 그대로 복원된다
- 도움 없는 골은 도움 없이 그대로 보인다
- 용병 골, 상대 자책골, 일반 선수 골이 구분된다

## 기대 효과

이 변경의 핵심 효과는 아래와 같다.

- 도움 없는 골에 엉뚱한 이름이 붙는 문제 방지
- 수정 화면 복원 정확도 상승
- 용병 득점과 일반 선수 득점 구분 가능
- 상대팀 자책골을 별도 종류로 처리 가능
- 이후 통계, 리플레이, 타임라인 기능 확장 쉬움

## 주의할 점

이 변경 이후에도 기존 예전 경기 데이터는 `GoalEvents`가 없을 수 있다.

그래서 과거 경기에는 아래가 필요하다.

- 가능하면 기존 `Scores` 기반 fallback 유지
- 새로 저장하는 경기부터는 `GoalEvents`를 원본으로 사용

즉, **새 데이터부터 정확해지고, 과거 데이터는 점진적으로 개선되는 구조**다.

## 가장 쉬운 요약

기존:

- 선수별 합계 저장
- 복원 시 추정 필요

변경 후:

- 골 하나마다 사건 저장
- 수정 시 그대로 복원 가능

핵심은

**"통계를 저장하던 구조"에서 "사건을 저장하는 구조"로 바뀌는 것**이다.
