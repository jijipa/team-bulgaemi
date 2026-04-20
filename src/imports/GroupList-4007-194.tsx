import svgPaths from "./svg-uwtcfhb265";

function IconGoal() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip pb-[4px] pt-[12px] relative shrink-0 w-full" data-name="icon-goal">
      <div className="h-[15.974px] relative shrink-0 w-[15.972px]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9723 15.9743">
          <path d={svgPaths.p9ba2480} fill="var(--fill-0, white)" fillOpacity="0.75" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Divider() {
  return <div className="bg-[rgba(255,255,255,0.2)] h-px shrink-0 w-full" data-name="divider" />;
}

function GroupName() {
  return (
    <div className="content-center flex flex-wrap gap-y-[8px] items-center justify-center pt-[12px] relative shrink-0 w-full" data-name="group-name">
      <p className="font-['Pretendard:Medium',sans-serif] h-[14px] leading-[normal] not-italic relative shrink-0 text-[12px] text-[rgba(255,255,255,0.75)] text-center w-[60px] whitespace-pre-wrap">자책골 3</p>
    </div>
  );
}

export default function GroupList() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center px-[32px] relative size-full" data-name="group-list">
      <IconGoal />
      <Divider />
      <GroupName />
    </div>
  );
}