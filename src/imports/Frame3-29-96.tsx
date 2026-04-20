import svgPaths from "./svg-cqmmmrpi7h";

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

function Frame1() {
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

export default function Frame() {
  return (
    <div className="relative size-full">
      <BtnMoreMatch />
      <Frame1 />
    </div>
  );
}