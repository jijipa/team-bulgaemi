function Frame1() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="content-stretch flex items-start px-[20px] py-[16px] relative w-full">
        <p className="font-['Pretendard:SemiBold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[18px] text-center">매치 삭제</p>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="content-stretch flex items-start px-[20px] py-[16px] relative w-full">
        <p className="font-['Pretendard:SemiBold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[18px] text-center">스코어 수정</p>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="content-stretch flex items-start px-[20px] py-[16px] relative w-full">
        <p className="font-['Pretendard:SemiBold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[18px] text-center">MOM 변경</p>
      </div>
    </div>
  );
}

export default function Frame() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[8px] items-start overflow-clip py-[20px] relative rounded-tl-[20px] rounded-tr-[20px] size-full">
      <Frame1 />
      <Frame2 />
      <Frame3 />
    </div>
  );
}