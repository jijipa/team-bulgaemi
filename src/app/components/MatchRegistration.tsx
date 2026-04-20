import { useState } from "react";
import MatchRegistrationStep1, { MatchRegistrationStep1Data } from "./MatchRegistrationStep1";
import MatchRegistrationStep2, { MatchRegistrationStep2Data } from "./MatchRegistrationStep2";
import MatchRegistrationStep3, { MatchRegistrationStep3Data } from "./MatchRegistrationStep3";
import { generateId, addMatch } from "../utils/storage";
import { Match } from "../types/data";

export interface MatchData extends MatchRegistrationStep1Data, MatchRegistrationStep2Data, MatchRegistrationStep3Data {
  id: string;
  status: "pending" | "completed"; // pending: 득점 미입력, completed: 득점 입력 완료
  ourScore?: number;
  opponentScore?: number;
  result?: "win" | "lose" | "draw";
}

interface MatchRegistrationProps {
  onComplete: () => void; // 완료 시 화면 전환만 수행
  onCancel: () => void;
  googleScriptUrl: string;
}

export default function MatchRegistration({ onComplete, onCancel, googleScriptUrl }: MatchRegistrationProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [step1Data, setStep1Data] = useState<MatchRegistrationStep1Data | null>(null);
  const [step2Data, setStep2Data] = useState<MatchRegistrationStep2Data | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleStep1Next = (data: MatchRegistrationStep1Data) => {
    setStep1Data(data);
    setCurrentStep(2);
  };

  const handleStep2Next = (data: MatchRegistrationStep2Data) => {
    setStep2Data(data);
    setCurrentStep(3);
  };

  const handleStep3Complete = async (data: MatchRegistrationStep3Data) => {
    if (!step1Data || !step2Data) return;

    setIsSaving(true);

    try {
      // 새로운 매치 데이터 생성
      const newMatch: Match = {
        id: generateId("match"),
        matchType: step1Data.matchType === "soccer" ? "soccer" : "futsal",
        playerCount: step1Data.playerCount,
        quarterCount: step1Data.quarterCount,
        quarterTime: step1Data.quarterTime,
        matchDate: step2Data.matchDate,
        startTime: step2Data.startTime,
        endTime: step2Data.endTime,
        location: step2Data.location,
        locationLink: step2Data.locationLink,
        opponentName: data.opponentName,
        isCompleted: false, // 득점 미입력 상태
        createdAt: new Date().toISOString(),
      };

      // LocalStorage에 저장
      addMatch(newMatch);

      // 구글 시트에 매치 등록 요청 (완전한 정보 전송)
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("📤 구글 시트에 매치 저장 시작...");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("📤 매치 데이터:", {
        id: newMatch.id,
        matchType: newMatch.matchType,
        playerCount: newMatch.playerCount,
        quarterCount: newMatch.quarterCount,
        quarterTime: newMatch.quarterTime,
        matchDate: newMatch.matchDate,
        startTime: newMatch.startTime,
        endTime: newMatch.endTime,
        location: newMatch.location,
        locationLink: newMatch.locationLink,
        opponentName: newMatch.opponentName,
        isCompleted: newMatch.isCompleted,
        ourScore: 0,
        opponentScore: 0,
        createdAt: newMatch.createdAt,
      });

      try {
        const response = await fetch(googleScriptUrl, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
          body: JSON.stringify({
            action: "saveMatch",
            data: JSON.stringify({
              id: newMatch.id,
              matchType: newMatch.matchType,
              playerCount: newMatch.playerCount,
              quarterCount: newMatch.quarterCount,
              quarterTime: newMatch.quarterTime,
              matchDate: newMatch.matchDate,
              startTime: newMatch.startTime,
              endTime: newMatch.endTime,
              location: newMatch.location,
              locationLink: newMatch.locationLink,
              opponentName: newMatch.opponentName,
              isCompleted: newMatch.isCompleted,
              ourScore: 0,
              opponentScore: 0,
              createdAt: newMatch.createdAt,
            }),
          }),
        });

        console.log("✅ 구글 시트 응답: 전송 완료 (no-cors 모드)");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      } catch (error) {
        console.error("❌ 구글 시트 저장 실패:", error);
        console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      }

      console.log("✅ 매치 정보 저장 완료:", newMatch);

      // 매치 등록 완료 - 화면만 전환
      onComplete();
    } catch (error) {
      console.error("매치 저장 실패:", error);
      alert("매치 등록에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    if (currentStep === 1) {
      onCancel();
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <>
      {currentStep === 1 && (
        <MatchRegistrationStep1
          onNext={handleStep1Next}
          onBack={handleBack}
          onClose={onCancel}
        />
      )}
      {currentStep === 2 && (
        <MatchRegistrationStep2
          onNext={handleStep2Next}
          onBack={handleBack}
          onClose={onCancel}
        />
      )}
      {currentStep === 3 && (
        <MatchRegistrationStep3
          onComplete={handleStep3Complete}
          onBack={handleBack}
          isSaving={isSaving}
          onClose={onCancel}
        />
      )}
    </>
  );
}