/**
 * Created by maraujo on 2/5/17.
 */
/**
 * Created by maraujo on 2/2/17.
 */
/**
 * Created by maraujo on 12/1/16.
 */

function Workbook() {
    if(!(this instanceof Workbook)) return new Workbook();
    this.SheetNames = [];
    this.Sheets = {};
}

function sheet_from_array_of_arrays(data, opts) {
    var ws = {};
    var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
    for(var R = 0; R != data.length; ++R) {
        for(var C = 0; C != data[R].length; ++C) {
            if(range.s.r > R) range.s.r = R;
            if(range.s.c > C) range.s.c = C;
            if(range.e.r < R) range.e.r = R;
            if(range.e.c < C) range.e.c = C;
            var cell = {v: data[R][C] };
            if(cell.v == null) continue;
            var cell_ref = XLSX.utils.encode_cell({c:C,r:R});

            if(typeof cell.v === 'number') cell.t = 'n';
            else if(typeof cell.v === 'boolean') cell.t = 'b';
            else if(cell.v instanceof Date) {
                cell.t = 'n'; cell.z = XLSX.SSF._table[14];
                cell.v = datenum(cell.v);
            }
            else cell.t = 's';

            ws[cell_ref] = cell;
        }
    }
    if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
    return ws;
}

function DownloadReport(){
    var currentInstance = this;

    this.generateBinaryFromWorkbookOut = function(workbookString){
        var buf = new ArrayBuffer(workbookString.length);
        var view = new Uint8Array(buf);
        for (var i=0; i!=workbookString.length; ++i) view[i] = workbookString.charCodeAt(i) & 0xFF;
        return buf;
    };


    this.addCurrentFiltersToData = function(data){
        data.push([])
        data.push(["Selected Filters"]);
        data.push(["Health Topic", btnsTopicsSelectors.convertBtnTopicName(dataManager.selectedHealth)]);
        data.push(["Luxury Topic", btnsTopicsSelectors.convertBtnTopicName(dataManager.selectedLuxury)]);
        var selectedDemographics = dataManager.selectedCategoriesAndValues;
        for(var category in selectedDemographics){
            data.push([getTooltipLabel(category), selectedDemographics[category]])
        }
        var selectedCountriesData = dataManager.getSelectedCountriesData();
        for(var countryCode in selectedCountriesData){
            data.push(["Country", selectedCountriesData[countryCode].name])
        }
    };

    this.getCountriesDataFromCurrentState = function(){
        let data = [];
        let header = ["Countries", "Score", "Facebook Coverage", "Health Audience", "Luxury Audience"];
        var countriesData = dataManager.getSelectedCountriesData();
        data.push(header)
        for(let countryCode in countriesData){
            var countryData = countriesData[countryCode];
            var countryRow = [];
            countryRow.push(countryData.name);
            countryRow.push(countryData.score);
            countryRow.push(countryData.audienceCoverage);
            countryRow.push(countryData.healthAudience);
            countryRow.push(countryData.luxuryAudience);
            data.push(countryRow);
        }
        currentInstance.addCurrentFiltersToData(data)
        return data;
    };

    this.getDemographicsDataFromCurrentState = function(){
        let data = [];
        let header = ["Demographic Breakdown", "Category", "Score", "Facebook Coverage", "Health Audience", "Luxury Audience"];
        var demographicsData = treemapManager.getAllVisibleTreemapData();
        data.push(header);
        for(let demographicName in demographicsData){
            var demographicData = demographicsData[demographicName];
            var demographicRow = [];
            demographicRow.push(demographicData.name);
            demographicRow.push(getTooltipLabel(demographicData.category));
            demographicRow.push(demographicData.score);
            demographicRow.push(demographicData.audienceCoverage);
            demographicRow.push(demographicData.healthAudience);
            demographicRow.push(demographicData.luxuryAudience);
            data.push(demographicRow);
        }
        currentInstance.addCurrentFiltersToData(data)
        return data;
    };

    this.buidCountriesWorksheet = function(){
        var data = currentInstance.getCountriesDataFromCurrentState();
        return sheet_from_array_of_arrays(data);
    };

    this.buidDemographicsWorksheet = function(){
        var data = currentInstance.getDemographicsDataFromCurrentState();
        return sheet_from_array_of_arrays(data);
    };

    this.buildWorkbook = function () {
        var workSheets = {
            "Countries" : currentInstance.buidCountriesWorksheet(),
            "Demographics" : currentInstance.buidDemographicsWorksheet()
        }
        var wb = new Workbook();
        wb.SheetNames.push("Countries");
        wb.SheetNames.push("Demographics");
        wb.Sheets = workSheets;
        return wb;
    };

    this.triggerWorkbookDownloadFromCurrentState = function(){
        var wopts = { bookType:'xlsx', bookSST:false, type:'binary' };
        var workbook = this.buildWorkbook();
        var wbout = XLSX.write(workbook,wopts);
        saveAs(new Blob([currentInstance.generateBinaryFromWorkbookOut(wbout)],{type:"application/octet-stream"}), "report.xlsx");
    };

    this.updateData = function () {

    };

    this.init = function(){
        $("#downloadReport").click(function(){
            currentInstance.triggerWorkbookDownloadFromCurrentState();
        });
    };
    this.init();
}

