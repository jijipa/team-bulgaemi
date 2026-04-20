import svgPaths from "./svg-3pivqmhpia";
import imgImgMatch from "figma:asset/58c389424589682cea41d11e9dee470b8deab6a1.png";

function GroupTeam() {
  return (
    <div className="content-stretch flex flex-col gap-[13.333px] items-center not-italic relative shrink-0 w-[266.667px]" data-name="group-team1">
      <p className="font-['Pretendard:Medium',sans-serif] leading-[normal] relative shrink-0 text-[40px] text-white">RedAnt FC</p>
      <p className="font-['Anton:Regular',sans-serif] leading-[333.333px] relative shrink-0 text-[333.333px] text-[rgba(255,255,255,0.75)] w-[166.667px] whitespace-pre-wrap">2</p>
    </div>
  );
}

function Hyphen() {
  return <div className="bg-[rgba(255,255,255,0.75)] h-[26.667px] shrink-0 w-full" data-name="hyphen" />;
}

function ContainerHyphen() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[53.333px] relative shrink-0 w-[66.667px]" data-name="container-hyphen">
      <Hyphen />
    </div>
  );
}

function GroupTeam1() {
  return (
    <div className="content-stretch flex flex-col gap-[13.333px] items-center not-italic relative shrink-0 w-[266.667px]" data-name="group-team2">
      <p className="font-['Pretendard:Medium',sans-serif] leading-[normal] relative shrink-0 text-[40px] text-white">JJFC</p>
      <p className="font-['Anton:Regular',sans-serif] leading-[333.333px] relative shrink-0 text-[333.333px] text-[rgba(255,255,255,0.75)] w-[166.667px] whitespace-pre-wrap">2</p>
    </div>
  );
}

function GroupScore() {
  return (
    <div className="content-stretch flex items-center justify-center pt-[80px] relative shrink-0 w-full" data-name="group-score">
      <GroupTeam />
      <ContainerHyphen />
      <GroupTeam1 />
    </div>
  );
}

function IconGoal() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip pb-[13.333px] pt-[40px] relative shrink-0 w-full" data-name="icon-goal">
      <div className="h-[53.248px] relative shrink-0 w-[53.241px]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 53.2411 53.2478">
          <path d={svgPaths.p1800d300} fill="var(--fill-0, white)" fillOpacity="0.75" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Divider() {
  return <div className="bg-[rgba(255,255,255,0.2)] h-[3.333px] shrink-0 w-full" data-name="divider" />;
}

function GroupName() {
  return (
    <div className="content-center flex flex-wrap font-['Pretendard:Medium',sans-serif] gap-[8px_80px] items-center leading-[normal] max-w-[400px] not-italic pt-[40px] relative shrink-0 text-[40px] text-[rgba(255,255,255,0.75)] text-center whitespace-pre-wrap" data-name="group-name">
      <p className="h-[46.667px] relative shrink-0 w-[160px]">박지황</p>
      <p className="h-[46.667px] relative shrink-0 w-[160px]">박효창</p>
      <p className="h-[46.667px] relative shrink-0 w-[160px]">김솔겸</p>
      <p className="h-[46.667px] relative shrink-0 w-[160px]">은찬호</p>
    </div>
  );
}

function GroupList() {
  return (
    <div className="relative shrink-0 w-full" data-name="group-list">
      <div className="flex flex-col items-center justify-center size-full">
        <div className="content-stretch flex flex-col items-center justify-center px-[106.667px] relative w-full">
          <IconGoal />
          <Divider />
          <GroupName />
        </div>
      </div>
    </div>
  );
}

function GroupMatch() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-0 right-0 top-[106.67px]" data-name="group-match">
      <p className="font-['Paperlogy:5_Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[53.333px] text-center text-white w-full whitespace-pre-wrap">2025. 08.12</p>
      <GroupScore />
      <GroupList />
    </div>
  );
}

export default function ImgMatch() {
  return (
    <div className="relative size-full" data-name="img-match">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <img alt="" className="absolute max-w-none object-cover size-full" src={imgImgMatch} />
        <div className="absolute bg-gradient-to-b from-[rgba(0,0,0,0.3)] inset-0 mix-blend-multiply to-[69.848%] to-[rgba(0,0,0,0.7)]" />
      </div>
      <GroupMatch />
    </div>
  );
}