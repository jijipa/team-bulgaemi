import svgPaths from "./svg-2yuyaz8aaf";
import imgImgMatch from "figma:asset/58c389424589682cea41d11e9dee470b8deab6a1.png";
import imgImgMatch1 from "figma:asset/fcdd91cf86445444b024b1769c283f9463a6278d.png";

function TitleTeam() {
  return (
    <div className="relative shrink-0 w-full" data-name="title-team">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center px-[20px] relative w-full">
          <div className="relative shrink-0 size-[28px]" data-name="team profile">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
              <circle cx="14" cy="14" fill="var(--fill-0, #D9D9D9)" id="team profile" r="14" />
            </svg>
          </div>
          <p className="font-['Paperlogy:7_Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[20px]">JJFC</p>
        </div>
      </div>
    </div>
  );
}

function IconArrowRight() {
  return (
    <div className="h-[25px] relative shrink-0 w-[24px]" data-name="icon_arrow_right 1">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 25">
        <g id="icon_arrow_right 1">
          <path d="M8 5L16 12.5L8 20" id="Vector" stroke="var(--stroke-0, #242B35)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function BtnMoreMatch() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 size-[40px]" data-name="btn-more match">
      <IconArrowRight />
    </div>
  );
}

function GroupTitle() {
  return (
    <div className="relative shrink-0 w-full" data-name="group-title">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pl-[20px] pr-[8px] relative w-full">
          <p className="font-['Paperlogy:7_Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[20px]">매치</p>
          <BtnMoreMatch />
        </div>
      </div>
    </div>
  );
}

function GroupTeam() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center not-italic relative shrink-0 w-[80px]" data-name="group-team1">
      <p className="font-['Pretendard:Medium',sans-serif] leading-[normal] relative shrink-0 text-[12px] text-white">RedAnt FC</p>
      <p className="font-['Anton:Regular',sans-serif] leading-[100px] relative shrink-0 text-[100px] text-[rgba(255,255,255,0.75)] w-[50px] whitespace-pre-wrap">2</p>
    </div>
  );
}

function Hyphen() {
  return <div className="bg-[rgba(255,255,255,0.75)] h-[8px] shrink-0 w-full" data-name="hyphen" />;
}

function ContainerHyphen() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[16px] relative shrink-0 w-[20px]" data-name="container-hyphen">
      <Hyphen />
    </div>
  );
}

function GroupTeam1() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center not-italic relative shrink-0 w-[80px]" data-name="group-team2">
      <p className="font-['Pretendard:Medium',sans-serif] leading-[normal] relative shrink-0 text-[12px] text-white">JJFC</p>
      <p className="font-['Anton:Regular',sans-serif] leading-[100px] relative shrink-0 text-[100px] text-[rgba(255,255,255,0.75)] w-[50px] whitespace-pre-wrap">2</p>
    </div>
  );
}

function GroupScore() {
  return (
    <div className="content-stretch flex items-center justify-center pt-[24px] relative shrink-0 w-full" data-name="group-score">
      <GroupTeam />
      <ContainerHyphen />
      <GroupTeam1 />
    </div>
  );
}

function IconGoal() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip pb-[4px] pt-[12px] relative shrink-0 w-full" data-name="icon-goal">
      <div className="h-[15.974px] relative shrink-0 w-[15.972px]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9723 15.9743">
          <path d={svgPaths.p9ba2480} fill="var(--fill-0, white)" fillOpacity="0.75" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Divider() {
  return <div className="bg-[rgba(255,255,255,0.2)] h-px shrink-0 w-full" data-name="divider" />;
}

function GroupName() {
  return (
    <div className="content-center flex flex-wrap font-['Pretendard:Medium',sans-serif] gap-[8px_24px] items-center leading-[normal] max-w-[120px] not-italic pt-[12px] relative shrink-0 text-[12px] text-[rgba(255,255,255,0.75)] text-center whitespace-pre-wrap" data-name="group-name">
      <p className="h-[14px] relative shrink-0 w-[48px]">박지황</p>
      <p className="h-[14px] relative shrink-0 w-[48px]">박효창</p>
      <p className="h-[14px] relative shrink-0 w-[48px]">김솔겸</p>
      <p className="h-[14px] relative shrink-0 w-[48px]">은찬호</p>
    </div>
  );
}

