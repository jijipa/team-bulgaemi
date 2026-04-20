import svgPaths from "./svg-yqqgjmm4zp";

function Frame5() {
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
      <Frame5 />
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute h-[48px] left-0 right-0 top-[65px]">
      <Frame1 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-end size-full">
        <div className="content-stretch flex items-end px-[20px] relative w-full">
          <div className="font-['Pretendard:Bold',sans-serif] leading-[32px] not-italic relative shrink-0 text-[#242b35] text-[24px] tracking-[-0.48px] whitespace-nowrap">
            <p className="mb-0">{`경기에 참여하는 팀원을 `}</p>
            <p>모두 선택해주세요</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 top-[113px] w-[393px]">
      <Frame2 />
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

function Frame4() {
  return (
    <div className="absolute h-[48px] left-0 right-0 top-[24px]">
      <BtnMoreMatch />
    </div>
  );
}

export default function Component() {
  return (
    <div className="bg-white relative size-full" data-name="스코어등록1">
      <Frame />
      <Frame3 />
      <Frame4 />
    </div>
  );
}