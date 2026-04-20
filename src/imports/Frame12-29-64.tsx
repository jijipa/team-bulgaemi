function Frame() {
  return (
    <div className="content-stretch flex h-[52px] items-center justify-center p-[10px] relative rounded-[8px] shrink-0 w-[110px]">
      <div aria-hidden="true" className="absolute border border-[#242b35] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="font-['Paperlogy:5_Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#242b35] text-[18px]">이전</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="bg-[#242b35] flex-[1_0_0] h-[52px] min-h-px min-w-px relative rounded-[8px]">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center p-[10px] relative size-full">
          <p className="font-['Paperlogy:5_Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[18px] text-white">다음</p>
        </div>
      </div>
    </div>
  );
}

export default function Frame1() {
  return (
    <div className="backdrop-blur-[2.5px] bg-[rgba(255,255,255,0.5)] content-stretch flex gap-[8px] items-start pb-[48px] pt-[16px] px-[20px] relative size-full">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.5)] border-solid border-t inset-0 pointer-events-none" />
      <Frame />
      <Frame2 />
    </div>
  );
}