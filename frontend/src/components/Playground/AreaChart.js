import React, { Component } from "react";
import * as d3 from "d3";

class AreaChart extends Component {
  constructor(props) {
    super(props);
    this.body = React.createRef();
    this.infoDiv = React.createRef();
    this.width = this.props.width;
    this.height = this.props.height;
    this.margin = 50;
    this.data = this.props.data;
    this.renderAxisX = this.renderAxisX.bind(this);
    this.renderAxisY = this.renderAxisY.bind(this);
    this.xStart = this.xStart.bind(this);
    this.xEnd = this.xEnd.bind(this);
    this.yStart = this.yStart.bind(this);
    this.yEnd = this.yEnd.bind(this);
    this.dataYMax = this.dataYMax.bind(this);
    this.dataXMax = this.dataXMax.bind(this);
    this.renderLines = this.renderLines.bind(this);
    this.renderDots = this.renderDots.bind(this);
    this.renderAreas = this.renderAreas.bind(this);
    this.defineBodyClip = this.defineBodyClip.bind(this);
    this.addVerticalLines = this.addVerticalLines.bind(this);
    this.removeVerticalLines = this.removeVerticalLines.bind(this);
    this.addHorizontalLines = this.addHorizontalLines.bind(this);
    this.removeHorizontalLines = this.removeHorizontalLines.bind(this);
    this._colors = d3.scaleOrdinal(d3.schemeCategory10);
    this.xScale = d3
      .scaleLinear()
      .domain([0, this.dataXMax() + 20])
      .range([0, this.width - 2 * this.margin]);

    this.yScale = d3
      .scaleLinear()
      .domain([0, this.dataYMax() + 20])
      .range([this.width - 2 * this.margin, 0]);
  }

  xStart() {
    return this.margin;
  }

  xEnd() {
    return this.width - this.margin;
  }

  yStart() {
    return this.margin;
  }

  yEnd() {
    return this.width - this.margin;
  }

  dataYMax() {
    return this.data
      .map(a => a.y)
      .reduce((a, b) => {
        return Math.max(a, b);
      });
  }

  dataXMax() {
    return this.data
      .map(a => a.x)
      .reduce((a, b) => {
        return Math.max(a, b);
      });
  }

  renderAxisX(svg) {
    var xAxis = d3.axisBottom(this.xScale);

    svg
      .append("g")
      .attr("class", "x axis")
      .attr(
        "transform",
        "translate(" + this.xStart() + ", " + this.xEnd() + ")"
      )
      .call(xAxis);

    d3.selectAll("g.x g")
      .append("line")
      .classed("grid-line", true)
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", -(this.height - 2 * this.margin));
  }

  renderAxisY(svg) {
    var yAxis = d3.axisLeft(this.yScale);

    svg
      .append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + this.margin + "," + this.margin + ")")
      .call(yAxis);

