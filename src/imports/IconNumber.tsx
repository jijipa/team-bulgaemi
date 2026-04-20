import svgPaths from "./svg-fww01q02n7";

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

export default function IconNumber() {
  return (
    <div className="relative size-full" data-name="icon-number">
      <Group />
      <p className="absolute font-['Anton:Regular',sans-serif] inset-[21.83%_30.79%_15.67%_31.71%] leading-[15px] not-italic text-[#3ca3cf] text-[10.5px] text-center tracking-[0.105px]">19</p>
    </div>
  );
}