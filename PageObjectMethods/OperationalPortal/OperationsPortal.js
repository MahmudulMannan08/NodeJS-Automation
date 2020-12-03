'use strict';

var Runsettings = require('../../testData/RunSetting.js');
var CustomLib = require('../../CustomLibrary/CustomLibrary.js');
var Env = Runsettings.data.Global.ENVIRONMENT.value;
var OperationsPortalUrl = Runsettings.data.Global.OperationsPortal[Env].URL.value;
var OperationsPortal = function () {

    var cbSearchCriteriaSelected = element(by.id('SearchCriteriaSelected'));
    var txtSearchCriteria = element(by.id('SearchCriteria'));
    var btnSubmit = element(by.id('btnSubmit'));
    var EC = protractor.ExpectedConditions;
    var btnView = element(by.xpath("//a[contains(text(),'View')]"));
    var DealID = element(by.xpath('//*[@id="divPlaceHolder"]/div/div/div[1]/div[2]/div/span'));
    var DealStatusNew = element.all(by.css('.col-md-10.text-left')).get(6);
    var tableNotes = element(by.css('.table'));
    var tabBodyNotes = tableNotes.element(by.tagName('tbody'));
    var DealStatus = element(by.xpath('//*[@id="divPlaceHolder"]/div/div/div[1]/div[7]/div/span'));
    var tabDocuments = element(by.id('lnkDocuments'));
    var tabMilestones = element(by.id('lnkMilestones'));
    var tabDealSummary = element(by.id('lnkDetails'));
    var btnCancelDeal = element(by.id('btnCancelDeal'));
    var btnOK = element(by.buttonText("OK"));
    var counter = null;

    this.CancelDealIfNotComplete = function () {

        CustomLib.WaitNClickOP(tabDealSummary);
        CustomLib.WaitforElementVisible(DealStatus);
        DealStatus.getText().then(function (status) {
            if (status.indexOf('COMPLETED') == -1) {

                CustomLib.WaitNClickOP(tabMilestones);
                CustomLib.WaitforElementVisible(btnCancelDeal);
                btnCancelDeal.click();
                CustomLib.WaitforElementVisible(element(by.css('.modal-content')));
                CustomLib.WaitNClickOP(btnOK);
                browser.driver.getPageSource().then(function (source) {
                    expect(source).toContain('btnUndoCancellation', "Deal Cancelled Successfully");
                })
            }
        })
    }

    this.LoginOperationsPortal = function () {
        browser.get(OperationsPortalUrl);
        browser.waitForAngular();
        CustomLib.WaitForSpinnerInvisibleOP();
        element.all(by.id('details-button')).count().then(function (count) {
            if (count > 0) {
                CustomLib.WaitForSpinnerInvisibleOP();
                CustomLib.WaitNClickOP(element(by.id('details-button')));
                browser.sleep(200);
                CustomLib.WaitNClickOP(element(by.id('proceed-link')).click());
            }
        });
        var until = protractor.ExpectedConditions;
        browser.wait(until.presenceOf(cbSearchCriteriaSelected), 60000, 'Element taking too long to appear in the DOM');
        expect(cbSearchCriteriaSelected.isDisplayed()).toBe(true, "Operational Portal Home Page Displayed.");
    }

    this.SerchDealDetails = function (FCTURN) {
         var until = protractor.ExpectedConditions;
         browser.wait(until.presenceOf(cbSearchCriteriaSelected), 60000, 'Element taking too long to appear in the DOM');
         CustomLib.WaitNClick(cbSearchCriteriaSelected.element(by.cssContainingText('option', 'FCT Reference Number')));// Aug 26
         CustomLib.WaitforElementVisible(txtSearchCriteria);
         txtSearchCriteria.sendKeys(FCTURN);
         btnSubmit.click();
         return element.all(by.id('records')).count().then(function(count)
         {  expect(count).toBeGreaterThan(0, "Operational Portal Serach Result for FCTURN "+ FCTURN);
             if(count > 0 )
             {     
                CustomLib.WaitforElementVisible(btnView);      
                CustomLib.WaitNClickOP(btnView);
                browser.sleep(2000);  
             }
             return count;
         });    
     }

     this.SearchDealBNS = function (FctUrn) {
        
        CustomLib.WaitforElementVisible(cbSearchCriteriaSelected);
        cbSearchCriteriaSelected.element(by.cssContainingText('option', 'Deal Id')).click();
        txtSearchCriteria.sendKeys(FctUrn);
        btnSubmit.click();
        
        return element.all(by.id('records')).count().then(function(count) {  
             
            expect(count).toBeGreaterThan(0, "Operational Portal Serach Result for FCTURN "+ FctUrn);
             if(count > 0 ) {

                var EC = protractor.ExpectedConditions;
                browser.wait(EC.visibilityOf(btnView), 65000,  'Waiting for element to become viible').then(() => {
                browser.sleep(1000);
                btnView.click();
                browser.sleep(1000);
                CustomLib.WaitforElementVisible(element(by.id('lnkDetails')));
                }, (error) => {
                    console.log("View Details button is not available" + error); })
             }
             return count;
         });   
       
    }

    this.ClickDocumentsTab = function () {
        CustomLib.ScrollUp(0,10000);
        var EC = protractor.ExpectedConditions;
         browser.wait(EC.invisibilityOf(element(by.id('divSpinner'))), 45000, 'Spinner is still visible').then(() => {
            browser.wait(EC.elementToBeClickable(tabDocuments), 45000, tabDocuments +' is not found').then(() => {
                tabDocuments.click();
                browser.sleep(1000);
            }, (error) => {
                console.log(error);
             })
         }, (error) => {
            console.log(error);
         })
    }

      this.VerifyUploadedDocument = function (documentName) {
        browser.sleep(1500);
        CustomLib.WaitforElementVisible(element(by.id('divDocuments')));
        element.all(by.cssContainingText('td', documentName)).count().then(function (count) {
            expect(count).toBeGreaterThan(0, "\x1b[41m\x1b[30m" + "Expected document " + documentName + " is not found" + "\x1b[0m");
            browser.sleep(500);
        });
    }

    this.SearchDeal = function (filter, value) {
        cbSearchCriteriaSelected.element(by.cssContainingText('option', filter)).click();
        txtSearchCriteria.sendKeys(value);
        CustomLib.WaitNClick(btnSubmit);
        CustomLib.WaitNClick(btnView);
    }

    this.ClickMilestinesAndStatus = function () {
        CustomLib.WaitNClick(element(by.id('lnkMilestones')));
    }

    this.ClickNotesTab = function () {
        CustomLib.WaitNClick(element(by.id('lnkNotes')));
    }

    this.VerifyNotesTableEntry = function (name) {
        browser.wait(EC.visibilityOf(tabBodyNotes), 50000, 'Notes table is not available');
        
        expect(tabBodyNotes.element(by.cssContainingText('td', name)).isDisplayed()).toBe(true,"Entry is not present in the deal history grid.");
        }; 

        this.VerifyUploadedDocument1 = function (documentName) {
            CustomLib.WaitforElementVisible(element(by.id('divDocuments')));
            element.all(by.cssContainingText('td', documentName)).count().then(function (count) {
                expect(count).toBeGreaterThan(0, "\x1b[41m\x1b[30m" + "Expected document " + documentName + " is not found" + "\x1b[0m");
                browser.sleep(500);
            });
        }

    this.UndoCancelRequest = function () {
        element(by.id('btnUndoCancellationRequest')).click();
        browser.sleep(5000);
        expect(element(by.cssContainingText('div', 'Deal Status: ACTIVE')).isDisplayed()).toBe(true, 'Undo button not present')
        }

    this.GetDealStatus = function () {
        CustomLib.ScrollDown(0,10000);
        return DealStatus.getText().then(function (txt) { 
            //console.log("DealStatus in Operations Portal: ", txt); 
            return txt 
            
        })
    }

    this.GetDealStatusAfterRC = function (status) {
        CustomLib.ScrollDown(0,10000);
       return DealStatusNew.getText().then(function (txt) { 
            //console.log("DealStatus in Operations Portal: ", txt); 
            expect(txt).toBe(status, 'Status is invalid');
            return txt 
            
        })
    }

    this.WaitForExpectedDealStatusOP = function (status) { 
        counter = 0;
        WaitUntilExpectedDealStatusOP(status);
    }

    var WaitUntilExpectedDealStatusOP = function (status) {
        CustomLib.WaitforElementVisible(DealStatus);
        DealStatus.getText().then(function (txt) {
            if(counter < 115) {
                counter++;
                if(txt != status) {
                    CustomLib.WaitNClickOP(tabMilestones);
                    CustomLib.WaitforElementVisible(btnCancelDeal);
                    CustomLib.WaitNClickOP(tabDealSummary);
                    CustomLib.WaitforElementVisible(DealStatus);
                    WaitUntilExpectedDealStatusOP(status);
                }
            }
            else 
            {                   
                expect(counter).toBeLessThan(115, "Expected deal status '" + status + "' not found in Operations Portal. Current deal status: " + txt);
            }
        })
    }

    this.GetDealID = function () {
        return DealID.getText().then(function (txt) { console.log("DealID", txt); return txt })
    }

    this.VerifyDealStatus = function (status) {
        var lblStatus = element(by.xpath('//*[@id="divPlaceHolder"]/div/div/div[1]'))
        CustomLib.WaitforElementVisible(lblStatus);
        lblStatus.getText().then(function (txt) {
            expect(txt).toContain(status, "Deal Status in Operational Portal is not as expected!")
        })
    }

   
};

module.exports = new OperationsPortal();