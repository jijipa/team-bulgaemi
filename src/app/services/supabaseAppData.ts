import { GoalEvent, Match, MOM, Participant, Score } from "../types/data";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

type ScoreRow = {
  id: string;
  match_id: string;
  player_id: string;
  player_name: string;
  player_number: string | null;
  goals: number;
  assists: number;
  is_mercenary: boolean;
  is_opponent_goal: boolean;
  quarter_data: unknown;
};

type ParticipantRow = {
  id: string;
  match_id: string;
  player_id: string;
  player_name: string | null;
  player_number: string | null;
  is_mercenary: boolean;
};

type MomRow = {
  id: string;
  match_id: string;
  player_ids: string[];
  created_at: string;
  matches?: {
    match_date: string;
    start_time: string;
    opponent_name: string;
  } | null;
};

type GoalEventRow = {
  id: string;
  match_id: string;
  quarter: number;
  goal_type: GoalEvent["goalType"];
  scorer_id: string;
  scorer_name: string;
  scorer_is_mercenary: boolean;
  assist_id: string | null;
  assist_name: string | null;
  assist_is_mercenary: boolean;
  is_opponent_goal: boolean;
  timestamp: string;
  created_at: string;
};

export type SupabaseAppData = {
  matches: Match[];
  scores: Score[];
  participants: Participant[];
  moms: MOM[];
  goalEvents: GoalEvent[];
};

const requireSupabase = () => {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase is not configured.");
  }

  return supabase;
};

const toScoreRow = (score: Score & { playerNumber?: string; isOpponentGoal?: boolean }): ScoreRow => ({
  id: score.id,
  match_id: score.matchId,
  player_id: score.playerId,
  player_name: score.playerName,
  player_number: score.playerNumber || null,
  goals: score.goals,
  assists: score.assists,
  is_mercenary: Boolean(score.isMercenary),
  is_opponent_goal: Boolean(score.isOpponentGoal),
  quarter_data: score.quarterData || null,
});

const fromScoreRow = (row: ScoreRow): Score => ({
  id: row.id,
  matchId: row.match_id,
  playerId: row.player_id,
  playerName: row.player_name,
  playerNumber: row.player_number || undefined,
  goals: row.goals,
  assists: row.assists,
  isMercenary: row.is_mercenary,
  isOpponentGoal: row.is_opponent_goal,
  quarterData: Array.isArray(row.quarter_data)
    ? (row.quarter_data as Score["quarterData"])
    : undefined,
});

const toParticipantRow = (participant: Participant): ParticipantRow => ({
  id: participant.id,
  match_id: participant.matchId,
  player_id: participant.playerId,
  player_name: participant.playerName || null,
  player_number: participant.playerNumber || null,
  is_mercenary: Boolean(participant.isMercenary),
});

const fromParticipantRow = (row: ParticipantRow): Participant => ({
  id: row.id,
  matchId: row.match_id,
  playerId: row.player_id,
  playerName: row.player_name || undefined,
  playerNumber: row.player_number || undefined,
  isMercenary: row.is_mercenary,
});

const toGoalEventRow = (event: GoalEvent): GoalEventRow => ({
  id: event.id,
  match_id: event.matchId,
  quarter: event.quarter,
  goal_type: event.goalType,
  scorer_id: event.scorerId,
  scorer_name: event.scorerName,
  scorer_is_mercenary: event.scorerIsMercenary,
  assist_id: event.assistId,
  assist_name: event.assistName,
  assist_is_mercenary: event.assistIsMercenary,
  is_opponent_goal: event.isOpponentGoal,
  timestamp: event.timestamp,
  created_at: event.createdAt,
});

const fromGoalEventRow = (row: GoalEventRow): GoalEvent => ({
  id: row.id,
  matchId: row.match_id,
  quarter: row.quarter,
  goalType: row.goal_type,
  scorerId: row.scorer_id,
  scorerName: row.scorer_name,
  scorerIsMercenary: row.scorer_is_mercenary,
  assistId: row.assist_id,
  assistName: row.assist_name,
  assistIsMercenary: row.assist_is_mercenary,
  isOpponentGoal: row.is_opponent_goal,
  timestamp: row.timestamp,
  createdAt: row.created_at,
});

export const fetchScoresFromSupabase = async (): Promise<Score[]> => {
  const client = requireSupabase();
  const { data, error } = await client.from("scores").select("*");
  if (error) throw error;
  return (data || []).map((row) => fromScoreRow(row as ScoreRow));
};

export const fetchParticipantsFromSupabase = async (): Promise<Participant[]> => {
  const client = requireSupabase();
  const { data, error } = await client.from("participants").select("*");
  if (error) throw error;
  return (data || []).map((row) => fromParticipantRow(row as ParticipantRow));
};

