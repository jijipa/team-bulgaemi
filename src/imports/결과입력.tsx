import svgPaths from "./svg-pst6m3rsp2";

function Frame8() {
  return (
    <div className="bg-[#242b35] h-[52px] relative rounded-[8px] shrink-0 w-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center p-[10px] relative size-full">
          <p className="font-['Paperlogy:5_Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[18px] text-white">매치 추가</p>
        </div>
      </div>
    </div>
  );
}

function Frame9() {
  return (
    <div className="-translate-x-1/2 absolute backdrop-blur-[2.5px] bg-[rgba(255,255,255,0.5)] bottom-0 content-stretch flex flex-col items-start left-1/2 pb-[48px] pt-[16px] px-[20px] w-[393px]">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.5)] border-solid border-t inset-0 pointer-events-none" />
      <Frame8 />
    </div>
  );
}

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
    <div className="absolute h-[48px] left-0 right-0 top-[65px]">
      <BtnMoreMatch />
      <p className="absolute font-['Paperlogy:6_SemiBold',sans-serif] leading-[normal] left-[calc(50%-16.5px)] not-italic text-[#242b35] text-[18px] top-[calc(50%-10px)]">매치</p>
    </div>
  );
}

function GroupTitle() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="group-title">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center pl-[20px] pr-[8px] relative size-full">
          <p className="font-['Paperlogy:7_Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#82828f] text-[20px]">9월</p>
        </div>
      </div>
    </div>
  );
}

function Group() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] leading-[0] relative shrink-0">
      <div className="bg-[#c1f0d6] col-1 ml-0 mt-0 rounded-[53.2px] row-1 size-[38px]" data-name="img-player" />
      <p className="-translate-x-1/2 col-1 font-['Paperlogy:7_Bold',sans-serif] leading-[normal] ml-[19px] mt-[8px] not-italic relative row-1 text-[#327450] text-[18px] text-center w-[38px] whitespace-pre-wrap">승</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-h-px min-w-px not-italic relative whitespace-pre-wrap">
      <p className="font-['Pretendard:SemiBold',sans-serif] relative shrink-0 text-[#1a1a1c] text-[16px] w-full">성은 FC</p>
      <p className="font-['Pretendard:Medium',sans-serif] relative shrink-0 text-[#54545c] text-[14px] w-full">2025.09.29(토)</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="bg-[#f2f2f2] content-stretch flex font-['Anton:Regular',sans-serif] gap-[4px] items-center leading-[40px] not-italic px-[2px] relative rounded-[8px] shrink-0">
      <p className="relative shrink-0 text-[#148458] text-[28px] text-center w-[28px] whitespace-pre-wrap">3</p>
      <p className="relative shrink-0 text-[#82828f] text-[32px]">:</p>
      <p className="h-[40px] relative shrink-0 text-[#82828f] text-[28px] text-center w-[28px] whitespace-pre-wrap">1</p>
    </div>
  );
}

function MoreHoriz() {
  return (
    <div className="relative shrink-0 size-[40px]" data-name="More horiz">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
        <g id="More horiz">
          <path d={svgPaths.p119e640} fill="var(--fill-0, #82828F)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame3() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center pl-[20px] pr-[12px] relative w-full">
          <Group />
          <Frame1 />
          <Frame2 />
          <MoreHoriz />
        </div>
      </div>
    </div>
  );
}

function Group1() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] leading-[0] relative shrink-0">
      <div className="bg-[#f9d0d1] col-1 ml-0 mt-0 rounded-[56px] row-1 size-[38px]" data-name="img-player" />
      <p className="-translate-x-1/2 col-1 font-['Paperlogy:7_Bold',sans-serif] leading-[normal] ml-[19px] mt-[8px] not-italic relative row-1 text-[#9f4646] text-[18px] text-center w-[38px] whitespace-pre-wrap">패</p>
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-h-px min-w-px not-italic relative whitespace-pre-wrap">
      <p className="font-['Pretendard:SemiBold',sans-serif] relative shrink-0 text-[#1a1a1c] text-[16px] w-full">JJ FC</p>
      <p className="font-['Pretendard:Medium',sans-serif] relative shrink-0 text-[#54545c] text-[14px] w-full">2025.09.22(토)</p>
    </div>
  );
}

function Frame11() {
  return (
    <div className="bg-[#f2f2f2] content-stretch flex font-['Anton:Regular',sans-serif] gap-[4px] items-center leading-[40px] not-italic px-[2px] relative rounded-[8px] shrink-0">
      <p className="relative shrink-0 text-[#b53535] text-[28px] text-center w-[28px] whitespace-pre-wrap">3</p>
      <p className="relative shrink-0 text-[#82828f] text-[32px]">:</p>
      <p className="h-[40px] relative shrink-0 text-[#82828f] text-[28px] text-center w-[28px] whitespace-pre-wrap">6</p>
    </div>
  );
}

