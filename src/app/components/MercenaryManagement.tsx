import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import svgPaths from "../../imports/svg-n8kxosjy5t";

interface Mercenary {
  id: string;
  name: string;
}

interface MercenaryManagementProps {
  mercenaries: Mercenary[];
  setMercenaries: (mercenaries: Mercenary[]) => void;
  isSaving: boolean;
  onBack: () => void;
  onNext: () => void;
  opponentName?: string; // 상대팀 이름
}

function Layer() {
  return (
    <div className="relative shrink-0 size-[48px]" data-name="Layer_1">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48 48">
        <g clipPath="url(#clip0_6_310)" id="Layer_1">
          <path d={svgPaths.p35e3f600} fill="var(--fill-0, #6E7783)" id="Vector" />
          <path d={svgPaths.p1108d0e4} fill="url(#paint0_linear_6_310)" id="Vector_2" />
          <path d={svgPaths.p2ebd57f0} fill="var(--fill-0, #CECECE)" id="Vector_3" />
          <path d={svgPaths.p3564f680} fill="var(--fill-0, #CECECE)" id="Vector_4" />
          <g id="Group">
            <path d={svgPaths.p258bddc0} fill="var(--fill-0, #6E7783)" id="Vector_5" />
            <path d={svgPaths.p38671380} fill="var(--fill-0, #CECECE)" id="Vector_6" />
          </g>
          <path d={svgPaths.p13882a40} fill="var(--fill-0, #6E7783)" id="Vector_7" />
          <path d={svgPaths.p3564f680} fill="var(--fill-0, #CECECE)" id="Vector_8" />
          <g id="Vector_9" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_6_310" x1="23.99" x2="23.99" y1="3.59" y2="45">
            <stop stopColor="#F7EE43" />
            <stop offset="1" stopColor="#FCB900" />
          </linearGradient>
          <clipPath id="clip0_6_310">
            <rect fill="white" height="48" width="48" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function EditIcon() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Layer_1">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g clipPath="url(#clip0_6_303)" id="Layer_1">
          <g id="Vector" />
          <path d={svgPaths.p9aef5c0} fill="var(--fill-0, #7B8087)" id="Union" />
        </g>
        <defs>
          <clipPath id="clip0_6_303">
            <rect fill="white" height="24" width="24" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function RemoveIcon() {
  return (
    <div className="relative size-[24px]" data-name="icon_arrow_right 3">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="icon_arrow_right 3">
          <path d="M8 12L16 12" id="Vector 24" stroke="var(--stroke-0, #CF4444)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <circle cx="12" cy="12" id="Ellipse 4" r="9" stroke="var(--stroke-0, #CF4444)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" transform="rotate(180 12 12)" />
        </g>
      </svg>
    </div>
  );
}

function AddIcon() {
  return (
    <div className="relative size-[24px]" data-name="icon_arrow_right 2">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="icon_arrow_right 2">
          <path d="M12 19L12 5" id="Vector 23" stroke="var(--stroke-0, #242B35)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M4.995 12.005L18.995 12.005" id="Vector 24" stroke="var(--stroke-0, #242B35)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

export default function MercenaryManagement({ mercenaries, setMercenaries, isSaving, onBack, onNext, opponentName }: MercenaryManagementProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [showBlur, setShowBlur] = useState(false);

  const handleAddMercenary = () => {
    const newId = String(mercenaries.length + 1);
    setMercenaries([...mercenaries, { id: newId, name: `용병 ${mercenaries.length + 1}` }]);
  };

  const handleRemoveMercenary = (id: string) => {
    setMercenaries(mercenaries.filter(m => m.id !== id));
  };

  const handleStartEdit = (mercenary: Mercenary) => {
    setEditingId(mercenary.id);
    setEditingName(mercenary.name);
    
    // 편집 카드가 렌더링된 후 블러 활성화
    requestAnimationFrame(() => {
      setShowBlur(true);
    });
    
    // 첫 번째 리스트 위치로 스크롤
    setTimeout(() => {
      const firstListItem = document.querySelector('[data-mercenary-id]');
      if (firstListItem) {
        firstListItem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleFinishEdit = () => {
    if (editingId) {
      setMercenaries(mercenaries.map(m => 
        m.id === editingId ? { ...m, name: editingName } : m
      ));
      setShowBlur(false);
      setEditingId(null);
      setEditingName("");
    }
  };

  const handleCancelEdit = () => {
    setShowBlur(false);
    setEditingId(null);
    setEditingName("");
  };

  return (
    <div className="bg-white relative size-full overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {/* Backdrop blur box when editing - covers everything */}
      <AnimatePresence>
        {showBlur && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 backdrop-blur-[2.5px] bg-[rgba(255,255,255,0.5)] z-10" 
          />
        )}
      </AnimatePresence>

      {/* Header - Close Button */}
      <div className="absolute h-[48px] left-0 right-0 top-[24px] z-20">
        <button
          onClick={onBack}
          disabled={isSaving}
          className="-translate-y-1/2 absolute content-stretch flex items-center justify-center right-[8px] size-[40px] top-1/2 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="용병 관리 닫기"
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

      {/* vs Opponent Name */}
      <div className="absolute h-[48px] left-0 right-0 top-[65px] z-20">
        <div className="absolute content-stretch flex flex-col items-center left-[20px] top-[14px]">
          <div className="content-stretch flex font-semibold gap-[4px] items-start leading-[normal] not-italic relative shrink-0 text-[#7b8087] text-[18px]" style={{ fontFamily: 'var(--font-paperlogy)' }}>
            <p className="relative shrink-0">vs</p>
            <p className="relative shrink-0">{opponentName || "상대팀"}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="absolute content-stretch flex flex-col gap-[32px] items-start left-0 top-[113px] w-full px-[20px]">
        {/* Title */}
        <div className="relative shrink-0 w-full z-20">
          <div className="flex flex-col justify-end size-full">
            <div className="content-stretch flex flex-col gap-[12px] items-start justify-end not-italic relative w-full whitespace-nowrap">
              <div className="font-bold leading-[32px] relative shrink-0 text-[#242b35] text-[24px] tracking-[-0.48px]" style={{ fontFamily: 'var(--font-pretendard)' }}>
                <p className="mb-0">오늘 경기에 참여하는</p>
                <p>용병 선수를 등록해주세요.</p>
              </div>
              <div className="font-medium leading-[24px] relative shrink-0 text-[#a2a8b0] text-[16px] tracking-[-0.32px]" style={{ fontFamily: 'var(--font-pretendard)' }}>
                <p className="mb-0">등록된 용병선수는 득점 및 도움 기록을 입력할 때</p>
                <p>선택할 수 있습니다.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mercenary List */}
        <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full mb-[126px]">
          <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
            <AnimatePresence mode="popLayout">
              {mercenaries.map((mercenary, index) => (
                <motion.div 
                  key={mercenary.id} 
                  className="w-full"
                  data-mercenary-id={mercenary.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ 
                    layout: { duration: 0.3, ease: "easeInOut" },
                    opacity: { duration: 0.2 }
                  }}
                >
                  {editingId === mercenary.id ? (
                    // Editing mode
                    <div className="bg-white relative rounded-[12px] shrink-0 w-full border shadow-[0px_0px_44px_0px_rgba(0,0,0,0.1)]" style={{ position: 'relative', zIndex: 100, borderColor: '#242B35' }}>
                      <div className="flex flex-row items-center size-full">
                        <div className="content-stretch flex items-center justify-between pl-[12px] pr-[16px] py-[12px] relative w-full gap-[8px]">
                          <div className="content-stretch flex gap-[8px] items-center relative shrink-0 flex-1 min-w-0">
                            <Layer />
                            <input
                              type="text"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              className="font-medium text-[#1a1a1c] text-[18px] leading-[normal] bg-transparent outline-none border-none flex-1 min-w-0"
                              style={{ fontFamily: 'var(--font-pretendard)' }}
                              autoFocus
                            />
                          </div>
                          <button
                            onClick={handleFinishEdit}
                            className="bg-[#e1e4ec] px-[12px] h-[32px] rounded-[58px] font-medium text-[#1a1a1c] text-[14px] whitespace-nowrap shrink-0 flex items-center"
                            style={{ fontFamily: 'var(--font-paperlogy)' }}
                          >
                            입력완료
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Normal mode
                    <div className="bg-[#f2f2f2] relative rounded-[12px] shrink-0 w-full">
                      <div className="flex flex-row items-center size-full">
                        <div className="content-stretch flex items-center justify-between pl-[12px] pr-[16px] py-[12px] relative w-full">
                          <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
                            <Layer />
                            <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
                              <div className="content-stretch flex font-semibold gap-[8px] items-center justify-center leading-[normal] not-italic relative shrink-0 text-[18px] text-center" style={{ fontFamily: 'var(--font-pretendard)' }}>
                                <p className="relative shrink-0 text-[#7b8087]">Guest</p>
                                <p className="relative shrink-0 text-[#1a1a1c]">{mercenary.name}</p>
                              </div>
                              <button
                                onClick={() => handleStartEdit(mercenary)}
                                className="flex items-center justify-center"
                              >
                                <EditIcon />
                              </button>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveMercenary(mercenary.id)}
                            className="flex items-center justify-center relative shrink-0"
                          >
                            <div className="flex-none rotate-180">
                              <RemoveIcon />
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Add Button */}
          <button
            onClick={handleAddMercenary}
            className="h-[52px] relative rounded-[8px] shrink-0 w-full border border-[#e1e4ec] hover:bg-gray-50 transition-colors"
          >
            <div className="flex flex-row items-center justify-center size-full">
              <div className="content-stretch flex gap-[4px] items-center justify-center p-[10px] relative size-full">
                <div className="flex items-center justify-center relative shrink-0">
                  <div className="flex-none rotate-180">
                    <AddIcon />
                  </div>
                </div>
                <p className="font-medium leading-[normal] not-italic relative shrink-0 text-[#242b35] text-[18px]" style={{ fontFamily: 'var(--font-paperlogy)' }}>용병 추가</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="fixed backdrop-blur-[2.5px] bg-[rgba(255,255,255,0.5)] bottom-0 left-0 right-0 content-stretch flex flex-col items-start pb-[24px] pt-[16px] px-[20px] border-t border-[rgba(255,255,255,0.5)]">
        <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full">
          <button
            onClick={onBack}
            disabled={isSaving}
            className={`bg-white content-stretch flex h-[52px] items-center justify-center p-[10px] relative rounded-[8px] shrink-0 w-[110px] border border-[#242b35] transition-colors ${
              isSaving ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
            }`}
          >
            <p className="font-medium leading-[normal] not-italic relative shrink-0 text-[#242b35] text-[18px]" style={{ fontFamily: 'var(--font-paperlogy)' }}>이전</p>
          </button>
          <button
            onClick={onNext}
            disabled={isSaving}
            className={`flex-[1_0_0] h-[52px] min-h-px min-w-px relative rounded-[8px] transition-colors ${
              isSaving ? "bg-gray-400 cursor-not-allowed" : "bg-[#242b35] hover:bg-[#1a2129]"
            }`}
          >
            <div className="flex flex-row items-center justify-center size-full">
              <div className="content-stretch flex gap-[8px] items-center justify-center p-[10px] relative size-full">
                {isSaving && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="size-[18px] border-2 border-white border-t-transparent rounded-full"
                  />
                )}
                <p className="font-medium leading-[normal] not-italic relative shrink-0 text-[18px] text-white" style={{ fontFamily: 'var(--font-paperlogy)' }}>
                  {isSaving ? "저장 중..." : "다음"}
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
