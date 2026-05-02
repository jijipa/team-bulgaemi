import rankSvgPaths from "../../imports/svg-fnwogjyv26";
import { teamConfig } from "../config/team";

interface TeamMemberJerseyProps {
  name?: string;
  number?: string;
  variant?: "list" | "preview";
}

export default function TeamMemberJersey({
  name = "",
  number = "",
  variant = "list",
}: TeamMemberJerseyProps) {
  if (variant === "preview") {
    const trimmedName = name.trim();
    const trimmedNumber = number.trim();
    const previewNumberSize = trimmedNumber.length >= 3 ? 60 : 72;

    return (
      <div
        className="relative shrink-0"
        style={{
          width: 180,
          minWidth: 180,
          maxWidth: 180,
          height: 172,
          minHeight: 172,
          flex: "0 0 180px",
        }}
      >
        <svg
          aria-hidden="true"
          className="absolute inset-0 block"
          height="172"
          preserveAspectRatio="none"
          viewBox="0 0 24 24"
          width="180"
        >
          <g>
            <path
              d={rankSvgPaths.p1b424700}
              fill={teamConfig.leaderboardJerseySecondaryColor}
            />
            <path
              d={rankSvgPaths.p1c0fd00}
              fill={teamConfig.leaderboardJerseyPrimaryColor}
              stroke="rgba(0,0,0,0.04)"
              strokeWidth="0.2"
            />
          </g>
        </svg>

        <div
          className="absolute left-1/2 flex w-[180px] -translate-x-1/2 flex-col items-center justify-start"
          style={{ top: 40 }}
        >
          {trimmedName ? (
            <div className="flex w-[180px] items-center justify-center">
              <p
                className="text-center leading-[normal] whitespace-nowrap"
                style={{
                  color: teamConfig.leaderboardJerseyNumberColor,
                  fontFamily: "var(--font-paperlogy)",
                  fontSize: 24,
                  fontWeight: 700,
                }}
              >
                {trimmedName}
              </p>
            </div>
          ) : null}
          {trimmedNumber ? (
            <div className="flex w-[180px] items-center justify-center">
              <p
                className="text-center whitespace-nowrap"
                style={{
                  color: teamConfig.leaderboardJerseyNumberColor,
                  fontFamily: "var(--font-anton)",
                  fontSize: previewNumberSize,
                  lineHeight: "100%",
                }}
              >
                {trimmedNumber}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="relative size-[32px] shrink-0">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g>
          <g>
            <path
              d={rankSvgPaths.p1b424700}
              fill={teamConfig.leaderboardJerseySecondaryColor}
            />
            <path
              d={rankSvgPaths.p1c0fd00}
              fill={teamConfig.leaderboardJerseyPrimaryColor}
            />
          </g>
        </g>
      </svg>
      <p
        className="absolute inset-0 flex items-center justify-center text-center leading-[15px] tracking-[0.105px]"
        style={{
          color: teamConfig.leaderboardJerseyNumberColor,
          fontFamily: "var(--font-anton)",
          fontSize: 10.5,
        }}
      >
        {number || "0"}
      </p>
    </div>
  );
}
