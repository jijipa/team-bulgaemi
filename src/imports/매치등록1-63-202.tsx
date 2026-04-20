import svgPaths from "./svg-x1szjjqjlm";

function Frame3() {
  return (
    <div className="absolute h-[20px] left-[20px] top-[72px] w-[84px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 84 20.0001">
        <g id="Frame 76">
          <path d={svgPaths.pa569c00} fill="var(--fill-0, #242B35)" id="Vector" />
          <path d="M19.9976 10H31.9976" id="Vector 20" stroke="var(--stroke-0, #E1E4EC)" strokeWidth="2" />
          <g id="Frame 75">
            <rect fill="var(--fill-0, #E1E4EC)" height="19.9976" rx="9.99878" width="19.9976" x="31.9976" y="0.00122452" />
          </g>
          <path d="M51.9951 10H63.9951" id="Vector 21" stroke="var(--stroke-0, #E1E4EC)" strokeWidth="2" />
          <g id="Frame 76_2">
            <rect fill="var(--fill-0, #E1E4EC)" height="19.9976" rx="9.99878" width="19.9976" x="63.9951" y="0.00122452" />
          </g>
        </g>
      </svg>
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

function Frame2() {
  return (
    <div className="absolute h-[48px] left-0 right-0 top-[24px]">
      <BtnMoreMatch />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[20px] relative shrink-0">
      <p className="font-['Pretendard:Bold',sans-serif] leading-[32px] not-italic relative shrink-0 text-[#242b35] text-[24px] tracking-[-0.48px]">어떤 매치를 등록할까요?</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 top-[112px] w-[393px]">
      <Frame />
    </div>
  );
}

export default function Component() {
  return (
    <div className="bg-white relative size-full" data-name="매치등록1">
      <Frame3 />
      <Frame2 />
      <Frame1 />
    </div>
  );
}