'use strict';
var MenuPanel = require('./MenuPanel.js');
var tblDealHistory = element(by.className('table table-bordered table-sm table-hover table-fixed'));
var EC = protractor.ExpectedConditions;
var TestData = require('../../testData/TestData.js');
var CustomLib = require('../../CustomLibrary/CustomLibrary.js');
var RunSettings = require('../../testData/RunSetting.js');

var counter = 0;


var DealHistory = function () {

    var tbBody = element(by.tagName('app-deal-history')).element(by.tagName('tbody'));
    var table = element.all(by.css('.table.table-bordered.table-sm.table-hover.table-fixed')).get(0);
    var tabBody = table.element(by.tagName('tbody'));
    var Lang = TestData.data.LANGUAGE.value;
    var Env = RunSettings.data.Global.ENVIRONMENT.value;
    

    this.GetHistoryDetail = function (i) {
        return element.all(by.tagName('tbody')).all(by.tagName('tr')).then(function (rows) {
            return rows[i].all(by.tagName('td')).get(1).getText();

        })
    }

    this.VerifyClosedDealMsg = function (Msg) {

        //var ClosedMsg = element(by.css('.msg-container.ng-star-inserted')).all(by.css('.d-flex.my-1.ng-star-inserted')).get(0);
        var ClosedMsg = element(by.css('.msg-container.ng-star-inserted'));
    
        CustomLib.scrollIntoView(ClosedMsg);
        expect(ClosedMsg.getText()).toContain(Msg);
    }

    this.VerifyClosingDateUpdateMsg = function () {
        var StatusMsg = element(by.css('.msg-container.ng-star-inserted'));
        var ClosingDateUpdMsg = TestData.data[Lang].Messages.ClosingDateUpdateMsg;
        var EC = protractor.ExpectedConditions;
        browser.wait(EC.visibilityOf(StatusMsg), 45000,  'Element is not visible').then(() => {
            expect(StatusMsg.getText()).toContain(ClosingDateUpdMsg,'Closing date update message is not present.');
            }, (error) => {
                   expect(true).toBe(false, "Closing date update Message is not visible.");
        })  
    }

    this.VerifyRecievedLenderAmendment = function () {
        var msg = element(by.css('.m-0'));
        msg.getText().then(function (txt) {
            expect(txt).toContain('The System has received an amendment from the Lender. Before you can submit this information, navigate to Unity and process the pending Lender amendment(s).');

        })
    }
    
    this.VerifyDealHistoryTableEntry = function(rowNumb, name, activity) {
        browser.wait(EC.visibilityOf(tbBody), 60000, 'Deal History table is not available');
        expect(tbBody.all(by.tagName('tr')).get(rowNumb - 1).all(by.tagName('td')).get(0).getText()).toBe(name);
        expect(tbBody.all(by.tagName('tr')).get(rowNumb - 1).all(by.tagName('td')).get(1).getText()).toContain(activity);
        tbBody.all(by.tagName('tr')).get(rowNumb - 1).all(by.tagName('td')).get(2).getText().then(function (DateTime){
            console.log("Deal History DateTime logged: ", DateTime);
            expect(DateTime).not.toBe(null);
        })
    }

    this.VerifyDealHistoryTableEntrySearch = function (activity) {
        var rows = tabBody.all(by.tagName('tr'));
        console.log("here U are :" + rows);
        rows.each(function (row, rowindex) {
            var cols = row.all(by.tagName('td'));
            cols.get(1).getText().then(function (SearchName) {
                if (DocName == DocSearch) {
                    console.log(DocName);
                    cols.get(1).getText().then(function (datetxt) {
                        var dateSplit = datetxt.split(",");
                        datetxt = dateSplit[0] + "," + dateSplit[1];
                        expect(datetxt).toEqual(DocUploadDate);
                    });
                    cols.get(2).element(by.css('.btn.btn-link.tableLink.p-0')).click();
                }
            });
        })
    }

    this.VerifyClosedRequestMsg = function() {
        var StatusMsg = element(by.css('.msg-container.ng-star-inserted'));
        var ClosedRequestMessage = TestData.data[Lang].Messages.ClosedDealMsg;
        expect(StatusMsg.getText()).toContain(ClosedRequestMessage,'Closed deal message is not present.');
    }

    this.VerifyDealHistoryTableSearch = function (SearchText,expectResult) {
        var found=false;
        var resultexpected= "not"
        if(expectResult){
            resultexpected ="";
        }
        var rows = tabBody.all(by.tagName('tr'));
        console.log("here U are :" + rows);
        rows.each(function (row, rowindex) {
            var cols = row.all(by.tagName('td'));
            cols.get(1).getText().then(function (txt) {
               // console.log(txt);
                if (txt.includes( SearchText)) {
                    console.log(txt);
                   found=true;
                  //  cols.get(2).element(by.css('.btn.btn-link.tableLink.p-0')).click();
                }
            });
        }).then (function(){
            console.log("Search Result : "+ found);

            expect(found).toBe(expectResult,"Deal history verification failed, it was "+ resultexpected+" expecting a text like this in the history : " + SearchText);
        })
    }

        this.WaitForExpectedDHEntry = function(expectedRowCount) {
        WaitUntilExpectedRows(expectedRowCount);
    }


    
    
var WaitForDealHistoryEntry = function (colVal) {
    var colActivity = tblDealHistory.element(by.xpath("//tbody/tr[1]/td[2]"));                               
                colActivity.getText().then(function (txt) {
                if (txt.includes(colVal)) {
                    console.log("Activity is logged in deal history");
                    return true;
                }
                MenuPanel.PrimaryMenuNavigateWithWait('Home');
                MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                            
            });      
    }


    var WaitForDealHistoryEntryNew = function (colVal) {
        var found = false;
       
        var colActivity = tblDealHistory.element(by.xpath("//tbody/tr[1]/td[2]"));                               
                    colActivity.getText().then(function (txt) {
 
                    if (txt.includes(colVal)) {
                        console.log("Activity is logged in deal history");
                        found = true;
                        console.log("Search Result : "+ found);
                    }

                    else {
                        if (found != true ) {
                        
                            console.log("Search Result : "+ found);
                            MenuPanel.PrimaryMenuNavigateWithWait('Home');
                            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                            WaitForDealHistoryEntryNew(colVal);
                        }
                    }
                                
                });      
        }

   this.WaitUntilDealHistoryEntry = function (colVal) {
        browser.sleep(WaitForDealHistoryEntryNew(colVal), 120000);
    }

    this.VerifyAmendmentMsg = function () {
        var StatusMsg = element(by.css('.msg-container.ng-star-inserted'));
        var LenderAmendmentMsg = TestData.data[Lang].Messages[Env].LenderAmendmentMsgMMS;
        var EC = protractor.ExpectedConditions;
        browser.wait(EC.visibilityOf(StatusMsg), 45000,  'Element is not visible').then(() => {
            expect(StatusMsg.getText()).toContain(LenderAmendmentMsg,'Amendment message is not present.');
            }, (error) => {
                   expect(true).toBe(false, "Amendment Message is not visible.");
        })  
    }
          
   

    var WaitUntilExpectedRows = function(expectedRowCount) {
            tbBody.all(by.tagName('tr')).then(function (rows) {
                if(counter < 15) {
                    counter++;
                    if(rows.length < expectedRowCount) {
                        MenuPanel.PrimaryMenuNavigateWithWait('Home');
                        browser.sleep(500);
                        MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                        browser.sleep(500);
                        WaitUntilExpectedRows(expectedRowCount);
                    }
                }
                else 
                {                   
                    expect(counter).toBeLessThan(15,  "Expected deal history activity is not logged");
                }
            })
        }
    }    

module.exports = new DealHistory();