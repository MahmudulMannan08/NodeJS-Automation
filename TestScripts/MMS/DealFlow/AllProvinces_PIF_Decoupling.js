'use strict'
var TestData = require('../../../testData/TestData.js');
var RunSettings = require('../../../testData/RunSetting.js');
var HomePage = require('../../../PageObjectMethods/LLCUnityPortal/HomePage.js');
var RFFPage = require('../../../PageObjectMethods/LLCUnityPortal/RequestFunds.js');
var NotesPage = require('../../../PageObjectMethods/LLCUnityPortal/Notes.js');
var CustomLibrary = require('../../../CustomLibrary/CustomLibrary.js');
var MenuPanel = require('../../../PageObjectMethods/LLCUnityPortal/MenuPanel.js');
var LawyerIntegrationMMS = require('../../../PageObjectMethods/LLCUnityPortal/Services/LawyerIntegration/LawyerIntegrationMMS.js');
var LawyerIntegrationCommon = require('../../../PageObjectMethods/LLCUnityPortal/Services/LawyerIntegration/LawyerIntegrationCommon.js');
var MMSPortral = require('../../../PageObjectMethods/MMS/MMSPortal.js');
var MMSCreateDeal = require('../../../PageObjectMethods/MMS/MMSCreateDeal.js');
var NotesPage = require('../../../PageObjectMethods/LLCUnityPortal/Notes.js');
var OutlookPortal = require('../../../PageObjectMethods/Outlook/Outlook.js');
var OutlookInbox = require('../../../PageObjectMethods/Outlook/OutlookInbox.js');
var OperationsPortal = require('../../../PageObjectMethods/OperationalPortal/OperationsPortal.js');
var DealHistory = require('../../../PageObjectMethods/LLCUnityPortal/DealHistory.js');
var FinalReport = require('../../../PageObjectMethods/LLCUnityPortal/FinalReport.js');
var PreFundingInfomation = require('../../../PageObjectMethods/LLCUnityPortal/PreFundingInformation.js');
var NeedHelp = require('../../../PageObjectMethods/LLCUnityPortal/NeedHelp.js')
var ManageDocuments = require('../../../PageObjectMethods/LLCUnityPortal/ManageDocuments.js');
var Lang = TestData.data.LANGUAGE.value;
var Env = RunSettings.data.Global.ENVIRONMENT.value;


