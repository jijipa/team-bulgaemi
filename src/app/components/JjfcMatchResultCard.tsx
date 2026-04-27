import svgPaths from "../../imports/PublishFrame624794/svg-iagdomxrq8";
import backgroundImage from "../../imports/PublishFrame624794/cfbcbfcc3327cdad985937d2ad285895dbf6dd67.png";

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

export type JjfcMatchResultCardData = {
  date: string;
  location: string;
  teamName: string;
  opponentName: string;
  ourScore: number;
  opponentScore: number;
  momNames: string[];
  participantNames: string[];
  quarterSummaries: JjfcQuarterSummary[];
};

const CARD_SIZE = 1080;
const JJFC_NAVY = "#002D61";
const JJFC_ORANGE = "rgba(248,113,16,0.98)";
const JJFC_MUTED = "#8393A7";
const JJFC_SLATE = "#2D313A";
const JJFC_SOFT = "#C3CDE7";

const clampNames = (names: string[], max = 16) =>
  names.filter(Boolean).slice(0, max);

const splitNamesIntoRows = (names: string[]) => {
  const items = clampNames(names);
  if (items.length === 0) return [];

  const preferredRowSizes = [5, 6, 5];
  const rows: string[][] = [];
  let cursor = 0;

  preferredRowSizes.forEach((size) => {
    if (cursor >= items.length) return;
    rows.push(items.slice(cursor, cursor + size));
    cursor += size;
  });

  if (cursor < items.length) rows.push(items.slice(cursor));
  return rows.filter((row) => row.length > 0);
};

const truncateText = (text: string, maxLength: number) =>
  text.length <= maxLength ? text : `${text.slice(0, Math.max(0, maxLength - 1))}…`;

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

function LogoSvg() {
  return (
    <svg width="186" height="186" viewBox="0 0 186 186" fill="none">
      <g clipPath="url(#clip0_jjfc_logo_svg)">
        <path d={svgPaths.p36ea7d00} fill={JJFC_NAVY} />
        <g>
          <path d={svgPaths.p45a6600} fill={JJFC_NAVY} />
          <path d={svgPaths.p38e4d200} fill={JJFC_NAVY} />
        </g>
        <path d={svgPaths.p3465d700} fill={JJFC_NAVY} />
        <path d={svgPaths.p1d281400} stroke={JJFC_NAVY} strokeMiterlimit="10" strokeWidth="0.226254" />
        <path d={svgPaths.p1d281400} stroke={JJFC_NAVY} strokeMiterlimit="10" strokeWidth="0.226254" />
        <path d={svgPaths.p1d281400} stroke={JJFC_NAVY} strokeMiterlimit="10" strokeWidth="0.226254" />
        <path d={svgPaths.p38b125c0} stroke={JJFC_NAVY} strokeMiterlimit="10" strokeWidth="0.226254" />
        <path d={svgPaths.p1d281400} stroke={JJFC_NAVY} strokeMiterlimit="10" strokeWidth="0.226254" />
        <path d={svgPaths.p1a556100} stroke={JJFC_NAVY} strokeMiterlimit="10" strokeWidth="0.226254" />
      </g>
      <defs>
        <clipPath id="clip0_jjfc_logo_svg">
          <rect width="186" height="186" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function LocationIconSvg() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <g>
        <mask id="path-1-inside-1_jjfc_location_svg" fill="white">
          <path d="M0 0H64V64H0V0Z" />
        </mask>
        <path d={svgPaths.p27f93f00} fill="#111111" mask="url(#path-1-inside-1_jjfc_location_svg)" />
        <path d={svgPaths.p2a3b4000} fill={JJFC_NAVY} />
      </g>
    </svg>
  );
}

