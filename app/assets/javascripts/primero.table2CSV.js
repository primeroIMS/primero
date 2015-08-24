//This is a hacked version of table2CSV.js.
//This will handle complex headers: multiple header rows and variable colspan
//The original can be found here: http://www.kunalbabre.com/projects/table2CSV.js

jQuery.fn.table2CSV = function(options) {
    var options = jQuery.extend({
        separator: ',',
        header: [],
        delivery: 'popup' // popup, value
    },
    options);

    var csvData = [];
    var headerArr = [];
    var el = this;

    //header
    var numCols = options.header.length;
    var tmpRow = []; // construct header avalible array

    if (numCols > 0) {
        for (var i = 0; i < numCols; i++) {
            tmpRow[tmpRow.length] = formatData(options.header[i]);
        }
    } else {
        $(el).filter(':visible').find('tr:has(th)').each(function() {
            if ($(this).css('display') != 'none'){
                tmpRow = [];
                $(this).find('th').each(function(){
                    tmpRow[tmpRow.length] = formatData($(this).html());
                    if ($(this).attr('colspan') > 1){
                        for(var i = 0; i<$(this).attr('colspan')-1; i+=1){
                            tmpRow[tmpRow.length] = "";
                        }
                    }
                });
                row2CSV(tmpRow);
            }
        });
    }

    // actual data
    $(el).find('tr').each(function() {
        var tmpRow = [];
        $(this).filter(':visible').find('td').each(function() {
            if ($(this).css('display') != 'none') tmpRow[tmpRow.length] = formatData($(this).html());
        });
        row2CSV(tmpRow);
    });
    if (options.delivery == 'popup') {
        var mydata = csvData.join('\n');
        return popup(mydata);
    } else {
        var mydata = csvData.join('\n');
        return mydata;
    }

    function row2CSV(tmpRow) {
        var tmp = tmpRow.join('') // to remove any blank rows
        // alert(tmp);
        if (tmpRow.length > 0 && tmp != '') {
            var mystr = tmpRow.join(options.separator);
            csvData[csvData.length] = mystr;
        }
    }
    function formatData(input) {
        // replace " with “
        var regexp = new RegExp(/["]/g);
        var output = input.replace(regexp, "“");
        //HTML
        var regexp = new RegExp(/\<[^\<]+\>/g);
        var output = output.replace(regexp, "");
        if (output == "") return '';

        //Find range of numeric values - Excel got crazy with them.
        var regexp = new RegExp(/\d+\s?-\s?\d+\s?/);
        if (regexp.test(output)) {
            //Put a single quote in from of the value
            //So excel will treat as text and don't convert
            //to some date value.
            output = "'" + output;
        }
        return '"' + output + '"';
    }
    function popup(data) {
        var generator = window.open('', 'csv', 'height=400,width=600');
        generator.document.write('<html><head><title>CSV</title>');
        generator.document.write('</head><body >');
        generator.document.write('<textArea cols=70 rows=15 wrap="off" >');
        generator.document.write(data);
        generator.document.write('</textArea>');
        generator.document.write('</body></html>');
        generator.document.close();
        return true;
    }
};