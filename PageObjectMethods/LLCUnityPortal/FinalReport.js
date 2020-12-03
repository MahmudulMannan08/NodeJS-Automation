'use strict';
var TestData = require('../../testData/TestData.js');
var CustomLib = require('../../CustomLibrary/CustomLibrary.js');
var LenderIntegrationBNS = require('./Services/LenderIntegration/LenderIntegrationBNS.js');
var MenuPanel = require('./MenuPanel.js');
var CustomLibrary = require('../../CustomLibrary/CustomLibrary.js');
var RunSettings = require('../../testData/RunSetting.js');

var Lang = TestData.data.LANGUAGE.value;
var PortalFieldIdentifier = TestData.data[Lang].Header.PortalFieldIdentifier;
var UnityFieldIdentifier = TestData.data[Lang].Header.UnityFieldIdentifier;
var NavigateAwyPopupMsg = TestData.data[Lang].Messages.NavigateawayMsg;
var Footer = TestData.data[Lang].Footer.Footer;
var FRSubmitMsg = TestData.data[Lang].Messages.FRSubmitMsg;


var dateFormat = require('dateformat');

var FinalReport = function () {

    var FinalReportFieldMsg1 = element.all(by.xpath('//div[@class=\'my-1 required-message-danger\']')).get(0);
    var FinalReportFieldMsg2 = element.all(by.xpath('//div[@class=\'my-1 required-message-danger\']')).get(1);    
    var FinalReportReqFieldMsg = element(by.tagName('app-mms-finalreport')).all(by.css('.ng-star-inserted')).first().all(by.tagName('span')).get(0);
    var FinalReportUnityFieldMsg = element(by.tagName('app-mms-finalreport')).all(by.css('.ng-star-inserted')).first().all(by.tagName('span')).get(2);
    var WarningMsgIDV = element.all(by.tagName('app-panel-borderless')).all(by.css('.my-0')).get(0).all(by.tagName('p')).get(1);
    var WarningMsg = element(by.css('.modal-content')).all(by.css('.col')).all(by.css('.ng-star-inserted')).get(0);
    var cbConfirmClosing = element(by.id('ctl00_mainContentPlaceHolder_cbConfirmClosing'));
    var txtRegistrationNumber = element(by.id('ctl00_mainContentPlaceHolder_pc_0_RegistrationParticularsSROT1_RegistrationNumber_txtValue'));
    var txtRegistrationDate = element(by.id('ctl00_mainContentPlaceHolder_pc_0_RegistrationParticularsSROT1_RegistrationDate_calendar_dateTextBox'));
    var btnSaveButton = element(by.id('ctl00_mainContentPlaceHolder_btnSave'));
    var pnlRegParticulars = element(by.tagName('app-mms-property')).all(by.tagName('app-panel')).get(1).all(by.css('.jumbotron.box-inner.ng-star-inserted')).all(by.tagName('div:nth-child(2)'));
    var txtRegDate = element.all(by.css("input[formControlName=assignmentOfRentsRegistrationDate]"))
    var chkConfirmClosing = element.all(by.css("input[formControlName=closingConfirmed]"))
    var txtRegNo = element.all(by.css("input[formControlName=assignmentOfRentsRegistrationNumber]"))
    var radbtnEng = element(by.id('radEnglish'));
    var btnOkLayerSelection = element(by.css('.btn.btn-success.btn-sm.fct.mt-2'));
    var MMSbtnSave = element(by.css('.btn.btn-primary.fct.ng-star-inserted'));
    var MMSbtnCreate = element.all(by.css('.btn.btn-success.fct.ng-star-inserted')).get(0);
    var btnFinalSubmit = element.all(by.css('.btn.btn-success.fct.ng-star-inserted')).get(1);
    var chkConfirmClosingRF = element(by.css('.mt-0.form-check-input.check-box.custom.ng-untouched.ng-pristine.ng-invalid'));
    var btnSave = element(by.buttonText("Save"));
    var btnCreate = element(by.buttonText("Create"));
    var btnSubmit = element(by.buttonText("Submit"));
    var btnOKafterSubmit = element(by.buttonText('OK'));
    var PortalFieldIdentifierTxt = element(by.tagName('app-bns-finalreport')).all(by.css('.ng-star-inserted')).first().all(by.tagName('span')).get(0);
    var UnityFieldIdentifierTxt = element(by.tagName('app-bns-finalreport')).all(by.css('.ng-star-inserted')).first().all(by.tagName('span')).get(2);
    var lnkNeedHelp = element(by.linkText('Need Help?'));
    var lblFR = element.all(by.css('.title')).first();
    var txtFooter = element(by.tagName('app-footer')).element(by.tagName('span'));
    var lnkLegal = element(by.tagName('app-footer')).all(by.tagName('a')).get(0);
    var lnkPrivacy = element(by.tagName('app-footer')).all(by.tagName('a')).get(1);
    var lblProperty = element(by.tagName('app-bns-property')).all(by.css('.title')).first();
    var lblPropertyAddress = element(by.tagName('app-bns-property')).all(by.css('.form-row')).get(0).element(by.tagName('label'));
    var PropertyAddressVal = element(by.tagName('app-bns-property')).all(by.css('.form-row')).get(0).all(by.tagName('div')).get(1);
    var lblPropertyDetails = element(by.tagName('app-bns-property')).all(by.css('.form-row')).get(1);
    var lblPIN = element(by.tagName('app-bns-property')).all(by.css('.form-row')).get(2).all(by.tagName('label')).get(0);
    var lblPID = element(by.tagName('app-bns-property')).all(by.css('.form-row')).get(2).all(by.tagName('label')).get(0);
    var lblPINTD = element(by.tagName('app-td-property')).all(by.css('.form-row')).get(2).all(by.tagName('label')).get(0);
    var lblPIDTD = element(by.tagName('app-td-property')).all(by.css('.form-row')).get(2).all(by.tagName('label')).get(0);

    var PINVal = element(by.tagName('app-bns-property')).all(by.css('.form-row')).get(2).all(by.css('.ng-star-inserted')).first();
    var lblMunicipality = element(by.tagName('app-bns-property')).all(by.css('.form-row')).get(2).all(by.tagName('label')).get(1);
    var MunicipalityVal = element(by.tagName('app-bns-property')).all(by.css('.form-row')).get(2).all(by.css('.form-group.col-md-4')).get(1).element(by.tagName('div'));
    var lblCondominium = element(by.tagName('app-bns-property')).all(by.css('.form-row')).get(2).all(by.tagName('label')).get(2);
    var CondominiumVal = element(by.tagName('app-bns-property')).all(by.css('.form-row')).get(2).all(by.css('.form-group.col-md-4')).get(2).element(by.tagName('div'));
    var lblLegalDesc = element(by.tagName('app-bns-property')).all(by.css('.form-row')).get(3).element(by.tagName('label'));

    var LegalDescVal = element(by.tagName('app-bns-property')).all(by.css('.form-row')).get(3).all(by.tagName('div')).first().element(by.tagName('div'));
    var lblRegParticulars = element(by.tagName('app-bns-property')).element(by.css('.title.font-weight-bold'));
    var lblRegNumber = element(by.tagName('app-bns-property')).all(by.css('.jumbotron.box-outer')).get(1).all(by.css('.form-row')).get(1).all(by.tagName('label')).get(0);
    var RegNumberVal = element(by.tagName('app-bns-property')).all(by.css('.jumbotron.box-outer')).get(1).all(by.css('.form-row')).get(1).all(by.tagName('div')).get(1);
    var lblRegDate = element(by.tagName('app-bns-property')).all(by.css('.jumbotron.box-outer')).get(1).all(by.css('.form-row')).get(1).all(by.tagName('label')).get(1);
    var RegDateVal = element(by.tagName('app-bns-property')).all(by.css('.jumbotron.box-outer')).get(1).all(by.css('.form-row')).get(1).all(by.tagName('div')).get(3);
    var lblRegOffice = element(by.tagName('app-bns-property')).all(by.css('.jumbotron.box-outer')).get(1).all(by.css('.form-row')).get(2).all(by.tagName('label')).get(0);
    var RegOfficeVal = element(by.tagName('app-bns-property')).all(by.css('.jumbotron.box-outer')).get(1).all(by.css('.form-row')).get(2).all(by.tagName('div')).get(1);
    var lblAssofRent = element(by.tagName('app-bns-property')).all(by.css('.jumbotron.box-outer')).get(1).all(by.css('.form-row')).get(2).all(by.tagName('label')).get(1);
    var tbAssofRent = element(by.tagName('app-bns-property')).all(by.css('.jumbotron.box-outer')).get(1).all(by.css('.form-row')).get(2).element(by.tagName('input'));
    var lblFireInsParticular = element(by.tagName('app-bns-fireinsurance')).element(by.css('.title.font-weight-bold'));
    var lblFireIns = element(by.tagName('app-td-fire-insurance')).element(by.css('.col'));
    var lblTitleIns = element(by.tagName('app-td-title-insurance')).all(by.css('.m-0.my-2.ml-3.ng-star-inserted')).get(0);
    var lblCompanyNameTD = element(by.tagName('app-td-title-insurance')).all(by.css('.form-group.col-md-4')).get(0).all(by.css('.control-label')).get(0);
    var lblCompanyName = element(by.tagName('app-bns-fireinsurance')).all(by.css('.form-row')).get(0).all(by.tagName('label')).get(0);
    var CompanyNameVal = element(by.tagName('app-bns-fireinsurance')).all(by.css('.form-row')).get(0).all(by.tagName('div')).get(1);
    var lblPolicyDateTD = element(by.tagName('app-td-title-insurance')).all(by.css('.form-row')).get(0).all(by.css('.control-label')).get(2);
    var lblExpiryDate = element(by.xpath('//app-bns-fireinsurance//label[contains(text(),\'Expiry Date\')]'));
    var ExpiryDateVal = element(by.xpath('//app-bns-fireinsurance//label[contains(text(),\'Expiry Date\')]//ancestor::div[1]//div[1]'));
    // var ExpiryDateVal = element(by.tagName('app-bns-fireinsurance')).all(by.css('.form-row')).get(0).all(by.tagName('div')).get(3);
    var lblPolicyNumberTD = element(by.tagName('app-td-title-insurance')).all(by.css('.form-row')).get(0).all(by.css('.control-label')).get(1);
    var lblPolicyNumber =element(by.xpath('//app-bns-fireinsurance//label[contains(text(),\'Policy Number\')]'));
    var PolicyNumberVal = element(by.xpath('//app-bns-fireinsurance//label[contains(text(),\'Policy Number\')]//ancestor::div[1]//div[1]'));
    // var PolicyNumberVal = element(by.tagName('app-bns-fireinsurance')).all(by.css('.form-row')).get(1).all(by.tagName('div')).get(1);
    var lblInsAmountTD = element(by.tagName('app-td-title-insurance')).all(by.css('.form-row')).get(1).all(by.css('.control-label')).get(0);
    var lblScheduleBExceptions = element(by.xpath('//app-td-title-insurance//label[contains(text(),\'Schedule B Exceptions\')]'));
    var lblInsAmount = element(by.xpath('//app-bns-fireinsurance//label[contains(text(),\'Insurance Amount\')]'));
    // var InsAmountVal = element(by.tagName('app-bns-fireinsurance')).all(by.css('.form-row')).get(1).all(by.tagName('div')).get(3);
    var InsAmountVal =element(by.xpath('//app-bns-fireinsurance//label[contains(text(),\'Insurance Amount\')]//ancestor::div[1]//div'));
    //var lblFireInsComAddress = element(by.tagName('app-bns-fireinsurance')).all(by.css('.form-row')).get(2);
    var lblFireInsComAddress =  element(by.xpath('//app-bns-fireinsurance//div[contains(text(),\'Fire Insurance Company Address\')]'));
    //var lblUnitNo = element(by.tagName('app-bns-fireinsurance')).all(by.css('.form-row')).get(3).all(by.tagName('label')).get(0);
    // var UnitNoVal = element(by.tagName('app-bns-fireinsurance')).all(by.css('.form-row')).get(3).all(by.tagName('div')).get(1);
    var lblUnitNo = element(by.xpath('//app-bns-fireinsurance//label[contains(text(),\'Unit No\')]'));
    var UnitNoVal = element(by.xpath('//app-bns-fireinsurance//label[contains(text(),\'Unit No\')]//ancestor::div[1]//div'));
    // var lblStreetNumber = element(by.tagName('app-bns-fireinsurance')).all(by.css('.form-row')).get(3).all(by.tagName('label')).get(1);
    //var StreetNumberVal = element(by.tagName('app-bns-fireinsurance')).all(by.css('.form-row')).get(3).all(by.tagName('div')).get(3);
    var lblStreetNumber = element(by.xpath('//app-bns-fireinsurance//label[contains(text(),\'Street Number\')]'));
    var StreetNumberVal = element(by.xpath('//app-bns-fireinsurance//label[contains(text(),\'Street Number\')]//ancestor::div[1]//div'));
    //var lblStreetNameLine1 = element(by.tagName('app-bns-fireinsurance')).all(by.css('.form-row')).get(3).all(by.tagName('label')).get(2);
    //var StreetNameLine1Val = element(by.tagName('app-bns-fireinsurance')).all(by.css('.form-row')).get(3).all(by.tagName('div')).get(5);
    var lblStreetNameLine1 =  element(by.xpath('//app-bns-fireinsurance//label[contains(text(),\'Street Name - Line 1\')]'));
    var StreetNameLine1Val =element(by.xpath('//app-bns-fireinsurance//label[contains(text(),\'Street Name - Line 1\')]//ancestor::div[1]//div'));
    //var lblStreetNameLine2 = element(by.tagName('app-bns-fireinsurance')).all(by.css('.form-row')).get(4).all(by.tagName('label')).get(0);
    // var StreetNameLine2Val = element(by.tagName('app-bns-fireinsurance')).all(by.css('.form-row')).get(4).all(by.tagName('div')).get(1);
    var lblStreetNameLine2 =  element(by.xpath('//app-bns-fireinsurance//label[contains(text(),\'Street Name - Line 2\')]'));
    var StreetNameLine2Val = element(by.xpath('//app-bns-fireinsurance//label[contains(text(),\'Street Name - Line 2\')]//ancestor::div[1]//div'));
    //var lblCity = element(by.tagName('app-bns-fireinsurance')).all(by.css('.form-row')).get(4).all(by.tagName('label')).get(1);
    // var CityVal = element(by.tagName('app-bns-fireinsurance')).all(by.css('.form-row')).get(4).all(by.tagName('div')).get(3);
    var lblCity = element(by.xpath('//app-bns-fireinsurance//label[contains(text(),\'City\')]'));
    var CityVal =element(by.xpath('//app-bns-fireinsurance//label[contains(text(),\'City\')]//ancestor::div[1]//div'));
    var lblProvince = element(by.xpath('//app-bns-fireinsurance//label[contains(text(),\'Province\')]'));
    var ProvinceVal = element(by.xpath('//app-bns-fireinsurance//label[contains(text(),\'Province\')]//ancestor::div[1]//div'));
    var lblPostalCode =element(by.xpath('//app-bns-fireinsurance//label[contains(text(),\'Postal Code\')]'));
    var PostalCodeVal = element(by.xpath('//app-bns-fireinsurance//label[contains(text(),\'Postal Code\')]//ancestor::div[1]//div'));
    var lblCountry = element(by.xpath('//app-bns-fireinsurance//label[contains(text(),\'Country\')]'));
    var CountryVal =element(by.xpath('//app-bns-fireinsurance//label[contains(text(),\'Country\')]//ancestor::div[1]//div'));
    //var lblProvince = element(by.tagName('app-bns-fireinsurance')).all(by.css('.form-row')).get(4).all(by.tagName('label')).get(2);
    //var ProvinceVal = element(by.tagName('app-bns-fireinsurance')).all(by.css('.form-row')).get(4).all(by.tagName('div')).get(5);
    //var lblPostalCode = element(by.tagName('app-bns-fireinsurance')).all(by.css('.form-row')).get(5).all(by.tagName('label')).get(0);
    //var PostalCodeVal = element(by.tagName('app-bns-fireinsurance')).all(by.css('.form-row')).get(5).all(by.tagName('div')).get(1);
    // var lblCountry = element(by.tagName('app-bns-fireinsurance')).all(by.css('.form-row')).get(5).all(by.tagName('label')).get(1);
    // var CountryVal = element(by.tagName('app-bns-fireinsurance')).all(by.css('.form-row')).get(5).all(by.tagName('div')).get(3);
    var lblTitleInsLPD = element(by.tagName('app-bns-titleinsurance')).element(by.css('.title.font-weight-bold'));
    //var lblTitleInsLPDTD = element(by.tagName('app-td-titleinsurance')).element(by.css('.title.font-weight-bold'));
    var lblTICompanyName = element(by.tagName('app-bns-titleinsurance')).all(by.css('.form-row')).get(0).all(by.tagName('label')).get(0);
    var TICompanyNameVal = element(by.tagName('app-bns-titleinsurance')).all(by.css('.form-row')).get(0).all(by.tagName('div')).get(1);
    var lblTIPolicyNumber = element(by.tagName('app-bns-titleinsurance')).all(by.css('.form-row')).get(0).all(by.tagName('label')).get(1);
    var TIPolicyNumberVal = element(by.tagName('app-bns-titleinsurance')).all(by.css('.form-row')).get(0).all(by.tagName('div')).get(3);
    var lblDateofPolicy = element(by.tagName('app-bns-titleinsurance')).all(by.css('.form-row')).get(1).all(by.tagName('label')).get(0);
    var DateofPolicyVal = element(by.tagName('app-bns-titleinsurance')).all(by.css('.form-row')).get(1).all(by.tagName('div')).get(1);
    var lblAmountofIns = element(by.tagName('app-bns-titleinsurance')).all(by.css('.form-row')).get(1).all(by.tagName('label')).get(1);
    var AmountofInsVal = element(by.tagName('app-bns-titleinsurance')).all(by.css('.form-row')).get(1).all(by.tagName('div')).get(3);
    var lblLawyerNotaryCom = element(by.tagName('app-bns-finalreport')).all(by.css('.jumbotron.box-outer')).get(5).element(by.css('.title.font-weight-bold'));

    var lblCharCounter = element(by.tagName('app-bns-finalreport')).all(by.css('.jumbotron.box-outer')).get(5).element(by.css('.float-right'));
    var lblCharCounter1 = element(by.tagName('app-bns-finalreport')).all(by.css('.jumbotron.box-outer')).get(7).element(by.css('.float-right'));
    var tbComment = element(by.id('comments'));
    var lblDocLanguage = element(by.tagName('app-bns-finalreport')).all(by.css('.jumbotron.box-outer')).get(6).element(by.css('.control-label'));
    var lblEnglish = element(by.tagName('app-bns-finalreport')).all(by.css('.form-check-label')).get(0);
    var lblFrench = element(by.tagName('app-bns-finalreport')).all(by.css('.form-check-label')).get(1);
    var btnEnglish = element(by.id('radEnglish'));
    var btnFrench = element(by.id('radFrench'));
    var SubmittoLenderMenu = element(by.id('submitlender'));
    var btnOK = element(by.buttonText('OK'));
    var puFRSubmit = element(by.css('.modal-content'));
    var puFRSubmitMsg = element(by.css('.modal-content')).all(by.css('.ng-star-inserted')).first();

    var navigateAwyPopup = element(by.tagName('app-modal-dialog'));
    var navigateAwyPopupMsg = element(by.tagName('app-modal-dialog')).element(by.css('.modal-body'));
    var navigateAwyStay = element(by.id('btnCancel'));
    var navigateAwyLeave = element(by.id('btnOk'));
    var DealHistoryMenu = element(by.id('history'));
    var btnCancel = element(by.buttonText('Cancel'));


    //var LLCFRCheckMark = element(by.xpath("//app-deal-milestones//div[@class=\'milestones-col ng-star-inserted\']/p[contains(text(),\'Final Report\')]//ancestor::div[6]"));
    //var LLCFRCheckMarkImg = LLCFRCheckMark.element(by.tagName('img'));
    var LLCFRCheckMark = element.all(by.css('.milestones-col.ng-star-inserted')).get(2);
    var LLCFRCheckMarkImg = element.all(by.css('.milestones-col.ng-star-inserted')).get(2).element(by.tagName('img'));

    var lblWCPClosingOption = element(by.tagName('app-bns-closing-option')).element(by.css('.radio-group')).all(by.tagName('div')).get(0);
    var radWCPClosingOptionY = element(by.tagName('app-bns-closing-option')).element(by.css('.radio-group')).all(by.tagName('div')).get(1);
    var radWCPClosingOptionN = element(by.tagName('app-bns-closing-option')).element(by.css('.radio-group')).all(by.tagName('div')).get(2);;

    var lblTDWCPClosingOption = element(by.tagName('app-td-closing-option')).element(by.css('.radio-group')).all(by.tagName('div')).get(0);
    var lblTDTitleClosingOption = element(by.tagName('app-td-closing-option')).element(by.css('.radio-group')).all(by.tagName('div')).get(1);
    var lblTDSolicitorClosingOption = element(by.tagName('app-td-closing-option')).element(by.css('.radio-group')).all(by.tagName('div')).get(2);

    //Leasehold fields
    var lblRegistrationParticulars = element(by.tagName('app-td-property')).all(by.tagName('app-panel')).all(by.tagName('div')).get(2);
    var valLeaseRegNo = element(by.css("input[formControlName=landLeaseRegistrationNumber]"));
    var valLeaseRegDate = element(by.css("input[formControlName=landLeaseRegistrationDate]"));
    var lblLeasehold = element(by.tagName('app-td-lease-hold')).all(by.tagName('app-panel')).all(by.tagName('div')).get(2);
    var lblLandlordDetails = element.all(by.tagName('app-panel-borderless')).get(2);
    var lblLandlordAddress = element.all(by.tagName('app-panel-borderless')).get(3);
    var lblLeaseDetails = element.all(by.tagName('app-panel-borderless')).get(4);
    var valName = element(by.css("input[formControlName=fullName]"));
    var valCompanyName = element(by.css("textarea[formControlName=landlordCompanyName]"));
    var valUnitNo = element(by.css("input[formControlName=unitNumber]"));
    var valStreetNumber = element(by.css("input[formControlName=streetNumber]"));
    var valStreetLine1 = element(by.css("input[formControlName=address1]"));
    var valStreetLine2 = element(by.css("input[formControlName=address2]"));
    var valCity = element(by.css("input[formControlName=city]"));
    var valProvince = element(by.css("select[formControlName=province]"));
    var valPostalCode = element(by.css("input[formControlName=postalCode]"));
    var valCountry = element(by.css("input[formControlName=country]"));
    var valTerm = element(by.css("input[formControlName=term]"));
    var valClause = element(by.css("textarea[formControlName=clause]"));
    var Env = RunSettings.data.Global.ENVIRONMENT.value;
    var Yes = element(by.id("yes"));
    var No = element(by.id("no"));

    
    
    var PortalValidationMsg = TestData.data[Lang].Messages.PortalValidationMsg;
   // var UnityValidationMsg = TestData.data[Lang].Messages.UnityValidationMsg;
  //  var PartnerSystemValidationMsg = TestData.data[Lang].Messages.PartnerSystemValidationMsg;
    var ValidationMsg = TestData.data[Lang].Messages[Env].ValidationMsg;

    var counter = 0;

    this.EnterFinalReportData = function () {
        CustomLibrary.WaitForSpinner();
        CustomLibrary.WaitNClick(chkConfirmClosingRF);
        CustomLibrary.WaitNClick(btnSubmit);
        var EC = protractor.ExpectedConditions;
        browser.wait(EC.visibilityOf(btnOkLayerSelection), 15000);
        btnOkLayerSelection.click();
        browser.sleep(2000);
    }

    this.SubmitOKClick = function (ProvinceName) {
        CustomLibrary.WaitNClick(btnOkLayerSelection);
    }
    
    this.checkRegistrationDetailEntries = function () {
        counter = 0;
        checkRegDetails();
    }

    var checkRegDetails = function () {
        MenuPanel.PrimaryMenuNavigateTo('FinalReport');
        var lblRegNo = pnlRegParticulars.get(0);
        lblRegNo.getText().then(function (txt) {
            if (txt.length > 0 || counter > 100) {
                return true;
            }
            else {
                MenuPanel.PrimaryMenuNavigateTo('RequestForFunds');
                console.log("Attempt to check Registration number details  : " + counter);
                counter++;
                checkRegDetails();
            }
        })
    }

    this.EnterRegistrationDetails = function () {
        var lblRegNo = pnlRegParticulars.get(2);
        var lblRegDate = pnlRegParticulars.get(4);
        lblRegNo.getText().then(function (txt) {
            console.log("Reg No : " + txt);
        })
        lblRegDate.getText().then(function (txt) {
            console.log("Reg Date : " + txt);
        })
        CustomLibrary.WaitforElementVisible(txtRegNo.get(0));
        txtRegNo.get(0).clear();
        txtRegNo.get(0).sendKeys(lblRegNo.getText());
        CustomLibrary.WaitforElementVisible(txtRegDate.get(0));
        txtRegDate.get(0).clear();
        txtRegDate.get(0).sendKeys(lblRegDate.getText());
        browser.sleep(5000);

    }
    this.FinalReportSave = function () {
        CustomLibrary.scrollIntoView(MMSbtnSave);
        MMSbtnSave.click();

    }
    this.FinalReportCreate = function () {
        CustomLib.WaitNClick(MMSbtnCreate);
        browser.sleep(10000);
    }

    this.FinalReportSubmit = function () {
        CustomLib.WaitNClick(btnFinalSubmit);
        var EC = protractor.ExpectedConditions;
        browser.wait(EC.visibilityOf(btnOkLayerSelection), 120000);
        CustomLib.WaitforElementVisible(btnOkLayerSelection);
        CustomLib.WaitNClick(btnOkLayerSelection);

    }

    this.VerifyallButtonStatusFinalReport = function (Status) {

        CustomLib.ScrollDown(0,100000);
        if (Status == 'Disabled') {
            expect(btnSave.isEnabled()).toBe(false, "Save Button Enabled");
            expect(btnCreate.isEnabled()).toBe(false, "Create Button Enabled");
            expect(btnSubmit.isEnabled()).toBe(false, "Submit Button Enabled");
        }
        if (Status == 'Enabled') {
            expect(btnSave.isEnabled()).toBe(true, "Save Button Enabled");
            expect(btnCreate.isEnabled()).toBe(true, "Create Button Enabled");
            expect(btnSubmit.isEnabled()).toBe(true, "Submit Button Enabled");
        }
        if (Status == 'PartiallyEnabled') {
            expect(btnSave.isEnabled()).toBe(true, "Save Button Enabled");
            expect(btnCreate.isEnabled()).toBe(true, "Create Button Enabled");
            expect(btnSubmit.isEnabled()).toBe(false, "Submit Button Enabled");
        }
    }

    this.VerifyClosedRequestMsg = function() {
        var StatusMsg = element(by.css('.msg-container.ng-star-inserted'));
        var ClosedRequestMessage = TestData.data[Lang].Messages.ClosedDealMsg;
        expect(StatusMsg.getText()).toContain(ClosedRequestMessage,'Closed deal message is not present.');
    }

    this.VerifySaveDataMsg = function(Msg) {
        var StatusMsg = element(by.css('.msg-container.ng-star-inserted'));
        expect(StatusMsg.getText()).toContain(Msg,'Save data message is not present.');
    }

    this.VerifyCancellationRequestMsg = function() {
        var StatusMsg = element(by.css('.msg-container.ng-star-inserted'));
        var CancellationRequestMessage = TestData.data[Lang].Messages.CancellationRequestMsg;
        expect(StatusMsg.getText()).toContain(CancellationRequestMessage,'Cancellation deal message is not present.');
    }

    this.VerifySubmitButtonStatusFinalReport = function (Status) {

        CustomLib.ScrollDown(0,100000);
        if (Status == 'Disabled') {
            expect(btnSubmit.isEnabled()).toBe(false, "Submit Button Enabled");
        }
        if (Status == 'Enabled') {
            expect(btnSubmit.isEnabled()).toBe(true, "Submit Button is disabled");
        }

    }

    this.VerifyallButtonStatus = function (Status) {
        //CustomLib.scrollIntoView(lblTitleInsLPD);
        CustomLib.ScrollDown(0,100000);
        if (Status == 'Disabled') {
            expect(btnSave.isEnabled()).toBe(false, "Save Button Enabled");
            expect(btnCreate.isEnabled()).toBe(false, "Create Button Enabled");
            expect(btnSubmit.isEnabled()).toBe(false, "Submit Button Enabled");
        }
        if (Status == 'Enabled') {
            expect(btnSave.isEnabled()).toBe(true, "Save Button Enabled");
            expect(btnCreate.isEnabled()).toBe(true, "Create Button Enabled");
            expect(btnSubmit.isEnabled()).toBe(true, "Submit Button Enabled");
        }
        if (Status == 'PartiallyEnabled') {
            expect(btnSave.isEnabled()).toBe(true, "Save Button Enabled");
            expect(btnCreate.isEnabled()).toBe(true, "Create Button Enabled");
            expect(btnSubmit.isEnabled()).toBe(false, "Submit Button Enabled");
        }
    }

    this.ClickFRButton = function (btn) {

        //CustomLib.scrollIntoView(lblTitleInsLPD); this element is not available for all scenarios
        switch (btn) {

            case 'btnSave':
                CustomLib.WaitNClick(btnSave);
                break;
            case 'btnCreate':
                CustomLib.WaitNClick(btnCreate);
                break;
            case 'btnSubmit':
                CustomLib.WaitNClick(btnSubmit);
                //browser.sleep(1000);
                break;

        }
    }
    this.SubmitIDVTypeBInfo = function (sourceID, Address, FiananceialAccDetails) {
        var tbSourceIDArray = element.all(by.css("input[formControlName=identificationSource]"))
        var tbAddressArray = element.all(by.css("input[formControlName=address]"));
        var cbAddressVerified = element(by.css("input[formControlName=addressVerified]"))
        var cbAccDetailsVerified = element(by.css("input[formControlName=financialAccountVerified]"))
        var tbFinancialAccDetails = element(by.css("input[formControlName=financialAccount]"))

        // Mortgagors 
        tbSourceIDArray.get(0).sendKeys(sourceID);
        tbAddressArray.get(0).sendKeys(Address);
        cbAddressVerified.click();
        tbSourceIDArray.get(1).sendKeys(FiananceialAccDetails);

        // Garuntors
        tbSourceIDArray.get(2).sendKeys(sourceID);
        tbSourceIDArray.get(3).sendKeys(sourceID);
        tbFinancialAccDetails.sendKeys(FiananceialAccDetails);
        cbAccDetailsVerified.click();
    }

    this.VerifyWarningMsgForIDV = function (Msg) {
        var until = protractor.ExpectedConditions;
        browser.wait(until.presenceOf(WarningMsgIDV), 35000, 'Element taking too long to appear in the DOM').then(() => {
            expect(WarningMsgIDV.isDisplayed()).toBe(true , 'IDV Warning message is not displayed!');
            WarningMsgIDV.getText().then(function(txt)
        {
            expect(txt).toContain(Msg,"IDV warning message is not present!");
        })
    
    }, (error) => {
        expect(false).toBe(true, "Warning Message is not displayed.");
    })
    }

    this.EnterSourceID = function (sourceID) {
        
        var tbSourceIDArray = element.all(by.css("input[formControlName=identificationSource]"))
        // Mortgagors 
        tbSourceIDArray.get(0).clear();
        tbSourceIDArray.get(0).sendKeys(sourceID);
                   
    }

    this.VerifyFRSubmitMsg = function (Msg) {

        var SubmitMsg = element(by.css('.msg-container.ng-star-inserted'));
        var until = protractor.ExpectedConditions;
        CustomLib.scrollIntoView(SubmitMsg);
        browser.wait(until.presenceOf(SubmitMsg), 35000, 'Element taking too long to appear in the DOM').then(() => {
        expect(SubmitMsg.getText()).toContain(Msg);

        })
    }

    this.VerifySubmitAlert = function () {
        var until = protractor.ExpectedConditions;
        var AlertMsg = element(by.css('.modal-content')).all(by.css('.col')).all(by.css('.ng-star-inserted')).get(0);
        browser.wait(until.presenceOf(AlertMsg), 35000, 'Element taking too long to appear in the DOM').then(() => {
            expect(AlertMsg.isDisplayed()).toBe(true, 'Alert message is not displayed!');
            AlertMsg.getText().then(function(txt)
        {
            expect(txt).toContain('The deal will be closed and appear in read-only state upon submission of the Final Report.');
        })
    
    }, (error) => {
        expect(false).toBe(true, "Final report warning Message is not displayed.");
    })
    }

    this.VerifyClosedDealMsg = function (Msg) {

        //var ClosedMsg = element(by.css('.msg-container.ng-star-inserted')).all(by.css('.d-flex.my-1.ng-star-inserted')).get(0);
        var ClosedMsg = element(by.css('.msg-container.ng-star-inserted'));
        var until = protractor.ExpectedConditions;
        CustomLib.scrollIntoView(ClosedMsg);
        browser.wait(until.presenceOf(ClosedMsg), 35000, 'Element taking too long to appear in the DOM').then(() => {
   
        expect(ClosedMsg.getText()).toContain(Msg);

        })
    }

    this.VerifyFRPage = function () {

        CustomLib.WaitforElementVisible(PortalFieldIdentifierTxt);
        // expect(PortalFieldIdentifierTxt.getText()).toBe(PortalFieldIdentifier);
        //expect(UnityFieldIdentifierTxt.getText()).toBe(UnityFieldIdentifier);

        expect(lnkNeedHelp.isDisplayed()).toBe(true);

        expect(lblFR.isDisplayed()).toBe(true);
        expect(lblFR.getText()).toBe('Final Report');

        CustomLib.scrollIntoView(btnSave);
        expect(btnSave.isDisplayed()).toBe(true);
        expect(btnCreate.isDisplayed()).toBe(true);
        expect(btnSubmit.isDisplayed()).toBe(true);

        expect(txtFooter.isDisplayed()).toBe(true);
        expect(txtFooter.getText()).toContain(Footer);

        expect(lnkLegal.isDisplayed()).toBe(true);
        expect(lnkLegal.getText()).toBe('Legal');

        expect(lnkPrivacy.isDisplayed()).toBe(true);
        expect(lnkPrivacy.getText()).toBe('Privacy Policy');
    }

    this.VerifyProperty = function () {

        CustomLib.scrollIntoView(lblProperty);
        expect(lblProperty.isDisplayed()).toBe(true);
        expect(lblProperty.getText()).toBe('Property');

        expect(lblPropertyAddress.isDisplayed()).toBe(true);
        expect(lblPropertyAddress.getText()).toContain('Property Address');
        //  console.log("Address is "+ LenderIntegrationBNS.ReturnPropertyAddress());
        expect(PropertyAddressVal.getText()).toBe(LenderIntegrationBNS.ReturnPropertyAddress());

        expect(lblPropertyDetails.getText()).toBe('Property Details');

        expect(lblPIN.isDisplayed()).toBe(true);
        expect(lblPIN.getText()).toContain('PIN');
        expect(PINVal.getText()).not.toBe(null);
        expect(lblMunicipality.getText()).toContain('Municipality');
        expect(MunicipalityVal.getText()).not.toBe(null);
        expect(lblCondominium.getText()).toContain('Condominium/Strata');
        expect(CondominiumVal.getText()).not.toBe(null);

        expect(lblLegalDesc.getText()).toContain('Legal Description');
        expect(LegalDescVal.getText()).not.toBe(null);
    }

    this.VerifyPropertybasedonProv = function (prov) {

        CustomLib.scrollIntoView(lblProperty);
        expect(lblProperty.isDisplayed()).toBe(true);
        expect(lblProperty.getText()).toBe('Property');

        expect(lblPropertyAddress.isDisplayed()).toBe(true);
        expect(lblPropertyAddress.getText()).toContain('Property Address');
        //  console.log("Address is "+ LenderIntegrationBNS.ReturnPropertyAddress());
        expect(PropertyAddressVal.getText()).toBe(LenderIntegrationBNS.ReturnPropertyAddress());
        expect(lblPropertyDetails.getText()).toBe('Property Details');
        expect(lblPIN.isDisplayed()).toBe(true);
        expect(PINVal.getText()).not.toBe(null);
        expect(lblMunicipality.getText()).toContain('Municipality');
        expect(MunicipalityVal.getText()).not.toBe(null);
        expect(lblCondominium.getText()).toContain('Condominium/Strata');
        expect(CondominiumVal.getText()).not.toBe(null);
        expect(lblLegalDesc.getText()).toContain('Legal Description');
        expect(LegalDescVal.getText()).not.toBe(null);
    }

    this.VerifyRegParticulars = function () {

        CustomLib.scrollIntoView(lblRegParticulars);
        expect(lblRegParticulars.isDisplayed()).toBe(true);
        expect(lblRegParticulars.getText()).toBe('Registration Particulars');

        expect(lblRegNumber.isDisplayed()).toBe(true);
        expect(lblRegNumber.getText()).toContain('Registration Number');
        expect(RegNumberVal.getText()).not.toBe(null);
        expect(lblRegDate.getText()).toContain('Registration Date');
        expect(RegDateVal.getText()).not.toBe(null);

        expect(lblRegOffice.isDisplayed()).toBe(true);
        expect(lblRegOffice.getText()).toContain('Registry Office/Land Title Office');
        expect(RegOfficeVal.getText()).not.toBe(null);
        expect(lblAssofRent.getText()).toBe('Assignment of Rents Registration Number');
        expect(tbAssofRent.isEnabled()).toBe(true);
    }

    this.SelectClosingViaCB = function (type) {

        var cb = element.all(by.name('closingOption'));
        if (type == 'Title') {
            CustomLib.WaitNClick(cb.get(0));
        }
        else {
            CustomLib.WaitNClick(cb.get(1));
        }
    }

    this.VerifyTitleInsuranceFieldsArePresent = function () {

        CustomLib.scrollIntoView(lblTitleIns);
        expect(lblTitleIns.isDisplayed()).toBe(true, 'Label title insurance is not displayed!');
        expect(lblTitleIns.getText()).toBe('Title Insurance - Lender Policy Details');

        expect(lblCompanyNameTD.isDisplayed()).toBe(true, 'Label Company Name is not displayed!');
        expect(lblCompanyNameTD.getText()).toContain('Company Name');

        expect(lblPolicyDateTD.isDisplayed()).toBe(true, 'Label Date of Policy is not displayed!');
        expect(lblPolicyDateTD.getText()).toContain('Date of Policy');
        
        expect(lblPolicyNumberTD.isDisplayed()).toBe(true, 'Label Policy Number is not displayed!');
        expect(lblPolicyNumberTD.getText()).toContain('Policy Number');

        expect(lblInsAmountTD.isDisplayed()).toBe(true, 'Label Amount of Insurance is not displayed!');
        expect(lblInsAmountTD.getText()).toContain('Amount of Insurance');

        expect(lblScheduleBExceptions.isDisplayed()).toBe(true);
        expect(lblScheduleBExceptions.getText()).toContain('Schedule B Exceptions');
      

      
    }

    
    this.SelectClosingViaCBwithWCP = function (type) {

        var cb = element.all(by.name('closingOption'));
        if (type == 'Title') {
            CustomLib.WaitNClick(cb.get(1));
        }
        else {
            CustomLib.WaitNClick(cb.get(2));

        }
    }

    this.SelectClosingViaCBAsWCP = function (type) {

        var cb = element.all(by.name('closingOption'));
        if (type == 'Western') {
            CustomLib.WaitNClick(cb.get(0));
        }

        else {
            CustomLib.WaitNClick(cb.get(1));
        }

        
    }

    this.SelectClosingTitle = function () {
        browser.sleep(20000);
        var cb = element.all(by.name('closingOption'));
        CustomLib.WaitforElementVisible(cb);
        var i = 0;

        //for (var i=0;i<cb.count();i++){
        cb.each(function (t) {
            console.log("*************************************************   ");

            // console.log( cb.get(i).getAttribute('value'));
            CustomLib.WaitNClick(cb.get(i));
            cb.get(i).getAttribute('value').then(function (txtx) {
                console.log(txtx)
            });
            i++;
        });

    }

    this.EnterTitleInsuranceScheduleBExceptions = function () {

        element(by.css("textarea[formControlName=scheduleBException]")).sendKeys(CustomLib.getRandomString(20));
    }
    this.VerifyRegParticularsValue = function (InstrumentNumber, RegistrationDate, RegistryOffice) {
        CustomLib.scrollIntoView(lblRegParticulars);
        CustomLibrary.WaitForContentToBePresent(RegNumberVal,InstrumentNumber);
        expect(RegNumberVal.getText()).toBe(InstrumentNumber, "Instrument Number");
        var formattedDate = CustomLib.DateConversion(RegistrationDate);
        RegDateVal.getText().then(function(txt)
        {
            expect(txt).toBe(formattedDate, "Registration Date");
        })

        CustomLibrary.WaitForContentToBePresent(RegOfficeVal,RegistryOffice);
        expect(RegOfficeVal.getText()).toBe(RegistryOffice,"Registration Office");
    }

    this.VerifyFireInsParticulars = function () {
        CustomLib.scrollIntoView(lblFireInsParticular);
        expect(lblFireInsParticular.isDisplayed()).toBe(true);
        expect(lblFireInsParticular.getText()).toBe('Fire Insurance Particulars');

        expect(lblCompanyName.isDisplayed()).toBe(true);
        expect(lblCompanyName.getText()).toContain('Company Name');
        expect(CompanyNameVal.getText()).not.toBe(null);
        expect(lblExpiryDate.getText()).toContain('Expiry Date');
        expect(ExpiryDateVal.getText()).not.toBe(null);

        expect(lblPolicyNumber.getText()).toContain('Policy Number');
        expect(PolicyNumberVal.getText()).not.toBe(null);
        expect(lblInsAmount.getText()).toContain('Insurance Amount');
        expect(InsAmountVal.getText()).not.toBe(null);

        expect(lblFireInsComAddress.isDisplayed()).toBe(true);
        expect(lblFireInsComAddress.getText()).toBe('Fire Insurance Company Address');

        expect(lblUnitNo.getText()).toContain('Unit No.');
        expect(UnitNoVal.getText()).not.toBe(null);
        expect(lblStreetNumber.getText()).toContain('Street Number');
        expect(StreetNumberVal.getText()).not.toBe(null);
        expect(lblStreetNameLine1.getText()).toContain('Street Name - Line 1');
        expect(StreetNameLine1Val.getText()).not.toBe(null);

        expect(lblStreetNameLine2.getText()).toContain('Street Name - Line 2');
        expect(StreetNameLine2Val.getText()).not.toBe(null);
        expect(lblCity.getText()).toContain('City');
        expect(CityVal.getText()).not.toBe(null);
        expect(lblProvince.getText()).toContain('Province');
        expect(ProvinceVal.getText()).not.toBe(null);

        expect(lblPostalCode.getText()).toContain('Postal Code');
        expect(PostalCodeVal.getText()).not.toBe(null);
        expect(lblCountry.getText()).toContain('Country');
        expect(CountryVal.getText()).not.toBe(null);
    }

    this.TitleInsLPD = function () {
        CustomLib.scrollIntoView(lblTitleInsLPD);
        expect(lblTitleInsLPD.isDisplayed()).toBe(true);
        expect(lblTitleInsLPD.getText()).toBe('Title Insurance - Lender Policy Details');

        expect(lblTICompanyName.isDisplayed()).toBe(true);
        expect(lblTICompanyName.getText()).toContain('Company Name');
        //expect(TICompanyNameVal.getText()).not.toBe(null);
        expect(lblTIPolicyNumber.getText()).toContain('Policy Number');
        //expect(TIPolicyNumberVal.getText()).not.toBe(null);

        expect(lblDateofPolicy.getText()).toContain('Date of Policy');
        //expect(DateofPolicyVal.getText()).not.toBe(null);
        expect(lblAmountofIns.getText()).toContain('Amount of Insurance');
        //expect(AmountofInsVal.getText()).not.toBe(null);
    }

    this.TitleInsLPDbasedOnProv = function (prov) {
        CustomLib.scrollIntoView(lblTitleInsLPD);
        expect(lblTitleInsLPD.isDisplayed()).toBe(true);
        if (prov == "ON" || prov == "AB") {
            expect(lblTitleInsLPD.getText()).toBe('Title Insurance - Lender Policy Details');
        }
        else {
            expect(lblTitleInsLPD.getText()).toBe('Lawyer/Notary Comments');
        }

        expect(lblTICompanyName.isDisplayed()).toBe(true);
        expect(lblTICompanyName.getText()).toContain('Company Name');
        expect(lblTIPolicyNumber.getText()).toContain('Policy Number');

        expect(lblDateofPolicy.getText()).toContain('Date of Policy');
        expect(lblAmountofIns.getText()).toContain('Amount of Insurance');

    }

    this.VerifyLawyerNotaryComm = function () {
        expect(lblLawyerNotaryCom.isDisplayed()).toBe(true);
        expect(lblLawyerNotaryCom.getText()).toBe('Lawyer/Notary Comments');

        //Label removed: Other (new amount, etc.)
        //expect(lblOther.isDisplayed()).toBe(true);
        //expect(lblOther.getText()).toBe('Other (new amount, etc.)');
        expect(lblCharCounter.isDisplayed()).toBe(true);
        expect(tbComment.isEnabled()).toBe(true);
    }
    this.VerifyLawyerNotaryCommwithProv = function (prov) {
        expect(lblLawyerNotaryCom.isDisplayed()).toBe(true);
        if (prov == "ON" || prov == "AB") {
            expect(lblLawyerNotaryCom.getText()).toBe('Lawyer/Notary Comments');
        }
        else {
            expect(lblLawyerNotaryCom.getText()).toBe('Title Insurance - Lender Policy Details');
        }
        expect(tbComment.isEnabled()).toBe(true);
    }

    this.VerifyDocLanguage = function () {
        expect(lblDocLanguage.isDisplayed()).toBe(true);
        expect(lblDocLanguage.getText()).toBe('Document Language');
        expect(lblEnglish.getText()).toBe('English');
        expect(lblFrench.getText()).toBe('French');
        expect(btnEnglish.isEnabled()).toBe(true);
        expect(btnFrench.isEnabled()).toBe(true);
    }

    this.EnterRegNumber = function (RegNumber) {
        CustomLib.scrollIntoView(lblRegParticulars);
        tbAssofRent.sendKeys(RegNumber);
    }

    this.CommentonFinalReport = function (Comment) {
        CustomLib.scrollIntoView(lblTitleInsLPD);
        expect(lblCharCounter.getText()).toBe('0/1000 characters');
        tbComment.sendKeys(Comment);

        var CommLength = Comment.length.toString();
        expect(lblCharCounter.getText()).toBe('' + CommLength + '/1000 characters');
    }
    this.CommentonFinalReportwithProv = function (Comment, prov) {
        CustomLib.scrollIntoView(lblTitleInsLPD);
        tbComment.sendKeys(Comment);
        // var CommLength = Comment.length.toString();        
    }

    this.SelectDocLanguage = function (Option) {        
        if (Option == 'English') {
            CustomLib.WaitNClick(btnEnglish);
            // btnEnglish.click();
            expect(btnEnglish.isSelected()).toBe(true,"Selected Document Language is English.");
        }
        if (Option == 'French') {
            CustomLib.WaitNClick(btnFrench);
            // btnFrench.click();
            expect(btnFrench.isSelected()).toBe(true,"Selected Document Language is French.");
        }
    }

    this.NavigateAway = function () {
        browser.sleep(1000);
        CustomLib.WaitNClick(DealHistoryMenu);
    }

    this.VerifyNavigateAway = function () {
        CustomLib.WaitforElementVisible(navigateAwyPopupMsg);
        expect(navigateAwyPopup.isDisplayed()).toBe(true);
        expect(navigateAwyPopupMsg.getText()).toBe(NavigateAwyPopupMsg);
        expect(navigateAwyStay.isDisplayed()).toBe(true);
        expect(navigateAwyLeave.isDisplayed()).toBe(true);

    }
    this.VerifyNoNavigateAwayPopUp = function () {
        expect(navigateAwyPopup.isPresent()).toBe(false);
        expect(navigateAwyStay.isPresent()).toBe(false);
        expect(navigateAwyLeave.isPresent()).toBe(false);
    }

    this.NavigateAwayAcceptReject = function (buttonSelect) {
        CustomLib.WaitForSpinnerInvisible();
        if (buttonSelect == 'Cancel') {
            CustomLib.WaitNClick(navigateAwyStay);
        }
        if (buttonSelect == 'OK') {
            CustomLib.WaitNClick(navigateAwyLeave);
        }
        CustomLib.WaitforElementInvisible(element(by.css('.modal-content')));
    }

    this.VerifyFRCheckmarkStatus = function (Status) {

        switch (Status) {

            case 'Not Started':
                expect(LLCFRCheckMark.getAttribute('title')).toBe(Status);
                expect(LLCFRCheckMarkImg.getAttribute('src')).toContain('not-started.png');
                break;
            case 'In Progress':
                expect(LLCFRCheckMark.getAttribute('title')).toBe(Status);
                expect(LLCFRCheckMarkImg.getAttribute('src')).toContain('in-progress.png');
                break;
            case 'Complete':
                browser.sleep(1000);
                expect(LLCFRCheckMarkImg.getAttribute('src')).toContain('accepted.png');
                LLCFRCheckMark.getAttribute('title').then(function (timeStamp) {

                    console.log("FR TimeStamp: ", timeStamp);
                    expect(timeStamp).not.toBe(null);
                    expect(timeStamp).not.toBe('Not Started');
                    expect(timeStamp).not.toBe('In Progress');
                    browser.actions().mouseMove(LLCFRCheckMark).perform();
                    browser.sleep(500);
                })
                break;
        }
    }

    /*this.IfElementClickable = function (elementFinder) {
 
        var EC = protractor.ExpectedConditions;
        try {
            browser.wait(EC.elementToBeClickable(elementFinder), 1000);
            return true;
        } catch (error) {
            return false;
        }
    }*/

    this.IfMenuClickable = function (elementFinder) {

        try {
            MenuPanel.VerifyMenuButtonStatus(elementFinder, 'Enabled');
            return true;
        } catch (error) {
            return false;
        }
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

    this.AcceptAmendmentIfAvailable = function () {
        element(by.id('submitlender')).getAttribute('class').then(function (attr) {

            if (attr.indexOf('disabled') == -1) {

                CustomLib.scrollIntoView(element(by.css('.msg-container.ng-star-inserted')).element(by.tagName('a')))
                CustomLib.WaitNClick(element(by.css('.msg-container.ng-star-inserted')).element(by.tagName('a')));
                var puSubmitMsg = element(by.css('.modal-content')).element(by.css('.ng-star-inserted'));
                CustomLib.WaitforElementVisible(puSubmitMsg);
                CustomLib.WaitNClick(btnOK);
            }
        })
    }

    this.VerifyMessage = function (Msg) {

        if (element(by.tagName('app-message-bar')).all(by.tagName('p')).count() > 1) {
            var SuccessMsg = element(by.tagName('app-message-bar')).all(by.tagName('p')).get(1);
        }
        else {
            var SuccessMsg = element(by.css('.msg-container.ng-star-inserted'));
        }

        CustomLib.scrollIntoView(SuccessMsg);
        browser.sleep(500);
        expect(SuccessMsg.getText()).toContain(Msg);
    }

    this.VerifyWCPAppearsSelectedAfterSave = function () {
        var cb = element.all(by.name('closingOption'));
        var WCP = cb.get(0);
                    
            expect(WCP.isSelected()).toBe(true, 'Radio button WCP is not selected');
       
    }

    this.VerifyWCPAppearsSelectedAfterCreate = function () {
        var cb = element.all(by.name('closingOption'));
        var WCP = cb.get(0);
                    
            expect(WCP.isSelected()).toBe(true, 'Radio button WCP is not selected');
       
    }

    this.SubmitFR = function () {

        CustomLib.scrollIntoView(lblFR);
        CustomLib.WaitforElementVisible(puFRSubmitMsg);
        expect(puFRSubmit.isDisplayed()).toBe(true);
        expect(puFRSubmitMsg.getText()).toBe(FRSubmitMsg);
        CustomLib.WaitNClick(btnOK);
    }

    this.VerifyInstrNoRegDate = function (RgDate, InstruNo) {
        var lblRegNo = pnlRegParticulars.get(0);
        var lblRegDate = pnlRegParticulars.get(2);

        expect(lblRegNo.getText()).toBe(InstruNo, "Final Report - Instrument Number");
        expect(lblRegDate.getText()).toContain(RgDate, "Final Report - Registration Date");
    }

    //Oct 24
    this.VerifyTitleLabel = function () {

        expect(lblPIN.getText()).toContain('Title Number', "Label Title Number not found");
        
    }

    this.VerifyTitleLabelTD = function () {

        expect(lblPINTD.getText()).toContain('Title Number', "Label Title Number not found");
        
    }

    this.VerifyPINLabelNotPresent = function () {

        expect(lblPIN.getText()).not.toBe('PIN', "Label PIN is not changed to Title Number");
        
    }

    this.VerifyPINLabelNotPresentTD = function () {

        expect(lblPINTD.getText()).not.toBe('PIN', "Label PIN is not changed to Title Number");
        
    }

  

    this.VerifyPIDLabel = function () {

        expect(lblPID.getText()).toContain('PID', "Label PID not found");
        
    }

    this.VerifyPIDLabelTD = function () {

        expect(lblPIDTD.getText()).toContain('PID', "Label PID not found");
        
    }

    this.VerifyWCPPresent = function () {
        expect(lblWCPClosingOption.isPresent()).toBeTruthy();
        expect(lblWCPClosingOption.getText()).toContain('Western Law Societies Conveyancing Protocol');
        expect(radWCPClosingOptionY.isPresent()).toBeTruthy();
        expect(radWCPClosingOptionN.isPresent()).toBeTruthy();
    }

    this.VerifyWCPPresentTD = function () {
        expect(lblTDWCPClosingOption.isPresent()).toBeTruthy();
        expect(lblTDWCPClosingOption.getText()).toContain('Western Law Societies Conveyancing Protocol');
        
    }

    this.VerifyTitleInsurancePresentTD = function () {
        expect(lblTDTitleClosingOption.isPresent()).toBeTruthy();
        expect(lblTDTitleClosingOption.getText()).toContain('Title Insurance');
        
    }

    this.VerifySolicitorPresentTD = function () {
        expect(lblTDSolicitorClosingOption.isPresent()).toBeTruthy();
        expect(lblTDSolicitorClosingOption.getText()).toContain('Solicitor');
        
    }

    this.VerifyWCPNotPresent = function () {
        expect(lblWCPClosingOption.isPresent()).toBe(false);
        expect(radWCPClosingOptionY.isPresent()).toBe(false);
        expect(radWCPClosingOptionN.isPresent()).toBe(false);
    }

    this.WCPMandatoryfieldValidation = function () {
        var Msg1 = element.all(by.css('.my-1.required-message-danger')).get(0);
        var Msg2 = element.all(by.css('.my-1.required-message-danger')).get(1);

        expect(Msg1.getText()).toContain(PortalValidationMsg, "Validation message is incorrect");
        expect(Msg2.getText()).toContain(ValidationMsg, "Validation message is incorrect");


    }

    this.VerifyWarningMessageFR = function (Msg) {
   
        var EC = protractor.ExpectedConditions;
        browser.wait(EC.visibilityOf(WarningMsg), 45000,  'Waiting for element to become visible').then(() => {
        
            expect(WarningMsg.isDisplayed()).toBe(true, 'Warning message is not displayed!');
            WarningMsg.getText().then(function(txt)
            {
                expect(txt).toContain(Msg);
            
            })
    
    }, (error) => {
        expect(false).toBe(true, "FR warning Message is not displayed.");
    }) 
    }

    this.WCPMandatoryFieldSelection = function (Option) {

        var radWCPFalse = element(by.id("radWCPFalse"))
        var radWCPTrue = element(by.id("radWCPTrue"))
        if (Option == 'No') {
            radWCPFalse.click();
            expect(radWCPFalse.isSelected()).toBe(true, "Radio button No is not selected");
        }
        if (Option == 'Yes') {
            radWCPTrue.click();
            expect(radWCPTrue.isSelected()).toBe(true, "Radio button Yes is not selected");
        }
    }

    this.VerifyOnlyOneRadioButtonSelected = function (Option) {

        var radWCPFalse = element(by.id("radWCPFalse"))
        var radWCPTrue = element(by.id("radWCPTrue"))
        if (Option == 'No') {
            
            expect(radWCPFalse.isSelected()).toBe(true, 'Radio button No is not selected');
            expect(radWCPTrue.isSelected()).toBe(false, 'Radio button Yes is selected');
        }
        if (Option == 'Yes') {
            
            expect(radWCPTrue.isSelected()).toBe(true, 'Radio button Yes is not selected');
            expect(radWCPFalse.isSelected()).toBe(false, 'Radio button No is selected');
        }
    }

    this.VerifyOnlyOneRadioButtonSelectedTD = function (Option) {

        var cb = element.all(by.name('closingOption'));
        var WCP = cb.get(0);
        var title = cb.get(1);
        
        if (Option == 'Western') {
            
            expect(WCP.isSelected()).toBe(true, 'Radio button WCP is not selected');
            expect(title.isSelected()).toBe(false, 'Radio button Title insurance is selected');
        }
        else {
            
            expect(title.isSelected()).toBe(true, 'Radio button Title insurance is not selected');
            expect(WCP.isSelected()).toBe(false, 'Radio button WCP is selected');
        }
    }

    this.VerifyTDWCPPresent = function () {
        expect(lblTDWCPClosingOption.isPresent()).toBeTruthy();
        expect(lblTDWCPClosingOption.getText()).toContain('Western Law Societies Conveyancing Protocol');
    }

    this.VerifyTDTitleSolicitorClosingPresent = function () {
        expect(lblTDTitleClosingOption.isPresent()).toBeTruthy();
        expect(lblTDTitleClosingOption.getText()).toContain('Title Insurance');
        expect(lblTDSolicitorClosingOption.isPresent()).toBeTruthy();
        expect(lblTDSolicitorClosingOption.getText()).toContain("Solicitor's Opinion");

    }

    this.VerifyTDWCPNotPresent = function () {
        expect(lblTDWCPClosingOption.getAttribute('value')).not.toContain('Western Law Societies Conveyancing Protocol ', 'WCP option is present!');
    }

    this.VerifyTDTitleSolicitorClosingPresentNoWCP = function () {
        var lblTDTitleClosingOptionnoWCP = element(by.tagName('app-td-closing-option')).element(by.css('.radio-group')).all(by.tagName('div')).get(0);
        var lblTDSolicitorClosingOptionnoWCP = element(by.tagName('app-td-closing-option')).element(by.css('.radio-group')).all(by.tagName('div')).get(1);
        expect(lblTDTitleClosingOptionnoWCP.isPresent()).toBeTruthy();
        expect(lblTDTitleClosingOptionnoWCP.getText()).toContain('Title Insurance');
        expect(lblTDSolicitorClosingOptionnoWCP.isPresent()).toBeTruthy();
        expect(lblTDSolicitorClosingOptionnoWCP.getText()).toContain("Solicitor's Opinion");

    }

    

    this.TDWCPSelection = function () {
        var cbWCP = element.all(by.name('closingOption')).get(0);
        CustomLibrary.WaitNClick(cbWCP);
    }
    this.TDTISelection = function () {
        var cbTI = element.all(by.name('closingOption')).get(1);
        CustomLibrary.WaitNClick(cbTI);
    }


    this.VerifyFinalReportIsCreated = function()
    {
        return element.all(by.xpath('//app-message-bar//p[contains(text(),\'Creation of the document\')]')).count().then(function (count) {
                expect(count).toBe(0,"Unable to create Final Report as document generation service is down.");
                if(count>0) 
                {
                    return false;
                }
                else
                {
                    return true;
                }
         });
    }

    this.TDVerifyLegalDescandPIN=function(){

        var lblLegalDesc = element(by.tagName('app-td-property')).all(by.css('.form-row')).get(4).element(by.tagName('label'));

        var LegalDescVal = element(by.tagName('app-td-property')).all(by.css('.form-row')).get(4).all(by.tagName('div')).first().element(by.tagName('div'));

        expect(lblLegalDesc.getText()).toContain('Legal Description');
        expect(LegalDescVal.getText()).toBe('');
    }

    this.TDVerifyLegalDescandPINwithdata = function () {

        var lblLegalDesc = element(by.tagName('app-td-property')).all(by.css('.form-row')).get(4).element(by.tagName('label'));

        var LegalDescVal = element(by.tagName('app-td-property')).all(by.css('.form-row')).get(4).all(by.tagName('div')).first().element(by.tagName('div'));

        expect(lblLegalDesc.getText()).toContain('Legal Description');
        expect(LegalDescVal.getText()).toBe('Description Heart of the City close to Mall/Sub/Bus/TTC etc. All aminities included');
    }

    this.TDVerifyPIN = function (expectingval,prov) {
        var pintxt="";

        switch (prov) {
            case 'ON':
                pintxt="PIN"
                break;
            case 'AB':
                pintxt="Title Number"
                break;
            case 'MB':
                pintxt="Title Number"
                break;
            case 'NB':
                pintxt="PID"
                break;

        }
        var lblPin = element(by.tagName('app-td-property')).all(by.css('.form-row')).get(2).element(by.tagName('label'));

        var PinVal = element(by.tagName('app-td-property')).all(by.css('.form-row')).get(2).all(by.tagName('div')).first().element(by.tagName('div'));

        expect(lblPin.getText()).toContain(pintxt);
        if(expectingval){
            var PinVal = element(by.tagName('app-td-property')).all(by.css('.form-row')).get(2).all(by.tagName('div')).first().element(by.tagName('div'));
            expect(PinVal.getText()).not.toBe('');

        }
        else{
            expect(PinVal.getText()).toBe('');

        }
    }

    this.VerifyFRValidationMsg = function () {

        CustomLib.ScrollDown(0,10000);
        CustomLib.WaitNClick(btnCreate);
        CustomLib.WaitForSpinnerInvisible();
        browser.sleep(3000);
        CustomLib.ScrollUp(10000,0);
        
        //expect(FinalReportReqFieldMsg.isPresent()).toBe(true, 'Field(s) to be completed below');
        expect(FinalReportReqFieldMsg.isPresent()).toBe(true, 'Required field validation message is not present');
        expect(FinalReportReqFieldMsg.getText()).toContain(PortalValidationMsg);
        
        //expect(FinalReportUnityFieldMsg.isPresent()).toBe(true, 'Field(s) to be completed in Unity');
        expect(FinalReportUnityFieldMsg.isPresent()).toBe(true, 'Unity field validation message is not present');
        expect(FinalReportUnityFieldMsg.getText()).toContain(ValidationMsg);
        browser.sleep(500);
    
    }

    this.VerifyFRValidationMsgTD = function () {

        CustomLib.ScrollDown(0,10000);
        CustomLib.WaitNClick(btnCreate);
        CustomLib.WaitForSpinnerInvisible();
        browser.sleep(1000);
        CustomLib.ScrollUp(10000,0);
    
        expect(FinalReportFieldMsg1.isPresent()).toBe(true, 'Required field validation message is not present');
        expect(FinalReportFieldMsg1.getText()).toContain(PortalValidationMsg);
        
        expect(FinalReportFieldMsg2.isPresent()).toBe(true, 'Unity field validation message is not present');
        expect(FinalReportFieldMsg2.getText()).toContain(ValidationMsg);
        //browser.sleep(500);
    
    }

    this.VerifySubmitButtonStatus = function (Status) {
        CustomLib.ScrollDown(0,10000);
        if (Status == 'Disabled') {
            expect(btnSubmit.isEnabled()).toBe(false, "Expected Submit Button to be - disbled. But Submit Button is - enabled");
        }
        if (Status == 'Enabled') {
            expect(btnSubmit.isEnabled()).toBe(true, "Expected Submit Button to be - enabled. But Submit Button is - disbled");
        }
    }

    this.ClickFRButtons = function (button) {
        CustomLib.WaitForSpinnerInvisible();
            
        switch (button) {
    
            case 'Save':
                CustomLib.WaitNClick(btnSave);
                //btnSave.click();
                break;
            case 'Submit':
                CustomLib.WaitNClick(btnSubmit);
                //btnSubmit.click();
                break;
            case 'Cancel':
                CustomLib.WaitNClick(btnCancel);
                //btnCancel.click();
                break;
            case 'Create':
                CustomLib.WaitNClick(btnCreate);
                //btnCreate.click();
                break;
            case 'OK':
                CustomLib.WaitNClick(btnOKafterSubmit);
                //btnOKafterSubmit.click();
                break;
    
        }
    
        browser.sleep(4000);
    }
    
    this.VerifyWarningMessageOld = function (messageToVerify) {
        var until = protractor.ExpectedConditions;
        browser.wait(until.presenceOf(WarningMsg), 255000, 'Element taking too long to appear in the DOM').then(() => {
            expect(WarningMsg.isDisplayed()).toBe(true,"Warning message is displayed");
            browser.sleep(1500);
                WarningMsg.getText().then(function(txt)
                    {       if(txt.includes(messageToVerify)) {
                         console.log(txt);
            return true;
                     }
    
        else{
            console.log("Warning message is not displayed!");
        }
        })
    
    }, (error) => {
        expect(false).toBe(true, "FR Warning Message is not displayed.");
    })
    }

    this.VerifyWarningMessage = function () {
        var until = protractor.ExpectedConditions;
        browser.wait(until.presenceOf(WarningMsg), 35000, 'Element taking too long to appear in the DOM').then(() => {
            expect(WarningMsg.isDisplayed()).toBe(true);
            WarningMsg.getText().then(function(txt)
        {
            expect(txt).toContain("The Solicitor's Report on Title has already been created.");
        })
    
    }, (error) => {
        expect(false).toBe(true, "FR warning Message is not displayed.");
    })
    }
   
    this.VerifyFRCheckmarkPostSubmission = function () {
        CustomLibrary.ScrollUp(0,10000);
        expect(LLCFRCheckMark.getAttribute('title')).not.toBe('Not Started');
        expect(LLCFRCheckMarkImg.getAttribute('src')).toContain('accepted.png');
        LLCFRCheckMark.getAttribute('title').then(function (timeStamp) {
    
            console.log("FR TimeStamp: ", timeStamp);
            expect(timeStamp).not.toBe(null,"FR not submitted");
            browser.actions().mouseMove(LLCFRCheckMark).perform();
            browser.sleep(500);
        })
    }

    this.ClickConfirmClosingCheckbox = function () {
        CustomLib.WaitNClick(chkConfirmClosing);
       
    }

    this.SubmitLeaseInfo = function (Name, CompanyName, UnitNo, StreetNumber, StreetLine1, StreetLine2, City, Provincetype, PostalCode, Country, Term, Clause, Option)  {
        
        var Prov = valProvince.element(by.cssContainingText('option', Provincetype));
        var until = protractor.ExpectedConditions;
        var Option;

        CustomLibrary.scrollIntoView(lblLandlordDetails);
        // Landlord Details
        valName.sendKeys(Name);
        valCompanyName.sendKeys(CompanyName);

        // Landlord Address
        valUnitNo.sendKeys(UnitNo);
        valStreetNumber.sendKeys(StreetNumber);
        valStreetLine1.sendKeys(StreetLine1);
        valStreetLine2.sendKeys(StreetLine2);
        valCity.sendKeys(City);

        browser.wait(until.presenceOf(Prov), 45000, 'Element taking too long to appear in the DOM').then(() => {
        Prov.click();
        }, (error) => {
        expect(Prov.isPresent()).toBe(true, Provincetype + "Province is not present.")
        })
        valPostalCode.sendKeys(PostalCode);
        valCountry.sendKeys(Country);

        // Lease Details
        valTerm.sendKeys(Term);
        valClause.sendKeys(Clause);
       
        //Notice provided to mortgagor options
        if (Option == 'Yes') {
            CustomLib.WaitNClick(Yes);
            expect(Yes.isSelected()).toBe(true,"Selected Notice provided option is Yes.");
        }
        if (Option == 'No') {
            CustomLib.WaitNClick(No);
            expect(No.isSelected()).toBe(true,"Selected Notice provided option is No.");
        }
    }

    this.VerifyLeasehold = function () {

        CustomLib.scrollIntoView(lblLeasehold);
        expect(lblLeasehold.isDisplayed()).toBe(true, 'Label Lease hold is displayed');
        expect(lblLeasehold.getText()).toBe('Leasehold');

        expect(lblLandlordDetails.isDisplayed()).toBe(true, 'Label Landlord Details is displayed');
        expect(lblLandlordDetails.getText()).toContain('Landlord Details');
        
        expect(lblLandlordAddress.isDisplayed()).toBe(true, 'Label Landlord Address is displayed');
        expect(lblLandlordAddress.getText()).toContain('Landlord Address');

        expect(lblLeaseDetails.isDisplayed()).toBe(true, 'LabelLease Details is displayed');
        expect(lblLeaseDetails.getText()).toContain('Lease Details');

    }

    this.RegistrationParticulars = function() {
        var RegDate = CustomLibrary.CurrentOrPastDate();
        var RegNo = CustomLibrary.getRandomNumber(4);

        CustomLibrary.scrollIntoView(lblRegistrationParticulars);
        valLeaseRegNo.sendKeys(RegNo);
        valLeaseRegDate.sendKeys(RegDate);

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

};

module.exports = new FinalReport();