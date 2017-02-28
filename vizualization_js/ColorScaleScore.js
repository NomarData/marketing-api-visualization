/**
 * Created by maraujo on 2/26/17.
 */
function ColorScaleScore(){
    var currentInstance = this;
    this.isStatic = false;
    this.margin = 30;
    this.divWidth = null;
    this.width = null
    this.height = 10;
    this.numberOfSteps = 10;
    this.minValue = -1;
    this.maxValue = 1;
    this.blueMarkWidth = 2;
    this.translateXPositionAxis = 0;
    this.paddingAxis = 12;
    this.legendSvg = null;
    this.xScale = null;
    this.scoreBlueMarkerOnStackedBarWidth = 3;

    this.updateRectSize = function (data) {
        var newWidth = Math.abs(barsLeftRightScore.x(-data.total) - barsLeftRightScore.x(0)) * 2;
        var newXpos = barsLeftRightScore.x(Math.min(0, -data.total ));
        var legendRect = currentInstance.legendSvg.selectAll("#legendRect").transition().duration(750);
        legendRect.attr("width", newWidth);
        legendRect.attr("x", newXpos);
    };

    this.updateBlueMark = function (data) {
        var newXpos = barsLeftRightScore.x((-data.average * data.total)) - barsLeftRightScore.x(0);
        var legendRect = currentInstance.legendSvg.selectAll("#blueMarkScore").transition().duration(750);
        legendRect.attr("x", newXpos);
    }

    this.updateData = function(){
            if(!currentInstance.isStatic){
                var data = dataManager.getAverageSelectedScore();
                currentInstance.updateRectSize(data);
                currentInstance.updateBlueMark(data);
            }
        };
    this.generateScale = function () {
        currentInstance.xScale = d3.scale.linear().range([currentInstance.translateXPositionAxis + currentInstance.paddingAxis, currentInstance.width - currentInstance.paddingAxis]).domain([0, 100000000]);
        return currentInstance.xScale;
    };
    this.generateAxis = function (scale) {
        return  d3.svg.axis().scale(scale).ticks(0);
    };
    this.buildGradientColors = function(){
        var legend = currentInstance.legendSvg.append("defs").append("svg:linearGradient").attr("id", "gradient").attr("x1", "0%").attr("y1", "100%").attr("x2", "100%").attr("y2", "100%").attr("spreadMethod", "pad");
        //Appending colors
        var data = [];
        var step = (currentInstance.maxValue - currentInstance.minValue)/currentInstance.numberOfSteps;
        var stepPercentage = 100/currentInstance.numberOfSteps;
        var percentage = 0;
        for (var i=currentInstance.maxValue;i > currentInstance.minValue;i=i-step){
            data.push([i,percentage]);
            percentage += stepPercentage
        }
        for(var index in data){
            let breakpoint = data[index][0];
            let percentage = data[index][1];
            legend.append("stop").attr("offset", + percentage + "%").attr("stop-color", colorFunction(breakpoint)).attr("stop-opacity", 1);
        }
        //Apply gradient to rect
        currentInstance.legendSvg.append("rect").attr("id", "legendRect").attr("width", "100%").attr("height", currentInstance.height).style("fill", "url(#gradient)").attr("transform", "translate(0,0)");
    }

    this.buildDynamicColorScale = function(){
        currentInstance.isStatic = false;
        currentInstance.divWidth = $("#treemapLegend").width();
        currentInstance.width = barsLeftRightScore.width;

        currentInstance.legendSvg = d3.select("#treemapLegend").append("svg")
            .attr("width", currentInstance.width)
            .attr("height", currentInstance.height)
            .append("g");
        // .attr("transform", "translate(" + 0 + "," + 30 + ")");
        currentInstance.buildGradientColors();
        var axis = currentInstance.generateAxis(barsLeftRightScore.x);
        currentInstance.legendSvg.append("g").attr("class", "legendAxis").attr("transform", "translate(" + (currentInstance.paddingAxis/2) + ",-3)").call(axis);
        currentInstance.currentLegendAxisWidth = currentInstance.width;
        currentInstance.createBlueMarkScore();
    }

    this.buildStaticColorScale = function(){
        //Old Scale
        currentInstance.isStatic = true;
        var margin = 30;
        var divWidth = $("#treemapLegend").width();
        var w = divWidth - margin;
        currentInstance.height = 20;
        var translateXPositionAxis = 20;
        var paddingAxis = 15;
        // debugger
        currentInstance.legendSvg = d3.select("#treemapLegend").append("svg")
            .attr("width", divWidth)
            .attr("height", currentInstance.height)
            .append("g");

        currentInstance.buildGradientColors();
        var axisScale = d3.scale.linear().range([translateXPositionAxis+paddingAxis, w-paddingAxis]).domain([1, -1]);
        var axis = d3.svg.axis().scale(axisScale).ticks(currentInstance.numberOfSteps);
        currentInstance.legendSvg.append("g").attr("class", "legendStaticAxis legendAxis").attr("transform", "translate(" + (paddingAxis/2) + ",-3)").call(axis);
        currentInstance.currentLegendAxisWidth = w ;
    };

    this.createBlueMarkScore = function () {

        var scoreBlueMarkerOnColorScale = currentInstance.legendSvg.append("rect").attr("id","blueMarkScore")
            .attr("width", currentInstance.blueMarkWidth)
            .attr("height", currentInstance.height)
            .style("fill", "blue")
            .attr("transform", "translate("+ barsLeftRightScore.x(0) + ",0)");
    };

    this.init = function(){
        currentInstance.buildDynamicColorScale();
    };

    this.init();


}