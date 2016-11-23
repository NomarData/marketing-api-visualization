/**
 * Created by maraujo on 11/22/16.
 */


function Treemap(width,height,treemapContainer,colorFunction,treemapData) {
    this.w = width;
    this.h = height;
    this.x = d3.scale.linear().range([0, width]);
    this.y = d3.scale.linear().range([0, height]);
    this.color = colorFunction;
    this.root = treemapData;
    this.node = treemapData;
    this.treemap = d3.layout.treemap()
        .round(false)
        .size([this.w, this.h])
        .sticky(true)
        .value(function (d) {
            return d.size;
        });
    this.svg = d3.select(treemapContainer).append("div")
        .attr("class", "chart")
        .style("width", this.w + "px")
        .style("height", this.h + "px")
        .append("svg:svg")
        .attr("width", this.w)
        .attr("height", this.h)
        .append("svg:g")
        .attr("transform", "translate(.5,.5)");

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

    this.init = function(){
        var currentInstance = this;
        var color = currentInstance.color;
        var root = currentInstance.root;
        var treemap = currentInstance.treemap;
        var svg = currentInstance.svg;
        var zoom = currentInstance.zoom;

        var nodes = treemap.nodes(root)
            .filter(function(d) { return !d.children; });

        var cell = svg.selectAll("g")
            .data(nodes)
            .enter().append("svg:g")
            .attr("class", "cell")
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
            .on("click", function(d) {
                return zoom(currentInstance, currentInstance.node == d.parent ? root : d.parent);
            });

        cell.append("svg:rect")
            .attr("width", function(d) { return d.dx - 1; })
            .attr("height", function(d) { return d.dy - 1; })
            .style("fill", function(d) { return color(d.parent.name); });

        cell.append("svg:text")
            .attr("x", function(d) { return d.dx / 2; })
            .attr("y", function(d) { return d.dy / 2; })
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .text(function(d) { return d.name; })
            .style("opacity", function(d) { d.w = this.getComputedTextLength(); return d.dx > d.w ? 1 : 0; });

        d3.select(window).on("click", function() { zoom(currentInstance,root); });

    }
}



