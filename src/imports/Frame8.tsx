function Frame3() {
  return <div className="bg-[#b5bac8] rounded-[3px] shrink-0 size-[6px]" />;
}

function Frame4() {
  return <div className="bg-[#b5bac8] rounded-[3px] shrink-0 size-[6px]" />;
}

function Frame6() {
  return <div className="bg-[#b5bac8] rounded-[3px] shrink-0 size-[6px]" />;
}

function Frame5() {
  return (
    <div className="col-1 content-stretch flex gap-[3px] items-center ml-[7px] mt-[16px] relative row-1">
      <Frame3 />
      <Frame4 />
      <Frame6 />
    </div>
  );
}

function Group() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] leading-[0] relative shrink-0">
      <div className="border border-[#e6e8f3] border-solid col-1 ml-0 mt-0 rounded-[53.2px] row-1 size-[38px]" data-name="img-player" style={{ backgroundImage: "linear-gradient(113.629deg, rgb(236, 237, 245) 6.2357%, rgb(249, 249, 249) 128.38%)" }} />
      <Frame5 />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-h-px min-w-px not-italic relative whitespace-pre-wrap">
      <p className="font-['Pretendard:SemiBold',sans-serif] relative shrink-0 text-[#1a1a1c] text-[16px] w-full">JJFC</p>
      <p className="font-['Pretendard:Medium',sans-serif] relative shrink-0 text-[#54545c] text-[14px] w-full">2025.12.13(토)</p>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex items-center justify-center px-[12px] py-[8px] relative rounded-[58px] shrink-0">
      <div aria-hidden="true" className="absolute border border-[#1a1a1c] border-solid inset-0 pointer-events-none rounded-[58px]" />
      <p className="font-['Paperlogy:5_Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[14px]">스코어 입력</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[20px] relative w-full">
          <Group />
          <Frame />
          <Frame7 />
        </div>
      </div>
    </div>
  );
}

export default function Frame2() {
  return (
    <div className="content-stretch flex flex-col items-start relative size-full">
      <Frame1 />
    </div>
  );
}