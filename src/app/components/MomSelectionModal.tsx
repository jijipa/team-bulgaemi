import { useState, useEffect } from "react";
import svgPaths from "../../imports/svg-lymyjq5w8m";
import { getPlayers } from "../utils/storage";
import { toast } from "sonner";
import { motion } from "motion/react";

interface Player {
  id: string;
  name: string;
  number: string;
}

interface PlayerWithStats extends Player {
  goals: number;
  assists: number;
  totalPoints: number;
}

interface MomSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchId: string;
  matchDate: string;
  opponentName: string;
  participants: string[]; // 참가 선수 ID 배열
  scores: Array<{
    playerId: string;
    playerName: string;
    goals: number;
    assists: number;
    isMercenary?: boolean;
  }>;
  onSelectMom: (selectedPlayerIds: string[]) => Promise<void>;
}

function IconArrowRight() {
  return (
    <div className="relative size-[24px]" data-name="icon_arrow_right 1">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="icon_arrow_right 1">
          <path d={svgPaths.p208b6880} stroke="var(--stroke-0, #242B35)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function CheckIcon() {
  return (
    <div className="absolute left-0 size-[19.998px] top-0">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.9976 19.9976">
        <g id="Frame 77">
          <path d={svgPaths.p371c0d00} fill="var(--fill-0, #242B35)" />
          <path d={svgPaths.p1e582c80} id="Vector 22" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function PlayerCard({ 
  player, 
  isSelected, 
  onClick,
  shake
}: { 
  player: PlayerWithStats; 
  isSelected: boolean; 
  onClick: () => void;
  shake: boolean;
}) {
  const iconFillColor = isSelected ? "#242B35" : "#CECECE";
  const textColor = isSelected ? "#f2f2f2" : "#6e7783";

  return (
    <motion.button
      onClick={onClick}
      className={`bg-[#f2f2f2] flex-[1_0_0] min-h-px min-w-[90px] relative rounded-[12px]`}
      style={{
        boxShadow: isSelected ? "inset 0 0 0 1px #242b35" : "none"
      }}
      animate={shake ? {
        x: [0, -10, 10, -10, 10, 0],
        transition: { duration: 0.5 }
      } : {}}
    >
      <div className="flex flex-col items-center min-w-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[4px] items-center min-w-[inherit] px-[2px] py-[8px] relative w-full">
          {/* Icon Number */}
          <div className="overflow-clip relative shrink-0 size-[64px]" data-name="icon-number">
            <div className="absolute inset-[6.25%_4.21%_6.25%_4.17%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 58.64 56">
                <g>
                  <path d={svgPaths.p1257a430} fill={iconFillColor} />
                </g>
              </svg>
            </div>
            <p 
              className="absolute inset-[18.75%_18.75%_18.75%_18.75%] flex items-center justify-center leading-[40px] not-italic text-[28px] text-center tracking-[0.28px]"
              style={{ fontFamily: "var(--font-anton)", color: textColor }}
            >
              {player.number}
            </p>
          </div>
          {/* Player Name */}
          <p 
            className="leading-[normal] min-w-full not-italic relative shrink-0 text-[16px] text-center w-[min-content] whitespace-pre-wrap"
            style={{ fontFamily: "var(--font-pretendard)", fontWeight: 600 }}
          >
            {player.name}
          </p>
          {/* Check Icon */}
          {isSelected && <CheckIcon />}
        </div>
      </div>
    </motion.button>
  );
}

export default function MomSelectionModal({
  isOpen,
  onClose,
  matchId,
  matchDate,
  opponentName,
  participants,
  scores,
  onSelectMom,
}: MomSelectionModalProps) {
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shake, setShake] = useState(false);

  // 모든 선수 데이터 가져오기
  const allPlayers = getPlayers();

  // 참가 선수 목록 필터링 및 정렬 ((participants 사사용)
  const eligiblePlayers: PlayerWithStats[] = allPlayers
    .filter((player) => {
      // 1. 참가 선수 확인 (playerId를 문자열과 숫자 모두 비교)
      const isParticipant = participants.some(
        (pid) => String(pid) === String(player.id) || pid === player.id
      );
      if (!isParticipant) return false;
      
      // 2. 용병 제외
      const playerScore = scores.find((s) => String(s.playerId) === String(player.id));
      if (playerScore && playerScore.isMercenary) return false;
      
      return true;
    })
    .map((player) => {
      const playerScore = scores.find((s) => String(s.playerId) === String(player.id));
      const goals = playerScore?.goals || 0;
      const assists = playerScore?.assists || 0;
      
      return {
        ...player,
        goals,
        assists,
        totalPoints: goals + assists,
      };
    })
    .sort((a, b) => {
      // 1순위: 기여도 (골 + 도움) - 기여한 선수가 먼저
      if (a.totalPoints !== b.totalPoints) return b.totalPoints - a.totalPoints;
      // 2순위: 골
      if (a.goals !== b.goals) return b.goals - a.goals;
      // 3순위: 도움
      if (a.assists !== b.assists) return b.assists - a.assists;
      return 0;
    });
  
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🎯 [MomSelectionModal] 필터링 결과");
  console.log("  - All Players:", allPlayers);
  console.log("  - Participants (raw):", participants);
  console.log("  - Scores:", scores);
  console.log("  - Eligible Players:", eligiblePlayers);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  const handlePlayerClick = (playerId: string) => {
    setSelectedPlayerIds((prev) => {
      if (prev.includes(playerId)) {
        // 선택 해제
        return prev.filter((id) => id !== playerId);
      } else {
        // ✅ 최대 2명 제한
        if (prev.length >= 2) {
          // 흔들림 애니메이션 트리거
          setShake(true);
          setTimeout(() => setShake(false), 500);
          
          // 토스트 메시지 표시
          toast.error("MOM은 최대 2명까지 선정할 수 있습니다.", {
            duration: 2000,
          });
          
          return prev; // 선택하지 않음
        }
        return [...prev, playerId];
      }
    });
  };

  const handleSubmit = async () => {
    if (selectedPlayerIds.length === 0) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSelectMom(selectedPlayerIds);
      setSelectedPlayerIds([]);
      onClose();
      toast.success("MOM 선정이 완료되었습니다.");
    } catch (error) {
      console.error("MOM 선정 실패:", error);
      alert("MOM 선정에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setSelectedPlayerIds([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-x-0 bottom-0 z-50 animate-slide-up">
        <div className="bg-white content-stretch flex flex-col gap-[24px] items-start overflow-clip pt-[56px] pb-[24px] relative rounded-tl-[20px] rounded-tr-[20px] max-h-[90vh] overflow-y-auto">
          {/* Close Button */}
          <div className="absolute bg-white h-[56px] left-0 top-0 right-0">
            <button
              onClick={onClose}
              className="absolute content-stretch flex items-center justify-center right-[8px] size-[40px] top-[8px]"
            >
              <div className="flex items-center justify-center relative shrink-0">
                <div className="flex-none rotate-180">
                  <IconArrowRight />
                </div>
              </div>
            </button>
          </div>

          {/* Title */}
          <div className="relative shrink-0 w-full px-[20px]">
            <div className="flex flex-row items-center size-full">
              <div className="content-stretch flex items-center relative w-full">
                <div 
                  className="leading-[32px] not-italic relative shrink-0 text-[#242b35] text-[24px] tracking-[-0.48px] whitespace-nowrap"
                  style={{ fontFamily: "var(--font-pretendard)", fontWeight: 700 }}
                >
                  <p className="mb-0">{opponentName}전 경기의</p>
                  <p>MOM을 선정해주세요</p>
                </div>
              </div>
            </div>
          </div>

          {/* Player Grid */}
          <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
            <div className="relative shrink-0 w-full">
              <div className="content-stretch flex flex-col items-start px-[20px] relative w-full">
                <div className="content-center flex flex-wrap gap-[4px] items-center relative shrink-0 w-full">
                  {eligiblePlayers.map((player) => (
                    <PlayerCard
                      key={player.id}
                      player={player}
                      isSelected={selectedPlayerIds.includes(player.id)}
                      onClick={() => handlePlayerClick(player.id)}
                      shake={shake}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button - Fixed at bottom with blur background */}
          {selectedPlayerIds.length > 0 && (
            <div className="sticky bottom-0 left-0 right-0 backdrop-blur-[2.5px] bg-[rgba(255,255,255,0.5)] content-stretch flex flex-col items-start pb-[24px] pt-[16px] px-[20px] w-full border-t border-[rgba(255,255,255,0.5)]">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-[#242b35] h-[52px] relative rounded-[8px] shrink-0 w-full disabled:opacity-50"
              >
                <div className="flex flex-row items-center justify-center size-full">
                  <div className="content-stretch flex items-center justify-center p-[10px] relative size-full">
                    <p 
                      className="leading-[normal] not-italic relative shrink-0 text-[18px] text-white"
                      style={{ fontFamily: "var(--font-paperlogy)", fontWeight: 500 }}
                    >
                      {isSubmitting ? "선정 중..." : "MOM 선정"}
                    </p>
                  </div>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}