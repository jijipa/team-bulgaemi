import svgPaths from "./svg-7xetdxehvp";

function Frame1() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <p className="font-['Pretendard:SemiBold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#2c2f37] text-[14px] text-center">{`O.G. `}</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-end justify-center pt-[3px] relative shrink-0 w-[66px]">
      <Frame1 />
      <p className="font-['Pretendard:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#7b8087] text-[12px] text-center">자책골</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-col items-center relative self-stretch shrink-0">
      <div className="bg-[#d9d9d9] h-[4px] shrink-0 w-px" />
      <div className="relative shrink-0 size-[16px]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <path d={svgPaths.pba5d500} fill="var(--fill-0, #2C2F37)" id="Vector" />
        </svg>
      </div>
      <div className="bg-[#d9d9d9] h-[28px] shrink-0 w-px" />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0">
      <Frame2 />
      <Frame3 />
    </div>
  );
}

function IconArrowRight() {
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

function Frame5() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0">
      <Frame />
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none rotate-180">
          <IconArrowRight />
        </div>
      </div>
    </div>
  );
}

export default function Frame4() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative size-full">
      <Frame5 />
    </div>
  );
}