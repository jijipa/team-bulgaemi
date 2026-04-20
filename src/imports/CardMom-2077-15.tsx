import svgPaths from "./svg-obt0gtbajx";

function GroupPlayer() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative" data-name="group-player">
      <p className="font-['Pretendard:SemiBold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[18px] w-full whitespace-pre-wrap">박지황</p>
    </div>
  );
}

function GroupWinner() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="group-winner">
      <GroupPlayer />
    </div>
  );
}

function IconNumber() {
  return (
    <div className="absolute left-[89px] size-[76px] top-[27px]" data-name="icon-number">
      <div className="absolute inset-[-0.33%_-3.69%_-10.86%_-11.62%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 87.635 84.5001">
          <g id="icon-number">
            <g filter="url(#filter0_d_2077_19)" id="Group">
              <path d={svgPaths.p2f2e7000} fill="var(--fill-0, #7EBDD9)" id="Vector" />
              <path d={svgPaths.p11af6780} fill="var(--fill-0, #F0F0F0)" id="Vector_2" />
            </g>
            <path d={svgPaths.p1b0da000} fill="var(--fill-0, #3CA3CF)" id="Vector_3" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="84.5001" id="filter0_d_2077_19" width="87.635" x="-2.38419e-07" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-3" dy="4" />
              <feGaussianBlur stdDeviation="4.5" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2077_19" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_2077_19" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

export default function CardMom() {
  return (
    <div className="bg-[#f2f2f2] content-stretch flex flex-col gap-[12px] items-start overflow-clip p-[12px] relative rounded-[12px] size-full" data-name="card-mom">
      <p className="absolute bg-clip-text font-['Montserrat:ExtraBold_Italic',sans-serif] italic leading-[normal] left-[35px] text-[46px] top-0" style={{ backgroundImage: "linear-gradient(258.056deg, rgba(158, 247, 255, 0.7) 19.82%, rgba(215, 188, 244, 0) 136.69%)", WebkitTextFillColor: "transparent" }}>
        MOM
      </p>
      <div className="font-['Paperlogy:7_Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#54545c] text-[15px] whitespace-nowrap">
        <p className="mb-0">26</p>
        <p>03.02</p>
      </div>
      <GroupWinner />
      <IconNumber />
    </div>
  );
}