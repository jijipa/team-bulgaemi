import { useState } from "react";
import MatchRegistrationStep1, { MatchRegistrationStep1Data } from "./MatchRegistrationStep1";
import MatchRegistrationStep2, { MatchRegistrationStep2Data } from "./MatchRegistrationStep2";
import MatchRegistrationStep3, { MatchRegistrationStep3Data } from "./MatchRegistrationStep3";
import { generateId, addMatch } from "../utils/storage";
import { Match } from "../types/data";
import { isSupabaseConfigured } from "../lib/supabase";
import { saveMatchToSupabase } from "../services/supabaseMatches";

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
}

export default function MatchRegistration({ onComplete, onCancel }: MatchRegistrationProps) {
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

      if (!isSupabaseConfigured) {
        throw new Error("Supabase 설정이 없습니다. .env.local을 확인해주세요.");
      }

      await saveMatchToSupabase(newMatch);
      console.log("✅ Supabase 매치 저장 완료");

      // LocalStorage는 화면 갱신용 캐시로만 사용
      addMatch(newMatch);
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
    <div className="fixed inset-0 z-30 bg-white h-screen min-h-screen w-full overflow-hidden">
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
    </div>
  );
}
