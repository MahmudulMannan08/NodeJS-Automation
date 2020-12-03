'use strict'
var HomePage = require('../../../PageObjectMethods/LLCUnityPortal/HomePage.js');
var RunSettings = require('../../../testData/RunSetting.js');
var CustomLibrary = require('../../../CustomLibrary/CustomLibrary.js');
var MenuPanel = require('../../../PageObjectMethods/LLCUnityPortal/MenuPanel.js');
var LenderIntegrationBNS = require('../../../PageObjectMethods/LLCUnityPortal/Services/LenderIntegration/LenderIntegrationBNS.js');
var LawyerIntegrationCommon = require('../../../PageObjectMethods/LLCUnityPortal/Services/LawyerIntegration/LawyerIntegrationCommon.js');
var LawyerIntegrationBNS = require('../../../PageObjectMethods/LLCUnityPortal/Services/LawyerIntegration/LawyerIntegrationBNS.js');
var TestData = require('../../../testData/TestData.js');
var FinalReport = require('../../../PageObjectMethods/LLCUnityPortal/FinalReport.js');
var ManageDocuments = require('../../../PageObjectMethods/LLCUnityPortal/ManageDocuments.js');
var DealHistory = require('../../../PageObjectMethods/LLCUnityPortal/DealHistory.js');
var LenderPortal = require('../../../PageObjectMethods/LenderPortal/LenderPortal.js');
var OperationsPortal = require('../../../PageObjectMethods/OperationalPortal/OperationsPortal.js');
var NeedHelp = require('../../../PageObjectMethods/LLCUnityPortal/NeedHelp.js')
var Lang = TestData.data.LANGUAGE.value;

