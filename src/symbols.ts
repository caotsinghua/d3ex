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

function testSymbol() {
  // console.log(d3.symbolCircle)
  const n = 30;
  const dataset: { size: number; type: any }[] = [];
  d3.range(n).forEach((_, i) => {
    dataset.push({
      size: Math.random() * 30 + 200,
      type: d3.symbols[i % d3.symbols.length],
    });
  });
  const symbol = d3
    .symbol<{ size: number; type: any }>()
    .size((d) => d.size)
    .type((d) => d.type);
  svg
    .selectAll()
    .data(dataset)
    .enter()
    .append("path")
    .attr("d", (d) => symbol(d))
    .attr("transform", (d, i) => {
      const x = 100 + (i % 5) * 20;
      const y = 100 + Math.floor(i / 5) * 20;
      return `translate(${x},${y})`;
    })
    .attr("fill", (_, i) => d3.schemeCategory10[i % 10]);
}
// testSymbol();

function testChord() {
  const chordData = {
    source: {
      startAngle: Math.PI * 0.25,
      endAngle: Math.PI * 0.75,
      radius: 50,
    },
    target: {
      startAngle: Math.PI * 1.25,
      endAngle: Math.PI * 1.75,
      radius: 100,
    },
  };
  const ribbon = d3.ribbon();
  const path = ribbon(chordData);
  // console.log(ribbon(chordData))
  svg
    .append("path")
    .attr("d", path as any)
    .attr("stroke", "#000")
    .attr("fill", "yellow")
    .attr("stroke-width", 2)
    .attr("transform", "translate(100,100)");
}
// testChord();

function testChord2() {
  var matrix = [
    [11975, 5871, 8916, 2868],
    [1951, 10048, 2060, 6171],
    [8010, 16145, 8090, 8045],
    [1013, 990, 940, 6907],
  ];
  const chord = d3.chord().padAngle(Math.PI*0.01);
  const ribbonData = chord(matrix);
  const ribbon = d3.ribbon().radius(180);
  console.log(ribbonData);
  const g = svg.append("g").attr("transform", "translate(200,200)");
  g.selectAll("path")
    .data(ribbonData)
    .enter()
    .append("path")
    .attr("d", (d) => {
      return ribbon(d as any) as any;
    })
    .attr("fill", (_, i) => {
      const rgb = d3.color(d3.schemeCategory10[i % 10]).rgb();
      return d3.rgb(rgb.r, rgb.g, rgb.b, 0.3).toString();
    })
    .attr("stroke", "#000");
}
testChord2();
