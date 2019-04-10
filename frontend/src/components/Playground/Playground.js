import React, { Component } from "react";
import * as d3 from "d3";
import styled from 'styled-components';
import AreaChart from './AreaChart';

const width = 400,
  height = 400,
  endAngle = 2 * Math.PI,
  colors = d3.scaleOrdinal(d3.schemeCategory10);

const rawData = [
  { startAngle: 0, endAngle: 0.1 * endAngle },
  { startAngle: 0.1 * endAngle, endAngle: 0.2 * endAngle },
  { startAngle: 0.2 * endAngle, endAngle: 0.4 * endAngle },
  { startAngle: 0.4 * endAngle, endAngle: 0.6 * endAngle },
  { startAngle: 0.6 * endAngle, endAngle: 0.7 * endAngle },
  { startAngle: 0.7 * endAngle, endAngle: 0.9 * endAngle },
  { startAngle: 0.9 * endAngle, endAngle: endAngle }
];

const dataForAreaChart = [
  {x: 0, y: 80},
  {x: 100, y: 100},
  {x: 200, y: 30},
  {x: 300, y: 50},
  {x: 400, y: 40}, 
  {x: 500, y: 80},
  {x: 600, y: 140},
];

const dataForAreaChart2 = [
  [0, 80],
  [100, 100],
  [200, 30],
  [300, 50],
  [400, 40],
  [500, 80]
];

const dataForAreaChart1 = [
  10, 15, 20, 25, 30, 40, 45, 50,
]

const StyledDiv = styled.div`
  display: inline;
  text-align: center;
`;

class Playground extends Component {
  constructor(props) {
    super(props);
    this.arcTransBody = React.createRef();
    this.mouseAnimation = React.createRef();
    this.renderArcTransition = this.renderArcTransition.bind(this);
    this.registerMouseAnimation = this.registerMouseAnimation.bind(this);
    this.state = {
      data: rawData
    };
  }

  renderArcTransition() {
    const { data } = this.state;
    
    var svg = d3
      .select(this.arcTransBody.current)
      .append("svg")
      .attr("class", "pie")
      .attr("height", height)
      .attr("width", width);

    svg.append("text")
        .attr("x", 10)
        .attr("y", height)
        .text("Arc transition");
    
    var arc = d3
      .arc()
      .outerRadius(100)
      .innerRadius(50);

    svg.select("g").remove();

    svg
      .append("g")
      .attr("transform", "translate(200,200)")
      .selectAll("path.arc")
      .data(data)
        .enter()
        .append("path")
        .attr("class", "arc")
        .attr("fill", function(d, i) {
            return colors(i);
        })
        .transition()
        .duration(1000)
        .attrTween("d", function(d) {
            var start = { startAngle: 0, endAngle: 0 }; 
            var interpolate = d3.interpolate(start, d); 
            return function(t) {
              return arc(interpolate(t));
            };
        });
  }

  registerMouseAnimation() {

    var svg = d3
      .select(this.mouseAnimation.current)
      .append("svg")
      .attr("class", "mouse")
      .attr("width", width)
      .attr("height", height);
    
    var positionLabel = svg
      .append("text")
      .attr("x", 10)
      .attr("y", 30);

    svg.append("text")
      .attr("x", 10)
      .attr("y", height)
      .text("Draw circle on mouse-click");

    svg.on("mousemove", e => {
      var position = d3.mouse(svg.node());
      positionLabel.text(position);
    });

    svg.on("click", function () {
      for (var i = 1; i < 5; ++i) {
        var position = d3.mouse(svg.node());
        svg.append("circle")
                .attr("cx", position[0])
                .attr("cy", position[1])
                .attr("r", 0)
                .style("stroke-width", 5 / (i))
                .attr("fill", function () {
                  var t = Math.random();
                  return colors(t);
                })
                .transition()
                    .duration(1000)
                    .ease(d3.easeBounce)
                .attr("r", 100)
                .style("stroke-opacity", 0)
                .on("end", function () {
                    d3.select(this)
                      .transition()
                      .duration(500)
                      .attr("r", 0)
                      .remove();
                });
      }
    });
  }

  componentDidMount() {
    this.renderArcTransition();
    this.registerMouseAnimation();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div>
        <StyledDiv ref={this.arcTransBody} />
        <StyledDiv ref={this.mouseAnimation} />
        <AreaChart 
          data={dataForAreaChart}
          width={800}
          height={800}
        />
      </div>
    );
  }
}

export default Playground;

