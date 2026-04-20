import svgPaths from "./svg-8me1eb6d5i";

function Frame1() {
  return (
    <div className="content-stretch flex h-[52px] items-center justify-center p-[10px] relative rounded-[8px] shrink-0 w-[110px]">
      <div aria-hidden="true" className="absolute border border-[#242b35] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="font-['Paperlogy:5_Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#242b35] text-[18px]">이전</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="bg-[#242b35] flex-[1_0_0] h-[52px] min-h-px min-w-px relative rounded-[8px]">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center p-[10px] relative size-full">
          <p className="font-['Paperlogy:5_Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[18px] text-white">다음</p>
        </div>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="-translate-x-1/2 absolute backdrop-blur-[2.5px] bg-[rgba(255,255,255,0.5)] bottom-0 content-stretch flex gap-[8px] items-start left-1/2 pb-[48px] pt-[16px] px-[20px] w-[393px]">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.5)] border-solid border-t inset-0 pointer-events-none" />
      <Frame1 />
      <Frame3 />
    </div>
  );
}

function IconArrowRight() {
  return (
    <div className="relative size-[24px]" data-name="icon_arrow_right 1">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="icon_arrow_right 1">
          <path d={svgPaths.p208b6880} id="í©ì¹ê¸° 4" stroke="var(--stroke-0, #242B35)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function BtnMoreMatch() {
  return (
    <div className="-translate-y-1/2 absolute content-stretch flex items-center justify-center right-[8px] size-[40px] top-1/2" data-name="btn-more match">
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none rotate-180">
          <IconArrowRight />
        </div>
      </div>
    </div>
  );
}

function Frame19() {
  return (
    <div className="absolute h-[20px] left-[20px] top-[14px] w-[83.993px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 83.9927 20.0001">
        <g id="Frame 76">
          <g id="Frame 77">
            <rect fill="var(--fill-0, #242B35)" height="19.9976" rx="9.99878" width="19.9976" y="0.00122452" />
            <path d="M6 9.84616L9.55409 14L14 5" id="Vector 22" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </g>
          <path d="M19.9976 10H31.9976" id="Vector 20" stroke="var(--stroke-0, #242B35)" strokeWidth="2" />
          <path d={svgPaths.p35403a00} fill="var(--fill-0, #242B35)" id="Vector" />
          <path d="M51.9951 10H63.9951" id="Vector 21" stroke="var(--stroke-0, #E1E4EC)" strokeWidth="2" />
          <g id="Frame 76_2">
            <rect fill="var(--fill-0, #E1E4EC)" height="19.9976" rx="9.99878" width="19.9976" x="63.9951" y="0.00122452" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute h-[48px] left-0 right-0 top-[24px]">
      <BtnMoreMatch />
      <Frame19 />
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[20px] relative shrink-0">
      <p className="font-['Pretendard:Bold',sans-serif] leading-[32px] not-italic relative shrink-0 text-[#242b35] text-[24px] tracking-[-0.48px]">일정과 장소를 등록해주세요</p>
    </div>
  );
}

function CalendarBlank() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="calendar-blank">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="calendar-blank">
          <path d={svgPaths.p71cda00} fill="var(--fill-0, #1A1A1C)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame4() {
  return (
    <div className="h-[52px] relative rounded-[5px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-[#e1e4ec] border-solid inset-0 pointer-events-none rounded-[5px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[12px] relative size-full">
          <p className="font-['Pretendard:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[16px]">2025년 12월 13일 (토요일)</p>
          <CalendarBlank />
        </div>
      </div>
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative">
      <p className="font-['Pretendard:Medium',sans-serif] leading-[0] not-italic relative shrink-0 text-[#1a1a1c] text-[14px] tracking-[-0.28px] w-full whitespace-pre-wrap">
        <span className="leading-[normal]">{`매치 날짜 `}</span>
        <span className="leading-[normal] text-[#d6253c]">*</span>
      </p>
      <Frame4 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="content-stretch flex items-start px-[20px] relative w-full">
        <Frame15 />
      </div>
    </div>
  );
}

function CalendarBlank1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="calendar-blank">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="calendar-blank">
          <circle cx="12" cy="13" id="Ellipse 5" r="8" stroke="var(--stroke-0, #1A1A1C)" strokeWidth="2" />
          <path d="M8 2L4 5" id="Vector 27" stroke="var(--stroke-0, #1A1A1C)" strokeWidth="2" />
          <path d="M16 2L20 5" id="Vector 28" stroke="var(--stroke-0, #1A1A1C)" strokeWidth="2" />
          <path d="M12 8V13.5L15 15.2321" id="Vector 29" stroke="var(--stroke-0, #1A1A1C)" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Frame5() {
  return (
    <div className="flex-[1_0_0] h-[52px] min-h-px min-w-px relative rounded-[5px]">
      <div aria-hidden="true" className="absolute border border-[#e1e4ec] border-solid inset-0 pointer-events-none rounded-[5px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[12px] relative size-full">
          <p className="font-['Pretendard:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[16px]">오전 09시 00분</p>
          <CalendarBlank1 />
        </div>
      </div>
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame5 />
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative">
      <p className="font-['Pretendard:Medium',sans-serif] leading-[0] not-italic relative shrink-0 text-[#1a1a1c] text-[14px] tracking-[-0.28px] w-full whitespace-pre-wrap">
        <span className="leading-[normal]">{`매치 시작 시간 `}</span>
        <span className="leading-[normal] text-[#d6253c]">*</span>
      </p>
      <Frame23 />
    </div>
  );
}

