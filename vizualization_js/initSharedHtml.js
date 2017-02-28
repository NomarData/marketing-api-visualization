htmlFILE = {
    cssFiles :[
        "bootstrap/download/bootstrap-responsive.min.css",
        "vizualization_css/treemap.css",
        "vizualization_css/locationsMap.css",
        "vizualization_css/locationsMap.css",
        "vizualization_css/stackedHorizontalBar.css",
        "vizualization_css/stackedHorizontalBar.css",
        "vizualization_css/stackedHorizontalBar.css",
        "vizualization_css/interestsSelection.css",
        "vizualization_css/btnsTopicsSelectors.css",
        "vizualization_css/GeneralScore.css",
        "vizualization_css/utils.css"
    ],
    jsFiles :[
        "bootstrap/js/bootstrap.min.js",
        "vizualization_js/lib/shim.js",
        "vizualization_js/lib/FileSaver.min.js",
        "vizualization_js/lib/xlsx.core.min.js",
        "vizualization_js/lib/Blob.js",
        "vizualization_js/lib/d3.v3.min.js",
        "vizualization_js/lib/simple-statistics.min.js",
        "vizualization_js/lib/url-search-params.js",
        "vizualization_js/lib/topojson.js",
        "vizualization_js/lib/datamaps.all.hires.min.js",
        "vizualization_js/lib/numeral.js",
        "vizualization_js/constants.js",
        "vizualization_js/utils.js",
        "vizualization_js/ExternalDataManager.js",
        "vizualization_js/DataManager.js",
        "vizualization_js/treemap.js",
        "vizualization_js/SharebleLink.js",
        "vizualization_js/LocationsBtns.js",
        "vizualization_js/stackedHorizontalBar.js",
        "vizualization_js/LocationsDataManager.js",
        "vizualization_js/LocationsMapDatamap.js",
        "vizualization_js/LocationsMapSubRegionGmaps.js",
        "vizualization_js/GeneralScore.js",
        "vizualization_js/treemapManager.js",
        "vizualization_js/ColorScaleScore.js",
        "vizualization_js/HistoryDataSelectors.js",
        "vizualization_js/btnsTopicsSelectors.js",
        "vizualization_js/FindingsFinder.js",
        "vizualization_js/DownloadReport.js",
        "vizualization_js/main.js"
    ],
};
var cssContainer = "{{#cssFiles}}<link href={{.}} rel='stylesheet' />{{/cssFiles}}";
var cssFilesHtml = Mustache.to_html(cssContainer, htmlFILE);

var jsContainer = "{{#jsFiles}}<script src={{.}}></script>{{/jsFiles}}";
var jsFilesHtml = Mustache.to_html(jsContainer, htmlFILE);


$("head").append(cssFilesHtml);
$("body").append(jsFilesHtml);



