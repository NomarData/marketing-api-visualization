
function noSelectedCellException(){
    this.name = "noSelectedCellException"
    this.message = "No selected cell in the treemap;"
}

function getRedColor(position){
    function redColorGenerator(){
        return d3.scale.linear().domain([-0,-0.5,-1])
            .interpolate(d3.interpolateRgb)
            .range([d3.rgb("#fceaea"),d3.rgb("#ff2121"), d3.rgb('#890000')]);
    }
    return redColorGenerator()(position)
}

function getGreenColor(position){
    function greenColorGenerator(){
        return d3.scale.linear().domain([0,0.5,1])
            .interpolate(d3.interpolateRgb)
            .range([d3.rgb("#d4f7d5"),d3.rgb("#54ff59"), d3.rgb('#006b03')]);
    }
    return greenColorGenerator()(position)
}

function getRandomGreenOrRedColor(){
    var diceColor = Math.random();
    var diceValue = diceColor > 0.5 ? Math.random() : -Math.random();
    return getGreenOrRedColorByInclination(diceValue)
}
function getGreenOrRedColorByInclination(inclination) {
    return colorFunction(inclination);
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function Treemap(width,height,treemapContainer,colorFunction,treemapData) {
    var currentInstance = this;
    this.w = width;
    this.h = height;
    this.x = d3.scale.linear().range([0, width]);
    this.y = d3.scale.linear().range([0, height]);
    this.color = colorFunction;
    this.root = treemapData;
    this.node = treemapData;
    this.treemapContainer = treemapContainer;
    this.tooltip_margin = 10;

    this.getCategoryName = function () {
      return currentInstance.root.name;
    };

    this.getSelectedCell = function(){
        var cells = this.svg.selectAll("g")[0];
        var cellsData = this.svg.selectAll("g").data();
        for(var indexCell in cellsData){
            var cellData = cellsData[indexCell];
            if(cellData.name == this.node.name){
                return d3.select(cells[indexCell]);
            }
        }
        throw new noSelectedCellException();
    };

    this.deleteOrCreateNewCellsForNewData = function(newData){

        var svg = this.svg;
        var cells = svg.selectAll("g");
        var differenceCells = cells.size() - newData.children.length;

        if(differenceCells < 0){
            for(var i = 0; i < differenceCells; i++){
                cell.append("svg:rect");
                cell.append("svg:text");
            }
        } else if (differenceCells > 0){
            for(var i = 0; i < differenceCells; i++){
                $(cells[0][0]).remove()
            }
        }

    };

    this.updateData = function(rootData){
        var svg = this.svg;
        var currentInstance = this;
        var newNodes = this.treemap.nodes(rootData).filter(function(d) { return !d.children; });

        if(this.isOnRoot()){
            var cells = svg.selectAll("g")
                .data(newNodes)
                .transition()
                .attr("class", "cell")
                .attr("transform", function(d) {
                    return "translate(" + d.x + "," + d.y + ")";
                });

            //Update All Cells
            var rects = cells.select("rect")
                .attr("width", function(d) { return d.dx; })
                .attr("height", function(d) { return d.dy; })
                .style("fill", function(d) {
                    var newColor = getGreenOrRedColorByInclination(d.inclination);
                    return newColor;
                });
            // debugger
            var texts = svg.selectAll("g").select("text")
                .attr("x", function(d) { return d.dx / 2; })
                .attr("y", function(d) { return d.dy / 2; })
                .attr("dy", ".35em")
                .attr("text-anchor", "middle")
                .each(currentInstance.setTextLines)
                .style("opacity", function(d) {
                    // d.w = this.getComputedTextLength();
                    // console.log(d.w + " " + d.dx);
                    // return d.dx > d.w/1.5 ? 1 : 0; //This 1.5 should be specified before
                    return currentInstance.getOpacityBasedOnData(d,this,d.dx,d.dy)
                });
            this.node =  rootData;
            this.root =  rootData;
        } else {
            var cell = this.getSelectedCell();
            cell.data(newNodes)
                .transition()
                .attr("class", "cell")
                .attr("transform", function(d) {
                    return "translate(" + d.x + "," + d.y + ")";
                });
            cell.select("rect")
                .attr("width", function(d) { return d.dx; })
                .attr("height", function(d) { return d.dy; })
                .style("fill", function(d) {
                    var newColor = getGreenOrRedColorByInclination(d.inclination);
                    return newColor;
                });
            cell.select("text")
                .attr("x", function(d) { return d.dx / 2; })
                .attr("y", function(d) { return d.dy / 2; })
                .attr("dy", ".35em")
                .attr("text-anchor", "middle")
                .each(currentInstance.setTextLines)
                .style("opacity", function(d) {
                    return currentInstance.getOpacityBasedOnData(d,this,d.dx,d.dy); //This 1.5 should be specified before
                });
            this.node =  rootData.children[0];
        }

    };

    this.treemap = d3.layout.treemap()
        .round(false)
        .size([this.w, this.h])
        .sticky(false)
        .value(function (d) {
            return d.size;
        });

    this.getOpacityBasedOnData = function(d, textElement,newWidth,newHeight){

        var labelWidth = textElement.getComputedTextLength(); //Guess the width of a text that is still not rendered
        labelWidth = labelWidth * 0.73; //Correction of the above guess given previous experience
        var labelHeight = 34;
        var showDueWidth = labelWidth  > newWidth ? 0 : 1;
        var showDueHeight = labelHeight > newHeight ? 0 : 1;
        if(showDueHeight && showDueWidth){
            return "1"
        } else {
            console.log("LabelWidth:" + labelWidth + " NewWidth:" + newWidth + " " + textElement.textContent);
            return newWidth/labelWidth; //A solution for the problem of small tiles in large tiles,
                                        // the opacity will be dynamic according to the ratio of label and the size of the tile
                                        // if the tile is smaller but the ratio is close to 1, the opacity will be close to 1.
                                        // if the tile is too small, so ratio will be close to 0 as the opacity.
        };
    };
    this.zoom = function(self,focusNode){
        var kx = currentInstance.w / focusNode.dx, ky = currentInstance.h / focusNode.dy;
        currentInstance.x.domain([focusNode.x, focusNode.x + focusNode.dx]);
        currentInstance.y.domain([focusNode.y, focusNode.y + focusNode.dy]);

        var t = currentInstance.svg.selectAll("g.cell").transition()
                .attr("transform", function(d) { return "translate(" + currentInstance.x(d.x) + "," + currentInstance.y(d.y) + ")"; });

            t.select("rect")
                .attr("width", function(d) { return kx * d.dx - 1; })
                .attr("height", function(d) { return ky * d.dy - 1; })

            t.select("text")
                .attr("x", function(d) { return kx * d.dx / 2; })
                .attr("y", function(d) { return ky * d.dy / 2; })
                .each(currentInstance.setTextLines)
                .style("opacity", function(d){
                    if(focusNode == currentInstance.root){
                        var cellNode = currentInstance.getChildFromRootNode(d.name);
                        return currentInstance.getOpacityBasedOnData(d,this,cellNode.dx,cellNode.dy);
                    }
                    return focusNode.name == d.name ? 1 : 0;
                });
        currentInstance.node = focusNode;

        if(d3.event){ //Stop click propagation if was a d3 event.
            d3.event.stopPropagation();
        }
    };
    this.getChildFromRootNode = function(childName){
        for(var childIndex in currentInstance.root.children){
            var child =  currentInstance.root.children[childIndex];
            if (child.name == childName){
                return child;
            }
        }
        throw Error("Child Not Found");
    }
    this.size = function(){
        this.d.size;
    };
    this.count = function () {
        return 1;
    };

    this.isSelected = function (self, d) {
        return self.node.name == d.parent.name;
    }

    this.onClickCell = function(d){
        if(currentInstance.isOnRoot()){
            currentInstance.zoom(currentInstance, d.parent);
            treemapManager.selectTreemapOption(currentInstance, d);
        }else{
            currentInstance.zoom(currentInstance, currentInstance.root);
            treemapManager.unselectTreemapOption(currentInstance);
        }
    };
    this.mousemoveTooltip = function(d){
        d3.select("#tooltip-treemap").classed("hidden", false);
        var xPosition = d3.event.pageX + currentInstance.tooltip_margin;
        var yPosition = d3.event.pageY + currentInstance.tooltip_margin;

        d3.select("#tooltip-treemap")
            .style("left", xPosition + "px")
            .style("top", yPosition + "px");
        d3.select("#tooltip-treemap #category")
            .text(getTooltipLabel(d.name));
        d3.select("#tooltip-treemap #category-type")
            .text(getTooltipLabel(d.parent.parent.name));

        d3.select("#tooltip-treemap #audience")
            .text(currentInstance.getFormattedAudience(d.size));

        d3.select("#tooltip-treemap #scoreTooltip")
            .text(currentInstance.getFormattedAudience(d.inclination.toFixed(2)));

        d3.select("#tooltip-treemap #luxuryAudienceTooltip")
            .text(currentInstance.getFormattedAudience(d.luxuryAudience));

        d3.select("#tooltip-treemap #healthAudienceTooltip")
            .text(currentInstance.getFormattedAudience(d.healthAudience));

        d3.select("#tooltip-treemap #fbPopulationTooltip")
            .text(currentInstance.getFormattedAudience(d.fbPopulation));

    };
    this.mouseoutTooltip = function(d){
        d3.select("#tooltip-treemap").classed("hidden", true);
    };

    this.init = function(){
        var currentInstance = this;
        var color = currentInstance.color;
        var root = currentInstance.root;
        var treemap = currentInstance.treemap;
        var svg = d3.select(this.treemapContainer).append("div")
            .attr("class", "chart")
            .style("width", this.w + "px")
            .style("height", this.h + "px")
            .append("svg:svg")
            .attr("width", this.w)
            .attr("height", this.h)
            .append("svg:g")
            .attr("transform", "translate(.5,.5)");
        this.svg = svg;
        var zoom = currentInstance.zoom;

        var nodes = treemap.nodes(root)
            .filter(function(d) { return !d.children; });
        var cell = svg.selectAll("g")
            .data(nodes)
            .enter().append("svg:g")
            .attr("class", "cell")
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
            .on("click", function(d) {
                currentInstance.onClickCell(d);
            })
            .on("mousemove", currentInstance.mousemoveTooltip)
            .on("mouseout", currentInstance.mouseoutTooltip);

        cell.append("svg:rect")
            .attr("width", function(d) { return d.dx > 1 ? d.dx - 1 : d.dx; })
            .attr("height", function(d) { return d.dy > 1 ? d.dy - 1 : d.dy; })
            .style("fill", function(d) { return getGreenOrRedColorByInclination(d.inclination); })
            .attr("class","treemapRect");

        var text = cell.append("svg:text")
            .attr("x", function(d) { return d.dx / 2; })
            .attr("y", function(d) { return d.dy / 2; })
            .attr("class", "treemapText")
            .attr("text-anchor", "middle")
            .each(currentInstance.setTextLines)
            .style("opacity", function(d) {
                return currentInstance.getOpacityBasedOnData(d,this);
            });

    }

    this.setTextLines = function(d){
        $(this).empty();
        var tspanLine1 = d3.select(this).append("svg:tspan")
            .attr("x", 0)
            .attr("y", 0)
            .attr("dx",  function(d) { return d.dx / 2; })
            .attr("dy", function(d) { return d.dy / 2; })
            .text(d.name);
        var tspanLine2 = d3.select(this).append("svg:tspan")
            .attr("x", 0)
            .attr("y", 0)
            .attr("dx",  function(d) { return d.dx / 2; })
            .attr("dy", function(d) { return d.dy/2 + 15; })
            .text(function(d){
                var audience = parseInt(d.size);
                return currentInstance.getFormattedAudience(audience);

            });
    }

    this.getFormattedAudience = function(audience){
        if( audience >= 1000){
            return numeral(audience).format('0.00a')
        } else{
            return audience
        }
    }

    this.setZoomTextLines = function(textInstance, d){
        //this is treemap
        var treemap = this;
        var rectWidth = treemap.w;
        var kx = rectWidth / d.dx;
        if (typeof(kx)==='undefined') kx = 1;
        if (typeof(ky)==='undefined') ky = 1;


        $(textInstance).empty();
        var tspanLine1 = d3.select(textInstance).append("svg:tspan")
            .attr("x", 0)
            .attr("dx",  function(d) { return kx * d.dx / 2; })
            .attr("dy", "-0.45em")
            .text(d.name);
        var tspanLine2 = d3.select(textInstance).append("svg:tspan")
            .attr("x", 0)
            .attr("dx",  function(d) { return kx * d.dx / 2; })
            .attr("dy", "0.9em")
            .text(convertIntegerToReadable(parseInt(d.size*2000000)));
    };

    this.isOnRoot = function(){
      return this.node.name == this.root.name;
    };

    this.getCells = function(){
        if(this.isOnRoot()){
            return this.root.children;
        } else{
            return [this.node]
        }

    };

    this.selectRootCell = function(){
        try{
            var selectedCell = currentInstance.getSelectedCell();
            currentInstance.onClickCell(selectedCell.datum());
        } catch(Exception) {
            if(Exception instanceof noSelectedCellException){
                return;
            } else {
                throw Exception;
            }
        }
    };

    this.clickGivenValue = function(value){
        if(!value) throw Error("Should have a value");
        var cells = currentInstance.svg.selectAll(".cell");
        var cellWithValue = cells.filter(function(d){
            return d.name == value;
        });
        currentInstance.onClickCell(cellWithValue.datum());
    }

    this.selectCellGivenValue = function(value){
        try{
            var selectedCell = currentInstance.getSelectedCell();
            if(selectedCell.name == selectedCell.datum().name){
                return;
            } else {
                //The selected cell is not what we want, so we go to the root
                currentInstance.onClickCell(selectedCell.datum());
                //Then select what we want
                currentInstance.clickGivenValue(value);
            }
        } catch (Exception){
            if(Exception instanceof noSelectedCellException){
                //If no selected cell, we just select what we want
                currentInstance.clickGivenValue(value);
            } else {
                throw Exception;
            }
        }
    };

    this.activateCellGivenValue = function(value){
        //If value null, the treemap should have no selection.
        //If the treemal has a selected cell, it should go back (by clicking on it again)
        if(value == null){
            currentInstance.selectRootCell();
        } else{
            currentInstance.selectCellGivenValue(value);
        }
    }
}

