import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import type { Player } from "../types/data";
import {
  sortPlayersByNumber,
  validateTeamMemberInput,
} from "../utils/teamMembers";
import TeamMemberJersey from "./TeamMemberJersey";

interface TeamMemberManagementProps {
  players: Player[];
  onBack: () => void;
  onAddMember: (input: { name: string; number: string }) => Promise<void>;
  onUpdateMember: (
    playerId: string,
    input: { name: string; number: string },
  ) => Promise<void>;
  onDeleteMember: (playerId: string) => Promise<void>;
}

type SheetState =
  | { type: "closed" }
  | { type: "actions"; player: Player }
  | { type: "form"; mode: "add" | "edit"; player?: Player };

const normalizeNameInput = (value: string) => value.slice(0, 5);
const normalizeNumberInput = (value: string) =>
  value.replace(/\D/g, "").slice(0, 3);
const MORE_HORIZ_ASSET =
  "https://www.figma.com/api/mcp/asset/1c42842d-d993-49ba-b14a-c37c9f6ee0d6";
const ADD_MEMBER_CLOSE_ASSET =
  "https://www.figma.com/api/mcp/asset/1c0918e9-b660-4308-a4e0-f72e12380ad0";

function MoreIcon() {
  return (
    <div className="relative size-[40px] shrink-0">
      <img
        alt=""
        aria-hidden="true"
        className="absolute inset-0 block size-full max-w-none"
        src={MORE_HORIZ_ASSET}
      />
    </div>
  );
}

function BackIcon() {
  return (
    <svg
      aria-hidden="true"
      className="block size-[24px]"
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M16 19.5L8 12L16 4.5"
        stroke="#242B35"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <img
      alt=""
      aria-hidden="true"
      className="block size-[32px] max-w-none"
      src={ADD_MEMBER_CLOSE_ASSET}
    />
  );
}

function SheetBackdrop({ onClose }: { onClose: () => void }) {
  return (
    <button
      aria-label="시트 닫기"
      className="fixed inset-0 z-40 bg-[rgba(0,0,0,0.5)]"
      onClick={onClose}
      type="button"
    />
  );
}

