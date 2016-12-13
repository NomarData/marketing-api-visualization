/**
 * Created by maraujo on 11/24/16.
 */

function stackedHorizontalBar(){
    var currentInstance = this;
    this.data = null;
    this.margin = {
        top: 30,
        right: 50,
        bottom: 10,
        left: 50
    };
    this.width = 900 - this.margin.left - this.margin.right;
    this.height = 20;
    this.x = d3.scale.linear().range([0, this.width]);
    this.y = d3.scale.ordinal().rangeRoundBands([0, this.height], .2);
    this.xAxis = d3.svg.axis().scale(this.x).orient("top");
    this.svg = null;

    this.setGreenSize = function(greenValue){
        var greenBar = currentInstance.svg.selectAll(".greenBar").transition().duration(750);
        greenBar.attr("x", function (d) {return currentInstance.x(Math.min(0, greenValue));});
    }

    this.updateData = function(){
        var data = treemapManager.getAverageSelectedInclination();

        var redBar = currentInstance.svg.selectAll(".redBar").transition().duration(750);
        var greenBar = currentInstance.svg.selectAll(".greenBar").transition().duration(750);

        currentInstance.updateDomain(NODES_SELECTED.selectedFacebookPopulationSum);
        $(".x.axis").remove();
        currentInstance.svg.append("g")
            .attr("class", "x axis")
            .call(currentInstance.xAxis);


        currentInstance.data.greenValue = data.greenAudience;
        currentInstance.data.redValue = data.redAudience;
        greenBar.attr("width", function (d) {return Math.abs(currentInstance.x(currentInstance.data.greenValue) - currentInstance.x(0))});
        greenBar.attr("style", function(d){return "fill: #1a9850"});

        redBar.attr("x", function (d) { return currentInstance.x(Math.min(0, -currentInstance.data.redValue ));});
        redBar.attr("width", function (d) { return Math.abs(currentInstance.x(-currentInstance.data.redValue ) - currentInstance.x(0)); })
        redBar.attr("style", function(d){ return "fill: #d73027"});

    };

    this.createAndSetSVG = function(){
        var svg = d3.select("#horizontalStackedBar").append("svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
        currentInstance.svg = svg;
        return svg
    };

    this.updateDomain = function(max){
      currentInstance.x.domain([-max,max])
    };

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


        currentInstance.updateDomain(1);
        y.domain(data.map(function (d) {
            return d.name;
        }));

        svg.selectAll(".greenBar")
            .data(data)
            .enter().append("rect")
            .attr("class", "greenBar")
            .attr("style", function(d){
                return "fill: " + getGreenOrRedColorByInclination(d.greenValue)
            })
            .attr("style", function(d){
                return "fill: " + getGreenOrRedColorByInclination(d.greenValue)
            })
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
            .attr("style", function(d){
                return "fill: " + getGreenOrRedColorByInclination(-d.redValue)
            })
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