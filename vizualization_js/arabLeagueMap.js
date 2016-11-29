function arabLeagueMap(){

    this.setProjection = function(element){
        var projection = d3.geo.equirectangular()
            .center([24, 24])
            .rotate([0, 0])
            .scale(500)
            .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
        var path = d3.geo.path()
            .projection(projection);

        return {path: path, projection: projection};
    }

    this.geographyConfig = {
        dataUrl: null, //if not null, datamaps will fetch the map JSON (currently only supports topojson)
            hideAntarctica: true,
            borderWidth: 1,
            borderOpacity: 1,
            borderColor: '#FDFDFD',
            responsive: true,
            popupTemplate: function(geography, data) { //this function should just return a string
            return '<div class="hoverinfo"><strong>' + geography.properties.name + '</strong></div>';
        },
        popupOnHover: true, //disable the popup while hovering
            highlightOnHover: true,
            highlightFillColor: '#FC8D59',
            highlightBorderColor: 'rgba(250, 15, 160, 0.2)',
            highlightBorderWidth: 2,
            highlightBorderOpacity: 1
    }

    this.fills = {
        defaultFill: "#EEEEEE",
        gt50: getGreenOrRedColor(),
        eq50: getGreenOrRedColor(),
        lt25: getGreenOrRedColor(),
        gt75: getGreenOrRedColor(),
        lt50: getGreenOrRedColor(),
        eq0: getGreenOrRedColor(),
        pink: getGreenOrRedColor(),
        gt500: getGreenOrRedColor()
    }

    this.updateRandomColors = function(){
        this.datamap.updateChoropleth({
            'ZAF': getGreenOrRedColor(),
            'ZWE': getGreenOrRedColor(),
            'NGA': getGreenOrRedColor(),
            'MOZ': getGreenOrRedColor(),
            'MDG': getGreenOrRedColor(),
            'EGY': getGreenOrRedColor(),
            'TZA': getGreenOrRedColor(),
            'LBY': getGreenOrRedColor(),
            'DZA': getGreenOrRedColor(),
            'SSD': getGreenOrRedColor(),
            'SOM': getGreenOrRedColor(),
            'GIB': getGreenOrRedColor(),
            'AGO': getGreenOrRedColor()
        });
    }

    this.data = {
        'ZAF': { fillKey: 'gt50' },
        'ZWE': { fillKey: 'lt25' },
        'NGA': { fillKey: 'lt50' },
        'MOZ': { fillKey: 'eq50' },
        'MDG': { fillKey: 'eq50' },
        'EGY': { fillKey: 'gt75' },
        'TZA': { fillKey: 'gt75' },
        'LBY': { fillKey: 'eq0' },
        'DZA': { fillKey: 'gt500' },
        'SSD': { fillKey: 'pink' },
        'SOM': { fillKey: 'gt50' },
        'GIB': { fillKey: 'eq50' },
        'AGO': { fillKey: 'lt50' }
    }

    this.init = function(){
        var datamap = new Datamap({
            element: document.getElementById("arabLeagueMapDiv"),
            scope: 'world',
            width:  "700px",
            height:'400px',
            setProjection : this.setProjection,
            geographyConfig : this.geographyConfig,
            fills: this.fills,
            data: this.data,
        });
        this.datamap = datamap;
    }

    this.giveLife = function(){
        var datamap = this.datamap;
        var currentInstance = this;

        window.setInterval(function() {
            // debugger
            currentInstance.updateRandomColors();
            datamap.bubbles([
                {name: 'Bubble 1', latitude: 21.32, longitude: -7.32, radius: 45*Math.random(), fillKey: 'gt500'},
                {name: 'Bubble 2', latitude: 12.32, longitude: 27.32, radius: 25*Math.random(), fillKey: 'eq0'},
                {name: 'Bubble 3', latitude: 0.32, longitude: 23.32, radius: 35*Math.random(), fillKey: 'lt25'},
                {name: 'Bubble 4', latitude: -31.32, longitude: 23.32, radius: 55*Math.random(), fillKey: 'eq50'},
            ], {
                popupTemplate: function(geo, data) {
                    return "<div class='hoverinfo'>Bubble for " + data.name + "</div>";
                }
            });
        }, 2000);
    }

}