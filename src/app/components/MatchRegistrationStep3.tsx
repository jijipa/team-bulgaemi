import { useState, useEffect } from "react";
import svgPaths from "../../imports/svg-6dojr9czt5";

export interface MatchRegistrationStep3Data {
  opponentName: string;
}

interface MatchRegistrationStep3Props {
  onComplete: (data: MatchRegistrationStep3Data) => void;
  onBack: () => void;
  isSaving: boolean;
  onClose: () => void; // 닫기 버튼 핸들러 추가
}

export default function MatchRegistrationStep3({ onComplete, onBack, isSaving, onClose }: MatchRegistrationStep3Props) {
  const [opponentName, setOpponentName] = useState("");

  // 키보드로 인한 viewport 높이 변화 추적
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // visualViewport를 사용하여 키보드 높이 감지
  useEffect(() => {
    const handleResize = () => {
      if (window.visualViewport) {
        const viewportHeight = window.visualViewport.height;
        const windowHeight = window.innerHeight;
        const difference = windowHeight - viewportHeight;
        setKeyboardHeight(difference > 0 ? difference : 0);
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleResize);
      window.visualViewport.addEventListener("scroll", handleResize);
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleResize);
        window.visualViewport.removeEventListener("scroll", handleResize);
      }
    };
  }, []);

  const handleComplete = () => {
    if (isFormValid) {
      onComplete({
        opponentName,
      });
    }
  };

  const isFormValid = opponentName.trim();

  return (
    <div className="bg-white relative h-screen min-h-screen w-full overflow-hidden">
      {/* Progress Indicator */}
      <div className="absolute h-[20px] left-[20px] top-[72px] w-[83.993px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 83.9927 20.0001">
          <g>
            <rect fill="var(--fill-0, #242B35)" height="19.9976" rx="9.99878" width="19.9976" y="0.00122452" />
            <path d="M6 9.84616L9.55409 14L14 5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path d="M19.9976 10H31.9976" stroke="var(--stroke-0, #242B35)" strokeWidth="2" />
            <rect fill="var(--fill-0, #242B35)" height="19.9976" rx="9.99878" width="19.9976" x="31.9976" y="0.00122452" />
            <path d="M38 9.84616L41.5541 14L46 5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path d="M51.9951 10H63.9951" stroke="var(--stroke-0, #242B35)" strokeWidth="2" />
            <path d={svgPaths.p118146f1} fill="var(--fill-0, #242B35)" />
          </g>
        </svg>
      </div>

      {/* Header */}
      <div className="absolute h-[48px] left-0 right-0 top-[24px]">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isSaving}
          className="absolute content-stretch flex items-center justify-center right-[20px] size-[24px] top-1/2 -translate-y-1/2"
        >
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
            <g>
              <path d="M18 6L6 18M6 6L18 18" stroke="var(--stroke-0, #242B35)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </g>
          </svg>
        </button>
      </div>

      {/* Main Content */}
      <div className="absolute content-stretch flex flex-col gap-[24px] items-start left-0 top-[112px] w-full pb-[180px]">
        {/* Title */}
        <div className="content-stretch flex flex-col items-start pl-[20px] relative shrink-0">
          <p className="leading-[32px] not-italic relative shrink-0 text-[#242b35] text-[24px] tracking-[-0.48px]" style={{ fontFamily: 'var(--font-pretendard)', fontWeight: 700 }}>
            마지막으로<br></br>상대팀 이름은 무엇인가요?
          </p>
        </div>

        {/* Form Fields */}
        <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full px-[20px]">
          {/* Opponent Name */}
          <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
            <p className="leading-[normal] not-italic relative shrink-0 text-[14px] tracking-[-0.28px]" style={{ fontFamily: 'var(--font-pretendard)', fontWeight: 500 }}>
              <span className="text-[#1a1a1c]">상대팀 이름</span>
              <span className="text-[#d6253c]"> *</span>
            </p>
            <input
              type="text"
              value={opponentName}
              onChange={(e) => setOpponentName(e.target.value)}
              placeholder="예) MYFC"
              className="h-[52px] w-full rounded-[5px] border border-[#e1e4ec] px-[12px] leading-[normal] not-italic text-[#1a1a1c] text-[16px] placeholder:text-[#b0b0b0]"
              style={{ fontFamily: 'var(--font-pretendard)', fontWeight: 500 }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Buttons */}
      <div 
        className="fixed backdrop-blur-[2.5px] bg-[rgba(255,255,255,0.5)] left-0 right-0 content-stretch flex gap-[8px] items-start pb-[24px] pt-[16px] px-[20px] border-t border-[rgba(255,255,255,0.5)] transition-all duration-200"
        style={{ bottom: `${keyboardHeight}px` }}
      >
        <button
          onClick={onBack}
          disabled={isSaving}
          className="content-stretch flex h-[52px] items-center justify-center p-[10px] relative rounded-[8px] shrink-0 w-[110px] border border-[#242b35]"
        >
          <p className="leading-[normal] not-italic relative shrink-0 text-[#242b35] text-[18px]" style={{ fontFamily: 'var(--font-paperlogy)', fontWeight: 500 }}>
            이전
          </p>
        </button>
        <button
          onClick={handleComplete}
          disabled={!isFormValid || isSaving}
          className={`flex-[1_0_0] h-[52px] min-h-px min-w-px relative rounded-[8px] ${
            isFormValid && !isSaving ? "bg-[#242b35]" : "bg-[#e1e4ec]"
          }`}
        >
          <div className="flex flex-row items-center justify-center size-full">
            <div className="content-stretch flex items-center justify-center p-[10px] relative size-full">
              <p className={`leading-[normal] not-italic relative shrink-0 text-[18px] ${
                isFormValid && !isSaving ? "text-white" : "text-[#b0b0b0]"
              }`} style={{ fontFamily: 'var(--font-paperlogy)', fontWeight: 500 }}>
                {isSaving ? "저장 중..." : "등록 완료"}
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