function JjfcMatchResultCardSvg({ data }: { data: JjfcMatchResultCardData }) {
  const participantRows = splitNamesIntoRows(data.participantNames);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={CARD_SIZE}
      height={CARD_SIZE}
      viewBox={`0 0 ${CARD_SIZE} ${CARD_SIZE}`}
      fill="none"
    >
      <image href={backgroundImage} x="0" y="0" width="1080" height="1080" preserveAspectRatio="none" />

      <line x1="0" y1="282" x2="1080" y2="282" stroke="#435161" strokeWidth="1.5" />
      <line x1="0" y1="346" x2="1080" y2="346" stroke="#111111" strokeWidth="1.5" />
      <line x1="324" y1="346" x2="324" y2="1050" stroke={JJFC_NAVY} strokeWidth="1.5" />

      <g transform="translate(64 48)">
        <LogoSvg />
      </g>

      <g transform="translate(0 282)">
        <g transform="translate(0 0)">
          <LocationIconSvg />
        </g>
      </g>

      <text
        x="1016"
        y="138"
        fill={JJFC_NAVY}
        fontFamily="Changa, Anton, sans-serif"
        fontSize="108.396"
        fontWeight="700"
        textAnchor="end"
        dominantBaseline="hanging"
      >
        {data.date}
      </text>
      <text
        x="1016"
        y="232"
        fill={JJFC_NAVY}
        fontFamily="Changa, Anton, sans-serif"
        fontSize="108.396"
        fontWeight="700"
        textAnchor="end"
        dominantBaseline="hanging"
      >
        FULL TIME
      </text>

      <text
        x="80"
        y="314"
        fill={JJFC_NAVY}
        fontFamily="Pretendard, sans-serif"
        fontSize="32"
        fontWeight="800"
        dominantBaseline="middle"
      >
        {data.location}
      </text>

      {data.quarterSummaries.slice(0, 4).map((quarter, quarterIndex) => {
        const quarterBaseY = 430 + quarterIndex * 158;
        return (
          <g key={quarter.quarter}>
            <text
              x="64"
              y={quarterBaseY}
              fill={JJFC_NAVY}
              fontFamily="Changa, Anton, sans-serif"
              fontSize="32"
              fontWeight="700"
              dominantBaseline="hanging"
            >
              {quarter.quarter}Q - {quarter.ourScore}:{quarter.opponentScore}
            </text>
            {quarter.goals.slice(0, 3).map((goal, goalIndex) => {
              const goalY = quarterBaseY + 50 + goalIndex * 38;
              return (
                <text
                  key={`${quarter.quarter}-${goal.scorerName}-${goalIndex}`}
                  x="64"
                  y={goalY}
                  fontFamily="Pretendard, sans-serif"
                  fontSize="24"
                  fontWeight="700"
                  dominantBaseline="middle"
                >
                  <tspan fill={JJFC_NAVY}>{truncateText(goal.scorerName, 7)}</tspan>
                  {goal.assistName ? (
                    <tspan fill={JJFC_MUTED}>{` (AS ${truncateText(goal.assistName, 7)})`}</tspan>
                  ) : null}
                </text>
              );
            })}
          </g>
        );
      })}

      <text
        x="484"
        y="440"
        fill={JJFC_NAVY}
        fontFamily="Pretendard, sans-serif"
        fontSize="40"
        fontWeight="800"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {data.teamName}
      </text>
      <text
        x="864"
        y="440"
        fill={JJFC_NAVY}
        fontFamily="Pretendard, sans-serif"
        fontSize="40"
        fontWeight="800"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {data.opponentName}
      </text>

      <rect x="673.7" y="460.7" width="52" height="10.601" fill={JJFC_NAVY} transform="rotate(90 673.7 460.7)" />

      <text
        x="534"
        y="744"
        fill={JJFC_ORANGE}
        fontFamily="Changa, Anton, sans-serif"
        fontSize="352.918"
        fontWeight="700"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {data.ourScore}
      </text>
      <text
        x="860"
        y="744"
        fill="rgba(0,45,97,0.98)"
        fontFamily="Changa, Anton, sans-serif"
        fontSize="352.918"
        fontWeight="700"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {data.opponentScore}
      </text>

      <text
        x="702"
        y="846"
        fill="#F77314"
        fontFamily="Pretendard, sans-serif"
        fontSize="28"
        fontWeight="700"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {`MOM ${data.momNames.join(",")}`}
      </text>

      {participantRows.map((row, rowIndex) => {
        const y = 912 + rowIndex * 46;
        const totalTextWidth = row.length * 62 + (row.length - 1) * 18;
        let cursorX = 540 - totalTextWidth / 2;

        return (
          <g key={`${row.join("-")}-${rowIndex}`}>
            {row.map((name, nameIndex) => {
              const textX = cursorX;
              cursorX += 62;
              const dividerX = cursorX + 8;
              cursorX += 18;

              return (
                <g key={`${name}-${nameIndex}`}>
                  <text
                    x={textX}
                    y={y}
                    fill={JJFC_SLATE}
                    fontFamily="Pretendard, sans-serif"
                    fontSize="26"
                    fontWeight="700"
                    dominantBaseline="middle"
                  >
                    {truncateText(name, 5)}
                  </text>
                  {nameIndex < row.length - 1 ? (
                    <rect x={dividerX} y={y - 6} width="2" height="12" fill={JJFC_SOFT} />
                  ) : null}
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("이미지를 불러오지 못했습니다."));
    image.src = src;
  });

let jjfcAssetsPromise: Promise<{
  background: HTMLImageElement;
}> | null = null;

const preloadJjfcAssets = async () => {
  if (typeof document !== "undefined" && document.fonts) {
    await Promise.allSettled([
      document.fonts.load("700 108.396px Changa"),
      document.fonts.load("700 352.918px Changa"),
      document.fonts.load("800 40px Pretendard"),
      document.fonts.load("800 32px Pretendard"),
      document.fonts.load("700 28px Pretendard"),
      document.fonts.load("700 26px Pretendard"),
      document.fonts.load("700 24px Pretendard"),
    ]);
    await document.fonts.ready;
  }

  if (!jjfcAssetsPromise) {
    jjfcAssetsPromise = loadImage(backgroundImage).then((background) => ({
      background,
    }));
  }

  return jjfcAssetsPromise;
};

const fillText = (
  context: CanvasRenderingContext2D,
  text: string,
  {
    x,
    y,
    color,
    font,
    align = "left",
    baseline = "alphabetic",
  }: {
    x: number;
    y: number;
    color: string;
    font: string;
    align?: CanvasTextAlign;
    baseline?: CanvasTextBaseline;
  },
) => {
  context.save();
  context.fillStyle = color;
  context.font = font;
  context.textAlign = align;
  context.textBaseline = baseline;
  context.fillText(text, x, y);
  context.restore();
};

const fillPath = (
  context: CanvasRenderingContext2D,
  pathData: string,
  color: string,
  offsetX = 0,
  offsetY = 0,
) => {
  context.save();
  if (offsetX !== 0 || offsetY !== 0) {
    context.translate(offsetX, offsetY);
  }
  context.fillStyle = color;
  context.fill(new Path2D(pathData));
  context.restore();
};

const strokePath = (
  context: CanvasRenderingContext2D,
  pathData: string,
  color: string,
  lineWidth: number,
  offsetX = 0,
  offsetY = 0,
) => {
  context.save();
  if (offsetX !== 0 || offsetY !== 0) {
    context.translate(offsetX, offsetY);
  }
  context.strokeStyle = color;
  context.lineWidth = lineWidth;
  context.stroke(new Path2D(pathData));
  context.restore();
};

const drawLogo = (context: CanvasRenderingContext2D, x: number, y: number) => {
  fillPath(context, svgPaths.p36ea7d00, JJFC_NAVY, x, y);
  fillPath(context, svgPaths.p45a6600, JJFC_NAVY, x, y);
  fillPath(context, svgPaths.p38e4d200, JJFC_NAVY, x, y);
  fillPath(context, svgPaths.p3465d700, JJFC_NAVY, x, y);
  strokePath(context, svgPaths.p1d281400, JJFC_NAVY, 0.226254, x, y);
  strokePath(context, svgPaths.p38b125c0, JJFC_NAVY, 0.226254, x, y);
  strokePath(context, svgPaths.p1a556100, JJFC_NAVY, 0.226254, x, y);
};

const drawLocationIcon = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
) => {
  fillPath(context, svgPaths.p27f93f00, "#111111", x, y);
  fillPath(context, svgPaths.p2a3b4000, JJFC_NAVY, x, y);
};

export const createJjfcMatchResultCanvas = async (data: JjfcMatchResultCardData) => {
  const canvas = document.createElement("canvas");
  canvas.width = CARD_SIZE;
  canvas.height = CARD_SIZE;
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("이미지 저장을 지원하지 않는 브라우저입니다.");
  }

  const { background } = await preloadJjfcAssets();
  const participantRows = splitNamesIntoRows(data.participantNames);

  context.clearRect(0, 0, CARD_SIZE, CARD_SIZE);
  context.drawImage(background, 0, 0, CARD_SIZE, CARD_SIZE);

  context.save();
  context.strokeStyle = "#435161";
  context.lineWidth = 1.5;
  context.beginPath();
  context.moveTo(0, 282);
  context.lineTo(1080, 282);
  context.stroke();

  context.strokeStyle = "#111111";
  context.beginPath();
  context.moveTo(0, 346);
  context.lineTo(1080, 346);
  context.stroke();

  context.strokeStyle = JJFC_NAVY;
  context.beginPath();
  context.moveTo(324, 346);
  context.lineTo(324, 1050);
  context.stroke();
  context.restore();

  drawLogo(context, 64, 48);
  drawLocationIcon(context, 0, 282);

  fillText(context, data.date, {
    x: 1016,
    y: 138,
    color: JJFC_NAVY,
    font: "700 108.396px Changa, Anton, sans-serif",
    align: "right",
    baseline: "top",
  });
  fillText(context, "FULL TIME", {
    x: 1016,
    y: 232,
    color: JJFC_NAVY,
    font: "700 108.396px Changa, Anton, sans-serif",
    align: "right",
    baseline: "top",
  });

  fillText(context, data.location, {
    x: 80,
    y: 314,
    color: JJFC_NAVY,
    font: "800 32px Pretendard, sans-serif",
    baseline: "middle",
  });

  data.quarterSummaries.slice(0, 4).forEach((quarter, quarterIndex) => {
    const quarterBaseY = 430 + quarterIndex * 158;

    fillText(context, `${quarter.quarter}Q - ${quarter.ourScore}:${quarter.opponentScore}`, {
      x: 64,
      y: quarterBaseY,
      color: JJFC_NAVY,
      font: "700 32px Changa, Anton, sans-serif",
      baseline: "top",
    });

    quarter.goals.slice(0, 3).forEach((goal, goalIndex) => {
      const goalY = quarterBaseY + 50 + goalIndex * 38;
      const scorerText = truncateText(goal.scorerName, 7);

      context.save();
      context.font = "700 24px Pretendard, sans-serif";
      context.textAlign = "left";
      context.textBaseline = "middle";
      context.fillStyle = JJFC_NAVY;
      context.fillText(scorerText, 64, goalY);

      if (goal.assistName) {
        const scorerWidth = context.measureText(scorerText).width;
        context.fillStyle = JJFC_MUTED;
        context.fillText(` (AS ${truncateText(goal.assistName, 7)})`, 64 + scorerWidth, goalY);
      }

      context.restore();
    });
  });

  fillText(context, data.teamName, {
    x: 484,
    y: 440,
    color: JJFC_NAVY,
    font: "800 40px Pretendard, sans-serif",
    align: "center",
    baseline: "middle",
  });
  fillText(context, data.opponentName, {
    x: 864,
    y: 440,
    color: JJFC_NAVY,
    font: "800 40px Pretendard, sans-serif",
    align: "center",
    baseline: "middle",
  });

  context.save();
  context.translate(673.7, 460.7);
  context.rotate(Math.PI / 2);
  context.fillStyle = JJFC_NAVY;
  context.fillRect(0, 0, 52, 10.601);
  context.restore();

  fillText(context, String(data.ourScore), {
    x: 534,
    y: 744,
    color: JJFC_ORANGE,
    font: "700 352.918px Changa, Anton, sans-serif",
    align: "center",
    baseline: "middle",
  });
  fillText(context, String(data.opponentScore), {
    x: 860,
    y: 744,
    color: "rgba(0,45,97,0.98)",
    font: "700 352.918px Changa, Anton, sans-serif",
    align: "center",
    baseline: "middle",
  });

  fillText(context, `MOM ${data.momNames.join(",")}`, {
    x: 702,
    y: 846,
    color: "#F77314",
    font: "700 28px Pretendard, sans-serif",
    align: "center",
    baseline: "middle",
  });

  participantRows.forEach((row, rowIndex) => {
    const y = 912 + rowIndex * 46;
    const totalTextWidth = row.length * 62 + (row.length - 1) * 18;
    let cursorX = 540 - totalTextWidth / 2;

    row.forEach((name, nameIndex) => {
      const textX = cursorX;
      cursorX += 62;
      const dividerX = cursorX + 8;
      cursorX += 18;

      fillText(context, truncateText(name, 5), {
        x: textX,
        y,
        color: JJFC_SLATE,
        font: "700 26px Pretendard, sans-serif",
        baseline: "middle",
      });

      if (nameIndex < row.length - 1) {
        context.save();
        context.fillStyle = JJFC_SOFT;
        context.fillRect(dividerX, y - 6, 2, 12);
        context.restore();
      }
    });
  });

  return canvas;
};

export const createJjfcMatchResultImageUrl = async (data: JjfcMatchResultCardData) => {
  const canvas = await createJjfcMatchResultCanvas(data);
  return canvas.toDataURL("image/png");
};

export const downloadJjfcMatchResultImage = async (
  data: JjfcMatchResultCardData,
  fileName: string,
) => {
  const canvas = await createJjfcMatchResultCanvas(data);
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((pngBlob) => {
      if (pngBlob) resolve(pngBlob);
      else reject(new Error("이미지 생성에 실패했습니다."));
    }, "image/png");
  });

  const link = document.createElement("a");
  const objectUrl = URL.createObjectURL(blob);
  link.href = objectUrl;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(objectUrl);
};

interface JjfcMatchResultCardProps {
  data: JjfcMatchResultCardData;
}

export function JjfcMatchResultCard({ data }: JjfcMatchResultCardProps) {
  const participantRows = splitNamesIntoRows(data.participantNames);

  return (
    <div
      className="relative size-full overflow-hidden"
      style={{
        width: CARD_SIZE,
        height: CARD_SIZE,
      }}
    >
      <img
        alt=""
        src={backgroundImage}
        className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
      />

      <div className="relative flex h-full w-full flex-col items-start">
        <div className="relative flex w-full shrink-0 flex-col items-start">
          <div className="relative flex w-full shrink-0 items-center justify-between border-b-[1.5px] border-[#435161] px-[64px] py-[48px]">
            <div className="relative size-[186px] shrink-0">
              <LogoSvg />
            </div>
            <div
              className="relative flex shrink-0 flex-col items-end text-right leading-none text-[#002d61]"
              style={{ fontFamily: "Changa, Anton, sans-serif", fontWeight: 700, fontSize: 108.396 }}
            >
              <p className="relative shrink-0 whitespace-nowrap">{data.date}</p>
              <p className="relative shrink-0 whitespace-nowrap">FULL TIME</p>
            </div>
          </div>

          <div className="relative flex w-full shrink-0 items-start gap-[16px] border-b-[1.5px] border-black">
            <div className="relative size-[64px] shrink-0">
              <LocationIconSvg />
            </div>
            <div className="relative flex shrink-0 items-center justify-center py-[12px] pr-[16px]">
              <p
                className="whitespace-nowrap text-[#002d61]"
                style={{ fontFamily: "Pretendard, sans-serif", fontWeight: 800, fontSize: 32 }}
              >
                {data.location}
              </p>
            </div>
          </div>
        </div>

        <div className="relative flex w-full shrink-0 items-center">
          <div className="relative flex h-[704px] w-[324px] shrink-0 items-start border-r-[1.5px] border-[#002d61] px-[64px] py-[40px]">
            <div className="relative flex h-full shrink-0 flex-col items-start gap-[40px]">
              {data.quarterSummaries.slice(0, 4).map((quarter) => (
                <div
                  key={quarter.quarter}
                  className="relative flex w-full shrink-0 flex-col items-start gap-[8px]"
                >
                  <p
                    className="relative shrink-0 leading-none text-[#002d61]"
                    style={{ fontFamily: "Changa, Anton, sans-serif", fontWeight: 700, fontSize: 32 }}
                  >
                    {quarter.quarter}Q - {quarter.ourScore}:{quarter.opponentScore}
                  </p>

                  {quarter.goals.slice(0, 3).map((goal, goalIndex) => (
                    <div
                      key={`${quarter.quarter}-${goal.scorerName}-${goalIndex}`}
                      className="relative flex shrink-0 items-start gap-[6px] whitespace-nowrap"
                      style={{ fontFamily: "Pretendard, sans-serif", fontWeight: 700, fontSize: 24 }}
                    >
                      <p className="relative shrink-0 text-[#002d61]">
                        {truncateText(goal.scorerName, 7)}
                      </p>
                      {goal.assistName ? (
                        <p className="relative shrink-0 text-[#8393a7]">
                          (AS {truncateText(goal.assistName, 7)})
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-1 flex-row items-center self-stretch">
            <div className="relative flex h-full min-w-px flex-1 flex-col items-center pb-[10px] pt-[48px]">
              <div className="relative flex w-full shrink-0 items-center px-[32px]">
                <div className="relative flex min-w-px flex-1 flex-col items-center">
                  <p
                    className="relative shrink-0 whitespace-nowrap text-[#002d61]"
                    style={{ fontFamily: "Pretendard, sans-serif", fontWeight: 800, fontSize: 40, lineHeight: "48px" }}
                  >
                    {data.teamName}
                  </p>
                  <p
                    className="relative shrink-0 text-center leading-none text-[rgba(248,113,16,0.98)]"
                    style={{ fontFamily: "Changa, Anton, sans-serif", fontWeight: 700, fontSize: 352.918 }}
                  >
                    {data.ourScore}
                  </p>
                </div>

                <div className="relative flex w-[52px] shrink-0 flex-col items-start pt-[48px]">
                  <div className="relative flex h-[10.601px] w-full shrink-0 items-center justify-center">
                    <div className="h-[52px] w-[10.601px] rotate-90 bg-[#002d61]" />
                  </div>
                </div>

                <div className="relative flex min-w-px flex-1 flex-col items-center">
                  <p
                    className="relative shrink-0 whitespace-nowrap text-[#002d61]"
                    style={{ fontFamily: "Pretendard, sans-serif", fontWeight: 800, fontSize: 40, lineHeight: "48px" }}
                  >
                    {data.opponentName}
                  </p>
                  <p
                    className="relative shrink-0 text-center leading-none text-[rgba(0,45,97,0.98)]"
                    style={{ fontFamily: "Changa, Anton, sans-serif", fontWeight: 700, fontSize: 352.918 }}
                  >
                    {data.opponentScore}
                  </p>
                </div>
              </div>

              <div className="relative flex w-full shrink-0 flex-col items-center gap-[32px]">
                <div
                  className="relative flex shrink-0 items-center gap-[12px] whitespace-nowrap text-[#f77314]"
                  style={{ fontFamily: "Pretendard, sans-serif", fontWeight: 700, fontSize: 28 }}
                >
                  <p className="relative shrink-0">MOM</p>
                  <p className="relative shrink-0">{data.momNames.join(",")}</p>
                </div>

                <div className="relative flex shrink-0 flex-col items-center gap-[16px]">
                  {participantRows.map((row, rowIndex) => (
                    <div key={`${rowIndex}-${row.join("-")}`} className="relative flex shrink-0 items-center gap-[16px]">
                      {row.map((name, nameIndex) => (
                        <div key={`${name}-${nameIndex}`} className="relative flex shrink-0 items-center gap-[16px]">
                          <p
                            className="relative shrink-0 whitespace-nowrap text-[#2d313a]"
                            style={{ fontFamily: "Pretendard, sans-serif", fontWeight: 700, fontSize: 26 }}
                          >
                            {truncateText(name, 5)}
                          </p>
                          {nameIndex < row.length - 1 ? (
                            <div className="h-[12px] w-[2px] shrink-0 bg-[#c3cde7]" />
                          ) : null}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
