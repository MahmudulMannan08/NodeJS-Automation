'use strict'
var RunSettings = require('../testData/RunSetting.js');
var HomePage = require('../PageObjectMethods/LLCUnityPortal/HomePage.js');
var CustomLibrary = require('../CustomLibrary/CustomLibrary.js');
var MenuPanel = require('../PageObjectMethods/LLCUnityPortal/MenuPanel.js');
var LenderIntegrationTD = require('../PageObjectMethods/LLCUnityPortal/Services/LenderIntegration/LenderIntegrationTD.js');
var LawyerIntegrationCommon = require('../PageObjectMethods/LLCUnityPortal/Services/LawyerIntegration/LawyerIntegrationCommon.js');
var LawyerIntegrationBNS = require('../PageObjectMethods/LLCUnityPortal/Services/LawyerIntegration/LawyerIntegrationBNS.js');
var LenderIntegrationBNS = require('../PageObjectMethods/LLCUnityPortal/Services/LenderIntegration/LenderIntegrationBNS.js');
var LawyerIntegrationMMS = require('../PageObjectMethods/LLCUnityPortal/Services/LawyerIntegration/LawyerIntegrationMMS.js');
var RFFPage = require('../PageObjectMethods/LLCUnityPortal/RequestFunds.js');
var MMSPortral = require('../PageObjectMethods/MMS/MMSPortal.js');
var MMSCreateDeal = require('../PageObjectMethods/MMS/MMSCreateDeal.js');
var OperationsPortal = require('../PageObjectMethods/OperationalPortal/OperationsPortal.js');
var OutlookPortal = require('../PageObjectMethods/Outlook/Outlook.js');
var OutlookInbox = require('../PageObjectMethods/Outlook/OutlookInbox.js');
var TestData = require('../testData/TestData.js');


describe('BNS Deal Creation', function () {
    var Lang = TestData.data.LANGUAGE.value;
    var BNSFctUrn = null;
    var loginRedirectURL =null;

    afterAll(function () {
        LenderIntegrationBNS.CleanUpScript();  
        LawyerIntegrationBNS.CleanUpScript();
    });

    it('CREATE BNS Deal through Lender service', function () {
        LenderIntegrationBNS.CreateBNSDeal('false', 'true', TestData.data[Lang].WebService.Province);
    })

    it('Accept Deal using Lawyer Integration', function () {
        BNSFctUrn = LenderIntegrationBNS.ReturnFctUrn();
        expect(BNSFctUrn).not.toBe(null);
        if (BNSFctUrn) {
            //Accepting the deal
            LawyerIntegrationCommon.AcceptRejectDeal(BNSFctUrn, "ACTIVE");
        }
        else {
            expect(BNSFctUrn).not.toBe(undefined, "CreateBNSDeal service timed out!!!");
            expect(BNSFctUrn).not.toBe(null, "CreateBNSDeal service timed out!!!");
        }
    })

    it('Verify Home page, deal acceptance milestone & Left Navigation Bar', function () {
        browser.ignoreSynchronization = true;
        if (BNSFctUrn) {
            loginRedirectURL = LawyerIntegrationCommon.LoginViaRedirectURLWithWait(BNSFctUrn, 'LLCDEAL');
            if  (loginRedirectURL) {

                HomePage.VerifyHomePage();
                //Verify footer
                HomePage.VerifyFooter();
                HomePage.VerifyDealStatusSection('LLC');
                HomePage.VerifyDealAcceptedCheckMark('LLC');
                HomePage.VerifyLLCRffNotStarted();
                HomePage.VerifyFinalReportNotStarted();
                //Verify left navigation bar
                MenuPanel.VerifyLeftMenuItems();
            }
            else {
                expect(loginRedirectURL).not.toBe(undefined, "GetRedirectURL service does not have redirect URL!!!");
                expect(loginRedirectURL).not.toBe(null, "GetRedirectURL service does not have redirect URL!!!");
            }
        }
        else {
            expect(BNSFctUrn).not.toBe(undefined, "CreateBNSDeal service timed out!!!");
            expect(BNSFctUrn).not.toBe(null, "CreateBNSDeal service timed out!!!");
        }
    })

    it('Cancel Deal using Operations Portal', function () {

        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn != null)){
            if  (loginRedirectURL) {
                //login to Operations portal
                OperationsPortal.LoginOperationsPortal();    
                OperationsPortal.SearchDealBNS(BNSFctUrn).then(function(count){
                    if(count > 0)
                    {
                       //Cancel deal if not completed
                        OperationsPortal.CancelDealIfNotComplete(); 
                    }
                    else
                    {
                        expect(true).toBe(false, "Unable to Cancel the deal in Operational Portal");
                    }
               });
            }
            else 
            {         
                expect(loginRedirectURL).not.toBe(undefined, "GetRedirectURL service does not have redirect URL!!!");
                expect(loginRedirectURL).not.toBe(null, "GetRedirectURL service does not have redirect URL!!!");
            }
        }
        else 
        {
            expect(BNSFctUrn).not.toBe(undefined, "CreateBNSDeal service timed out!!!");
            expect(BNSFctUrn).not.toBe(null, "CreateBNSDeal service timed out!!!");
        }       
    })
});