    d3.selectAll("g.y g")
      .append("line")
      .attr("x1", this.height - 2 * this.margin)
      .attr("y1", this.height - 2 * this.margin)
      .attr("x2", 0)
      .attr("y2", 0);
  }

  renderLines(svg) {
    var lineGenerator = d3
      .line()
      .x((d, i) => {
        return this.xScale(d.x);
      })
      .y((d, i) => {
        return this.yScale(d.y);
      }).curve(d3.curveCardinal);

    var thisRef = this;

    svg
      .selectAll("path.line")
      .data(this.data)
      .enter()
      .append("path")
      .style("stroke", function(d, i) {
        return thisRef._colors(i);
      })
      .attr("class", "line")
      .attr("fill", "none");

    svg
      .selectAll("path.line")
      .transition()
      .attr("d", lineGenerator(this.data))
      .attr("stroke-width", 2);
  }

  renderDots(svg) {
    var thisRef = this;
    var circleGenerator = function() {
      var _r = d => 4.5;
      var _x = d => thisRef.xScale(d.x);
      var _y = d => thisRef.yScale(d.y);

      var circle = d => {
        var cx = _x(d);
        var cy = _y(d);
        var myr = _r(d);

        return (
          "M" +
          cx +
          "," +
          cy +
          " " +
          "m" +
          -myr +
          ", 0 " +
          "a" +
          myr +
          "," +
          myr +
          " 0 1,0 " +
          myr * 2 +
          ",0 " +
          "a" +
          myr +
          "," +
          myr +
          " 0 1,0 " +
          -myr * 2 +
          ",0Z"
        );
      };

      return circle;
    };

    var myCircleGenerator = circleGenerator();

    svg
      .selectAll("path.circle")
      .data(this.data)
      .enter()
      .append("path")
      .attr("fill", function(d, i) {
          return thisRef._colors(i);
      })
      .attr("class", "circle")
      .on("mouseover", function(d, i) {
        thisRef.addVerticalLines(d, i);
        thisRef.addHorizontalLines(d, i);
        thisRef.tooltip.text("data point: " + d.x + ", " + d.y);
      })
      .on("mouseout", function(d, i) {
        thisRef.removeVerticalLines(d, i);
        thisRef.removeHorizontalLines(d, i);
        thisRef.tooltip.text("data point: ");
      });

    svg
      .selectAll("path.circle")
      .attr("d", d => {
        return myCircleGenerator(d);
      });
  }

  renderAreas(svg) {
    var areaGenerator = d3
      .area()
      .x(d => this.xScale(d.x))
      .y0(d => this.yScale(d.y))
      .y1(d => this.yEnd())
      .curve(d3.curveCardinal);

    var thisRef = this;
    svg
      .selectAll("path.area")
      .data(this.data)
      .enter()
      .append("path")
      .style("fill", function(d, i) {
        return thisRef._colors(i);
      })
      .attr("opacity", 0.1)
      .attr("class", "area");

    svg
      .selectAll("path.area")
      .transition()
      .attr("d", areaGenerator(this.data));
  }

  defineBodyClip(svg) {
    var padding = 5;
    svg
      .append("defs")
      .append("clipPath")
      .attr("id", "body-clip")
      .append("rect")
      .attr("x", 0 - padding)
      .attr("y", 0)
      .attr("width", this.width - 2 * this.margin + 2 * padding)
      .attr("height", this.width - 2 * this.margin);
  }

  addVerticalLines(d, i) {
    this.body
      .append("line")
      .attr("id", "vertical-line" + i)
      .attr("class", "vertical-line")
      .style("stroke", "black")
      .attr("x1", this.xScale(d.x))
      .attr("y1", this.yScale(d.y))
      .attr("x2", this.xScale(d.x))
      .attr("y2", this.yScale(0));
  }

  removeVerticalLines(d, i) {
    this.body.select("#vertical-line" + i).remove();
  }

  addHorizontalLines(d, i) {
    this.body
      .append("line")
      .attr("id", "horizontal-line" + i)
      .attr("class", "horizontal-line")
      .style("stroke", "black")
      .attr("x1", this.xScale(d.x))
      .attr("y1", this.yScale(d.y))
      .attr("x2", this.xScale(0))
      .attr("y2", this.yScale(d.y));
  }

  removeHorizontalLines(d, i) {
    this.body.select("#horizontal-line" + i).remove();
  }

  componentDidMount() {
    var svg1 = d3
      .select(this.body.current)
      .append("svg")
      .attr("class", "svg-x")
      .attr("height", this.height)
      .attr("width", this.width);

    this.tooltip = d3
      .select(this.body.current)
      .append("div")
      .text("data point: ")
      .style("opacity", 1)
      .attr("class", "tooltip");

    this.renderAxisX(svg1);
    this.renderAxisY(svg1);
    this.defineBodyClip(svg1);

    this.body = svg1
      .append("g")
      .attr("class", "body")
      .attr(
        "transform",
        "translate(" + this.xStart() + "," + this.yStart() + ")"
      )
      .attr("clip-path", "url(#body-clip)");

    this.renderLines(this.body);
    this.renderAreas(this.body);
    this.renderDots(this.body);

    svg1
      .append("text")
      .attr("x", 0)
      .attr("y", this.height)
      .text("Area chart");
  }

  render() {
    return (
      <div>
        <div ref={this.body} />
        <div ref={this.infoDiv} />
      </div>
    );
  }
}

export default AreaChart;
