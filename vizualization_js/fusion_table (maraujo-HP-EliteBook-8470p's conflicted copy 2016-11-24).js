/**
 * Created by maraujo on 11/8/16.
 */
var TABLE = "1xQ5SloMxn2Ug8r7jO4rwEm_0KsAbyjB1yMGWeAcK";
var API_KEY = "AIzaSyDO2DFB13Hr_DpzHtb8ONXkUvtCo7W7BHk";
var SQL_list_countries = "SELECT location FROM $table GROUP BY  location".replace("$table", TABLE);
var SQL_list_topics = "SELECT topic, SUM(audience) FROM $table GROUP BY topic".replace("$table", TABLE);
var SQL_list_unique = "SELECT $column, SUM(audience) FROM $table GROUP BY $column".replace("$table", TABLE);
var URL_sql = "https://www.googleapis.com/fusiontables/v2/query?sql=$query&key=$key".replace("$key",API_KEY);
var URL_list_columns = "https://www.googleapis.com/fusiontables/v2/tables/$table/columns?key=$key".replace("$key",API_KEY);


var list_countries_url = URL_sql.replace("$key",API_KEY).replace("$query",SQL_list_countries.replace("$table",TABLE));
var list_topics_url = URL_sql.replace("$key",API_KEY).replace("$query",SQL_list_topics.replace("$table",TABLE));
var list_columns_url = URL_list_columns.replace("$table",TABLE);


var countries_container = $("#countries_list");
var topics_container = $("#topics_list");
var category_container = $("#categories_list");
debugger
var countries_interest_data = [];

//utils.js --------------------------------------------------------------------------------------------------------

function getItemTag(name, checkbox_id, label_id, class_checkbox, value){
    if (typeof(name)==='undefined' || name == null) throw new Error("getItemTag should have parameter name");
    if (typeof(checkbox_id)==='undefined' || checkbox_id == null) checkbox_id = name;
    if (typeof(label_id)==='undefined' || label_id == null) label_id = name;
    if (typeof(class_checkbox)==='undefined' || class_checkbox == null) class_checkbox = "undefined";
    if (typeof(value)==='undefined' || value == null){
        value = null;
    } else {
        value = "(" + value + ")"
    }
    var item_tag = '<li><label class="checkbox-inline" id="$label_id"> <input type="checkbox" class="$class_checkbox" id="$checkbox_id" value="$item_name"> $item_name $value</label></li>';
    item_tag = item_tag.replace("$label_id", label_id).replace(/\$item_name/g, name).replace("$checkbox_id", checkbox_id).replace("$class_checkbox", class_checkbox).replace("$value", value ? value : "");
    return item_tag
}
function updateData(){
    //Get all checked box
    var checked_boxs = $(":checked");
    //Build where sentece
    var where_sentence = "WHERE ";
    checked_boxs.each(function(i,checkbox){
        var checkbox = $(checkbox);
        var condition = "$column = '$value'";
        var cb_class = checkbox.attr("class");
        var cb_id = checkbox.attr("id");

        where_sentence += condition.replace("$column", cb_class).replace("$value", cb_id);

        if( i + 1 != checked_boxs.length){
            where_sentence += " AND ";
        }
    });
    if(checked_boxs.length == 0) where_sentence = "";
    //Update List Topics
    var SQL_list_topics = "SELECT topic, SUM(audience) FROM $table $where GROUP BY topic".replace("$table", TABLE).replace("$where", where_sentence);
    //Delete topics children
    $(".topic").parent().remove();
    updateTopics(SQL_list_topics);

    //Build SQL

    //Update values for each category

}

function copyObj(obj){
    return Object.assign({}, obj);
}

function setStorage(name,obj) {
    window.localStorage.setItem(name, JSON.stringify(obj));
}
function getStorage(name){
    return JSON.parse(window.localStorage.getItem(name));
}

//utils.js--------------------------------------------------------------------------------------------------------
//Update Topics
function updateTopics(specific_sql){
    var list_topics_url;
    if (typeof(specific_sql)==='undefined' || specific_sql == null) {
        list_topics_url = URL_sql.replace("$key",API_KEY).replace("$query",SQL_list_topics.replace("$table",TABLE));
    } else {
        list_topics_url = URL_sql.replace("$key",API_KEY).replace("$query",specific_sql.replace("$table",TABLE));
    }
    console.log(list_topics_url);
    var topics_container = $("#topics_list");
    $.get(list_topics_url,function(data){
        console.log(data);
        //Get list of countries
        var topics_list = $.map(data.rows, function(row){ return {"topic":row[0], "sum":row[1]}; });
        //Append Countries
        $.map(topics_list, function(row){ topics_container.append(getItemTag(row["topic"],null,null,"topic",row["sum"]))});
    }).fail(function(errorObj) {
        alert("Fail to load countries.")
    });
}


//List Countries
$.get(list_countries_url,function(data){
    //Get list of countries
    // var countries_list = $.map(data.rows, function(row){ return [row[0]; });
    //Append Countries
    $.map(data.rows, function(row){ countries_container.append(getItemTag(row[0],null,null,"location"))});
}).fail(function(errorObj) {
    console.log(errorObj);
    alert("Fail to load countries.");
}).success(function(){
    $(".location").change(function(){
        updateData();
    });
});

//List Topics
updateTopics();
// $.get(list_topics_url,function(data){
//     //Get list of countries
//     var topics_list = $.map(data.rows, function(row){ return {"topic":row[0], "sum":row[1]}; });
//     //Append Countries
//     $.map(topics_list, function(row){ topics_container.append(getItemTag(row["topic"],null,null,"topic",row["sum"]))});
// }).fail(function(errorObj) {
//     alert("Fail to load countries.")
// }).success(function(){
//     $(".topic").change(function(){
//         updateData();
//     });
// });

//List Categories
$.get(list_columns_url,function(data){
    //Get list of countries
    var categories_list_raw = $.map(data.items, function(item){ return item.name; });
    var categories_list = [];
    for(var category_index = categories_list_raw.length; category_index--;){
        var category = categories_list_raw[category_index];
        if (category == "topic" || category == "interest" || category == "" || category == "audience" || category == "fraction" || category == "location" || category == "country_code" || category == "min_age" || category == "max_age") continue;
        categories_list.push(category);
    }
    var categories_status = {};
    $.map(categories_list, function(item){ categories_status[item] = 0; });
    // setStorage("categories",$.map(categories_list, function(item){ return {name: item, status : false}; }));
    //Append Countries
    for(var category_index = categories_list.length; category_index--;){
        var category =categories_list[category_index];

    // $.map(categories_list, function(category){

        //Add category
        var category_tag = getItemTag(category);
        category_container.append(category_tag);
        //Search Subcategories
        var sql_query = SQL_list_unique.replace(/\$column/g,category);
        var category_url = URL_sql.replace("$query", sql_query);
        $.get(category_url,function(category_data){
            var category = category_data.columns[0];
            var unique_values = $.map(category_data.rows, function(row){ return {"column":row[0], "sum": row[1]}});
            $.map(unique_values, function(row){$("#" + category).append(getItemTag("" != row.column ? row.column : "Not specified",null,null,category,row.sum));
            var values = $.map(unique_values, function(row){
                    return {
                        "key": "" != row.column ? row.column : "Not specified",
                        "region": category,
                        "subregion": "" != row.column ? row.column : "Not specified",
                        "value": Math.abs(Math.random() * 10000),
                        "id": Math.random()
                    }
                });
                $.map(values, function(value){countries_interest_data.push(value);});
                // countries_interest_data.push(values);
            });
        }).fail(function(errorObj){console.log("Could get more information: " + errorObj)}).success(function(category_data){
            var category = category_data.columns[0];
            $("." + category).change(function(){
                updateData();
            });
            categories_status[category] = 1;
            var values = Object.keys(categories_status).map(function(key){return categories_status[key];});
            var sum = values.reduce((a,b)=>a+b);

            console.log(sum + " " + values.length);
            if(sum == values.length){
                console.log(categories_list[categories_list.length - 1] + " " + category + " " + countries_interest_data.length );
                var data = d3.nest().key(function(d) { return d.region; }).key(function(d) { return d.subregion; }).entries(countries_interest_data);
                console.log(data)
                main({title: "Arabic Health Awareness"}, {key: "Arabic League", values: data});
            }
        });
        category_container.append(category_tag);

    };
}).fail(function(errorObj) {
    alert("Fail to load countries.")
});
