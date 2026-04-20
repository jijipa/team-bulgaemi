import svgPaths from "./svg-fnwogjyv26";

function Rank() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 w-[24px]" data-name="rank">
      <p className="font-['Paperlogy:7_Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[13px]">1</p>
    </div>
  );
}

function IconNumber() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="icon-number">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="icon-number">
          <g id="Group">
            <path d={svgPaths.p1b424700} fill="var(--fill-0, #7EBDD9)" id="Vector" />
            <path d={svgPaths.p1c0fd00} fill="var(--fill-0, #F0F0F0)" id="Vector_2" />
          </g>
          <path d={svgPaths.p2f6a53d0} fill="var(--fill-0, #3CA3CF)" id="Vector_3" />
        </g>
      </svg>
    </div>
  );
}

function Frame() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[8px] relative w-full">
          <IconNumber />
          <p className="font-['Pretendard:SemiBold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[16px]">박지황</p>
        </div>
      </div>
    </div>
  );
}

function DataGoal() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 w-[40px]" data-name="data-goal">
      <p className="font-['Pretendard:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[17px] text-center w-full whitespace-pre-wrap">1</p>
    </div>
  );
}

function DataAssist() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 w-[40px]" data-name="data-assist">
      <p className="font-['Pretendard:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[17px] text-center w-full whitespace-pre-wrap">1</p>
    </div>
  );
}

function DataMom() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 w-[40px]" data-name="data-MOM">
      <p className="font-['Pretendard:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[17px] text-center w-full whitespace-pre-wrap">1</p>
    </div>
  );
}

function DataPlaytime() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 w-[40px]" data-name="data-playtime">
      <p className="font-['Pretendard:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[17px] text-center w-full whitespace-pre-wrap">1</p>
    </div>
  );
}

export default function TableRow() {
  return (
    <div className="content-stretch flex items-center px-[20px] py-[8px] relative size-full" data-name="table-row">
      <Rank />
      <Frame />
      <DataGoal />
      <DataAssist />
      <DataMom />
      <DataPlaytime />
    </div>
  );
}