describe('TD Deal Creation', function () {
    var Lang = TestData.data.LANGUAGE.value;
    var loginRedirectURL = null;
    var TDDealIsInDraft = null;
    var TDDealPresentInOperationalPortal = null;
    var TDDealID = null;
    var lenderReferenceNumber = null;

    afterAll(function () {
        console.log('afterAll - Cleaning up memory');
        LenderIntegrationTD.CleanUpScript();
    });

    it('Create TD Deal', function () {  
        LenderIntegrationTD.CreateTDDealthroughCode(TestData.data[Lang].WebService.Province);
    })

    it('Verify TD Deal status in Operations Portal', function() {

        browser.ignoreSynchronization = true;
        TDDealIsInDraft = true;
        TDDealPresentInOperationalPortal = false;
        TDDealID = LenderIntegrationTD.ReturnfctURNTD();
        lenderReferenceNumber = LenderIntegrationTD.ReturnLenderRefNoTD();

        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null')) {
            console.log("Closing Date "+ TDDealID);
            console.log("Reg Date "+ lenderReferenceNumber);
            OperationsPortal.LoginOperationsPortal();
            
            //Search deal in operations portal
            OperationsPortal.SearchDealBNS(TDDealID).then( function(count) {

                if(count > 0) {

                    TDDealPresentInOperationalPortal = true;
                    OperationsPortal.WaitForExpectedDealStatusOP("PENDING ACCEPTANCE");
                    OperationsPortal.GetDealStatus().then( function(status) {
                        expect(status).not.toBe("DRAFT", "Deal Status for TD Deal.");
                        if(status != "DRAFT") {
                            TDDealIsInDraft = false;
                        }
                    });
                }
                else {
                    expect(TDDealPresentInOperationalPortal).toBe(true, "Deal not found in Operational Portal");
                }
            });
        }
        else {
            expect(TDDealID).not.toContain('null', "CreateTDDeal service timed out!!!");
        }
    })

    it('Accept TD Deal and Verify Home Page', function () {
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
            LawyerIntegrationCommon.AcceptRejectDeal(TDDealID, "ACTIVE"); 
            loginRedirectURL = LawyerIntegrationCommon.LoginViaRedirectURLWithWait(TDDealID, 'LLCDEAL');
            if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
                HomePage.VerifyHomePage();
                HomePage.VerifyDealAcceptedCheckMark('LLC');
                CustomLibrary.WaitForSpinnerInvisible();
            }
            else 
            {
                expect(loginRedirectURL).not.toBe(undefined, "GetRedirectURL service does not have redirect URL!!!");
                expect(loginRedirectURL).not.toBe(null, "GetRedirectURL service does not have redirect URL!!!");
            }
        }
        else {
            expect(false).toBe(true, "Error occured while accepting the deal.");
        } 
    })


    it('Verify Lawyer recieves Deal Creation email', function () {
        
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
            
            if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
                
                if  (lenderReferenceNumber) {
                    //Login to Outlook
                    OutlookPortal.LogintoOutlookNonAngular();
                    OutlookInbox.VerifyEmailOutlook("New Deal", lenderReferenceNumber);
                }
            }
            else {    
                expect(loginRedirectURL).not.toBe(undefined, "GetRedirectURL service does not have redirect URL!!!");
                expect(loginRedirectURL).not.toBe(null, "GetRedirectURL service does not have redirect URL!!!");
            }
        }
        else 
        {
            expect(TDDealPresentInOperationalPortal).toBe(true, "Deal not found in Operational Portal");
            expect(TDDealIsInDraft).toBe(false, "TD DEAL is in DRAFT STATE");
            expect(TDDealID).not.toContain('null', "CreateTDDeal service timed out!!!");
        }
    })

    it('Cancel Deal using Operation Portal', function () {  
        
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft) {
            
            if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {    
                
                OperationsPortal.LoginOperationsPortal();
                OperationsPortal.SearchDealBNS(TDDealID).then(function(count){
                if(count > 0)
                {
                    //Cancel deal if not completed
                    OperationsPortal.CancelDealIfNotComplete(); 
                }
                else
                {
                    expect(true).toBe(false, "Unable to Cancel the deal in Operational Portal");
                }
                });
            }
            else {
                expect(loginRedirectURL).not.toBe(undefined, "GetRedirectURL service does not have redirect URL!!!");
                expect(loginRedirectURL).not.toBe(null, "GetRedirectURL service does not have redirect URL!!!");
            }
        }
        else 
        {
            expect(TDDealIsInDraft).toBe(false, "TD DEAL is in DRAFT STATE");
            expect(TDDealID).not.toContain('null', "CreateTDDeal service timed out!!!");
        }       
    })
});

