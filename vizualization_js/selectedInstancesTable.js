/**
 * Created by maraujo on 12/1/16.
 */

function SelectedInstancesTable(elementContainerSelector, data){
    var currentInstance = this;
    this.data = data;
    this.element = $(elementContainerSelector);

    this.empty = function () {
        currentInstance.element.empty();
        currentInstance.addHeader();
    };

    this.init = function(){
        currentInstance.updateData();
    }

    this.addHeader = function() {
        var keys = [];
        var data = fakeData;
        for(var instanceIndex in data){
            var instance = data[instanceIndex];
            for( var key in instance){
                if(keys.indexOf(key) == -1){
                    keys.push(key)
                }
            }
        }
        var header = $("<tr></tr>");
        for(var columnIndex in keys){
            header.append("<th>" + keys[columnIndex] + "</th>");
        }
        currentInstance.element.append(header);
        currentInstance.header = keys;
    };

    this.instanceToItemRow = function(instance){
        var tableRow = $("<tr></tr>");
        for(var columnIndex in currentInstance.header){
            var column = currentInstance.header[columnIndex];
            if(column in instance){
                tableRow.append("<td>" + instance[column] + "</td>");

            } else {
                tableRow.append("<td> - </td>");
                console.log(column + " " + instance[column]);
            }
        }
        //Setting Color
        var instancePolarity = getInstancePolarity(instance);
        tableRow.css("color",getGreenOrRedColorByInclination(instancePolarity));

        return tableRow;
    };

    this.updateData = function(){
        currentInstance.empty();


        var instances = getSelectedInstances();
        $.map(instances,function (instance) {
            var html = currentInstance.instanceToItemRow(instance);
            currentInstance.element.append(html);
        })
    }

    this.updateDataGivenInstances = function(instances){
        currentInstance.empty();
        $.map(instances,function (instance) {
            var html = currentInstance.instanceToItemRow(instance);
            currentInstance.element.append(html);
        })
    }
}
