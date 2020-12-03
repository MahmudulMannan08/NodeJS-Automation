
'use strict';
var TestData = require('../../testData/TestData.js');
var Runsettings = require('../../testData/RunSetting.js');
var CustomLib = require('../../CustomLibrary/CustomLibrary.js');
const { browser } = require('protractor');
var EC = protractor.ExpectedConditions;

var ManageDocs = function () {
    var Lang = TestData.data.LANGUAGE.value;
    var Env = Runsettings.data.Global.ENVIRONMENT.value;
    var navigateAwyStay = element(by.id('btnCancel'));
    var navigateAwyPopup = element(by.tagName('app-modal-dialog'));
    var NavigateAwyPopupMsg = TestData.data[Lang].Messages.NavigateawayMsg;
    var navigateAwyPopupMsg = element(by.tagName('app-modal-dialog')).element(by.css('.modal-body'));
    var navigateAwyLeave = element(by.id('btnOk'));
    var btnOkRffSubmit = element(by.cssContainingText('.btn.btn-success.btn-sm.fct.mt-2', 'OK'));
    var tableLawyerrDocs = element.all(by.css('.table.table-bordered.header-only.headerStyle')).get(1);
    var tabBodyLawyerDocs = tableLawyerrDocs.element(by.tagName('tbody'));
    var lblAdditionalDoc = element(by.tagName('app-additional-documents')).element(by.tagName('h2'));
    var lblLenderDoc = element.all(by.tagName('app-document-grid')).get(0).element(by.tagName('h2'));
    var btnBrowse = element(by.tagName('app-additional-documents')).element(by.tagName('button'));
    var tbBodyLender = element.all(by.tagName('tbody')).get(0);
    var tbBody = element(by.tagName('app-document-grid[2]')).element(by.tagName('tbody'));
    var tblLenderDocument = element.all(by.css('.box-header.with-border')).get(0).element(by.tagName('tbody'));
    //var tabBodyLawyerDocs = tableLawyerrDocs.element(by.tagName('tbody'));
    var tbBody = element.all(by.tagName('tbody')).get(1);
    var tabBodyLawyerDocs = tableLawyerrDocs.element(by.tagName('tbody'));
    //var tableLawyerrDocs = element.all(by.css('.table.table-bordered.header-only.headerStyle')).get(1);
    var DocumentName = element(by.css("input[formControlName=documentName]"))
    var UploadBtn = element(by.id('btnUpload'));
    var lnkNeedHelp = element(by.css('.needHelp'));
    var Cancelbtn = element(by.id('btnUploadCancel'))
    var btnOKafterSubmit = element(by.buttonText('OK'));
    var btnCancel = element(by.buttonText('Cancel'));
    var lblAddDoc = element.all(by.css('.m-0.ng-star-inserted')).get(3);
    var fileToUpload = '../../testData/MMS/Lawyer.pdf'
    var path = require('path');
    var documentName = "";
    var DocumentPath = path.resolve(__dirname, fileToUpload);


    // This function verifies Lawyer Documents
    this.VerifyDocumentsTableEntry = function (name) {
        browser.wait(EC.visibilityOf(tbBody), 60000, 'Documnets table is not available');
        expect(tbBody.element(by.cssContainingText('td', name)).isDisplayed()).toBe(true,"Document is not prsent in the document grid.");
    };


    this.VerifyDocumentStatusOld = function (docName, status) {
        browser.sleep(1500);
        CustomLib.ScrollDown(0,3000);
       /* tbBody.all(by.tagName('tr')).then(function (rows) {

            rows.forEach(function (row) {

                row.getText().then(function (txt) {

                    if (txt.includes(docName)) { expect(txt).toContain(status) }


                })

            })

        })*/

        element.all(by.xpath('//tbody/tr/td[contains(text(),\'' + docName + '\')]/parent::tr/td[2]')).count().then(function(count)
        {
            expect(count).toBeGreaterThan(0,"Document not founder under Lawyer Doc Grid "+ docName);
            if(count > 0)
            {
                var rowcol = element(by.xpath('//tbody/tr/td[contains(text(),\'' + docName + '\')]/parent::tr/td[2]'));
                rowcol.getText().then(function (txt) {

                     expect(txt).toContain(status,"Document Status");

                })

            }
        })

        //tbody/tr/td[contains(text(),'Title Search')]/parent::tr/td[2]

    }

    this.VerifyDocumentStatus = function (docName, status) {
        browser.sleep(500);
        var LawyerDocs = element.all(by.css('.jumbotron.box-inner.ng-star-inserted')).get(1);
        CustomLib.scrollIntoView(LawyerDocs)
       

        var doc = element.all(by.xpath('//tbody/tr/td[contains(text(),\'' + docName + '\')]/parent::tr/td[1]'));
        //browser.wait(EC.visibilityOf(doc), 60000, 'Documnet is not available');
        doc.count().then(function(count)
        
        {
            expect(count).toBeGreaterThan(0,"Document not founder under Lawyer Doc Grid "+ docName);
            if(count > 0)
            {
                var rowcol = element(by.xpath('//tbody/tr/td[contains(text(),\'' + docName + '\')]/parent::tr/td[2]'));
                var colVal = rowcol.getText();
                browser.wait(EC.visibilityOf(colVal), 30000, 'status is not available');
                colVal.then(function (txt) {

                     expect(txt).toContain(status,"Document Status");

                })

            }
        })

       

    }

    this.clickLenderDocViewOld = function (DocSearch) {
        var rows = tabBodyLenDocs.all(by.tagName('tr'));
        rows.each(function (row, rowindex) {
            var cols = row.all(by.tagName('td'));
            cols.get(0).getText().then(function (DocName) {
                if (DocName == DocSearch) {
                    cols.get(2).element(by.css('.btn.btn-link.tableLink.p-0')).click();
                    browser.sleep(1000);
                }
            });
        });
    }

    this.VerifyStatusViewDocOld = function (docName, status) {
         browser.sleep(1000);
         element.all(by.xpath('//tbody/tr/td[contains(text(),\'' + docName + '\')]/parent::tr')).count().then(function(count)
         {
             expect(count).toBeGreaterThan(0,"Document not founder under Lawyer Doc Grid "+ docName);
             if(count > 0)
             {
                 var rowcol = element(by.xpath('//tbody/tr/td[contains(text(),\'' + docName + '\')]/parent::tr/td[2]'));
                
                rowcol.getText().then(function (txt) {
                   
                        console.log(txt);
                      expect(txt).toContain(status,"Document Status");
 
            })

                var btnView = element(by.xpath('//tbody/tr/td[contains(text(),\'' + docName + '\')]/parent::tr/td[4]/span/button[contains(text(), \'View\')]'));
                btnView.click().then(function()
                {
                    CustomLib.WaitForSpinnerInvisible();
                    browser.sleep(2000);
                    CustomLib.navigateToWindowWithUrlContains("pdfDocuments",2);
                    CustomLib.closeWindowUrlContains("pdfDocuments");
                    CustomLib.navigateToWindow("LLC Lawyer Portal",1);
                    browser.sleep(2000);
                })
             }
         })
     }

     this.VerifyStatusViewDoc = function (docName, status) {
        browser.sleep(1000);
        element.all(by.xpath('//tbody/tr/td[contains(text(),\'' + docName + '\')]/parent::tr')).count().then(function(count)
        {
            expect(count).toBeGreaterThan(0,"Document not founder under Lawyer Doc Grid "+ docName);
            if(count > 0)
            {
                var rowcol = element(by.xpath('//tbody/tr/td[contains(text(),\'' + docName + '\')]/parent::tr/td[2]'));
                var colText = rowcol.getText();
                browser.wait(EC.visibilityOf(colText), 60000, 'Documnets table is not available');
               //rowcol.getText().then(function (txt) {

                colText.then(function (txt) {
                  
                    console.log(txt);
                    expect(txt).toContain(status,"Document Status");

                })

                var btnView =  element(by.xpath('//tbody/tr/td[contains(text(),\'' + docName + '\')]/parent::tr/td[4]/span/button[contains(text(), \'View\')]'));
                btnView.click();
                CustomLib.WaitForSpinnerInvisible();
               // CustomLib.ClosePopup();
               browser.sleep(2000);
               CustomLib.navigateToWindowWithUrlContains("pdfDocuments",2);
               browser.sleep(500);
               CustomLib.closeWindowUrlContains("pdfDocuments");
               browser.sleep(500);
               CustomLib.navigateToWindow("LLC Lawyer Portal",1);
               browser.sleep(500);
            }
        })
    }

    this.ClickLenderDocViewNew = function (docName, DocUploadDate) {
        browser.sleep(1000);
        var waitForDoc = function () {
        return element.all(by.xpath('//tbody/tr/td[contains(text(),\'' + docName + '\')]/parent::tr')).count().then(function(count){
         
                if(count>0)
                {
                    return true;
                }
            })
        }

        return browser.wait(waitForDoc, 25000).then(function(IsPresent)
        {
            expect(IsPresent).toBe(true,"Document not founder under Lender Doc Grid "+ docName);
            if(IsPresent)
            {   
             
                var rowcol = element(by.xpath('//tbody/tr/td[contains(text(),\'' + docName + '\')]/parent::tr/td[2]'));
                var colText = rowcol.getText();
                browser.wait(EC.visibilityOf(colText), 60000, 'Documnets table is not available');
               
                colText.then(function (datetxt) {
                    var dateSplit = datetxt.split(",");
                    datetxt = dateSplit[0] + "," + dateSplit[1];
                    expect(datetxt).toEqual(DocUploadDate,"Document Date");

                })  

                var btnView =  element(by.xpath('//tbody/tr/td[contains(text(),\'' + docName + '\')]/parent::tr/td[3]/span/button[contains(text(), \'View\')]'));
                btnView.click().then(function()
                {
                   CustomLib.WaitForSpinnerInvisible();
                   browser.sleep(2000);
                   CustomLib.navigateToWindowWithUrlContains("pdfDocuments",2);
                   CustomLib.closeWindowUrlContains("pdfDocuments");
                   CustomLib.navigateToWindow("LLC Lawyer Portal",1);
                   browser.sleep(2000);
               })
               
            }
            return IsPresent;
        }, (error) => {
            expect(false).toBe(true, 'Document not present');})
    }

    this.ClickLenDocViewNew = function (docName, DocUploadDate) {
        browser.sleep(1000);

        var waitForDoc = function () {
        return element.all(by.xpath('//tbody/tr/td[contains(text(),\'' + docName + '\')]/parent::tr')).count().then(function(count){
         
                if(count>0)
                {
                    return true;
                }
            })
        }

        return browser.wait(waitForDoc, 25000).then(function(IsPresent)
        {
            expect(IsPresent).toBe(true,"Document not founder under Lender Doc Grid "+ docName);
            if(IsPresent)
            {   
             
                var rowcol = element(by.xpath('//tbody/tr/td[contains(text(),\'' + docName + '\')]/parent::tr/td[2]'));
                var colText = rowcol.getText();
                browser.wait(EC.visibilityOf(colText), 60000, 'Documnets table is not available');
               
                colText.then(function (datetxt) {
                    var dateSplit = datetxt.split(",");
                    datetxt = dateSplit[0] + "," + dateSplit[1];
                    expect(datetxt).toEqual(DocUploadDate,"Document Date");

                })  

                var btnView =  element(by.xpath('//tbody/tr/td[contains(text(),\'' + docName + '\')]/parent::tr/td[3]/span/button[contains(text(), \'View\')]'));
                btnView.click().then(function()
                {
                   // ManageDocuments.ClickDocument();
                    browser.sleep(1000);
                    CustomLibrary.navigateToWindowWithUrlContains("mortgagedocuments.ca",2);
                    CustomLibrary.WaitForSpinnerInvisible();
                    browser.sleep(1500);
                    CustomLibrary.closeWindowUrlContains("mortgagedocuments.ca");
                    browser.sleep(2000);
                    CustomLibrary.navigateToWindow("LLC Lawyer Portal",1); 
                    
               })
               
            }
            return IsPresent;
        }, (error) => {
            expect(false).toBe(true, 'Document not present');})
    }
            
    var WaitForLenderDocEntryNew = function (colVal) {
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

   this.WaitUntilLenderDocEntry = function (colVal) {
        browser.sleep(WaitForLenderDocEntryNew(colVal), 120000);
    } 
              
            

     this.VerifyStatusViewDocTimeStamp = function (docName, status) {
        browser.sleep(1000);
        var TimeStamp;
        CustomLib.ScrollUp(0,5000);

         element.all(by.xpath('//tbody/tr/td[contains(text(),\'' + docName + '\')]/parent::tr')).count().then(function(count)
         {
             expect(count).toBeGreaterThan(0,"Document not founder under Lawyer Doc Grid "+ docName);
             if(count > 0)
             {
                 var rowcol = element(by.xpath('//tbody/tr/td[contains(text(),\'' + docName + '\')]/parent::tr/td[2]'));
                 rowcol.getText().then(function (txt) {
                 console.log(txt);
                 expect(txt).toContain(status,"Document Status");
                
                })

                var rowcolTime = element(by.xpath('//tbody/tr/td[contains(text(),\'' + docName + '\')]/parent::tr/td[3]'));
                rowcolTime.getText().then(function (Dateval) {
                TimeStamp = Dateval;
                console.log('RFF TimeStamp: ' + TimeStamp);
                 
                })
                
                 var btnView =  element(by.xpath('//tbody/tr/td[contains(text(),\'' + docName + '\')]/parent::tr/td[4]/span/button[contains(text(), \'View\')]'));
                // btnView.click();
                // CustomLib.WaitForSpinnerInvisible();
                // CustomLib.ClosePopup();

                 btnView.click().then(function()
                 {
                     CustomLib.WaitForSpinnerInvisible();
                     browser.sleep(2000);
                     CustomLib.navigateToWindowWithUrlContains("pdfDocuments",2);
                     CustomLib.closeWindowUrlContains("pdfDocuments");
                     CustomLib.navigateToWindow("LLC Lawyer Portal",1);
                     browser.sleep(2000);
                 })
             }

             else {
                 console.log('doc not found')
             }
         })
     }

     this.VerifyAdditionalDocsNew = function (DocName) {

        element(by.css("input[formControlName=documentName]")).sendKeys(DocName);
        element(by.css("input[formControlName=uploadFile]")).sendKeys(DocumentPath);
        browser.sleep(1000);
        element(by.id("btnUpload")).click();
        var found = "false";
        browser.sleep(5000);

        var SuccessMsg = element(by.css('.msg-container.ng-star-inserted'))
        var EC = protractor.ExpectedConditions;
        browser.wait(EC.visibilityOf(SuccessMsg), 45000,  'Waiting for Home element to become visible').then(() => {
        CustomLib.scrollIntoView(SuccessMsg);
        browser.sleep(1000);
        expect(SuccessMsg.getText()).toContain("Other-" + DocName + " was uploaded successfully.");
         })
        element.all(by.xpath('//tbody/tr/td[contains(text(),\'' + DocName + '\')]/parent::tr')).count().then(function(count)
        {
            expect(count).toBeGreaterThan(0,"Document not founder under Lawyer Doc Grid "+ DocName);
            if(count > 0)
            {
                var rowcol = element(by.xpath('//tbody/tr/td[contains(text(),\'' + DocName + '\')]/parent::tr/td[2]'));
                rowcol.getText().then(function (txt) {
                console.log(txt);
                expect(txt).toContain("Uploaded","Document Status");

                })

                var rowcol = element(by.xpath('//tbody/tr/td[contains(text(),\'' + DocName + '\')]/parent::tr/td[3]'));
                rowcol.getText().then(function (Dateval) {
                console.log(Dateval);
                expect(Dateval).not.toEqual(null, 'Date column is blank');

                })

            }
        })

    }

    this.VerifyAdditionalDocsMD = function (DocName) {

        element(by.css("input[formControlName=documentName]")).sendKeys(DocName);
        element(by.css("input[formControlName=uploadFile]")).sendKeys(DocumentPath);
        browser.sleep(1000);
        element(by.id("btnUpload")).click();
  
    }
        
     this.clickLenderDocView = function (docName) {
 
        element.all(by.xpath('//tbody/tr/td[contains(text(),\'' + docName + '\')]/parent::tr')).count().then(function(count)
        {
            expect(count).toBeGreaterThan(0,"Document not founder under Lender Doc Grid "+ docName);
            if(count > 0)
            {
                var btnView =  element(by.xpath('//tbody/tr/td[contains(text(),\'' + docName + '\')]/parent::tr/td[3]/span/button[contains(text(), \'View\')]'));
               // btnView.click();
              //  CustomLib.WaitForSpinnerInvisible();
               // CustomLib.ClosePopup();

                btnView.click().then(function()
                {
                    CustomLib.WaitForSpinnerInvisible();
                    browser.sleep(2000);
                    CustomLib.navigateToWindowWithUrlContains("pdfDocuments",2);
                    CustomLib.closeWindowUrlContains("pdfDocuments");
                    CustomLib.navigateToWindow("LLC Lawyer Portal",1);
                    browser.sleep(2000);
                })
            }
        })
    }

    this.ConfirmDocRegenerate = function (type) {

        //browser.sleep(1000);
        if (type == 'OK') {
           
            browser.sleep(5000);
            btnOKafterSubmit.click();
        }
        if (type == 'Cancel') {
           
            browser.sleep(5000);
            btnCancel.click();
        }
    
       // browser.sleep(2000);
    }

   
    this.ClickCreateEnglishDocumentNew = function (docName) {
        CustomLib.ScrollUp(0,5000);
        return  element.all(by.xpath('//tbody/tr/td[contains(text(),\'' + docName + '\')]/parent::tr')).count().then(function(count)
        {
            expect(count).toBeGreaterThan(0,"Document not founder under Lawyer Doc Grid "+ docName);
            if(count > 0)
            {
                var linkCreateEn =  element(by.xpath('//tbody/tr/td[contains(text(),\'' + docName + '\')]/parent::tr/td/span/button[contains(text(), \'Create En\')]'));
                linkCreateEn.click();
                CustomLib.WaitForSpinnerInvisible();
                browser.sleep(1500);
               
            }
            return count;
        })
    }

    this.ClickCreateEnglishDocumentNew2 = function (docName) {
        CustomLib.ScrollUp(0,5000);
        var waitForDoc = function () {
            return element.all(by.xpath('//tbody/tr/td[contains(text(),\'' + docName + '\')]/parent::tr')).count().then(function(count) {
                if(count>0)
                {
                    return true;
                }
            })
        }

        return browser.wait(waitForDoc, 25000).then(function(IsPresent)
        {
            expect(IsPresent).toBe(true,"Document not founder under Lawyer Doc Grid "+ docName);
            if(IsPresent)
            {
                var linkCreateEn =  element(by.xpath('//tbody/tr/td[contains(text(),\'' + docName + '\')]/parent::tr/td/span/button[contains(text(), \'Create En\')]'));
                linkCreateEn.click();
                CustomLib.WaitForSpinnerInvisible();
                browser.sleep(1500);
               
            }
            return IsPresent;
        }, (error) => {
            expect(false).toBe(true, 'Doc not present');})
    }


    this.ClickCreateFrenchDocumentNew = function (docName) {
        browser.sleep(4000);
        element.all(by.xpath('//tbody/tr/td[contains(text(),\'' + docName + '\')]/parent::tr')).count().then(function(count)
        {
            expect(count).toBeGreaterThan(0,"Document not founder under Lawyer Doc Grid "+ docName);
            if(count > 0)
            {
               
               var linkCreateFr =  element(by.xpath('//tbody/tr/td[contains(text(),\'' + docName + '\')]/parent::tr/td[4]/span/button[contains(text(), \'Create Fr\')]'));
                linkCreateFr.click();
                CustomLib.WaitForSpinnerInvisible();
                browser.sleep(1500);
               
            }
        })
    }

    this.ClickCreateFrenchDocumentNew2 = function (docName) {
        CustomLib.ScrollUp(0,5000);
        var waitForDoc = function () {
            return element.all(by.xpath('//tbody/tr/td[contains(text(),\'' + docName + '\')]/parent::tr')).count().then(function(count) {
                if(count>0)
                {
                    return true;
                }
            })
        }

        return browser.wait(waitForDoc, 25000).then(function(IsPresent)
        {
            expect(IsPresent).toBe(true,"Document not founder under Lawyer Doc Grid "+ docName);
            if(IsPresent)
            {
                var linkCreateFr =  element(by.xpath('//tbody/tr/td[contains(text(),\'' + docName + '\')]/parent::tr/td[4]/span/button[contains(text(), \'Create Fr\')]'));
                linkCreateFr.click();
                CustomLib.WaitForSpinnerInvisible();
                browser.sleep(1500);
               
            }
            return IsPresent;
        }, (error) => {
            expect(false).toBe(true, 'Doc not present');})
    }

    this.ClickRegenerateDocument = function (docName) {
        
        element.all(by.xpath('//tbody/tr/td[contains(text(),\'' + docName + '\')]/parent::tr')).count().then(function(count)
        {
            expect(count).toBeGreaterThan(0,"Document not founder under Lawyer Doc Grid "+ docName);
            if(count > 0)
            {
                var lnkRegenerate =  element(by.xpath('//tbody/tr/td[contains(text(),\'' + docName + '\')]/parent::tr/td[4]/span/button[contains(text(), \'Regenerate\')]'));
                
                browser.sleep(5000);                     
                lnkRegenerate.click();
                CustomLib.WaitForSpinnerInvisible();
                browser.sleep(1500);
               
            }
        })
    }

    this.ClickRegenerateDocumentNew2 = function (docName) {
        CustomLib.ScrollUp(0,5000);
        var waitForDoc = function () {
            return element.all(by.xpath('//tbody/tr/td[contains(text(),\'' + docName + '\')]/parent::tr')).count().then(function(count) {
                if(count>0)
                {
                    return true;
                }
            })
        }

        return browser.wait(waitForDoc, 25000).then(function(IsPresent)
        {
            expect(IsPresent).toBe(true,"Document not founder under Lawyer Doc Grid "+ docName);
            if(IsPresent)
            {
                var lnkRegenerate =  element(by.xpath('//tbody/tr/td[contains(text(),\'' + docName + '\')]/parent::tr/td[4]/span/button[contains(text(), \'Regenerate\')]'));
                browser.sleep(5000);                     
                lnkRegenerate.click();
                CustomLib.WaitForSpinnerInvisible();
                browser.sleep(1500);
               
            }
            return IsPresent;
        }, (error) => {
            expect(false).toBe(true, 'Doc not present');})
    }

    this.ClickUploadDocument = function (docName) {
        var inputBox =  element(by.css('input[type="file"]'));
        browser.sleep(2000);
        element.all(by.xpath('//tbody/tr/td[contains(text(),\'' + docName + '\')]/parent::tr')).count().then(function(count)
        {
            expect(count).toBeGreaterThan(0,"Document not founder under Lawyer Doc Grid "+ docName);
            if(count > 0)
            {
                
                var lnkUpload =  element(by.xpath('//tbody/tr/td[contains(text(),\'' + docName + '\')]/parent::tr/td[4]/span/button[contains(text(), \'Upload\')]'));
                inputBox.sendKeys(DocumentPath);
                
                lnkUpload.click();
                CustomLib.WaitForSpinnerInvisible();
                browser.sleep(5000);
                
                CustomLib.WaitNClick(btnOkRffSubmit);
                CustomLib.WaitForSpinner();
                CustomLib.WaitForSpinnerInvisible();
                
                
                
               
            }
        })
    }
   
    this.EnterDocumentName = function (DocName) {
        var documentName = element(by.css("input[formControlName=documentName]"));
        documentName.sendKeys(DocName);
        expect(documentName.isEnabled()).toBe(true, 'Document name field is disabled');
        
    };

    this.VerifyClosedDealMsg = function (Msg) {

        //var ClosedMsg = element(by.css('.msg-container.ng-star-inserted')).all(by.css('.d-flex.my-1.ng-star-inserted')).get(0);
        var ClosedMsg = element(by.css('.msg-container.ng-star-inserted'));
    
        CustomLib.scrollIntoView(ClosedMsg);
        expect(ClosedMsg.getText()).toContain(Msg);
    }

    this.VerifyAdditionalDocs = function (DocName) {

        element(by.css("input[formControlName=documentName]")).sendKeys(DocName);
        element(by.css("input[formControlName=uploadFile]")).sendKeys(DocumentPath);
        browser.sleep(1000);
        element(by.id("btnUpload")).click();
        var found = "false";
        browser.sleep(5000);

        var SuccessMsg = element(by.css('.msg-container.ng-star-inserted'))
        
        CustomLib.scrollIntoView(SuccessMsg);
        
        browser.sleep(1000);
        expect(SuccessMsg.getText()).toContain("Other-" + DocName + " was uploaded successfully.");
        
        var rows = tabBodyLawyerDocs.all(by.tagName('tr'));
        rows.each(function (row, rowindex) {
            var cols = row.all(by.tagName('td'));
            cols.get(0).getText().then(function (DocupdName) {
                if (DocupdName.trim() == "Other-" + DocName.trim()) {
                    console.log(DocupdName);
                    found = "true";
                    cols.get(1).getText().then(function (Status) {

                        expect(Status).toEqual("Uploaded","Status of Document");

                    });
                    cols.get(2).getText().then(function (Dateval) {
                        expect(Dateval).not.toEqual('');
                    });
                }
            });


        }).then(function () {
            expect(found).toEqual("true");
        });
        browser.sleep(1000);
    };

    this.ClickNeedHelp = function () {
        var EC = protractor.ExpectedConditions;
        browser.wait(EC.visibilityOf(lnkNeedHelp), 45000,  'Waiting for Home element to become visible').then(() => {
            CustomLib.scrollIntoView(lnkNeedHelp);
            lnkNeedHelp.click();
            }, (error) => {
                    expect(lnkNeedHelp.isDisplayed()).toBe(true);
        })  
    }

    this.clickLawyerUploadDoc = function () {
        CustomLib.ScrollUp(0,2000);
        element(by.css('input[type="file"]')).sendKeys(DocumentPath);
        browser.sleep(5000);
        CustomLib.WaitForSpinner();
        CustomLib.WaitForSpinnerInvisible();
        var rows = tabBodyLawyerDocs.all(by.tagName('tr'));
        return rows.each(function (row, rowindex) {
            var cols = row.all(by.tagName('td'));
            if (rowindex == 0) {
                cols.get(0).getText().then(function (Name) {
                    documentName = Name;

                });
                browser.sleep(3000);
                cols.get(1).getText().then(function (Status) {

                    expect(Status).toEqual("Uploaded");

                })
                cols.get(2).getText().then(function (Dateval) {
                    expect(Dateval).not.toBeNull();
                });

                cols.get(3).all(by.css('.btn.btn-link.tableLink.p-0')).get(0).click();
                CustomLib.WaitForSpinner();
                CustomLib.WaitForSpinnerInvisible();
            }
        }).then(function () {

            return documentName;
        });
        
    }

    this.checkTimeStamp = function (DocSearch) {
        browser.sleep(1000);
        var TimeStamp;
        var found = "false";
        var rows = tabBodyLawyerDocs.all(by.tagName('tr'));
        rows.each(function (row, rowindex) {
            var cols = row.all(by.tagName('td'));
            cols.get(0).getText().then(function (DocName) {
                if (DocName.trim() == DocSearch) {
                    found = "true";
                    cols.get(1).getText().then(function (Status) {
                        expect(Status).toEqual("Submitted");

                    });
                    cols.get(2).getText().then(function (Dateval) {
                         TimeStamp = Dateval;
                    
                        
                    });
                }
            });
        }).then(function () {
            console.log("TimeStamp = " + TimeStamp);
            return TimeStamp;
        });
    }

    this.ClickSaveButton = function() {
        //browser.sleep(1500);
        var btnSave = element(by.xpath("//div[@class=\'Generic_Undertaking_EN\']//input"));
        browser.wait(EC.visibilityOf(btnSave), 35000, 'Save button is not available');
        btnSave.click();
                
    }

    this.ClickSaveButtonBNS = function() {
        //browser.sleep(3500);
        var btnSave = element(by.xpath("//div[@class=\'Form_1150413c\']//input"));
        browser.wait(EC.visibilityOf(btnSave), 15000, 'Save button is not available');
        btnSave.click();
                
    }
    
    this.ClickSaveButtonTDRegenerate = function() {
               
        var btnSave = element(by.xpath("//div[@class=\'mainDiv\']//input"));
        browser.wait(EC.visibilityOf(btnSave), 65000, 'Save button is not available');
        btnSave.click();
                
    }

    this.ClickSaveButtonTDFrench = function() {
        //browser.sleep(2000);
        var btnSave = element(by.id('Sauvegarder'));
        browser.wait(EC.visibilityOf(btnSave), 35000, 'Save button is not available');
        btnSave.click();
                
    }

    this.ClickSaveButtonTD = function() {
        //browser.sleep(2500);
        var btnSave = element(by.xpath("//div[@class=\'FORMTD-530660\']//input"));
        browser.wait(EC.visibilityOf(btnSave), 15000, 'Save button is not available');
        btnSave.click();
                
    }


    this.clickLawyerDocView = function (DocSearch) {
        browser.sleep(5000);
        var found = "false";
        var rows = tabBodyLawyerDocs.all(by.tagName('tr'));
        rows.each(function (row, rowindex) {
            var cols = row.all(by.tagName('td'));
            cols.get(0).getText().then(function (DocName) {
                if (DocName.trim() == DocSearch) {
                    found = "true";
                    cols.get(1).getText().then(function (Status) {
                        expect(Status).toEqual("Submitted");
                    });

                    cols.get(3).all(by.css('.btn.btn-link.tableLink.p-0')).get(0).click();
                }
            });
        }).then(function () {
            expect(found).toEqual("true","Document is present under Lawyer Documents");
        });
    }


    this.ClickSaveButtonBNSFrench = function() {
        //browser.sleep(3000);
        var btnSave = element(by.xpath("//div[@class=\'Form_1150438\']//input"));
        browser.wait(EC.visibilityOf(btnSave), 15000, 'Save button is not available');
        btnSave.click();
                
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

    this.ClickDocument = function() {
        browser.sleep(1500);
        var docLink = element(by.css('.btn-link.fct'));
        expect(docLink.isPresent()).toBe(true, 'Document link is not present');
        docLink.click();
        browser.sleep(1500);
      //  CustomLib.CloseTab();
    }

    this.VerifySuccessMessage = function (SavedMsg) {

        var SuccessMsg = element(by.css('.msg-container.ng-star-inserted'));
        browser.wait(EC.visibilityOf(SuccessMsg), 55000, 'Success message is not available');
        CustomLib.scrollIntoView(SuccessMsg);
        browser.sleep(500);
        expect(SuccessMsg.getText()).toContain(SavedMsg, 'Success Message is not present');
    }
 
    this.ClickCreateFrenchDocument = function (DocName) {

        tbBody.all(by.tagName('tr')).then(function (rows) {

            rows.forEach(function (row) {

                row.getText().then(function (txt) {

                    if (txt.includes(DocName)) {
                        CustomLib.scrollIntoView(row.element(by.cssContainingText('button', 'Create Fr')))
                        row.element(by.cssContainingText('button', 'Create Fr')).click();
                        //browser.sleep(10000);
                        //CustomLib.SwitchTab(1);
                    }


                })

            })

        })


    }
    this.ClickCreateEnglishDocument = function (DocName) {

        tbBody.all(by.tagName('tr')).then(function (rows) {

            rows.forEach(function (row) {

                row.getText().then(function (txt) {

                    if (txt.includes(DocName)) {
                        CustomLib.scrollIntoView(row.element(by.cssContainingText('button', 'Create En')))
                        row.element(by.cssContainingText('button', 'Create En')).click();
                    }
                })
            })
        })
    }
    this.RegenereateDocument = function (DocName) {

        tbBody.all(by.tagName('tr')).then(function (rows) {

            rows.forEach(function (row) {

                row.getText().then(function (txt) {

                    if (txt.includes(DocName)) {
                        CustomLib.scrollIntoView(row.element(by.cssContainingText('button', 'Create Fr')))
                        row.element(by.cssContainingText('button', 'Regenerate')).click();
                        //browser.sleep(10000);
                        //CustomLib.SwitchTab(1);
                    }


                })

            })

        })
    }
    this.ConfirmRegeneration = function (bool) {
        CustomLib.WaitForElementPresent(element(by.css('.btn.btn-danger.btn-sm.fct.mr-2.mt-2')));
        if (bool) {
            //CustomLib.SendTabEnter(2) 
            element(by.css('.btn.btn-success.btn-sm.fct.mt-2')).click();
        }
        else {
            element(by.css('.btn.btn-danger.btn-sm.fct.mr-2.mt-2')).click();
            // CustomLib.SendTabEnter(1) 
        }

    }

    this.checkTimeStamp = function (DocSearch) {
        browser.sleep(1000);
        var TimeStamp;
        var found = "false";
        var rows = tabBodyLawyerDocs.all(by.tagName('tr'));
        rows.each(function (row, rowindex) {
            var cols = row.all(by.tagName('td'));
            cols.get(0).getText().then(function (DocName) {
                if (DocName.trim() == DocSearch) {
                    found = "true";
                    cols.get(1).getText().then(function (Status) {
                        expect(Status).toEqual("Submitted");

                    });
                    cols.get(2).getText().then(function (Dateval) {
                         TimeStamp = Dateval;
                    
                        
                    });
                }
            });
        }).then(function () {
            console.log("TimeStamp = " + TimeStamp);
            return TimeStamp;
        });
    }

    

       this.ReturnSolicitorPackageDate = function()
    { 
    
        return element(by.xpath(".//app-documents/app-document-grid[1]//table/tbody/tr/td[contains(text(),\"Solicitor\")]/parent::tr/td[2]")).getText().then(function(txt)
        {
                console.log(txt);
                return txt;
                        })
    }
   this.VerifyOnlyViewButtonsEnabled = function () {
    CustomLib.ScrollDown(0,100000);
        var NumbofRows = tbBody.all(by.tagName('tr')).length;
       // var tblrow ;
        for (var rowNumb = 0; rowNumb < NumbofRows; rowNumb++) 
        {
            element(by.xpath('//tbody/tr['+ rowNumb + ']/td[2]')).getText().then(function(txt)
                {
                    if(txt == "Submitted")
                    {
                        element(by.xpath('//tbody/tr['+ rowNumb + ']')).all(by.tagName('button')).then(function (buttons) {
                            buttons.forEach(function (button) {
                                button.getText().then(function (txt) {
                                    if (txt == 'View') { 
                                        console.log("Text is" + txt)
                                        expect(button.isEnabled()).toBe(true, "View button is Enabled") 
                                    }
                                    else { 
                                        expect(button.isEnabled()).toBe(false, txt + " Button is Disabled") 
                                    }
                
                                })
                
                            })
                
                        })
                    }

                });
        }
    }

    this.VerifyAllButtonsDisabled = function () {
        CustomLib.ScrollDown(0,50000);
        var NumbofRows = tbBody.all(by.tagName('tr')).length;
        //var tblrow ;
        for (var rowNumb = 0; rowNumb < NumbofRows; rowNumb++) 
        {
            element(by.xpath('//tbody/tr['+ rowNumb + ']/td[2]')).getText().then(function(txt)
                {
                    if(txt == "Submitted")
                    {
                        element(by.xpath('//tbody/tr['+ rowNumb + ']')).all(by.tagName('button')).then(function (buttons) {
                            buttons.forEach(function (button) {
                                button.getText().then(function (txt) {
                                    if (txt == 'Upload' || 'Regenerate' || 'Create Fr' || 'create En') { 
                                        console.log("Text is" + txt)
                                        expect(button.isEnabled()).toBe(false, txt + " Button is Disabled") 
                                    }
                                    else { 
                                        expect(button.isEnabled()).toBe(true, "View button is Enabled") 
                                        
                                    }
                
                                })
                
                            })
                
                        })
                    }

                });
        }
    }

  
   
 /* this.VerifyOnlyViewButtonsEnabled = function () {
        tbBody.all(by.tagName('button')).then(function (buttons) {
            buttons.forEach(function (button) {
                button.getText().then(function (txt) {
                    if (txt == 'View') { 
                        console.log("Text is" + txt)
                        expect(button.isEnabled()).toBe(true, "View button is Enabled") 
                    }
                    else { 
                        expect(button.isEnabled()).toBe(false, txt + " Button is Disabled") 
                    }

                })

            })

        })

    }
*/

    this.VerifyCreatedDocument = function (DocName) {
        var lblSuccess = element(by.xpath("//app-message-bar/div/div/div[2]/p"));
        CustomLib.WaitforElementVisible(lblSuccess);
        expect(lblSuccess.getText()).toContain(DocName, "Document is not created successfully.");

    }
    this.VerifyUploadedDocument = function (DocName) {

        expect(element(by.cssContainingText('p', DocName + " was uploaded successfully.")));

    }
    this.SaveCreatedDocument = function () {
        var btnCreate = element(by.xpath('//*[@id="form1"]/div[1]/input'));
        var until = protractor.ExpectedConditions;
        return browser.wait(until.presenceOf(btnCreate), 90000, "").then(() => {     
            btnCreate.click();
            browser.sleep(10000);
        }, (error) => {
            expect(true).toBe(false, "Save Button on document is not visible");
        })
    }


    this.ViewLenderDocuments = function () {
        var btnView = tblLenderDocument.all(by.tagName('tr')).get(0).all(by.tagName('td')).get(2).element(by.buttonText('View'));
        btnView.click();

    }

       this.VerifyDisableBrowseButton = function () {
        //CustomLib.dynamicWait(btnBrowse);
        CustomLib.ScrollDown(0,10000);
        expect(btnBrowse.isEnabled()).toBe(false,"Expected Browse button to be disabled");
        
    }

    this.VerifyClosedRequestMsg = function() {
        var StatusMsg = element(by.css('.msg-container.ng-star-inserted'));
        var ClosedRequestMessage = TestData.data[Lang].Messages.ClosedDealMsg;
        expect(StatusMsg.getText()).toContain(ClosedRequestMessage,'Closed deal message is not present.');
    }

    this.VerifyEnableBrowseButton = function () {
        //CustomLib.dynamicWait(btnBrowse);
        CustomLib.ScrollDown(0,10000);
        expect(btnBrowse.isEnabled()).toBe(true,"Expected Browse button to be enabled");
        
    }

    this.VerifyBrowseButtonStatus = function (Status) {

        CustomLib.WaitforElementVisible(lblAdditionalDoc);
        CustomLib.scrollIntoView(lblAdditionalDoc);

        if (Status == 'Disabled') {
            expect(btnBrowse.isEnabled()).toBe(false);
        }
        if (Status == 'Enabled') {
            expect(btnBrowse.isEnabled()).toBe(true);
        }
    }

    this.VerifyLenderDocumentsView = function (Status) {

        CustomLib.scrollIntoView(lblLenderDoc);
        browser.wait(EC.visibilityOf(tbBodyLender), 15000, 'Lender documents table is not available');
        var NumbofRows = tbBodyLender.all(by.tagName('tr')).length;

        if (Status == 'Disabled') {
            for (var rowNumb = 0; rowNumb < NumbofRows; rowNumb++) {
                expect(tbBodyLender.all(by.tagName('tr')).get(rowNumb).all(by.tagName('td')).get(2).element(by.tagName('button')).isEnabled()).toBe(false);
            }
        }
        if (Status == 'Enabled') {
            for (var rowNumb = 0; rowNumb < NumbofRows; rowNumb++) {
                expect(tbBodyLender.all(by.tagName('tr')).get(rowNumb).all(by.tagName('td')).get(2).element(by.tagName('button')).isEnabled()).toBe(true);
            }
        }
    }

    this.RegenerateOtherDocuments = function () {

        CustomLib.scrollIntoView(lblLenderDoc);
        browser.wait(EC.visibilityOf(tbBodyLender), 15000, 'Lender documents table is not available');
        var NumbofRows = tbBodyLender.all(by.tagName('tr')).length;
        tbBodyLender.all(by.tagName('tr')).get(rowNumb).all(by.tagName('td')).get(2).element(by.tagName('button')).click();
    }

    this.UploadAdditionalDocument = function (DocName = 'Name') {
        //browser.sleep(2000);
        CustomLib.scrollIntoView(lblAddDoc);
        CustomLib.WaitforElementVisible(DocumentName)
        DocumentName.sendKeys(DocName);
        //btnBrowse.click();
        var filePath = CustomLib.GetFilePathToUpload("../TestData/MMS", "test.pdf");
       // var fileTxtBox = element(by.xpath('//app-documents/app-additional-documents/form/app-panel/div/div[2]/div[3]/div/div/input'));
       
       // fileTxtBox.sendKeys(filePath);
        element(by.xpath('//app-documents/app-additional-documents/form/app-panel/div/div[2]/div[3]/div/div/input')).sendKeys(filePath);

        CustomLib.WaitForSpinnerInvisible();
        //DocumentName.sendKeys(DocName);
        CustomLib.WaitforElementVisible(UploadBtn);// Sept 16
        CustomLib.WaitNClick(UploadBtn);
 
      //  UploadBtn.click(); Sept 16
        browser.sleep(10000);
      CustomLib.WaitForSpinner();
      CustomLib.WaitForSpinnerInvisible();
    };

    this.NavigateAwayAcceptReject = function (buttonSelect) {
        browser.sleep(3500);
        CustomLib.WaitForSpinnerInvisible();
        if (buttonSelect == 'Cancel') {
            CustomLib.WaitNClick(navigateAwyStay);
        }
        if (buttonSelect == 'OK') {
            CustomLib.WaitNClick(navigateAwyLeave);
        }
        CustomLib.WaitforElementInvisible(element(by.css('.modal-content')));
    }

    this.VerifyMsgMD = function (Msg) {

        var ManageDocMsgs = element(by.css('.msg-container.ng-star-inserted'))
        CustomLib.scrollIntoView(ManageDocMsgs);
        browser.sleep(500);
        expect(ManageDocMsgs.getText()).toContain(Msg, 'Amendment message is not present for create/regenerate document');
    }

    this.VerifyUploadAmdMsg = function (Msg) {

        var ManageDocMsgs = element(by.css('.msg-container.ng-star-inserted'))
        CustomLib.scrollIntoView(ManageDocMsgs);
        browser.sleep(500);
        expect(ManageDocMsgs.getText()).toContain(Msg, 'Amendment message is not present for upload document');
    }

    this.VerifyLinkOnNeedHelpPage = function () {
        var guideLink = element(by.css('.btn-link.fct.ml-2'));
        expect(guideLink.isPresent()).toBe(true, 'LLC Guide link is not present');
        browser.sleep(1000);
        //CustomLib.CloseTab();

    }

    this.VerifyNavigateAway = function () {
        CustomLib.WaitforElementVisible(navigateAwyPopupMsg);
        expect(navigateAwyPopup.isDisplayed()).toBe(true);
        expect(navigateAwyPopupMsg.getText()).toBe(NavigateAwyPopupMsg);
        expect(navigateAwyStay.isDisplayed()).toBe(true);
        expect(navigateAwyLeave.isDisplayed()).toBe(true);

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

    this.VerifyPIFDocs = function (name) {
       
        browser.wait(EC.visibilityOf(tbBody), 60000, 'Documnets table is not available');
     
     return element.all(by.cssContainingText('td', name)).count().then(function (count) {
            expect(count).not.toBeGreaterThan(0, "Document " + name + " is present");
             
            return count;
         }); 
         
        
        
   
             
    };

};

module.exports = new ManageDocs();