describe('Manage Documents : Generate , Re-Generate, Upload Documents', function () {
    var  BNSFctUrn = null;
    var loginRedirectURL = null;
    var DocName = CustomLibrary.getRandomString(10);
    var Env = RunSettings.data.Global.ENVIRONMENT.value;
    var lenderReferenceNumber = null;

    afterAll(function () {
        LenderIntegrationBNS.CleanUpScript();
        LawyerIntegrationBNS.CleanUpScript();
    });

    it('Generate BNS Deal - Create deal soap service', function () {
        LenderIntegrationBNS.CreateBNSDeal('false', 'true', TestData.data[Lang].WebService.Province);
    })

    it('Accept Deal - AcceptReject soap service', function () {
        BNSFctUrn = LenderIntegrationBNS.ReturnFctUrn();
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) {
            //Accepting the deal
            LawyerIntegrationCommon.AcceptRejectDeal(BNSFctUrn, "ACTIVE");
            lenderReferenceNumber = LenderIntegrationBNS.ReturnLenderRefNo();
            console.log('lenderReferenceNumber = ' + lenderReferenceNumber);
        }
        else {
            expect(BNSFctUrn).not.toBe(undefined, "CreateBNSDeal service timed out!!!");
            expect(BNSFctUrn).not.toBe(null, "CreateBNSDeal service timed out!!!");
        }
    })

    //TC-245218: LLC-Embedded Portal--Verify Additional documents (other documents) is uploaded with status and time stamp displayed.
    it('TC-245218, 289721, 288370, 289720, 289715, 289714, 289722, 289716, 289719, 306390   : Upload Additional documents', function () {

        browser.ignoreSynchronization = true;
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) {
            loginRedirectURL = LawyerIntegrationCommon.LoginViaRedirectURLWithWait(BNSFctUrn, 'LLCDEAL');
            if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
            //TC-289721: LLC-Embedded Portal-Manage Document-Verify navigation away functionality on the Manage Documnet - BNS
            ManageDocuments.EnterDocumentName('Test document');
            MenuPanel.PrimaryMenuNavigateTo('Home');
            CustomLibrary.WaitForSpinner();
            HomePage.NavigateAwayAcceptReject('Cancel');
            browser.sleep(2000);
            CustomLibrary.WaitForSpinner();
            MenuPanel.PrimaryMenuNavigateTo('Home');
            HomePage.NavigateAwayAcceptReject('OK');
            MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
            //TC-289714: LLC-Embedded Portal- Manage Document-Upload "Other" Documents-BNS
            ManageDocuments.UploadAdditionalDocument(DocName);
            ManageDocuments.VerifyUploadedDocument(DocName);
            ManageDocuments.VerifyDocumentStatus(DocName, 'Uploaded');
    
            //TC-289720: LLC-Embedded Portal-Manage Document-Verify Auto navigate to Success message - BNS
            ManageDocuments.VerifySuccessMessage('Other-' + DocName + ' was uploaded successfully.');
            browser.waitForAngular();
            CustomLibrary.WaitForSpinnerInvisible();
           //TC-289715--LLC-Embedded Portal-Manage Document-Create Deal History Entry (for Document uploaded)- BNS
            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
            CustomLibrary.WaitForSpinnerInvisible();
            DealHistory.VerifyDealHistoryTableSearch('Other-' + DocName + ' Document uploaded successfully.', true);
           //TC:289722: LLC-Embedded Portal-Manage Document-Verify 'Need Help' functionality on the Manage Documnets tab. BNS
            MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
            ManageDocuments.ClickNeedHelp();  
            browser.waitForAngular();
            CustomLibrary.WaitForSpinnerInvisible();
            CustomLibrary.navigateToWindowWithUrlContains("contactus",2);
            browser.sleep(300);
            NeedHelp.VerifyNeedHelpPage();
            CustomLibrary.closeWindowUrlContains("contactus");
            browser.sleep(200);
            CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
            browser.sleep(200);
            MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
            CustomLibrary.WaitForSpinnerInvisible();
            ManageDocuments.clickLawyerUploadDoc();
            CustomLibrary.WaitForSpinnerInvisible();
            browser.sleep(2000);
            CustomLibrary.navigateToWindowWithUrlContains("pdfDocuments",2);
            browser.sleep(500);
            CustomLibrary.closeWindowUrlContains("pdfDocuments");
            CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
            browser.waitForAngular();
            CustomLibrary.WaitForSpinnerInvisible();
            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
            DealHistory.VerifyDealHistoryTableSearch('Certificate of Independent Legal Advice Document uploaded successfully.', true);            
            //TC-289716: LLC-Embedded Portal-Manage Document-Create Documents (English)  
            MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
            //Below line of code we have to uncomment only after upload document code above is uncommented
            ManageDocuments.ClickCreateEnglishDocumentNew2('Certificate of Independent Legal Advice').then(function (IsPresent) {
            if(IsPresent)
            {
            ManageDocuments.ConfirmDocRegenerate('OK'); 
            CustomLibrary.navigateToWindow("Doc Forms",2);
            ManageDocuments.SaveCreatedDocument().then(function(){
            browser.sleep(1000);
            CustomLibrary.navigateToWindowWithUrlContains("pdfDocuments",2);
            CustomLibrary.WaitForSpinnerInvisible();
            browser.sleep(500);
            CustomLibrary.closeWindowUrlContains("pdfDocuments");
            CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
         
            MenuPanel.PrimaryMenuNavigateWithWait('Home');
            MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
            //TC-289719: LLC-Embedded Portal-Manage Document-View Documents  - BNS
            ManageDocuments.VerifyStatusViewDoc('Certificate of Independent Legal Advice','Created');
            //TC-306390: LLC-Embedded Portal-Manage Document-Create Deal History Entry (for Document created)- BNS
            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
            DealHistory.VerifyDealHistoryTableSearch('The Certificate of Independent Legal Advice has been created', true);
             })
        }
        })
            //TC-289718: LLC-Embedded Portal-Manage Document- Regenerate Documents - BNS
            MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
            ManageDocuments.ClickRegenerateDocumentNew2('Certificate of Independent Legal Advice').then(function (IsPresent) {   
             if(IsPresent)
                {
                ManageDocuments.ConfirmDocRegenerate('OK'); 
                CustomLibrary.navigateToWindow("Doc Forms",2);
                ManageDocuments.SaveCreatedDocument().then(function(){
                browser.sleep(1000);
                CustomLibrary.navigateToWindowWithUrlContains("pdfDocuments",2);            
                CustomLibrary.WaitForSpinnerInvisible();
                browser.sleep(500);
                CustomLibrary.closeWindowUrlContains("pdfDocuments");
                CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);  

            MenuPanel.PrimaryMenuNavigateWithWait('Home');
            MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
            //Verify regenerate entry in deal history
            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
            DealHistory.VerifyDealHistoryTableSearch('The Certificate of Independent Legal Advice has been created', true); 
                })
            }
        })
           //TC-289716: LLC-Embedded Portal-Manage Document-Create Documents (French)  
            MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
            ManageDocuments.ClickCreateFrenchDocumentNew2('Certificate of Independent Legal Advice').then(function (IsPresent) {
                if(IsPresent)
                {
                    ManageDocuments.ConfirmDocRegenerate('OK'); 
                    CustomLibrary.navigateToWindow("Doc Forms",2);
                    ManageDocuments.SaveCreatedDocument().then(function(){
                    browser.sleep(1000);
                    CustomLibrary.navigateToWindowWithUrlContains("pdfDocuments",2);                            
                    CustomLibrary.WaitForSpinnerInvisible();
                    browser.sleep(500);
                    CustomLibrary.closeWindowUrlContains("pdfDocuments");
                    CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);              

                    MenuPanel.PrimaryMenuNavigateWithWait('Home');
                    //TC-306390: LLC-Embedded Portal-Manage Document-Create Deal History Entry (for Document created)- BNS
                    MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                    DealHistory.VerifyDealHistoryTableSearch('The Certificate of Independent Legal Advice has been created', true);      
                })
            }
        })
        }
        else {
            expect(true).toBe(false, "Unable to Generate  French Documents as Redirect URL is null.");
             }
        }
        else {
            expect(true).toBe(false, "GetRedirectURL service does not have redirect URL!!!");
            
        } 
    })

    it('GetTransactionData REST service', function () {
        if  (loginRedirectURL) {
            LawyerIntegrationCommon.GetTransactionStatus(BNSFctUrn);
           
        }
        else {
            expect(true).toBe(false, "Unable to get deal events."); 
        } 
       
    })

    it('GetLawyerDealEvents SOAP service', function () {
        if  (loginRedirectURL) {
            LenderIntegrationBNS.GetBNSLawyerDealEvents();
        }
        else {
            expect(true).toBe(false, "Unable to get deal events."); 
        } 
    })

    //TC-306498: LLC-Embedded Portal- Manage Document-Upload "Other" Documents- Verify GetLawyerDealEventsRequest -BNS
    it('TC-306498: Get DocumentType from GetLawyerDealEvents SOAP service', function () {
        if  (loginRedirectURL) {
            
            var DisplayName = LenderIntegrationBNS.ReturnDocDisplayName('DOCUMENTS');
            expect(DisplayName).not.toBe(null, 'GetLawyerDealEvents service timed out!!!');
            console.log("DocumentType = " + DisplayName);
        }
        else {
            expect(true).toBe(false, "Unable to get DocumentID."); 
        } 
      
    })
    
    //TC-291330: LLC-Embedded Portal-Manage Document-Verify Ops Portal for Documents - BNS
    it('TC-291330: LLC-Embedded Portal-Manage Document-Verify Ops Portal for Documents', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            //login to Operations portal
           
            CustomLibrary.OpenNewTab();
            browser.sleep(1000);
            CustomLibrary.navigateToWindowWithUrlContains("OperationsPortal",2);
            OperationsPortal.LoginOperationsPortal();

            //Search deal in operations portal
            OperationsPortal.SearchDealBNS(BNSFctUrn);
            OperationsPortal.ClickDocumentsTab();
            OperationsPortal.VerifyUploadedDocument('Other-' + DocName);
            browser.sleep(1000);
            CustomLibrary.closeWindowUrlContains("OperationsPortal");
            CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
           
            
        }
        else {
            expect(true).toBe(false, "Unable to Verify Deal in Operational Portal.");
        }
    })

    //TC-291331: LLC-Embedded Portal-Manage Document-Verify Lender Portal for Documents - BNS
    it('TC-291331: LLC-Embedded Portal-Manage Document-Verify Lender Portal for Documents', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            browser.sleep(2000);
            CustomLibrary.OpenNewTab();
            browser.sleep(1000);
            CustomLibrary.navigateToWindowWithUrlContains("LenderPortal",2);
            //login to Lender portal
            LenderPortal.LoginToLenderPortalBNS( RunSettings.data.Global.LLC[Env].BNSLenderUser, RunSettings.data.Global.LLC[Env].BNSLenderPassword);

            //Search deal in lender portal
            LenderPortal.SearchDealBNS('Lender Ref #', lenderReferenceNumber);
            //Verify lawyer document
            LenderPortal.VerifyLawyerDoc('Other-' + DocName);
            browser.sleep(2000);
            CustomLibrary.closeWindowUrlContains("LenderPortal");
            CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
            
            
        }
        else {
            expect(true).toBe(false, "Unable to Verify Lender Portal.");
        }
    })

})

