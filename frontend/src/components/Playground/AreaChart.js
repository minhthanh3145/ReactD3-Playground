import React, { Component } from 'react';
import * as d3 from 'd3';

class AreaChart extends Component {

    constructor(props) {
        super(props);
        this.body = React.createRef();
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
        
        this.xScale = d3.scaleLinear()
            .domain([0, this.dataXMax()])
            .range([0, this.width - 2 * this.margin ]);

        this.yScale = d3.scaleLinear()
            .domain([0, this.dataYMax()])
            .range([this.width - 2 * this.margin, 0])
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
        return this.margin;
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
        var xAxis = d3
                    .axisBottom(
                        this.xScale
                    );
        
        svg
            .append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(" 
                        + this.xStart() + ", " + this.xEnd()
                        + ")")
            .call(xAxis);
        
        d3
            .selectAll("g.x g")
            .append("line")
            .classed("grid-line", true)
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", 0)
            .attr("y2", - (this.height - 2 * this.margin));

        svg
        .append("text")
        .attr("x", 0)
        .attr("y", this.height)
        .text("X-axis");
    }

    renderAxisY(svg) {
        var yAxis = d3
                    .axisLeft(
                        this.yScale
                    );

        svg
            .append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + this.margin 
                                +"," + this.margin + ")")
            .call(yAxis);
        
        d3
            .selectAll("g.y g")
            .append("line")
            .attr("x1", (this.height - 2 * this.margin))
            .attr("y1", (this.height - 2 * this.margin))
            .attr("x2", 0)
            .attr("y2", 0);

        svg
        .append("text")
        .attr("x", 0)
        .attr("y", this.height)
        .text("Y-axis");
    }

    renderLines(svg) {
        this._colors = d3.scaleOrdinal(d3.schemeCategory10);
        var lineGenerator = d3
                        .line()
                        .x((d, i) => {
                            console.log("xscale: " + this.xScale(d.x));
                            return this.xScale(d.x);
                        })
                        .y((d, i) => {
                            console.log("yscale: " + this.yScale(d.y));
                            return this.yScale(d.y);
                        });
        
        var thisRef = this;
        svg
            .selectAll("path.line")
            .data(this.data)
            .enter()
            .append("path")
            .style("stroke", function (d, i) { 
                return thisRef._colors(i);
            })
            .attr("class", "line")
            .attr("fill", "none");
        
        svg
            .selectAll("path.line")
            .attr("d", lineGenerator(this.data))
            .attr("stroke-width", 4);

        svg
            .append("text")
            .text("Lines")
            .attr("x", 0)
            .attr("y", this.height);
    }

    renderDots(svg) {
        console.log(svg);
    }

    componentDidMount() {

        var svg1 = d3
                    .select(this.body.current)
                    .append("svg")
                    .attr("class", "svg-x")
                    .attr("height", this.height)
                    .attr("width", this.width);

       this.renderAxisX(svg1);

       var svg2 = d3
                    .select(this.body.current)
                    .append("svg")
                    .attr("class", "svg-y")
                    .attr("height", this.height)
                    .attr("width", this.width);

       this.renderAxisY(svg1);

       var svg3 = 
                svg1
                .append("g")
                .attr("class", "body")
                    .attr("transform", "translate(" 
                        + this.xStart() + "," 
                        + this.yEnd() + ")");

        this.renderLines(svg3);
        this.renderDots(svg3);
    }

    render() {
        return (
            <div ref={this.body}/>
        );
    }
}

export default AreaChart;