export default function TeamMemberManagement({
  players,
  onBack,
  onAddMember,
  onUpdateMember,
  onDeleteMember,
}: TeamMemberManagementProps) {
  const sortedPlayers = useMemo(() => sortPlayersByNumber(players), [players]);
  const [sheetState, setSheetState] = useState<SheetState>({
    type: "closed",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formValues, setFormValues] = useState({ name: "", number: "" });
  const [formError, setFormError] = useState("");
  const scrollRootRef = useRef<HTMLDivElement>(null);
  const [headerBorderOpaque, setHeaderBorderOpaque] = useState(false);

  useEffect(() => {
    const root = scrollRootRef.current;
    if (!root) return;

    const sync = () => {
      setHeaderBorderOpaque(root.scrollTop > 0);
    };
    sync();

    root.addEventListener("scroll", sync, { passive: true });
    return () => root.removeEventListener("scroll", sync);
  }, []);

  const selectedPlayer =
    sheetState.type === "actions" || sheetState.type === "form"
      ? sheetState.player
      : undefined;
  const isFormComplete =
    formValues.name.trim().length > 0 &&
    formValues.number.trim().length > 0;

  const closeSheets = () => {
    if (isSubmitting) return;
    setSheetState({ type: "closed" });
    setShowDeleteConfirm(false);
    setFormError("");
  };

  const openAddSheet = () => {
    setFormValues({ name: "", number: "" });
    setFormError("");
    setSheetState({ type: "form", mode: "add" });
  };

  const openEditSheet = (player: Player) => {
    setFormValues({
      name: player.name,
      number: String(player.number ?? ""),
    });
    setFormError("");
    setSheetState({ type: "form", mode: "edit", player });
  };

  const handleSubmitForm = async () => {
    if (sheetState.type !== "form") return;

    const validationError = validateTeamMemberInput(
      formValues,
      players,
      sheetState.player?.id,
    );

    if (validationError) {
      setFormError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      if (sheetState.mode === "add") {
        await onAddMember(formValues);
        toast.success("팀원을 추가했어요.");
      } else if (sheetState.player) {
        await onUpdateMember(sheetState.player.id, formValues);
        toast.success("팀원 정보를 수정했어요.");
      }
      closeSheets();
    } catch (error) {
      console.error("팀원 저장 실패:", error);
      setFormError("저장에 실패했어요. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedPlayer) return;

    setIsSubmitting(true);
    try {
      await onDeleteMember(selectedPlayer.id);
      toast.success("팀원을 삭제했어요.");
      closeSheets();
    } catch (error) {
      console.error("팀원 삭제 실패:", error);
      toast.error("삭제에 실패했어요. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      ref={scrollRootRef}
      className="bg-white h-screen w-full overflow-y-auto"
    >
      <div
        className="sticky top-0 z-20 border-b border-solid bg-white pt-[24px] transition-[border-bottom-color] duration-200 ease-out"
        style={{
          borderBottomColor: headerBorderOpaque
            ? "rgb(242, 242, 242)"
            : "rgba(242, 242, 242, 0)",
        }}
      >
        <div className="relative h-[48px] w-full">
          <button
            className="absolute left-[8px] top-1/2 flex size-[40px] -translate-y-1/2 items-center justify-center"
            onClick={onBack}
            type="button"
          >
            <BackIcon />
          </button>
          <p
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[18px] text-[#242b35]"
            style={{
              fontFamily: "var(--font-paperlogy)",
              fontWeight: 600,
            }}
          >
            팀원 관리
          </p>
        </div>
      </div>

      <div className="w-full px-0 pb-[120px] pt-[16px]">
        <div className="flex flex-col gap-[8px]">
          {sortedPlayers.map((player) => (
            <div
              key={player.id}
              className="flex items-center gap-[12px] pl-[20px] pr-[12px]"
            >
              <TeamMemberJersey number={player.number} />
              <div className="min-w-0 flex-1">
                <p
                  className="truncate text-[16px] text-[#1a1a1c]"
                  style={{
                    fontFamily: "var(--font-pretendard)",
                    fontWeight: 600,
                  }}
                >
                  {player.name}
                </p>
              </div>
              <button
                className="flex size-[40px] items-center justify-center"
                onClick={() =>
                  setSheetState({ type: "actions", player })
                }
                type="button"
              >
                <MoreIcon />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-[rgba(255,255,255,0.5)] bg-[rgba(255,255,255,0.5)] px-[20px] pb-[24px] pt-[16px] backdrop-blur-[2.5px]">
        <button
          className="h-[52px] w-full rounded-[8px] bg-[#242b35] text-[18px] text-white"
          onClick={openAddSheet}
          type="button"
        >
          <span
            style={{
              fontFamily: "var(--font-paperlogy)",
              fontWeight: 500,
            }}
          >
            팀원 추가
          </span>
        </button>
      </div>

      {sheetState.type === "actions" ? (
        <>
          <SheetBackdrop onClose={closeSheets} />
          <div className="fixed bottom-0 left-0 right-0 z-50 animate-[slideUp_0.3s_ease-out] overflow-hidden rounded-t-[20px] bg-white pt-[20px] pb-[20px]">
            <button
              className="flex w-full items-start px-[20px] py-[16px] text-[18px] text-[#cf4444]"
              onClick={() => setShowDeleteConfirm(true)}
              type="button"
            >
              <span
                style={{
                  fontFamily: "var(--font-pretendard)",
                  fontWeight: 600,
                }}
              >
                팀원 삭제
              </span>
            </button>
            <button
              className="flex w-full items-start px-[20px] py-[16px] text-[18px] text-[#1a1a1c]"
              onClick={() => selectedPlayer && openEditSheet(selectedPlayer)}
              type="button"
            >
              <span
                style={{
                  fontFamily: "var(--font-pretendard)",
                  fontWeight: 600,
                }}
              >
                팀원 정보 수정
              </span>
            </button>
          </div>
        </>
      ) : null}

      {sheetState.type === "form" ? (
        <>
          <SheetBackdrop onClose={closeSheets} />
          <div className="fixed bottom-0 left-0 right-0 z-50 animate-[slideUp_0.3s_ease-out]">
            <div className="mx-auto w-full overflow-clip rounded-tl-[20px] rounded-tr-[20px] bg-white">
              <button
                className="absolute right-[20px] top-[24px] z-10 flex size-[32px] items-center justify-center"
                onClick={closeSheets}
                type="button"
              >
                <CloseIcon />
              </button>

              <div className="flex flex-col items-start gap-[32px] pt-[56px]">
                {sheetState.mode === "add" ? (
                  <div className="flex w-full flex-col items-start gap-[40px]">
                    <div className="w-full px-[20px]">
                      <div
                        className="text-[24px] leading-[32px] tracking-[-0.48px] text-[#242b35]"
                        style={{
                          fontFamily: "var(--font-pretendard)",
                          fontWeight: 700,
                        }}
                      >
                        <p className="m-0">추가할 팀원의</p>
                        <p className="m-0">정보를 입력해주세요</p>
                      </div>
                    </div>

                    <div className="flex w-full flex-col items-center justify-center gap-[32px]">
                      <div className="flex flex-col items-center justify-center px-[5px] py-[8px]">
                        <TeamMemberJersey
                          variant="preview"
                          name={formValues.name}
                          number={formValues.number}
                        />
                      </div>

                      <div className="w-full px-[20px]">
                        <div className="flex items-start gap-[8px]">
                          <label className="flex min-w-0 flex-1 flex-col gap-[8px]">
                            <p
                              className="text-[14px] leading-[normal] tracking-[-0.28px] text-[#1a1a1c]"
                              style={{
                                fontFamily: "var(--font-pretendard)",
                                fontWeight: 500,
                              }}
                            >
                              이름 <span className="text-[#d6253c]">*</span>
                            </p>
                            <input
                              className="h-[52px] w-full rounded-[5px] border border-[#e1e4ec] pl-[12px] pr-[8px] text-[16px] leading-[normal] tracking-[-0.32px] text-[#1a1a1c] outline-none placeholder:text-[#acacb5]"
                              maxLength={5}
                              onChange={(event) => {
                                setFormValues((prev) => ({
                                  ...prev,
                                  name: normalizeNameInput(event.target.value),
                                }));
                                setFormError("");
                              }}
                              placeholder="예) 박재재"
                              type="text"
                              value={formValues.name}
                            />
                          </label>
                          <label className="flex min-w-0 flex-1 flex-col gap-[8px]">
                            <p
                              className="text-[14px] leading-[normal] tracking-[-0.28px] text-[#1a1a1c]"
                              style={{
                                fontFamily: "var(--font-pretendard)",
                                fontWeight: 500,
                              }}
                            >
                              등번호 <span className="text-[#d6253c]">*</span>
                            </p>
                            <input
                              className="h-[52px] w-full rounded-[5px] border border-[#e1e4ec] pl-[12px] pr-[8px] text-[16px] leading-[normal] tracking-[-0.32px] text-[#1a1a1c] outline-none placeholder:text-[#acacb5]"
                              inputMode="numeric"
                              onChange={(event) => {
                                setFormValues((prev) => ({
                                  ...prev,
                                  number: normalizeNumberInput(
                                    event.target.value,
                                  ),
                                }));
                                setFormError("");
                              }}
                              placeholder="예) 7"
                              type="text"
                              value={formValues.number}
                            />
                          </label>
                        </div>
                        {formError ? (
                          <p
                            className="mt-[10px] text-[13px] text-[#cf4444]"
                            style={{
                              fontFamily: "var(--font-pretendard)",
                              fontWeight: 500,
                            }}
                          >
                            {formError}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex w-full flex-col items-start gap-[32px]">
                    <div className="w-full px-[20px]">
                      <div
                        className="text-[24px] leading-[32px] tracking-[-0.48px] text-[#242b35]"
                        style={{
                          fontFamily: "var(--font-pretendard)",
                          fontWeight: 700,
                        }}
                      >
                        <p className="m-0">팀원 정보를</p>
                        <p className="m-0">수정해주세요</p>
                      </div>
                    </div>

                    <div className="flex w-full justify-center px-[20px]">
                      <TeamMemberJersey
                        variant="preview"
                        name={formValues.name}
                        number={formValues.number}
                      />
                    </div>

                    <div className="w-full px-[20px]">
                      <div className="flex items-start gap-[8px]">
                        <label className="flex min-w-0 flex-1 flex-col gap-[8px]">
                          <p
                            className="text-[14px] leading-[normal] tracking-[-0.28px] text-[#1a1a1c]"
                            style={{
                              fontFamily: "var(--font-pretendard)",
                              fontWeight: 500,
                            }}
                          >
                            이름 <span className="text-[#d6253c]">*</span>
                          </p>
                          <input
                            className="h-[52px] w-full rounded-[5px] border border-[#e1e4ec] pl-[12px] pr-[8px] text-[16px] leading-[normal] tracking-[-0.32px] text-[#1a1a1c] outline-none placeholder:text-[#acacb5]"
                            maxLength={5}
                            onChange={(event) => {
                              setFormValues((prev) => ({
                                ...prev,
                                name: normalizeNameInput(event.target.value),
                              }));
                              setFormError("");
                            }}
                            placeholder="예) 박재재"
                            type="text"
                            value={formValues.name}
                          />
                        </label>
                        <label className="flex min-w-0 flex-1 flex-col gap-[8px]">
                          <p
                            className="text-[14px] leading-[normal] tracking-[-0.28px] text-[#1a1a1c]"
                            style={{
                              fontFamily: "var(--font-pretendard)",
                              fontWeight: 500,
                            }}
                          >
                            등번호 <span className="text-[#d6253c]">*</span>
                          </p>
                          <input
                            className="h-[52px] w-full rounded-[5px] border border-[#e1e4ec] pl-[12px] pr-[8px] text-[16px] leading-[normal] tracking-[-0.32px] text-[#1a1a1c] outline-none placeholder:text-[#acacb5]"
                            inputMode="numeric"
                            onChange={(event) => {
                              setFormValues((prev) => ({
                                ...prev,
                                number: normalizeNumberInput(
                                  event.target.value,
                                ),
                              }));
                              setFormError("");
                            }}
                            placeholder="예) 7"
                            type="text"
                            value={formValues.number}
                          />
                        </label>
                      </div>
                      {formError ? (
                        <p
                          className="mt-[10px] text-[13px] text-[#cf4444]"
                          style={{
                            fontFamily: "var(--font-pretendard)",
                            fontWeight: 500,
                          }}
                        >
                          {formError}
                        </p>
                      ) : null}
                    </div>
                  </div>
                )}

                <div className="w-full border-t border-[rgba(255,255,255,0.5)] bg-[rgba(255,255,255,0.5)] px-[20px] pb-[24px] pt-[16px] backdrop-blur-[2.5px]">
                  <button
                    className="h-[52px] w-full rounded-[8px] text-[18px] disabled:cursor-not-allowed"
                    disabled={isSubmitting || !isFormComplete}
                    onClick={handleSubmitForm}
                    style={{
                      backgroundColor:
                        isSubmitting || !isFormComplete
                          ? "#dbe2f1"
                          : "#242b35",
                      color:
                        isSubmitting || !isFormComplete
                          ? "#b0b7c6"
                          : "#ffffff",
                    }}
                    type="button"
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-paperlogy)",
                        fontWeight: 500,
                      }}
                    >
                      {isSubmitting
                        ? "저장 중..."
                        : sheetState.mode === "add"
                          ? "추가하기"
                          : "저장"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}

      {showDeleteConfirm && selectedPlayer ? (
        <>
          <div className="fixed inset-0 z-[60] bg-[rgba(0,0,0,0.45)]" />
          <div className="fixed inset-x-[20px] top-1/2 z-[61] -translate-y-1/2 rounded-[20px] bg-white p-[24px] shadow-[0_12px_32px_rgba(0,0,0,0.16)]">
            <p
              className="text-[18px] text-[#242b35]"
              style={{
                fontFamily: "var(--font-pretendard)",
                fontWeight: 700,
              }}
            >
              팀원을 삭제할까요?
            </p>
            <p
              className="mt-[8px] text-[16px] leading-[24px] text-[#6e7783]"
              style={{
                fontFamily: "var(--font-pretendard)",
                fontWeight: 500,
              }}
            >
              삭제된 팀원은 목록과 순위에서 사라지고, 기존 경기 기록은
              용병으로 유지됩니다.
            </p>
            <div className="mt-[20px] flex gap-[8px]">
              <button
                className="h-[48px] flex-1 rounded-[8px] border border-[#d7d9e0] text-[16px] text-[#242b35]"
                onClick={() => setShowDeleteConfirm(false)}
                type="button"
              >
                취소
              </button>
              <button
                className="h-[48px] flex-1 rounded-[8px] bg-[#cf4444] text-[16px] text-white disabled:cursor-not-allowed disabled:bg-[#e7a8a8]"
                disabled={isSubmitting}
                onClick={handleDelete}
                type="button"
              >
                {isSubmitting ? "삭제 중..." : "삭제"}
              </button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
