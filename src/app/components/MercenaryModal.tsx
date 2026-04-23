import svgPaths from "../../imports/svg-nw94pbdpwv";
import { motion } from "motion/react";

interface MercenaryModalProps {
  isSaving: boolean;
  onClose: () => void;
  onNoMercenary: () => void;
  onAddMercenary: () => void;
}

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

export default function MercenaryModal({ isSaving, onClose, onNoMercenary, onAddMercenary }: MercenaryModalProps) {
  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-40"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed bottom-0 left-0 right-0 z-50 animate-[slideUp_0.3s_ease-out]">
        <div className="bg-white overflow-clip relative rounded-tl-[20px] rounded-tr-[20px] w-full mx-auto">
          <div className="content-stretch flex flex-col h-[363px] items-start justify-between pb-[24px] pt-[64px] px-[20px]">
            {/* Content */}
            <div className="content-stretch flex flex-col gap-[12px] items-center relative shrink-0 w-full">
              <Layer />
              <div className="content-stretch flex flex-col items-center relative shrink-0">
                <div className="font-bold leading-[32px] not-italic relative shrink-0 text-[#242b35] text-[24px] text-center tracking-[-0.48px] whitespace-nowrap" style={{ fontFamily: 'var(--font-pretendard)' }}>
                  <p className="mb-0">팀원 외에 이번 경기에 함께하는</p>
                  <p>용병 선수가 있나요?</p>
                </div>
              </div>
            </div>
            
            {/* Buttons */}
            <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full">
              <button
                onClick={onNoMercenary}
                disabled={isSaving}
                className={`flex-[1_0_0] h-[52px] min-h-px min-w-px relative rounded-[8px] border border-[#242b35] border-solid transition-colors ${
                  isSaving ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-gray-50"
                }`}
              >
                <div className="flex flex-row items-center justify-center size-full">
                  <div className="content-stretch flex items-center justify-center px-[16px] relative size-full gap-[8px]">
                    {isSaving && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="size-[18px] border-2 border-[#242b35] border-t-transparent rounded-full"
                      />
                    )}
                    <p className="font-medium leading-[normal] not-italic relative shrink-0 text-[#242b35] text-[18px]" style={{ fontFamily: 'var(--font-paperlogy)' }}>
                      {isSaving ? "저장 중..." : "없어요"}
                    </p>
                  </div>
                </div>
              </button>
              
              <button
                onClick={onAddMercenary}
                disabled={isSaving}
                className={`flex-[1_0_0] h-[52px] min-h-px min-w-px relative rounded-[8px] border border-[#242b35] border-solid transition-colors ${
                  isSaving ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-gray-50"
                }`}
              >
                <div className="flex flex-row items-center justify-center size-full">
                  <div className="content-stretch flex items-center justify-center px-[16px] relative size-full">
                    <p className="font-medium leading-[normal] not-italic relative shrink-0 text-[#242b35] text-[18px]" style={{ fontFamily: 'var(--font-paperlogy)' }}>용병 선수 추가</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
