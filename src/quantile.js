import * as d3 from "d3";
// console.log(d3)
function test1() {
  // quantize只能定义开始和结束
  const quantize = d3.scaleQuantize().domain([0, 2, 4, 10]).range([1, 100]);
  console.log(quantize(4.99));
  console.log(quantize(5));
  console.log(quantize.invertExtent(1));
//   分成n段，取中间的平均值
  const quantile = d3.scaleQuantile().domain([0, 4,5, 10]).range([1, 10,100]);
  console.log(quantile.quantiles());
  console.log(quantile(2));
  console.log(quantile.invertExtent(100));
}
// test1();


function test2(){
    // 定义域和值域都是离散的
    const ordinal=d3.scaleOrdinal().domain([1,2,3,4,5]).range([19,20,30,40,50])
    console.log(ordinal(1))
    console.log(ordinal(2))
    console.log(ordinal(3))

}
test2()
