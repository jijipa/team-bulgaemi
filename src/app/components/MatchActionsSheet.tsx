import { motion } from "motion/react";

interface MatchActionsSheetProps {
  onClose: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onMOM: () => void;
  hasMom?: boolean;
  canSelectMom?: boolean;
}

export default function MatchActionsSheet({
  onClose,
  onDelete,
  onEdit,
  onMOM,
  hasMom,
  canSelectMom = true,
}: MatchActionsSheetProps) {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-40"
      />

      {/* Bottom Sheet */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-50"
      >
        <div className="bg-white content-stretch flex flex-col gap-[8px] items-start overflow-clip py-[20px] relative rounded-tl-[20px] rounded-tr-[20px] w-full">
          {/* 매치 삭제 */}
          <button
            onClick={onDelete}
            className="relative shrink-0 w-full hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            <div className="content-stretch flex items-start px-[20px] py-[16px] relative w-full">
              <p className="font-semibold leading-[normal] not-italic relative shrink-0 text-[#cf4444] text-[18px] text-center" style={{ fontFamily: 'var(--font-pretendard)' }}>
                매치 삭제
              </p>
            </div>
          </button>

          {/* 스코어 수정 */}
          <button
            onClick={onEdit}
            className="relative shrink-0 w-full hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            <div className="content-stretch flex items-start px-[20px] py-[16px] relative w-full">
              <p className="font-semibold leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[18px] text-center" style={{ fontFamily: 'var(--font-pretendard)' }}>
                스코어 수정
              </p>
            </div>
          </button>

          {/* MOM 선정/수정 */}
          {canSelectMom && (
            <button
              onClick={onMOM}
              className="relative shrink-0 w-full hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              <div className="content-stretch flex items-start px-[20px] py-[16px] relative w-full">
                <p className="font-semibold leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[18px] text-center" style={{ fontFamily: 'var(--font-pretendard)' }}>
                  {hasMom ? "MOM 수정" : "MOM 선정"}
                </p>
              </div>
            </button>
          )}
        </div>
      </motion.div>
    </>
  );
}
