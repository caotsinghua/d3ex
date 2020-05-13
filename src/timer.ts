import * as d3 from "d3";
let svg: d3.Selection<SVGSVGElement, any, HTMLElement, any>;
const width = 800;
const height = 500;
const ballsDiv = d3.select("body").append("div").classed("balls", true);
svg = ballsDiv.append("svg").attr("width", width).attr("height", height);
function testInterval() {
  //   let t = d3.timer((elasped) => {
  //     console.log(elasped);
  //     if (elasped > 200) t.stop();
  //   }, 2000);
  let t = d3.interval((nnum) => {
    console.log("iii", nnum);
    if (nnum >= 10000) {
      t.stop();
    }
  }, 1000);
}
// testInterval()

function useTransition() {
  const padding = { left: 100, top: 50, right: 100, bottom: 50 };

  const xWidth = 300;
  const yWidth = 300;
  const xScale = d3.scaleLinear().domain([0, 1]).range([0, xWidth]);
  const yScale = d3.scaleLinear().domain([0, 1]).range([yWidth, 0]);
  const xg = svg.append("g");
  const yg = svg.append("g");
  function drawCircle(data) {
    const circleUpdate = svg.selectAll("circle").data(data);
    const circleEnter = circleUpdate.enter();
    const circleExit = circleUpdate.exit();

    // update
    circleUpdate
      .transition()
      .duration(500)
      .ease(d3.easeBack)
      .attr("cx", (d) => {
        return padding.left + xScale(d[0]);
      })
      .attr("cy", (d) => {
        return height - padding.bottom - yScale(d[1]);
      });

    // enter
    circleEnter
      .append("circle")
      //   before trans
      .attr("cx", (d) => {
        return padding.left;
      })
      .attr("cy", (d) => {
        return height - padding.bottom;
      })
      .attr("r", 0)
      .attr("fill", (_, i) => d3.schemeCategory10[i % 10])
      .transition()
      .duration(500)
      .ease(d3.easeBounce)
      .attr("cx", (d) => {
        return padding.left + xScale(d[0]);
      })
      .attr("cy", (d) => {
        return height - padding.bottom - yScale(d[1]);
      })
      .attr("r", 10);
    // exit
    circleExit.transition().duration(500).attr("fill", "#fff").remove();
  }
  function drawAxis() {
    const xaxis = d3.axisBottom(xScale).ticks(5);
    const yaxis = d3.axisLeft(yScale).ticks(5);
    yScale.range([yWidth, 0]);
    xg.attr(
      "transform",
      `translate(${padding.left},${height - padding.bottom})`
    ).call(xaxis);
    yg.attr(
      "transform",
      `translate(${padding.left},${height - yWidth - padding.bottom})`
    ).call(yaxis);
    yScale.range([0, yWidth]);
  }
  function getData(nums) {
    return d3.range(nums).map(() => [Math.random(), Math.random()]);
  }
  let data = [];
  function generate() {
    data = getData(10);
    drawAxis();
    drawCircle(data);
  }
  generate();
  ballsDiv
    .append("button")
    .text("生成")
    .on("click", function () {
      generate();
    });
  ballsDiv
    .append("button")
    .text("添加")
    .on("click", function () {
      data.push([Math.random(), Math.random()]);
      drawAxis();
      drawCircle(data);
    });
  ballsDiv
    .append("button")
    .text("清除")
    .on("click", function () {
      data = [];
      drawCircle(data);
    });
}

useTransition();

const timeDiv = d3.select("body").append("div").classed("time", true);
const timeSvg = timeDiv
  .append("svg")
  .classed("time", true)
  .attr("width", width)
  .attr("height", height);

function getTimeStr() {
  const time = new Date();
  let HH: string | number = time.getHours();
  let mm: string | number = time.getMinutes();
  let ss: string | number = time.getSeconds();
  HH = HH < 10 ? "0" + HH : HH;
  mm = mm < 10 ? "0" + mm : mm;
  ss = ss < 10 ? "0" + ss : ss;
  return `${HH}:${mm}:${ss}`;
}

function makeTime() {
  const timeText = timeSvg
    .append("text")
    .attr("x", 100)
    .attr("y", 100)
    .attr("class", "time-text")
    .text(getTimeStr());
  function draw() {
    timeText.text(getTimeStr());
  }
  d3.interval(draw, 1000);
}
makeTime();

const ballDiv2 = d3.select("body").append("div").attr("class", "ball-2");

const svgBall2 = ballDiv2
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .style("border", "1px solid");

function makeBalls() {
  let t0 = Date.now();
  let t1 = Date.now();
  let dt = t1 - t0;
  let t = d3.timer(updateBall); // 相当于raf
  let vx = 50;
  let vy = 500;
  let x = 10;
  let y = 10;
  function updateBall() {
    t1 = Date.now();
    dt = (t1 - t0) * 0.001; // 与之前间隔 s
    // calculate next ball position
    x = x + dt * vx;
    y = y + dt * vy;
    if (x > width - 10) {
      x = width - 10;
      vx = -Math.floor(vx / 2);
    }
    if (x < 10) {
      x = 10;
      vx = -Math.floor(vx / 2);
    }
    if (y < 10) {
      y = 10;
      vy = -Math.floor(vy / 2);
    }
    if (y > height - 10) {
      vy = height - 10;
      vy = -Math.floor(vy / 2);
    }
    // console.log(vx, vy, x, y);
    if (vx === 0 || vy === 0) {
      t.stop();
    }

    // update graphic
    let ball: d3.Selection<
      SVGCircleElement,
      unknown,
      HTMLElement,
      any
    > = svgBall2.select("circle").empty()
      ? svgBall2.append("circle")
      : svgBall2.select("circle");
    ball.attr("cx", x).attr("cy", y).attr("r", 10);
    t0 = t1;
  }
}
makeBalls();