function GroupList() {
  return (
    <div className="relative shrink-0 w-full" data-name="group-list">
      <div className="flex flex-col items-center justify-center size-full">
        <div className="content-stretch flex flex-col items-center justify-center px-[32px] relative w-full">
          <IconGoal />
          <Divider />
          <GroupName />
        </div>
      </div>
    </div>
  );
}

function GroupMatch1() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-0 right-0 top-[32px]" data-name="group-match">
      <p className="font-['Paperlogy:5_Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-center text-white w-full whitespace-pre-wrap">2025. 08.12</p>
      <GroupScore />
      <GroupList />
    </div>
  );
}

function ImgMatch() {
  return (
    <div className="h-[324px] overflow-clip relative rounded-[12px] shrink-0 w-[216px]" data-name="img-match">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[12px]">
        <img alt="" className="absolute max-w-none object-cover rounded-[12px] size-full" src={imgImgMatch} />
        <div className="absolute bg-gradient-to-b from-[rgba(0,0,0,0.3)] inset-0 mix-blend-multiply rounded-[12px] to-[69.848%] to-[rgba(0,0,0,0.7)]" />
      </div>
      <GroupMatch1 />
    </div>
  );
}

function GroupTeam2() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center not-italic relative shrink-0 w-[80px]" data-name="group-team1">
      <p className="font-['Pretendard:Medium',sans-serif] leading-[normal] relative shrink-0 text-[12px] text-white">RedAnt FC</p>
      <p className="font-['Anton:Regular',sans-serif] leading-[100px] relative shrink-0 text-[100px] text-[rgba(255,255,255,0.75)]">5</p>
    </div>
  );
}

function Hyphen1() {
  return <div className="bg-[rgba(255,255,255,0.75)] h-[8px] shrink-0 w-full" data-name="hyphen" />;
}

function ContainerHyphen1() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[16px] relative shrink-0 w-[20px]" data-name="container-hyphen">
      <Hyphen1 />
    </div>
  );
}

function GroupTeam3() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center not-italic relative shrink-0 w-[80px]" data-name="group-team2">
      <p className="font-['Pretendard:Medium',sans-serif] leading-[normal] relative shrink-0 text-[12px] text-white">JJFC</p>
      <p className="font-['Anton:Regular',sans-serif] leading-[100px] relative shrink-0 text-[100px] text-[rgba(255,255,255,0.75)] w-[50px] whitespace-pre-wrap">2</p>
    </div>
  );
}

function GroupScore1() {
  return (
    <div className="content-stretch flex items-center justify-center pt-[24px] relative shrink-0 w-full" data-name="group-score">
      <GroupTeam2 />
      <ContainerHyphen1 />
      <GroupTeam3 />
    </div>
  );
}

function IconGoal1() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip pb-[4px] pt-[12px] relative shrink-0 w-full" data-name="icon-goal">
      <div className="h-[15.974px] relative shrink-0 w-[15.972px]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9723 15.9743">
          <path d={svgPaths.p9ba2480} fill="var(--fill-0, white)" fillOpacity="0.75" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Divider1() {
  return <div className="bg-[rgba(255,255,255,0.2)] h-px shrink-0 w-full" data-name="divider" />;
}

function GroupName1() {
  return (
    <div className="content-center flex flex-wrap font-['Pretendard:Medium',sans-serif] gap-[8px_24px] items-center leading-[normal] max-w-[120px] not-italic pt-[12px] relative shrink-0 text-[12px] text-[rgba(255,255,255,0.75)] text-center whitespace-pre-wrap" data-name="group-name">
      <p className="h-[14px] relative shrink-0 w-[48px]">박지황</p>
      <p className="h-[14px] relative shrink-0 w-[48px]">박효창</p>
      <p className="h-[14px] relative shrink-0 w-[48px]">김솔겸</p>
      <p className="h-[14px] relative shrink-0 w-[48px]">은찬호</p>
    </div>
  );
}