function CalendarBlank2() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="calendar-blank">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="calendar-blank">
          <circle cx="12" cy="13" id="Ellipse 5" r="8" stroke="var(--stroke-0, #1A1A1C)" strokeWidth="2" />
          <path d="M8 2L4 5" id="Vector 27" stroke="var(--stroke-0, #1A1A1C)" strokeWidth="2" />
          <path d="M16 2L20 5" id="Vector 28" stroke="var(--stroke-0, #1A1A1C)" strokeWidth="2" />
          <path d="M12 8V13.5L15 15.2321" id="Vector 29" stroke="var(--stroke-0, #1A1A1C)" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Frame6() {
  return (
    <div className="flex-[1_0_0] h-[52px] min-h-px min-w-px relative rounded-[5px]">
      <div aria-hidden="true" className="absolute border border-[#e1e4ec] border-solid inset-0 pointer-events-none rounded-[5px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[12px] relative size-full">
          <p className="font-['Pretendard:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[16px]">오전 11시 00분</p>
          <CalendarBlank2 />
        </div>
      </div>
    </div>
  );
}

function Frame24() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame6 />
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative">
      <p className="font-['Pretendard:Medium',sans-serif] leading-[0] not-italic relative shrink-0 text-[#1a1a1c] text-[14px] tracking-[-0.28px] w-full whitespace-pre-wrap">
        <span className="leading-[normal]">{`매치 종료 시간 `}</span>
        <span className="leading-[normal] text-[#d6253c]">*</span>
      </p>
      <Frame24 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="content-stretch flex gap-[8px] items-start px-[20px] relative w-full">
        <Frame17 />
        <Frame18 />
      </div>
    </div>
  );
}

function Frame8() {
  return (
    <div className="h-[52px] relative rounded-[5px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-[#e1e4ec] border-solid inset-0 pointer-events-none rounded-[5px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[12px] relative size-full">
          <p className="font-['Pretendard:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#acacb5] text-[16px] tracking-[-0.32px]">예) 남동인더스파크 축구장</p>
        </div>
      </div>
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative">
      <p className="font-['Pretendard:Medium',sans-serif] leading-[0] not-italic relative shrink-0 text-[#1a1a1c] text-[14px] tracking-[-0.28px] w-full whitespace-pre-wrap">
        <span className="leading-[normal]">{`매치 장소 `}</span>
        <span className="leading-[normal] text-[#d6253c]">*</span>
      </p>
      <Frame8 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="content-stretch flex items-start px-[20px] relative w-full">
        <Frame20 />
      </div>
    </div>
  );
}

function Frame12() {
  return (
    <div className="h-[52px] relative rounded-[5px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-[#e1e4ec] border-solid inset-0 pointer-events-none rounded-[5px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[12px] relative size-full">
          <p className="font-['Pretendard:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#acacb5] text-[16px] tracking-[-0.32px]">https://</p>
        </div>
      </div>
    </div>
  );
}

function Frame22() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[4px] relative w-full">
          <p className="flex-[1_0_0] font-['Pretendard:Medium',sans-serif] leading-[normal] min-h-px min-w-px not-italic relative text-[#767681] text-[13px] tracking-[-0.26px] whitespace-pre-wrap">지도앱에서 링크를 복사하면 정확한 장소를 안내할 수 있어요.</p>
        </div>
      </div>
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative">
      <p className="font-['Pretendard:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[14px] tracking-[-0.28px] w-full whitespace-pre-wrap">장소 링크(선택)</p>
      <Frame12 />
      <Frame22 />
    </div>
  );
}

function Frame10() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="content-stretch flex items-start px-[20px] relative w-full">
        <Frame21 />
      </div>
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] items-start relative shrink-0 w-full">
      <Frame9 />
      <Frame7 />
      <Frame11 />
      <Frame10 />
    </div>
  );
}

function Frame16() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[24px] items-start left-0 top-[72px] w-[393px]">
      <Frame13 />
      <Frame14 />
    </div>
  );
}

export default function Component() {
  return (
    <div className="bg-white relative size-full" data-name="매치등록2">
      <Frame2 />
      <Frame />
      <Frame16 />
    </div>
  );
}