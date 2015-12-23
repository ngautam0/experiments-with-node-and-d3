(function (){

d3.json("./jsonfiles/graphDataIndGdp.json", function (data) {


var headers=['year','gdpGrowthAnnual']



    var vis = d3.select("#visualisation"),
    WIDTH = 1800,
    HEIGHT = 500,
    MARGINS = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
    },
  xScale = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]),
    yScale = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]),

    xAxis = d3.svg.axis().scale(xScale).ticks(20).tickFormat(d3.format("d"));

    yAxis = d3.svg.axis().scale(yScale).ticks(15)
    .orient("left") ;

    xScale.domain(d3.extent(data, function(d) { return d.year; }));
    yScale.domain([d3.min(data, function(d) { return d.gdpGrowthAnnual; }), d3.max(data, function(d) { return d.gdpGrowthAnnual; })]);



    vis.append("text")      // text label for the x axis
            .attr("x", WIDTH/2)
            .attr("y",  HEIGHT)
            .style("text-anchor", "middle")
            .text("Y E A R");

    vis.append("svg:g")
    .attr("class","axis")
    .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
    .call(xAxis);


    vis.append("text")      // text label for the y axis
            .attr("transform", "rotate(-90)")
            .attr("x", 0-(HEIGHT/2))
            .attr("y",  MARGINS.left-40 )
            .style("text-anchor", "middle")
            .text("India GDP Growth Annual (%)");





    vis.append("svg:g")
    .attr("class","axis")
    .attr("transform", "translate(" + (MARGINS.left) + ",0)")
    .call(yAxis);

    var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "YEAR : " + d.year + "</span> <br/>" +
    "GDP : " + parseFloat(d.gdpGrowthAnnual).toFixed(2) + " % "+"</span>";
  })

vis.call(tip);

  // console.log(data);
    var lineGen = d3.svg.line()
  .x(function(d) {
    return xScale(d.year);
  })
  .y(function(d) {
    return yScale(d.gdpGrowthAnnual);
  })
  .interpolate('cardinal');


  vis.append('svg:path')
  .attr("id","linegraph")
  .attr('d', lineGen(data))
  .attr('stroke', 'green')
  .attr('stroke-width', 2);

  vis.append("svg:line")
                          .attr("x1", MARGINS.left)
                          .attr("x2", WIDTH)
                          .attr("y1",315 )
                          .attr("y2", 315)
                          .style("stroke", "red");


  vis.selectAll("dot")
          .data(data)
      .enter().append("circle")
          .attr("r", 3)
          // .attr('stroke', 'red')
          .attr('fill', 'green')
          .attr("cx", function(d) { return xScale(d.year); })
          .attr("cy", function(d) { return yScale(d.gdpGrowthAnnual); })
          .on('mouseover', tip.show)
      .on('mouseout', tip.hide);
})




})();