function MoreHoriz1() {
  return (
    <div className="relative shrink-0 size-[40px]" data-name="More horiz">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
        <g id="More horiz">
          <path d={svgPaths.p119e640} fill="var(--fill-0, #82828F)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame6() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center pl-[20px] pr-[12px] relative w-full">
          <Group1 />
          <Frame10 />
          <Frame11 />
          <MoreHoriz1 />
        </div>
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
      <Frame3 />
      <Frame6 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-full">
      <GroupTitle />
      <Frame5 />
    </div>
  );
}

function GroupTitle1() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="group-title">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center pl-[20px] pr-[8px] relative size-full">
          <p className="font-['Paperlogy:7_Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#82828f] text-[20px]">8월</p>
        </div>
      </div>
    </div>
  );
}

function Group2() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] leading-[0] relative shrink-0">
      <div className="bg-[#c1f0d6] col-1 ml-0 mt-0 rounded-[53.2px] row-1 size-[38px]" data-name="img-player" />
      <p className="-translate-x-1/2 col-1 font-['Paperlogy:7_Bold',sans-serif] leading-[normal] ml-[19px] mt-[8px] not-italic relative row-1 text-[#327450] text-[18px] text-center w-[38px] whitespace-pre-wrap">승</p>
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-h-px min-w-px not-italic relative whitespace-pre-wrap">
      <p className="font-['Pretendard:SemiBold',sans-serif] relative shrink-0 text-[#1a1a1c] text-[16px] w-full">성은 FC</p>
      <p className="font-['Pretendard:Medium',sans-serif] relative shrink-0 text-[#54545c] text-[14px] w-full">2025.08.26(토)</p>
    </div>
  );
}

function Frame16() {
  return (
    <div className="bg-[#f2f2f2] content-stretch flex font-['Anton:Regular',sans-serif] gap-[4px] items-center leading-[40px] not-italic px-[2px] relative rounded-[8px] shrink-0">
      <p className="relative shrink-0 text-[#148458] text-[28px] text-center w-[28px] whitespace-pre-wrap">1</p>
      <p className="relative shrink-0 text-[#82828f] text-[32px]">:</p>
      <p className="h-[40px] relative shrink-0 text-[#82828f] text-[28px] text-center w-[28px] whitespace-pre-wrap">0</p>
    </div>
  );
}

function MoreHoriz2() {
  return (
    <div className="relative shrink-0 size-[40px]" data-name="More horiz">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
        <g id="More horiz">
          <path d={svgPaths.p119e640} fill="var(--fill-0, #82828F)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame14() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center pl-[20px] pr-[12px] relative w-full">
          <Group2 />
          <Frame15 />
          <Frame16 />
          <MoreHoriz2 />
        </div>
      </div>
    </div>
  );
}

function Group3() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] leading-[0] relative shrink-0">
      <div className="bg-[#f9d0d1] col-1 ml-0 mt-0 rounded-[56px] row-1 size-[38px]" data-name="img-player" />
      <p className="-translate-x-1/2 col-1 font-['Paperlogy:7_Bold',sans-serif] leading-[normal] ml-[19px] mt-[8px] not-italic relative row-1 text-[#9f4646] text-[18px] text-center w-[38px] whitespace-pre-wrap">패</p>
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-h-px min-w-px not-italic relative whitespace-pre-wrap">
      <p className="font-['Pretendard:SemiBold',sans-serif] relative shrink-0 text-[#1a1a1c] text-[16px] w-full">JJ FC</p>
      <p className="font-['Pretendard:Medium',sans-serif] relative shrink-0 text-[#54545c] text-[14px] w-full">2025.08.19(토)</p>
    </div>
  );
}

function Frame19() {
  return (
    <div className="bg-[#f2f2f2] content-stretch flex font-['Anton:Regular',sans-serif] gap-[4px] items-center leading-[40px] not-italic px-[2px] relative rounded-[8px] shrink-0">
      <p className="relative shrink-0 text-[#b53535] text-[28px] text-center w-[28px] whitespace-pre-wrap">1</p>
      <p className="relative shrink-0 text-[#82828f] text-[32px]">:</p>
      <p className="h-[40px] relative shrink-0 text-[#82828f] text-[28px] text-center w-[28px] whitespace-pre-wrap">3</p>
    </div>
  );
}

