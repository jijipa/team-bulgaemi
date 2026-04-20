import svgPaths from "./svg-3vz7byxyqa";
import svgPathsMom from "./svg-63gix63taq";

interface CardMomProps {
  matchDate: string; // YY.MM.DD 형식
  playerName: string | string[]; // 단일 선수 또는 여러 선수
  playerNumber?: string | string[]; // 선수 번호 (선택사항)
}

function GroupPlayer({ playerName }: { playerName: string }) {
  return (
    <div
      className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative"
      data-name="group-player"
    >
      <p
        className="font-semibold leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[18px] w-full whitespace-pre-wrap"
        style={{ fontFamily: "var(--font-pretendard)" }}
      >
        {playerName}
      </p>
    </div>
  );
}

function GroupWinner({ playerName }: { playerName: string }) {
  return (
    <div
      className="content-stretch flex items-center relative shrink-0 w-full"
      data-name="group-winner"
    >
      <GroupPlayer playerName={playerName} />
    </div>
  );
}

function IconNumber({ number, left }: { number: string; left: string }) {
  return (
    <div
      className="absolute size-[76px] top-[27px]"
      style={{ left }}
      data-name="icon-number"
    >
      <div className="absolute inset-[-0.33%_-3.69%_-10.86%_-11.62%]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 87.635 84.5001"
        >
          <g id="icon-number">
            <g filter="url(#filter0_d_2062_111)" id="Group">
              <path
                d={svgPaths.p2f2e7000}
                fill="var(--fill-0, #283135)"
                id="Vector"
              />
              <path
                d={svgPaths.p11af6780}
                fill="var(--fill-0, #E24444)"
                id="Vector_2"
              />
            </g>
          </g>
          <defs>
            <filter
              colorInterpolationFilters="sRGB"
              filterUnits="userSpaceOnUse"
              height="84.5001"
              id="filter0_d_2062_111"
              width="87.635"
              x="-2.38419e-07"
              y="0"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                result="hardAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              />
              <feOffset dx="-3" dy="4" />
              <feGaussianBlur stdDeviation="4.5" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"
              />
              <feBlend
                in2="BackgroundImageFix"
                mode="normal"
                result="effect1_dropShadow_2062_111"
              />
              <feBlend
                in="SourceGraphic"
                in2="effect1_dropShadow_2062_111"
                mode="normal"
                result="shape"
              />
            </filter>
          </defs>
        </svg>
      </div>
      {/* 번호 텍스트 오버레이 */}
      <p
        className="absolute inset-0 flex items-center justify-center text-[32px] leading-[32px] text-center not-italic font-extrabold text-[#283135]"
        style={{
          fontFamily: "var(--font-anton)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        {number}
      </p>
    </div>
  );
}

export function CardMom({
  matchDate,
  playerName,
  playerNumber = "1",
}: CardMomProps) {
  // matchDate를 YY와 MM.DD로 분리 (예: "25.03.02" -> "25", "03.02")
  const dateParts = matchDate.split(".");
  const year = dateParts[0] || "26";
  const monthDay =
    dateParts.length > 1 ? `${dateParts[1]}.${dateParts[2]}` : "01.01";

  // 배열 처리
  const playerNames = Array.isArray(playerName) ? playerName : [playerName];
  const playerNumbers = Array.isArray(playerNumber)
    ? playerNumber
    : [playerNumber];
  const isMultiplePlayers = playerNames.length > 1;

  // 선수 이름 쉼표로 구분
  const displayName = playerNames.join(", ");

  // MOM 텍스트 위치 (1명: left-[35px], 2명 이상: right-[-13.58px])
  const momPosition = isMultiplePlayers ? "right-[-13.58px]" : "left-[35px]";

  // 아이콘 번호 위치
  const iconPositions = isMultiplePlayers ? ["126px", "172px"] : ["89px"];

  return (
    <div
      className="content-stretch flex flex-col gap-[12px] items-start overflow-clip p-[12px] relative rounded-[12px] size-full bg-[#f9f9f9]"
      data-name="card-mom"
    >
      <div
        className={`absolute h-[33.488px] ${momPosition} top-[11px] w-[126.583px]`}
      >
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 126.583 33.488"
        >
          <g id="MOM">
            <path
              d={svgPathsMom.p218d7f80}
              fill="url(#paint0_linear_mom)"
              id="Vector"
            />
            <path
              d={svgPathsMom.p105dcb80}
              fill="url(#paint1_linear_mom)"
              id="Vector_2"
            />
            <path
              d={svgPathsMom.p18310970}
              fill="url(#paint2_linear_mom)"
              id="Vector_3"
            />
          </g>
          <defs>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              id="paint0_linear_mom"
              x1="155.264"
              x2="-52.736"
              y1="-4.156"
              y2="39.844"
            >
              <stop stopColor="#9EF7FF" stopOpacity="0.7" />
              <stop offset="1" stopColor="#D7BCF4" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              id="paint1_linear_mom"
              x1="155.264"
              x2="-52.736"
              y1="-4.156"
              y2="39.844"
            >
              <stop stopColor="#9EF7FF" stopOpacity="0.7" />
              <stop offset="1" stopColor="#D7BCF4" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              id="paint2_linear_mom"
              x1="155.264"
              x2="-52.736"
              y1="-4.156"
              y2="39.844"
            >
              <stop stopColor="#9EF7FF" stopOpacity="0.7" />
              <stop offset="1" stopColor="#D7BCF4" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div
        className="font-bold leading-[normal] not-italic relative shrink-0 text-[#54545c] text-[15px] whitespace-nowrap"
        style={{ fontFamily: "var(--font-paperlogy)" }}
      >
        <p className="mb-0">{year}</p>
        <p>{monthDay}</p>
      </div>
      <GroupWinner playerName={displayName} />
      {playerNumbers.slice(0, iconPositions.length).map((num, index) => (
        <IconNumber key={index} number={num} left={iconPositions[index]} />
      ))}
    </div>
  );
}
