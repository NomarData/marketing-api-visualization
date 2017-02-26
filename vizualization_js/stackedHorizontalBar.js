/**
 * Created by maraujo on 11/24/16.
 */

function stackedHorizontalBar(){
    var currentInstance = this;
    this.data = null;
    this.redData = null;
    this.greenData = null;
    this.margin = {
        top: 30,
        right: 0,
        bottom: 10,
        left: 0
    };
    this.selectedBefore = null;
    this.marginAxisX = 50;
    this.marginAxisY = 10;
    this.parentWidth = $("#horizontalStackedBar").parent().width();
    this.width = this.parentWidth - this.margin.left - this.margin.right;
    this.height = 15;
    this.x = d3.scale.linear().range([this.marginAxisX, this.width - this.marginAxisX]);
    this.y = d3.scale.ordinal().rangeRoundBands([0, this.height]);
    this.xAxis = function(self){
        if(currentInstance.width < 500){
            return currentInstance.buildScaleGivenNumberOfTicks(5);
        } else{
            return currentInstance.buildScaleGivenNumberOfTicks(10);
        }

    };

    this.buildScaleGivenNumberOfTicks = function(numberOfTicks){
        return d3.svg.axis().scale(currentInstance.x)
            .ticks(numberOfTicks)
            .orient("top")
            .tickFormat(function(d) {
                return convertIntegerToReadable(d).replace("-","");
            });
    }

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

    this.updateGreenBar = function(data){
        var greenBar = currentInstance.svg.selectAll(".greenBar").transition().duration(750);
        currentInstance.svg.selectAll(".greenBar").data(currentInstance.greenData);
        greenBar.attr("x", function (d) { return  currentInstance.x(Math.min(0, -data.greenAudience ));});
        greenBar.attr("width", function (d) {return Math.abs(currentInstance.x(-data.greenAudience) - currentInstance.x(0))});
        currentInstance.totalGreenBar.transition().duration(750)
            .attr("width", function (d) {return Math.abs(currentInstance.x(-data.total) - currentInstance.x(0))})
            .attr("x", function (d) { return  currentInstance.x(Math.min(0, -data.total ));});

        greenBar.attr("style", function(d){return "fill: #1a9850"});
    }

    this.updateRedBar = function(data){
        var redBar = currentInstance.svg.selectAll(".redBar").transition().duration(750);
        redBar.attr("width", function (d) { return Math.abs(currentInstance.x(data.redAudience ) - currentInstance.x(0)); });
        currentInstance.totalRedBar.transition().duration(750).attr("width", function (d) { return Math.abs(currentInstance.x(data.total) - currentInstance.x(0)); });
        redBar.attr("style", function(d){ return "fill: #d73027"});
        currentInstance.svg.selectAll(".redBar").data(currentInstance.redData);
    }

    this.updateScale = function () {
        currentInstance.updateDomain(dataManager.selectedFbDemographicSum);
        $(".x.axis").remove();
        currentInstance.svg.append("g").attr("class", "x axis horizontalBarAxis").call(currentInstance.xAxis());
    }

    this.updateData = function(){
        var data = dataManager.getAverageSelectedScore();
        currentInstance.greenData[0].audience = data.greenAudience;
        currentInstance.redData[0].audience = data.redAudience;
        currentInstance.greenData[0].score = data.greenScore;
        currentInstance.redData[0].score = -data.redScore;

        currentInstance.updateScale();
        currentInstance.updateGreenBar(data);
        currentInstance.updateRedBar(data);
        currentInstance.updateBlueMarkOnStackedBar(data);
    };

    this.updateBlueMarkOnStackedBar = function(data){
        var x = this.x;
        var newBlueMarkPosition;
        var newBlueMarkWidth;
        var blueFrame =currentInstance.scoreBlueMarkerOnStackedBar;

        if(data.average > 0){
            blueFrame.data(currentInstance.greenData);
            newBlueMarkPosition =  x(-(data.average * data.total));
            newBlueMarkWidth =  Math.abs(newBlueMarkPosition - currentInstance.x(0));
            console.log("Width:" + newBlueMarkWidth)
            currentInstance.scoreBlueMarkerOnStackedBar.transition().duration(750)
                .attr("width", newBlueMarkWidth)
                .attr("transform","translate(" + newBlueMarkPosition + ", 0)");
        }
        else{
            blueFrame.data(currentInstance.redData);
            newBlueMarkPosition = x(0);
            newBlueMarkWidth =  x(Math.abs(data.average) * data.total) - x(0);
            blueFrame.transition().duration(750).attr("transform","translate(" + newBlueMarkPosition + ", 0)").attr("width", newBlueMarkWidth);
        }

    };

    this.updateBlueMarkOnLegend = function(scoreData){
        var maxBlueMarkPosition = currentInstance.currentLegendAxisWidth;
        var currentScore = parseFloat(scoreData.average.toPrecision(2));
        var newBlueMarkPosition = (currentScore * -1 + 1) * maxBlueMarkPosition / 2 + currentInstance.scoreBlueMarkerOnLegendWidth/2;
        currentInstance.scoreBlueMarkerOnLegend.transition().duration(750).attr("transform","translate(" + newBlueMarkPosition + ", 0)");
    };

    this.createAndSetSVG = function(){
        var svg = d3.select("#horizontalStackedBar").append("svg")
            .attr("width", this.width)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + 0 + "," + this.margin.top + ")");
        currentInstance.svg = svg;
        return svg
    };

    this.updateDomain = function(max){
      currentInstance.x.domain([-max,max]).nice();
    };

    this.mousemoveTooltip = function(d){
        d3.select("#tooltip-stackedbar").classed("hidden", false);
        var xPosition = d3.event.pageX + TOOLTIP_DISTANCE_FROM_MOUSE;
        var yPosition = d3.event.pageY + TOOLTIP_DISTANCE_FROM_MOUSE;
        d3.select("#tooltip-stackedbar")
            .style("left", xPosition + "px")
            .style("top", yPosition + "px");

        if(d.name == "Right Audience"){
            d3.select("#tooltip-stackedbar #categoryNameTooltip")
                .text(getTooltipLabel(dataManager.selectedRightTopic));
        } else{
            d3.select("#tooltip-stackedbar #categoryNameTooltip")
                .text(getTooltipLabel(dataManager.selectedLeftTopic));
        }

        d3.select("#tooltip-stackedbar #audienceStackedBarTooltip")
            .text(currentInstance.getFormattedAudience(d.audience));

        d3.select("#tooltip-stackedbar #fbTotalAudienceSelectedStackedBar")
            .text(currentInstance.getFormattedAudience(dataManager.selectedFbDemographicSum));

        d3.select("#tooltip-stackedbar #scoreTooltipStackedBar")
            .text(scoreToPercentage(d.score));
    };
    this.mouseClick = function(d){
        if(d.score > 0){
            var luxurySelectedTopic = $(".btn-luxury.btn-selected");
            if(luxurySelectedTopic.size() == 0 && currentInstance.selectedBefore){
                currentInstance.selectedBefore.click();
            } else {
                currentInstance.selectedBefore = luxurySelectedTopic;
                luxurySelectedTopic.click();
            }
        } else {
            var healthSelectedTopic = $(".btn-health.btn-selected");
            if(healthSelectedTopic.size() == 0 && currentInstance.selectedBefore){
                currentInstance.selectedBefore.click();
            } else {
                currentInstance.selectedBefore = healthSelectedTopic;
                healthSelectedTopic.click();
            }
        }
    };
    this.mouseoutTooltip = function(){
        d3.select("#tooltip-stackedbar").classed("hidden", true);
    };

    this.init = function(){
        var x = this.x;
        var y = this.y;
        var xAxis = this.xAxis();
        var svg = this.createAndSetSVG();
        var data = this.data;
        var height = this.height;

        var averageScore = dataManager.getAverageSelectedScore();
        var data = [{
            name: "Health Score",
            greenValue:  averageScore.greenScore,
            redValue:  averageScore.redScore
        }];
        var greenData = [{
            name: "Left Audience",
            score:  averageScore.greenScore,
            audience:  averageScore.greenAudience,
        }];
        var redData = [{
            name: "Right Audience",
            score:  averageScore.redScore,
            audience:  averageScore.redAudience,
        }];
        this.data = data;
        this.greenData = greenData;
        this.redData = redData;


        currentInstance.updateDomain(1);
        y.domain(data.map(function (d) {
            return d.name;
        }));

        var totalGreenBar = svg.selectAll(".greenBarTotal")
            .data(greenData)
            .enter().append("rect")
            .attr("class", "greenBarTotal")
            .attr("style", function(d){
                return "fill: rgba(255, 255, 255, 0);stroke-width:1;stroke:darkgreen"
            })
            .attr("x", function (d) {
                return x(-1);
            })
            .attr("y", function (d) {
                return y(d.name);
            })
            .attr("width", function (d) {
                // return Math.abs(x(-d.audience) - x(0));
                return x(1) - x(0);
            })
            .attr("height", y.rangeBand());

        svg.selectAll(".greenBar")
            .data(greenData)
            .enter().append("rect")
            .attr("class", "greenBar")
            .attr("style", function(d){
                return "fill: " + getGreenOrRedColorByScore(-d.audience)
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
            .on("mouseout", currentInstance.mouseoutTooltip)
            .on("click", currentInstance.mouseClick);



        var totalRedBar = svg.selectAll(".redBarTotal")
            .data(greenData)
            .enter().append("rect")
            .attr("class", "redBarTotal")
            .attr("style", function(d){
                return "fill: rgba(255, 255, 255, 0);stroke-width:1;stroke:darkred"
            })
            .attr("x", function (d) {
                return x(0);
            })
            .attr("y", function (d) {
                return y(d.name);
            })
            .attr("width", function (d) {
                // return Math.abs(x(-d.audience) - x(0));
                return x(1) - x(0);
            })
            .attr("height", y.rangeBand());

        svg.selectAll(".redBar")
            .data(redData)
            .enter().append("rect")
            .attr("class", "redBar")
            .attr("style", function(d){
                return "fill: " + getGreenOrRedColorByScore(d.audience)
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
            .on("mouseout", currentInstance.mouseoutTooltip)
            .on("click", currentInstance.mouseClick);



        svg.append("g")
            .attr("class", "x axis horizontalBarAxis")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .append("line")
            .attr("x1", x(0))
            .attr("x2", x(0))
            .attr("y2", height);

        var scoreBlueMarkerOnStackedBarWidth = 3;
        var scoreBlueMarkerOnStackedBar = svg.append("rect").attr("class","blueMarkerScore")
            .attr("width", scoreBlueMarkerOnStackedBarWidth)
            .attr("height", height)
            .style("stroke", "blue")
            .style("stroke-width", "2")
            .style("fill", "rgba(48, 79, 254, 0)")
            .attr("transform", "translate(" + (x(0) - scoreBlueMarkerOnStackedBarWidth/2) + ",0)");
        if(data.average > 0){
            scoreBlueMarkerOnStackedBar.data(greenData);
        } else {
            scoreBlueMarkerOnStackedBar.data(redData);
        }
        scoreBlueMarkerOnStackedBar.on("mousemove", currentInstance.mousemoveTooltip)
            .on("mouseout", currentInstance.mouseoutTooltip)
            .on("click", currentInstance.mouseClick);

        currentInstance.totalRedBar = totalRedBar;
        currentInstance.totalGreenBar = totalGreenBar;
        currentInstance.scoreBlueMarkerOnStackedBar = scoreBlueMarkerOnStackedBar;
        currentInstance.scoreBlueMarkerOnStackedBarWidth = scoreBlueMarkerOnStackedBarWidth;
    };
    this.init();
}


function type(d) {
    d.value = +d.value;
    return d;
}