export const fetchMomsFromSupabase = async (): Promise<MOM[]> => {
  const client = requireSupabase();
  const { data, error } = await client
    .from("moms")
    .select("*, matches(match_date, start_time, opponent_name)")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map((row) => {
    const mom = row as MomRow;
    return {
      id: mom.id,
      matchId: mom.match_id,
      matchDate: mom.matches?.match_date || "",
      matchTime: mom.matches?.start_time || "",
      opponentName: mom.matches?.opponent_name || "",
      playerIds: mom.player_ids,
      playerNames: [],
      playerNumbers: [],
      createdAt: mom.created_at,
    };
  });
};

export const fetchGoalEventsFromSupabase = async (): Promise<GoalEvent[]> => {
  const client = requireSupabase();
  const { data, error } = await client.from("goal_events").select("*");
  if (error) throw error;
  return (data || []).map((row) => fromGoalEventRow(row as GoalEventRow));
};

export const fetchAppDataFromSupabase = async (
  matches: Match[],
): Promise<SupabaseAppData> => {
  if (!isSupabaseConfigured || !supabase) {
    return { matches, scores: [], participants: [], moms: [], goalEvents: [] };
  }

  const [scores, participants, moms, goalEvents] = await Promise.all([
    fetchScoresFromSupabase(),
    fetchParticipantsFromSupabase(),
    fetchMomsFromSupabase(),
    fetchGoalEventsFromSupabase(),
  ]);

  return { matches, scores, participants, moms, goalEvents };
};

export const replaceScoresForMatchInSupabase = async (
  matchId: string,
  scores: Array<Score & { playerNumber?: string; isOpponentGoal?: boolean }>,
): Promise<void> => {
  const client = requireSupabase();
  const { error: deleteError } = await client
    .from("scores")
    .delete()
    .eq("match_id", matchId);
  if (deleteError) throw deleteError;

  if (scores.length === 0) return;

  const { error: insertError } = await client
    .from("scores")
    .upsert(scores.map(toScoreRow), { onConflict: "id" });
  if (insertError) throw insertError;
};

export const replaceParticipantsForMatchInSupabase = async (
  matchId: string,
  participants: Participant[],
): Promise<void> => {
  const client = requireSupabase();
  const { error: deleteError } = await client
    .from("participants")
    .delete()
    .eq("match_id", matchId);
  if (deleteError) throw deleteError;

  if (participants.length === 0) return;

  const { error: insertError } = await client
    .from("participants")
    .upsert(participants.map(toParticipantRow), { onConflict: "id" });
  if (insertError) throw insertError;
};

export const replaceGoalEventsForMatchInSupabase = async (
  matchId: string,
  goalEvents: GoalEvent[],
): Promise<void> => {
  const client = requireSupabase();
  const { error: deleteError } = await client
    .from("goal_events")
    .delete()
    .eq("match_id", matchId);
  if (deleteError) throw deleteError;

  if (goalEvents.length === 0) return;

  const { error: insertError } = await client
    .from("goal_events")
    .upsert(goalEvents.map(toGoalEventRow), { onConflict: "id" });
  if (insertError) throw insertError;
};

export const upsertScoresInSupabase = async (
  scores: Array<Score & { playerNumber?: string; isOpponentGoal?: boolean }>,
): Promise<void> => {
  if (scores.length === 0) return;

  const client = requireSupabase();
  const { error } = await client
    .from("scores")
    .upsert(scores.map(toScoreRow), { onConflict: "id" });

  if (error) throw error;
};

export const upsertParticipantsInSupabase = async (
  participants: Participant[],
): Promise<void> => {
  if (participants.length === 0) return;

  const client = requireSupabase();
  const { error } = await client
    .from("participants")
    .upsert(participants.map(toParticipantRow), { onConflict: "id" });

  if (error) throw error;
};

export const upsertGoalEventsInSupabase = async (
  goalEvents: GoalEvent[],
): Promise<void> => {
  if (goalEvents.length === 0) return;

  const client = requireSupabase();
  const { error } = await client
    .from("goal_events")
    .upsert(goalEvents.map(toGoalEventRow), { onConflict: "id" });

  if (error) throw error;
};

export const upsertMomsInSupabase = async (
  moms: MOM[],
): Promise<void> => {
  if (moms.length === 0) return;

  const client = requireSupabase();
  const payload = moms.map((mom) => ({
    id: mom.id,
    match_id: mom.matchId,
    player_ids: mom.playerIds,
    created_at: mom.createdAt,
  }));

  const { error } = await client
    .from("moms")
    .upsert(payload, { onConflict: "id" });

  if (error) throw error;
};

export const saveMomToSupabase = async (
  matchId: string,
  playerIds: string[],
): Promise<void> => {
  const client = requireSupabase();
  const { error } = await client.from("moms").upsert(
    {
      id: `mom_${matchId}`,
      match_id: matchId,
      player_ids: playerIds,
      created_at: new Date().toISOString(),
    },
    { onConflict: "match_id" },
  );

  if (error) throw error;
};