function GroupList1() {
  return (
    <div className="relative shrink-0 w-full" data-name="group-list">
      <div className="flex flex-col items-center justify-center size-full">
        <div className="content-stretch flex flex-col items-center justify-center px-[32px] relative w-full">
          <IconGoal1 />
          <Divider1 />
          <GroupName1 />
        </div>
      </div>
    </div>
  );
}

function GroupMatch2() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-0 right-0 top-[32px]" data-name="group-match">
      <p className="font-['Paperlogy:5_Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-center text-white w-full whitespace-pre-wrap">2025. 08.12</p>
      <GroupScore1 />
      <GroupList1 />
    </div>
  );
}

function ImgMatch1() {
  return (
    <div className="h-[324px] overflow-clip relative rounded-[12px] shrink-0 w-[216px]" data-name="img-match">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[12px]">
        <img alt="" className="absolute max-w-none object-cover rounded-[12px] size-full" src={imgImgMatch1} />
        <div className="absolute bg-gradient-to-b from-[rgba(0,0,0,0.3)] inset-0 mix-blend-multiply rounded-[12px] to-[69.848%] to-[rgba(0,0,0,0.7)]" />
      </div>
      <GroupMatch2 />
    </div>
  );
}

function GroupTeam4() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center not-italic relative shrink-0 w-[80px]" data-name="group-team1">
      <p className="font-['Pretendard:Medium',sans-serif] leading-[normal] relative shrink-0 text-[12px] text-white">RedAnt FC</p>
      <p className="font-['Anton:Regular',sans-serif] leading-[100px] relative shrink-0 text-[100px] text-[rgba(255,255,255,0.75)] w-[50px] whitespace-pre-wrap">2</p>
    </div>
  );
}

function Hyphen2() {
  return <div className="bg-[rgba(255,255,255,0.75)] h-[8px] shrink-0 w-full" data-name="hyphen" />;
}

function ContainerHyphen2() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[16px] relative shrink-0 w-[20px]" data-name="container-hyphen">
      <Hyphen2 />
    </div>
  );
}

function GroupTeam5() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center not-italic relative shrink-0 w-[80px]" data-name="group-team2">
      <p className="font-['Pretendard:Medium',sans-serif] leading-[normal] relative shrink-0 text-[12px] text-white">JJFC</p>
      <p className="font-['Anton:Regular',sans-serif] leading-[100px] relative shrink-0 text-[100px] text-[rgba(255,255,255,0.75)] w-[50px] whitespace-pre-wrap">2</p>
    </div>
  );
}

function GroupScore2() {
  return (
    <div className="content-stretch flex items-center justify-center pt-[24px] relative shrink-0 w-full" data-name="group-score">
      <GroupTeam4 />
      <ContainerHyphen2 />
      <GroupTeam5 />
    </div>
  );
}

function IconGoal2() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip pb-[4px] pt-[12px] relative shrink-0 w-full" data-name="icon-goal">
      <div className="h-[15.974px] relative shrink-0 w-[15.972px]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9723 15.9743">
          <path d={svgPaths.p9ba2480} fill="var(--fill-0, white)" fillOpacity="0.75" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Divider2() {
  return <div className="bg-[rgba(255,255,255,0.2)] h-px shrink-0 w-full" data-name="divider" />;
}

function GroupName2() {
  return (
    <div className="content-center flex flex-wrap font-['Pretendard:Medium',sans-serif] gap-[8px_24px] items-center leading-[normal] max-w-[120px] not-italic pt-[12px] relative shrink-0 text-[12px] text-[rgba(255,255,255,0.75)] text-center whitespace-pre-wrap" data-name="group-name">
      <p className="h-[14px] relative shrink-0 w-[48px]">박지황</p>
      <p className="h-[14px] relative shrink-0 w-[48px]">박효창</p>
      <p className="h-[14px] relative shrink-0 w-[48px]">김솔겸</p>
      <p className="h-[14px] relative shrink-0 w-[48px]">은찬호</p>
    </div>
  );
}

