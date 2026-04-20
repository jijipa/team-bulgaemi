import svgPaths from "./svg-srsfx4bfqn";

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

function Frame3() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <div aria-hidden="true" className="absolute border-black border-r border-solid inset-0 pointer-events-none" />
      <p className="font-['Pretendard:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[18px] text-center">박지황</p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <Layer />
      <Frame3 />
    </div>
  );
}

function Frame() {
  return (
    <div className="bg-[#e1e4ec] content-stretch flex items-center justify-center px-[12px] py-[8px] relative rounded-[58px] shrink-0">
      <p className="font-['Paperlogy:5_Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[14px]">입력 완료</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center justify-between min-h-px min-w-px relative">
      <Frame4 />
      <Frame />
    </div>
  );
}

export default function Frame1() {
  return (
    <div className="bg-white content-stretch flex items-center pl-[12px] pr-[16px] py-[12px] relative rounded-[12px] size-full">
      <div aria-hidden="true" className="absolute border border-[#242b35] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_0px_44px_0px_rgba(0,0,0,0.1)]" />
      <Frame2 />
    </div>
  );
}