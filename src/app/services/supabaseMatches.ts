import { Match } from "../types/data";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

type MatchRow = {
  id: string;
  match_type: "soccer" | "futsal";
  player_count: string;
  quarter_count: string;
  quarter_time: string;
  match_date: string;
  start_time: string;
  end_time: string;
  location: string;
  location_link: string | null;
  opponent_name: string;
  is_completed: boolean;
  our_score: number | null;
  opponent_score: number | null;
  created_at: string;
  image_url: string | null;
};

const toMatchRow = (match: Match): MatchRow => ({
  id: match.id,
  match_type: match.matchType,
  player_count: match.playerCount,
  quarter_count: match.quarterCount,
  quarter_time: match.quarterTime,
  match_date: match.matchDate,
  start_time: match.startTime,
  end_time: match.endTime,
  location: match.location,
  location_link: match.locationLink || null,
  opponent_name: match.opponentName,
  is_completed: match.isCompleted,
  our_score: match.ourScore ?? 0,
  opponent_score: match.opponentScore ?? 0,
  created_at: match.createdAt,
  image_url: match.imageUrl || null,
});

const fromMatchRow = (row: MatchRow): Match => ({
  id: row.id,
  matchType: row.match_type,
  playerCount: row.player_count,
  quarterCount: row.quarter_count,
  quarterTime: row.quarter_time,
  matchDate: row.match_date,
  startTime: row.start_time,
  endTime: row.end_time,
  location: row.location,
  locationLink: row.location_link || undefined,
  opponentName: row.opponent_name,
  isCompleted: row.is_completed,
  ourScore: row.our_score ?? 0,
  opponentScore: row.opponent_score ?? 0,
  createdAt: row.created_at,
  imageUrl: row.image_url || undefined,
});

export const saveMatchToSupabase = async (match: Match) => {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { error } = await supabase
    .from("matches")
    .upsert(toMatchRow(match), { onConflict: "id" });

  if (error) {
    throw error;
  }
};

export const updateMatchInSupabase = async (
  matchId: string,
  updates: Partial<Match>
) => {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase is not configured.");
  }

  const rowUpdates: Partial<MatchRow> = {};
  if (updates.matchType !== undefined) rowUpdates.match_type = updates.matchType;
  if (updates.playerCount !== undefined) rowUpdates.player_count = updates.playerCount;
  if (updates.quarterCount !== undefined) rowUpdates.quarter_count = updates.quarterCount;
  if (updates.quarterTime !== undefined) rowUpdates.quarter_time = updates.quarterTime;
  if (updates.matchDate !== undefined) rowUpdates.match_date = updates.matchDate;
  if (updates.startTime !== undefined) rowUpdates.start_time = updates.startTime;
  if (updates.endTime !== undefined) rowUpdates.end_time = updates.endTime;
  if (updates.location !== undefined) rowUpdates.location = updates.location;
  if (updates.locationLink !== undefined) rowUpdates.location_link = updates.locationLink || null;
  if (updates.opponentName !== undefined) rowUpdates.opponent_name = updates.opponentName;
  if (updates.isCompleted !== undefined) rowUpdates.is_completed = updates.isCompleted;
  if (updates.ourScore !== undefined) rowUpdates.our_score = updates.ourScore;
  if (updates.opponentScore !== undefined) rowUpdates.opponent_score = updates.opponentScore;
  if (updates.createdAt !== undefined) rowUpdates.created_at = updates.createdAt;
  if (updates.imageUrl !== undefined) rowUpdates.image_url = updates.imageUrl || null;

  const { error } = await supabase
    .from("matches")
    .update(rowUpdates)
    .eq("id", matchId);

  if (error) {
    throw error;
  }
};

export const deleteMatchFromSupabase = async (matchId: string) => {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { error } = await supabase.from("matches").delete().eq("id", matchId);

  if (error) {
    throw error;
  }
};

export const fetchMatchesFromSupabase = async (): Promise<Match[]> => {
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("matches")
    .select("*")
    .order("match_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data || []).map((row) => fromMatchRow(row as MatchRow));
};
