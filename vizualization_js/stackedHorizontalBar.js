/**
 * Created by maraujo on 11/24/16.
 */

function stackedHorizontalBar(){
    this.data = null;
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
        var redBar = currentStackbar.svg.selectAll(".redBar").transition().duration(750);
        var greenBar = currentStackbar.svg.selectAll(".greenBar").transition().duration(750);

        currentStackbar.data.greenValue = data.greenInclination;
        currentStackbar.data.redValue = data.redInclination;

        greenBar.attr("x", function (d) {return currentStackbar.x(Math.min(0, currentStackbar.data.greenValue));});
        greenBar.attr("width", function (d) {return Math.abs(currentStackbar.x(currentStackbar.data.greenValue) - currentStackbar.x(0))});

        redBar.attr("x", function (d) { return currentStackbar.x(Math.min(0, -currentStackbar.data.redValue ));});
        redBar.attr("width", function (d) { return Math.abs(currentStackbar.x(-currentStackbar.data.redValue ) - currentStackbar.x(0)); })

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

        var averageInclination = treemapManager.getAverageSelectedInclination();
        var data = [{
            name: "Health Inclination",
            greenValue: averageInclination.greenInclination,
            redValue: averageInclination.redInclination
        }];
        this.data = data;


        x.domain([-1,1]);
        y.domain(data.map(function (d) {
            return d.name;
        }));

        svg.selectAll(".greenBar")
            .data(data)
            .enter().append("rect")
            .attr("class", "greenBar")
            .attr("x", function (d) {
                return x(Math.min(0, d.greenValue));
            })
            .attr("y", function (d) {
                return y(d.name);
            })
            .attr("width", function (d) {
                return Math.abs(x(d.greenValue) - x(0));
            })
            .attr("height", y.rangeBand());

        svg.selectAll(".redBar")
            .data(data)
            .enter().append("rect")
            .attr("class", "redBar")
            .attr("x", function (d) {
                return x(Math.min(0, -d.redValue));
            })
            .attr("y", function (d) {
                return y(d.name);
            })
            .attr("width", function (d) {
                return Math.abs(x(-d.redValue) - x(0));
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