import svgPaths from "./svg-n8kxosjy5t";

function Frame4() {
  return (
    <div className="bg-white content-stretch flex h-[52px] items-center justify-center p-[10px] relative rounded-[8px] shrink-0 w-[110px]">
      <div aria-hidden="true" className="absolute border border-[#242b35] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="font-['Paperlogy:5_Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#242b35] text-[18px]">이전</p>
    </div>
  );
}

function Frame2() {
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

function Frame14() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full">
      <Frame4 />
      <Frame2 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="-translate-x-1/2 absolute backdrop-blur-[2.5px] bg-[rgba(255,255,255,0.5)] bottom-0 content-stretch flex flex-col items-start left-1/2 pb-[48px] pt-[16px] px-[20px] w-[393px]">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.5)] border-solid border-t inset-0 pointer-events-none" />
      <Frame14 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="bg-white content-stretch flex h-[52px] items-center justify-center p-[10px] relative rounded-[8px] shrink-0 w-[110px]">
      <div aria-hidden="true" className="absolute border border-[#242b35] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="font-['Paperlogy:5_Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#242b35] text-[18px]">이전</p>
    </div>
  );
}

function Frame6() {
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

function Frame15() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full">
      <Frame5 />
      <Frame6 />
    </div>
  );
}

function Frame12() {
  return (
    <div className="-translate-x-1/2 absolute bg-[rgba(255,255,255,0.5)] bottom-0 content-stretch flex flex-col items-start left-1/2 pb-[48px] pt-[16px] px-[20px] w-[393px]">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.5)] border-solid border-t inset-0 pointer-events-none" />
      <Frame15 />
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

function Frame13() {
  return (
    <div className="content-stretch flex font-['Paperlogy:6_SemiBold',sans-serif] gap-[4px] items-start leading-[normal] not-italic relative shrink-0 text-[#7b8087] text-[18px]">
      <p className="relative shrink-0">vs</p>
      <p className="relative shrink-0">JJFC</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[20px] top-[14px]">
      <Frame13 />
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute h-[48px] left-0 right-0 top-[65px]">
      <BtnMoreMatch />
      <Frame1 />
    </div>
  );
}

function Frame10() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-col justify-end size-full">
        <div className="content-stretch flex flex-col gap-[12px] items-start justify-end not-italic px-[20px] relative w-full whitespace-nowrap">
          <div className="font-['Pretendard:Bold',sans-serif] leading-[32px] relative shrink-0 text-[#242b35] text-[24px] tracking-[-0.48px]">
            <p className="mb-0">오늘 경기에 참여하는</p>
            <p>용병 선수를 등록해주세요.</p>
          </div>
          <div className="font-['Pretendard:Medium',sans-serif] leading-[24px] relative shrink-0 text-[#a2a8b0] text-[16px] tracking-[-0.32px]">
            <p className="mb-0">등록된 용병선수는 득점 및 도움 기록을 입력할 때</p>
            <p>선택할 수 있습니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
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

function Frame18() {
  return (
    <div className="content-stretch flex font-['Pretendard:SemiBold',sans-serif] gap-[8px] items-center justify-center leading-[normal] not-italic relative shrink-0 text-[18px] text-center">
      <p className="relative shrink-0 text-[#7b8087]">Guest</p>
      <p className="relative shrink-0 text-[#1a1a1c]">용병 1</p>
    </div>
  );
}

function Layer1() {
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

function Frame17() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Frame18 />
      <Layer1 />
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <Layer />
      <Frame17 />
    </div>
  );
}

function IconArrowRight2() {
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

function Frame9() {
  return (
    <div className="bg-[#f2f2f2] min-w-[90px] relative rounded-[12px] shrink-0 w-full">
      <div className="flex flex-row items-center min-w-[inherit] size-full">
        <div className="content-stretch flex items-center justify-between min-w-[inherit] pl-[12px] pr-[16px] py-[12px] relative w-full">
          <Frame16 />
          <div className="flex items-center justify-center relative shrink-0">
            <div className="flex-none rotate-180">
              <IconArrowRight2 />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function IconArrowRight1() {
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

function Frame7() {
  return (
    <div className="h-[52px] relative rounded-[8px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-[#e1e4ec] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[4px] items-center justify-center p-[10px] relative size-full">
          <div className="flex items-center justify-center relative shrink-0">
            <div className="flex-none rotate-180">
              <IconArrowRight1 />
            </div>
          </div>
          <p className="font-['Paperlogy:5_Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#242b35] text-[18px]">용병 추가</p>
        </div>
      </div>
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start px-[20px] relative shrink-0 w-[393px]">
      <Frame9 />
      <Frame7 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[32px] items-start left-0 top-[113px] w-[393px]">
      <Frame10 />
      <Frame8 />
    </div>
  );
}

export default function Component() {
  return (
    <div className="bg-white relative size-full" data-name="스코어등록1">
      <Frame3 />
      <Frame12 />
      <Frame />
      <Frame11 />
    </div>
  );
}