function GroupList2() {
  return (
    <div className="relative shrink-0 w-full" data-name="group-list">
      <div className="flex flex-col items-center justify-center size-full">
        <div className="content-stretch flex flex-col items-center justify-center px-[32px] relative w-full">
          <IconGoal2 />
          <Divider2 />
          <GroupName2 />
        </div>
      </div>
    </div>
  );
}

function GroupMatch3() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-0 right-0 top-[32px]" data-name="group-match">
      <p className="font-['Paperlogy:5_Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-center text-white w-full whitespace-pre-wrap">2025. 08.12</p>
      <GroupScore2 />
      <GroupList2 />
    </div>
  );
}

function ImgMatch2() {
  return (
    <div className="h-[324px] overflow-clip relative rounded-[12px] shrink-0 w-[216px]" data-name="img-match">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[12px]">
        <img alt="" className="absolute max-w-none object-cover rounded-[12px] size-full" src={imgImgMatch} />
        <div className="absolute bg-gradient-to-b from-[rgba(0,0,0,0.3)] inset-0 mix-blend-multiply rounded-[12px] to-[69.848%] to-[rgba(0,0,0,0.7)]" />
      </div>
      <GroupMatch3 />
    </div>
  );
}

function GroupMatch() {
  return (
    <div className="content-stretch flex gap-[12px] items-center px-[20px] relative shrink-0" data-name="group-match">
      <ImgMatch />
      <ImgMatch1 />
      <ImgMatch2 />
    </div>
  );
}

function ContainerMatch() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="container-match">
      <GroupMatch />
    </div>
  );
}

function SectionMatch() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="section-match">
      <GroupTitle />
      <ContainerMatch />
    </div>
  );
}

function GroupTitle1() {
  return (
    <div className="content-stretch flex h-[40px] items-center pl-[20px] pr-[8px] relative shrink-0" data-name="group-title">
      <p className="font-['Paperlogy:7_Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[20px]">MOM</p>
    </div>
  );
}

function GroupPlayer() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative" data-name="group-player">
      <p className="font-['Pretendard:SemiBold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[18px] w-full whitespace-pre-wrap">박지황</p>
    </div>
  );
}

function GroupWinner() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="group-winner">
      <div className="bg-[#d9d9d9] relative rounded-[16px] shrink-0 size-[32px]" data-name="img-player">
        <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[16px]" />
      </div>
      <GroupPlayer />
    </div>
  );
}

function CardMom() {
  return (
    <div className="bg-[#f2f2f2] content-stretch flex flex-col gap-[12px] items-start overflow-clip p-[12px] relative rounded-[12px] shrink-0 w-[148px]" data-name="card-mom">
      <div className="font-['Paperlogy:7_Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#54545c] text-[15px] whitespace-nowrap">
        <p className="mb-0">25</p>
        <p>03.02</p>
      </div>
      <GroupWinner />
      <p className="absolute bg-clip-text font-['Montserrat:ExtraBold_Italic',sans-serif] italic leading-[normal] left-[41px] text-[46px] top-0" style={{ backgroundImage: "linear-gradient(258.056deg, rgba(158, 247, 255, 0.7) 19.82%, rgba(215, 188, 244, 0) 136.69%)", WebkitTextFillColor: "transparent" }}>
        MOM
      </p>
    </div>
  );
}

function GroupPlayer1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative" data-name="group-player">
      <p className="font-['Pretendard:SemiBold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[18px] w-full whitespace-pre-wrap">박지황</p>
    </div>
  );
}

function GroupWinner1() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="group-winner">
      <div className="bg-[#d9d9d9] relative rounded-[16px] shrink-0 size-[32px]" data-name="img-player">
        <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[16px]" />
      </div>
      <GroupPlayer1 />
    </div>
  );
}