describe('TC- 247415 : Send Documents using lender service', function () {
    var BNSFctUrn = null;
    var loginRedirectURL = null;
    var lenderReferenceNumber = null;
    var Env = RunSettings.data.Global.ENVIRONMENT.value;
    var DocName = CustomLibrary.getRandomString(10);

    afterAll(function () {
        LenderIntegrationBNS.CleanUpScript();
        LawyerIntegrationBNS.CleanUpScript();
    });

    it('Generate BNS Deal - Create deal soap service', function () {
        LenderIntegrationBNS.CreateBNSDeal('false', 'true', TestData.data[Lang].WebService.Province);
    })

    it('Accept Deal - AcceptReject soap service', function () {
        BNSFctUrn = LenderIntegrationBNS.ReturnFctUrn();
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) {
            //Accepting the deal
            LawyerIntegrationCommon.AcceptRejectDeal(BNSFctUrn, "ACTIVE");
        }
        else {
               expect(true).toBe(false, "CreateBNSDeal service timed out!!!");
        }
    })

    //TC- 247415 : Send Documents using lender service
    it('TC- 247515: Send document using lender service', function () {
        if (BNSFctUrn) {
            LenderIntegrationBNS.SendDocument('PCA', lenderReferenceNumber);
            LenderIntegrationBNS.SendDocument('INS', lenderReferenceNumber);

        }
        else {
            expect(true).toBe(false, "Unable to send the document!!!");
        }
        
    })

    it('TC- 247515: Manage documents: View lender Documents', function () {
        browser.ignoreSynchronization = true;
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) {
            loginRedirectURL = LawyerIntegrationCommon.LoginViaRedirectURLWithWait(BNSFctUrn, 'LLCDEAL');
            if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
                
                MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
                ManageDocuments.clickLenderDocView('Personal Credit Agreement');
                ManageDocuments.clickLenderDocView('Default Insurance Certificate');
                
            }
                                                              
        
            else {
                expect(true).toBe(false, "Unable to view Documents as Redirect URL is null.");
            }

        }
        else {
            expect(true).toBe(false, "Unable to view Documents as deal is not created.");
        }
     
    })

    it('TC:329716- Unable to create document with pending lender amendments', function () {
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) {
          
            //IsSolicitorClose, IsRFF, CityUpdate, ProvinceUpdate, MortgageCentreFirstName
            LenderIntegrationBNS.UpdateBNSDeal('false', 'true', 'Mississauga', null, null);
           
            //TC:329716- 11.6 Standardize portal messages to reference partner instead of Unity - create/regenerate the document-  BNS
            ManageDocuments.ClickCreateEnglishDocumentNew('Certificate of Independent Legal Advice');  
            ManageDocuments.VerifyMsgMD(TestData.data[Lang].Messages[Env].CreateDocMsg);
         
         }
        else {
            expect(true).toBe(false, "Lender unable to update deal.");           
        }
    })

    it('Lawyer Accepts Lender Changes', function () {
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) {
            LawyerIntegrationCommon.getAndSendAcceptRejectAmendment(BNSFctUrn, 'ACCEPT');
            browser.sleep(8500);
        }
        else {
            expect(true).toBe(false, "Lawyer is not able to reject deal.");  
        } 
    })

    it('Navigate to Manage documents', function () {
       
            if (loginRedirectURL)  {
                MenuPanel.PrimaryMenuNavigateWithWait('Home');
                MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
                            
            }

        else {
            expect(true).toBe(false, "Unable to view Documents as deal is not created.");
        }
     
    })

    it('TC:329721- Unable to upload additional document with pending lender amendments', function () {
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) {
            //IsSolicitorClose, IsRFF, CityUpdate, ProvinceUpdate, MortgageCentreFirstNam
            LenderIntegrationBNS.UpdateBNSDeal('false', 'true', 'Mississaugae', null, null);
            //TC:329721- 11.6 Standardize portal messages to reference partner instead of Unity - Upload document -  BNS
            ManageDocuments.UploadAdditionalDocument(DocName);
            ManageDocuments.VerifyUploadAmdMsg(TestData.data[Lang].Messages[Env].UploadDocMsg);
           
         }
        else {
            expect(true).toBe(false, "Lender unable to update deal.");           
        }
    })
    
    it('Lawyer Accepts Lender Changes', function () {
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) {
            LawyerIntegrationCommon.getAndSendAcceptRejectAmendment(BNSFctUrn, 'ACCEPT');
            browser.sleep(8500);
            MenuPanel.PrimaryMenuNavigateTo('Home');
            ManageDocuments.NavigateAwayAcceptReject('OK');
            MenuPanel.PrimaryMenuNavigateTo('Final Report');
                        
        }
        else {
            expect(true).toBe(false, "Lawyer is not able to reject deal.");  
        } 
    })

    //TC:329724- 11.6 Standardize portal messages to reference partner instead of Unity - Save data -  BNS
    it('TC:329724- Save data with pending lender amendments', function () {
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) {
            
            //IsSolicitorClose, IsRFF, CityUpdate, ProvinceUpdate, MortgageCentreFirstName
            LenderIntegrationBNS.UpdateBNSDeal('false', 'true', 'Mississaugar', null, null);
            //TC:329724- 11.6 Standardize portal messages to reference partner instead of Unity - Save data -  BNS
            FinalReport.ClickFRButtons('Save');
            FinalReport.VerifySaveDataMsg(TestData.data[Lang].Messages[Env].SaveDataMsg)
           
         }
        else {
            expect(true).toBe(false, "Lender unable to update deal.");           
        }
    })
   

})




