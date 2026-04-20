import { motion } from "motion/react";
import svgPaths from "../../imports/svg-jbyv1wn31m";
import mercenaryIconPaths from "../../imports/svg-6cpqm0k9qq";

interface Player {
  id: string;
  number: string;
  name: string;
}

interface Mercenary {
  id: string;
  name: string;
}

interface AssistSelectSheetProps {
  scorerName: string;
  scorerIsMercenary: boolean; // 득점자가 용병인지 여부 추가
  selectedPlayers: Player[];
  mercenaries: Mercenary[];
  excludePlayerId?: string; // 득점 선수는 제외
  onSelectAssist: (player: Player | Mercenary | null, isMercenary: boolean) => void;
  onClose: () => void;
}

function NoAssistIcon() {
  return (
    <div className="overflow-clip relative shrink-0 size-[64px]">
      <div className="absolute inset-[18.75%_19.53%_18.75%_17.97%]">
        <div className="absolute inset-[-5.3%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 44.2426 44.2426">
            <g>
              <path d={svgPaths.p289dc400} stroke="var(--stroke-0, #6E7783)" strokeWidth="6" />
              <path d={svgPaths.p1403f900} stroke="var(--stroke-0, #6E7783)" strokeWidth="6" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function MercenaryIcon() {
  return (
    <div className="relative shrink-0 size-[64px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 64 64">
        <g clipPath="url(#clip0_20_2696_assist)">
          <path d={mercenaryIconPaths.pdf75580} fill="var(--fill-0, #6E7783)" />
          <path d={mercenaryIconPaths.p331cb500} fill="url(#paint0_linear_20_2696_assist)" />
          <path d={mercenaryIconPaths.p38ff1d00} fill="var(--fill-0, #CECECE)" />
          <path d={mercenaryIconPaths.p12074800} fill="var(--fill-0, #CECECE)" />
          <g>
            <path d={mercenaryIconPaths.p942ee00} fill="var(--fill-0, #6E7783)" />
            <path d={mercenaryIconPaths.p1bf81640} fill="var(--fill-0, #CECECE)" />
          </g>
          <path d={mercenaryIconPaths.p3aa5cf40} fill="var(--fill-0, #6E7783)" />
          <path d={mercenaryIconPaths.p12074800} fill="var(--fill-0, #CECECE)" />
          <g />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_20_2696_assist" x1="31.9867" x2="31.9867" y1="4.78646" y2="59.9998">
            <stop stopColor="#F7EE43" />
            <stop offset="1" stopColor="#FCB900" />
          </linearGradient>
          <clipPath id="clip0_20_2696_assist">
            <rect fill="white" height="64" width="64" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function PlayerNumberIcon({ number, disabled }: { number: string; disabled?: boolean }) {
  return (
    <div className="overflow-clip relative shrink-0 size-[64px]">
      <div className="absolute inset-[6.25%_4.21%_6.25%_4.17%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 58.64 56">
          <g>
            <path d={svgPaths.p1257a430} fill={disabled ? "var(--fill-0, #CECECE)" : "var(--fill-0, #242B35)"} />
          </g>
        </svg>
      </div>
      <p className="absolute inset-[18.75%_20%_18.75%_20%] leading-[40px] not-italic text-[#f2f2f2] text-[28px] text-center tracking-[0.28px]" style={{ fontFamily: 'var(--font-anton)' }}>
        {number}
      </p>
    </div>
  );
}

export default function AssistSelectSheet({
  scorerName,
  scorerIsMercenary,
  selectedPlayers,
  mercenaries,
  excludePlayerId,
  onSelectAssist,
  onClose,
}: AssistSelectSheetProps) {
  // Filter out the scorer from both players and mercenaries
  const availablePlayers = scorerIsMercenary
    ? selectedPlayers
    : selectedPlayers.filter((p) => p.id !== excludePlayerId);

  const availableMercenaries = scorerIsMercenary
    ? mercenaries.filter((m) => m.name !== scorerName)
    : mercenaries;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-40"
      />

      {/* Bottom Sheet */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "tween", duration: 0.3 }}
        className="fixed bottom-0 left-0 right-0 bg-white rounded-tl-[20px] rounded-tr-[20px] z-50 max-h-[80vh] overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {/* Header */}
        <div className="relative h-[56px]">
          <button
            onClick={onClose}
            className="absolute right-[8px] top-1/2 -translate-y-1/2 flex items-center justify-center size-[40px]"
          >
            <div className="flex items-center justify-center relative shrink-0">
              <div className="flex-none rotate-180">
                <div className="relative size-[24px]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                    <g>
                      <path
                        d={svgPaths.p208b6880}
                        stroke="var(--stroke-0, #242B35)"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="content-stretch flex flex-col gap-[24px] items-start pb-[48px]">
          {/* Title */}
          <div className="relative shrink-0 w-full">
            <div className="flex flex-row items-center size-full">
              <div className="content-stretch flex items-center px-[20px] relative w-full">
                <div className="font-bold leading-[32px] not-italic relative shrink-0 text-[#242b35] text-[24px] tracking-[-0.48px]" style={{ fontFamily: 'var(--font-pretendard)' }}>
                  <p className="mb-0">{scorerName}님의 득점에 도움을 준</p>
                  <p>플레이어를 선택해주세요.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Player Grid */}
          <div className="relative shrink-0 w-full">
            <div className="content-stretch flex flex-col items-start px-[20px] relative w-full">
              <div className="grid grid-cols-3 gap-[4px] relative shrink-0 w-full">
                {/* No Assist Option */}
                <button
                  onClick={() => onSelectAssist(null, false)}
                  className="bg-[#f2f2f2] relative rounded-[12px] hover:bg-[#e8e8e8] transition-colors"
                >
                  <div className="flex flex-col items-center size-full">
                    <div className="content-stretch flex flex-col gap-[4px] items-center px-[2px] py-[8px] relative w-full">
                      <NoAssistIcon />
                      <p className="font-semibold leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[16px] text-center whitespace-pre-wrap" style={{ fontFamily: 'var(--font-pretendard)' }}>
                        도움 없음
                      </p>
                    </div>
                  </div>
                </button>

                {/* Regular Players */}
                {availablePlayers.map((player) => (
                  <button
                    key={player.id}
                    onClick={() => onSelectAssist(player, false)}
                    className="bg-[#f2f2f2] relative rounded-[12px] hover:bg-[#e8e8e8] transition-colors"
                  >
                    <div className="flex flex-col items-center size-full">
                      <div className="content-stretch flex flex-col gap-[4px] items-center px-[2px] py-[8px] relative w-full">
                        <PlayerNumberIcon number={player.number} />
                        <p className="font-semibold leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[16px] text-center whitespace-pre-wrap" style={{ fontFamily: 'var(--font-pretendard)' }}>
                          {player.name}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}

                {/* Mercenaries */}
                {availableMercenaries.map((mercenary) => (
                  <button
                    key={mercenary.id}
                    onClick={() => onSelectAssist(mercenary, true)}
                    className="bg-[#f2f2f2] relative rounded-[12px] hover:bg-[#e8e8e8] transition-colors"
                  >
                    <div className="flex flex-col items-center size-full">
                      <div className="content-stretch flex flex-col gap-[4px] items-center px-[2px] py-[8px] relative w-full">
                        <MercenaryIcon />
                        <p className="font-semibold leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[16px] text-center whitespace-pre-wrap" style={{ fontFamily: 'var(--font-pretendard)' }}>
                          {mercenary.name}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}