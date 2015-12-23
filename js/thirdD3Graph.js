(function InitChart() {

var jsonFiles=["./jsonfiles/graphDataForAsia.json",
              "./jsonfiles/graphDataForAfrica.json",
              "./jsonfiles/graphDataForAmerica.json",
              "./jsonfiles/graphDataForOcenia.json",
              "./jsonfiles/graphDataForEurope.json"
            ];

var colors=['#4747d1', '#e600e5', '#800000', '#00e64c', 'black'];
var continent=["Asia","Africa","America","Oceania","Europe"];

var colorsLegend = d3.scale.ordinal()
    .domain(continent)
    .range(['#4747d1', '#e600e5', '#800000', '#00e64c', 'black']);

var years=[];
var gdpPerCapita=[];
var minX,maxX,minY,maxY;

    d3.json(jsonFiles[jsonFiles.length-1], function (data){

    var vis = d3.select("#visualisation"),
        WIDTH = 2200,
        HEIGHT = 480,
        MARGINS = {
            top: 20,
            right: 20,
            bottom: 20,
            left: 80
        },
        xScale = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]),
          yScale = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]);

        xScale.domain(d3.extent(data, function(d) { return d.year; }));
        yScale.domain([0, d3.max(data, function(d) { return d.gdpPerCapita; })]);

        xAxis = d3.svg.axis()
        .scale(xScale)
        .ticks(38)
        .tickFormat(d3.format("d"))

        yAxis = d3.svg.axis()
        .scale(yScale)
        .ticks(20)
        .orient("left")
        .tickFormat(d3.format(".3s"));

    vis.append("svg:g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
        .call(xAxis);


    vis.append("svg:g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + (MARGINS.left) + ",0)")
        .call(yAxis);

        vis.append("text")      // text label for the y axis
                .attr("transform", "rotate(-90)")
                .attr("x", 0-(HEIGHT/2))
                .attr("y",  MARGINS.left-70 )
                .style("text-anchor", "middle")
                .text("AGGREGATED GDP per CAPITA");
                vis.append("text")      // text label for the x axis
                        .attr("x", WIDTH/2)
                        .attr("y",  HEIGHT+MARGINS.bottom)
                        .style("text-anchor", "middle")
                        .text("Y E A R");

    var lineGen = d3.svg.line()
        .x(function(d) {
          // if(d.gdpPerCapita!=0)
            return xScale(d.year);
        })
        .y(function(d) {
          // if(d.gdpPerCapita!=0)
            return yScale(d.gdpPerCapita);
        })
        .interpolate("cardinal");


        var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        return "YEAR : " + d.year + "</span> <br/>" +
        "Agg Gdp per Cap : " + parseFloat(d.gdpPerCapita).toFixed(3) + "</span>";
      })

    vis.call(tip);

for (var i = 0; i < jsonFiles.length; i++) {
  drawPathForJson(jsonFiles[i],colors[i],continent[i]);
}
function drawPathForJson(fileName,color,continent){
  var lineColor=color;
  d3.json(fileName, function (data) {
    vis.append('svg:path')
        .attr('d', lineGen(data))
        .attr('stroke', lineColor)
        .attr('stroke-width', 2)
        .attr('fill', 'none');

    vis.selectAll("dot")
            .data(data)
        .enter().append("circle")
            .attr("r", 2)
            // .attr('stroke', 'red')
            .attr('fill', lineColor)
            .attr("cx", function(d) { return xScale(d.year); })
            .attr("cy", function(d) { return yScale(d.gdpPerCapita); })
            .on('mouseover', tip.show)
        .on('mouseout', tip.hide);
})
}

var legend = vis.selectAll(".legend")
    .data(continent.slice())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 30 + ")"; })

    legend.append("rect")
        .attr("x", MARGINS.left+100)
        .attr("width", 50)
        .attr("height", 15)
        .style("fill", colorsLegend);

    legend.append("text")
          .attr("x", MARGINS.left+80)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "end")
          .text(function(d) { return d;  });
})
})();
