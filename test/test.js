//Building a Fake Dom
var jsdom = require('jsdom');
global.document = jsdom.jsdom("");
global.window = document.defaultView;
//Load other libraries
$ = require('jquery');
var utils_file = require('../vizualization_js/utils');
var test = require('unit.js');
describe('Learning by the example', function(){
  it('Get Arabic Country 3 Letters, EXTREMELY simple case', function(){
    var arabic_countries = getAll3LettersCodeArabCountry();
    test.value(arabic_countries.indexOf("DZA")).isNot(-1);
  });
});