function CardMom1() {
  return (
    <div className="bg-[#f2f2f2] content-stretch flex flex-col gap-[12px] items-start overflow-clip p-[12px] relative rounded-[12px] shrink-0 w-[148px]" data-name="card-mom">
      <div className="font-['Paperlogy:7_Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#54545c] text-[15px] whitespace-nowrap">
        <p className="mb-0">25</p>
        <p>02.23</p>
      </div>
      <GroupWinner1 />
      <p className="absolute bg-clip-text font-['Montserrat:ExtraBold_Italic',sans-serif] italic leading-[normal] left-[41px] text-[46px] top-0" style={{ backgroundImage: "linear-gradient(258.056deg, rgba(158, 247, 255, 0.7) 19.82%, rgba(215, 188, 244, 0) 136.69%)", WebkitTextFillColor: "transparent" }}>
        MOM
      </p>
    </div>
  );
}

function GroupPlayer2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative" data-name="group-player">
      <p className="font-['Pretendard:SemiBold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[18px] w-full whitespace-pre-wrap">박지황</p>
    </div>
  );
}

function GroupWinner2() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="group-winner">
      <div className="bg-[#d9d9d9] relative rounded-[16px] shrink-0 size-[32px]" data-name="img-player">
        <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[16px]" />
      </div>
      <GroupPlayer2 />
    </div>
  );
}

function CardMom2() {
  return (
    <div className="bg-[#f2f2f2] content-stretch flex flex-col gap-[12px] items-start overflow-clip p-[12px] relative rounded-[12px] shrink-0 w-[148px]" data-name="card-mom">
      <div className="font-['Paperlogy:7_Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#54545c] text-[15px] whitespace-nowrap">
        <p className="mb-0">25</p>
        <p>02.23</p>
      </div>
      <GroupWinner2 />
      <p className="absolute bg-clip-text font-['Montserrat:ExtraBold_Italic',sans-serif] italic leading-[normal] left-[41px] text-[46px] top-0" style={{ backgroundImage: "linear-gradient(258.056deg, rgba(158, 247, 255, 0.7) 19.82%, rgba(215, 188, 244, 0) 136.69%)", WebkitTextFillColor: "transparent" }}>
        MOM
      </p>
    </div>
  );
}

function GroupMom() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="group-mom">
      <CardMom />
      <CardMom1 />
      <CardMom2 />
    </div>
  );
}

function ContainerMom() {
  return (
    <div className="content-stretch flex flex-col items-start px-[20px] relative shrink-0" data-name="container-mom">
      <GroupMom />
    </div>
  );
}

function SectionMom() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start justify-center relative shrink-0 w-full" data-name="section-MOM">
      <GroupTitle1 />
      <ContainerMom />
    </div>
  );
}

function GroupTitle2() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="group-title">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[20px] relative size-full">
          <p className="font-['Paperlogy:7_Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[20px]">팀원 순위</p>
        </div>
      </div>
    </div>
  );
}

function Rank() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="rank">
      <p className="font-['Paperlogy:5_Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#82828f] text-[13px]">순위</p>
    </div>
  );
}

function Name() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="name">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center pl-[12px] relative w-full">
          <p className="font-['Paperlogy:5_Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#82828f] text-[13px]">이름</p>
        </div>
      </div>
    </div>
  );
}

function Goal() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 w-[40px]" data-name="goal">
      <p className="font-['Paperlogy:5_Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#82828f] text-[13px]">득점</p>
    </div>
  );
}

function Assist() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 w-[40px]" data-name="assist">
      <p className="font-['Paperlogy:5_Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#82828f] text-[13px]">도움</p>
    </div>
  );
}

function Mom() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 w-[40px]" data-name="mom">
      <p className="font-['Paperlogy:5_Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#82828f] text-[13px]">MOM</p>
    </div>
  );
}

function Playtime() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 w-[40px]" data-name="playtime">
      <p className="font-['Paperlogy:5_Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#82828f] text-[13px]">경기수</p>
    </div>
  );
}

