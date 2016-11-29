
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
function getGreenOrRedColorByInclination(inclination){
    if (inclination > 0){
        return getGreenColor(inclination);
    } else if(inclination < 0){
        return getRedColor(inclination);
    } else {
        return "#afafaf"
    }
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
    this.w = width;
    this.h = height;
    this.x = d3.scale.linear().range([0, width]);
    this.y = d3.scale.linear().range([0, height]);
    this.color = colorFunction;
    this.root = treemapData;
    this.node = treemapData;
    this.treemapContainer = treemapContainer;

    this.updateData = function(rootData){
        var svg = this.svg;
        var currentInstance = this;
        var newNodes = this.treemap.nodes(rootData).filter(function(d) { return !d.children; });
        // console.log("cell:" + svg.selectAll(".cell").data()[0].size + " " + svg.selectAll(".cell").data()[1].size )
        // console.log("instanceData :" + genderTreemap.node.children[0].value + " " + genderTreemap.node.children[1].value )
        // console.log("newInstanceData :" + rootData.children[0].children[0].size + " " + rootData.children[1].children[0].size)


        var cells = svg.selectAll("g")
            .data(newNodes)
            .transition()
            .attr("class", "cell")
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

        var rects = cells.select("rect")
                .attr("width", function(d) { return d.dx; })
                .attr("height", function(d) { return d.dy; })
                .style("fill", function(d) {
                    var newColor = getGreenOrRedColorByInclination(d.inclination);
                    console.log(d.inclination +" : " + newColor);
                    return newColor;
                });
        var texts = cells.select("text")
            .attr("x", function(d) { return d.dx / 2; })
            .attr("y", function(d) { return d.dy / 2; })
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .each(currentInstance.setTextLines)
            .style("opacity", function(d) {
                d.w = this.getComputedTextLength();
                // console.log(d.w + " " + d.dx);
                return d.dx > d.w/1.5 ? 1 : 0; //This 1.5 should be specified before
            });

        this.root =  rootData;
        // debugger
    };

    this.treemap = d3.layout.treemap()
        .round(false)
        .size([this.w, this.h])
        .sticky(false)
        .value(function (d) {
            return d.size;
        });


    this.zoom = function(self,d){
        var kx = self.w / d.dx, ky = self.h / d.dy;
        self.x.domain([d.x, d.x + d.dx]);
        self.y.domain([d.y, d.y + d.dy]);

        var t = self.svg.selectAll("g.cell").transition()
                .duration(d3.event.altKey ? 7500 : 750)
                .attr("transform", function(d) { return "translate(" + self.x(d.x) + "," + self.y(d.y) + ")"; });

            t.select("rect")
                .attr("width", function(d) { return kx * d.dx - 1; })
                .attr("height", function(d) { return ky * d.dy - 1; })

            t.select("text")
                .attr("x", function(d) { return kx * d.dx / 2; })
                .attr("y", function(d) { return ky * d.dy / 2; })
                .each(self.setTextLines)
                .style("opacity", function(d) { return kx * d.dx > d.w ? 1 : 0; });
        self.node = d;
        d3.event.stopPropagation();

    }
    this.size = function(){
        this.d.size;
    }
    this.count = function () {
        return 1;
    }

    this.isSelected = function (self, d) {
        return self.node.name == d.parent.name;
    }

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
                if(currentInstance.isSelected(currentInstance, d)){
                    treemapManager.unselectTreemapOption(currentInstance);
                    zoom(currentInstance, currentInstance.root);
                }else{
                    treemapManager.selectTreemapOption(currentInstance, d);
                    return zoom(currentInstance, d.parent);
                }


            });

        cell.append("svg:rect")
            .attr("width", function(d) { return d.dx - 1; })
            .attr("height", function(d) { return d.dy - 1; })
            .style("fill", function(d) { return color(d.parent.name); });

        var text = cell.append("svg:text")
            .attr("x", function(d) { return d.dx / 2; })
            .attr("y", function(d) { return d.dy / 2; })
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .each(currentInstance.setTextLines)
            .style("opacity", function(d) {
                d.w = this.getComputedTextLength(); return d.dx > d.w ? 1 : 0;
            });

    }

    this.setTextLines = function(d){
        $(this).empty();
        var tspanLine1 = d3.select(this).append("svg:tspan")
            .attr("x", 0)
            .attr("dx",  function(d) { return d.dx / 2; })
            .attr("dy", "-0.45em")
            .text(d.name);
        var tspanLine2 = d3.select(this).append("svg:tspan")
            .attr("x", 0)
            .attr("dx",  function(d) { return d.dx / 2; })
            .attr("dy", "0.9em")
            .text(function(d){
                var audience = parseInt(d.size);
                if( audience >= 1000){
                    return numeral(audience).format('0.00a')
                } else{
                    return audience
                }

            });
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
            .text(numeral(parseInt(d.size*2000000)).format('0.0a'));
    }
}