describe('MMS Deal', function () {

    var Env = RunSettings.data.Global.ENVIRONMENT.value;
    var LenderDetails =  RunSettings.data.Global.MMS[Env].Lender[0];
    var FCTURN
    var DealId
    var ClosingDate
    var ClientName
    var LenderRefNo
    var PropertyData
    var namelist = []
    var ThankYouPageFound ;
    var dealSendToLLC ;
    var loginRedirectURL  = null;
    var AssessmentRollNumber =   null;
    it('MMS Deal Flow-Deal Creation- PreFunding Questions through LLC Unity', function () {
        ThankYouPageFound = false;
        dealSendToLLC = false;
        ClosingDate = CustomLibrary.DateConversionMMDDYYYYY(CustomLibrary.CurrentOrFutureDate());
        LenderRefNo = CustomLibrary.GenerateUniqueAutomationNumber();
        ClientName = CustomLibrary.getRandomString(5);
        AssessmentRollNumber = RFFPage.ReturnAssessmentRollNo();
        MMSPortral.CreateMMSDeal(LenderDetails.Name, ClientName, LenderRefNo, ClosingDate);
        MMSPortral.VerifyThankYouPage().then(function (count) {
            if(count > 0)
            {
                ThankYouPageFound = true;
                FCTURN = MMSPortral.GetCreatedFCTURN();
                MMSPortral.ClickOnEditViewdeals();
                MMSCreateDeal.SearchbyFCTURN(FCTURN);
                CustomLibrary.SwitchTab(1);
                MMSCreateDeal.EnterStatusData(LenderDetails.Spec, LenderDetails.Name);
                MMSCreateDeal.EnterLenderdata( LenderDetails.Branch, LenderDetails.ContactName,  LenderDetails.ONTARIO.ProgramType);
                namelist = MMSCreateDeal.EnterMortgagorData();       
                MMSCreateDeal.EnterPopertyDataDynamic('ONTARIO');
                MMSCreateDeal.StatusMenuClick();
                PropertyData = MMSCreateDeal.getPropertyData();
                MMSCreateDeal.EnterLawyerData();
                MMSCreateDeal.SelectTrustAccount();
                MMSCreateDeal.EnterNewMortgageData(LenderDetails.MortgageProduct);
                MMSCreateDeal.EnterDocumentsData();
                MMSCreateDeal.sendDealtoLLC();
                MMSCreateDeal.VerifyDealSendToLLC().then(function (count) {
                    if(count>0)
                    {
                        dealSendToLLC = true;
                    }
                });
                CustomLibrary.SwitchTab(0);
                CustomLibrary.CloseTab(1);   
            }
            else{
                expect(ThankYouPageFound).toBe(true, "Thank You page is not Found.");
            }
        });  
    })

    it("Login To Operational Portal to Get ID, Accept Deal", function () {
        if(dealSendToLLC)
        {
            OperationsPortal.LoginOperationsPortal(FCTURN);
            OperationsPortal.SerchDealDetails(FCTURN);
            DealId = OperationsPortal.GetDealID();
            DealId.then(function (result) {
                LawyerIntegrationMMS.MMSAcceptRejectDeal(result, "ACTIVE", function (data) {
                    if (data == 200) {
                        //LawyerIntegrationMMS.getAndSetPreFundTransactionData(result, CustomLibrary.getRandomString(10), function (data) { });
                        LawyerIntegrationCommon.UpdateTransactionData(result,null,AssessmentRollNumber,null,"45636",CustomLibrary.CurrentOrPastDate(),null,null, null,CustomLibrary.getRandomString(10),null,null);     
                           
                    }
                    else {
                        expect(data).toBe('200', "Unable to Accept the deal.");
                    }
                });
            });
           
          
        }
        else{
            expect(dealSendToLLC).toBe(true, "Unable to Login to Operational Portal");
        }
    })

    it('HomePage Validations', function () {
        if(dealSendToLLC)
        {
            DealId.then(function (result) {
                loginRedirectURL = LawyerIntegrationCommon.LoginViaRedirectURLWithWait(result, 'LLCDEAL');
                if (loginRedirectURL) {
                        HomePage.VerifyMilestoneLabel();
                        MenuPanel.VerifyLeftMenuItems();
                        HomePage.VerifyRFFNotStarted();
                        HomePage.VerifyBrokerConditionNotSatisfiedNotStarted();
                        HomePage.VerifySolictorConditionNotSatisfiedNotStarted();
                        HomePage.VerifyLenderAuthurizationtoFundNotStarted();
                        HomePage.VerifyDealFundedNotstarted();
                        HomePage.VerifyMortgageInfoSection();
                        HomePage.VerifyClosingdateData(HomePage.DateConversion(ClosingDate));
                        HomePage.VerifyMortgagorName(ClientName);
                        HomePage.VerifyPropertyAddressdata(PropertyData);
                        HomePage.VerifyFooter();
                        HomePage.VerifyHeader();
                    }
                    else {
                            expect(loginRedirectURL).not.toBe(undefined, "GetRedirectURL service does not have redirect URL!!!");
                            expect(loginRedirectURL).not.toBe(null, "GetRedirectURL service does not have redirect URL!!!");
                    }
            });
        }
        else{
            expect(dealSendToLLC).toBe(true, "Unable to Perform HomePage Validations");
        }
    })

    it('Cancel MMS Deal', function () {
        
        if(dealSendToLLC)
        {            
            MMSPortral.loginMMSPortal();
            MMSPortral.ClickOnEditViewdeals();
            MMSCreateDeal.SearchbyFCTURN(FCTURN);
            CustomLibrary.SwitchTab(1);
            MMSCreateDeal.StatusMenuClick();
            browser.sleep(1000);
            MMSCreateDeal.ClickOnCancelDeal();
            CustomLibrary.SwitchTab(2);
            MMSCreateDeal.EnterCancellationReasons("Duplicate Deal", "Some Reason");
            browser.sleep(1000);
            CustomLibrary.CloseTab2(1);     
        }
        else{
            expect(FCTURN).not.toBe(undefined, "MMS Deal could not be created!!!");
            expect(FCTURN).not.toBe(null, "MMS Deal could not be created!!!");
        }
    })

    it('Verify status in Operation Portal', function () {
        
        if (FCTURN) {
            OperationsPortal.LoginOperationsPortal();
            //Search deal in operations portal
            OperationsPortal.SerchDealDetails(FCTURN).then(function(count)
            {
                if(count > 0)
                {
                    OperationsPortal.GetDealStatus().then(function(txt)
                    {
                        expect(txt).toBe('CANCELLED', "Deal Cancelled in Operational ");
                    })
                }
            })
               
        }
        else {
            expect(FCTURN).not.toBe(undefined, "MMS Deal could not be created!!!");
            expect(FCTURN).not.toBe(null, "MMS Deal could not be created!!!");
        }  
    })
});
