function IconArrowRight() {
  return (
    <div className="h-[25px] relative w-[24px]" data-name="icon_arrow_right 1">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 25">
        <g id="icon_arrow_right 1">
          <path d="M8 5L16 12.5L8 20" id="Vector" stroke="var(--stroke-0, #242B35)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function BtnMoreMatch() {
  return (
    <div className="-translate-y-1/2 absolute content-stretch flex items-center justify-center left-[8px] size-[40px] top-1/2" data-name="btn-more match">
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none rotate-180">
          <IconArrowRight />
        </div>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute h-[48px] left-0 right-0 top-[24px]">
      <BtnMoreMatch />
      <p className="absolute font-['Paperlogy:6_SemiBold',sans-serif] leading-[normal] left-[calc(50%-16.5px)] not-italic text-[#242b35] text-[18px] top-[calc(50%-10px)]">매치</p>
    </div>
  );
}

export default function Component() {
  return (
    <div className="bg-white relative size-full" data-name="결과 입력">
      <Frame />
    </div>
  );
}