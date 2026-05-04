import { useEffect, useMemo, useState } from "react";
import { JjfcMatchResultCard } from "./JjfcMatchResultCard";
import { useMatchData } from "../hooks/useMatchData";
import { teamConfig } from "../config/team";
import {
  getGoalEvents,
  getMOMs,
  getParticipants,
  getPlayers,
} from "../utils/storage";
import {
  buildJjfcMatchResultCardData,
  ResultCardMatch,
  toResultCardMatch,
} from "../utils/jjfcResultCardData";

type MatchCardScreenProps = {
  cachedData?: any;
  isLoadingCache?: boolean;
};

export default function MatchCardScreen({
  cachedData,
  isLoadingCache = false,
}: MatchCardScreenProps) {
  const [selectedMatch, setSelectedMatch] = useState<ResultCardMatch | null>(null);
  const [viewportScale, setViewportScale] = useState(1);
  const { matches: localMatches, isLoading } = useMatchData();

  useEffect(() => {
    const updateScale = () => {
      setViewportScale(Math.min(window.innerWidth, window.innerHeight) / 1080);
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const players = useMemo(
    () => (cachedData?.players?.length ? cachedData.players : getPlayers()),
    [cachedData],
  );
  const participants = useMemo(
    () =>
      cachedData?.participants?.length
        ? cachedData.participants
        : getParticipants(),
    [cachedData],
  );
  const moms = useMemo(
    () => (cachedData?.moms?.length ? cachedData.moms : getMOMs()),
    [cachedData],
  );
  const goalEvents = useMemo(
    () =>
      cachedData?.goalEvents?.length
        ? cachedData.goalEvents
        : getGoalEvents(),
    [cachedData],
  );
  const registeredMatches = useMemo(
    () => (cachedData?.matches?.length ? cachedData.matches : []),
    [cachedData],
  );

  const completedMatches = useMemo(() => {
    const source = registeredMatches.length > 0 ? registeredMatches : localMatches;
    return source
      .filter((match: any) => Boolean(match.isCompleted ?? match.is_completed))
      .map(toResultCardMatch)
      .sort((a, b) => {
        const dateA = new Date(a.date.replace(/\./g, "-")).getTime();
        const dateB = new Date(b.date.replace(/\./g, "-")).getTime();
        return dateB - dateA;
      });
  }, [localMatches, registeredMatches]);

  const selectedCardData = useMemo(() => {
    if (!selectedMatch) return null;

    return buildJjfcMatchResultCardData({
      match: selectedMatch,
      registeredMatches,
      localMatches,
      participants,
      goalEvents,
      moms,
      players,
    });
  }, [
    goalEvents,
    localMatches,
    moms,
    participants,
    players,
    registeredMatches,
    selectedMatch,
  ]);

  const showLoading = isLoadingCache || isLoading;

  return (
    <div className="min-h-full w-full bg-white">
      <div className="flex w-full flex-col gap-[16px] px-[20px] py-[24px]">
        <div className="flex items-center gap-[8px]">
          <img
            alt=""
            className="size-[28px] rounded-full"
            src={teamConfig.logoUrl}
          />
          <h1
            className="text-[20px] font-bold leading-none text-[#1a1a1c]"
            style={{ fontFamily: "var(--font-paperlogy)" }}
          >
            매치카드
          </h1>
        </div>

        <div className="flex flex-col gap-[8px]">
          {showLoading ? (
            <>
              <div className="h-[72px] w-full animate-pulse rounded-[8px] bg-[#f2f2f2]" />
              <div className="h-[72px] w-full animate-pulse rounded-[8px] bg-[#f2f2f2]" />
              <div className="h-[72px] w-full animate-pulse rounded-[8px] bg-[#f2f2f2]" />
            </>
          ) : completedMatches.length === 0 ? (
            <div className="rounded-[8px] bg-[#f7f7f8] px-[16px] py-[20px]">
              <p
                className="text-[15px] font-semibold text-[#7b8087]"
                style={{ fontFamily: "var(--font-pretendard)" }}
              >
                완료된 매치가 없습니다.
              </p>
            </div>
          ) : (
            completedMatches.map((match) => (
              <button
                key={match.id}
                className="flex w-full items-center justify-between rounded-[8px] border border-[#ebebeb] bg-white px-[16px] py-[14px] text-left"
                onClick={() => setSelectedMatch(match)}
                type="button"
              >
                <div className="flex min-w-0 flex-col gap-[6px]">
                  <p
                    className="truncate text-[18px] font-bold leading-none text-[#1a1a1c]"
                    style={{ fontFamily: "var(--font-paperlogy)" }}
                  >
                    vs {match.opponentName}
                  </p>
                  <p
                    className="text-[14px] font-semibold leading-none text-[#82828f]"
                    style={{ fontFamily: "var(--font-pretendard)" }}
                  >
                    {match.date}
                  </p>
                </div>
                <p
                  className="shrink-0 text-[24px] font-bold leading-none text-[#002d61]"
                  style={{ fontFamily: "var(--font-paperlogy)" }}
                >
                  {match.ourScore}:{match.opponentScore}
                </p>
              </button>
            ))
          )}
        </div>
      </div>

      {selectedMatch && selectedCardData ? (
        <div
          className="fixed inset-0 z-50 bg-black"
          role="dialog"
          aria-modal="true"
          aria-label="매치카드"
        >
          <button
            type="button"
            onClick={() => setSelectedMatch(null)}
            className="absolute right-[8px] top-[20px] z-10 flex size-[44px] items-center justify-center"
            aria-label="매치카드 닫기"
          >
            <svg
              className="block size-[24px]"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                d="M6 6L18 18M18 6L6 18"
                stroke="white"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </button>
          <div
            className="absolute left-1/2 top-1/2 overflow-hidden"
            style={{
              width: "100vmin",
              height: "100vmin",
              transform: "translate(-50%, -50%)",
            }}
          >
            <div
              style={{
                width: 1080,
                height: 1080,
                transform: `scale(${viewportScale})`,
                transformOrigin: "top left",
              }}
            >
              <JjfcMatchResultCard data={selectedCardData} />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