describe('LLC Unity Integration-MMS Deal- Flow', function () {
    function maintest(BnkLenderName, spec, branch,Province, contactName, ProgramType, mortgageProduct) {
      
        var firstName = RunSettings.data.Global.LawyerDetails[Env].firstName;
        var lastName = RunSettings.data.Global.LawyerDetails[Env].lastName; 
        var FCTURN
        var DealId
        var ClosingDate
        var ClientName
        var LenderRefNo
        var PropertyData
        var namelist = []
        var ThankYouPageFound;
        var dealSendToLLC;


        it('MMS Deal Flow-Deal Creation- PreFunding Questions through LLC Unity', function () {
            ThankYouPageFound = false;
            dealSendToLLC = false;
            ClosingDate = CustomLibrary.DateConversionMMDDYYYYY(CustomLibrary.CurrentOrFutureDate());
            LenderRefNo = CustomLibrary.GenerateUniqueAutomationNumber();
            ClientName = CustomLibrary.getRandomString(5);
            MMSPortral.CreateMMSDeal(BnkLenderName, ClientName, LenderRefNo, ClosingDate);
            MMSPortral.VerifyThankYouPage().then(function (count) {
                if (count > 0) {
                    ThankYouPageFound = true;
                    FCTURN = MMSPortral.GetCreatedFCTURN();
                    MMSPortral.ClickOnEditViewdeals();
                    MMSCreateDeal.SearchbyFCTURN(FCTURN);
                    //CustomLibrary.SwitchTab(1);
                    CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
                    browser.sleep(2000);
                    MMSCreateDeal.EnterStatusData(spec, BnkLenderName);
                    MMSCreateDeal.EnterLenderdata(branch, contactName, ProgramType);
                    namelist = MMSCreateDeal.EnterMortgagorData();
                    MMSCreateDeal.EnterPopertyDataDynamic(Province);
                    MMSCreateDeal.StatusMenuClick();
                    PropertyData = MMSCreateDeal.getPropertyData();
                    MMSCreateDeal.EnterLawyerData();
                    MMSCreateDeal.SelectTrustAccount();
                    MMSCreateDeal.EnterNewMortgageData(mortgageProduct);
                    MMSCreateDeal.EnterDocumentsData();
                    MMSCreateDeal.sendDealtoLLC();
                    MMSCreateDeal.VerifyDealSendToLLC().then(function (count) {
                        if (count > 0) {
                            dealSendToLLC = true;
                        }
                    });
                    CustomLibrary.closeWindowUrlContains("DealDetails");
                    browser.sleep(500);
                    CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
                }
                else {
                    expect(ThankYouPageFound).toBe(true, "Thank You page is not Found.");
                }
            });
        })

        it("TC-328141, 328142: Login To Operational Portal to Get ID, Accept Deal & Submit PIF", function () {
            if (dealSendToLLC) {
                OperationsPortal.LoginOperationsPortal(FCTURN);
                OperationsPortal.SerchDealDetails(FCTURN);
                DealId = OperationsPortal.GetDealID();
                DealId.then(function (result) {
                    LawyerIntegrationMMS.MMSAcceptRejectDeal(result, "ACTIVE", function (data) {
                        if (data == 200) {
                           // LawyerIntegrationMMS.getAndSetPreFundTransactionData(result, CustomLibrary.getRandomString(10), function (data) { });
                         LawyerIntegrationCommon.UpdateTransactionData(result,null,null,null,"45636",CustomLibrary.CurrentOrPastDate(),null,null, null,CustomLibrary.getRandomString(10),null,null);
                         
                        }
                        else {
                            expect(data).toBe('200', "Unable to Accept the deal.");
                        }
                    });
                });

                DealId.then(function (result) {
                    LawyerIntegrationCommon.LoginViaRedirectURL(result, 'LLCDEAL');
                });
                browser.waitForAngular();
                MenuPanel.PrimaryMenuNavigateTo('PreFundingInformation');
                //TC:328141- 11.2.7 MMS Pre-Funding - Replace the static message “Field(s) to be completed in Unity” with “Field(s) to be completed in your Source system”- NB, SK, BC
                //TC:328142- 11.2.7 MMS Pre-Funding - Replace the static message “Field(s) to be completed in Unity” with “Field(s) to be completed in your Source system”- ON, MB, AB
                PreFundingInfomation.VerifyValidationMsg();
               if(Province == "NEW BRUNSWICK" || Province == "BRITISH COLUMBIA" || Province == "SASKATCHEWAN" )
               {
                    PreFundingInfomation.AnswerPIFQuestionsAllProvinces(Province,1);
               }
               else
               {
                    PreFundingInfomation.AnswerPIFQuestionsAllProvinces(Province,2);
               }
                PreFundingInfomation.SavePreFundInfo();
                PreFundingInfomation.VerifyMessage('Your changes have been saved successfully.');
                PreFundingInfomation.SubmitPreFundInfo();
                PreFundingInfomation.VerifyMessage(' Your changes have been submitted successfully.');
                MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                DealHistory.VerifyDealHistoryTableSearch('Pre-Funding Info has been submitted successfully.', true);
     
            }
            else {
                expect(dealSendToLLC).toBe(true, "Unable to Login to Operational Portal");
            }
        })

         //TC:326526- 10.2 Change the label of the hyperlink found in the Help section from:  “LLC Unity User Guide” to "LLC Partner Integration User Guide” MMS
        it('TC:288508, 326526 - Verify Need help page', function () {
            if (dealSendToLLC) {
              
                MenuPanel.PrimaryMenuNavigateWithWait('Home');
                NeedHelp.VerifyNeedHelpLink();
                HomePage.ClickNeedHelp();
                browser.waitForAngular();
                CustomLibrary.WaitForSpinnerInvisible();
                CustomLibrary.navigateToWindowWithUrlContains("contactus",2);
                browser.sleep(300);
                HomePage.VerifyGuideUsLinkOnNeedHelpPage();
                HomePage.VerifyContactUsOnNeedHelpPage();
                CustomLibrary.closeWindowUrlContains("contactus");
                CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
                MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
                NeedHelp.VerifyNeedHelpLink();
                MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');
                NeedHelp.VerifyNeedHelpLink();
                MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
                NeedHelp.VerifyNeedHelpLink();
                MenuPanel.PrimaryMenuNavigateWithWait('Notes');
                NeedHelp.VerifyNeedHelpLink();
                MenuPanel.PrimaryMenuNavigateWithWait('Request Cancellation');
                NeedHelp.VerifyNeedHelpLink();
                MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                NeedHelp.VerifyNeedHelpLink();
                
                                                          
            }
            else {
                expect(true).not.toBe(false, "GetRedirectURL service does not have redirect URL!!!");
                
            }
          
        }) 

        //TC:326349- 9.1 MMS PIF - Hide LRO Number field on PIF for BC
        //TC:326350- 9.1 MMS PIF - Hide LRO Number field on PIF for SK
        it('TC:326349,326350- Verify LRO Number on pre-funding information page', function () {
            if (dealSendToLLC) {
               // MenuPanel.PrimaryMenuNavigateWithWait('PreFundingInformation');
                MenuPanel.PrimaryMenuNavigateTo('PreFundingInformation');
                browser.waitForAngular();
                if(Province == 'ONTARIO') {
                    PreFundingInfomation.VerifyLRONoLabelIsPresent();
                }
               
                else {
                    PreFundingInfomation.VerifyLRONoLabelNotPresent();
                }
                               
            }
            else {
                expect(dealSendToLLC).toBe(true, "Unable to Perform HomePage Validations");
            }
        })

        it('HomePage Validations', function () {
            if (dealSendToLLC) {
                MenuPanel.PrimaryMenuNavigateWithWait('Home');
                browser.waitForAngular();
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
                
                MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                DealHistory.VerifyDealHistoryTableSearch('LLC deal has been accepted.', true);
            }
            else {
                expect(dealSendToLLC).toBe(true, "Unable to Perform HomePage Validations");
            }
        })

        it('TC:329649, 329648, 329650, 329651- Manage Documents', function () {
            if (dealSendToLLC) {
                MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
                CustomLibrary.WaitForSpinnerInvisible();
                //TC:329651- 11.3  Verify that the Closed Confirmed documents are hidden on the Manage Documents screen for SK
                //TC:329650- 11.3  Verify that the Closed Confirmed documents are hidden on the Manage Documents screen for BC
                ManageDocuments.VerifyPIFDocs('Closed Confirmed');
                //TC:329649- 11.3  Verify that the PIF documents are hidden on the Manage Documents screen for SK
                //TC:329648- 11.3  Verify that the PIF documents are hidden on the Manage Documents screen for BC
                ManageDocuments.VerifyPIFDocs('Property Information Request Form');
                }
            else {
                expect(dealSendToLLC).toBe(true, "Unable to Verify Notes and Navigate Away Functionality");
            }
        })

        it('Verify Notes Page and Navigate Away Functionality', function () {
            if (dealSendToLLC) {
                MenuPanel.PrimaryMenuNavigateWithWait('Notes');
                NotesPage.ClickNotesButton("NewNote");
                NotesPage.EnterNotesText('test');
                MenuPanel.PrimaryMenuNavigateTo('Home');
                HomePage.NavigateAwayAcceptReject('Cancel');
                MenuPanel.PrimaryMenuNavigateTo('Home');
                HomePage.NavigateAwayAcceptReject('OK');
            }
            else {
                expect(dealSendToLLC).toBe(true, "Unable to Verify Notes and Navigate Away Functionality");
            }
        })

        it('TC-328123, 328124: Request for Fund', function () {
            if (dealSendToLLC) {
                MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');
                CustomLibrary.WaitForSpinnerInvisible();
                RFFPage.ClickRFFButtons('Save');
                HomePage.VerifyMessage('Your changes have been saved successfully.');
                //TC:328123- 11.2.5 MMS RFF - Replace the static message “Field(s) to be completed in Unity” with “Field(s) to be completed in the Partner/Source system” - RFF- NB, SK, BC
                //TC:328124- 11.2.5 MMS RFF - Replace the static message “Field(s) to be completed in Unity” with “Field(s) to be completed in the Partner/Source system” - RFF- ON, AB,MB
                RFFPage.VerifyRFFValidation();
                RFFPage.EnterRequestedAmount(1000);
                RFFPage.ClickRFFButtons('Create');
                CustomLibrary.WaitForSpinnerInvisible();
                RFFPage.VerifyRFFDocumentIsCreated().then(function(result)
                {
                    if(result)
                    {
                        //CustomLibrary.ClosePopup();
                        CustomLibrary.WaitForSpinnerInvisible();
                        browser.sleep(2000);
                        CustomLibrary.navigateToWindowWithUrlContains("pdfDocuments",2);
                        browser.sleep(2000);
                        CustomLibrary.closeWindowUrlContains("pdfDocuments");
                        browser.sleep(2000);
                        CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
                        RFFPage.VerifyConfirmationMessage('Request for Funds was created successfully.');
                        RFFPage.VerifySubmitButtonStatus('Enabled');
                        RFFPage.ClickRFFButtons('Submit');
                        RFFPage.ClickRFFButtons('OK');
                        RFFPage.VerifyConfirmationMessage('Request for Funds has been submitted successfully.');

                    }
                   
                })
            }
            else {
                expect(dealSendToLLC).toBe(true, "Unable to Verify Notes and Navigate Away Functionality");
            }
        })

        it('MileStones-Broker Condition and Solicitor Condition', function () {
            if (dealSendToLLC) {
                MMSPortral.loginMMSPortal();
                MMSPortral.ClickOnEditViewdeals();
                MMSCreateDeal.SearchbyFCTURN(FCTURN);
                //CustomLibrary.SwitchTab(1);
                CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
                browser.sleep(2000);
                MMSCreateDeal.checkLawyerAcceptedStatus();
                MMSCreateDeal.VerifyLawyerAcceptedStatus();
                MMSCreateDeal.ClickonViewPolicyHistory();
                MMSCreateDeal.VerifyPolicyHistoryTableSearch('The deal has been Accepted by the lawyer.', true);
                MMSCreateDeal.EnterChkBrokerConditions();
                MMSCreateDeal.EnterInstructionsforFunding();
                MMSCreateDeal.EnterChkSolictitorConditions();
                MMSCreateDeal.ClickonViewPolicyHistory();
                MMSCreateDeal.VerifyPolicyHistoryTableSearch('Broker Conditions Satisfied has been selected', true);
                MMSCreateDeal.VerifyPolicyHistoryTableSearch('Solicitor Conditions Satisfied has been selected', true);
                MMSCreateDeal.VerifyPolicyHistoryTableSearch('All underwriting questions are answered.', true);
                CustomLibrary.closeWindowUrlContains("DealDetails");
                browser.sleep(500);
                CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
                browser.sleep(500);
            }
            else {
                expect(dealSendToLLC).toBe(true, "Unable to Complete MileStones-Broker Condition and Solicitor Condition.");
            }
        })

        it('Lender Authorisation to Fund and Deal Funded Mile Stone', function () {
            if (dealSendToLLC) {
                MMSPortral.loginMMSPortal();
                MMSPortral.ClickOnEditViewdeals();
                MMSCreateDeal.SearchbyFCTURN(FCTURN);
                CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
                browser.sleep(500);  
                MMSCreateDeal.StatusMenuClick();

                MMSCreateDeal.IssueCOIPatch();
   
                 MMSCreateDeal.ClickFundingLeftMenu();
                MMSCreateDeal.EnterFundingData();
                browser.sleep(2000);
                   CustomLibrary.navigateToWindowWithUrlContains("DealList",1)
                   browser.sleep(2000);
                    MMSPortral.ClickonFunding()
                    MMSCreateDeal.EnterFundFilterData(BnkLenderName, ClosingDate);
                    MMSCreateDeal.ClickFundingLenderConfirmation();
                    FCTURN.then(function (result) {
                        MMSCreateDeal.ToConfirmLender(result);
                    });
                    MMSPortral.ClickonLogOut();
                    MMSPortral.Release2loginMMS();
                    MMSPortral.ClickonFunding()
                    MMSCreateDeal.EnterFundFilterData(BnkLenderName, ClosingDate);
                    MMSCreateDeal.ClickReleaser2();
                    FCTURN.then(function (result) {
                        MMSCreateDeal.ClickSenttoLawyer(result);
                    });
                    FCTURN.then(function (result) {
                        MMSCreateDeal.ClickRelease(result, false);
                    });
                    MMSPortral.ClickonLogOut();
                    MMSPortral.Release3loginMMS();
                    MMSPortral.ClickonFunding()
                    MMSCreateDeal.EnterFundFilterData(BnkLenderName, ClosingDate);
                    MMSCreateDeal.ClickReleaser3();
                    FCTURN.then(function (result) {
                        MMSCreateDeal.ClickRelease(result, true);
                    });
                    MMSPortral.ClickonLogOut();
                    browser.sleep(2000);
                    CustomLibrary.navigateToWindowWithUrlContains("SignOn",1)
                    browser.sleep(500);
                    MMSPortral.loginMMSPortal();
                    MMSPortral.ClickOnEditViewdeals();
                    MMSCreateDeal.SearchbyFCTURN(FCTURN);
                    browser.sleep(500); 
                    CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
                    browser.sleep(500);
                    MMSCreateDeal.EnterPreFundLawyerData(ClosingDate, ClosingDate);
                MMSCreateDeal.StatusMenuClick();
                

               browser.sleep(500);
               CustomLibrary.closeWindowUrlContains("DealDetails");
               browser.sleep(500);
               CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
               browser.sleep(1000);

                DealId.then(function (result) {
                    //LawyerIntegrationMMS.getAndSetPreFundTransactionData(result, CustomLibrary.getRandomString(10), function (data) { });
                    //browser.sleep(40000);
                    LawyerIntegrationCommon.UpdateTransactionData(result,null,null,null,"45636",CustomLibrary.CurrentOrPastDate(),null,null, null,CustomLibrary.getRandomString(10),null,null);

                    
                });   
            }
            else {
                expect(dealSendToLLC).toBe(true, "Unable to Complete MileStones - Lender Authorisation and Deal Funding");
            }
        });

        it('TC: 269396 MileStone-Deal Funded Status', function () {
            DealId.then(function (result) {
                LawyerIntegrationCommon.LoginViaRedirectURL(result, 'LLCDEAL');
                browser.sleep(20000);
            });
            browser.waitForAngular();
            MenuPanel.PrimaryMenuNavigateTo('Home');
            browser.waitForAngular();
            CustomLibrary.WaitForSpinnerInvisible();
            HomePage.waitforDealFundedCheck();
            HomePage.VerifyMMSDealFunded();
        });    
    
        it('TC: 269397, 331552, 331528- Edit Legal Desc and Verify LLCUnity Page for ReSubmit PIF', function () {
            MenuPanel.PrimaryMenuNavigateTo('PreFundingInformation');
            browser.sleep(1000);
            //TC:331552, 331528- 15.2 FCT - Decouple completion of the Deal Funded milestone functionality from the PIF/ PIF can be re-submitted after Deal Funded milestone is complete > BC & SK
            
            PreFundingInfomation.SubmitPreFundInfo();
            PreFundingInfomation.VerifyMessage(' Your changes have been submitted successfully.');
            PreFundingInfomation.VerifyMessage("Your changes have been submitted successfully. In addition to MMS Pre-Funding Information, don't forget to submit the Request for Funds.");
    
        })

        it('TC: 269399, 331553,331529- Alter Legal Desc and Verify LLCUnity Page for ReSubmit message again', function () {
            DealId.then(function (result) {
                //LawyerIntegrationMMS.getAndSetPreFundTransactionData(result, CustomLibrary.getRandomString(10), function (data) { });
                LawyerIntegrationCommon.UpdateTransactionData(result,null,null,null,"45636",CustomLibrary.CurrentOrPastDate(),null,null, null,CustomLibrary.getRandomString(10),null,null);

            });
            MenuPanel.PrimaryMenuNavigateTo('PreFundingInformation');
            browser.sleep(1000);
            //TC:331553, 331529- 15.2 FCT - Decouple completion of the Deal Funded milestone functionality from the PIF/ PIF can be re-submitted multiple times after Deal Funded milestone is complete > BC & SK
            PreFundingInfomation.SubmitPreFundInfo();
            PreFundingInfomation.VerifyMessage(' Your changes have been submitted successfully.');
            PreFundingInfomation.VerifyMessage("Your changes have been submitted successfully. In addition to MMS Pre-Funding Information, don't forget to submit the Request for Funds.");
            //CustomLibrary.CloseTab();
          DealId.then(function (result) {
               // LawyerIntegrationMMS.getAndSetTransactionData(result, CustomLibrary.getRandomNumber(5), CustomLibrary.DateConversionMMDDYYYYY(CustomLibrary.CurrentOrPastDate()));
                //browser.sleep(20000);
                LawyerIntegrationCommon.UpdateTransactionData(result,CustomLibrary.DateConversionMMDDYYYYY(CustomLibrary.CurrentOrPastDate()),null,null,"45636",CustomLibrary.CurrentOrPastDate(),null,null, null,null,null,null);
                browser.sleep(3500);
            }); 
        })

        it('MileStone-Final Report', function () {
            if (dealSendToLLC) {
                DealId.then(function (result) {
                    LawyerIntegrationCommon.LoginViaRedirectURL(result, 'LLCDEAL');
                });
                browser.waitForAngular();
                MenuPanel.PrimaryMenuNavigateWithWait('Home');
                CustomLibrary.WaitForSpinnerInvisible();
                HomePage.waitforDealFundedCheck();
                HomePage.VerifyMMSBrokerConditionMet();
                HomePage.VerifyMMSSolicitorConditionMet();
                HomePage.VerifyMMSDealFunded();
                MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                DealHistory.VerifyDealHistoryTableSearch('"Deal Funded" has been selected.', true);
                HomePage.getDealFundedStatus().then(function (dealFundedStatus) {
                    if (dealFundedStatus == true) {
                        MenuPanel.PrimaryMenuNavigateTo('FinalReport');
                        browser.waitForAngular();
                        FinalReport.checkRegistrationDetailEntries();
                        FinalReport.EnterFinalReportData();
                        FinalReport.EnterRegistrationDetails();
                        MenuPanel.PrimaryMenuNavigateTo('RequestForFunds');
                        CustomLibrary.WaitForSpinnerInvisible();
                        HomePage.NavigateAwayAcceptReject('Cancel');
                        browser.waitForAngular();
                        CustomLibrary.WaitForSpinnerInvisible();
                        MenuPanel.PrimaryMenuNavigateTo('RequestForFunds');
                        CustomLibrary.WaitForSpinnerInvisible();
                        HomePage.NavigateAwayAcceptReject('OK');
                        browser.waitForAngular();
                        CustomLibrary.WaitForSpinnerInvisible();
                        MenuPanel.PrimaryMenuNavigateTo('FinalReport');
                        browser.waitForAngular();
                        CustomLibrary.WaitForSpinnerInvisible();
                        FinalReport.EnterRegistrationDetails();
                        FinalReport.ClickFRButton('btnCreate');
                        CustomLibrary.WaitForSpinnerInvisible();
                        FinalReport.VerifyFinalReportIsCreated().then(function(result)
                        {
                            if(result)
                            {
                                //CustomLibrary.ClosePopup();
                                //CustomLibrary.WaitForSpinnerInvisible();
                                browser.sleep(2000);
                                CustomLibrary.navigateToWindowWithUrlContains("pdfDocuments",2);
                                browser.sleep(500);
                                CustomLibrary.closeWindowUrlContains("pdfDocuments");
                                CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
                                FinalReport.VerifyMessage(TestData.data[Lang].Messages.MMSCreateSuccessMsg);
                                FinalReport.FinalReportSubmit();
                                FinalReport.VerifyMessage(TestData.data[Lang].Messages.MMSSubmitSuccessMsg);
                                MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                                DealHistory.VerifyDealHistoryTableSearch('Document Solicitor\'s Report on Title has been submitted successfully.', true);
                            }
                           
                        })                    
                    }
                    else {
                        expect(false).toBe(true, "Unable to Submit Final Report test as Deal Funded Milestone failed.");
                    }
                })
            }
            else {
                expect(dealSendToLLC).toBe(true, "Unable to Submit Final Report.");
            }
        });

        it('Email Verification', function () {
            if (dealSendToLLC) {
  
                var firstName = RunSettings.data.Global.LawyerDetails[Env].firstName;
                var lastName = RunSettings.data.Global.LawyerDetails[Env].lastName;

                //New Deal Creation Email
                OutlookPortal.LogintoOutlookNonAngular();
                var emailsubject = "New Deal - " + firstName + " " + lastName + " - " + ClientName + namelist[1] + " - " + LenderRefNo;
                OutlookInbox.WaitUntilsearchResultAppears(LenderRefNo, emailsubject);
                OutlookInbox.OutlookLogOut();

             // Deal Funded
                OutlookPortal.LogintoOutlookNonAngular();
                var emailsubject = "Deal Funded - " + firstName + ", " + lastName;
                OutlookInbox.WaitUntilsearchResultAppears(FCTURN, emailsubject);
                OutlookInbox.OutlookLogOut();

               
            }
            else {
                expect(dealSendToLLC).toBe(true, "Unable to Verify Email.");
            }
        });

        it('File Closed functionality', function () {
            if (dealSendToLLC) {
                MMSPortral.loginMMSPortal();
                MMSPortral.ClickOnEditViewdeals();
                MMSCreateDeal.SearchbyFCTURN(FCTURN);
                //CustomLibrary.SwitchTab(1);
                CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
                browser.sleep(2000);
                browser.sleep(3000);
                MMSCreateDeal.ClickOnLawyerTab();
                browser.waitForAngular();
                MMSCreateDeal.FillClickCheckReportCompleted();
                MMSCreateDeal.StatusMenuClick();
                MMSPortral.ClickOnCloseButton();
                CustomLibrary.closeWindowUrlContains("DealDetails");
                browser.sleep(2000);
                CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
                browser.sleep(2000);
            }
            else {
                expect(dealSendToLLC).toBe(true, "Unable to Close File.");
            }
        })

        it('TC: 269408, 331557, 331558, 331533, 331532- Relogin to LLC Unity for Submit button verification', function () {
            DealId.then(function (result) {
                LawyerIntegrationCommon.LoginViaRedirectURL(result, 'LLCDEAL');            
            });
            browser.waitForAngular();
            MenuPanel.PrimaryMenuNavigateTo('PreFundingInformation');
            PreFundingInfomation.VerifyMessage('The status on this file has been updated to Completed');
            //TC:331557,331532- 15.2 FCT - Decouple completion of the Deal Funded milestone functionality from the PIF/ PIF (and deal) is locked down and that <Submit> button is disabled > BC & SK
            //TC:331558,331533- 15.2 FCT - Decouple completion of the Deal Funded milestone functionality from the PIF/ Verify that PIF Re-submit functionality is not triggered > BC & SK
            PreFundingInfomation.VerifySubmitButtonStatus('Disabled');
            MenuPanel.VerifyMenuButtonStatus('SubmitToLender', 'Disabled');
        })
    
        it('Operational Portal - Verify Deal Status', function () {
            if (dealSendToLLC) {
                OperationsPortal.LoginOperationsPortal(FCTURN);
                OperationsPortal.SerchDealDetails(FCTURN);
                OperationsPortal.VerifyDealStatus('COMPLETED');
                //CustomLibrary.CloseTab(1);
                //CustomLibrary.closeWindowUrlContains("OperationsPortal");

            }
            else {
                expect(dealSendToLLC).toBe(true, "Unable to Close File.");
            }
        })

    }

   var Provincearray = ["BRITISH COLUMBIA", "SASKATCHEWAN", "MANITOBA", "ALBERTA", "NEW BRUNSWICK", "ONTARIO"]; 
  // var Provincearray = ["ONTARIO"]; 
   
  for (var i = 0; i < Provincearray.length; i++) { 

        var j = 0;
        if(j>3) {
        j=0;
        }
             
      
      var lenderName = RunSettings.data.Global.MMS[Env].Lender[j].Name;        
      var spec = RunSettings.data.Global.MMS[Env].Lender[j].Spec;
      var branch = RunSettings.data.Global.MMS[Env].Lender[j].Branch;
      var Province = Provincearray[i];  //RunSettings.data.Global.MMS[Env].Lender[i].Province;
      console.log(Province);
      var contactName = RunSettings.data.Global.MMS[Env].Lender[j].ContactName;
      var ProgramType = RunSettings.data.Global.MMS[Env].Lender[j][Province].ProgramType;
      var mortgageProduct = RunSettings.data.Global.MMS[Env].Lender[j].MortgageProduct;
      //console.log(ProgramType); 
      j++;
              
      maintest(lenderName, spec, branch, Province, contactName, ProgramType, mortgageProduct);
          

        
    }


});

