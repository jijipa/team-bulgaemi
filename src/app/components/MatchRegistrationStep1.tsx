import { useState, useEffect, useRef } from "react";
import svgPaths from "../../imports/svg-6dojr9czt5";

export interface MatchRegistrationStep1Data {
  matchType: "soccer" | "futsal";
  playerCount: string;
  quarterCount: string;
  quarterTime: string;
}

interface MatchRegistrationStep1Props {
  onNext: (data: MatchRegistrationStep1Data) => void;
  onBack: () => void;
  onClose: () => void; // 닫기 버튼 핸들러 추가
}

export default function MatchRegistrationStep1({ onNext, onBack, onClose }: MatchRegistrationStep1Props) {
  const [matchType, setMatchType] = useState<"soccer" | "futsal">("soccer");
  const [playerCount, setPlayerCount] = useState("11vs11");
  const [quarterCount, setQuarterCount] = useState("4쿼터");
  const [quarterTime, setQuarterTime] = useState("25분");
  
  const [showPlayerCountDropdown, setShowPlayerCountDropdown] = useState(false);
  const [showQuarterCountDropdown, setShowQuarterCountDropdown] = useState(false);
  const [showQuarterTimeDropdown, setShowQuarterTimeDropdown] = useState(false);

  // Refs for click outside detection
  const playerCountDropdownRef = useRef<HTMLDivElement>(null);
  const quarterCountDropdownRef = useRef<HTMLDivElement>(null);
  const quarterTimeDropdownRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (playerCountDropdownRef.current && !playerCountDropdownRef.current.contains(event.target as Node)) {
        setShowPlayerCountDropdown(false);
      }
      if (quarterCountDropdownRef.current && !quarterCountDropdownRef.current.contains(event.target as Node)) {
        setShowQuarterCountDropdown(false);
      }
      if (quarterTimeDropdownRef.current && !quarterTimeDropdownRef.current.contains(event.target as Node)) {
        setShowQuarterTimeDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const playerCountOptions = ["8vs8", "9vs9", "10vs10", "11vs11"];
  const quarterCountOptions = ["2쿼터", "4쿼터", "6쿼터", "8쿼터"];
  const quarterTimeOptions = ["15분", "20분", "25분", "30분", "35분", "45분"];

  const handleMatchTypeChange = (type: "soccer" | "futsal") => {
    if (type === "futsal") {
      alert("풋살은 현재 준비중입니다.");
      return;
    }
    setMatchType(type);
    // 축구 선택 시 기본값 설정
    if (type === "soccer") {
      setPlayerCount("11vs11");
      setQuarterCount("4쿼터");
      setQuarterTime("25분");
    }
  };

  const handleNext = () => {
    onNext({
      matchType,
      playerCount,
      quarterCount,
      quarterTime,
    });
  };

  const isFormValid = matchType && playerCount && quarterCount && quarterTime;

  return (
    <div className="bg-white relative h-screen min-h-screen w-full overflow-hidden">
      {/* Progress Indicator */}
      <div className="absolute h-[20px] left-[20px] top-[72px] w-[83.993px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 83.9927 20.0001">
          <g>
            <path d={svgPaths.pa569c00} fill="var(--fill-0, #242B35)" />
            <path d="M19.9976 10H31.9976" stroke="var(--stroke-0, #E1E4EC)" strokeWidth="2" />
            <rect fill="var(--fill-0, #E1E4EC)" height="19.9976" rx="9.99878" width="19.9976" x="31.9976" y="0.00122452" />
            <path d="M51.9951 10H63.9951" stroke="var(--stroke-0, #E1E4EC)" strokeWidth="2" />
            <rect fill="var(--fill-0, #E1E4EC)" height="19.9976" rx="9.99878" width="19.9976" x="63.9951" y="0.00122452" />
          </g>
        </svg>
      </div>

      {/* Header */}
      <div className="absolute h-[48px] left-0 right-0 top-[24px]">
        {/* Close Button */}
        <button
          onClick={onClose}
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
            어떤 매치를 등록할까요?
          </p>
        </div>

        {/* Form Fields */}
        <div className="content-stretch flex flex-col gap-[32px] items-start relative shrink-0 w-full">
          {/* Match Type Selection */}
          <div className="relative shrink-0 w-full">
            <div className="content-stretch flex flex-col items-start px-[20px] relative w-full">
              <div className="content-stretch flex items-start relative shrink-0 w-full">
                <button
                  onClick={() => handleMatchTypeChange("soccer")}
                  className={`flex-[1_0_0] h-[52px] min-h-px min-w-px relative rounded-bl-[8px] rounded-tl-[8px] ${
                    matchType === "soccer" ? "bg-[#242b35]" : "border border-[#242b35]"
                  }`}
                >
                  <p className={`leading-[normal] not-italic text-[18px] tracking-[-0.36px] ${
                    matchType === "soccer" ? "text-white" : "text-[#242b35]"
                  }`} style={{ fontFamily: 'var(--font-pretendard)', fontWeight: 600 }}>
                    축구
                  </p>
                </button>
                <button
                  onClick={() => handleMatchTypeChange("futsal")}
                  className={`flex-[1_0_0] h-[52px] min-h-px min-w-px relative rounded-br-[8px] rounded-tr-[8px] ${
                    matchType === "futsal" ? "bg-[#242b35]" : "border border-[#242b35]"
                  }`}
                >
                  <p className={`leading-[normal] not-italic text-[18px] tracking-[-0.36px] ${
                    matchType === "futsal" ? "text-white" : "text-[#242b35]"
                  }`} style={{ fontFamily: 'var(--font-pretendard)', fontWeight: 600 }}>
                    풋살
                  </p>
                </button>
              </div>
            </div>
          </div>

          {/* Player Count */}
          <div className="relative shrink-0 w-full">
            <div className="content-stretch flex items-start px-[20px] relative w-full">
              <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative">
                <p className="leading-[normal] not-italic relative shrink-0 text-[14px] tracking-[-0.28px] w-full" style={{ fontFamily: 'var(--font-pretendard)', fontWeight: 500 }}>
                  <span className="text-[#1a1a1c]">매치 인원 수</span>
                  <span className="text-[#d6253c]"> *</span>
                </p>
                <div className="relative w-full">
                  <button
                    onClick={() => setShowPlayerCountDropdown(!showPlayerCountDropdown)}
                    className="h-[52px] relative rounded-[5px] shrink-0 w-full border border-[#e1e4ec]"
                  >
                    <div className="flex flex-row items-center size-full">
                      <div className="content-stretch flex items-center justify-between pl-[12px] pr-[8px] relative size-full">
                        <p className="leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[16px]" style={{ fontFamily: 'var(--font-pretendard)', fontWeight: 500 }}>
                          {playerCount}
                        </p>
                        <div className="-rotate-90">
                          <div className="relative size-[24px]">
                            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                              <g>
                                <path d="M16 19.5L8 12L16 4.5" stroke="var(--stroke-0, #242B35)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                              </g>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                  {showPlayerCountDropdown && (
                    <div className="absolute bg-white border border-[#e1e4ec] rounded-[5px] shadow-lg top-[56px] w-full z-10" ref={playerCountDropdownRef}>
                      {playerCountOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setPlayerCount(option);
                            setShowPlayerCountDropdown(false);
                          }}
                          className="w-full text-left px-[12px] py-[12px] hover:bg-[#f2f2f2]"
                        >
                          <p className="leading-[normal] not-italic text-[#1a1a1c] text-[16px]" style={{ fontFamily: 'var(--font-pretendard)', fontWeight: 500 }}>
                            {option}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quarter Count and Quarter Time */}
          <div className="relative shrink-0 w-full">
            <div className="content-stretch flex gap-[8px] items-start px-[20px] relative w-full">
              {/* Quarter Count */}
              <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative">
                <p className="leading-[normal] not-italic relative shrink-0 text-[14px] tracking-[-0.28px]" style={{ fontFamily: 'var(--font-pretendard)', fontWeight: 500 }}>
                  <span className="text-[#1a1a1c]">쿼터 수</span>
                  <span className="text-[#d6253c]"> *</span>
                </p>
                <div className="relative w-full">
                  <button
                    onClick={() => setShowQuarterCountDropdown(!showQuarterCountDropdown)}
                    className="h-[52px] relative rounded-[5px] shrink-0 w-full border border-[#e1e4ec]"
                  >
                    <div className="flex flex-row items-center size-full">
                      <div className="content-stretch flex items-center justify-between pl-[12px] pr-[8px] relative size-full">
                        <p className="leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[16px]" style={{ fontFamily: 'var(--font-pretendard)', fontWeight: 500 }}>
                          {quarterCount}
                        </p>
                        <div className="-rotate-90">
                          <div className="relative size-[24px]">
                            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                              <g>
                                <path d="M16 19.5L8 12L16 4.5" stroke="var(--stroke-0, #242B35)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                              </g>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                  {showQuarterCountDropdown && (
                    <div className="absolute bg-white border border-[#e1e4ec] rounded-[5px] shadow-lg top-[56px] w-full z-10" ref={quarterCountDropdownRef}>
                      {quarterCountOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setQuarterCount(option);
                            setShowQuarterCountDropdown(false);
                          }}
                          className="w-full text-left px-[12px] py-[12px] hover:bg-[#f2f2f2]"
                        >
                          <p className="leading-[normal] not-italic text-[#1a1a1c] text-[16px]" style={{ fontFamily: 'var(--font-pretendard)', fontWeight: 500 }}>
                            {option}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Quarter Time */}
              <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative">
                <p className="leading-[normal] not-italic relative shrink-0 text-[14px] tracking-[-0.28px]" style={{ fontFamily: 'var(--font-pretendard)', fontWeight: 500 }}>
                  <span className="text-[#1a1a1c]">쿼터 시간</span>
                  <span className="text-[#d6253c]"> *</span>
                </p>
                <div className="relative w-full">
                  <button
                    onClick={() => setShowQuarterTimeDropdown(!showQuarterTimeDropdown)}
                    className="h-[52px] relative rounded-[5px] shrink-0 w-full border border-[#e1e4ec]"
                  >
                    <div className="flex flex-row items-center size-full">
                      <div className="content-stretch flex items-center justify-between pl-[12px] pr-[8px] relative size-full">
                        <p className="leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[16px]" style={{ fontFamily: 'var(--font-pretendard)', fontWeight: 500 }}>
                          {quarterTime}
                        </p>
                        <div className="-rotate-90">
                          <div className="relative size-[24px]">
                            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                              <g>
                                <path d="M16 19.5L8 12L16 4.5" stroke="var(--stroke-0, #242B35)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                              </g>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                  {showQuarterTimeDropdown && (
                    <div className="absolute bg-white border border-[#e1e4ec] rounded-[5px] shadow-lg top-[56px] w-full z-10" ref={quarterTimeDropdownRef}>
                      {quarterTimeOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setQuarterTime(option);
                            setShowQuarterTimeDropdown(false);
                          }}
                          className="w-full text-left px-[12px] py-[12px] hover:bg-[#f2f2f2]"
                        >
                          <p className="leading-[normal] not-italic text-[#1a1a1c] text-[16px]" style={{ fontFamily: 'var(--font-pretendard)', fontWeight: 500 }}>
                            {option}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="relative shrink-0 w-full">
                  <p className="flex-[1_0_0] leading-[normal] min-h-px min-w-px not-italic relative text-[#767681] text-[13px] tracking-[-0.26px]" style={{ fontFamily: 'var(--font-pretendard)', fontWeight: 500 }}>
                    1쿼터 기준으로 선택해주세요.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      {isFormValid && (
        <div className="fixed backdrop-blur-[2.5px] bg-[rgba(255,255,255,0.5)] bottom-0 left-0 right-0 content-stretch flex flex-col items-start pb-[48px] pt-[16px] px-[20px] border-t border-[rgba(255,255,255,0.5)]">
          <button
            onClick={handleNext}
            className="bg-[#242b35] h-[52px] relative rounded-[8px] shrink-0 w-full"
          >
            <p className="leading-[normal] not-italic text-[18px] text-white" style={{ fontFamily: 'var(--font-paperlogy)', fontWeight: 500 }}>
              다음
            </p>
          </button>
        </div>
      )}
    </div>
  );
}
