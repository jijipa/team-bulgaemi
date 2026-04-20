export default function Frame() {
  return (
    <div className="bg-[#242b35] content-stretch flex gap-[8px] items-center justify-center not-italic p-[10px] relative rounded-[8px] size-full text-[18px]">
      <p className="font-['Paperlogy:5_Medium',sans-serif] leading-[normal] relative shrink-0 text-[#a2a8b0]">최종 스코어</p>
      <p className="font-['Paperlogy:7_Bold',sans-serif] leading-[0] relative shrink-0 text-white tracking-[1.08px]">
        <span className="leading-[normal]">3:2</span>
        <span className="font-['Paperlogy:5_Medium',sans-serif] leading-[normal]">(승)</span>
      </p>
      <p className="font-['Paperlogy:5_Medium',sans-serif] leading-[normal] relative shrink-0 text-white">등록</p>
    </div>
  );
}