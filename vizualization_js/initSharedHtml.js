htmlFILE = {
    cssFiles :[
        "bootstrap/download/cosmo-bootswatch.min.css",
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
        "bootstrap/download/cosmo-bootswatch.min.css",
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
};
var cssContainer = "{{#cssFiles}}<link href={{.}} rel='stylesheet' />{{/cssFiles}}";
var cssFilesHtml = Mustache.to_html(cssContainer, htmlFILE);
$("head").append(cssFilesHtml);