function MoreHoriz3() {
  return (
    <div className="relative shrink-0 size-[40px]" data-name="More horiz">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
        <g id="More horiz">
          <path d={svgPaths.p119e640} fill="var(--fill-0, #82828F)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame17() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center pl-[20px] pr-[12px] relative w-full">
          <Group3 />
          <Frame18 />
          <Frame19 />
          <MoreHoriz3 />
        </div>
      </div>
    </div>
  );
}

function Group4() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] leading-[0] relative shrink-0">
      <div className="bg-[#d7d9e0] col-1 ml-0 mt-0 rounded-[56px] row-1 size-[38px]" data-name="img-player" />
      <p className="-translate-x-1/2 col-1 font-['Paperlogy:7_Bold',sans-serif] leading-[normal] ml-[19px] mt-[8px] not-italic relative row-1 text-[#4a5560] text-[18px] text-center w-[38px] whitespace-pre-wrap">무</p>
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-h-px min-w-px not-italic relative whitespace-pre-wrap">
      <p className="font-['Pretendard:SemiBold',sans-serif] relative shrink-0 text-[#1a1a1c] text-[16px] w-full">하이볼 FC</p>
      <p className="font-['Pretendard:Medium',sans-serif] relative shrink-0 text-[#54545c] text-[14px] w-full">2025.08.12(토)</p>
    </div>
  );
}

function Frame22() {
  return (
    <div className="bg-[#f2f2f2] content-stretch flex font-['Anton:Regular',sans-serif] gap-[4px] items-center leading-[40px] not-italic px-[2px] relative rounded-[8px] shrink-0">
      <p className="relative shrink-0 text-[#1a1a1c] text-[28px] text-center w-[28px] whitespace-pre-wrap">2</p>
      <p className="relative shrink-0 text-[#82828f] text-[32px]">:</p>
      <p className="h-[40px] relative shrink-0 text-[#82828f] text-[28px] text-center w-[28px] whitespace-pre-wrap">2</p>
    </div>
  );
}

function MoreHoriz4() {
  return (
    <div className="relative shrink-0 size-[40px]" data-name="More horiz">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
        <g id="More horiz">
          <path d={svgPaths.p119e640} fill="var(--fill-0, #82828F)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame20() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center pl-[20px] pr-[12px] relative w-full">
          <Group4 />
          <Frame21 />
          <Frame22 />
          <MoreHoriz4 />
        </div>
      </div>
    </div>
  );
}

function Group5() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] leading-[0] relative shrink-0">
      <div className="bg-[#c1f0d6] col-1 ml-0 mt-0 rounded-[53.2px] row-1 size-[38px]" data-name="img-player" />
      <p className="-translate-x-1/2 col-1 font-['Paperlogy:7_Bold',sans-serif] leading-[normal] ml-[19px] mt-[8px] not-italic relative row-1 text-[#327450] text-[18px] text-center w-[38px] whitespace-pre-wrap">승</p>
    </div>
  );
}

function Frame24() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-h-px min-w-px not-italic relative whitespace-pre-wrap">
      <p className="font-['Pretendard:SemiBold',sans-serif] relative shrink-0 text-[#1a1a1c] text-[16px] w-full">FC팔로미</p>
      <p className="font-['Pretendard:Medium',sans-serif] relative shrink-0 text-[#54545c] text-[14px] w-full">2025.08.5(토)</p>
    </div>
  );
}

function Frame25() {
  return (
    <div className="bg-[#f2f2f2] content-stretch flex font-['Anton:Regular',sans-serif] gap-[4px] items-center leading-[40px] not-italic px-[2px] relative rounded-[8px] shrink-0">
      <p className="relative shrink-0 text-[#148458] text-[28px] text-center w-[28px] whitespace-pre-wrap">1</p>
      <p className="relative shrink-0 text-[#82828f] text-[32px]">:</p>
      <p className="h-[40px] relative shrink-0 text-[#82828f] text-[28px] text-center w-[28px] whitespace-pre-wrap">0</p>
    </div>
  );
}

function MoreHoriz5() {
  return (
    <div className="relative shrink-0 size-[40px]" data-name="More horiz">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
        <g id="More horiz">
          <path d={svgPaths.p119e640} fill="var(--fill-0, #82828F)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame23() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center pl-[20px] pr-[12px] relative w-full">
          <Group5 />
          <Frame24 />
          <Frame25 />
          <MoreHoriz5 />
        </div>
      </div>
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
      <Frame14 />
      <Frame17 />
      <Frame20 />
      <Frame23 />
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-full">
      <GroupTitle1 />
      <Frame13 />
    </div>
  );
}

function GroupTitle2() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="group-title">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center pl-[20px] pr-[8px] relative size-full">
          <p className="font-['Paperlogy:7_Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#82828f] text-[20px]">7월</p>
        </div>
      </div>
    </div>
  );
}