function TableHeader() {
  return (
    <div className="bg-[#fafafa] h-[32px] relative shrink-0 w-full" data-name="table header">
      <div aria-hidden="true" className="absolute border-[#ebebeb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[20px] relative size-full">
          <Rank />
          <Name />
          <Goal />
          <Assist />
          <Mom />
          <Playtime />
        </div>
      </div>
    </div>
  );
}

function Rank1() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 w-[24px]" data-name="rank">
      <p className="font-['Paperlogy:7_Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[13px]">1</p>
    </div>
  );
}

function IconNumber() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="icon-number">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="icon-number">
          <g id="Group">
            <path d={svgPaths.p1b424700} fill="var(--fill-0, #7EBDD9)" id="Vector" />
            <path d={svgPaths.p228f3580} fill="var(--fill-0, #F0F0F0)" id="Vector_2" />
          </g>
          <path d={svgPaths.p2f6a53d0} fill="var(--fill-0, #3CA3CF)" id="Vector_3" />
        </g>
      </svg>
    </div>
  );
}

function Frame() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[8px] relative w-full">
          <IconNumber />
          <p className="font-['Pretendard:SemiBold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[16px]">박지황</p>
        </div>
      </div>
    </div>
  );
}

function DataGoal() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 w-[40px]" data-name="data-goal">
      <p className="font-['Pretendard:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[17px] text-center w-full whitespace-pre-wrap">1</p>
    </div>
  );
}

function DataAssist() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 w-[40px]" data-name="data-assist">
      <p className="font-['Pretendard:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[17px] text-center w-full whitespace-pre-wrap">1</p>
    </div>
  );
}

function DataMom() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 w-[40px]" data-name="data-MOM">
      <p className="font-['Pretendard:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[17px] text-center w-full whitespace-pre-wrap">1</p>
    </div>
  );
}

function DataPlaytime() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 w-[40px]" data-name="data-playtime">
      <p className="font-['Pretendard:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[17px] text-center w-full whitespace-pre-wrap">1</p>
    </div>
  );
}

function TableRow() {
  return (
    <div className="relative shrink-0 w-full" data-name="table-row">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[20px] py-[8px] relative w-full">
          <Rank1 />
          <Frame />
          <DataGoal />
          <DataAssist />
          <DataMom />
          <DataPlaytime />
        </div>
      </div>
    </div>
  );
}

function Divider3() {
  return <div className="bg-[#f2f2f2] h-px shrink-0 w-full" data-name="divider" />;
}

function Rank2() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 w-[24px]" data-name="rank">
      <p className="font-['Paperlogy:7_Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[13px]">2</p>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-[6.25%_4.21%_6.25%_4.17%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.99 21">
        <g id="Group">
          <path d={svgPaths.p38c78700} fill="var(--fill-0, #7EBDD9)" id="Vector" />
          <path d={svgPaths.p3d9e1600} fill="var(--fill-0, #F0F0F0)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute inset-[34.67%_28.08%_27.96%_28.21%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.49 8.97">
        <g id="Group">
          <path d={svgPaths.p192cda80} fill="var(--fill-0, #3CA3CF)" id="Vector" />
          <path d={svgPaths.p367c9400} fill="var(--fill-0, #3CA3CF)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function IconNumber1() {
  return (
    <div className="overflow-clip relative shrink-0 size-[24px]" data-name="icon-number">
      <Group />
      <Group1 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[8px] relative w-full">
          <IconNumber1 />
          <p className="font-['Pretendard:SemiBold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[16px]">김동범</p>
        </div>
      </div>
    </div>
  );
}

function DataGoal1() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 w-[40px]" data-name="data-goal">
      <p className="font-['Pretendard:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[17px] text-center w-full whitespace-pre-wrap">1</p>
    </div>
  );
}

function DataAssist1() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 w-[40px]" data-name="data-assist">
      <p className="font-['Pretendard:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[17px] text-center w-full whitespace-pre-wrap">1</p>
    </div>
  );
}

function DataMom1() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 w-[40px]" data-name="data-MOM">
      <p className="font-['Pretendard:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[17px] text-center w-full whitespace-pre-wrap">1</p>
    </div>
  );
}

