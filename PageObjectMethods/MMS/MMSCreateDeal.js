'use strict';
//var sql = require('mssql');
var Runsettings = require('../../testData/RunSetting.js');
var CustomLibrary = require('../../CustomLibrary/CustomLibrary.js');

var Env = Runsettings.data.Global.ENVIRONMENT.value;
var fileToUpload = '../../TestData/MMS/test.pdf';
var path = require('path');
const { browser } = require('protractor');

var DocumentPath = path.resolve(__dirname, fileToUpload);
var LawyerDataLawFirm = Runsettings.data.Global.MMS[Env].LawyerDataLawFirm;

var MMSPortal = function () {

    var tbFCTURN = element(by.id('ctl00_ContentPlaceHolder2_txtFCTReferenceNumber'));
    var btnsearch = element(by.id('ctl00_ContentPlaceHolder2_btnSearch'));
    var FirstResultRow = element.all(by.css('.gridViewRow')).get(0);
    var ClosingDate = element(by.id('LeftMenu1_PolicyStatus_txtClosingDate_txtDate'))
    var ddlReason = element(by.id('ddlClosingDateReason'));
    var tbReason = element(by.id('txtClosingDateReasonOther'))
    var DealSendToLLC = element(by.id('LeftMenu1_lblSentDealMessage'));


    //LLC Lawyer Deal events
    var LLCLawyerTab = element(by.id("LeftMenu1_lbLlcLawyerEvents"))
    var chbSelectAcknowledge =element(by.id('LeftMenu1_LlcLawyerEvents_AcknowledgePifEvent_grdUnacknowledgedEvents_ctl02_chkbAcknowledge'));
    var btnAcknowledge = element(by.id('LeftMenu1_LlcLawyerEvents_AcknowledgePifEvent_btnAcknowledge'));
    // Status
    var ddlSpecialist = element(by.id('LeftMenu1_PolicyStatus_ddlSpecialist'));

    var btnReady2Instruct = element(by.id('LeftMenu1_PolicyStatus_btnReadyToInstruct'));
    //var ddlLenderCode = element(by.id('LeftMenu1_Lender_ddlLenderCode'));
    var LeftMenuStatusOption = element(by.id('LeftMenu1_lbPolicyStatus'));

    var btnCOI = element(by.id('LeftMenu1_PolicyStatus_btnCOI'));
    var txtCOIissued = element(by.id('LeftMenu1_PolicyStatus_txtCOIIssued'));
    var btnReleaseHold = element(by.id('LeftMenu1_PolicyStatus_btnHold'));


    //Lender
    var LeftMenuLenderOPtion = element(by.id('LeftMenu1_lbLender'));
    var ddlOriginatinBranch = element(by.id('LeftMenu1_Lender_ddlBranch'));
    var ddlcontactName = element(by.id('LeftMenu1_Lender_ddlContactName'));
    var ddlProgramType = element(by.id('LeftMenu1_Lender_ddlProgramType'));
    var tbContactName = element(by.id('LeftMenu1_Lender_txtAddLenderContactFName'));
    var tbContactLastName = element(by.id('LeftMenu1_Lender_txtAddLenderContactLName'))
    var tbPhoneNumber = element(by.id('LeftMenu1_Lender_txtAddLenderContactPhone'))
    var tbFaxNumber = element(by.id('LeftMenu1_Lender_txtAddLenderContactFax'))
    var tbEmail = element(by.id('LeftMenu1_Lender_txtAddLenderContactEmail'));
    var tbExtension = element(by.id('LeftMenu1_Lender_txtAddLenderContactExt'));

    //Mortgagor
    var LeftMenuMortgagorOption = element(by.id('LeftMenu1_lbMortgagor'));
    var btnedit = element(by.xpath('//*[@id="LeftMenu1_Mortgagor_grdMortgagors"]/tbody/tr[2]/td[3]/a'));
    var btnedit = element(by.css('[href*="LeftMenu1$Mortgagor$grdMortgagors$ctl02$ctl01"]'));
    var btnUpdate = element(by.id('LeftMenu1_Mortgagor_btnAdd'));
    var ddlTitle = element(by.id('LeftMenu1_Mortgagor_ddlMortgagorTitle'));
    var tbMortgagorLastName = element(by.id('LeftMenu1_Mortgagor_txtLastName'));
    var tbMortgagorfirstName = element(by.id('LeftMenu1_Mortgagor_txtFirstName'))
    var tbUnitNumber = element(by.id('LeftMenu1_Mortgagor_txtUnitNumber'));
    var tbStreetNumber = element(by.id('LeftMenu1_Mortgagor_txtStreetNumber'));

    //Property
    var LeftMenuPropertyOption = element(by.id('LeftMenu1_lbProperty'));
    var ddlMortgagorAddress = element(by.id('LeftMenu1_Properties_ddlMortgagorAdd'));
    var tbPropertyaddress1 = element(by.id('LeftMenu1_Properties_txtAddress1'))
    var tbPropertyAddres2 = element(by.id('LeftMenu1_Properties_txtAddress2'))
    var tbPropertyCity = element(by.id('LeftMenu1_Properties_txtCity'));
    var ddlProvince = element(by.id('LeftMenu1_Properties_ddlProvince'));
    var btnAddProperty = element(by.id('LeftMenu1_Properties_btnAddProperty'));
    var PropertyDatagrid = element(by.id('LeftMenu1_PolicyStatus_grdProperty'));
    var txtARNNo = element(by.id('LeftMenu1_Properties_txtARN'));
    var PIN = element(by.id('LeftMenu1_Properties_txtPIN'));
    var btnAddPIN = element(by.id('LeftMenu1_Properties_btnAddPIN'));


    //Lawyer
    var LeftMenuLawyerOption = element(by.id('LeftMenu1_lbLawyer'));
    var btnFindLawyer = element(by.id('LeftMenu1_Lawyer_lbSearchLawyer'));
    var txtLawFirm = element(by.id('txtLawFirm'));
    var txtLawyerName = element(by.id('txtLawyerName'));
    var btnsearchLawyerName = element(by.id('btnSearch'));
    var FirstLawyerDetail = element(by.css('.gridViewRow'))
    var btnConfirmLawyerSelection = element(by.cssContainingText('span', 'OK'));
    var btnOkLayerSelection = element(by.cssContainingText('span', 'OK'));
    var txtConfirmationDate = element(by.id('LeftMenu1_Lawyer_txtConfirmationDate'));
    var txtRegDate = element(by.id('LeftMenu1_Lawyer_txtRegDate_txtDate'));
    var txtInstrumentNo = element(by.id('LeftMenu1_Lawyer_txtInstrumentNum'));
    var ddlTrustAccount = element(by.id('LeftMenu1_Lawyer_ddlTrustAccount'));
    var lblLawyerStatus = element(by.id('LeftMenu1_Lawyer_lblLawyerStatus'));

    //New Mortgage
    var LeftMenuNewMortgageOption = element(by.id('LeftMenu1_lbNewMortgage'));
    var tbMortgageAmount = element(by.id('LeftMenu1_NewMortgage_txtMortgageAmount'));
    var tbRegisteredAmount = element(by.id('LeftMenu1_NewMortgage_txtRegisteredAmount'))
    var ddlMortgageProduct = element(by.id('LeftMenu1_NewMortgage_ddlMortgageProduct'));
    var ddlTransactionType = element(by.id('LeftMenu1_NewMortgage_ddlTransactionType'));
    var ddlMortgagePriority = element(by.id('LeftMenu1_NewMortgage_ddlPriority'));
    var ddlPayementPeriod = element(by.id('LeftMenu1_NewMortgage_ddlPaymentPeriod'));
    var tbBridgeLoanNumber = element(by.id('LeftMenu1_NewMortgage_UcBridgeLoan1_txtLoanNumber'));
    var tbBridgeLoanAmount = element(by.id('LeftMenu1_NewMortgage_UcBridgeLoan1_txtLoanAmount'));
    var txtActualMortgageRate = element(by.id('LeftMenu1_NewMortgage_txtInterestRate'));

    // Documents
    var LeftMenuDocumentOPtion = element(by.id('LeftMenu1_lbDealDocuments'));
    var ddlDocumenttype = element(by.id('LeftMenu1_Documents_cboDocumentType'));
    var btnSendDocument = element(by.id('LeftMenu1_Documents_btnSend'));

    //  Solicitors Instructions
    var LeftMenuSolictorOption = element(by.id('LeftMenu1_lbSolicitorInstructions'));
    var ChkBrokerConditions = element(by.id('LeftMenu1_SolicitorInstructions_Milestones_grdMilestones_ctl02_chkConfirmed'));
    var ChkSolictitorConditions = element(by.id('LeftMenu1_SolicitorInstructions_Milestones_grdMilestones_ctl03_chkConfirmed'));
    var ChkLenderAuthorization = element(by.id('LeftMenu1_SolicitorInstructions_Milestones_grdMilestones_ctl04_chkConfirmed'));
    var chkSolicitorCondition1 = element(by.id('LeftMenu1_SolicitorInstructions_Milestones_grdMilestones_ctl05_chkConfirmed'));
    var btnSendToLLC = element(by.id('LeftMenu1_btnSendToLLC'));
    var btnPropQSubmit = element(by.id('LeftMenu1_SolicitorInstructions_SolicitorQuestions_btnSubmit'));

    //Instructions for funding checkboxes
    var tblInstructionsforFunding = element(by.id('LeftMenu1_SolicitorInstructions_RegularSolicitorInstructions_grdInstruction'));

    //Notes  
    var LeftMenuNotesOption = element(by.id('LeftMenu1_lbNotes'));
    var txtNotes = element(by.id('LeftMenu1_Notes_txtNote'));
    var chkViewablebyLawyer = element(by.id('LeftMenu1_Notes_chkViewableToLawyer'));
    var btnAddNotes = element(by.id('LeftMenu1_Notes_btnAdd'));
    var GrdFirstNote = element(by.id('LeftMenu1_Notes_grdNotes')).element(by.id('LeftMenu1_Notes_grdNotes_ctl02_lblNotes'));
    var lawyerGridMortageClosing = element(by.id('LeftMenu1_Lawyer_grdMortgageClosing'));
    var chkbox = lawyerGridMortageClosing.element(by.tagName('tbody'));
    var tabInstructionsforFunding = element(by.id('LeftMenu1_SolicitorInstructions_RegularSolicitorInstructions_grdInstruction'));
    var chkboxInstructionsforFund = tabInstructionsforFunding.element(by.tagName('tbody'))

    //Funding  
    var LeftMenuFundingOption = element(by.id('LeftMenu1_lbFunding'));
    var ddlToAccount = element(by.id('LeftMenu1_Funding_ddlToAccount'));
    var btnTransfertoLawyer = element(by.id('LeftMenu1_Funding_btnTransfer'));
    var btnFundSave = element(by.id('LeftMenu1_Funding_btnSave'));

    //tabfunding
    var tabFundingList = element(by.id('ctl00_ContentPlaceHolder1_FundingList_gvFundingList'));
    var tabBodyFunding = tabFundingList.element(by.tagName('tbody'));
    var ddlLender = element(by.id('ctl00_ContentPlaceHolder2_FundingCategory_ddlLender'));
    var txtFundFromDate = element(by.id('ctl00_ContentPlaceHolder2_FundingCategory_txtFromDate_txtDate'));
    var txtFundToDate = element(by.id('ctl00_ContentPlaceHolder2_FundingCategory_txtToDate_txtDate'));
    var btnFundSubmit = element(by.id('ctl00_ContentPlaceHolder2_FundingCategory_btnSubmit'));
    var lnkLenderConfirmationRequired = element(by.cssContainingText('.status', 'Lender Confirmation Required'));
    var lnkReleaser2 = element(by.id('ctl00_ContentPlaceHolder2_FundingCategory_gvCategory')).all(by.tagName('tr')).get(4).element(by.cssContainingText('a', 'Releaser 2'));
    var lnkReleaser3 = element(by.id('ctl00_ContentPlaceHolder2_FundingCategory_gvCategory')).all(by.tagName('tr')).get(5).element(by.cssContainingText('a', 'Releaser 3'));
    var chkReportCompleted = element(by.id('LeftMenu1_Lawyer_chkbReportCompleted'));
    var txtPolicyCloseDate = element(by.id('LeftMenu1_PolicyStatus_txtClosedDate'));
    var txtreportCompleted = element(by.id('LeftMenu1_PolicyStatus_txtReportCompleted'));

    //PolicyHistory
    var lnkLeftMenuPolicyHistory = element(by.id('LeftMenu1_lbPolicyHistory'));
    var tblPolicyHistory = element(by.id('LeftMenu1_PolicyHistory_grdResult'));

    //PropertyQuestions

    //ON
    var radPropQ1 = element(by.id('LeftMenu1_SolicitorInstructions_SolicitorQuestions_Question_10000_lstAnswerTypes__Question_10000_AnswerType_10002____Question_10000_AnswerType_10002___ucGroupRadioButton'));
    var radPropQ5 = element(by.id('LeftMenu1_SolicitorInstructions_SolicitorQuestions_Question_150300_lstAnswerTypes__Question_150300_AnswerType_150302____Question_150300_AnswerType_150302___ucGroupRadioButton'));
    var radPropQ6 = element(by.id('LeftMenu1_SolicitorInstructions_SolicitorQuestions_Question_150400_lstAnswerTypes__Question_150400_AnswerType_150401____Question_150400_AnswerType_150401___ucGroupRadioButton'));
    var txtPropQ1 = element(by.id('LeftMenu1_SolicitorInstructions_SolicitorQuestions_Question_10060_lstAnswerTypes__Question_10060_AnswerType_10061____Question_10060_AnswerType_10061___ucTextBox'));
    var txtPropQ2 = element(by.id('LeftMenu1_SolicitorInstructions_SolicitorQuestions_Question_10060_lstAnswerTypes__Question_10060_AnswerType_10062____Question_10060_AnswerType_10062___ucTextBox'));
    var txtPropQ3 = element(by.id('LeftMenu1_SolicitorInstructions_SolicitorQuestions_Question_10060_lstAnswerTypes__Question_10060_AnswerType_10063____Question_10060_AnswerType_10063___ucTextBox'));
    var radPropQ7 = element(by.id('LeftMenu1_SolicitorInstructions_SolicitorQuestions_Question_10100_lstAnswerTypes__Question_10100_AnswerType_10102____Question_10100_AnswerType_10102___ucGroupRadioButton'));
    var radPropQ8 = element(by.id('LeftMenu1_SolicitorInstructions_SolicitorQuestions_Question_10300_lstAnswerTypes__Question_10300_AnswerType_10301____Question_10300_AnswerType_10301___ucGroupRadioButton'));
    var radPropQ10 = element(by.id('LeftMenu1_SolicitorInstructions_SolicitorQuestions_Question_10050_lstAnswerTypes__Question_10050_AnswerType_10053____Question_10050_AnswerType_10053___ucGroupRadioButton'));
    var radPropQ11 = element(by.id('LeftMenu1_SolicitorInstructions_SolicitorQuestions_Question_180300_lstAnswerTypes__Question_180300_AnswerType_180303____Question_180300_AnswerType_180303___ucGroupRadioButton'));
    var radPropQ12 = element(by.id('LeftMenu1_SolicitorInstructions_SolicitorQuestions_Question_150200_lstAnswerTypes__Question_150200_AnswerType_150203____Question_150200_AnswerType_150203___ucGroupRadioButton'));
    var btnPropQSubmit = element(by.id('LeftMenu1_SolicitorInstructions_SolicitorQuestions_btnSubmit'));
    var chkboxConfirmation = element(by.id('LeftMenu1_Lawyer_grdMortgageClosing_ctl02_chkConfirmed'));
    var chkboxdupConfirmation = element(by.id('LeftMenu1_Lawyer_grdMortgageClosing_ctl03_chkConfirmed'));
    //MB
    var radPropMB1 = element(by.id('LeftMenu1_SolicitorInstructions_SolicitorQuestions_Question_10050_lstAnswerTypes__Question_10050_AnswerType_10052____Question_10050_AnswerType_10052___ucGroupRadioButton'));
    var radPropMB2 = element(by.id('LeftMenu1_SolicitorInstructions_SolicitorQuestions_Question_210100_lstAnswerTypes__Question_210100_AnswerType_210102____Question_210100_AnswerType_210102___ucGroupRadioButton'));
    var radPropMB3 = element(by.id('LeftMenu1_SolicitorInstructions_SolicitorQuestions_Question_210200_lstAnswerTypes__Question_210200_AnswerType_210202____Question_210200_AnswerType_210202___ucGroupRadioButton'));
    var radPropMB4 = element(by.id('LeftMenu1_SolicitorInstructions_SolicitorQuestions_Question_210300_lstAnswerTypes__Question_210300_AnswerType_210302____Question_210300_AnswerType_210302___ucGroupRadioButton'));
    var radPropMB5 = element(by.id('LeftMenu1_SolicitorInstructions_SolicitorQuestions_Question_210400_lstAnswerTypes__Question_210400_AnswerType_210402____Question_210400_AnswerType_210402___ucGroupRadioButton'));
    //AB
    var radPropAB1 = element(by.id('LeftMenu1_SolicitorInstructions_SolicitorQuestions_Question_200100_lstAnswerTypes__Question_200100_AnswerType_200102____Question_200100_AnswerType_200102___ucGroupRadioButton'));
    var radPropAB2 = element(by.id('LeftMenu1_SolicitorInstructions_SolicitorQuestions_Question_200200_lstAnswerTypes__Question_200200_AnswerType_200202____Question_200200_AnswerType_200202___ucGroupRadioButton'));
    var radPropAB3 = element(by.id('LeftMenu1_SolicitorInstructions_SolicitorQuestions_Question_200300_lstAnswerTypes__Question_200300_AnswerType_200302____Question_200300_AnswerType_200302___ucGroupRadioButton'));
    var radPropAB4 = element(by.id('LeftMenu1_SolicitorInstructions_SolicitorQuestions_Question_200400_lstAnswerTypes__Question_200400_AnswerType_200402____Question_200400_AnswerType_200402___ucGroupRadioButton'));




    //Manage Document/PIF
    var tblPostedDocument = element(by.id('LeftMenu1_Documents_DocumentList_grdDocumentList'));
    var tblbodyPostedDocument = tblPostedDocument.element(by.tagName('tbody'));
    var btnPublishandNotify = element(by.id('LeftMenu1_Documents_DocumentList_btnPublishAndNotify'))
    var btnPublish = element(by.id('LeftMenu1_Documents_DocumentList_btnPublish'));
    // Manage Document/PIF

    //PreFundInformation

    var txtLegalDesc = element(by.id('LeftMenu1_Properties_txtLegalDescription'));
    var ddlMunicipal = element(by.id('LeftMenu1_Properties_ddlMunicipal'));
    var ddlEstateType = element(by.id('LeftMenu1_Properties_ddlEstateType'));
    var counter = 0;
    var LLCLawyerTab = element(by.id("LeftMenu1_lbLlcLawyerEvents"));
    var LLCLawyerEventsTab = element(by.id("LeftMenu1_liLlcLawyerEvents"));

    this.SearchbyFCTURN = function (txt) {
        tbFCTURN.clear();
        tbFCTURN.sendKeys(txt);
        CustomLibrary.WaitNClick(btnsearch);
        CustomLibrary.WaitNClick(FirstResultRow);
    }

    this.ClickLLCLAwyerTab = function () {
        CustomLibrary.WaitNClick(LLCLawyerTab);
    }

    this.ClickLLCLAwyerEventTab = function () {
        CustomLibrary.WaitNClick(LLCLawyerEventsTab);
    }

    var WaitForLawyerDealEvents = function () {
        CustomLibrary.WaitNClick(LLCLawyerTab);
        CustomLibrary.WaitNClick(LeftMenuNotesOption);
        return element.all(by.id('LeftMenu1_imgAmendment')).count().then(function (count) {
            if (count > 0) {
                return true;
            }
        });
    }

    this.WaitForLawyerEvents = function () {
        browser.wait(WaitForLawyerDealEvents, 240000);
    }

    var WaitForDeclineRFF = function () {
        CustomLibrary.WaitNClick(LeftMenuNotesOption);
        CustomLibrary.WaitNClick(LLCLawyerTab);
        return element.all(by.id('LeftMenu1_LlcLawyerEvents_RequestForFund_rbRffDecline')).count().then(function (count) {
            if (count > 0) {
                return true;
            }
        });
    }


    this.WaitForRFFDeclineButton = function () {
        browser.wait(WaitForDeclineRFF, 240000);
    }

    
    var WaitForStatusHold = function () {
        CustomLibrary.WaitNClick(LLCLawyerEventsTab);
        CustomLibrary.WaitNClick(LeftMenuStatusOption);
        var lblStatus = element.all(by.id('LeftMenu1_PolicyStatus_lblStatus'));
        return lblStatus.getText().then(function (txt) {
            if (txt == 'HOLD') {
                return true;
            }
        });
    }

    this.WaitForHoldStatus = function () {
        browser.wait(WaitForStatusHold, 180000);
    }

      
    var WaitForAckEntry = function () {
        
        CustomLibrary.WaitNClick(LeftMenuStatusOption);
        CustomLibrary.WaitNClick(LLCLawyerEventsTab);
   
        return  element.all(by.id('LeftMenu1_LlcLawyerEvents_AcknowledgePifEvent_grdUnacknowledgedEvents_ctl02_chkbAcknowledge')).count().then(function (count) {
                if (count > 0) {
                    
                CustomLibrary.WaitNClick(chbSelectAcknowledge);
                CustomLibrary.WaitNClick(btnAcknowledge);
                return true;
                }
            
        });
    }

    this.WaitForEntryToAck = function () {
        browser.wait(WaitForAckEntry, 180000);
    }

    

    var WaitForPolicyHistoryEntry = function () {
        CustomLibrary.WaitNClick(lnkLeftMenuPolicyHistory);
        CustomLibrary.WaitNClick(LeftMenuNotesOption);
        return element.all(by.id('LeftMenu1_imgAmendment')).count().then(function (count) {
            if (count > 0) {
                return true;
            }
        });
    }

    this.WaitForPolicyHistory = function () {
        browser.wait(WaitForPolicyHistoryEntry, 180000);
    }

    this.VerifyDocUndeDocSection = function (DocName) {
        LeftMenuDocumentOPtion.click();
        element.all(by.xpath('//*[@id="LeftMenu1_Documents_DocumentList_grdDocumentList"]/tbody/tr/td[contains(text(),\'' + DocName + '\')]')).count().then(function(count)
        {
            expect(count).toBeGreaterThan(0, "Document not present under Document Grid in MMS FCT Portal " + DocName)
        });
        
    }

    var VerifyDocUndeDocSectionNew = function (DocName) {
        var found = false;

        LeftMenuDocumentOPtion.click();
        element.all(by.xpath('//*[@id="LeftMenu1_Documents_DocumentList_grdDocumentList"]/tbody/tr/td[contains(text(),\'' + DocName + '\')]')).count().then(function(count)
        {
            
            if (count>0) {
                expect(count).toBeGreaterThan(0, "Document not present under Document Grid in MMS FCT Portal " + DocName);
                found = true;
            }
            else {
                if (found != true && count == 0) {
                    CustomLibrary.WaitNClick(LeftMenuNotesOption);
                    LeftMenuDocumentOPtion.click();
                    VerifyDocUndeDocSectionNew(DocName);
                }
            }

    });
    }
    
    this.WaitForLawyerDocuments = function (DocName) {
        browser.sleep(VerifyDocUndeDocSectionNew(DocName), 180000);
    }

    this.VerifyPIFEventandAcknowledgePIF = function()
    {
        
        CustomLibrary.WaitNClick(chbSelectAcknowledge);
        CustomLibrary.WaitNClick(btnAcknowledge);
        
    }

    this.VerifyPIFEventandAcknowledgePIFOnPresent = function()
    {
        CustomLibrary.WaitNClick(LeftMenuStatusOption);
        CustomLibrary.WaitNClick(LLCLawyerEventsTab);
        CustomLibrary.WaitNClick(chbSelectAcknowledge);
        CustomLibrary.WaitNClick(btnAcknowledge);
        
    }

    //Lawyer Amendment
    this.SubmitLenderDecline = function () {
        var radbtnDecline = element(by.id('LeftMenu1_LlcLawyerEvents_Amendments_grdAmendments_ctl02_rbDeclineAmendment'));
        var txtDeclineReason = element(by.id('LeftMenu1_LlcLawyerEvents_Amendments_grdAmendments_ctl02_tbReasonAmendment'));
        radbtnDecline.click();
        txtDeclineReason.sendKeys('Test Declined');
    }

    //Lawyer Request for funds
    this.SubmitLenderDeclineRFF = function () {
        var radbtnDeclineRFF = element(by.id('LeftMenu1_LlcLawyerEvents_RequestForFund_rbRffDecline'));
        var txtDeclineReasonRFF = element(by.id('LeftMenu1_LlcLawyerEvents_RequestForFund_tbRffReason'));
        CustomLibrary.WaitNClick(radbtnDeclineRFF);
        //radbtnDeclineRFF.click();
        txtDeclineReasonRFF.sendKeys('Test Declined');
    }

    this.SubmitLenderAccept = function () {
        var radbtnAccept = element(by.id('LeftMenu1_LlcLawyerEvents_Amendments_grdAmendments_ctl02_rbAcceptAmendment'));
        radbtnAccept.click();
    }

    //Lawyer Request for funds
    this.SubmitLenderAcceptRFF = function () {
        var radbtnAcceptRFF = element(by.id('LeftMenu1_LlcLawyerEvents_RequestForFund_rbRffAccept'));
        radbtnAcceptRFF.click();
    }

    this.VerifyNoLawyerEvent = function () {
        expect((FirstResultRow).isPresent()).toBe(false, 'First result row is present!')
    }

    this.ClickLenderActionContinue = function () {
        var btnContinue = element(by.id('LeftMenu1_LlcLawyerEvents_Amendments_btnContinue'));
        CustomLibrary.WaitNClick(btnContinue);//Sept 5
        CustomLibrary.WaitNClick(btnOkLayerSelection);//Sept 5
    }

    this.ClickLenderActionContinueRFF = function () {
        var btnContinueRFF = element(by.id('LeftMenu1_LlcLawyerEvents_RequestForFund_btnContinue'));
        CustomLibrary.WaitNClick(btnContinueRFF);
        CustomLibrary.WaitNClick(btnOkLayerSelection);
    }

    this.VerifyClosingDateinStatus = function (inputClosingDate) {
        var lblClosingDate = element(by.id('LeftMenu1_lblClosingDate'));
        CustomLibrary.WaitforElementVisible(lblClosingDate);
        lblClosingDate.getText().then(function (value) {
            expect(value).toBe(inputClosingDate, 'Closing date is not as expected!');
            console.log("Closing Date Validated :", value);
        });
    }

    //Lawyer Amendment
    this.VerifyCancellationRequest = function (reason) {
        var Reason = element(by.id('LeftMenu1_LlcLawyerEvents_CancellationRequest_grdCancellationRequests_ctl02_Reason'))
        CustomLibrary.WaitforElementVisible(Reason);
        expect(Reason.getText()).toContain(reason, "Expected Reason is not present");
    }

    this.AcceptAndAcknowldegeCancellation = function () {
        element(by.id("LeftMenu1_LlcLawyerEvents_CancellationRequest_grdCancellationRequests_ctl02_chkbAcknowledge")).click();
        element(by.id("LeftMenu1_LlcLawyerEvents_CancellationRequest_btnAcknowledge")).click();
    }

    this.VerifyCancellationAcknowledged = function () {
        var Reason = element(by.id("LeftMenu1_LlcLawyerEvents_EventHistory_grdEventHistory_ctl02_lblEvent"));
        Reason.getText().then(function (txt) {
            expect(txt).toContain("User has acknowledged REQUESTCANCELLATION event.", "Expected entry is not present.");
        })
    }

    this.EnterStatusData = function (spec, BnkLenderName) {
        browser.waitForAngular();
        browser.manage().timeouts().implicitlyWait(3000);
        CustomLibrary.WaitforElementVisible(ddlSpecialist);
        CustomLibrary.WaitNClick(ddlSpecialist.element(by.cssContainingText('option', spec)));
        ClosingDate.clear();
        CustomLibrary.WaitNClick(ddlReason.element(by.cssContainingText('option', 'Other')));
        tbReason.sendKeys(CustomLibrary.getRandomString(20));
        if (BnkLenderName == 'Street Capital Financial Corporation' || BnkLenderName == 'Street Capital Bank of Canada' || BnkLenderName == 'RFA Bank of Canada') {
            btnReady2Instruct.click();
            browser.sleep(3000);
            browser.wait(function () {
                return browser.switchTo().alert().then(
                    function () { return true; },
                    function () { return false; }
                );
            });
            browser.switchTo().alert().accept();
            browser.sleep(3000);
        }
    }

    this.EnterClosingDateinStatusData = function (spec) {
        browser.waitForAngular();
        browser.manage().timeouts().implicitlyWait(500);
        CustomLibrary.WaitforElementVisible(ddlSpecialist);
        CustomLibrary.WaitNClick(ddlSpecialist.element(by.cssContainingText('option', spec)));
        ClosingDate.clear();
        //ClosingDate.sendKeys(CustomLibrary.DateConversionMMDDYYYYY(CustomLibrary.FutureDatenew(1)));
        ClosingDate.sendKeys(CustomLibrary.DateConversionMMDDYYYYY(CustomLibrary.FutureDate()));
        CustomLibrary.WaitNClick(ddlReason.element(by.cssContainingText('option', 'Other')));
        tbReason.sendKeys(CustomLibrary.getRandomString(20));

    }
    this.EnterLenderdata = function (Branch, contactName, programType) {
        CustomLibrary.WaitforElementVisible(LeftMenuLenderOPtion);
        CustomLibrary.WaitNClick(LeftMenuLenderOPtion)//added Sept 10
        CustomLibrary.WaitforElementVisible(tbContactLastName);
        tbContactLastName.sendKeys(CustomLibrary.getRandomString(10));
        tbContactName.sendKeys(CustomLibrary.getRandomString(10));
        tbFaxNumber.sendKeys(CustomLibrary.getRandomNumber(10));
        tbPhoneNumber.sendKeys(CustomLibrary.getRandomNumber(10));
        tbExtension.sendKeys(CustomLibrary.getRandomNumber(6));
        tbEmail.sendKeys(CustomLibrary.GenerateRandomEmailAdd());
        CustomLibrary.WaitNClick(ddlOriginatinBranch.element(by.cssContainingText('option', Branch)));
        CustomLibrary.WaitNClick(ddlcontactName.element(by.cssContainingText('option', contactName)));
        CustomLibrary.WaitforElementVisible(ddlProgramType);
        CustomLibrary.WaitNClick(ddlProgramType.element(by.cssContainingText('option', programType)));//added Sept 10
    }

    this.EnterMortgagorData = function () {
        browser.sleep(10000);
        browser.waitForAngular();
        var namelist = [];
        var MortLastName = CustomLibrary.getRandomString(5);
        var MortFirstName = CustomLibrary.getRandomString(5);
        CustomLibrary.WaitforElementVisible(LeftMenuMortgagorOption);
        browser.manage().timeouts().implicitlyWait(500);//Sept 10
        CustomLibrary.WaitNClick(LeftMenuMortgagorOption)//Aug 29
        browser.waitForAngular();
        CustomLibrary.WaitNClick(btnedit);
        browser.waitForAngular();// Sept 10     
        browser.manage().timeouts().implicitlyWait(500);
        CustomLibrary.WaitforElementVisible(ddlTitle.element(by.cssContainingText('option', 'MR')));
        CustomLibrary.WaitNClick(ddlTitle.element(by.cssContainingText('option', 'MR')));
        //ddlTitle.element(by.cssContainingText('option', 'MR')).click();
        CustomLibrary.WaitforElementVisible(tbMortgagorLastName);
        CustomLibrary.WaitforElementVisible(tbMortgagorfirstName);
        tbMortgagorLastName.sendKeys(MortLastName);
        tbMortgagorfirstName.sendKeys(MortFirstName);
        CustomLibrary.WaitforElementVisible(tbUnitNumber);
        tbUnitNumber.sendKeys(CustomLibrary.getRandomNumber(1))
        tbStreetNumber.sendKeys(CustomLibrary.getRandomNumber(2));
        //btnUpdate.click();
        CustomLibrary.WaitNClick(btnUpdate);
        namelist[0] = MortFirstName;
        namelist[1] = MortLastName;
        return namelist;
    }

    this.EnterPopertyDataDynamic = function (provinceName) {
        browser.waitForAngular();
        CustomLibrary.WaitforElementVisible(LeftMenuPropertyOption);
        CustomLibrary.WaitForSpinnerInvisible();
        CustomLibrary.WaitNClick(LeftMenuPropertyOption);
        browser.manage().timeouts().implicitlyWait(500);
        CustomLibrary.WaitforElementVisible(ddlMortgagorAddress.all(by.tagName('option')).get(1).click());
        browser.manage().timeouts().implicitlyWait(500);
        CustomLibrary.WaitNClick(ddlProvince.element(by.cssContainingText('option', provinceName)));
        CustomLibrary.WaitNClick(tbPropertyaddress1);
        CustomLibrary.WaitforElementVisible(tbPropertyaddress1.sendKeys('Addres line1'));
        CustomLibrary.WaitforElementVisible(tbPropertyAddres2.sendKeys('Addres line2'));
        CustomLibrary.WaitforElementVisible(txtARNNo.sendKeys('123456'));
        //CustomLibrary.WaitforElementVisible(PIN.sendKeys('123456'));
        //CustomLibrary.WaitNClick(btnAddPIN);
        browser.manage().timeouts().implicitlyWait(500);
        CustomLibrary.WaitforElementVisible(tbPropertyCity);
        tbPropertyCity.sendKeys('Some City');
        browser.manage().timeouts().implicitlyWait(500);
        CustomLibrary.WaitforElementVisible(btnAddProperty.click());
    }

    this.EnterLawyerData = function () {
        CustomLibrary.WaitNClick(LeftMenuLawyerOption);
        CustomLibrary.WaitNClick(btnFindLawyer);
        CustomLibrary.SwitchTab(2);
        CustomLibrary.WaitforElementVisible(txtLawFirm);
        txtLawFirm.sendKeys(LawyerDataLawFirm);
        CustomLibrary.WaitNClick(btnsearchLawyerName);
        CustomLibrary.WaitNClick(FirstLawyerDetail);
        if (btnConfirmLawyerSelection.isPresent()) {
            btnConfirmLawyerSelection.click();
        }
        CustomLibrary.SwitchTab(1);
        btnOkLayerSelection.click();
    }

    this.EnterLawyerDataWithSearch = function (firstName, firmName, LastNameLawyer) {
        CustomLibrary.WaitNClick(LeftMenuLawyerOption);
        CustomLibrary.WaitNClick(btnFindLawyer);

        //CustomLibrary.SwitchTab(2);
        CustomLibrary.navigateToWindowWithUrlContains("SearchLawyer",3);
        browser.sleep(2000);
        CustomLibrary.WaitforElementVisible(txtLawFirm);
        txtLawFirm.sendKeys(firmName);
        txtLawyerName.sendKeys(LastNameLawyer);
        CustomLibrary.WaitNClick(btnsearchLawyerName);
        var tbBody = element(by.xpath('.//*[@id="grdResults"]/tbody'));
        var EC = protractor.ExpectedConditions;
        var EC1 = EC.visibilityOf(tbBody);
        var EC2 = EC.elementToBeClickable(tbBody);
        browser.wait(EC.and(EC1, EC2), 65000, 'Waiting for element to become visible & Clickable').then(() => {
            element.all(by.xpath('//*[@id="grdResults"]/tbody/tr[@class="gridViewRow"]/td[contains(text(),\'' + LastNameLawyer + '\')]/following-sibling::td[contains(text(),\'' + firstName + '\')]/following-sibling::td[contains(text(),\'' + firmName + '\')]')).count().then(function(count)
            {
                expect(count).toBeGreaterThan(0,"Lawyer Name is not found in Lawyer Grid");
                if(count>0)
                {
                    var lawyerRow = element(by.xpath('//*[@id="grdResults"]/tbody/tr[@class="gridViewRow"]/td[contains(text(),\'' + LastNameLawyer + '\')]/following-sibling::td[contains(text(),\'' + firstName + '\')]/following-sibling::td[contains(text(),\'' + firmName + '\')]'));
                    lawyerRow.click();                       
                    CustomLibrary.WaitForSpinnerInvisible();
                    CustomLibrary.WaitforElementVisible(btnConfirmLawyerSelection);
                    btnConfirmLawyerSelection.click();
                    CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
                    browser.sleep(2000);
                    //CustomLibrary.SwitchTab(1);
                    CustomLibrary.WaitNClick(btnOkLayerSelection); 
                }
            });  
           
        }, (error) => {
            console.log("Error occur while searching for lawyer");
        })

      /*  CustomLibrary.WaitForSpinnerInvisible();
        CustomLibrary.WaitforElementVisible(btnConfirmLawyerSelection);
        btnConfirmLawyerSelection.click();//Aug 26
        CustomLibrary.SwitchTab(1);
        CustomLibrary.WaitNClick(btnOkLayerSelection); //Aug 26*/
    }


    this.EditLawyerData = function (LawFirm) {
        LeftMenuLawyerOption.click();
        browser.sleep(1000);
        btnFindLawyer.click();
        browser.sleep(2000);
        CustomLibrary.SwitchTab(2);
        txtLawFirm.sendKeys(LawFirm);
        btnsearchLawyerName.click();
        browser.sleep(2500)
        FirstLawyerDetail.click();
        browser.sleep(2000)
        if (btnConfirmLawyerSelection.isPresent()) { btnConfirmLawyerSelection.click(); }
        browser.sleep(2000);
        CustomLibrary.SwitchTab(1);
        browser.sleep(5000);
        btnOkLayerSelection.click();
    }

    this.EnterNewMortgageData = function (mortgageProduct) {
        CustomLibrary.WaitNClick(LeftMenuNewMortgageOption);
        CustomLibrary.WaitNClick(ddlMortgageProduct.element(by.cssContainingText('option', mortgageProduct)));
        ddlTransactionType.element(by.cssContainingText('option', 'PURCHASE')).click();
        ddlMortgagePriority.element(by.cssContainingText('option', 'First')).click();
        ddlPayementPeriod.element(by.cssContainingText('option', 'Weekly')).click();
        tbBridgeLoanNumber.sendKeys(CustomLibrary.getRandomNumber(10));
        tbMortgageAmount.clear();
        tbMortgageAmount.sendKeys('$10000.00');
        tbRegisteredAmount.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, "a", protractor.Key.DELETE));
        tbRegisteredAmount.sendKeys('100000');
        tbBridgeLoanAmount.clear();
        tbBridgeLoanAmount.sendKeys('$10000.00');
    }

    this.EnterNewMortgageDataCommon = function (mortgageProduct, transactionType) {
        CustomLibrary.WaitNClick(LeftMenuNewMortgageOption);
        CustomLibrary.WaitNClick(ddlMortgageProduct.element(by.cssContainingText('option', mortgageProduct)));
        ddlTransactionType.element(by.cssContainingText('option', transactionType )).click();
        ddlMortgagePriority.element(by.cssContainingText('option', 'First')).click();
        ddlPayementPeriod.element(by.cssContainingText('option', 'Weekly')).click();
        tbBridgeLoanNumber.sendKeys(CustomLibrary.getRandomNumber(10));
        tbMortgageAmount.clear();
        tbMortgageAmount.sendKeys('$10000.00');
        tbRegisteredAmount.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, "a", protractor.Key.DELETE));
        tbRegisteredAmount.sendKeys('100000');
        tbBridgeLoanAmount.clear();
        tbBridgeLoanAmount.sendKeys('$10000.00');
    }

    this.EnterDocumentsData = function () {
        LeftMenuDocumentOPtion.click();
        CustomLibrary.WaitNClick(ddlDocumenttype.element(by.cssContainingText('option', 'Solicitor Instructions Pkg')));
        element(by.css('input[type="file"]')).sendKeys(DocumentPath);
        CustomLibrary.ScrollDown(0,10000);
        CustomLibrary.WaitNClick(btnSendDocument);
        return this.gettodayDate();
    }

    this.EnterDocumentsDataForPublish = function () {
        LeftMenuDocumentOPtion.click();
        CustomLibrary.WaitNClick(ddlDocumenttype.element(by.cssContainingText('option', 'Adjustable Rate Schedule')));
        element(by.css('input[type="file"]')).sendKeys(DocumentPath);
        CustomLibrary.ScrollDown(0,10000);
        CustomLibrary.WaitNClick(btnSendDocument);
        return this.gettodayDate();
    }

    this.gettodayDate = function () {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        return mm + "/" + dd + "/" + yyyy;
    }

    this.ClickDocumentsTab = function() {
        CustomLibrary.WaitNClick(LeftMenuDocumentOPtion);
    }

    //Manage Document
    this.EnterOtherDocumentsData = function () {
        CustomLibrary.WaitNClick(LeftMenuDocumentOPtion);
        CustomLibrary.WaitNClick(ddlDocumenttype.element(by.cssContainingText('option', 'Borrower Contact Info')));
        element(by.css('input[type="file"]')).sendKeys(DocumentPath);
        CustomLibrary.WaitNClick(btnSendDocument)
        return this.gettodayDate();
    }

    this.AllDocSelectCheckbox = function () {
        CustomLibrary.ScrollUp(0,10000);
        var chkboxInsuranceDoc = element(by.id('LeftMenu1_Documents_DocumentList_grdDocumentList_ctl02_chkBox2'));
        chkboxInsuranceDoc.click();
    }
    this.AllDocSelectCheckboxForPublish = function () {
        CustomLibrary.ScrollUp(0,10000);
        var chkboxInsuranceDoc = element(by.id('LeftMenu1_Documents_DocumentList_grdDocumentList_ctl02_chkBox2'));
        chkboxInsuranceDoc.click();
    }

    this.DocumentPublishandNotify = function () {
        btnPublishandNotify.click();
    }


    this.DocumentPublish = function () {
        btnPublish.click();
    }

    // Manage Document
    this.sendDealtoLLC = function () {
        CustomLibrary.WaitforElementVisible(btnSendToLLC);
        btnSendToLLC.click();
        //browser.sleep(35000);
        CustomLibrary.WaitforElementVisible(btnOkLayerSelection);
        btnOkLayerSelection.click();
        browser.sleep(2000);
    }

    this.VerifyDealSendToLLC = function () {
        CustomLibrary.ScrollDown(0,10000);
        return element.all(by.xpath('//*[@id="LeftMenu1_lblSentDealMessage" and contains(text(), \'Deal sent to LLC successfully\')]')).count().then(
            function (count) {
                expect(count).toBeGreaterThan(0, "Deal is not send to LLC");
                return count;
            })
    }

    this.VerifyDealSendToLLCSuccessfully = function () {
        return DealSendToLLC.getText().then(
            function (txt) {
                if (txt == "Deal sent to LLC successfully.") {
                    return true;
                }
                else {
                    return false;
                }
            }
        );
    }

    this.EnterChkBrokerConditions = function () {
        CustomLibrary.WaitNClick(LeftMenuSolictorOption);
        CustomLibrary.scrollIntoView(ChkBrokerConditions);
        CustomLibrary.WaitNClick(ChkBrokerConditions);
    }

    this.EnterChkSolictitorConditions = function () {
        CustomLibrary.scrollIntoView(ChkSolictitorConditions);
        CustomLibrary.WaitNClick(ChkSolictitorConditions);
        CustomLibrary.WaitNClick(chkSolicitorCondition1);
        CustomLibrary.WaitNClick(ChkLenderAuthorization);
    }

    this.getPropertyData = function () {
        return PropertyDatagrid.element(by.tagName('td')).getText().then(function (text) { return text; });
    }

    this.StatusMenuClick = function () {
        CustomLibrary.WaitNClick(LeftMenuStatusOption);
    }

    this.checkuntilnotesappear = function (Notes) {
        counter = 0;
        selectNotesAndCheckData(Notes);
    }

    var selectNotesAndCheckData = function (Notes) {

        CustomLibrary.WaitNClick(LeftMenuNotesOption);//Aug 29
        CustomLibrary.WaitforElementVisible(GrdFirstNote);
        GrdFirstNote.getText().then(function (text) {
            if (text.includes(Notes) || counter > 50) {
                return true;
            }
            else {
                browser.sleep(2000);
                counter++;
                console.log("Attempt to check note status appear :" + counter);
                selectNotesAndCheckData(Notes);
            }
        })

    }
    this.SelectNotesData = function () {
        LeftMenuNotesOption.click();
    }
    this.VerifyLawyertoLenderNotes = function (inputdata, Notesdata) {
        expect(inputdata).toBe(Notesdata);
    }

    this.ClickOnCancelDeal = function () {
        /*
                element(by.id("LeftMenu1_PolicyStatus_btnCancel")).click();
                browser.sleep(2000);*/
        var EC = protractor.ExpectedConditions;
        var eleBtnCancel = element(by.id("LeftMenu1_PolicyStatus_btnCancel"));
        browser.wait(EC.visibilityOf(eleBtnCancel), 65000, 'Waiting for element to become viible').then(() => {
            browser.sleep(1000);
            eleBtnCancel.click();
            browser.sleep(2000);
        }, (error) => {
            expect(true).toBe(false, "Cancel Button is not Present");
        })

    }

    this.EnterCancellationReasons = function (reason, txt) {
        var EC = protractor.ExpectedConditions;
        var eleDDLReason = element(by.id('ddlReason'));
        browser.wait(EC.visibilityOf(eleDDLReason), 45000, 'Waiting for element to become viible').then(() => {
            eleDDLReason.element(by.cssContainingText('option', reason)).click();
            element(by.id("txtReason")).sendKeys(txt);
            element(by.id("btnYes")).click();
            browser.sleep(3000)
        }, (error) => {
            expect(true).toBe(false, "Cancellation Dropdown is not Present");
        })
        /*
                element(by.id('ddlReason')).element(by.cssContainingText('option', reason)).click();
                element(by.id("txtReason")).sendKeys(txt);
                element(by.id("btnYes")).click();
                browser.sleep(3000)*/
    }

    this.EnterNotesData = function (testnote) {
        LeftMenuNotesOption.click();
        txtNotes.sendKeys(testnote);
        chkViewablebyLawyer.click();
        btnAddNotes.click();
        browser.sleep(5000);
    }

    this.GetNotesDataCheck = function (check) {
        GrdFirstNote.getText().then(function (text) { return text; })
    }

    this.GetNotesData = function () {
        CustomLibrary.elementwait(GrdFirstNote.getText());
        return GrdFirstNote.getText().then(function (text) { return text; });
    }

    this.ClickPropQSubmit = function () {
        radPropQ1.click();
        radPropQ10.click();
        radPropQ11.click()
        radPropQ12.click();
        radPropQ5.click();
        radPropQ6.click();
        radPropQ7.click();
        radPropQ8.click();
        txtPropQ1.sendKeys(CustomLibrary.getRandomString(3));
        txtPropQ2.sendKeys(CustomLibrary.getRandomString(3));
        txtPropQ3.sendKeys(CustomLibrary.getRandomString(3));
        CustomLibrary.scrollIntoView(btnPropQSubmit);
        btnPropQSubmit.click();
        browser.sleep(3000);
    }


    this.ClickMMSPropQDynamic = function (Province) {
        switch (Province) {
            case 'ONTARIO':
                radPropQ1.click();
                radPropQ10.click();
                radPropQ11.click()
                radPropQ12.click();
                radPropQ5.click();
                radPropQ6.click();
                radPropQ7.click();
                radPropQ8.click();
                txtPropQ1.sendKeys(CustomLibrary.getRandomString(3));
                txtPropQ2.sendKeys(CustomLibrary.getRandomString(3));
                txtPropQ3.sendKeys(CustomLibrary.getRandomString(3));
                CustomLibrary.scrollIntoView(btnPropQSubmit);
                btnPropQSubmit.click();
                browser.sleep(3000);
                break;

            case 'MANITOBA':
                radPropQ1.click();
                radPropMB1.click();
                radPropMB2.click();
                radPropMB3.click();
                radPropMB4.click();
                radPropMB5.click();
                radPropQ7.click();
                radPropQ8.click();
                txtPropQ1.sendKeys(CustomLibrary.getRandomString(3));
                txtPropQ2.sendKeys(CustomLibrary.getRandomString(3));
                txtPropQ3.sendKeys(CustomLibrary.getRandomString(3));
                CustomLibrary.scrollIntoView(btnPropQSubmit);
                btnPropQSubmit.click();
                browser.sleep(3000);
                break;

            case 'ALBERTA':
                radPropQ1.click();
                radPropMB1.click();
                radPropQ8.click()
                radPropAB1.click()
                radPropAB2.click()
                radPropAB3.click()
                radPropAB4.click()
                radPropQ7.click();
                radPropQ8.click();
                txtPropQ1.sendKeys(CustomLibrary.getRandomString(3));
                txtPropQ2.sendKeys(CustomLibrary.getRandomString(3));
                txtPropQ3.sendKeys(CustomLibrary.getRandomString(3));
                CustomLibrary.scrollIntoView(btnPropQSubmit);
                btnPropQSubmit.click();
                browser.sleep(3000);
                break;

            case 'NEW BRUNSWICK':
                radPropQ1.click();
                txtPropQ1.sendKeys(CustomLibrary.getRandomString(3));
                txtPropQ2.sendKeys(CustomLibrary.getRandomString(3));
                txtPropQ3.sendKeys(CustomLibrary.getRandomString(3));
                radPropQ7.click();
                radPropQ8.click();
                CustomLibrary.scrollIntoView(btnPropQSubmit);
                btnPropQSubmit.click();
                browser.sleep(3000);
                break;
        }
    }

    this.ClickPropQSubmitDynamic = function (provinceName) {
        if (provinceName == 'ONTARIO') {
            radPropQ1.click();
            radPropQ7.click();
            radPropQ8.click();
            txtPropQ1.sendKeys(CustomLibrary.getRandomString(3));
            txtPropQ2.sendKeys(CustomLibrary.getRandomString(3));
            txtPropQ3.sendKeys(CustomLibrary.getRandomString(3));
            CustomLibrary.scrollIntoView(btnPropQSubmit);
            btnPropQSubmit.click();
            browser.sleep(3000);
        }
    }

    this.IssueCOI = function () {
        btnCOI.click();
        browser.sleep(15000);
        CustomLibrary.SwitchTab(2);
        browser.sleep(10000);
        btnOkLayerSelection.click();
        browser.sleep(5000);
       // expect(txtCOIissued.getAttribute('value')).not.toBe('');
    }

    this.IssueCOIPatch = function () {
        btnCOI.click();
        browser.sleep(15000);
        CustomLibrary.SwitchTab(1);
        browser.sleep(10000);
        btnOkLayerSelection.click();
        browser.sleep(5000);
        var EC = protractor.ExpectedConditions;
        browser.wait(EC.visibilityOf(txtCOIissued), 45000,  'Waiting for COI text to become visible').then(() => {
        expect(txtCOIissued.getAttribute('value')).not.toBe('');
        console.log (txtCOIissued);
        })
    }


    this.VerifyCOIIsIssued = function () {
        return txtCOIissued.getAttribute('value').then(
            function (txt) {
                expect(txt).not.toBe('', "COI is not issued.");
                if (txt != "") {
                    return true;
                }
                else {
                    return false;
                }
            }
        );
    }

    this.ClickFundingLeftMenu = function () {
        CustomLibrary.WaitNClick(LeftMenuFundingOption);
    }

    this.EnterFundingData = function () {
        CustomLibrary.WaitNClick(ddlToAccount);
        var ddlFirstSelection = ddlToAccount.all(by.tagName('option')).get(1);
        CustomLibrary.WaitNClick(ddlFirstSelection);
        CustomLibrary.WaitNClick(btnTransfertoLawyer);
        CustomLibrary.WaitNClick(btnFundSave);
        //CustomLibrary.CloseTab();
        browser.sleep(2000);
        CustomLibrary.closeWindowUrlContains("DealDetails");
        browser.sleep(2000);
    }

    this.EnterFundFilterData = function (BnkLenderName, ArgClosingDate) {
        CustomLibrary.WaitNClick(ddlLender.element(by.cssContainingText('option', BnkLenderName)));
        CustomLibrary.WaitforElementVisible(txtFundFromDate);//Aug 28
        txtFundFromDate.sendKeys(ArgClosingDate);
        CustomLibrary.WaitforElementVisible(txtFundToDate);//Aug 28
        txtFundToDate.sendKeys(ArgClosingDate);
        btnFundSubmit.click();
    }

    this.ClickFundingLenderConfirmation = function () {
        CustomLibrary.WaitNClick(lnkLenderConfirmationRequired); //Aug 28
    }

    this.ToConfirmLender = function (fctRefNum) {
        var rows = tabBodyFunding.all(by.tagName('tr'));
        rows.each(function (row, rowindex) {
            var cols = row.all(by.tagName('td'));
            //console.log("Colums" + cols.get(0).getText());
            if (rowindex != 0) {
                cols.get(0).getText().then(function (text1) {
                    if (text1 == fctRefNum) {
                        cols.get(5).click();
                    }
                });
            }
        });
        browser.sleep(3000);
    }
    this.ClickReleaser2 = function () {
        CustomLibrary.WaitNClick(lnkReleaser2);
    }

    this.ClickReleaser3 = function () {
        CustomLibrary.WaitNClick(lnkReleaser3);
    }

    this.ClickSenttoLawyer = function (fctRefNum) {
        CustomLibrary.WaitforElementVisible(tabBodyFunding);//Aug 28
        var rows = tabBodyFunding.all(by.tagName('tr'));
        rows.each(function (row, rowindex) {
            var cols = row.all(by.tagName('td'));
            //console.log("Colums" + cols.get(0).getText());
            if (rowindex != 0) {
                cols.get(0).getText().then(function (text1) {
                    if (text1 == fctRefNum) {
                        cols.get(5).click();
                        cols.get(5).click();
                    }
                });
            }
        });
        browser.sleep(3000);
    }

    var clickReleaseTable = function (fctRefNum, alert) {
        var found = false;
        var elem = "";
        CustomLibrary.WaitNClick(tabBodyFunding);
        var rows = tabBodyFunding.all(by.tagName('tr'));

        rows.each(function (row, rowindex) {
            var cols = row.all(by.tagName('td'));

            if (rowindex != 0) {

                cols.get(0).getText().then(function (text1) {
                    // console.log(text1);
                    if (text1 == fctRefNum) {
                        //     console.log("Found element at row "+ rowindex)
                        found = true;
                        elem = cols.get(7);


                    }
                });
            }
        }).then(function () {
            if (found) {
                //   console.log("Found element ")
                elem.click();
                found = false;
            }
        })

        // browser.sleep(3000);
        if (alert) {

            CustomLibrary.HandleAlert();

        }

    }
    /*this.ClickRelease = function (fctRefNum, alert) {
 
        tabBodyFunding.all(by.css('.gridViewPager')).isPresent().then(function (isElementPresent) {
            if (isElementPresent) {
                console.log("Found a table with multiple elelments" + isElementPresent)
                var innerrows = tabBodyFunding.all(by.css('.gridViewPager')).all(by.tagName('tr')).all(by.tagName('td'));
                innerrows.each(function (row, rowindex) {
 
                    if (rowindex != 0) {
 
                        row.$('a').click().then(function () {
                            clickReleaseTable(fctRefNum, alert);
                        });
                    }
                    else {
                        clickReleaseTable(fctRefNum, alert);
                    }
                })
            }
            else {
                console.log("Found a table with Single page")
                clickReleaseTable(fctRefNum, alert);
            }
        })
 
    }*/


    this.ClickRelease = function (fctRefNum, alert) {
        console.log("FCTURN " + fctRefNum);
        var GrdFundingList = element(by.id('ctl00_ContentPlaceHolder1_FundingList_gvFundingList'));
        var EC = protractor.ExpectedConditions;
        return browser.wait(EC.presenceOf(GrdFundingList), 65000, 'Waiting for Funding Grid to be present').then(() => {
            return element.all(by.xpath('//*[@id="ctl00_ContentPlaceHolder1_FundingList_gvFundingList"]/tbody/tr/td/a[contains(text(),\'' + fctRefNum + '\')]/parent::td/parent::tr/td/span[@title=\'Click to Release\']/input')).count().then(function (count) {
                expect(count).toBeGreaterThan(0, "Unable to find row to release funds");
                if (count > 0) {
                    element(by.xpath('//*[@id="ctl00_ContentPlaceHolder1_FundingList_gvFundingList"]/tbody/tr/td/a[contains(text(),\'' + fctRefNum + '\')]/parent::td/parent::tr/td/span[@title=\'Click to Release\']/input')).click();
                    browser.sleep(1000);
                    CustomLibrary.HandleAlert();
                }
                return count;
            });

        }, (error) => {
            console.log("Grid Not Present" + error);
        })
    }

    this.EnterPreFundLawyerData = function (CDate, RegDate) {
        CustomLibrary.WaitNClick(LeftMenuLawyerOption);
        var EC = protractor.ExpectedConditions;
        browser.wait(EC.presenceOf(txtConfirmationDate), 45000, 'Waiting for Element to be present').then(() => {
            txtConfirmationDate.sendKeys(CDate);
        });

        // CustomLibrary.WaitforElementVisible(txtConfirmationDate); //Aug 28
        // txtConfirmationDate.sendKeys(CDate);

        CustomLibrary.WaitforElementVisible(txtRegDate)//Aug 28
        txtRegDate.sendKeys(RegDate);
        CustomLibrary.WaitforElementVisible(txtInstrumentNo)
        txtInstrumentNo.sendKeys('123456');

    }

    this.IntructionsforPostClosing = function () {

        var rows = chkbox.all(by.tagName('tr'));
        rows.each(function (row, rowindex) {
            var cols = row.all(by.tagName('td'));
            cols.each(function (col, colinxdex) {
                if (rowindex != 0 && colinxdex == 3) {
                    col.click();
                }
            });

        });

    }

    this.SelectTrustAccount = function () {
        var ddlFirstTrustSelection = ddlTrustAccount.all(by.tagName('option')).get(1);
        ddlFirstTrustSelection.click();
    }

    this.CheckReportCompleted = function () {
        chkReportCompleted.click();
    }

    this.COIthroughDocument = function () {

        // LeftMenuDocumentOPtion.click(); optimisation
        CustomLibrary.WaitNClick(LeftMenuDocumentOPtion);
        CustomLibrary.WaitNClick(ddlDocumenttype.element(by.cssContainingText('option', 'Certificate Of Insurance')));//Aug 28

        // ddlDocumenttype.element(by.cssContainingText('option', 'Certificate Of Insurance')).click();
        element(by.css('input[type="file"]')).sendKeys(DocumentPath);
        CustomLibrary.WaitNClick(btnSendDocument);//Aug 28
        //btnSendDocument.click();

    }

    this.VerifyFundReportFields = function () {

        //expect(txtPolicyFundReceived.getAttribute('value')).not.toBe('')
        // expect(txtFundTransferred.getAttribute('value')).not.toBe('')
        expect(txtPolicyCloseDate.getAttribute('value')).not.toBe('')
        expect(txtreportCompleted.getAttribute('value')).not.toBe('')
    }






    //get the count of rows:

    //  this.getInstructionsforFundingtRowCount=function(){
    //     console.log("Fetching number rows")
    //     return tblrwInstructionforFund.count()
    // }

    this.EnterInstructionsforFunding = function () {

        var rows = chkboxInstructionsforFund.all(by.tagName('tr'));
        rows.each(function (row, rowindex) {
            var cols = row.all(by.tagName('td'));
            cols.each(function (col, colinxdex) {
                if (rowindex != 0 && colinxdex == 4) {
                    col.click();
                }
            });
        });
    }

    //Feb 27
    this.ClickonViewPolicyHistory = function () {
        CustomLibrary.WaitNClick(lnkLeftMenuPolicyHistory);
        //lnkLeftMenuPolicyHistory.click();
    }

    this.waituntilPolicyHistoryEntry = function () {
        counter = 0;
        checkPolicyHistoryEntry();

    }

  

    var checkPolicyHistoryEntry = function () {
        CustomLibrary.WaitNClick(lnkLeftMenuPolicyHistory);
        var colActivity = tblPolicyHistory.element(by.tagName('tbody')).all(by.tagName('tr')).all(by.css('.activity.more')).get(0);
        colActivity.getText().then(function (txt) {
            if (txt.includes('Completed - Report on Title or Confirmation of Registration') || counter > 75) {

                console.log(txt);
                console.log(counter);
                return true;
            }
            else {
                counter++;
                browser.sleep(2000);
                console.log("No of retry attempt on Policy History " + counter);
                checkPolicyHistoryEntry();

            }
        })
        //
    }
    this.VerifyLawyerDeclinedinPolicyHistory = function () {
        var colActivity = tblPolicyHistory.element(by.tagName('tbody')).all(by.tagName('tr')).all(by.css('.activity.more')).get(0);
        expect(colActivity.getText()).toContain('The deal has been Declined by the lawyer.');
        //console.log("The Deal Status ;is:",colActivity.getText());
    }

    this.VerifyFinalReportPolicyHistory = function () {
        var colActivity = tblPolicyHistory.element(by.tagName('tbody')).all(by.tagName('tr')).all(by.css('.activity.more')).get(0);
        expect(colActivity.getText()).toContain('Completed - Report on Title or Confirmation of Registration');
        //console.log("The Deal Status is:",colActivity.getText());
    }

    this.VerifyFundingPolicyHistory = function () {
        var colActivityRel = tblPolicyHistory.element(by.tagName('tbody')).all(by.tagName('tr')).all(by.css('.activity.more')).get(3);
        var colActivityLenConfmn = tblPolicyHistory.element(by.tagName('tbody')).all(by.tagName('tr')).all(by.css('.activity.more')).get(4);
        expect(colActivityRel.getText()).toContain('Funding: Releaser2');
        expect(colActivityLenConfmn.getText()).toContain('Funding: Lender Confirmation Required');
    }


    this.VerifyPolicyHistoryTableSearch = function (SearchText, expectResult) {
        var found = false;
        var rows = tblPolicyHistory.all(by.tagName('tr'));
        rows.each(function (row, rowindex) {
            var cols = row.all(by.tagName('td'));
            cols.get(1).getText().then(function (txt) {
                if (txt.includes(SearchText)) {
                    console.log(txt);
                    found = true;

                }
            });
        }).then(function () {
            expect(found).toBe(expectResult, "Policy history verification failed ");
        })
    }

    this.waituntilPolicyHistoryContainsParticularEntry = function (SearchText) {
        counter = 0;
        VerifyPolicyHistoryTableContainsParticularEntry(SearchText);
    }

    var VerifyPolicyHistoryTableContainsParticularEntry = function (SearchText) {
        counter++;
        var found = false;
        var rows = tblPolicyHistory.all(by.tagName('tr'));
        rows.each(function (row, rowindex) {
            var cols = row.all(by.tagName('td'));
            cols.get(1).getText().then(function (txt) {
                if (txt.includes(SearchText)) {
                    found = true;
                }
            });
        }).then(function () {
            if (found != true && counter < 50) {
                CustomLibrary.WaitNClick(LeftMenuNotesOption);//Aug 29
                CustomLibrary.WaitNClick(lnkLeftMenuPolicyHistory);//Aug 29
                VerifyPolicyHistoryTableContainsParticularEntry(SearchText);
            }
            else {
                expect(found).toBe(true, "Policy history verification failed ");
            }
        })
    }

    var WaitForPolicyHistoryEntry = function (colVal) {
        var found = false;
       
        var colActivity = tblPolicyHistory.element(by.xpath("//tbody/tr[2]/td[2]"));                               
                    colActivity.getText().then(function (txt) {
 
                    if (txt.includes(colVal)) {
                        console.log("Activity is logged in policy history");
                        found = true;
                        console.log("Search Result : "+ found);
                    }

                    else {
                        if (found != true ) {
                        
                            console.log("Search Result : "+ found);
                            CustomLibrary.WaitNClick(LeftMenuNotesOption);
                            CustomLibrary.WaitNClick(lnkLeftMenuPolicyHistory);
                            WaitForPolicyHistoryEntry(colVal);
                        }
                    }
                                
                });      
        }

   this.WaitUntilPolicyHistoryEntryNew = function (colVal) {
        browser.sleep(WaitForPolicyHistoryEntry(colVal), 120000);
    }

    this.VerifyLawyerDeniedStatus = function () {
        //var lblLawyerStatus = element(by.id('LeftMenu1_Lawyer_lblLawyerStatus'));
        LeftMenuLawyerOption.click();
        expect(lblLawyerStatus.getText()).toBe("Declined", 'Status is not declined');
    }
    this.checkLawyerAcceptedStatus = function () {
        counter = 0;
        checkSatuts();

    }
    var checkSatuts = function () {
        LeftMenuLawyerOption.click();
        lblLawyerStatus.getText().then(function (status) {
            if (status == 'Accepted' || counter > 50) {
                return true;
            }
            else {
                browser.sleep(2000);
                counter++;
                console.log("Status check attempt of Lawyer Status : " + counter);
                checkSatuts();

            }
        })
    }
    this.VerifyLawyerAcceptedStatus = function () {
        LeftMenuLawyerOption.click();
        expect(lblLawyerStatus.getText()).toBe("Accepted");
    }
    this.VerifyLawyerAcceptedinPolicyHistory = function () {
        var colActivity = tblPolicyHistory.element(by.tagName('tbody')).all(by.tagName('tr')).all(by.css('.activity.more')).get(0);
        expect(colActivity.getText()).toContain('The deal has been Accepted by the lawyer.');
    }

    this.AcceptAndContinueRFF = function () {
        element(by.id("LeftMenu1_LlcLawyerEvents_RequestForFund_rbRffAccept")).click();
        element(by.id("LeftMenu1_LlcLawyerEvents_RequestForFund_btnContinue")).click();

    }

    this.VerifyRFF = function () {
        var Reason = element(by.id("LeftMenu1_LlcLawyerEvents_EventHistory_grdEventHistory_ctl02_lblEvent"));
        Reason.getText().then(function (txt) {
            expect(txt).toContain("'Request For Funds' request submitted by the Lawyer has been accepted.");
        });
    }

    this.VerifyRFFAccept = function () {
        var Reason = element(by.id("LeftMenu1_LlcLawyerEvents_EventHistory_grdEventHistory_ctl02_lblEvent"));
        Reason.getText().then(function (txt) {
            expect(txt).toContain("'Request For Funds' request submitted by the Lawyer has been accepted.");
        });
    }

    this.sendDealtoLLCClickOK = function () {
        btnOkLayerSelection.click();
    }

    this.DeclineAndContinueRFF = function () {
        element(by.id("LeftMenu1_LlcLawyerEvents_RequestForFund_rbRffDecline")).click();
        element(by.id("LeftMenu1_LlcLawyerEvents_RequestForFund_btnContinue")).click();

    }

    this.VerifyRFFDecline = function () {
        var Reason = element(by.id("LeftMenu1_LlcLawyerEvents_EventHistory_grdEventHistory_ctl02_lblEvent"));
        Reason.getText().then(function (txt) {
            expect(txt).toContain("'Request For Funds' request submitted by the Lawyer has been declined.");
        });
    }
    this.EnterMortgagorNewforAmendments = function () {
        LeftMenuMortgagorOption.click();
        browser.sleep(1500);
        // var MortLastName = CustomLibrary.getRandomString(5)
        // ddlTitle.element(by.cssContainingText('option', 'MR')).click();
        // tbMortgagorLastName.sendKeys(MortLastName)
        tbMortgagorfirstName.sendKeys(CustomLibrary.getRandomString(5))
        tbUnitNumber.sendKeys(CustomLibrary.getRandomNumber(1))
        tbStreetNumber.sendKeys(CustomLibrary.getRandomNumber(2));
        btnUpdate.click();
    }
    this.EnterMortgagorNewPaymentforAmendments = function () {
        LeftMenuNewMortgageOption.click();
        browser.sleep(1500);
        var txtMortPaymentAmt = element(by.id('LeftMenu1_NewMortgage_txtPaymentAmount'));
        txtMortPaymentAmt.clear();
        txtMortPaymentAmt.sendKeys(CustomLibrary.getRandomNumber(5))
        LeftMenuStatusOption.click();
    }

    this.EnterPropertyEditforAmendments = function () {

        // LeftMenuPropertyOption.click(); //Sept 5
        CustomLibrary.WaitNClick(LeftMenuPropertyOption);
        var btnEditProperty = element(by.css('[href*="LeftMenu1$Properties$grdProperty$ctl02$ctl01"]'));
        CustomLibrary.WaitNClick(btnEditProperty);
        //btnEditProperty.click();
        // browser.sleep(4000);
        CustomLibrary.WaitNClick(ddlProvince.element(by.cssContainingText('option', 'QUEBEC')));
        //  ddlProvince.element(by.cssContainingText('option', 'QUEBEC')).click()

        // browser.sleep(2000);
        CustomLibrary.WaitNClick(btnAddProperty);
        //btnAddProperty.click();
        //browser.sleep(2000);

    }

    this.EditProvince = function (provinceName) {

        CustomLibrary.WaitNClick(LeftMenuPropertyOption);
        var btnEditProperty = element(by.css('[href*="LeftMenu1$Properties$grdProperty$ctl02$ctl01"]'));
        CustomLibrary.WaitNClick(btnEditProperty);
        //btnEditProperty.click();
        // browser.sleep(4000);
        CustomLibrary.WaitNClick(ddlProvince.element(by.cssContainingText('option', provinceName)));
        //  ddlProvince.element(by.cssContainingText('option', 'QUEBEC')).click()

        // browser.sleep(2000);
        CustomLibrary.WaitNClick(btnAddProperty);
        //btnAddProperty.click();
        //browser.sleep(2000);

    }

    this.EditMortgageforAmendments = function () {
        var firstName = CustomLibrary.getRandomString(6);
        // var lastName=CustomLibrary.getRandomString(6);
        // LeftMenuMortgagorOption.click();// Sept 5
        CustomLibrary.WaitNClick(LeftMenuMortgagorOption);//Sept 5
        CustomLibrary.WaitNClick(btnedit);//Sept 5
        //  btnedit.click(); // Sept 5
        // browser.sleep(3000);
        CustomLibrary.WaitForElementPresent(tbMortgagorfirstName);
        tbMortgagorfirstName.clear();
        tbMortgagorfirstName.sendKeys(firstName);
        //tbMortgagorLastName.sendKeys(lastName);
        // browser.sleep(2000);
        CustomLibrary.WaitNClick(btnUpdate);
        // btnUpdate.click();
        return firstName;
    }

    this.EditMortgageCityforAmendments = function () {
        var txtCity = element(by.id('LeftMenu1_Mortgagor_txtCity'));

        //var btnEditProperty = element(by.css('[href*="LeftMenu1$Properties$grdProperty$ctl02$ctl01"]'));
        LeftMenuMortgagorOption.click();
        btnedit.click();
        browser.sleep(3000);

        txtCity.sendKeys('test');
        browser.sleep(2000);
        btnUpdate.click();

    }
    this.EditNewMortgageforAmendments = function () {

        CustomLibrary.WaitNClick(LeftMenuNewMortgageOption);
        CustomLibrary.WaitNClick(ddlTransactionType.element(by.cssContainingText('option', 'REFINANCE')));
        CustomLibrary.WaitNClick(LeftMenuStatusOption);
    }

    this.EditTransactionType = function (transactionType) {

        CustomLibrary.WaitNClick(LeftMenuNewMortgageOption);
        CustomLibrary.WaitNClick(ddlTransactionType.element(by.cssContainingText('option', transactionType)));
        CustomLibrary.WaitNClick(LeftMenuStatusOption);
    }

    this.EditRegistrationAmt = function (tdata) {
        CustomLibrary.WaitNClick(LeftMenuNewMortgageOption);
        //tbRegisteredAmount.clear();
        tbRegisteredAmount.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, "a", protractor.Key.DELETE));
        tbRegisteredAmount.sendKeys(tdata);
           
    }


    this.EditNewMortgageActualAmountforAmendments = function () {
        LeftMenuNewMortgageOption.click();
        txtActualMortgageRate.sendKeys(CustomLibrary.getRandomNumber(5));
        LeftMenuStatusOption.click();
    }
    this.EditMortgageExcludedAmendment = function () {
        LeftMenuNewMortgageOption.click();
    }

    this.EditStatusforAmendments = function (inputclosingdate) {
        var radbtnAmendmentRequired = element(by.id('LeftMenu1_PolicyStatus_cbAmendmentRequired'));
        var btnAllSave = element(by.id('LeftMenu1_btnSave'));
        LeftMenuStatusOption.click();
        ClosingDate.clear();
        browser.sleep(10000);
        ClosingDate.sendKeys(inputclosingdate);
        browser.sleep(10000);
        ddlReason.element(by.cssContainingText('option', 'Lender instructed')).click();
        radbtnAmendmentRequired.click();
        browser.sleep(3000);
        btnAllSave.click();
        LeftMenuNewMortgageOption.click();
    }

    this.EditClosingDate = function (closingdate) {
        ClosingDate.clear();
        browser.sleep(30000);
        ClosingDate.sendKeys(closingdate);
        browser.sleep(30000);
        ddlReason.element(by.cssContainingText('option', 'Lender instructed')).click();
    }

    this.VerifyAmendmentDeclinedLawyerEvents = function (reason) {
        var Reason = element(by.id('LeftMenu1_LlcLawyerEvents_RejectedAmendments_grdRejectedAmendments_ctl02_Reason'))
        expect(Reason.getText()).toContain(reason);

    }

    this.AcceptAndAcknowldegeAmendmentDecline = function () {
        element(by.id("LeftMenu1_LlcLawyerEvents_RejectedAmendments_grdRejectedAmendments_ctl02_chkbAcknowledge")).click();
        element(by.id("LeftMenu1_LlcLawyerEvents_RejectedAmendments_btnAcknowledge")).click();


    }

    

    this.VerifyMortgageforAmendmentsafterDecline = function (name) {
        LeftMenuMortgagorOption.click();
        btnedit.click();
        browser.sleep(5000);

        expect(tbMortgagorfirstName.getAttribute('value')).toBe(name, "Mortgage First Name");
    }

    this.FillClickCheckReportCompleted = function () {
        CustomLibrary.ScrollDown(0,10000);
        // chkboxConfirmation.click();            
        // chkboxdupConfirmation.click();               
        // chkReportCompleted.click();  

        var tbBody = element(by.id('LeftMenu1_Lawyer_grdMortgageClosing')).element(by.tagName('tbody'));
        tbBody.all(by.tagName('tr')).then(function (rows) {
            var count = 0;
            rows.forEach(function (row) {
                if (count > 0) {
                    ActualPostClosingCheck(count);

                }
                count++;
            })
        })
        CustomLibrary.WaitNClick(LeftMenuLawyerOption);
        CustomLibrary.ScrollDown(0,10000);
        CustomLibrary.WaitNClick(chkReportCompleted);
    }

    var ActualPostClosingCheck = function (cnt) {

        CustomLibrary.WaitNClick(LeftMenuLawyerOption);
        CustomLibrary.ScrollDown(0,10000);
        var tbBody = element(by.id('LeftMenu1_Lawyer_grdMortgageClosing')).element(by.tagName('tbody'));
        tbBody.all(by.tagName('tr')).then(function (rows) {
            var count = 0;
            rows.forEach(function (row) {
                if (count == cnt) {

                    row.all(by.tagName('td')).count().then(function (conttd) {
                        if (conttd > 1) {
                            row.all(by.tagName('td')).get(3).click();
                        }
                    });
                   // row.all(by.tagName('td')).get(3).click();
                }
                count++;
            })
        })
        CustomLibrary.WaitNClick(LeftMenuPropertyOption);

    }



    this.ClickOnLawyerTab = function () {
        CustomLibrary.WaitNClick(LeftMenuLawyerOption);
    }

    this.VerifyStatus = function (status) {
        var lblStatus = element(by.id('LeftMenu1_PolicyStatus_lblStatus'));

        var EC = protractor.ExpectedConditions;
        browser.wait(EC.visibilityOf(lblStatus), 65000, 'Waiting for element to become visible').then(() => {
            browser.sleep(1000);
            lblStatus.getText().then(function (txt) {
                expect(txt).toBe(status);
            });
        }, (error) => {
            console.log(error);
        })

        //expect(lblStatus.getText()).toBe(status);
    }

    this.getStatus = function () {
        var lblStatus = element(by.id('LeftMenu1_PolicyStatus_lblStatus'));
        return lblStatus.getText().then(function (txt) {
            //  console.log("**********************"+ txt);
            return txt;
        });
    }

    
    this.VerifyStatusHold = function (status) {
        var lblStatus = element(by.id('LeftMenu1_PolicyStatus_lblStatus'));
       // var EC = protractor.ExpectedConditions;
      //  browser.wait(EC.visibilityOf(lblStatus), 65000, 'Waiting for element to become visible').then(() => {
      //      browser.sleep(1000);
            lblStatus.getText().then(function (txt) {

                if (txt == status) {
                    btnReleaseHold.click(); 
                }

           });
    /*    }, (error) => {
            console.log("FAILED");
        })  */
    }

  
    //PreFund scenarios

    //EnterPreFundPropertyData can be removed later once all changes are done for Patchflow/Regression
    this.EnterPreFundPropertyData = function () {
        browser.waitForAngular();
        CustomLibrary.WaitNClick(LeftMenuPropertyOption);
        CustomLibrary.WaitNClick(ddlMortgagorAddress.all(by.tagName('option')).get(1));
        browser.manage().timeouts().implicitlyWait(500);
        CustomLibrary.WaitNClick(ddlProvince.element(by.cssContainingText('option', 'ONTARIO')));
        browser.manage().timeouts().implicitlyWait(500);
        tbPropertyaddress1.sendKeys('Addres line1');
        tbPropertyAddres2.sendKeys('Addres line2');
        tbPropertyCity.sendKeys('Some City');
        txtARNNo.sendKeys('123456');
        txtLegalDesc.sendKeys('Test Data');
        ddlEstateType.all(by.tagName('option')).get(1).click();
        ddlMunicipal.all(by.cssContainingText('option', 'REGIONAL MUNICIPALITY OF HALTON')).click();
        //browser.sleep(10000);
        btnAddProperty.click();
        browser.waitForAngular();
    }

    this.EnterPreFundPropertyDataDynamic = function (provinceName) {
        browser.waitForAngular();
        CustomLibrary.WaitNClick(LeftMenuPropertyOption);
        CustomLibrary.WaitNClick(ddlMortgagorAddress.all(by.tagName('option')).get(1));
        browser.manage().timeouts().implicitlyWait(500);
        CustomLibrary.WaitNClick(ddlProvince.element(by.cssContainingText('option', provinceName)));
        browser.manage().timeouts().implicitlyWait(500);
        tbPropertyaddress1.sendKeys('Addres line1');
        tbPropertyAddres2.sendKeys('Addres line2');
        tbPropertyCity.sendKeys('Some City');
        txtARNNo.sendKeys('123456');
        CustomLibrary.WaitforElementVisible(PIN.sendKeys('123456'));
        CustomLibrary.WaitNClick(btnAddPIN);
        txtLegalDesc.sendKeys('Test Data');
        ddlEstateType.all(by.tagName('option')).get(1).click();
        ddlMunicipal.all(by.cssContainingText('option', 'REGIONAL MUNICIPALITY OF HALTON')).click();
        //browser.sleep(10000);
        btnAddProperty.click();
        browser.waitForAngular();
    }
    this.EnterPreFundPropertyDataedit = function () {
        var btnEditProperty = element(by.css('[href*="LeftMenu1$Properties$grdProperty$ctl02$ctl01"]'));
        LeftMenuPropertyOption.click();
        browser.sleep(3000);
        btnEditProperty.click();
        browser.sleep(8000);
        txtLegalDesc.sendKeys('Test Data edit');
        browser.sleep(4000);
        btnAddProperty.click();
        LeftMenuStatusOption.click();
    }

    /*
        this.EnterPreFundPropertyDataPINedit = function () {
        var btnEditProperty = element(by.css('[href*="LeftMenu1$Properties$grdProperty$ctl02$ctl01"]'));
        LeftMenuPropertyOption.click();
        browser.sleep(3000);
        btnEditProperty.click();
        browser.sleep(8000);
        PIN.sendKeys('555555');
        btnAddPIN.click();
        browser.sleep(4000);
        btnAddProperty.click();
        LeftMenuStatusOption.click();
    } 
    
*/

    this.AddPropertyLegalDesc = function () {
        CustomLibrary.WaitNClick(LeftMenuPropertyOption);
        var btnEditProperty = element(by.css('[href*="LeftMenu1$Properties$grdProperty$ctl02$ctl01"]'));
        CustomLibrary.WaitNClick(btnEditProperty);
        txtLegalDesc.sendKeys('Test Data');
        btnAddProperty.click();
        LeftMenuStatusOption.click();
    }

    this.UpdatePropertyLegalDesc = function () {
        CustomLibrary.WaitNClick(LeftMenuPropertyOption);
        var btnEditProperty = element(by.css('[href*="LeftMenu1$Properties$grdProperty$ctl02$ctl01"]'));
        CustomLibrary.WaitNClick(btnEditProperty);
        txtLegalDesc.sendKeys('Test Data Edit');
        btnAddProperty.click();
        LeftMenuStatusOption.click();
    }
 
    this.UpdatePropertyPIN = function (txt) {
        CustomLibrary.WaitNClick(LeftMenuPropertyOption);
        var btnEditProperty = element(by.css('[href*="LeftMenu1$Properties$grdProperty$ctl02$ctl01"]'));
        CustomLibrary.WaitNClick(btnEditProperty);
        PIN.sendKeys(txt);
        CustomLibrary.WaitNClick(btnAddPIN);
        CustomLibrary.WaitNClick(btnAddProperty);
        //btnAddPIN.click();
       // btnAddProperty.click();
        LeftMenuStatusOption.click();
    }

    this.RemovePropertyLegalDesc = function () {
        CustomLibrary.WaitNClick(LeftMenuPropertyOption);
        var btnEditProperty = element(by.css('[href*="LeftMenu1$Properties$grdProperty$ctl02$ctl01"]'));
        CustomLibrary.WaitNClick(btnEditProperty);
        txtLegalDesc.clear();
        btnAddProperty.click();
        LeftMenuStatusOption.click();
    }

    this.EnterPreFundNewMortgageRegAmtless100000 = function (mortgageProduct) {
        LeftMenuNewMortgageOption.click();
        ddlMortgageProduct.element(by.cssContainingText('option', mortgageProduct)).click();
        ddlTransactionType.element(by.cssContainingText('option', 'PURCHASE')).click();
        ddlMortgagePriority.element(by.cssContainingText('option', 'First')).click();
        ddlPayementPeriod.element(by.cssContainingText('option', 'Weekly')).click();
        tbBridgeLoanNumber.sendKeys(CustomLibrary.getRandomNumber(10));
        tbMortgageAmount.clear();
        tbMortgageAmount.sendKeys('$10000.00');
        tbRegisteredAmount.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, "a", protractor.Key.DELETE));
        tbRegisteredAmount.sendKeys('10000');
        tbBridgeLoanAmount.clear();
        tbBridgeLoanAmount.sendKeys('$10000.00');

    }

    this.EnterPreFundNewMortgageRegAmtless100000Common = function (mortgageProduct, transactionType) {
        LeftMenuNewMortgageOption.click();
        ddlMortgageProduct.element(by.cssContainingText('option', mortgageProduct)).click();
        ddlTransactionType.element(by.cssContainingText('option', transactionType)).click();
        ddlMortgagePriority.element(by.cssContainingText('option', 'First')).click();
        ddlPayementPeriod.element(by.cssContainingText('option', 'Weekly')).click();
        tbBridgeLoanNumber.sendKeys(CustomLibrary.getRandomNumber(10));
        tbMortgageAmount.clear();
        tbMortgageAmount.sendKeys('$10000.00');
        tbRegisteredAmount.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, "a", protractor.Key.DELETE));
        tbRegisteredAmount.sendKeys('10000');
        tbBridgeLoanAmount.clear();
        tbBridgeLoanAmount.sendKeys('$10000.00');

    }

    //new March 12
    this.EnterPreFundNewMortgageRegAmtgreaterorequal750000Refinance = function (mortgageProduct) {
        LeftMenuNewMortgageOption.click();
        ddlMortgageProduct.element(by.cssContainingText('option', mortgageProduct)).click();
        ddlTransactionType.element(by.cssContainingText('option', 'REFINANCE')).click();
        ddlMortgagePriority.element(by.cssContainingText('option', 'First')).click();
        ddlPayementPeriod.element(by.cssContainingText('option', 'Weekly')).click();
        tbBridgeLoanNumber.sendKeys(CustomLibrary.getRandomNumber(10));
        tbMortgageAmount.clear();
        tbMortgageAmount.sendKeys('$10000.00');
        tbRegisteredAmount.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, "a", protractor.Key.DELETE));
        tbRegisteredAmount.sendKeys('750000');
        tbBridgeLoanAmount.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, "a", protractor.Key.DELETE));
        tbBridgeLoanAmount.sendKeys('$10000.00');

    }

    this.EnterPreFundNewMortgageRegAmtgreaterorequal750000Purchase = function (mortgageProduct) {
        LeftMenuNewMortgageOption.click();
        ddlMortgageProduct.element(by.cssContainingText('option', mortgageProduct)).click();
        ddlTransactionType.element(by.cssContainingText('option', 'PURCHASE')).click();
        ddlMortgagePriority.element(by.cssContainingText('option', 'First')).click();
        ddlPayementPeriod.element(by.cssContainingText('option', 'Weekly')).click();
        tbBridgeLoanNumber.sendKeys(CustomLibrary.getRandomNumber(10));
        tbMortgageAmount.clear();
        tbMortgageAmount.sendKeys('$10000.00');
        tbRegisteredAmount.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, "a", protractor.Key.DELETE));
        tbRegisteredAmount.sendKeys('750000');
        tbBridgeLoanAmount.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, "a", protractor.Key.DELETE));
        tbBridgeLoanAmount.sendKeys('$10000.00');

    }

    this.ClickReleaseHold = function () {
        btnReleaseHold.click();
    }

    this.EnterReleaseHoldReasons = function (txt) {

        var EC = protractor.ExpectedConditions;
        var eleDDLReason = element(by.id('ddlReason'));
        browser.wait(EC.visibilityOf(eleDDLReason), 45000, 'Waiting for element to become viible').then(() => {
            // eleDDLReason.element(by.cssContainingText('option', reason)).click();
            element(by.id("txtReason")).sendKeys(txt);
            element(by.id("btnYes")).click();
            browser.sleep(3000)
        }, (error) => {
            expect(true).toBe(false, "Release Hold Dropdown is not Present");
        })
        /*
                element(by.id('ddlReason')).element(by.cssContainingText('option', reason)).click();
                element(by.id("txtReason")).sendKeys(txt);
                element(by.id("btnYes")).click();
                browser.sleep(3000)*/
    }
    //new

    this.EnterPreFundNewMortgageRegAmtless100000Refinance = function (mortgageProduct) {
        LeftMenuNewMortgageOption.click();
        ddlMortgageProduct.element(by.cssContainingText('option', mortgageProduct)).click();
        ddlTransactionType.element(by.cssContainingText('option', 'REFINANCE')).click();
        ddlMortgagePriority.element(by.cssContainingText('option', 'First')).click();
        ddlPayementPeriod.element(by.cssContainingText('option', 'Weekly')).click();
        tbBridgeLoanNumber.sendKeys(CustomLibrary.getRandomNumber(10));
        tbMortgageAmount.clear();
        tbMortgageAmount.sendKeys('$10000.00');
        tbRegisteredAmount.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, "a", protractor.Key.DELETE));
        tbRegisteredAmount.sendKeys('10000');
        tbBridgeLoanAmount.clear();
        tbBridgeLoanAmount.sendKeys('$10000.00');

    }

    this.EnterNewMortgageDataRefinance = function (mortgageProduct) {
        LeftMenuNewMortgageOption.click();
        ddlMortgageProduct.element(by.cssContainingText('option', mortgageProduct)).click();
        ddlTransactionType.element(by.cssContainingText('option', 'REFINANCE')).click();
        ddlMortgagePriority.element(by.cssContainingText('option', 'First')).click();
        ddlPayementPeriod.element(by.cssContainingText('option', 'Weekly')).click();
        tbBridgeLoanNumber.sendKeys(CustomLibrary.getRandomNumber(10));
        tbMortgageAmount.clear();
        tbMortgageAmount.sendKeys('$10000.00');
        tbRegisteredAmount.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, "a", protractor.Key.DELETE));
        tbRegisteredAmount.sendKeys('100000');
        tbBridgeLoanAmount.clear();
        tbBridgeLoanAmount.sendKeys('$10000.00');

    }

    this.PrefundUploadedDocVerification = function (DocSearch) {
        var docFound = false;
        LeftMenuDocumentOPtion.click();
        var tblPostedDocument = element(by.id('LeftMenu1_Documents_DocumentList_grdDocumentList'));
        var tblbodyPostedDocument = tblPostedDocument.element(by.tagName('tbody'));
        var rowtblPostedDocument = tblbodyPostedDocument.all(by.tagName('tr'));
        rowtblPostedDocument.each(function (row, rowindex) {
            if (rowindex > 0) {
                var cols = row.all(by.tagName('td'));
                cols.get(0).getText().then(function (DocName) {
                    if (DocName == DocSearch) {
                        docFound = true;
                      
                        expect(DocName).toContain(DocSearch, "Document Name under Document Grid in MMS FCT Portal")
                        expect(cols.get(2).getText()).toContain('LAWYER', "Document Name not matching")
                    }
                }).then(function () {
                    expect(docFound).toBe(true, "Document not present under Document Grid in MMS FCT Portal")
                })

            }
        })

        //   //*[@id="LeftMenu1_Documents_DocumentList_grdDocumentList"]/tbody/tr/td[contains(text(),'Power')]
    }

    this.VerifyDocumentTableEntry = function (name) {
        var table = element(by.id('LeftMenu1_Documents_DocumentList_grdDocumentList'));
        var tabBody = table.element(by.tagName('tbody'));
        var EC = protractor.ExpectedConditions;
        browser.wait(EC.visibilityOf(tabBody), 5000, 'Document table is not available');
     
      return  element.all(by.cssContainingText('td', name)).count().then(function (count) {
            expect(count).toBeGreaterThan(0, "Expected document " + name + " is not found");
             
            return count;
         });  
             
    };

  

    this.PrefundSolicitorInstructionPFIVerification = function (prefundmap) {

        let Solsmap = new Map();
        let QuestionLookupMap = new Map();

        LeftMenuSolictorOption.click();
        var questionspanel = element.all(by.css('.PifQuestions'));
        var answerret;
        var questionsret;
        QuestionLookupMap.set("Will there be any mortgages remaining on title?", "Will there be any mortgages remaining on title?");
        QuestionLookupMap.set("Do you have a Real Estate Agent for this property?", "What is the name and phone number of the real estate company/agent?\n(If No Agent, please upload/fax in a copy of the Agreement of Purchase and Sale with all Amendments and Title Search, which includes deleted/historical/cancelled instruments in ON, AB and BC.)");
        QuestionLookupMap.set("Have there been any Amendments with respect to the purchase price and/or deposit after the date of signing the Agreement of Purchase and Sale, which exceed the total sum of $10,000.00?", "Have there been any Amendments with respect to the purchase price and/or deposit after the date of signing the Agreement of Purchase and Sale, which exceed the total sum of $10,000.00?\n(If Yes, please upload/fax in a copy of the Agreement of Purchase and Sale with all Amendments and PIN Page, which includes deleted instruments.)");
        QuestionLookupMap.set("Was any portion of the Deposit paid directly to the vendors? (Please do not answer “Yes” if the deposit was paid to the vendor’s solicitor and it is retained in his trust account.)", "Was any portion of the Deposit paid directly to the vendors?\n(Please do not answer “Yes” if the deposit was paid to the vendor’s solicitor and it is retained in his trust account.)\n(If Yes, please upload/fax in a copy of the Agreement of Purchase and Sale with all Amendments and PIN which includes deleted instruments.)")
        QuestionLookupMap.set("Are any vendors to the transaction signing by way of Power of Attorney?", "Are any vendors to the transaction signing by way of Power of Attorney?\n(If Yes, please upload/fax in copies of the Agreement of Purchase and Sale with all Amendments, Power of Attorney and PIN Page, which includes deleted instruments.)")
        QuestionLookupMap.set("Have there been any discharges of mortgages or transfers of title registered in the past 6 months?", "Have there been any discharges of mortgages or transfers of title registered in the past 6 months?\n(If Yes, please provide the details AND PIN Page, which includes deleted instruments.)")
        QuestionLookupMap.set("Are there any other matters that would normally qualify your legal opinion (including but not limited to title matters, judgments, liens, taxes, etc.)?", "Are there any other matters that would normally qualify your legal opinion (including but not limited to title matters, judgments, liens, taxes, etc.)?")
        QuestionLookupMap.set("Will the requirements outlined in the Solicitors Instructions be satisfied prior to closing?", "Will the requirements outlined in the Solicitors Instructions be satisfied prior to closing?");
        QuestionLookupMap.set("What is the name of the Vendor’s Solicitor?", "What is the name of the vendor’s solicitor?");
        // new
        QuestionLookupMap.set("Have there been any Amendments with respect to the purchase price and/or deposit after the date of signing the Agreement of Purchase and Sale, which exceed the total sum of $25,000?", "Have there been any Amendments with respect to the purchase price and/or deposit after the date of signing the Agreement of Purchase and Sale, which exceed the total sum of $25,000?")
        QuestionLookupMap.set("Was any portion of the Deposit paid directly to the vendors? (Please do not answer “Yes” if the deposit was paid to the vendor’s solicitor and it is retained in his trust account.)", "Was any portion of the Deposit paid directly to the vendors? (Please do not answer “Yes” if the deposit was paid to the vendor’s solicitor and it is retained in his trust account.)")
        QuestionLookupMap.set("Are any vendors to the transaction signing by way of Power of Attorney?", "Are any vendors to the transaction signing by way of Power of Attorney?");
        QuestionLookupMap.set("Are any vendors to the transaction signing by way of Power of Attorney?", "Are any vendors to the transaction signing by way of Power of Attorney?");


        //new
        return questionspanel.each(function (qtn, rowindex) {
            var questions = qtn.all(by.tagName('span')).get(0);
            var answers = qtn.all(by.css('.PifAnswers')).all(by.css('.pifAnswerType')).all(by.css('input[checked="checked"]')).all(by.xpath('..')).all(by.tagName('span'));

            questionsret = questions.getText().then(function (txt) {

                questionsret = "";


                questionsret = txt;
                return questionsret;

            })

            answerret = answers.getText().then(function (txt) {
                answerret = "";
                if (txt.length > 0) {

                    answerret = txt[1];
                }
                return answerret;
            })
            // }



            //console.log(qtn.getText());
            questionsret.then(function (txt) {
                //console.log(txt);
                //console.log(answerret);
                Solsmap.set(questionsret, answerret);
                console.log(questionsret + " : " + answerret);

            })


        }).then(function (t) {
            // console.log(prefundmap);
            // console.log(Solsmap);
            // console.log(prefundmap);
            for (let prefundQuestions of prefundmap.keys()) {
                var prefundAnswers = prefundmap.get(prefundQuestions);
                var lookupQuestion = QuestionLookupMap.get(prefundQuestions);
                var solAnswer = Solsmap.get(lookupQuestion);

                //console.log("Prefund Questions   " + prefundQuestions);
                //console.log("Prefund Answers   " + prefundAnswers);
                //console.log("Lookup  Questions   " + lookupQuestion);
                //console.log("Soli Answers   " + solAnswer);
                expect(prefundAnswers).toEqual(solAnswer, 'Answers not matching for Prefund Question ' + prefundQuestions + ' and Solicitor Question  ' + lookupQuestion);

            }
        })

    }
    this.GetPrefundSolicitorInstructionQuestions = function () {

        let Solsmap = new Map();


        LeftMenuSolictorOption.click();
        var questionspanel = element.all(by.css('.PifQuestions'));
        var answerret;
        var questionsret;
        //new
        return questionspanel.each(function (qtn, rowindex) {
            var questions = qtn.all(by.tagName('span')).get(0);
            var answers = qtn.all(by.css('.PifAnswers')).all(by.css('.pifAnswerType')).all(by.css('input[checked="checked"]')).all(by.xpath('..')).all(by.tagName('span'));

            questionsret = questions.getText().then(function (txt) {

                questionsret = "";


                questionsret = txt;
                return questionsret;

            })

            answerret = answers.getText().then(function (txt) {
                answerret = "";
                if (txt.length > 0) {

                    answerret = txt[1];
                }
                return answerret;
            })
            // }



            //console.log(qtn.getText());
            questionsret.then(function (txt) {
                //console.log(txt);
                //console.log(answerret);
                Solsmap.set(questionsret, answerret);
                //console.log(questionsret + " : " + answerret);

            })


        }).then(function (t) {
            return Solsmap;
        })
    };

    this.questionAnswerVerifcation = function (prefundmap, Solsmap) {

        // let Solsmap = new Map();
        let QuestionLookupMap = new Map();

        //LeftMenuSolictorOption.click();
        //var questionspanel = element.all(by.css('.PifQuestions'));
        var answerret;
        var questionsret;
        QuestionLookupMap.set("Will there be any mortgages remaining on title?", "Will there be any mortgages remaining on title?");
        QuestionLookupMap.set("Do you have a Real Estate Agent for this property?", "What is the name and phone number of the real estate company/agent?\n(If No Agent, please upload/fax in a copy of the Agreement of Purchase and Sale with all Amendments and Title Search, which includes deleted/historical/cancelled instruments in ON, AB and BC.)");
        QuestionLookupMap.set("Have there been any Amendments with respect to the purchase price and/or deposit after the date of signing the Agreement of Purchase and Sale, which exceed the total sum of $10,000.00?", "Have there been any Amendments with respect to the purchase price and/or deposit after the date of signing the Agreement of Purchase and Sale, which exceed the total sum of $10,000.00?\n(If Yes, please upload/fax in a copy of the Agreement of Purchase and Sale with all Amendments and PIN Page, which includes deleted instruments.)");
        QuestionLookupMap.set("Was any portion of the Deposit paid directly to the vendors? (Please do not answer “Yes” if the deposit was paid to the vendor’s solicitor and it is retained in his trust account.)", "Was any portion of the Deposit paid directly to the vendors?\n(Please do not answer “Yes” if the deposit was paid to the vendor’s solicitor and it is retained in his trust account.)\n(If Yes, please upload/fax in a copy of the Agreement of Purchase and Sale with all Amendments and PIN which includes deleted instruments.)")
        QuestionLookupMap.set("Are any vendors to the transaction signing by way of Power of Attorney?", "Are any vendors to the transaction signing by way of Power of Attorney?\n(If Yes, please upload/fax in copies of the Agreement of Purchase and Sale with all Amendments, Power of Attorney and PIN Page, which includes deleted instruments.)")
        QuestionLookupMap.set("Have there been any discharges of mortgages or transfers of title registered in the past 6 months?", "Have there been any discharges of mortgages or transfers of title registered in the past 6 months?\n(If Yes, please provide the details AND PIN Page, which includes deleted instruments.)")
        QuestionLookupMap.set("Are there any other matters that would normally qualify your legal opinion (including but not limited to title matters, judgments, liens, taxes, etc.)?", "Are there any other matters that would normally qualify your legal opinion (including but not limited to title matters, judgments, liens, taxes, etc.)?")
        QuestionLookupMap.set("Will the requirements outlined in the Solicitors Instructions be satisfied prior to closing?", "Will the requirements outlined in the Solicitors Instructions be satisfied prior to closing?");
        QuestionLookupMap.set("What is the name of the Vendor’s Solicitor?", "What is the name of the vendor’s solicitor?");
        // new
        QuestionLookupMap.set("Have there been any Amendments with respect to the purchase price and/or deposit after the date of signing the Agreement of Purchase and Sale, which exceed the total sum of $25,000?", "Have there been any Amendments with respect to the purchase price and/or deposit after the date of signing the Agreement of Purchase and Sale, which exceed the total sum of $25,000?")
        QuestionLookupMap.set("Was any portion of the Deposit paid directly to the vendors? (Please do not answer “Yes” if the deposit was paid to the vendor’s solicitor and it is retained in his trust account.)", "Was any portion of the Deposit paid directly to the vendors? (Please do not answer “Yes” if the deposit was paid to the vendor’s solicitor and it is retained in his trust account.)")
        QuestionLookupMap.set("Are any vendors to the transaction signing by way of Power of Attorney?", "Are any vendors to the transaction signing by way of Power of Attorney?");
        QuestionLookupMap.set("Are any vendors to the transaction signing by way of Power of Attorney?", "Are any vendors to the transaction signing by way of Power of Attorney?");


        //new

        // console.log(prefundmap);
        // console.log(Solsmap);
        // console.log(prefundmap);
        for (let prefundQuestions of prefundmap.keys()) {
            var prefundAnswers = prefundmap.get(prefundQuestions);
            var lookupQuestion = QuestionLookupMap.get(prefundQuestions);
            var solAnswer = Solsmap.get(lookupQuestion);

            console.log("Prefund Questions   " + prefundQuestions);
            console.log("Prefund Answers   " + prefundAnswers);
            console.log("Lookup  Questions   " + lookupQuestion);
            console.log("Soli Answers   " + solAnswer);
            expect(prefundAnswers).toEqual(solAnswer, 'Answers not matching for Prefund Question ' + prefundQuestions + ' and Solicitor Question  ' + lookupQuestion);

        }

        
        



    };
};




module.exports = new MMSPortal();