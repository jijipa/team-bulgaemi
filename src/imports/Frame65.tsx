import svgPaths from "./svg-nw94pbdpwv";

function Layer() {
  return (
    <div className="relative shrink-0 size-[100px]" data-name="Layer_1">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 100 100">
        <g clipPath="url(#clip0_6_194)" id="Layer_1">
          <path d={svgPaths.p30e49d00} fill="var(--fill-0, #6E7783)" id="Vector" />
          <path d={svgPaths.p11abfd80} fill="url(#paint0_linear_6_194)" id="Vector_2" />
          <path d={svgPaths.p6bedf80} fill="var(--fill-0, #CECECE)" id="Vector_3" />
          <path d={svgPaths.p9356340} fill="var(--fill-0, #CECECE)" id="Vector_4" />
          <g id="Group">
            <path d={svgPaths.pd257d00} fill="var(--fill-0, #6E7783)" id="Vector_5" />
            <path d={svgPaths.p23354210} fill="var(--fill-0, #CECECE)" id="Vector_6" />
          </g>
          <path d={svgPaths.p2c5576f0} fill="var(--fill-0, #6E7783)" id="Vector_7" />
          <path d={svgPaths.p9356340} fill="var(--fill-0, #CECECE)" id="Vector_8" />
          <g id="Vector_9" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_6_194" x1="49.9791" x2="49.9791" y1="7.4791" y2="93.7499">
            <stop stopColor="#F7EE43" />
            <stop offset="1" stopColor="#FCB900" />
          </linearGradient>
          <clipPath id="clip0_6_194">
            <rect fill="white" height="100" width="100" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0">
      <div className="font-['Pretendard:Bold',sans-serif] leading-[32px] not-italic relative shrink-0 text-[#242b35] text-[24px] text-center tracking-[-0.48px] whitespace-nowrap">
        <p className="mb-0">팀원 외에 이번 경기에 함께하는</p>
        <p>용병 선수가 있나요?</p>
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-center relative shrink-0 w-full">
      <Layer />
      <Frame6 />
    </div>
  );
}

function Frame() {
  return (
    <div className="flex-[1_0_0] h-[52px] min-h-px min-w-px relative rounded-[8px]">
      <div aria-hidden="true" className="absolute border border-[#242b35] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[16px] relative size-full">
          <p className="font-['Paperlogy:5_Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#242b35] text-[18px]">없어요</p>
        </div>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="flex-[1_0_0] h-[52px] min-h-px min-w-px relative rounded-[8px]">
      <div aria-hidden="true" className="absolute border border-[#242b35] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[16px] relative size-full">
          <p className="font-['Paperlogy:5_Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#242b35] text-[18px]">용병 선수 추가</p>
        </div>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full">
      <Frame />
      <Frame2 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute bottom-0 content-stretch flex flex-col h-[387px] items-start justify-between left-0 pb-[48px] pt-[64px] px-[20px] w-[393px]">
      <Frame5 />
      <Frame3 />
    </div>
  );
}

export default function Frame4() {
  return (
    <div className="bg-white overflow-clip relative rounded-tl-[20px] rounded-tr-[20px] size-full">
      <Frame1 />
    </div>
  );
}