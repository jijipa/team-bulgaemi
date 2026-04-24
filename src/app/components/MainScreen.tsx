import { useState, useEffect } from "react";
import { useMatchData } from "../hooks/useMatchData";
import type { Match as RegisteredMatch } from "../types/data";
import {
  getPlayers,
  getScoresByMatchId,
} from "../utils/storage";
import svgPaths from "../../imports/svg-fnwogjyv26";
import soccerBallSvg from "../../imports/svg-aypr951miv";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { CardMom } from "../../imports/CardMom";
import { toast } from "sonner";

const UPCOMING_MATCH_CARD_BG =
  "https://i.imgur.com/djSmkjp.png";
// ✅ 기본 매치 카드 배경 이미지
const DEFAULT_MATCH_IMAGE = UPCOMING_MATCH_CARD_BG;
const TEAM_NAME = "팀불개미";
const COPY_ICON_ASSET =
  "https://www.figma.com/api/mcp/asset/37c84f9e-0914-4475-96de-5d30bcdd9051";

// 데이터 타입 정의
export interface CompletedMatch {
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

type DisplayScorer = {
  name: string;
  goals: number;
};

const getDisplayScorers = (match: CompletedMatch): DisplayScorer[] => {
  const baseScorers = (match.scorers || [])
    .filter((s) => s.name !== match.opponentName)
    .filter((s) => !(match.ownGoals && match.ownGoals > 0 && s.name === "자책골"));
  const teamGoals = baseScorers.reduce((sum, s) => sum + s.goals, 0);
  const ownGoalsCount = match.ownGoals || 0;
  const mercenaryGoals = match.ourScore - teamGoals - ownGoalsCount;

  return [
    ...baseScorers,
    ...(mercenaryGoals > 0 ? [{ name: "용병", goals: mercenaryGoals }] : []),
    ...(ownGoalsCount > 0 ? [{ name: "자책골", goals: ownGoalsCount }] : []),
  ];
};

const loadCanvasImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("이미지를 불러오지 못했습니다."));
    image.src = src;
  });
};

const drawCoverImage = (
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  size: number,
) => {
  const imageRatio = image.naturalWidth / image.naturalHeight;
  const canvasRatio = 1;
  const sourceWidth = imageRatio > canvasRatio ? image.naturalHeight : image.naturalWidth;
  const sourceHeight = imageRatio > canvasRatio ? image.naturalHeight : image.naturalWidth;
  const sourceX = (image.naturalWidth - sourceWidth) / 2;
  const sourceY = (image.naturalHeight - sourceHeight) / 2;

  context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, size, size);
};

const drawCenteredText = (
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
) => {
  context.fillText(text, x, y, maxWidth);
};

const downloadMatchImage = async (match: CompletedMatch) => {
  const size = 1080;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("이미지 저장을 지원하지 않는 브라우저입니다.");
  }

  canvas.width = size;
  canvas.height = size;

  try {
    const image = await loadCanvasImage(match.imageUrl || DEFAULT_MATCH_IMAGE);
    drawCoverImage(context, image, size);
  } catch {
    const fallback = await loadCanvasImage(DEFAULT_MATCH_IMAGE);
    drawCoverImage(context, fallback, size);
  }

  const gradient = context.createLinearGradient(0, 0, 0, size);
  gradient.addColorStop(0, "rgba(0,0,0,0.3)");
  gradient.addColorStop(0.7, "rgba(0,0,0,0.7)");
  gradient.addColorStop(1, "rgba(0,0,0,0.72)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);

  await document.fonts?.ready;

  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillStyle = "#ffffff";
  context.font = "500 54px Paperlogy, Pretendard, sans-serif";
  drawCenteredText(context, match.date, size / 2, 150, 860);

  context.font = "500 40px Pretendard, sans-serif";
  drawCenteredText(context, TEAM_NAME, 360, 250, 260);
  drawCenteredText(context, match.opponentName, 720, 250, 260);

  context.fillStyle = "rgba(255,255,255,0.75)";
  context.font = "400 310px Anton, sans-serif";
  drawCenteredText(context, String(match.ourScore), 360, 490, 240);
  drawCenteredText(context, String(match.opponentScore), 720, 490, 240);
  context.fillRect(510, 480, 60, 18);

  context.fillStyle = "rgba(255,255,255,0.75)";
  context.font = "500 40px Pretendard, sans-serif";
  drawCenteredText(context, "⚽", size / 2, 705, 80);
  context.fillStyle = "rgba(255,255,255,0.2)";
  context.fillRect(110, 745, 860, 3);

  context.fillStyle = "rgba(255,255,255,0.75)";
  context.font = "500 36px Pretendard, sans-serif";
  const scorers = getDisplayScorers(match).slice(0, 8);
  const startY = 805;
  scorers.forEach((scorer, index) => {
    const column = index % 4;
    const row = Math.floor(index / 4);
    const x = 240 + column * 200;
    const y = startY + row * 56;
    drawCenteredText(context, `${scorer.name} ${scorer.goals}`, x, y, 180);
  });

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((pngBlob) => {
      if (pngBlob) {
        resolve(pngBlob);
      } else {
        reject(new Error("이미지 생성에 실패했습니다."));
      }
    }, "image/png");
  });

  const link = document.createElement("a");
  const objectUrl = URL.createObjectURL(blob);
  link.href = objectUrl;
  link.download = `team-bulgaemi-${match.date.replace(/\./g, "-")}-${match.id}.png`;
  link.click();
  URL.revokeObjectURL(objectUrl);
};

