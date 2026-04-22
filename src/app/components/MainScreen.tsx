import { useState, useEffect } from "react";
import { useMatchData } from "../hooks/useMatchData";
import {
  getPlayers,
  getScoresByMatchId,
} from "../utils/storage";
import svgPaths from "../../imports/svg-fnwogjyv26";
import soccerBallSvg from "../../imports/svg-aypr951miv";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { CardMom } from "../../imports/CardMom";

// ✅ 기본 매치 카드 배경 이미지
const DEFAULT_MATCH_IMAGE = "https://i.imgur.com/K5sm165.jpeg";

// 데이터 타입 정의
export interface Match {
  id: string;
  date: string; // YYYY.MM.DD 형식
  ourScore: number;
  opponentScore: number;
  opponentName: string;
  scorers: Array<{ name: string; goals: number }>; // ✅ 골 개수도 포함
  ownGoals?: number; // ✅ 자책골 개수 추가
  imageUrl: string;
  momPlayerId?: string; // MOM 선수 ID (optional)
}

export interface MOMRecord {
  id: string;
  matchDate: string; // YYYY.MM.DD 형식
  playerName: string | string[]; // 단일 선수 또는 여러 선수
  playerNumber?: string | string[]; // 선수 번호 (선택사항)
  matchId: string;
}

export interface PlayerStats {
  id: string;
  number: string;
  name: string;
  goals: number;
  assists: number;
  momCount: number;
  matchCount: number;
}

interface MainScreenProps {
  onNavigateToMatches: () => void;
  cachedData?: any; // ✅ 캐시 데이터 추가
  isLoadingCache?: boolean; // ✅ 로딩 상태 추가
}