function DataPlaytime1() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 w-[40px]" data-name="data-playtime">
      <p className="font-['Pretendard:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[17px] text-center w-full whitespace-pre-wrap">1</p>
    </div>
  );
}

function TableRow1() {
  return (
    <div className="relative shrink-0 w-full" data-name="table-row">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[20px] py-[8px] relative w-full">
          <Rank2 />
          <Frame1 />
          <DataGoal1 />
          <DataAssist1 />
          <DataMom1 />
          <DataPlaytime1 />
        </div>
      </div>
    </div>
  );
}

function Rank3() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 w-[24px]" data-name="rank">
      <p className="font-['Paperlogy:7_Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[13px]">1</p>
    </div>
  );
}

function IconNumber2() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="icon-number">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="icon-number">
          <g id="Group">
            <path d={svgPaths.p1b424700} fill="var(--fill-0, #7EBDD9)" id="Vector" />
            <path d={svgPaths.p228f3580} fill="var(--fill-0, #F0F0F0)" id="Vector_2" />
          </g>
          <path d={svgPaths.p2f6a53d0} fill="var(--fill-0, #3CA3CF)" id="Vector_3" />
        </g>
      </svg>
    </div>
  );
}

function Frame2() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[8px] relative w-full">
          <IconNumber2 />
          <p className="font-['Pretendard:SemiBold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[16px]">박지황</p>
        </div>
      </div>
    </div>
  );
}

function DataGoal2() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 w-[40px]" data-name="data-goal">
      <p className="font-['Pretendard:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[17px] text-center w-full whitespace-pre-wrap">1</p>
    </div>
  );
}

function DataAssist2() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 w-[40px]" data-name="data-assist">
      <p className="font-['Pretendard:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[17px] text-center w-full whitespace-pre-wrap">1</p>
    </div>
  );
}

function DataMom2() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 w-[40px]" data-name="data-MOM">
      <p className="font-['Pretendard:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[17px] text-center w-full whitespace-pre-wrap">1</p>
    </div>
  );
}

function DataPlaytime2() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 w-[40px]" data-name="data-playtime">
      <p className="font-['Pretendard:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[17px] text-center w-full whitespace-pre-wrap">1</p>
    </div>
  );
}

function TableRow2() {
  return (
    <div className="relative shrink-0 w-full" data-name="table-row">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[20px] py-[8px] relative w-full">
          <Rank3 />
          <Frame2 />
          <DataGoal2 />
          <DataAssist2 />
          <DataMom2 />
          <DataPlaytime2 />
        </div>
      </div>
    </div>
  );
}

function Divider4() {
  return <div className="bg-[#f2f2f2] h-px shrink-0 w-full" data-name="divider" />;
}

function Rank4() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 w-[24px]" data-name="rank">
      <p className="font-['Paperlogy:7_Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[13px]">1</p>
    </div>
  );
}

function IconNumber3() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="icon-number">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="icon-number">
          <g id="Group">
            <path d={svgPaths.p1b424700} fill="var(--fill-0, #7EBDD9)" id="Vector" />
            <path d={svgPaths.p228f3580} fill="var(--fill-0, #F0F0F0)" id="Vector_2" />
          </g>
          <path d={svgPaths.p2f6a53d0} fill="var(--fill-0, #3CA3CF)" id="Vector_3" />
        </g>
      </svg>
    </div>
  );
}

function Frame3() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[8px] relative w-full">
          <IconNumber3 />
          <p className="font-['Pretendard:SemiBold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[16px]">박지황</p>
        </div>
      </div>
    </div>
  );
}

function DataGoal3() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 w-[40px]" data-name="data-goal">
      <p className="font-['Pretendard:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[17px] text-center w-full whitespace-pre-wrap">1</p>
    </div>
  );
}

function DataAssist3() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 w-[40px]" data-name="data-assist">
      <p className="font-['Pretendard:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[17px] text-center w-full whitespace-pre-wrap">1</p>
    </div>
  );
}

