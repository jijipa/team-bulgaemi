import { Fragment } from "react";
import backgroundImage from "../../assets/jjfc-result-bg.jpg";
import locationIcon from "../../assets/jjfc-location-icon.svg";
import resultLogo from "../../assets/jjfc-result-logo.svg";
import { teamConfig } from "../config/team";
import { cn } from "./ui/utils";

export type JjfcGoalLine = {
  scorerName: string;
  assistName?: string | null;
};

export type JjfcQuarterSummary = {
  quarter: number;
  ourScore: number;
  opponentScore: number;
  goals: JjfcGoalLine[];
};

export type JjfcMatchResultParticipant = {
  playerId?: string;
  playerName?: string;
  name?: string;
  playerNumber?: string;
  isMercenary?: boolean;
};

export type JjfcMatchResultCardData = {
  date: string;
  location: string;
  teamName: string;
  opponentName: string;
  ourScore: number;
  opponentScore: number;
  momNames: string[];
  participantNames?: string[];
  participants?: JjfcMatchResultParticipant[];
  registeredPlayerNames?: string[];
  quarterSummaries: JjfcQuarterSummary[];
};

type JjfcMatchResultCardProps = {
  data: JjfcMatchResultCardData;
  className?: string;
};

const MAX_PARTICIPANTS = 21;
const PARTICIPANT_ROW_LAYOUTS: Record<number, number[]> = {
  1: [1],
  2: [2],
  3: [3],
  4: [4],
  5: [5],
  6: [3, 3],
  7: [3, 4],
  8: [4, 4],
  9: [5, 4],
  10: [5, 5],
  11: [4, 3, 4],
  12: [4, 4, 4],
  13: [4, 5, 4],
  14: [5, 4, 5],
  15: [5, 5, 5],
  16: [5, 6, 5],
  17: [6, 5, 6],
  18: [6, 6, 6],
  19: [6, 7, 6],
  20: [7, 6, 7],
  21: [7, 7, 7],
};

const truncateText = (text: string, maxLength: number) =>
  text.length <= maxLength ? text : `${text.slice(0, Math.max(0, maxLength - 1))}...`;

const splitNamesIntoRows = (names: string[]) => {
  const participants = names.filter(Boolean).slice(0, MAX_PARTICIPANTS);
  const rowSizes = PARTICIPANT_ROW_LAYOUTS[participants.length] ?? [7, 7, 7];
  const rows: string[][] = [];
  let cursor = 0;

  rowSizes.forEach((rowSize) => {
    if (cursor >= participants.length) return;
    rows.push(participants.slice(cursor, cursor + rowSize));
    cursor += rowSize;
  });

  return rows;
};

const getGoalCount = (quarters: JjfcQuarterSummary[]) =>
  quarters.reduce((total, quarter) => total + quarter.goals.length, 0);

const getParticipantName = (participant: JjfcMatchResultParticipant) =>
  (participant.playerName || participant.name || "").trim();

const isMercenaryParticipant = (participant: JjfcMatchResultParticipant) => {
  const playerId = String(participant.playerId || "");
  const playerNumber = String(participant.playerNumber || "");
  const playerName = getParticipantName(participant);

  return (
    participant.isMercenary === true ||
    playerId.startsWith("mercenary_") ||
    playerNumber === "GUEST" ||
    playerName === "용병없음" ||
    playerId === "nomercenary"
  );
};

export const getRegisteredParticipantNames = ({
  participantNames,
  participants,
  registeredPlayerNames,
}: Pick<
  JjfcMatchResultCardData,
  "participantNames" | "participants" | "registeredPlayerNames"
>) => {
  const registeredNames = new Set(
    (registeredPlayerNames ?? teamConfig.players.map((player) => player.name))
      .map((name) => name.trim())
      .filter(Boolean),
  );

  if (participants?.length) {
    return participants
      .filter((participant) => !isMercenaryParticipant(participant))
      .map(getParticipantName)
      .filter((name) => name && registeredNames.has(name));
  }

  return (participantNames ?? [])
    .map((name) => name.trim())
    .filter((name) => name && registeredNames.has(name));
};

function MatchHeader({ date }: { date: string }) {
  return (
    <header
      className="relative flex w-full shrink-0 items-center justify-between border-b-[1.5px] border-[#002d61] px-[64px] py-[48px]"
      data-node-id="462:124"
    >
      <img
        alt="JJFC"
        className="relative size-[186px] shrink-0"
        data-node-id="462:109"
        src={resultLogo}
      />
      <div
        className="relative flex w-[584px] shrink-0 flex-col items-end text-right font-['Changa',sans-serif] text-[108px] font-bold leading-none text-[#002d61]"
        data-node-id="462:123"
      >
        <p className="w-full shrink-0">{date}</p>
        <p className="w-full shrink-0">FULL TIME</p>
      </div>
    </header>
  );
}

