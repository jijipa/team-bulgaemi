import svgPaths from "./svg-1je7yeed66";

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
          <p className="font-['Paperlogy:5_Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[18px] text-white">등록 완료</p>
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

function Frame9() {
  return (
    <div className="absolute h-[20px] left-[20px] top-[14px] w-[83.993px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 83.9927 20.0001">
        <g id="Frame 76">
          <g id="Frame 77">
            <rect fill="var(--fill-0, #242B35)" height="19.9976" rx="9.99878" width="19.9976" y="0.00122452" />
            <path d="M6 9.84616L9.55409 14L14 5" id="Vector 22" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </g>
          <path d="M19.9976 10H31.9976" id="Vector 20" stroke="var(--stroke-0, #242B35)" strokeWidth="2" />
          <g id="Frame 78">
            <rect fill="var(--fill-0, #242B35)" height="19.9976" rx="9.99878" width="19.9976" x="31.9976" y="0.00122452" />
            <path d="M38 9.84616L41.5541 14L46 5" id="Vector 22_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </g>
          <path d="M51.9951 10H63.9951" id="Vector 22_3" stroke="var(--stroke-0, #242B35)" strokeWidth="2" />
          <path d={svgPaths.p118146f1} fill="var(--fill-0, #242B35)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute h-[48px] left-0 right-0 top-[24px]">
      <BtnMoreMatch />
      <Frame9 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[20px] relative shrink-0">
      <div className="font-['Pretendard:Bold',sans-serif] leading-[32px] not-italic relative shrink-0 text-[#242b35] text-[24px] tracking-[-0.48px] whitespace-nowrap">
        <p className="mb-0">마지막으로</p>
        <p>상대팀 이름은 무엇인가요?</p>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="flex-[1_0_0] h-[52px] min-h-px min-w-px relative rounded-[5px]">
      <div aria-hidden="true" className="absolute border border-[#e1e4ec] border-solid inset-0 pointer-events-none rounded-[5px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[12px] relative size-full">
          <p className="font-['Pretendard:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#acacb5] text-[16px] tracking-[-0.32px]">예) MY FC</p>
        </div>
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="content-stretch flex items-start px-[20px] relative w-full">
        <Frame4 />
      </div>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame5 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[24px] items-start left-0 top-[72px] w-[393px]">
      <Frame6 />
      <Frame7 />
    </div>
  );
}

export default function Component() {
  return (
    <div className="bg-white relative size-full" data-name="매치등록3">
      <Frame2 />
      <Frame />
      <Frame8 />
    </div>
  );
}