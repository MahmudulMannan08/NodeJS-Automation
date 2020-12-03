'use strict'

var RunSettings = require('../../../testData/RunSetting.js');
var HomePage = require('../../../PageObjectMethods/LLCUnityPortal/HomePage.js');
var CustomLibrary = require('../../../CustomLibrary/CustomLibrary.js');
var MenuPanel = require('../../../PageObjectMethods/LLCUnityPortal/MenuPanel.js');
var LawyerIntegrationMMS = require('../../../PageObjectMethods/LLCUnityPortal/Services/LawyerIntegration/LawyerIntegrationMMS.js');
var LawyerIntegrationCommon = require('../../../PageObjectMethods/LLCUnityPortal/Services/LawyerIntegration/LawyerIntegrationCommon.js');
var MMSPortral = require('../../../PageObjectMethods/MMS/MMSPortal.js');
var MMSCreateDeal = require('../../../PageObjectMethods/MMS/MMSCreateDeal.js');
var ManageDocuments = require('../../../PageObjectMethods/LLCUnityPortal/ManageDocuments.js');
var OperationsPortal = require('../../../PageObjectMethods/OperationalPortal/OperationsPortal.js');
var Env = RunSettings.data.Global.ENVIRONMENT.value;

//TC-288366: LLC Embedded Portal - Verify display link in manage documents when MMS Lender=Street Capital
//TC-288365: LLC Embedded Portal - Verify display link in manage documents when MMS Lender=Paradigm
//TC-245313: LLC Embedded Portal - Verify document published in MMS portal is available in embeded portal.
describe('LLC-MMS: MANAGE DOCUMENTS-ALL LENDERS', function () {
    var FCTURN
    var ClosingDate = CustomLibrary.DateConversionMMDDYYYYY(CustomLibrary.CurrentOrFutureDate());

    function maintest(BnkLenderName, spec, branch, contactName, programType, mortgageProduct) {
        it('TC:236250, 245313, 288365, 288366 -Verify that lawyer is able to view and download the documents uploaded by lender under Lender document section in LLC UNITY portal and lawyer recieves notification', function () {
            {
                var ThankYouPageFound = false;
                var LenderRefNo = CustomLibrary.GenerateUniqueAutomationNumber();
                var ClientName = CustomLibrary.getRandomString(5);
                MMSPortral.GenerateMMSDeal(BnkLenderName, ClientName, LenderRefNo, ClosingDate);
                MMSPortral.CreateMMSDeal(BnkLenderName, ClientName, LenderRefNo, ClosingDate);
                MMSPortral.VerifyThankYouPage().then(function (count) {
                if(count > 0)
                {
                    ThankYouPageFound = true;
                    FCTURN = MMSPortral.GetCreatedFCTURN();
                    MMSPortral.ClickOnEditViewdeals();
                    MMSCreateDeal.SearchbyFCTURN(FCTURN);
                    CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
                    browser.sleep(2000);
                    MMSCreateDeal.EnterStatusData(spec, BnkLenderName);
                    MMSCreateDeal.EnterLenderdata(branch, contactName, programType);
                    MMSCreateDeal.EnterMortgagorData();
                    MMSCreateDeal.EnterPopertyDataDynamic('ONTARIO');
                    MMSCreateDeal.StatusMenuClick();
                    MMSCreateDeal.getPropertyData();
                    MMSCreateDeal.EnterLawyerData();
                    MMSCreateDeal.SelectTrustAccount();
                    MMSCreateDeal.EnterNewMortgageData(mortgageProduct);
                    var DocUploadDate = MMSCreateDeal.EnterDocumentsData();
                    MMSCreateDeal.sendDealtoLLC();
                    MMSCreateDeal.VerifyDealSendToLLC().then(function (count) {
                        CustomLibrary.closeWindowUrlContains("DealDetails");
                        CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
                        browser.sleep(500);
                    if(count>0)
                    {
                        OperationsPortal.LoginOperationsPortal(FCTURN);
                        OperationsPortal.SerchDealDetails(FCTURN);
                        var DealId = OperationsPortal.GetDealID();
                        DealId.then(function (result) {
                            LawyerIntegrationMMS.MMSAcceptRejectDeal(result, "ACTIVE", function (data) {
                            });
                        });
           
                        DealId.then(function (result) {
                            LawyerIntegrationCommon.LoginViaRedirectURL(result, 'LLCDEAL');
                        });
                        CustomLibrary.WaitForSpinnerInvisible();
                        HomePage.VerifyHomePage();
                        MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
                        CustomLibrary.WaitForSpinnerInvisible();
                        HomePage.VerifyLendersOnlineReporsitoryLink(BnkLenderName);
                        HomePage.clickLenDocView('Solicitor Instruction Package', HomePage.DateConversionMonthShortFormat(DocUploadDate));
                        browser.sleep(6000);
                       // CustomLibrary.CloseOpenDoc();
                       ////ManageDocuments.SaveCreatedDocument().then(function(){
                        //browser.sleep(1000);
                        CustomLibrary.navigateToWindowWithUrlContains("pdfDocuments",2);            
                        CustomLibrary.WaitForSpinnerInvisible();
                        browser.sleep(500);
                        CustomLibrary.closeWindowUrlContains("pdfDocuments");
                        CustomLibrary.navigateToWindow("LLC Lawyer Portal",1); 
                        MMSPortral.loginMMS();
                        MMSPortral.ClickOnEditViewdeals();
                        MMSCreateDeal.SearchbyFCTURN(FCTURN);
                        CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
                        browser.sleep(2000);
                        DocUploadDate = MMSCreateDeal.EnterOtherDocumentsData();
                        MMSCreateDeal.AllDocSelectCheckbox();
                        MMSCreateDeal.DocumentPublishandNotify();
                        CustomLibrary.closeWindowUrlContains("DealDetails");
                        browser.sleep(2000);
                        CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
                        browser.sleep(2000);
                        DealId.then(function (result) {
                            LawyerIntegrationCommon.LoginViaRedirectURL(result, 'LLCDEAL');
                        });
                        MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
                        CustomLibrary.WaitForSpinnerInvisible();
                        HomePage.clickLenDocView('Borrower Contact Info', HomePage.DateConversionMonthShortFormat(DocUploadDate));
                        //TC-288365: LLC Embedded Portal - Verify display link in manage documents when MMS Lender=Paradigm
                        //TC-288366: LLC Embedded Portal - Verify display link in manage documents when MMS Lender=Street Capital
                        if (BnkLenderName == 'Paradigm Quest Inc.' || BnkLenderName == 'Street Capital Financial Corporation') { 
                        ManageDocuments.ClickDocument();
                        browser.sleep(1000);
                        CustomLibrary.navigateToWindowWithUrlContains("mortgagedocuments.ca",2);
                        CustomLibrary.WaitForSpinnerInvisible();
                        browser.sleep(1500);
                        CustomLibrary.closeWindowUrlContains("mortgagedocuments.ca");
                        browser.sleep(2000);
                        CustomLibrary.navigateToWindow("LLC Lawyer Portal",1); 
                         } 
                    
                    }
                    else {
                        expect(false).toBe(true, "Deal is not sent to LLC. Unable to verify amendment scenario.");
                    }
                });
                }
                else{
                    expect(ThankYouPageFound).toBe(true, "Thank You page is not Found.");
                }
                }); 
            }
        });
    }
    var i = 0;
    for (var i in RunSettings.data.Global.MMS[Env].Lender) {
        var BnkLenderName = RunSettings.data.Global.MMS[Env].Lender[i].Name;
        console.log (BnkLenderName);
        var spec = RunSettings.data.Global.MMS[Env].Lender[i].Spec;
        var branch = RunSettings.data.Global.MMS[Env].Lender[i].Branch;
        var contactName = RunSettings.data.Global.MMS[Env].Lender[i].ContactName;
        var programType = RunSettings.data.Global.MMS[Env].Lender[i].ONTARIO.ProgramType;
        var mortgageProduct = RunSettings.data.Global.MMS[Env].Lender[i].MortgageProduct;
        maintest(BnkLenderName, spec, branch, contactName, programType, mortgageProduct);
        i++;
    };
});