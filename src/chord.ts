import * as d3 from "d3";
let svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
const width = 500;
const height = 500;
function domInit() {
  svg =
    svg ||
    d3
      .select("body")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("border", "1px dashed");
}
domInit();
type GText = d3.ChordGroup & {
  angle: number;
  name: string;
};
function drawChord() {
  const continent = ["亚洲", "欧洲", "非洲", "美洲", "大洋洲"];
  const population = [
    [9000, 870, 3000, 1000, 5200],
    [3400, 8000, 2300, 4922, 274],
    [2000, 2000, 7700, 4881, 1050],
    [3000, 8012, 5531, 500, 400],
    [3540, 4310, 1500, 1900, 300],
  ];
  const chord = d3.chord().padAngle(0.03)(population);
  const groups = chord.groups;
  console.log(chord);
  const inRadius = (width / 2) * 0.7;
  const outRadius = inRadius * 1.1;
  const chordG = svg
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);
  const outG = chordG.append("g");
  const outArg = d3.arc().innerRadius(inRadius).outerRadius(outRadius);
  outG
    .selectAll(".outArg")
    .data(groups)
    .enter()
    .append("path")
    .classed("outArg", true)
    .attr("d", (d: any) => {
      return outArg(d);
    })
    .attr("fill", (_, i) => {
      return d3.schemeCategory10[i % 10];
    })
    .attr("stroke", "#333");

  // add text

  outG
    .selectAll(".outText")
    .data(groups)
    .enter()
    .append("text")
    .each((d: GText, i) => {
      d.angle = (d.startAngle + d.endAngle) / 2; // 弧的中心角度
      d.name = continent[i];
    })
    .attr("transform", (d: GText) => {
      let result = "";

      if (d.angle > (Math.PI * 1) / 2 && d.angle < (Math.PI * 3) / 2) {
        result += `rotate(${(d.angle * 180) / Math.PI})`;
        result += `translate(0,${-1 * (outRadius + 20)})`;
        result += `rotate(180)`;
      } else {
        result += `rotate(${(d.angle * 180) / Math.PI})`;
        result += `translate(0,${-1 * (outRadius + 10)})`;
      }
      return result;
    })
    .attr("text-anchor", "middle")
    .text((d: GText) => d.name);

  const ribbon = d3.ribbon().radius(inRadius * 0.98);
  const inG = chordG.append("g");
  inG
    .selectAll(".inRibbon")
    .data(chord)
    .enter()
    .append("path")
    .classed("inRibbon", true)
    .attr("d", (d: any) => {
      return ribbon(d) as any;
    })
    .attr("fill", (_, i) => {
      return d3.schemeCategory10[i % 10];
    })
    .attr("stroke", "#333");

  outG.selectAll(".outArg").on("mouseover", fade(0.2)).on("mouseout", fade(1));

  function fade(n: number) {
    return function (g, i) {
      let color = d3.schemeCategory10[i % 10];
      inG
        .selectAll(".inRibbon")
        .filter((d: any) => {
          // 没有链接到鼠标所在节点的弦
          return d.source.index !== i && d.target.index !== i;
        })
        .transition()
        .style("opacity", n);
      outG
        .selectAll(".outArg")
        .filter((_, outIndex) => {
          return outIndex === i;
        })
        .transition()
        .attr("fill", (_, i) => {
          return n === 1 ? color : d3.color(color).brighter().toString();
        });
    };
  }
}

drawChord();
