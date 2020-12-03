'use strict';
var path = require('path');
var TestData = require('../../testData/TestData.js');
var Runsettings = require('../../testData/RunSetting.js');
var Lang = Runsettings.data.Global.LANG.value;
var CustomLib = require('../../CustomLibrary/CustomLibrary.js');
var MenuPanel = require('../../PageObjectMethods/LLCUnityPortal/MenuPanel.js');
var PIFOntarioJson = require('../../TestData/MMS/PIF/PIF_ON_Questions.json');
var PIFAlbertaJson = require('../../TestData/MMS/PIF/PIF_AB_Questions.json');
var PIFManitobaJson = require('../../TestData/MMS/PIF/PIF_MB_Questions.json');
var PIFNewBanJson = require('../../TestData/MMS/PIF/PIF_NB_Questions.json');
var PIFBritishColJson = require('../../TestData/MMS/PIF/PIF_BC_Questions.json');
var PIFSaskatchewanJson = require('../../TestData/MMS/PIF/PIF_SK_Questions.json');
var fileToUploadDynamic = '../../testData/MMS/Lawyer'
var counter = 0;

var PreFundingInfomation = function () {

    //Buttons
    var btnSave = element(by.buttonText('Save'));
    var btnSubmit = element(by.buttonText('Submit'));
 
 
    //Solicitor Instruction Satisfied
    var TypeofEstate = element(by.css('.jumbotron.box-outer.ng-untouched.ng-pristine.ng-valid'));
    var Env = Runsettings.data.Global.ENVIRONMENT.value;
    var lblTitleNumber = element(by.css('.form-group.col-md-4.ng-star-inserted')).element(by.tagName('label'));
    var btnSavePreFundInfo = element(by.css('.btn.btn-primary.fct.ng-star-inserted'));
    var btnSubmitPreFundInfo = element(by.css('.btn.btn-success.fct'));
    var btnOkLayerSelection = element(by.css('.btn.btn-success.btn-sm.fct.mt-2'));
    var lblLRONumber = element(by.css('.form-group.col-md-4.ng-star-inserted'));
    var lblLRONo = element.all(by.css('.form-group.col-md-4.ng-star-inserted')).get(0).all(by.tagName('label')).get(0);
    var MsgBox = element(by.css('.modal-body'));
    var addField = element(by.id('question-230403'));
    var addFieldSK = element(by.id('question-10003'));

    this.checkValueAvailable = function () {
        counter = 0;
        recursiveValueCheck();

    }

    var recursiveValueCheck = function () {
        TypeofEstate.isPresent().then(function (txt) {
            MenuPanel.PrimaryMenuNavigateTo('PreFundingInformation');
            if (txt == true || counter > 10) {

                return true;
            }
            else {
                MenuPanel.PrimaryMenuNavigateTo('Home');
                counter++;
                browser.sleep(2000);
                recursiveValueCheck();

            }
        });
    }


    this.AnswerPIFQuestionsAllProvinces = function (Province, Scenario) {
       if(Province =='ONTARIO')
       {
            PIFOntarioJson.forEach( function (row) {
                if(row['Scenario']==Scenario)
                {
                    AnswerPIFQuestion(row['Questions'] , row['Answer'], row['Additional Details'], row['Additional Doc Section'], row['Additional Amount']);
                }
            })
       }
       else if (Province =='ALBERTA')
       {
            PIFAlbertaJson.forEach( function (row) {
                if(row['Scenario']==Scenario)
                {
                    AnswerPIFQuestion(row['Questions'] , row['Answer'], row['Additional Details'], row['Additional Doc Section'],row['Additional Amount']);
                }
            })
       }
       else if (Province =='MANITOBA')
       {
            PIFManitobaJson.forEach( function (row) {
                if(row['Scenario']==Scenario)
                {
                    AnswerPIFQuestion(row['Questions'] , row['Answer'], row['Additional Details'], row['Additional Doc Section'],row['Additional Amount']);
                }
            })
       }
       else if (Province =='NEW BRUNSWICK')
       {
                 PIFNewBanJson.forEach( function (row) {
                if(row['Scenario']==Scenario)
                {
                    AnswerPIFQuestion(row['Questions'] , row['Answer'], row['Additional Details'], row['Additional Doc Section'],row['Additional Amount']);
                }
            })
       }
       else if (Province =='BRITISH COLUMBIA')
       {
        PIFBritishColJson.forEach( function (row) {
                if(row['Scenario']==Scenario)
                {
                    AnswerPIFQuestion(row['Questions'] , row['Answer'], row['Additional Details'], row['Additional Doc Section'],row['Additional Amount']);
                }
            })
       } 
       else if (Province =='SASKATCHEWAN')
       {
        PIFSaskatchewanJson.forEach( function (row) {
                if(row['Scenario']==Scenario)
                {
                    AnswerPIFQuestion(row['Questions'] , row['Answer'], row['Additional Details'], row['Additional Doc Section'],row['Additional Amount']);
                }
            })
       }       
    }

    var AnswerPIFQuestion = function(Question, Answer,AdditionalDetails, DocumentSection,AdditionalAmount)
    {
        element.all(by.xpath("//span[text()= '" + Question + "' ]")).count().then(function(count)
         {  
             expect(count).toBeGreaterThan(0, "Question is not found: "+ Question);
             if(count > 0 )
             {     
                if(Answer != "NA")
                {
                    var radiobutton =  element(by.xpath("//span[text()= '" + Question + "' ]//parent::label/following-sibling::div//span[text()='" + Answer + "']/parent::label/preceding-sibling::input"));
                    radiobutton.click();
                    if(AdditionalDetails != "NA")
                    {
                        var txtboxAdditionalDetails = element(by.xpath("//span[text()='" + Question + "']/parent::label/following-sibling::div//textarea"));
                        txtboxAdditionalDetails.sendKeys(AdditionalDetails);
                    }   
                } 
                
                if(DocumentSection == "Yes")
                {
                    element.all(by.xpath("//span[text()='" + Question + "']/parent::label/following-sibling::div//div[@class='doc-message-info mt-10']")).count().then(function(count)
                    {
                            expect(count).toBeGreaterThan(0,"Document section is not visible for Question " +  Question);
                    } );
    
                } 

                if(AdditionalAmount != "NA")
                {
                    var txtboxAdditionalAmount = element(by.xpath("//span[text()='" + Question + "']/parent::label/following-sibling::div//input[@type = 'text']"));
                    txtboxAdditionalAmount.sendKeys(AdditionalAmount);
                }
             }
            
         });       
    }


    this.SavePreFundInfo = function () {
        CustomLib.WaitNClick(btnSavePreFundInfo);
    }

    this.VerifyyManadatoryFieldMessage = function()
    {   browser.sleep(1000);
        element.all(by.xpath('//app-prefunding-info/form/app-required-messages/div/div[1]/span[text()=\'Required field(s) to be completed below\']/parent::div[@class=\'my-1 required-message-danger\']')).count().then(function(count)
        {
            expect(count).toBeGreaterThan(0,"Required Field Message is not visible")
        })
    }


    this.SubmitPreFundInfoafteredit = function () {
        CustomLib.WaitNClick(btnSubmitPreFundInfo);
        CustomLib.WaitNClick(btnOkLayerSelection);
    }

    this.SubmitPreFundInfo = function () {
        CustomLib.WaitNClick(btnSubmitPreFundInfo);
        CustomLib.WaitNClick(btnOkLayerSelection);
        CustomLib.WaitNClick(btnOkLayerSelection);

    }

    this.SubmitPreFundInfoMessageValidation = function () {
        CustomLib.WaitNClick(btnSubmitPreFundInfo);
    }

    this.SubmitOKMessageValidation = function () {
        CustomLib.WaitNClick(btnOkLayerSelection);
    }

    this.VerifyMessage = function (SavedMsg) {
        var SuccessMsg = element(by.css('.msg-container.ng-star-inserted'))
        CustomLib.scrollIntoView(SuccessMsg);
        var trimSuccessMsg = SuccessMsg.getText().then(function (text) {
            return text.trim()
            expect(trimSuccessMsg.toContain(SavedMsg.trim()));
            
        });
    }

    this.ClickSaveBtn = function () {
    CustomLib.WaitNClick(btnSave);
    }

    this.VerifyNoMessage = function (SavedMsg) {
        var SuccessMsg = element(by.css('.msg-container.ng-star-inserted'))
        CustomLib.scrollIntoView(SuccessMsg);
        var trimSuccessMsg = SuccessMsg.getText().then(function (text) {
            return text.trim()
            expect(trimSuccessMsg.not.toContain(SavedMsg.trim()));
        });

    }

    this.PreFundDocumentUpload = function () {

        var tableDocumentUploadInstruction = element(by.css('.table.table-bordered.table-sm.w-100'));
        var tabBodyDocUploadInstr = tableDocumentUploadInstruction.element(by.tagName('tbody'));
        var rowsDocUploadInstr = tabBodyDocUploadInstr.all(by.tagName('tr'));

        rowsDocUploadInstr.each(function (row, rowindex) {
            var cols = row.all(by.tagName('td'));
            var DocumentPath = path.resolve(__dirname, fileToUploadDynamic + "_" + rowindex + ".pdf");
            var EC = protractor.ExpectedConditions;
            cols.each(function (col, colindex) {
                //console.log("Colums" + col.getText().then(function (txt){console.log(txt)}));
                if (colindex == 2) {
                    //col.get(1).click();
                    CustomLib.WaitNClick(col.all(by.css('.ng-star-inserted')).get(1));//.click();
                    element(by.css('input[type="file"]')).sendKeys(DocumentPath);

                    if (rowindex == 0) {
                        CustomLib.WaitNClick(btnOkLayerSelection);

                     /*  element.all(by.xpath('//app-prefunding-info/form/app-required-documents//span[contains(text(),\'The document is uploaded successfully\')]')).count().then(function(count)
                        {
                            expect(count).toBeGreaterThan(0,"Document Uploaded Failed ");
                        });*/
                    }

                }
            })
        });
    }

    this.VerifyDocUploadedSuccessfully = function()
    {
        element.all(by.xpath('//app-prefunding-info/form/app-required-documents//span[contains(text(),\'The document is uploaded successfully\')]')).count().then(function(count)
        {
            expect(count).toBeGreaterThan(0,"Document Uploaded Failed ");
        });
    }


    this.VerifyViewDocument = function(DocName)
    {
        element.all(by.xpath('//app-prefunding-info/form/app-required-documents//table/tbody/tr/td[contains(text(),\'' + DocName + '\')]/parent::tr/td[3]/a[1]/u')).count().then(function(count)
        {
            expect(count).toBeGreaterThan(0,"Document View Button is not present");
            if(count>0)
            {
                var btnView = element(by.xpath('//app-prefunding-info/form/app-required-documents//table/tbody/tr/td[contains(text(),\'' + DocName + '\')]/parent::tr/td[3]/a[1]/u'))
                btnView.click().then(function()
                {
                    CustomLib.WaitForSpinnerInvisible();
                    browser.sleep(2000);
                    CustomLib.navigateToWindowWithUrlContains("pdfDocuments",2);
                    CustomLib.closeWindowUrlContains("pdfDocuments");
                    CustomLib.navigateToWindow("LLC Lawyer Portal",1);
                    browser.sleep(500);
                })
                //CustomLib.WaitForSpinnerInvisible();
               // browser.sleep(4000);
               // CustomLib.ClosePopup();
            }
        });      
     }

     this.VerifyDocumentUploadedSuccessfully = function(DocName)
     {

        return element(by.xpath('//app-prefunding-info/form/app-required-documents//table/tbody/tr/td[contains(text(),\'' + DocName + '\')]/parent::tr/td[2]')).getText().then(function(txt)
        {
                return txt;
        })

      }

     this.VerifySubmitButtonStatus = function (Status) {

        CustomLib.ScrollDown(0,100000);
        if (Status == 'Disabled') {
            expect(btnSubmit.isEnabled()).toBe(false, "Submit Button Enabled");
        }
        if (Status == 'Enabled') {
            expect(btnSubmit.isEnabled()).toBe(true, "Submit Button is disabled");
        }

    }


     this.UploadDocument = function(DocName)
     {

 
        var docTable = element(by.xpath('//app-prefunding-info/form/app-required-documents//table'));
        CustomLib.WaitforElementVisible(docTable);
         CustomLib.scrollIntoView(docTable);
         element.all(by.xpath('//app-prefunding-info/form/app-required-documents//table/tbody/tr/td[contains(text(),\'' + DocName + '\')]/parent::tr/td[3]/a/u')).count().then(function(count)
         {
             expect(count).toBeGreaterThan(0,"Document Upload Button is not present");
             if(count>0)
             {
                var DocumentPath = path.resolve(__dirname, fileToUploadDynamic +  ".pdf");
                 var btnUpload = element(by.xpath('//app-prefunding-info/form/app-required-documents//table/tbody/tr/td[contains(text(),\'' + DocName + '\')]/parent::tr/td[3]/a/u'))
                 btnUpload.click();
                 element(by.css('input[type="file"]')).sendKeys(DocumentPath);

                 element.all(by.css('.btn.btn-success.btn-sm.fct.mt-2')).count().then(function(count)
                 {
                     if(count>0)

                     {
                        CustomLib.WaitNClick(btnOkLayerSelection);
                     }
                    
                 })
             }
         });      
      }
     ////app-prefunding-info/form/app-required-documents/div//tbody/tr/td[contains(text(),'Title Search')]/parent::tr/td[3]/a[2]/u

    this.PreFundDocumentQuestions = function () {

        let map = new Map();
        var questionspanel = element.all(by.css('.question-container.ng-star-inserted')).all(by.tagName('app-pif-question-detail'));

        var answerret;
        var questionsret;
        return questionspanel.each(function (qtn, rowindex) {
            var questions = qtn.all(by.css('.control-label')).all(by.tagName('span'));
            var answers = qtn.all(by.css('.form-check-input.ng-valid.ng-touched.ng-pristine')).all(by.xpath('..')).all(by.tagName('span'));

            questionsret = questions.getText().then(function (txt) {
                questionsret = "";
                if (txt.length > 0) {

                    questionsret = txt[0];

                }

                return questionsret;

            })



            answerret = answers.getText().then(function (txt) {
                answerret = "";
                if (txt.length > 0) {
                    //console.log(txt[0]);
                    answerret = txt[0];
                }
                return answerret;

            })

            questionsret.then(function (quest) {

                map.set(quest, answerret);
                //  console.log(quest + " : " + answerret);

            })

            //console.log(questionsret);

        }).then(function (test) {
            // console.log(map);s
            return map;
        })

    }

    this.VerifyMessage1forAmendments = function () {


        var msg1 = element(by.tagName('app-message-bar')).all(by.css('.d-flex.my-1.ng-star-inserted')).get(0).all(by.tagName('div')).get(1).all(by.tagName('span')).get(1);

        browser.sleep(500);
        var trimmsg1 = msg1.getText().then(function (text) {
            return text.trim()
            console.log(msg1.getText());
            expect(trimmsg1.toContain(DisplayMsg1.trim()));
        });



    }

    this.VerifyMessage2forAmendments = function () {

        var msg2 = element(by.tagName('app-message-bar')).all(by.css('.d-flex.my-1.ng-star-inserted')).get(1).all(by.tagName('div')).get(1);


        browser.sleep(500);

        var trimmsg2 = msg2.getText().then(function (text) {
            return text.trim()
            expect(trimmsg2.toContain(DisplayMsg2.trim()));
        });


    }

    this.verifyLRONumber = function (ProvinceName) {

        if (ProvinceName == 'ONTARIO') {
            expect((lblLRONumber).isDisplayed()).toBe(true);
            expect(lblLRONumber.getText()).toContain('LRO Number',"PIF Page - Text for LRO Number");
        }
        else if (ProvinceName == 'ALBERTA' || 'MANITOBA' || 'NEW BRUNSWICK' || 'BRITISH COLUMBIA' || 'SASKATCHEWAN') {
            expect(lblLRONumber.getText()).not.toContain('LRO Number');
        }
    }

    this.VerifyTitleLabel = function () {
        expect(lblTitleNumber.getText()).toContain('Title Number', "PIF Page - Text for Title Number");
    }
    this.VerifyTitleLabelNB = function () {
        expect(lblTitleNumber.getText()).toContain('PID', "PIF Page - Text for Title Number");
    }
    this.VerifyTitleLabelON = function () {
        var lblPIN = element.all(by.css('.form-group.col-md-4.ng-star-inserted')).get(1).element(by.tagName('label'));
        expect(lblPIN.getText()).toContain('PIN');

    }

    this.VerifySavebuttonDisplay = function () {
        expect(btnSavePreFundInfo.isPresent()).toBe(false,'Save button is present!');
    }

    this.VerifyPopupMsg=function(msg){
        expect(MsgBox.getText()).toContain(msg);

    }

    this.VerifyLegalDescMMS=function(text){
        var valLegalDesc=element(by.id('shortLegalDescription'));
        expect (valLegalDesc.getText()).toBe(text);
    }

    this.VerifyPINMMS=function(text){
        var valPIN = element(by.tagName('app-property-info')).all(by.css('.ng-star-inserted')).all(by.tagName('span')).get(6);
        CustomLib.WaitforElementVisible(valPIN);
        expect (valPIN.getText()).toBe(text,"PIN Number is not matching!");
        console.log("PIN = " + valPIN);
    }
    this.VerifyPIDMMS=function(text){
        var valPID = element(by.tagName('app-property-info')).all(by.css('.form-group.col-md-4.ng-star-inserted')).all(by.tagName('span')).get(0);
        expect(valPID.isPresent()).toBe(true, 'Label PID is not present!');
        expect (valPID.getText()).toContain(text);
        console.log("PIN = " + valPID);
    }

    this.VerifyRecievedLenderAmendment = function () {
        var msg = element(by.css('.m-0'));
        msg.getText().then(function (txt) {
            expect(txt).toContain('The System has received an amendment from the Lender. Before you can submit this information, navigate to Unity and process the pending Lender amendment(s).');

        })
    }

    this.VerifyLRONoLabelNotPresent = function () {

        expect(lblLRONo.getText()).not.toBe('LRO NumberP', "Label LRO Number is present");
        
        
    }

    this.VerifyLRONoLabelIsPresent = function () {

        expect(lblLRONo.getText()).toContain('LRO Number', "Label LRO Number is not present");
        expect(lblLRONo.getText()).not.toBe('Title Number', "Label Title Number is present");
        
    }

    this.VerifyallButtonStatus = function (Status) {

        CustomLib.ScrollDown(0,100000);
        if (Status == 'Disabled') {
            expect(btnSave.isEnabled()).toBe(false, "Expected Save Button to be - disbled. But Save Button is - enabled");
            expect(btnSubmit.isEnabled()).toBe(false, "Expected Submit Button to be - disbled. But Submit Button is - enabled");
        }
        if (Status == 'Enabled') {
            expect(btnSave.isEnabled()).toBe(true, "Expected Save Button to be - enabled. But Save Button is - disbled");
            expect(btnSubmit.isEnabled()).toBe(true, "Expected Submit Button to be - enabled. But Submit Button is - disbled");
        }
        
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

    this.VerifySavedChanges = function (SavedMsg) {

        var SuccessMsg = element(by.css('.msg-container.ng-star-inserted'))
        CustomLib.scrollIntoView(SuccessMsg);
        browser.sleep(500);
        expect(SuccessMsg.getText()).toContain(SavedMsg);

    }

    this.VerifyNoSavedChanges = function (SavedMsg) {

        var SuccessMsg = element(by.css('.msg-container.ng-star-inserted'))
        CustomLib.scrollIntoView(SuccessMsg);
        browser.sleep(500);
        expect(SuccessMsg.getText()).not.toContain(SavedMsg);

    }

    this.VerifyValidationMsg=function(){
        
        var PortalValidationMsg = TestData.data[Lang].Messages.PortalValidationMsg;
        var ValidationMsg = TestData.data[Lang].Messages[Env].ValidationMsg;
        CustomLib.WaitNClick(btnSubmit);
        CustomLib.WaitForSpinnerInvisible();
        browser.sleep(500);
     
        expect(element.all(by.xpath('//div[@class=\'my-1 required-message-danger\']')).get(0).isPresent()).toBe(true, "Portal validation message is not displayed");
        expect(element.all(by.xpath('//div[@class=\'my-1 required-message-danger\']')).get(0).getText()).toContain(PortalValidationMsg);
        expect(element.all(by.xpath('//div[@class=\'my-1 required-message-danger\']')).get(1).isPresent()).toBe(true, "Partner Validation message is not displayed");
        expect(element.all(by.xpath('//div[@class=\'my-1 required-message-danger\']')).get(1).getText()).toContain(ValidationMsg);
    }

    this.VerifyAdditionalInfoField = function(val)  {
        if (val == 'Yes') {
            expect(addField.isPresent()).toBe(true,'Additional field is not present!');
            }
        else if (val == 'No') {
            expect(addField.isPresent()).toBe(false,'Additional field is present!');
        }

    }

    this.VerifyAdditionalInfoFieldSK = function(val)  {
        if (val == 'Yes') {
            expect(addFieldSK.isPresent()).toBe(true,'Additional field is not present!');
            }
        else if (val == 'No') {
            expect(addFieldSK.isPresent()).toBe(false,'Additional field is present!');
        }

    }



};

module.exports = new PreFundingInfomation();