export default function MainScreen({
  onNavigateToMatches,
  cachedData,
  isLoadingCache,
}: MainScreenProps) {
  const [remoteMatches, setRemoteMatches] = useState<Match[]>(
    [],
  );
  const [remoteScores, setRemoteScores] = useState<any[]>([]); // Supabase Scores 데이터 저장
  const [remoteParticipants, setRemoteParticipants] = useState<
    any[]
  >([]); // ✅ Supabase Participants 데이터 저장
  const [remoteMOMs, setRemoteMOMs] = useState<any[]>([]); // ✅ Supabase MOM 데이터 저장

  // ✅ 이제 Supabase 데이터는 캐시에서 불러오므로, 로딩 상태는 props로 받은 isLoadingCache 사용
  const isLoadingRemote =
    isLoadingCache !== undefined ? isLoadingCache : true;

  // 실제 데이터 로드 (기존 로컬 스토리지)
  const {
    recentMatches,
    playerStats: realPlayerStats,
    isLoading,
  } = useMatchData();

  // Supabase에서 가져온 캐시 데이터 로드
  useEffect(() => {
    // ✅ 캐시 데이터가 있으면 캐시 사용, 없으면 직접 로드
    if (cachedData) {
      console.log("⚡ 캐시 데이터 사용:", cachedData);
      setRemoteScores(cachedData.scores || []);
      setRemoteParticipants(cachedData.participants || []);
      setRemoteMOMs(cachedData.moms || []);

      // ✅ 캐시된 matches 데이터 변환
      if (cachedData.matches && cachedData.matches.length > 0) {
        const loadedMatches: Match[] = cachedData.matches.map(
          (match: any, index: number) => {
            let formattedDate = "N/A";
            if (match["matchDate"] || match["날짜"]) {
              let dateStr = match["matchDate"] || match["날짜"];

              // Date 객체인 경우 로컬 시간대로 변환 (UTC 문제 해결)
              if (dateStr instanceof Date) {
                const year = dateStr.getFullYear();
                const month = String(
                  dateStr.getMonth() + 1,
                ).padStart(2, "0");
                const day = String(dateStr.getDate()).padStart(
                  2,
                  "0",
                );
                dateStr = `${year}-${month}-${day}`;
              } else if (typeof dateStr !== "string") {
                dateStr = String(dateStr);
              }

              // ISO 형식 처리 - UTC 시간대 문제 해결!
              if (dateStr.includes("T")) {
                const isoDate = new Date(dateStr);
                const year = isoDate.getFullYear();
                const month = String(
                  isoDate.getMonth() + 1,
                ).padStart(2, "0");
                const day = String(isoDate.getDate()).padStart(
                  2,
                  "0",
                );
                formattedDate = `${year}.${month}.${day}`;
              } else if (dateStr.includes("-")) {
                formattedDate = dateStr.replace(/-/g, ".");
              } else {
                formattedDate = dateStr;
              }
            }

            const uniqueId =
              match["id"] ||
              match["matchId"] ||
              match["경기ID"] ||
              `cache_match_${index}`;

            // 득점자 찾기
            const scorers: Array<{
              name: string;
              goals: number;
            }> = [];
            let ownGoals = 0; // ✅ 자책골 카운트 추가
            if (
              cachedData.scores &&
              cachedData.scores.length > 0
            ) {
              const matchScores = cachedData.scores.filter(
                (score: any) =>
                  score["matchId"] === uniqueId ||
                  score["경기ID"] === uniqueId,
              );
              matchScores.forEach((score: any) => {
                const goals = score["goals"] || score["골"];
                const playerName =
                  score["playerName"] || score["이름"];
                const isMercenary =
                  score["isMercenary"] ||
                  score["용병여부"] ||
                  false; // ✅ 용병 여부 확인
                const playerNumber =
                  score["playerNumber"] || score["번호"];
                
                // ✅ 자책골 확인
                if (playerName === "자책골" && goals && goals > 0) {
                  ownGoals += goals;
                }
                // ✅ 용병 및 자책골 제외
                else if (
                  goals &&
                  goals > 0 &&
                  playerName &&
                  playerName !== "자책골" &&
                  !isMercenary &&
                  playerNumber !== "GUEST"
                ) {
                  scorers.push({
                    name: playerName,
                    goals: goals,
                  });
                }
              });
            }

            return {
              id: uniqueId,
              date: formattedDate,
              ourScore:
                match["ourScore"] || match["우리팀득점"] || 0,
              opponentScore:
                match["opponentScore"] ||
                match["상대팀득점"] ||
                0,
              opponentName:
                match["opponentName"] ||
                match["상대팀"] ||
                "상대팀",
              scorers: scorers,
              ownGoals: ownGoals, // ✅ 자책골 정보 추가
              imageUrl:
                match["imageUrl"] || DEFAULT_MATCH_IMAGE, // ✅ Supabase imageUrl 사용
            };
          },
        );

        setRemoteMatches(loadedMatches);
        console.log(
          "✅ 캐시에서 매치 데이터 로드:",
          loadedMatches.length,
          "개",
        );
      }
    }
  }, [cachedData]);

  // ✅ Supabase 캐시 데이터 우선 사용! (모든 디바이스에서 동일한 데이터)
  // ✅ 최신순 정렬: 날짜 기준 내림차순
  const matches: Match[] =
    remoteMatches.length > 0
      ? remoteMatches.sort((a, b) => {
          // 날짜 문자열을 Date 객체로 변환하여 비교
          const dateA = new Date(a.date.replace(/\./g, "-"));
          const dateB = new Date(b.date.replace(/\./g, "-"));
          return dateB.getTime() - dateA.getTime(); // 내림차순 (최신 날짜가 왼쪽)
        })
      : recentMatches.length > 0
        ? recentMatches
            .map((match, index) => {
              console.log(
                "💾 LocalStorage 매치 데이터:",
                match,
              );

              // 해당 매치의 득점 기록 가져오기
              const matchScores = getScoresByMatchId(match.id);
              console.log(
                `📊 매치 ${match.id}의 득점 기록:`,
                matchScores,
              );

              // 골 넣은 선수 이름 배열 (골 개수 포함)
              const scorers: Array<{ name: string; goals: number }> = [];
              let ownGoals = 0; // ✅ 자책골 카운트
              let registeredPlayerGoals = 0; // ✅ 등록 선수 골 카운트
              let mercenaryGoals = 0; // ✅ 용병 골 카운트
              
              matchScores.forEach((score) => {
                if (score.goals > 0) {
                  const playerId = String(score.playerId ?? "").toLowerCase(); // ✅ ?? 사용 + 소문자 변환

                  console.log(
                    `  🔍 득점자 확인: playerId="${playerId}", playerName="${score.playerName}", 골: ${score.goals}`,
                  );

                  // ✅ 1. playerId가 "opponent"인 경우 → 상대팀 득점 (제외)
                  if (playerId === "opponent") {
                    console.log(`  🔴 상대팀 득점 스킵: ${score.playerName}`);
                    return;
                  }
                  
                  // ✅ 2. playerId가 "0"인 경우 → 자책골
                  if (playerId === "0") {
                    ownGoals += score.goals;
                    console.log(`  🥅 자책골 감지: ${score.goals}개`);
                  }
                  // ✅ 3. playerId가 숫자 (0이 아닌)인 경우 → 등록 선수 골
                  else if (!isNaN(Number(playerId)) && Number(playerId) > 0) {
                    const name = String(score.playerName ?? "").trim();
                    scorers.push({
                      name: name,
                      goals: score.goals,
                    });
                    registeredPlayerGoals += score.goals;
                    console.log(`  ⚽ 등록 선수 골: ${name} ${score.goals}개`);
                  }
                  // ✅ 4. 나머지는 모두 용병 골 (mercenary_1, mercenary_2 등)
                  else if (playerId && playerId.startsWith("mercenary_")) {
                    mercenaryGoals += score.goals;
                    console.log(`  👥 용병 골 감지: ${score.goals}개`);
                  }
                }
              });
              
              // ✅ 자책골이 있으면 추가
              if (ownGoals > 0) {
                scorers.push({
                  name: "자책골",
                  goals: ownGoals,
                });
              }
              
              // ✅ 용병 골이 있으면 추가
              if (mercenaryGoals > 0) {
                scorers.push({
                  name: "용병",
                  goals: mercenaryGoals,
                });
              }
              
              console.log(
                `⚽ 매치 ${match.id}의 득점자 상세:`,
                JSON.stringify(scorers, null, 2),
              );
              console.log(
                `🥅 매치 ${match.id}의 자책골:`,
                ownGoals,
              );
              console.log(
                `👥 매치 ${match.id}의 용병 골:`,
                mercenaryGoals,
              );
              console.log(
                `⚽ 매치 ${match.id}의 등록 선수 골:`,
                registeredPlayerGoals,
              );

              const transformedMatch = {
                id: match.id,
                date: match.matchDate.replace(/-/g, "."),
                ourScore: match.ourScore || 0,
                opponentScore: match.opponentScore || 0,
                opponentName: match.opponentName,
                scorers: scorers,
                ownGoals: ownGoals, // ✅ 자책골 정보 추가
                imageUrl:
                  index % 2 === 0
                    ? DEFAULT_MATCH_IMAGE
                    : DEFAULT_MATCH_IMAGE,
                momPlayerId: undefined,
              };

              console.log(
                "✅ 변환된 매치 데이터:",
                transformedMatch,
              );
              return transformedMatch;
            })
            .sort((a, b) => {
              // 날짜 문자열을 Date 객체로 변환하여 비교
              const dateA = new Date(
                a.date.replace(/\./g, "-"),
              );
              const dateB = new Date(
                b.date.replace(/\./g, "-"),
              );
              return dateB.getTime() - dateA.getTime(); // 내림차순 (최신 날짜가 왼쪽)
            })
        : [];

  console.log("🎯 최종 매치 배열:", matches);

  // ✅ Supabase MOM 데이터 사용
  const momRecords: MOMRecord[] = remoteMOMs.map((mom: any) => {
    // 날짜 형식 변환: YYYY.MM.DD 또는 YYYY-MM-DD -> YY.MM.DD
    let formattedDate =
      mom["matchDate"] || mom["경기날짜"] || "";

    // Date 객체인 경우 처리
    if (formattedDate instanceof Date) {
      const year = String(formattedDate.getFullYear()).slice(
        -2,
      ); // YY
      const month = String(
        formattedDate.getMonth() + 1,
      ).padStart(2, "0");
      const day = String(formattedDate.getDate()).padStart(
        2,
        "0",
      );
      formattedDate = `${year}.${month}.${day}`;
    } else if (typeof formattedDate === "string") {
      // ISO 형식 (2026-02-05T15:00:00.000Z) 처리
      if (formattedDate.includes("T")) {
        const isoDate = new Date(formattedDate);
        const year = String(isoDate.getFullYear()).slice(-2); // YY
        const month = String(isoDate.getMonth() + 1).padStart(
          2,
          "0",
        );
        const day = String(isoDate.getDate()).padStart(2, "0");
        formattedDate = `${year}.${month}.${day}`;
      } else if (formattedDate.includes("-")) {
        // YYYY-MM-DD 형식 -> YY.MM.DD
        const parts = formattedDate.split("-");
        const year = parts[0].slice(-2); // YY
        const month = parts[1];
        const day = parts[2];
        formattedDate = `${year}.${month}.${day}`;
      } else if (formattedDate.includes(".")) {
        // YYYY.MM.DD 형식 -> YY.MM.DD
        const parts = formattedDate.split(".");
        if (parts[0].length === 4) {
          const year = parts[0].slice(-2); // YY
          formattedDate = `${year}.${parts[1]}.${parts[2]}`;
        }
        // 이미 YY.MM.DD 형식이면 그대로 사용
      }
    }

    // playerId로부터 선수 정보 가져오기
    const playerIds = mom["playerIds"] || mom["playerId"] || [];
    const playerIdArray = Array.isArray(playerIds)
      ? playerIds
      : [playerIds];

    // 선수 이름과 번호 배열 생성
    const allPlayers = getPlayers();
    const playerNames: string[] = [];
    const playerNumbers: string[] = [];

    playerIdArray.forEach((playerId: string) => {
      const player = allPlayers.find(
        (p) => String(p.id) === String(playerId),
      );
      if (player) {
        playerNames.push(player.name);
        playerNumbers.push(player.number);
      }
    });

    console.log(`🏆 MOM 카드 데이터:`, {
      matchDate: formattedDate,
      playerIds: playerIdArray,
      playerNames,
      playerNumbers,
    });

    return {
      id: mom["id"] || mom["MOMID"] || `mom_${Date.now()}`,
      matchDate: formattedDate,
      playerName:
        playerNames.length > 1
          ? playerNames
          : playerNames[0] || "Unknown",
      playerNumber:
        playerNumbers.length > 1
          ? playerNumbers
          : playerNumbers[0] || "?",
      matchId: mom["matchId"] || mom["경기ID"],
    };
  });

  // 실제 선수 통계 데이터 변환 (기존 UI 형식에 맞춤)
  const allPlayers = getPlayers(); // LocalStorage에서 33명 전체 선수 데이터 가져오기

  // ✅ Supabase Scores & Participants 데이터를 기반으로 리더보드 생성!
  const playerStats: PlayerStats[] = allPlayers.map(
    (player) => {
      let goals = 0;
      let assists = 0;
      let matchCount = 0;
      let momCount = 0; // ✅ MOM 카운트 초기화

      // Supabase 데이터에서 직접 계산 (undefined 체크 추가!)
      if (
        (remoteScores && remoteScores.length > 0) ||
        (remoteParticipants && remoteParticipants.length > 0)
      ) {
        console.log(`🔍 ${player.name}의 통계 계산 중...`);

        // Scores 데이터에서 골/도움 계산
        const playerScores =
          remoteScores && remoteScores.length > 0
            ? remoteScores.filter(
                (score: any) =>
                  score["playerName"] === player.name ||
                  score["이름"] === player.name,
              )
            : [];
        console.log(
          `  📊 ${player.name}의 득점 기록:`,
          playerScores,
        );

        // 각 매치별 골/도움 합산
        playerScores.forEach((score: any) => {
          goals += score["goals"] || score["골"] || 0;
          assists += score["assists"] || score["도움"] || 0;
        });

        // ✅ Participants 데이터에서 경기 수 계산 (모든 참가 선수 포함!)
        if (
          remoteParticipants &&
          remoteParticipants.length > 0
        ) {
          const playerParticipations =
            remoteParticipants.filter(
              (participant: any) =>
                participant["playerName"] === player.name ||
                participant["이름"] === player.name,
            );
          // 중복 제거를 위해 matchId를 Set으로 관리
          const uniqueMatches = new Set(
            playerParticipations.map(
              (p: any) => p["matchId"] || p["경기ID"],
            ),
          );
          matchCount = uniqueMatches.size;
          console.log(
            `  👥 ${player.name}의 경기 참가 기록: ${matchCount}경기`,
          );
        } else {
          // Participants가 없으면 Scores 기반으로 경기 수 계산 (기존 방식)
          matchCount = playerScores.length;
        }

        // ✅ MOM 데이터에서 MOM 카운트 계산
        if (remoteMOMs && remoteMOMs.length > 0) {
          remoteMOMs.forEach((mom: any) => {
            const playerIds = mom["playerIds"] || mom["playerId"] || [];
            const playerIdArray = Array.isArray(playerIds)
              ? playerIds
              : [playerIds];
            
            // 해당 선수가 이 MOM 기록에 포함되어 있는지 확인
            if (playerIdArray.some((id: string) => String(id) === String(player.id))) {
              momCount++;
            }
          });
          console.log(
            `  🏆 ${player.name}의 MOM 횟수: ${momCount}`,
          );
        }

        console.log(
          `  ✅ ${player.name}: ${goals}골 ${assists}도움 ${momCount}MOM (${matchCount}경기)`,
        );
      } else {
        // LocalStorage 데이터 사용 (백업)
        const stat = realPlayerStats.find(
          (s) => s.playerId === player.id,
        );
        goals = stat?.totalGoals || 0;
        assists = stat?.totalAssists || 0;
        matchCount = stat?.matchCount || 0;
      }

      return {
        id: player.id,
        number: player.number,
        name: player.name,
        goals: goals,
        assists: assists,
        momCount: momCount, // ✅ 실제 MOM 카운트 반영
        matchCount: matchCount,
      };
    },
  );

  const finalPlayerStats: PlayerStats[] = playerStats; // 33명 전체 선수 데이터

  // 리더보드 정렬 로직: 득점 > 도움 > mom > 경기 수 순으로 정렬
  const getSortedPlayers = () => {
    const sorted = [...finalPlayerStats].sort((a, b) => {
      // 1순위: 득점
      if (a.goals !== b.goals) return b.goals - a.goals;
      // 2순위: 도움
      if (a.assists !== b.assists) return b.assists - a.assists;
      // 3순위: MOM
      if (a.momCount !== b.momCount)
        return b.momCount - a.momCount;
      // 4순위: 경기 수
      return b.matchCount - a.matchCount;
    });

    // 순위 계산 (동점자는 같은 순위)
    const withRank: Array<PlayerStats & { rank: number }> = [];
    sorted.forEach((player, index) => {
      let rank = index + 1;
      if (index > 0) {
        const prev = sorted[index - 1];
        // 이전 선수와 모든 스탯이 같으면 같은 순위
        if (
          prev.goals === player.goals &&
          prev.assists === player.assists &&
          prev.momCount === player.momCount &&
          prev.matchCount === player.matchCount
        ) {
          rank = withRank[index - 1].rank;
        }
      }
      withRank.push({ ...player, rank });
    });

    return withRank;
  };

  const sortedPlayers = getSortedPlayers();

  // 스켈레톤 컴포넌트
  const MatchCardSkeleton = () => (
    <div className="h-[324px] relative rounded-[12px] shrink-0 w-[216px] bg-gray-200 animate-pulse" />
  );

  const MOMCardSkeleton = () => (
    <div className="bg-[#f2f2f2] h-[96px] rounded-[12px] shrink-0 w-[148px] p-[12px] animate-pulse">
      <div className="flex flex-col gap-3">
        <div className="h-4 w-16 bg-gray-300 rounded" />
        <div className="flex items-center gap-2">
          <div className="size-[32px] bg-gray-300 rounded-[16px]" />
          <div className="h-4 w-16 bg-gray-300 rounded" />
        </div>
      </div>
    </div>
  );

  const LeaderboardRowSkeleton = () => (
    <div className="w-full">
      <div className="relative shrink-0 w-full">
        <div className="flex flex-row items-center w-full h-full">
          <div className="flex items-center px-[20px] py-[8px] w-full">
            {/* 순위 */}
            <div className="flex flex-col items-center justify-center relative shrink-0 w-[24px]">
              <div className="h-4 w-6 bg-gray-300 rounded animate-pulse" />
            </div>
            {/* 이름 */}
            <div className="flex-1 min-h-px min-w-px relative">
              <div className="flex flex-row items-center size-full">
                <div className="flex gap-[8px] items-center pl-[8px] w-full">
                  <div className="size-[24px] bg-gray-300 rounded-full animate-pulse shrink-0" />
                  <div className="h-4 w-[80px] bg-gray-300 rounded animate-pulse" />
                </div>
              </div>
            </div>
            {/* 득점 */}
            <div className="flex flex-col items-center justify-center relative shrink-0 w-[40px]">
              <div className="h-4 w-6 bg-gray-300 rounded animate-pulse" />
            </div>
            {/* 도움 */}
            <div className="flex flex-col items-center justify-center relative shrink-0 w-[40px]">
              <div className="h-4 w-6 bg-gray-300 rounded animate-pulse" />
            </div>
            {/* MOM */}
            <div className="flex flex-col items-center justify-center relative shrink-0 w-[40px]">
              <div className="h-4 w-6 bg-gray-300 rounded animate-pulse" />
            </div>
            {/* 경기수 */}
            <div className="flex flex-col items-center justify-center relative shrink-0 w-[40px]">
              <div className="h-4 w-6 bg-gray-300 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#ebebeb] h-px shrink-0 w-full" />
    </div>
  );

  return (
    <div className="bg-white relative size-full">
      <div className="content-stretch flex flex-col gap-[24px] items-start pb-[48px] pt-[24px] relative w-full">
        {/* Team Title */}
        <div className="relative shrink-0 w-full">
          <div className="flex flex-row items-center size-full">
            <div className="content-stretch flex gap-[8px] items-center px-[20px] relative w-full">
              <div className="relative shrink-0 size-[28px]">
                <svg
                  className="block size-full"
                  fill="none"
                  preserveAspectRatio="none"
                  viewBox="0 0 28 28"
                >
                  <defs>
                    <clipPath id="teamLogoClip">
                      <circle cx="14" cy="14" r="14" />
                    </clipPath>
                  </defs>
                  <image
                    href="https://i.imgur.com/JrwAlWz.png"
                    x="0"
                    y="0"
                    width="28"
                    height="28"
                    clipPath="url(#teamLogoClip)"
                    preserveAspectRatio="xMidYMid slice"
                  />
                  <circle
                    cx="14"
                    cy="14"
                    r="14"
                    fill="none"
                    stroke="#E5E5E5"
                    strokeWidth="0.5"
                  />
                </svg>
              </div>
              <p
                className="font-bold leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[20px]"
                style={{ fontFamily: "var(--font-paperlogy)" }}
              >
                팀불개미
              </p>
            </div>
          </div>
        </div>

        {/* Match Section */}
        <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
          {/* Section Title */}
          <div className="relative shrink-0 w-full">
            <div className="flex flex-row items-center size-full">
              <div className="content-stretch flex items-center justify-between pl-[20px] pr-[8px] relative w-full">
                <p
                  className="font-bold leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[20px]"
                  style={{
                    fontFamily: "var(--font-paperlogy)",
                  }}
                >
                  매치
                </p>
                <button
                  onClick={onNavigateToMatches}
                  className="content-stretch flex items-center justify-center relative shrink-0 size-[40px]"
                >
                  <div className="h-[25px] relative shrink-0 w-[24px]">
                    <svg
                      className="block size-full"
                      fill="none"
                      preserveAspectRatio="none"
                      viewBox="0 0 24 25"
                    >
                      <g>
                        <path
                          d="M8 5L16 12.5L8 20"
                          stroke="var(--stroke-0, #242B35)"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                        />
                      </g>
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Match Cards - Horizontal Scroll */}
          <div className="relative shrink-0 w-full">
            <div className="content-stretch flex gap-[12px] items-center px-[20px] overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {isLoadingRemote || isLoading ? (
                <>
                  <MatchCardSkeleton />
                  <MatchCardSkeleton />
                  <MatchCardSkeleton />
                </>
              ) : (
                matches.map((match, matchIndex) => (
                  <div
                    key={match.id}
                    className="h-[324px] overflow-clip relative rounded-[12px] shrink-0 w-[216px]"
                  >
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 pointer-events-none rounded-[12px]"
                    >
                      <ImageWithFallback
                        alt=""
                        className="absolute max-w-none object-cover rounded-[12px] size-full"
                        src={match.imageUrl}
                        fallbackSrc={
                          matchIndex % 2 === 0
                            ? DEFAULT_MATCH_IMAGE
                            : DEFAULT_MATCH_IMAGE
                        }
                      />
                      <div className="absolute bg-gradient-to-b from-[rgba(0,0,0,0.3)] inset-0 mix-blend-multiply rounded-[12px] to-[69.848%] to-[rgba(0,0,0,0.7)]" />
                    </div>
                    <div className="absolute content-stretch flex flex-col items-center left-0 right-0 top-[32px]">
                      <p
                        className="leading-[normal] not-italic relative shrink-0 text-[16px] text-center text-white w-full whitespace-pre-wrap"
                        style={{
                          fontFamily: "var(--font-paperlogy)",
                        }}
                      >
                        {match.date}
                      </p>
                      {/* Score */}
                      <div className="content-stretch flex items-center justify-center pt-[24px] relative shrink-0 w-full">
                        <div className="content-stretch flex flex-col gap-[4px] items-center not-italic relative shrink-0 w-[80px]">
                          <p
                            className="leading-[normal] relative shrink-0 text-[12px] text-white"
                            style={{
                              fontFamily:
                                "var(--font-pretendard)",
                            }}
                          >
                            팀불개미
                          </p>
                          <p
                            className="leading-[100px] relative shrink-0 text-[100px] text-[rgba(255,255,255,0.75)] w-[50px] whitespace-pre-wrap"
                            style={{
                              fontFamily: "var(--font-anton)",
                            }}
                          >
                            {match.ourScore}
                          </p>
                        </div>
                        <div className="content-stretch flex flex-col items-start pt-[16px] relative shrink-0 w-[20px]">
                          <div className="bg-[rgba(255,255,255,0.75)] h-[8px] shrink-0 w-full" />
                        </div>
                        <div className="content-stretch flex flex-col gap-[4px] items-center not-italic relative shrink-0 w-[80px]">
                          <p
                            className="leading-[normal] relative shrink-0 text-[12px] text-white"
                            style={{
                              fontFamily:
                                "var(--font-pretendard)",
                            }}
                          >
                            {match.opponentName}
                          </p>
                          <p
                            className="leading-[100px] relative shrink-0 text-[100px] text-[rgba(255,255,255,0.75)] w-[50px] whitespace-pre-wrap"
                            style={{
                              fontFamily: "var(--font-anton)",
                            }}
                          >
                            {match.opponentScore}
                          </p>
                        </div>
                      </div>
                      {/* Goal Icon & Scorer Names */}
                      <div className="relative shrink-0 w-full">
                        <div className="flex flex-col items-center justify-center size-full">
                          <div className="content-stretch flex flex-col items-center justify-center px-[32px] relative w-full">
                            <div className="content-stretch flex items-center justify-center overflow-clip pb-[4px] pt-[12px] relative shrink-0 w-full">
                              <div className="h-[15.974px] relative shrink-0 w-[15.972px]">
                                <svg
                                  className="block size-full"
                                  fill="none"
                                  preserveAspectRatio="none"
                                  viewBox="0 0 15.9723 15.9743"
                                >
                                  <path
                                    d={soccerBallSvg.p9ba2480}
                                    fill="var(--fill-0, white)"
                                    fillOpacity="0.75"
                                  />
                                </svg>
                              </div>
                            </div>
                            <div className="bg-[rgba(255,255,255,0.2)] h-px shrink-0 w-full" />
                            <div
                              className="content-center flex flex-wrap gap-[8px_16px] items-center justify-center leading-[normal] not-italic pt-[12px] relative shrink-0 text-[12px] text-[rgba(255,255,255,0.75)] text-center w-full whitespace-pre-wrap"
                              style={{
                                fontFamily:
                                  "var(--font-pretendard)",
                              }}
                            >
                              {(() => {
                                const baseScorers = (match.scorers || [])
                                  // 상대팀 이름 제거
                                  .filter(s => s.name !== match.opponentName)
                                  // 자책골이 ownGoals에 따로 있으면 scorers에 있는 자책골 제거
                                  .filter(s => !(match.ownGoals > 0 && s.name === "자책골"));

                                const teamGoals = baseScorers.reduce(
                                  (sum, s) => sum + s.goals,
                                  0
                                );

                                const ownGoalsCount = match.ownGoals || 0;

                                const mercenaryGoals =
                                  match.ourScore - teamGoals - ownGoalsCount;

                                const displayScorers = [
                                  ...baseScorers,
                                  ...(mercenaryGoals > 0
                                    ? [{ name: "용병", goals: mercenaryGoals }]
                                    : []),
                                  ...(ownGoalsCount > 0
                                    ? [{ name: "자책골", goals: ownGoalsCount }]
                                    : []),
                                ];

                                return displayScorers.map((s, i) => (
                                  <p key={i} className="h-[14px] relative shrink-0 w-[60px]">
                                    {s.name} {s.goals}
                                  </p>
                                ));
                              })()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* MOM Section */}
        <div className="content-stretch flex flex-col gap-[4px] items-start justify-center relative shrink-0 w-full">
          <div className="content-stretch flex h-[40px] items-center pl-[20px] pr-[8px] relative shrink-0">
            <p
              className="font-bold leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[20px]"
              style={{ fontFamily: "var(--font-paperlogy)" }}
            >
              MOM
            </p>
          </div>
          <div className="content-stretch flex flex-col items-start relative shrink-0 w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="content-stretch flex gap-[8px] items-center relative shrink-0 px-[20px]">
              {isLoadingRemote ? (
                <>
                  <MOMCardSkeleton />
                  <MOMCardSkeleton />
                  <MOMCardSkeleton />
                </>
              ) : (
                momRecords.map((mom) => {
                  // 선수 배열인지 확인하여 카드 너비 결정
                  const isMultiplePlayers =
                    Array.isArray(mom.playerName) &&
                    mom.playerName.length > 1;
                  const cardWidth = isMultiplePlayers
                    ? "w-[224px]"
                    : "w-[148px]";

                  return (
                    <div
                      key={mom.id}
                      className={`shrink-0 ${cardWidth} h-[94px]`}
                    >
                      <CardMom
                        matchDate={mom.matchDate}
                        playerName={mom.playerName}
                        playerNumber={mom.playerNumber}
                      />
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Leaderboard Section */}
        <div className="content-stretch flex flex-col gap-[4px] items-start justify-center relative shrink-0 w-full">
          <div className="h-[40px] relative shrink-0 w-full">
            <div className="flex flex-row items-center size-full">
              <div className="content-stretch flex items-center px-[20px] relative size-full">
                <p
                  className="font-bold leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[20px]"
                  style={{
                    fontFamily: "var(--font-paperlogy)",
                  }}
                >
                  팀원 순위
                </p>
              </div>
            </div>
          </div>

          {/* Table Header */}
          <div className="bg-[#fafafa] h-[32px] sticky-top-0 z-10 shrink-0 w-full">
            <div
              aria-hidden="true"
              className="absolute border-[#ebebeb] border-b border-solid inset-0 pointer-events-none"
            />
            <div className="flex flex-row items-center w-full h-full">
              <div className="flex items-center px-[20px] w-full">
                <div className="flex items-center justify-center relative shrink-0 w-[24px]">
                  <p
                    className="leading-[normal] not-italic relative shrink-0 text-[#82828f] text-[13px]"
                    style={{
                      fontFamily: "var(--font-paperlogy)",
                    }}
                  >
                    순위
                  </p>
                </div>
                <div className="flex-1 min-h-px min-w-px relative">
                  <div className="flex flex-row items-center size-full">
                    <div className="flex items-center pl-[8px] w-full">
                      <p
                        className="leading-[normal] not-italic relative shrink-0 text-[#82828f] text-[13px]"
                        style={{
                          fontFamily: "var(--font-paperlogy)",
                        }}
                      >
                        이름
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center relative shrink-0 w-[40px]">
                  <p
                    className="leading-[normal] not-italic relative shrink-0 text-[#82828f] text-[13px]"
                    style={{
                      fontFamily: "var(--font-paperlogy)",
                    }}
                  >
                    득점
                  </p>
                </div>
                <div className="flex items-center justify-center relative shrink-0 w-[40px]">
                  <p
                    className="leading-[normal] not-italic relative shrink-0 text-[#82828f] text-[13px]"
                    style={{
                      fontFamily: "var(--font-paperlogy)",
                    }}
                  >
                    도움
                  </p>
                </div>
                <div className="flex items-center justify-center relative shrink-0 w-[40px]">
                  <p
                    className="leading-[normal] not-italic relative shrink-0 text-[#82828f] text-[13px]"
                    style={{
                      fontFamily: "var(--font-paperlogy)",
                    }}
                  >
                    MOM
                  </p>
                </div>
                <div className="flex items-center justify-center relative shrink-0 w-[40px]">
                  <p
                    className="leading-[normal] not-italic relative shrink-0 text-[#82828f] text-[13px]"
                    style={{
                      fontFamily: "var(--font-paperlogy)",
                    }}
                  >
                    경기수
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Table Rows */}
          {isLoadingRemote ? (
            <>
              <LeaderboardRowSkeleton />
              <LeaderboardRowSkeleton />
              <LeaderboardRowSkeleton />
            </>
          ) : (
            sortedPlayers.map((player, index) => (
              <div key={player.id} className="w-full">
                <div className="relative shrink-0 w-full">
                  <div className="flex flex-row items-center w-full h-full">
                    <div className="flex items-center px-[20px] py-[8px] w-full">
                      <div className="flex flex-col items-center justify-center relative shrink-0 w-[24px]">
                        <p
                          className="font-bold leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[13px]"
                          style={{
                            fontFamily: "var(--font-paperlogy)",
                          }}
                        >
                          {player.rank}
                        </p>
                      </div>
                      <div className="flex-1 min-h-px min-w-px relative">
                        <div className="flex flex-row items-center size-full">
                          <div className="flex gap-[8px] items-center pl-[8px]">
                            <div className="relative shrink-0 size-[24px]">
                              <svg
                                className="block size-full"
                                fill="none"
                                preserveAspectRatio="none"
                                viewBox="0 0 24 24"
                              >
                                <g>
                                  <g>
                                    <path
                                      d={svgPaths.p1b424700}
                                      fill="var(--fill-0, #283135)"
                                    />
                                    <path
                                      d={svgPaths.p1c0fd00}
                                      fill="var(--fill-0, #E24444)"
                                    />
                                  </g>
                                </g>
                              </svg>
                              {/* 번호 텍스트 */}
                              <p
                                className="absolute inset-0 flex items-center justify-center text-[10.5px] leading-[15px] tracking-[0.105px] text-center text-[#283135] not-italic"
                                style={{
                                  fontFamily:
                                    "var(--font-anton)",
                                }}
                              >
                                {player.number}
                              </p>
                            </div>
                            <p
                              className="font-semibold leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[16px]"
                              style={{
                                fontFamily:
                                  "var(--font-pretendard)",
                              }}
                            >
                              {player.name}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-center justify-center relative shrink-0 w-[40px]">
                        <p
                          className="leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[17px] text-center w-full whitespace-pre-wrap"
                          style={{
                            fontFamily:
                              "var(--font-pretendard)",
                          }}
                        >
                          {player.goals}
                        </p>
                      </div>
                      <div className="flex flex-col items-center justify-center relative shrink-0 w-[40px]">
                        <p
                          className="leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[17px] text-center w-full whitespace-pre-wrap"
                          style={{
                            fontFamily:
                              "var(--font-pretendard)",
                          }}
                        >
                          {player.assists}
                        </p>
                      </div>
                      <div className="flex flex-col items-center justify-center relative shrink-0 w-[40px]">
                        <p
                          className="leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[17px] text-center w-full whitespace-pre-wrap"
                          style={{
                            fontFamily:
                              "var(--font-pretendard)",
                          }}
                        >
                          {player.momCount}
                        </p>
                      </div>
                      <div className="flex flex-col items-center justify-center relative shrink-0 w-[40px]">
                        <p
                          className="leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[17px] text-center w-full whitespace-pre-wrap"
                          style={{
                            fontFamily:
                              "var(--font-pretendard)",
                          }}
                        >
                          {player.matchCount}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {index < sortedPlayers.length - 1 && (
                  <div className="bg-[#ebebeb] h-px shrink-0 w-full" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