function DataMom3() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 w-[40px]" data-name="data-MOM">
      <p className="font-['Pretendard:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[17px] text-center w-full whitespace-pre-wrap">1</p>
    </div>
  );
}

function DataPlaytime3() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 w-[40px]" data-name="data-playtime">
      <p className="font-['Pretendard:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[17px] text-center w-full whitespace-pre-wrap">1</p>
    </div>
  );
}

function TableRow3() {
  return (
    <div className="relative shrink-0 w-full" data-name="table-row">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[20px] py-[8px] relative w-full">
          <Rank4 />
          <Frame3 />
          <DataGoal3 />
          <DataAssist3 />
          <DataMom3 />
          <DataPlaytime3 />
        </div>
      </div>
    </div>
  );
}

function Divider5() {
  return <div className="bg-[#f2f2f2] h-px shrink-0 w-full" data-name="divider" />;
}

function Rank5() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 w-[24px]" data-name="rank">
      <p className="font-['Paperlogy:7_Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[13px]">1</p>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute inset-[32.43%_25.92%_24.81%_24.42%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.92 8.98">
        <g id="Group">
          <path d={svgPaths.p192cda80} fill="var(--fill-0, #D3B379)" id="Vector" />
          <path d={svgPaths.pc931600} fill="var(--fill-0, #D3B379)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Layer() {
  return (
    <div className="absolute inset-[6.25%_4.21%_6.25%_4.17%] overflow-clip" data-name="Layer_1">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.99 21">
        <g id="Group">
          <path d={svgPaths.p38c78700} fill="var(--fill-0, #D3B379)" id="Vector" />
          <path d={svgPaths.p3d9e1600} fill="var(--fill-0, #1C457F)" id="Vector_2" />
        </g>
      </svg>
      <Group2 />
    </div>
  );
}

function IconNumber4() {
  return (
    <div className="overflow-clip relative shrink-0 size-[24px]" data-name="icon-number">
      <Layer />
    </div>
  );
}

function Frame4() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[8px] relative w-full">
          <IconNumber4 />
          <p className="font-['Pretendard:SemiBold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[16px]">박지황</p>
        </div>
      </div>
    </div>
  );
}

function DataGoal4() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 w-[40px]" data-name="data-goal">
      <p className="font-['Pretendard:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[17px] text-center w-full whitespace-pre-wrap">1</p>
    </div>
  );
}

function DataAssist4() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 w-[40px]" data-name="data-assist">
      <p className="font-['Pretendard:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[17px] text-center w-full whitespace-pre-wrap">1</p>
    </div>
  );
}

function DataMom4() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 w-[40px]" data-name="data-MOM">
      <p className="font-['Pretendard:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[17px] text-center w-full whitespace-pre-wrap">1</p>
    </div>
  );
}

function DataPlaytime4() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 w-[40px]" data-name="data-playtime">
      <p className="font-['Pretendard:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[17px] text-center w-full whitespace-pre-wrap">1</p>
    </div>
  );
}

function TableRow4() {
  return (
    <div className="relative shrink-0 w-full" data-name="table-row">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[20px] py-[8px] relative w-full">
          <Rank5 />
          <Frame4 />
          <DataGoal4 />
          <DataAssist4 />
          <DataMom4 />
          <DataPlaytime4 />
        </div>
      </div>
    </div>
  );
}

function TableLeaderBoard() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="table-LeaderBoard">
      <TableHeader />
      <TableRow />
      <Divider3 />
      <TableRow1 />
      <TableRow2 />
      <Divider4 />
      <TableRow3 />
      <Divider5 />
      <TableRow4 />
    </div>
  );
}

function SectionRank() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start justify-center relative shrink-0 w-full" data-name="section-rank">
      <GroupTitle2 />
      <TableLeaderBoard />
    </div>
  );
}

export default function Component() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[16px] items-start pb-[24px] pt-[64px] relative size-full" data-name="메인">
      <TitleTeam />
      <SectionMatch />
      <SectionMom />
      <SectionRank />
    </div>
  );
}