function Group6() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] leading-[0] relative shrink-0">
      <div className="bg-[#c1f0d6] col-1 ml-0 mt-0 rounded-[53.2px] row-1 size-[38px]" data-name="img-player" />
      <p className="-translate-x-1/2 col-1 font-['Paperlogy:7_Bold',sans-serif] leading-[normal] ml-[19px] mt-[8px] not-italic relative row-1 text-[#327450] text-[18px] text-center w-[38px] whitespace-pre-wrap">승</p>
    </div>
  );
}

function Frame29() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-h-px min-w-px not-italic relative whitespace-pre-wrap">
      <p className="font-['Pretendard:SemiBold',sans-serif] relative shrink-0 text-[#1a1a1c] text-[16px] w-full">성은 FC</p>
      <p className="font-['Pretendard:Medium',sans-serif] relative shrink-0 text-[#54545c] text-[14px] w-full">2025.07.26(토)</p>
    </div>
  );
}

function Frame30() {
  return (
    <div className="bg-[#f2f2f2] content-stretch flex font-['Anton:Regular',sans-serif] gap-[4px] items-center leading-[40px] not-italic px-[2px] relative rounded-[8px] shrink-0">
      <p className="relative shrink-0 text-[#148458] text-[28px] text-center w-[28px] whitespace-pre-wrap">1</p>
      <p className="relative shrink-0 text-[#82828f] text-[32px]">:</p>
      <p className="h-[40px] relative shrink-0 text-[#82828f] text-[28px] text-center w-[28px] whitespace-pre-wrap">0</p>
    </div>
  );
}

function MoreHoriz6() {
  return (
    <div className="relative shrink-0 size-[40px]" data-name="More horiz">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
        <g id="More horiz">
          <path d={svgPaths.p119e640} fill="var(--fill-0, #82828F)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame28() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center pl-[20px] pr-[12px] relative w-full">
          <Group6 />
          <Frame29 />
          <Frame30 />
          <MoreHoriz6 />
        </div>
      </div>
    </div>
  );
}

function Group7() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] leading-[0] relative shrink-0">
      <div className="bg-[#f9d0d1] col-1 ml-0 mt-0 rounded-[56px] row-1 size-[38px]" data-name="img-player" />
      <p className="-translate-x-1/2 col-1 font-['Paperlogy:7_Bold',sans-serif] leading-[normal] ml-[19px] mt-[8px] not-italic relative row-1 text-[#9f4646] text-[18px] text-center w-[38px] whitespace-pre-wrap">패</p>
    </div>
  );
}

function Frame32() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-h-px min-w-px not-italic relative whitespace-pre-wrap">
      <p className="font-['Pretendard:SemiBold',sans-serif] relative shrink-0 text-[#1a1a1c] text-[16px] w-full">JJ FC</p>
      <p className="font-['Pretendard:Medium',sans-serif] relative shrink-0 text-[#54545c] text-[14px] w-full">2025.07.19(토)</p>
    </div>
  );
}

function Frame33() {
  return (
    <div className="bg-[#f2f2f2] content-stretch flex font-['Anton:Regular',sans-serif] gap-[4px] items-center leading-[40px] not-italic px-[2px] relative rounded-[8px] shrink-0">
      <p className="relative shrink-0 text-[#9f4646] text-[28px] text-center w-[28px] whitespace-pre-wrap">1</p>
      <p className="relative shrink-0 text-[#82828f] text-[32px]">:</p>
      <p className="h-[40px] relative shrink-0 text-[#82828f] text-[28px] text-center w-[28px] whitespace-pre-wrap">3</p>
    </div>
  );
}

function MoreHoriz7() {
  return (
    <div className="relative shrink-0 size-[40px]" data-name="More horiz">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
        <g id="More horiz">
          <path d={svgPaths.p119e640} fill="var(--fill-0, #82828F)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame31() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center pl-[20px] pr-[12px] relative w-full">
          <Group7 />
          <Frame32 />
          <Frame33 />
          <MoreHoriz7 />
        </div>
      </div>
    </div>
  );
}

function Frame27() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
      <Frame28 />
      <Frame31 />
    </div>
  );
}

function Frame26() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-full">
      <GroupTitle2 />
      <Frame27 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[48px] items-start left-0 top-[143px] w-[393px]">
      <Frame4 />
      <Frame12 />
      <Frame26 />
    </div>
  );
}

export default function Component() {
  return (
    <div className="bg-white relative size-full" data-name="결과 입력">
      <Frame9 />
      <Frame />
      <Frame7 />
    </div>
  );
}