/**
 * Created by maraujo on 11/8/16.
 */
//utils.js --------------------------------------------------------------------------------------------------------
function getSubcategoryItemByID(searchedID){
    var categoriesData = getVariableFromSession("global_data");
    for(var categoryIndex = 0 ; categoryIndex < categoriesData.length ; categoryIndex++){
        for(var subCategoryIndex = 0; subCategoryIndex < categoriesData[categoryIndex].values.length; subCategoryIndex++){
            var subCategoryItem = categoriesData[categoryIndex].values[subCategoryIndex].values[0];
            if(subCategoryItem.id == searchedID){
                return subCategoryItem;
            }
        }
    }
    return null;
}


// function getItemTag(name, checkbox_id, label_id, class_checkbox, value){
//     if (typeof(name)==='undefined' || name == null) throw new Error("getItemTag should have parameter name");
//     if (typeof(checkbox_id)==='undefined' || checkbox_id == null) checkbox_id = name;
//     if (typeof(label_id)==='undefined' || label_id == null) label_id = name;
//     if (typeof(class_checkbox)==='undefined' || class_checkbox == null) class_checkbox = "undefined";
//     if (typeof(value)==='undefined' || value == null){
//         value = null;
//     } else {
//         value = "(" + value + ")"
//     }
//     var item_tag = '<li><label class="checkbox-inline" id="$label_id"> <input type="checkbox" class="$class_checkbox" id="$checkbox_id" value="$item_name"> $item_name $value</label></li>';
//     item_tag = item_tag.replace("$label_id", label_id).replace(/\$item_name/g, name).replace("$checkbox_id", checkbox_id).replace("$class_checkbox", class_checkbox).replace("$value", value ? value : "");
//     return item_tag
// }
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

function returnCopyObject(obj){
    return Object.assign({}, obj);
}


//Update Topics




function compareListCategoies(a,b) {
    if (a.key < b.key)
        return -1;
    if (a.key > b.key)
        return 1;
    return 0;
}

function getSubcategoryName(category, subcategory){
    //Correct Integer to name
    var subCategoryName;
    if(category == "gender"){
        switch (subcategory){
            case "0":
                subCategoryName = "All Genders";
                break;
            case "1":
                subCategoryName = "Male";
                break;
            case "2":
                subCategoryName = "Female";
                break;
        }
    }else if(category == "exclude_expats"){
        console.log("Column: " + subcategory)
        switch (subcategory){
            case "1":
                subCategoryName = "Only Natives";
                break;
            default:
                subCategoryName = "All Residents";
        }
    } else {
        subCategoryName = "" != subcategory ? subcategory : "Not specified";
    }
    return subCategoryName;
}