function LocationBar({ location }: { location: string }) {
  return (
    <section
      className="relative flex w-full shrink-0 items-center gap-[16px] border-b-[1.5px] border-[#002d61]"
      data-node-id="462:135"
    >
      <img
        alt=""
        className="relative size-[64px] shrink-0 border-r-[1.5px] border-[#002d61]"
        data-node-id="462:130"
        src={locationIcon}
      />
      <div className="relative flex shrink-0 items-center justify-center" data-node-id="462:136">
        <p className="shrink-0 whitespace-nowrap font-['Pretendard',sans-serif] text-[32px] font-extrabold leading-normal text-[#002d61]">
          {location}
        </p>
      </div>
    </section>
  );
}

function GoalLine({
  goal,
  compact = false,
}: {
  goal: JjfcGoalLine;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative flex shrink-0 items-start gap-[6px] whitespace-nowrap font-['Pretendard',sans-serif] font-semibold leading-none",
        compact ? "text-[18px]" : "text-[24px]",
      )}
    >
      <p className="shrink-0 leading-none text-[#002d61]">{truncateText(goal.scorerName, 7)}</p>
      {goal.assistName ? (
        <p className="shrink-0 leading-none text-[#8393a7]">(AS {truncateText(goal.assistName, 7)})</p>
      ) : null}
    </div>
  );
}

function QuarterSummaryList({
  quarters,
  compact = false,
}: {
  quarters: JjfcQuarterSummary[];
  compact?: boolean;
}) {
  return (
    <aside
      className="relative flex h-[704px] w-[324px] shrink-0 items-start border-r-[1.5px] border-[#002d61] px-[64px] py-[40px]"
      data-node-id="462:172"
    >
      <div
        className={cn(
          "relative flex h-full w-[187px] shrink-0 flex-col items-start",
          compact ? "gap-[24px]" : "gap-[40px]",
        )}
        data-node-id={compact ? "462:508" : "462:138"}
      >
        {quarters.map((quarter) => (
          <section key={quarter.quarter} className="relative flex w-full shrink-0 flex-col items-start gap-[12px]">
            <p
              className={cn(
                "min-w-full shrink-0 whitespace-nowrap font-['Changa',sans-serif] font-bold leading-none text-[#002d61]",
                compact ? "text-[28px]" : "text-[32px]",
              )}
              style={{ lineHeight: 1 }}
            >
              {quarter.quarter}Q - {quarter.ourScore}:{quarter.opponentScore}
            </p>
            {(compact ? quarter.goals : quarter.goals.slice(0, 3)).map((goal, index) => (
              <GoalLine key={`${quarter.quarter}-${goal.scorerName}-${index}`} compact={compact} goal={goal} />
            ))}
          </section>
        ))}
      </div>
    </aside>
  );
}

function ScoreColumn({
  name,
  score,
  scoreClassName,
  compactScore = false,
}: {
  name: string;
  score: number;
  scoreClassName: string;
  compactScore?: boolean;
}) {
  return (
    <section className="relative flex min-w-px flex-1 flex-col items-center">
      <p className="shrink-0 whitespace-nowrap font-['Pretendard',sans-serif] text-[40px] font-extrabold leading-[48px] text-[#002d61]">
        {name}
      </p>
      <p
        className={cn(
          "min-w-full shrink-0 text-center font-['Changa',sans-serif] font-bold",
          compactScore ? "text-[264px] leading-[352px]" : "text-[352px] leading-[352px]",
          scoreClassName,
        )}
      >
        {score}
      </p>
    </section>
  );
}

function ScoreBoard({ data }: { data: JjfcMatchResultCardData }) {
  const compactScore = data.ourScore >= 10 || data.opponentScore >= 10;

  return (
    <section className="relative flex h-full min-w-px flex-1 flex-col items-center pb-[10px] pt-[48px]" data-node-id="462:190">
      <div className="relative flex w-full shrink-0 items-center px-[32px]" data-node-id="462:186">
        <ScoreColumn
          compactScore={compactScore}
          name={data.teamName}
          score={data.ourScore}
          scoreClassName="text-[rgba(248,113,16,0.98)]"
        />
        <div className="relative flex w-[52px] shrink-0 flex-col items-start pt-[48px]" data-node-id="462:189">
          <div className="relative flex h-[10.601px] w-full shrink-0 items-center justify-center">
            <div className="h-[52px] w-[10.601px] rotate-90 bg-[#002d61]" data-node-id="462:187" />
          </div>
        </div>
        <ScoreColumn
          compactScore={compactScore}
          name={data.opponentName}
          score={data.opponentScore}
          scoreClassName="text-[rgba(0,45,97,0.98)]"
        />
      </div>
      <MatchPeople
        momNames={data.momNames}
        participantNames={data.participantNames}
        participants={data.participants}
        registeredPlayerNames={data.registeredPlayerNames}
      />
    </section>
  );
}