interface MatchArtworkProps {
  match: CompletedMatch;
  square?: boolean;
  onClick?: () => void;
}

function MatchArtwork({ match, square = false, onClick }: MatchArtworkProps) {
  const displayScorers = getDisplayScorers(match);
  const hasDoubleDigitScore = match.ourScore >= 10 || match.opponentScore >= 10;
  const scoreFontSize = square
    ? "30.86vw"
    : hasDoubleDigitScore
      ? 80
      : 100;
  const scoreLineHeight = square
    ? "30.86vw"
    : hasDoubleDigitScore
      ? "90px"
      : "100px";

  return (
    <button
      type="button"
      onClick={onClick}
      className="overflow-clip relative shrink-0 text-left"
      style={{
        width: square ? "100%" : 216,
        height: square ? "100%" : 324,
        borderRadius: square ? 0 : 12,
        cursor: onClick ? "pointer" : "default",
      }}
      aria-label={`${match.opponentName} 매치 이미지 보기`}
    >
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <ImageWithFallback
          alt=""
          className="absolute max-w-none object-cover size-full"
          src={match.imageUrl || DEFAULT_MATCH_IMAGE}
          fallbackSrc={DEFAULT_MATCH_IMAGE}
          crossOrigin="anonymous"
        />
        <div className="absolute bg-gradient-to-b from-[rgba(0,0,0,0.3)] inset-0 mix-blend-multiply to-[69.848%] to-[rgba(0,0,0,0.7)]" />
      </div>
      <div
        className="absolute content-stretch flex flex-col items-center left-0 right-0"
        style={{ top: square ? "9.88%" : 32 }}
      >
        <p
          className="leading-[normal] not-italic relative shrink-0 text-center text-white w-full whitespace-pre-wrap"
          style={{
            fontFamily: "var(--font-paperlogy)",
            fontSize: square ? "4.94vw" : 16,
          }}
        >
          {match.date}
        </p>
        <div
          className="content-stretch flex items-center justify-center relative shrink-0 w-full"
          style={{ paddingTop: square ? "7.4%" : 24 }}
        >
          <div
            className="content-stretch flex flex-col items-center not-italic relative shrink-0"
            style={{ gap: square ? 4.63 : 4, width: square ? "24.69%" : 80 }}
          >
            <p
              className="leading-[normal] relative shrink-0 text-white whitespace-nowrap"
              style={{
                fontFamily: "var(--font-pretendard)",
                fontSize: square ? "3.7vw" : 12,
                maxWidth: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {TEAM_NAME}
            </p>
            <p
              className="relative shrink-0 text-[rgba(255,255,255,0.75)] text-center whitespace-pre-wrap"
              style={{
                fontFamily: "var(--font-anton)",
                fontSize: scoreFontSize,
                lineHeight: scoreLineHeight,
              }}
            >
              {match.ourScore}
            </p>
          </div>
          <div
            className="content-stretch flex flex-col items-start relative shrink-0"
            style={{ paddingTop: square ? "4.94%" : 16, width: square ? "6.17%" : 20 }}
          >
            <div
              className="bg-[rgba(255,255,255,0.75)] shrink-0 w-full"
              style={{ height: square ? "2.47vw" : 8 }}
            />
          </div>
          <div
            className="content-stretch flex flex-col items-center not-italic relative shrink-0"
            style={{ gap: square ? 4.63 : 4, width: square ? "24.69%" : 80 }}
          >
            <p
              className="leading-[normal] relative shrink-0 text-white whitespace-nowrap"
              style={{
                fontFamily: "var(--font-pretendard)",
                fontSize: square ? "3.7vw" : 12,
                maxWidth: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {match.opponentName}
            </p>
            <p
              className="relative shrink-0 text-[rgba(255,255,255,0.75)] text-center whitespace-pre-wrap"
              style={{
                fontFamily: "var(--font-anton)",
                fontSize: scoreFontSize,
                lineHeight: scoreLineHeight,
              }}
            >
              {match.opponentScore}
            </p>
          </div>
        </div>
        <div className="relative shrink-0 w-full">
          <div className="flex flex-col items-center justify-center size-full">
            <div
              className="content-stretch flex flex-col items-center justify-center relative w-full"
              style={{ paddingLeft: square ? "9.88%" : 32, paddingRight: square ? "9.88%" : 32 }}
            >
              <div
                className="content-stretch flex items-center justify-center overflow-clip relative shrink-0 w-full"
                style={{ paddingBottom: square ? "1.23%" : 4 }}
              >
                <div
                  className="relative shrink-0"
                  style={{
                    width: square ? "4.93vw" : 15.972,
                    height: square ? "4.93vw" : 15.974,
                  }}
                >
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
                className="content-center flex flex-wrap items-center justify-center leading-[normal] not-italic relative shrink-0 text-[rgba(255,255,255,0.75)] text-center whitespace-pre-wrap"
                style={{
                  fontFamily: "var(--font-pretendard)",
                  fontSize: square ? "3.7vw" : 12,
                  gap: square ? "8px 27.778px" : "6px 24px",
                  paddingTop: square ? "3.7%" : 8,
                  width: "100%",
                  maxWidth: square ? "100%" : 128,
                }}
              >
                {displayScorers.map((scorer, index) => (
                  <p
                    key={`${scorer.name}-${index}`}
                    className="relative shrink-0"
                    style={{
                      height: square ? "4.32vw" : 14,
                      width: square ? "14.81vw" : 52,
                    }}
                  >
                    {scorer.name} {scorer.goals}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

const parseLocalDate = (dateString: string) => {
  const dateOnly = dateString.split("T")[0];
  const [year, month, day] = dateOnly.split("-").map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
};

const formatMatchTypeLabel = (matchType: RegisteredMatch["matchType"]) =>
  matchType === "futsal" ? "풋살" : "축구";

const formatMonthLabel = (matchDate: string) => {
  const date = parseLocalDate(matchDate);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
};

const formatKoreanTime = (time: string) => {
  const [rawHour, rawMinute] = time.split(":").map(Number);
  const hour = Number.isFinite(rawHour) ? rawHour : 0;
  const minute = Number.isFinite(rawMinute) ? rawMinute : 0;
  const meridiem = hour < 12 ? "오전" : "오후";
  const twelveHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${meridiem} ${twelveHour}시${minute === 30 ? " 반" : ""}`;
};

const formatDateTimeLabel = (matchDate: string, startTime: string) => {
  const date = parseLocalDate(matchDate);
  return `${date.getDate()}일(${DAY_LABELS[date.getDay()]}) ${formatKoreanTime(startTime)}`;
};

const getDurationMinutes = (startTime: string, endTime: string) => {
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);
  const startTotal = (Number.isFinite(startHour) ? startHour : 0) * 60 + (Number.isFinite(startMinute) ? startMinute : 0);
  const endTotal = (Number.isFinite(endHour) ? endHour : 0) * 60 + (Number.isFinite(endMinute) ? endMinute : 0);
  const diff = endTotal - startTotal;
  return diff > 0 ? diff : 0;
};

const formatDurationLabel = (startTime: string, endTime: string, quarterCount: string) => {
  const durationMinutes = getDurationMinutes(startTime, endTime);
  const hourText =
    durationMinutes % 60 === 30
      ? `${Math.floor(durationMinutes / 60)}시간 반`
      : `${Math.floor(durationMinutes / 60)}시간`;

  return `${hourText} / ${quarterCount} 진행`;
};

const copyToClipboard = async (text: string) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
};

function CopyIcon() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "relative",
        width: 20,
        height: 20,
        minWidth: 20,
        minHeight: 20,
        maxWidth: 20,
        maxHeight: 20,
        flexShrink: 0,
        display: "block",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 2.92,
          top: 2.08,
          width: 13.333,
          height: 15,
        }}
      >
        <img
          alt=""
          src={COPY_ICON_ASSET}
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            maxWidth: "none",
          }}
        />
      </div>
    </div>
  );
}

interface UpcomingMatchCardProps {
  match: RegisteredMatch;
}

function UpcomingMatchCard({ match }: UpcomingMatchCardProps) {
  const handleCopyLocationLink = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (!match.locationLink) {
      return;
    }

    try {
      await copyToClipboard(match.locationLink);
      toast.success("주소가 복사되었습니다.");
    } catch (error) {
      console.error("주소 복사 실패:", error);
      toast.error("주소 복사에 실패했습니다.");
    }
  };

  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-[12px]"
      style={{
        width: 216,
        height: 324,
        color: "#ffffff",
        textAlign: "left",
      }}
    >
      <img
        alt=""
        aria-hidden="true"
        src={UPCOMING_MATCH_CARD_BG}
        className="pointer-events-none absolute inset-0 size-full object-cover"
        width={216}
        height={324}
        loading="eager"
        fetchPriority="high"
        decoding="async"
      />
      <div
        className="absolute inset-0"
        style={{
          padding: 16,
        }}
      >
        <div
          style={{
            width: 183,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              width: "100%",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div
                style={{
                  height: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 4px",
                  borderRadius: 6,
                  background: "#0e4924",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    paddingTop: 2,
                    fontFamily: "var(--font-paperlogy)",
                    fontWeight: 600,
                    fontSize: 14,
                    lineHeight: 1,
                    color: "#ffffff",
                    whiteSpace: "nowrap",
                  }}
                >
                  {formatMatchTypeLabel(match.matchType)}
                </p>
              </div>
              <div
                style={{
                  height: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 4px",
                  borderRadius: 6,
                  background: "#0e4924",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    paddingTop: 1,
                    fontFamily: "var(--font-paperlogy)",
                    fontWeight: 600,
                    fontSize: 14,
                    letterSpacing: "-1.4px",
                    lineHeight: 1,
                    color: "#ffffff",
                    whiteSpace: "nowrap",
                  }}
                >
                  {match.playerCount}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, width: "100%" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, width: "100%" }}>
                  <p
                    style={{
                      margin: 0,
                      fontFamily: "var(--font-paperlogy)",
                      fontWeight: 600,
                      fontSize: 14,
                      lineHeight: 1,
                      color: "#ffffff",
                    }}
                  >
                    {formatMonthLabel(match.matchDate)}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontFamily: "var(--font-paperlogy)",
                      fontWeight: 700,
                      fontSize: 20,
                      lineHeight: 1.1,
                      color: "#ffffff",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formatDateTimeLabel(match.matchDate, match.startTime)}
                  </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 2, width: "100%" }}>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      minWidth: 0,
                      maxWidth: match.locationLink ? "calc(100% - 22px)" : "100%",
                      flexShrink: 1,
                    }}
                  >
                    <p
                      title={match.location}
                      style={{
                        margin: 0,
                        display: "block",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontFamily: "var(--font-paperlogy)",
                        fontWeight: 700,
                        fontSize: 20,
                        lineHeight: 1.1,
                        color: "#ffffff",
                      }}
                    >
                      {match.location}
                    </p>
                  </div>
                  {match.locationLink ? (
                    <button
                      type="button"
                      onClick={handleCopyLocationLink}
                      aria-label="장소 링크 복사"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 20,
                        height: 20,
                        minWidth: 20,
                        minHeight: 20,
                        maxWidth: 20,
                        maxHeight: 20,
                        flexShrink: 0,
                        background: "transparent",
                        border: 0,
                        padding: 0,
                        margin: 0,
                        lineHeight: 0,
                        overflow: "hidden",
                        cursor: "pointer",
                      }}
                    >
                      <CopyIcon />
                    </button>
                  ) : null}
                </div>
              </div>

              <p
                style={{
                  margin: 0,
                  fontFamily: "var(--font-pretendard)",
                  fontWeight: 600,
                  fontSize: 14,
                  lineHeight: 1,
                  color: "#cbe8d7",
                  whiteSpace: "nowrap",
                }}
              >
                {formatDurationLabel(match.startTime, match.endTime, match.quarterCount)}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 4, width: "100%" }}>
            <p
              style={{
                margin: 0,
                fontFamily: "var(--font-paperlogy)",
                fontWeight: 700,
                fontSize: 20,
                lineHeight: 1,
                color: "#cbe8d7",
              }}
            >
              VS
            </p>
            <p
              title={match.opponentName}
              style={{
                margin: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontFamily: "var(--font-paperlogy)",
                fontWeight: 700,
                fontSize: 32,
                lineHeight: 1,
                color: "#ffffff",
              }}
            >
              {match.opponentName}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
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
  const [selectedMatch, setSelectedMatch] = useState<CompletedMatch | null>(null);
  const [isDownloadingMatchImage, setIsDownloadingMatchImage] = useState(false);
  const [loadedMatchCardImages, setLoadedMatchCardImages] = useState<Record<string, boolean>>({});
  const [remoteMatches, setRemoteMatches] = useState<CompletedMatch[]>(
    [],
  );
  const [remoteRegisteredMatches, setRemoteRegisteredMatches] = useState<RegisteredMatch[]>([]);
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
    matches: allLocalMatches,
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
      setRemoteRegisteredMatches(cachedData.matches || []);

      // ✅ 캐시된 matches 데이터 변환
      if (cachedData.matches && cachedData.matches.length > 0) {
        const loadedMatches: CompletedMatch[] = cachedData.matches
          .filter((match: any) => Boolean(match["isCompleted"] ?? match["is_completed"]))
          .map(
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

  const completedMatches: CompletedMatch[] =
    remoteMatches.length > 0
      ? remoteMatches.sort((a, b) => {
          // 날짜 문자열을 Date 객체로 변환하여 비교
          const dateA = new Date(a.date.replace(/\./g, "-"));
          const dateB = new Date(b.date.replace(/\./g, "-"));
          return dateB.getTime() - dateA.getTime(); // 내림차순 (최신 날짜가 왼쪽)
        })
      : allLocalMatches.length > 0
        ? allLocalMatches
            .filter((match) => match.isCompleted)
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
                imageUrl: match.imageUrl || DEFAULT_MATCH_IMAGE,
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

  const upcomingMatches: RegisteredMatch[] =
    remoteRegisteredMatches.length > 0
      ? [...remoteRegisteredMatches]
          .filter((match) => !match.isCompleted)
          .sort(
            (a, b) =>
              new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime(),
          )
      : [...allLocalMatches]
          .filter((match) => !match.isCompleted)
          .sort(
            (a, b) =>
              new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime(),
          );

  const matchCards: Array<
    | { kind: "completed"; id: string; match: CompletedMatch }
    | { kind: "upcoming"; id: string; match: RegisteredMatch }
  > = [
    ...upcomingMatches.map((match) => ({
      kind: "upcoming" as const,
      id: `upcoming-${match.id}`,
      match,
    })),
    ...completedMatches.map((match) => ({
      kind: "completed" as const,
      id: `completed-${match.id}`,
      match,
    })),
  ].sort((a, b) => {
    const dateA =
      a.kind === "upcoming"
        ? new Date(a.match.matchDate).getTime()
        : new Date(a.match.date.replace(/\./g, "-")).getTime();
    const dateB =
      b.kind === "upcoming"
        ? new Date(b.match.matchDate).getTime()
        : new Date(b.match.date.replace(/\./g, "-")).getTime();
    return dateB - dateA;
  });

  console.log("🎯 최종 매치 카드 배열:", matchCards);

  useEffect(() => {
    const completedImageSources = Array.from(
      new Set(
        matchCards
          .filter((card) => card.kind === "completed")
          .map((card) => card.match.imageUrl || DEFAULT_MATCH_IMAGE),
      ),
    );

    if (completedImageSources.length === 0) {
      setLoadedMatchCardImages({});
      return;
    }

    let isCancelled = false;

    completedImageSources.forEach((src) => {
      if (loadedMatchCardImages[src]) {
        return;
      }

      const image = new Image();
      image.crossOrigin = "anonymous";

      const markLoaded = () => {
        if (isCancelled) {
          return;
        }

        setLoadedMatchCardImages((prev) => {
          if (prev[src]) {
            return prev;
          }

          return { ...prev, [src]: true };
        });
      };

      image.onload = markLoaded;
      image.onerror = markLoaded;
      image.src = src;
    });

    return () => {
      isCancelled = true;
    };
  }, [matchCards, loadedMatchCardImages]);

  const completedImageSources = Array.from(
    new Set(
      matchCards
        .filter((card) => card.kind === "completed")
        .map((card) => card.match.imageUrl || DEFAULT_MATCH_IMAGE),
    ),
  );

  const areMatchCardImagesReady = completedImageSources.every(
    (src) => loadedMatchCardImages[src],
  );

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

  const handleDownloadSelectedMatch = async () => {
    if (!selectedMatch || isDownloadingMatchImage) return;

    try {
      setIsDownloadingMatchImage(true);
      await downloadMatchImage(selectedMatch);
    } catch (error) {
      console.error("❌ 매치 이미지 다운로드 실패:", error);
      alert("이미지 다운로드에 실패했습니다. 이미지 주소 또는 브라우저 권한을 확인해주세요.");
    } finally {
      setIsDownloadingMatchImage(false);
    }
  };

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
              ) : !areMatchCardImagesReady ? (
                <>
                  <MatchCardSkeleton />
                  <MatchCardSkeleton />
                  <MatchCardSkeleton />
                </>
              ) : (
                matchCards.map((card) =>
                  card.kind === "upcoming" ? (
                    <UpcomingMatchCard key={card.id} match={card.match} />
                  ) : (
                    <MatchArtwork
                      key={card.id}
                      match={card.match}
                      onClick={() => setSelectedMatch(card.match)}
                    />
                  ),
                )
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
      {selectedMatch && (
        <div
          className="fixed inset-0 z-50"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.9)" }}
          role="dialog"
          aria-modal="true"
          aria-label="매치 이미지 미리보기"
        >
          <div className="absolute h-[48px] left-0 right-0 top-[65px] z-10">
            <button
              type="button"
              onClick={() => setSelectedMatch(null)}
              className="absolute content-stretch flex items-center justify-center right-[8px] size-[40px] top-1/2 -translate-y-1/2"
              aria-label="오버레이 닫기"
            >
              <svg
                className="block size-[24px]"
                fill="none"
                preserveAspectRatio="none"
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
          </div>

          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-clip"
            style={{ width: "100vw", height: "100vw" }}
          >
            <MatchArtwork match={selectedMatch} square />
          </div>

          <div
            className="absolute backdrop-blur-[2.5px] bottom-0 content-stretch flex flex-col items-start left-0 right-0 pb-[24px] pt-[16px] px-[20px]"
          >
            <button
              type="button"
              onClick={handleDownloadSelectedMatch}
              disabled={isDownloadingMatchImage}
              className="border border-solid content-stretch flex h-[52px] items-center justify-center p-[10px] relative rounded-[8px] w-full disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ borderColor: "#ffffff" }}
            >
              <p
                className="leading-[normal] not-italic relative shrink-0 text-[18px] text-left text-white whitespace-nowrap"
                style={{ fontFamily: "var(--font-paperlogy)", fontWeight: 500 }}
              >
                {isDownloadingMatchImage ? "이미지 생성 중" : "이미지 다운로드"}
              </p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
