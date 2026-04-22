// 매치 데이터 타입
export interface Match {
  id: string;
  matchType: "soccer" | "futsal";
  playerCount: string;
  quarterCount: string;
  quarterTime: string;
  matchDate: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  location: string;
  locationLink?: string;
  opponentName: string;
  isCompleted: boolean; // 스코어 입력 완료 여부
  ourScore?: number; // 우리팀 최종 스코어
  opponentScore?: number; // 상대팀 최종 스코어
  createdAt: string; // ISO 8601 형식
  participants?: Participant[]; // 참가 선수 목록
  scores?: Score[]; // 득점 기록
  scorers?: Array<{ name: string; goals: number; assists: number }>; // 득점자 정보
  imageUrl?: string; // 경기 이미지
}

// 쿼터별 득점 데이터
export interface QuarterScore {
  quarter: number;
  goals: number;
  assists: number;
}

// 득점 데이터 타입
export interface Score {
  id: string;
  matchId: string; // 어떤 경기인지
  playerId: string;
  playerName: string;
  playerNumber?: string;
  goals: number; // 총 골 수
  assists: number; // 총 도움 수
  isMercenary?: boolean; // 용병 여부
  isOpponentGoal?: boolean; // 상대팀 득점 여부
  quarterData?: QuarterScore[]; // 쿼터별 상세 기록 (선택사항)
}

export type GoalType =
  | "team_player"
  | "opponent_own_goal"
  | "mercenary"
  | "opponent_team";

// 선수 마스터 데이터
export interface Player {
  id: string;
  number?: string;
  name: string;
  isMercenary?: boolean; // 용병 여부
  createdAt?: string; // ISO 8601 형식
}

// 선수 통계 (계산된 데이터)
export interface PlayerStats {
  playerId: string;
  playerName: string;
  totalGoals: number;
  totalAssists: number;
  matchCount: number;
  momCount?: number; // MOM 횟수 (추후 구현)
}

// 경기 참가 선수 데이터
export interface Participant {
  id: string;
  matchId: string;
  playerId: string;
  playerName?: string;
  playerNumber?: string;
  isMercenary?: boolean; // 용병 여부
}

// 용병 데이터
export interface Mercenary {
  id: string;
  name: string;
}

// MOM (Man of the Match) 데이터
export interface MOM {
  id: string;
  matchId: string;
  matchDate: string; // YY.MM.DD 형식
  matchTime: string; // HH:MM
  opponentName: string;
  playerIds: string[];
  playerNames: string | string[]; // 1명이면 문자열, 2명 이상이면 배열
  playerNumbers: string | string[];
  createdAt: string; // ISO 8601 형식
}

// 매치 상세 데이터 (수정용)
export interface MatchDetail {
  match: Match;
  participants: Participant[];
  mercenaries: Mercenary[];
  scores: Score[];
}

// ✅ GoalEvent 타입 추가 (골 이벤트 단위 저장)
export interface GoalEvent {
  id: string;
  matchId: string;
  quarter: number;
  goalType: GoalType;
  scorerId: string;
  scorerName: string;
  scorerIsMercenary: boolean;
  assistId: string | null;
  assistName: string | null;
  assistIsMercenary: boolean;
  isOpponentGoal: boolean;
  timestamp: string; // ISO 8601
  createdAt: string; // ISO 8601
}