function MatchPeople({
  momNames,
  participantNames,
  participants,
  registeredPlayerNames,
}: {
  momNames: string[];
  participantNames?: string[];
  participants?: JjfcMatchResultParticipant[];
  registeredPlayerNames?: string[];
}) {
  const participantRows = splitNamesIntoRows(
    getRegisteredParticipantNames({
      participantNames,
      participants,
      registeredPlayerNames,
    }),
  );

  return (
    <section className="relative flex w-full shrink-0 flex-col items-center gap-[32px]" data-node-id="462:271">
      <div className="relative flex shrink-0 items-center gap-[12px] whitespace-nowrap font-['Pretendard',sans-serif] text-[28px] font-bold leading-none text-[#f77314]" data-node-id="462:292">
        <p className="shrink-0">MOM</p>
        <p className="shrink-0">{momNames.join(",")}</p>
      </div>
      <div className="relative flex shrink-0 flex-col items-center gap-[16px]" data-node-id="462:958">
        {participantRows.map((row, rowIndex) => (
          <div key={`${rowIndex}-${row.join("-")}`} className="relative flex shrink-0 items-center gap-[16px]">
            {row.map((name, nameIndex) => (
              <Fragment key={`${name}-${nameIndex}`}>
                <p className="shrink-0 whitespace-nowrap font-['Pretendard',sans-serif] text-[26px] font-semibold leading-none text-[#2d313a]">
                  {truncateText(name, 5)}
                </p>
                {nameIndex < row.length - 1 ? <div className="h-[12px] w-[2px] shrink-0 bg-[#c3cde7]" /> : null}
              </Fragment>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

export const jjfcMatchResultCardSampleData: JjfcMatchResultCardData = {
  date: "2026.02.22",
  location: "남동인더스파크 축구장",
  teamName: "JJFC",
  opponentName: "상대팀이름",
  ourScore: 3,
  opponentScore: 1,
  momNames: ["이동희", "박지황"],
  registeredPlayerNames: ["선수명"],
  participantNames: [
    "선수명",
    "선수명",
    "선수명",
    "선수명",
    "선수명",
    "선수명",
    "선수명",
    "선수명",
    "선수명",
    "선수명",
    "선수명",
    "선수명",
    "선수명",
    "선수명",
    "선수명",
    "선수명",
  ],
  quarterSummaries: [
    {
      quarter: 1,
      ourScore: 2,
      opponentScore: 1,
      goals: [
        { scorerName: "은동헌", assistName: "천승욱" },
        { scorerName: "은동헌", assistName: "천승욱" },
        { scorerName: "은동헌", assistName: "천승욱" },
      ],
    },
    {
      quarter: 2,
      ourScore: 1,
      opponentScore: 1,
      goals: [
        { scorerName: "은동헌", assistName: "천승욱" },
        { scorerName: "은동헌", assistName: "천승욱" },
      ],
    },
    {
      quarter: 3,
      ourScore: 2,
      opponentScore: 1,
      goals: [
        { scorerName: "은동헌", assistName: "천승욱" },
        { scorerName: "은동헌", assistName: "천승욱" },
      ],
    },
    {
      quarter: 4,
      ourScore: 1,
      opponentScore: 1,
      goals: [
        { scorerName: "은동헌", assistName: "천승욱" },
        { scorerName: "은동헌", assistName: "천승욱" },
        { scorerName: "은동헌", assistName: "천승욱" },
      ],
    },
  ],
};

export function JjfcMatchResultCard({ data, className }: JjfcMatchResultCardProps) {
  const useCompactQuarterList =
    data.ourScore >= 10 ||
    data.quarterSummaries.length > 4 ||
    getGoalCount(data.quarterSummaries) >= 10;

  return (
    <article
      className={cn("relative flex size-[1080px] flex-col items-start overflow-hidden", className)}
      data-node-id="462:125"
    >
      <img alt="" className="pointer-events-none absolute inset-0 size-full max-w-none object-cover" src={backgroundImage} />
      <div className="relative flex w-full shrink-0 flex-col items-start" data-node-id="462:137">
        <MatchHeader date={data.date} />
        <LocationBar location={data.location} />
      </div>
      <main className="relative flex w-full shrink-0 items-center" data-node-id="462:191">
        <QuarterSummaryList compact={useCompactQuarterList} quarters={data.quarterSummaries} />
        <div className="flex flex-1 flex-row items-center self-stretch">
          <ScoreBoard data={data} />
        </div>
      </main>
    </article>
  );
}
