import React, { Component } from "react";
import * as d3 from "d3";

class PackedCircleChart extends Component {
  constructor(props) {
    super(props);
    this.body = React.createRef();
    this.width = props.width;
    this.height = props.height;
    this.renderHeatMap = this.renderHeatMap.bind(this);
    this.pack = this.pack.bind(this);
    this.zoom = this.zoom.bind(this);
    this.zoomTo = this.zoomTo.bind(this);
    this._colors = d3.scaleOrdinal(d3.schemeCategory10);
  }

  zoom(d) {
    this.focus = d;

    this.svg.transition()
        .duration(d3.event.altKey ? 7500 : 750)
        .attrTween("zoom", d => {
          const i = d3.interpolateZoom(this.view,
             [this.focus.x, this.focus.y, this.focus.r * 2]);
          return t => this.zoomTo(i(t));
        });
  }

  zoomTo(v) {
    const k = this.width / v[2];

    this.view = v;

    // abel.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
    this.node.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
    this.node.attr("r", d => d.r * k);
  }

  pack(data) {
    let packLayout = d3
      .pack()
      .size([this.width, this.height])
      .padding(10);

    let root = d3
      .hierarchy(data)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value);

    return packLayout(root);
  }

  renderHeatMap(data) {
    // Prepare the svg viewport
    this.svg = d3
      .select(this.body.current)
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("viewBox", `-${this.width / 2} -${this.height / 2} ${this.width} ${this.height}`)
      .style("display", "block")
      .style("margin", "0 -14px")
      .style("width", "calc(100% + 28px)")
      .style("height", "auto")
      .style("cursor", "pointer")
      .on("click", () => this.zoom(root));

    // Create a packed layout
    let root = this.pack(data);
    this.focus = root;

    // Attach circles to the data
    this.node = this.svg
      .append("g")
      .selectAll("circle")
      .data(root.descendants().slice(1))
      .enter()
      .append("circle")
      .attr("fill", (d, i) => this._colors(d.depth))
      .style("stroke-width", 2)
      .on("mouseover", function(d) {
        d3.select(this).attr("stroke", "#000");
      })
      .on("mouseout", function(d) {
        d3.select(this).attr("stroke", null);
      })
      .on(
        "click",
        d => this.focus !== d && (this.zoom(d), d3.event.stopPropagation())
      );

    this.zoomTo([root.x, root.y, root.r * 2]);

    // Append labels to the circles
    let thisRef = this;
    this.svg.selectAll("g circle").each(function(d, i) {
      let thisD = d3.select(this).datum();
      thisRef.svg
        .append("g")
        .append("text")
        .text(thisD.data.name)
        .attr("x", thisD.x)
        .attr("y", thisD.y)
        .attr("text-anchor", "middle")
        .attr("fill-opacity", thisD.parent === root ? 1 : 0);
    });
  }

  componentDidMount() {
    d3.json(
      "https://raw.githubusercontent.com/d3/d3-hierarchy/v1.1.8/test/data/flare.json"
    ).then(data => {
      this.renderHeatMap(data);
    });
  }

  render() {
    return (
      <div>
        <div ref={this.body} />
      </div>
    );
  }
}

export default PackedCircleChart;
