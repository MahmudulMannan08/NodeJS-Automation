'use strict';
var XLSX = require('xlsx');
var fs = require('fs');


var ExceltoJson = function () {

    this.ConvertExceltoJson = function (inputFile,outputFile,SheetName) {

        var workbook=XLSX.readFile(inputFile);
        var data = XLSX.utils.sheet_to_json(workbook.Sheets[SheetName]);

        data = data.filter(function (item) {
            return item.Description !== 'N/A';
        });

        fs.writeFile(outputFile, JSON.stringify(data), function (err) {
            if (err) {
                console.log(err);
            }
            else {
                console.log("JSON saved to " + outputFile);
            }
        });


    }
};

module.exports = new ExceltoJson();