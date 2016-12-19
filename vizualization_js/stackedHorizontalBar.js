/**
 * Created by maraujo on 11/24/16.
 */

function stackedHorizontalBar(){
    var currentInstance = this;
    this.data = null;
    this.redData = null;
    this.greenData = null;
    this.tooltip_margin = 10;
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

    this.getFormattedAudience = function(audience){
        if( audience >= 1000){
            return numeral(audience).format('0.00a')
        } else{
            return audience
        }
    }

    this.updateData = function(){
        var data = treemapManager.getAverageSelectedInclination();
        var svg = currentInstance.svg;
        var redBar = currentInstance.svg.selectAll(".redBar").transition().duration(750);
        var greenBar = currentInstance.svg.selectAll(".greenBar").transition().duration(750);



        currentInstance.updateDomain(NODES_SELECTED.selectedFacebookPopulationSum);
        $(".x.axis").remove();
        currentInstance.svg.append("g")
            .attr("class", "x axis")
            .call(currentInstance.xAxis);

        // currentInstance.svg.append("g")
        //     .attr("class", "y axis")
        //     .append("line")
        //     .attr("x1", x(0))
        //     .attr("x2", x(0))
        //     .attr("y2", height);

        currentInstance.greenData[0].audience = data.greenAudience;
        currentInstance.redData[0].audience = data.redAudience;
        currentInstance.greenData[0].score = data.greenInclination;
        currentInstance.redData[0].score = data.redInclination;

        svg.selectAll(".greenBar").data(currentInstance.greenData);

        greenBar.attr("x", function (d) { return  currentInstance.x(Math.min(0, -data.greenAudience ));});
        greenBar.attr("width", function (d) {return Math.abs(currentInstance.x(-data.greenAudience) - currentInstance.x(0))});
        greenBar.attr("style", function(d){return "fill: #1a9850"});

        // redBar.attr("x", function (d) { return currentInstance.x(Math.min(0, -currentInstance.data.redValue ));});
        redBar.attr("width", function (d) { return Math.abs(currentInstance.x(data.redAudience ) - currentInstance.x(0)); });
        redBar.attr("style", function(d){ return "fill: #d73027"});
        svg.selectAll(".redBar").data(currentInstance.redData);

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
      currentInstance.x.domain([-max,max]).nice();
    };

    this.mousemoveTooltip = function(d){
        d3.select("#tooltip-stackedbar").classed("hidden", false);
        var xPosition = d3.event.pageX + currentInstance.tooltip_margin;
        var yPosition = d3.event.pageY + currentInstance.tooltip_margin;
        d3.select("#tooltip-stackedbar")
            .style("left", xPosition + "px")
            .style("top", yPosition + "px");

        d3.select("#tooltip-stackedbar #categoryNameTooltip")
            .text(getTooltipLabel(d.name));

        d3.select("#tooltip-stackedbar #audienceStackedBarTooltip")
            .text(currentInstance.getFormattedAudience(d.audience));

        d3.select("#tooltip-stackedbar #fbTotalAudienceSelectedStackedBar")
            .text(currentInstance.getFormattedAudience(NODES_SELECTED.selectedFacebookPopulationSum));

        d3.select("#tooltip-stackedbar #scoreTooltipStackedBar")
            .text(currentInstance.getFormattedAudience(d.score.toFixed(2)));
        //
        // d3.select("#tooltip-treemap #luxuryAudienceTooltip")
        //     .text(currentInstance.getFormattedAudience(d.luxuryAudience));
        //
        // d3.select("#tooltip-treemap #healthAudienceTooltip")
        //     .text(currentInstance.getFormattedAudience(d.healthAudience));
        //
        // d3.select("#tooltip-treemap #fbPopulationTooltip")
        //     .text(currentInstance.getFormattedAudience(d.fbPopulation));

    };
    this.mouseoutTooltip = function(d){
        d3.select("#tooltip-stackedbar").classed("hidden", true);
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
        var greenData = [{
            name: "Health Audience",
            score: averageInclination.greenInclination,
            audience: averageInclination.greenAudience,
        }];
        var redData = [{
            name: "Luxury Audience",
            score: averageInclination.greenInclination,
            audience: averageInclination.greenAudience,
        }];
        this.data = data;
        this.greenData = greenData;
        this.redData = redData;


        currentInstance.updateDomain(1);
        y.domain(data.map(function (d) {
            return d.name;
        }));

        svg.selectAll(".greenBar")
            .data(greenData)
            .enter().append("rect")
            .attr("class", "greenBar")
            .attr("style", function(d){
                return "fill: " + getGreenOrRedColorByInclination(-d.audience)
            })
            .attr("style", function(d){
                return "fill: " + getGreenOrRedColorByInclination(-d.audience)
            })
            .attr("x", function (d) {
                return x(Math.min(0, -d.audience));
            })
            .attr("y", function (d) {
                return y(d.name);
            })
            .attr("width", function (d) {
                return Math.abs(x(-d.audience) - x(0));
            })
            .attr("height", y.rangeBand())
            .on("mousemove", currentInstance.mousemoveTooltip)
            .on("mouseout", currentInstance.mouseoutTooltip);

        svg.selectAll(".redBar")
            .data(redData)
            .enter().append("rect")
            .attr("class", "redBar")
            .attr("style", function(d){
                return "fill: " + getGreenOrRedColorByInclination(d.audience)
            })
            .attr("x", function (d) {
                return x(Math.min(0, d.audience));
            })
            .attr("y", function (d) {
                return y(d.name);
            })
            .attr("width", function (d) {
                return Math.abs(x(d.audience) - x(0));
            })
            .attr("height", y.rangeBand())
            .on("mousemove", currentInstance.mousemoveTooltip)
            .on("mouseout", currentInstance.mouseoutTooltip);

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