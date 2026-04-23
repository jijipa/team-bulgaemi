import { useState, useEffect, useRef } from "react";
import svgPaths from "../../imports/svg-6dojr9czt5";

export interface MatchRegistrationStep2Data {
  matchDate: string; // YYYY-MM-DD 형식
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  location: string;
  locationLink?: string;
}

interface MatchRegistrationStep2Props {
  onNext: (data: MatchRegistrationStep2Data) => void;
  onBack: () => void;
  onClose: () => void; // 닫기 버튼 핸들러 추가
}

export default function MatchRegistrationStep2({ onNext, onBack, onClose }: MatchRegistrationStep2Props) {
  // 오늘 날짜 기본값 (UTC 시간대 문제 해결)
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const todayString = `${year}-${month}-${day}`;

  const [matchDate, setMatchDate] = useState(todayString);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("11:00");
  const [location, setLocation] = useState("");
  const [locationLink, setLocationLink] = useState("");

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  // 키보드로 인한 viewport 높이 변화 추적
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Refs for click outside detection
  const datePickerRef = useRef<HTMLDivElement>(null);
  const startTimePickerRef = useRef<HTMLDivElement>(null);
  const endTimePickerRef = useRef<HTMLDivElement>(null);

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

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
      if (startTimePickerRef.current && !startTimePickerRef.current.contains(event.target as Node)) {
        setShowStartTimePicker(false);
      }
      if (endTimePickerRef.current && !endTimePickerRef.current.contains(event.target as Node)) {
        setShowEndTimePicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNext = () => {
    if (isFormValid) {
      onNext({
        matchDate,
        startTime,
        endTime,
        location,
        locationLink: locationLink || undefined,
      });
    }
  };

  // 폼 검증: 날짜, 시작시간, 종료시간, 장소는 필수
  const isFormValid = matchDate && startTime && endTime && location.trim();

  // 날짜 포맷팅 함수 (YYYY-MM-DD -> MM.DD (요일))
  const formatDateDisplay = (dateString: string) => {
    // UTC 시간대 문제 해결
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day); // 로컬 시간대로 생성
    const monthStr = month.toString().padStart(2, "0");
    const dayStr = day.toString().padStart(2, "0");
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    const dayOfWeek = days[date.getDay()];
    return `${monthStr}.${dayStr} (${dayOfWeek})`;
  };

  // 달력용 함수들
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (number | null)[] = [];
    
    // 이전 달의 빈 칸
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // 이번 달의 날짜
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  const handleDateSelect = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = (currentMonth.getMonth() + 1).toString().padStart(2, "0");
    const dayStr = day.toString().padStart(2, "0");
    setMatchDate(`${year}-${month}-${dayStr}`);
    setShowDatePicker(false);
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const isSelectedDate = (day: number) => {
    // UTC 시간대 문제 해결
    const [year, month, dayNum] = matchDate.split("-").map(Number);
    return (
      day === dayNum &&
      currentMonth.getMonth() === month - 1 &&
      currentMonth.getFullYear() === year
    );
  };

  // 시간 선택용 옵션 생성
  const generateTimeOptions = () => {
    const options: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const h = hour.toString().padStart(2, "0");
        const m = minute.toString().padStart(2, "0");
        options.push(`${h}:${m}`);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  return (
    <div className="bg-white relative h-screen min-h-screen w-full overflow-hidden">
      {/* Progress Indicator */}
      <div className="absolute h-[20px] left-[20px] top-[72px] w-[83.993px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 83.9927 20.0001">
          <g>
            <rect fill="var(--fill-0, #242B35)" height="19.9976" rx="9.99878" width="19.9976" y="0.00122452" />
            <path d="M6 9.84616L9.55409 14L14 5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path d="M19.9976 10H31.9976" stroke="var(--stroke-0, #242B35)" strokeWidth="2" />
            <path d={svgPaths.p35403a00} fill="var(--fill-0, #242B35)" />
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
      <div className="absolute bottom-[92px] content-stretch flex flex-col gap-[24px] items-start left-0 right-0 top-[112px] w-full overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* Title */}
        <div className="content-stretch flex flex-col items-start pl-[20px] relative shrink-0">
          <p className="leading-[32px] not-italic relative shrink-0 text-[#242b35] text-[24px] tracking-[-0.48px]" style={{ fontFamily: 'var(--font-pretendard)', fontWeight: 700 }}>
            일정과 장소를 등록해주세요
          </p>
        </div>

        {/* Form Fields */}
        <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full px-[20px]">
          {/* Match Date */}
          <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
            <p className="leading-[normal] not-italic relative shrink-0 text-[14px] tracking-[-0.28px]" style={{ fontFamily: 'var(--font-pretendard)', fontWeight: 500 }}>
              <span className="text-[#1a1a1c]">매치 날짜</span>
              <span className="text-[#d6253c]"> *</span>
            </p>
            <div className="relative w-full">
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="h-[52px] relative rounded-[5px] w-full border border-[#e1e4ec]"
              >
                <div className="flex flex-row items-center size-full">
                  <div className="content-stretch flex items-center justify-between pl-[12px] pr-[8px] relative size-full">
                    <p className="leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[16px]" style={{ fontFamily: 'var(--font-pretendard)', fontWeight: 500 }}>
                      {formatDateDisplay(matchDate)}
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
              {showDatePicker && (
                <div className="absolute bg-white border border-[#e1e4ec] rounded-[5px] shadow-lg top-[56px] w-full z-10 max-h-[200px] overflow-y-auto" ref={datePickerRef}>
                  <div className="flex flex-row items-center justify-between px-[12px] py-[8px]">
                    <button
                      onClick={goToPreviousMonth}
                      className="h-[24px] relative rounded-[5px] w-[24px] border border-[#e1e4ec]"
                    >
                      <div className="flex flex-row items-center size-full">
                        <div className="content-stretch flex items-center justify-center relative size-full">
                          <div className="relative size-[24px]">
                            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                              <g>
                                <path d="M16 19.5L8 12L16 4.5" stroke="var(--stroke-0, #242B35)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                              </g>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </button>
                    <p className="leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[16px]" style={{ fontFamily: 'var(--font-pretendard)', fontWeight: 500 }}>
                      {currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월
                    </p>
                    <button
                      onClick={goToNextMonth}
                      className="h-[24px] relative rounded-[5px] w-[24px] border border-[#e1e4ec]"
                    >
                      <div className="flex flex-row items-center size-full">
                        <div className="content-stretch flex items-center justify-center relative size-full">
                          <div className="relative size-[24px]">
                            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                              <g>
                                <path d="M8 4.5L16 12L8 19.5" stroke="var(--stroke-0, #242B35)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                              </g>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-[4px] px-[12px] py-[8px]">
                    {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
                      <p key={day} className="leading-[normal] not-italic relative shrink-0 text-[14px] tracking-[-0.28px]" style={{ fontFamily: 'var(--font-pretendard)', fontWeight: 500 }}>
                        {day}
                      </p>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-[4px] px-[12px] py-[8px]">
                    {getDaysInMonth(currentMonth).map((day) => (
                      <button
                        key={day}
                        onClick={() => day && handleDateSelect(day)}
                        className={`h-[32px] relative rounded-[5px] w-[32px] border ${
                          day && isSelectedDate(day) ? "border-[#242b35] bg-[#242b35] text-white" : "border-[#e1e4ec]"
                        }`}
                      >
                        <p className="leading-[normal] not-italic relative shrink-0 text-[14px] tracking-[-0.28px]" style={{ fontFamily: 'var(--font-pretendard)', fontWeight: 500 }}>
                          {day}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Start and End Time */}
          <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full">
            {/* Start Time */}
            <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative">
              <p className="leading-[normal] not-italic relative shrink-0 text-[14px] tracking-[-0.28px]" style={{ fontFamily: 'var(--font-pretendard)', fontWeight: 500 }}>
                <span className="text-[#1a1a1c]">매치 시작 시간</span>
                <span className="text-[#d6253c]"> *</span>
              </p>
              <div className="relative w-full">
                <button
                  onClick={() => setShowStartTimePicker(!showStartTimePicker)}
                  className="h-[52px] relative rounded-[5px] w-full border border-[#e1e4ec]"
                >
                  <div className="flex flex-row items-center size-full">
                    <div className="content-stretch flex items-center justify-between pl-[12px] pr-[8px] relative size-full">
                      <p className="leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[16px]" style={{ fontFamily: 'var(--font-pretendard)', fontWeight: 500 }}>
                        {startTime}
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
                {showStartTimePicker && (
                  <div className="absolute bg-white border border-[#e1e4ec] rounded-[5px] shadow-lg top-[56px] w-full z-10 max-h-[200px] overflow-y-auto" ref={startTimePickerRef}>
                    {timeOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setStartTime(option);
                          setShowStartTimePicker(false);
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

            {/* End Time */}
            <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative">
              <p className="leading-[normal] not-italic relative shrink-0 text-[14px] tracking-[-0.28px]" style={{ fontFamily: 'var(--font-pretendard)', fontWeight: 500 }}>
                <span className="text-[#1a1a1c]">매치 종료 시간</span>
                <span className="text-[#d6253c]"> *</span>
              </p>
              <div className="relative w-full">
                <button
                  onClick={() => setShowEndTimePicker(!showEndTimePicker)}
                  className="h-[52px] relative rounded-[5px] w-full border border-[#e1e4ec]"
                >
                  <div className="flex flex-row items-center size-full">
                    <div className="content-stretch flex items-center justify-between pl-[12px] pr-[8px] relative size-full">
                      <p className="leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[16px]" style={{ fontFamily: 'var(--font-pretendard)', fontWeight: 500 }}>
                        {endTime}
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
                {showEndTimePicker && (
                  <div className="absolute bg-white border border-[#e1e4ec] rounded-[5px] shadow-lg top-[56px] w-full z-10 max-h-[200px] overflow-y-auto" ref={endTimePickerRef}>
                    {timeOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setEndTime(option);
                          setShowEndTimePicker(false);
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

          {/* Location */}
          <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
            <p className="leading-[normal] not-italic relative shrink-0 text-[14px] tracking-[-0.28px]" style={{ fontFamily: 'var(--font-pretendard)', fontWeight: 500 }}>
              <span className="text-[#1a1a1c]">매치 장소</span>
              <span className="text-[#d6253c]"> *</span>
            </p>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="예) 월드컵공원 축구장"
              className="h-[52px] w-full rounded-[5px] border border-[#e1e4ec] px-[12px] leading-[normal] not-italic text-[#1a1a1c] text-[16px] placeholder:text-[#b0b0b0]"
              style={{ fontFamily: 'var(--font-pretendard)', fontWeight: 500 }}
            />
          </div>

          {/* Location Link (Optional) */}
          <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
            <p className="leading-[normal] not-italic relative shrink-0 text-[14px] tracking-[-0.28px]" style={{ fontFamily: 'var(--font-pretendard)', fontWeight: 500 }}>
              <span className="text-[#1a1a1c]">장소 링크</span>
              <span className="text-[#767681]"> (선택)</span>
            </p>
            <input
              type="text"
              value={locationLink}
              onChange={(e) => setLocationLink(e.target.value)}
              placeholder="예) https://naver.me/example"
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
          className="content-stretch flex h-[52px] items-center justify-center p-[10px] relative rounded-[8px] shrink-0 w-[110px] border border-[#242b35]"
        >
          <p className="leading-[normal] not-italic relative shrink-0 text-[#242b35] text-[18px]" style={{ fontFamily: 'var(--font-paperlogy)', fontWeight: 500 }}>
            이전
          </p>
        </button>
        <button
          onClick={handleNext}
          disabled={!isFormValid}
          className={`flex-[1_0_0] h-[52px] min-h-px min-w-px relative rounded-[8px] ${
            isFormValid ? "bg-[#242b35]" : "bg-[#e1e4ec]"
          }`}
        >
          <div className="flex flex-row items-center justify-center size-full">
            <div className="content-stretch flex items-center justify-center p-[10px] relative size-full">
              <p className={`leading-[normal] not-italic relative shrink-0 text-[18px] ${
                isFormValid ? "text-white" : "text-[#b0b0b0]"
              }`} style={{ fontFamily: 'var(--font-paperlogy)', fontWeight: 500 }}>
                다음
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
