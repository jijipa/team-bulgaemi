import svgPaths from "../../imports/svg-zcyalr9017";
import { ImageWithFallback } from "./figma/ImageWithFallback";

// ✅ 기본 매치 카드 배경 이미지
const DEFAULT_MATCH_IMAGE = "https://i.imgur.com/K5sm165.jpeg";

interface Scorer {
  name: string;
  goals: number;
}

export interface MatchCardImageProps {
  date: string;
  ourScore: number;
  opponentScore: number;
  opponentName: string;
  scorers: Scorer[];
  imageUrl: string;
}

export default function MatchCardImage({
  date,
  ourScore,
  opponentScore,
  opponentName,
  scorers,
  imageUrl,
}: MatchCardImageProps) {
  return (
    <div className="h-[324px] overflow-clip relative rounded-[12px] shrink-0 w-[216px]">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[12px]">
        <ImageWithFallback
          alt=""
          className="absolute max-w-none object-cover rounded-[12px] size-full"
          src={imageUrl}
          fallbackSrc={DEFAULT_MATCH_IMAGE}
        />
        <div className="absolute bg-gradient-to-b from-[rgba(0,0,0,0.3)] inset-0 mix-blend-multiply rounded-[12px] to-[69.848%] to-[rgba(0,0,0,0.7)]" />
      </div>
      <div className="absolute content-stretch flex flex-col items-center left-0 right-0 top-[32px]">
        <p className="leading-[normal] not-italic relative shrink-0 text-[16px] text-center text-white w-full whitespace-pre-wrap" style={{ fontFamily: 'var(--font-paperlogy)' }}>
          {date}
        </p>
        {/* Score */}
        <div className="content-stretch flex items-center justify-center pt-[24px] relative shrink-0 w-full">
          <div className="content-stretch flex flex-col gap-[4px] items-center not-italic relative shrink-0 w-[80px]">
            <p className="leading-[normal] relative shrink-0 text-[12px] text-white" style={{ fontFamily: 'var(--font-pretendard)' }}>
              팀불개미
            </p>
            <p className="leading-[100px] relative shrink-0 text-[100px] text-[rgba(255,255,255,0.75)] w-[50px] whitespace-pre-wrap" style={{ fontFamily: 'var(--font-anton)' }}>
              {ourScore}
            </p>
          </div>
          <div className="content-stretch flex flex-col items-start pt-[16px] relative shrink-0 w-[20px]">
            <div className="bg-[rgba(255,255,255,0.75)] h-[8px] shrink-0 w-full" />
          </div>
          <div className="content-stretch flex flex-col gap-[4px] items-center not-italic relative shrink-0 w-[80px]">
            <p className="leading-[normal] relative shrink-0 text-[12px] text-white" style={{ fontFamily: 'var(--font-pretendard)' }}>
              {opponentName}
            </p>
            <p className="leading-[100px] relative shrink-0 text-[100px] text-[rgba(255,255,255,0.75)] w-[50px] whitespace-pre-wrap" style={{ fontFamily: 'var(--font-anton)' }}>
              {opponentScore}
            </p>
          </div>
        </div>
        {/* Goal Icon & Scorer Names */}
        <div className="relative shrink-0 w-full">
          <div className="flex flex-col items-center justify-center size-full">
            <div className="content-stretch flex flex-col items-center justify-center px-[32px] relative w-full">
              <div className="content-stretch flex items-center justify-center overflow-clip pb-[4px] pt-[12px] relative shrink-0 w-full">
                <div className="h-[15.974px] relative shrink-0 w-[15.972px]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9723 15.9743">
                    <path d={svgPaths.p9ba2480} fill="var(--fill-0, white)" fillOpacity="0.75" />
                  </svg>
                </div>
              </div>
              <div className="bg-[rgba(255,255,255,0.2)] h-px shrink-0 w-full" />
              <div className="content-center flex flex-wrap gap-[8px_24px] items-center leading-[normal] max-w-[120px] not-italic pt-[12px] relative shrink-0 text-[12px] text-[rgba(255,255,255,0.75)] text-center whitespace-pre-wrap" style={{ fontFamily: 'var(--font-pretendard)' }}>
                {scorers.map((scorer, index) => (
                  <p key={index} className="h-[14px] relative shrink-0">
                    {scorer.name} {scorer.goals}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}