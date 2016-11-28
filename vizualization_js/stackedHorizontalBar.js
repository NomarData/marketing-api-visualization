/**
 * Created by maraujo on 11/24/16.
 */

function stackedHorizontalBar(){
    this.data = [{
        name: "Health Inclination",
        value: 1,
        value2: 5
    }];
    this.margin = {
        top: 30,
        right: 10,
        bottom: 10,
        left: 10
    };
    this.width = 500 - this.margin.left - this.margin.right;
    this.height = 20;
    this.x = d3.scale.linear().range([0, this.width]);
    this.y = d3.scale.ordinal().rangeRoundBands([0, this.height], .2);
    this.xAxis = d3.svg.axis().scale(this.x).orient("top");
    this.svg = null;

    this.updateData = function(data){
        var currentStackbar = this;
        this.data.value = 10 * Math.random();
        this.data.value2 = 10 * Math.random();

        var bars = this.svg.selectAll("rect").transition()
            .duration(1000);

        var redBar = this.svg.selectAll(".bar2").transition().duration(750);
        var greenBar = this.svg.selectAll(".bar").transition().duration(750);

        var newRedBarValue = -Math.random()*10;
        var newGreenBarValue = Math.random()*10;

        redBar.attr("x", function (d) {
                return currentStackbar.x(Math.min(0, newRedBarValue));
            }).attr("width", function (d) {
            return Math.abs(currentStackbar.x(newRedBarValue) - currentStackbar.x(0));
        })

        greenBar.attr("x", function (d) {
            return currentStackbar.x(Math.min(0, newGreenBarValue));
        }).attr("width", function (d) {
            return Math.abs(currentStackbar.x(newGreenBarValue) - currentStackbar.x(0));
        })

    };

    this.createAndSetSVG = function(){
        var svg = d3.select("#horizontalStackedBar").append("svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
        this.svg = svg;
        return svg
    }

    this.init = function(){
        var x = this.x;
        var y = this.y;
        var xAxis = this.xAxis;
        var svg = this.createAndSetSVG();
        var data = this.data;
        var height = this.height;


        x.domain([-10,10]);
        y.domain(data.map(function (d) {
            return d.name;
        }));

        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function (d) {
                return x(Math.min(0, d.value));
            })
            .attr("y", function (d) {
                return y(d.name);
            })
            .attr("width", function (d) {
                return Math.abs(x(d.value) - x(0));
            })
            .attr("height", y.rangeBand());

        svg.selectAll(".bar2")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar2")
            .attr("x", function (d) {
                return x(Math.min(0, -d.value2));
            })
            .attr("y", function (d) {
                return y(d.name);
            })
            .attr("width", function (d) {
                return Math.abs(x(-d.value2) - x(0));
            })
            .attr("height", y.rangeBand());

        svg.append("g")
            .attr("class", "x axis")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .append("line")
            .attr("x1", x(0))
            .attr("x2", x(0))
            .attr("y2", height);

    }

}


function type(d) {
    d.value = +d.value;
    return d;
}