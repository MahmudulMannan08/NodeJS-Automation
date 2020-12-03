'use strict';

var Runsettings = require('../../../../testData/RunSetting.js');
var CustLib = require('../../../../CustomLibrary/CustomLibrary.js');
var TDData = require('../../../../testData/TD/TDData.js');
var fs = require('fs');
var resolve = require('path').resolve;
var soap = require('soap');
var childprocess = require("child_process");
var fctURNTD = null;
var LenderRefNoTD = null;
var ResponseFCTURN = null;
var LenderRefNo = null;
var xml2js = require('xml2js');
var Env = Runsettings.data.Global.ENVIRONMENT.value;
var LangTD = TDData.data.LANGUAGE.value;
var CounterMax = 20;
var Counter = 0;
var GetLawyerDealEventsResponse = null;
var NumberOfMessages = null;
var q = require('q');
var defered = q.defer();
var LawyerIDNo = Runsettings.data.Global.URL_LLCEmulator[Env].LawyerIDNo.value;
var TDWebServiceurl = Runsettings.data.Global.TD[Env].EndPoint;



var LenderIntegrationTD = function () {

    this.CreateTDDealthroughCode = function (PropertyProvince) {

        //Document Package ID based on Province: ON - 530116, NB - 530278, MB - 530206, AB - 530152, SK - 530188, BC - 530134
        var pathBatFile = resolve('..\\Services\\TD\\BatchFiles\\TDDeal_Create.bat');
        var pathSoapUI = resolve('..\\Services\\TD\\SoapProject\\LenderIntegrationTD.xml');
        var keystoreCertificate = resolve('..\\Services\\TD\\TDCertificates\\' + Runsettings.data.Global.keystoreCertificate.value);
        var keystorePassword = Runsettings.data.Global.keystorePassword.value;
        var pathFctURN = resolve('..\\Services\\TD\\ResponseXMLs\\CreateDealResponse.xml');
        var EndPoint = Runsettings.data.Global.TD[Env].EndPoint
        var LawyerID = Runsettings.data.Global.URL_LLCEmulator[Env].LawyerIDNo.value;
        var dealClosed = CustLib.CurrentOrFutureDate();
        //var dealClosed = CustLib.FutureDatenew(2);
        switch (PropertyProvince) {
            case 'ON':
                var DocumentType = "530116";
                break;
            case 'NB':
                var DocumentType = "530278";
                break;
            case 'MB':
                var DocumentType = "530206";
                break;
            case 'AB':
                var DocumentType = "530152";
                break;
            case 'SK':
                var DocumentType = "530188";
                break;
            case 'BC':
                var DocumentType = "530134";
                break;   
        }
        var batchFileArguments = [pathSoapUI, keystoreCertificate, keystorePassword, pathFctURN, EndPoint, LawyerID, dealClosed, DocumentType, PropertyProvince, Runsettings.data.Global.SoapPath.value];
        const child = childprocess.execFileSync(pathBatFile, batchFileArguments);
        if (child.err) {
            console.log("Create BNS Deal Error occured ");
        }
        var xml2js = require('xml2js');
        var parser = new xml2js.Parser();
        fs.readFile(pathFctURN, 'utf-8', function (err, data) {
            if (err) {
                expect(true).toBe(false, "Error occured while creating TD Deal");
            }
            else {
                parser.parseString(data, function (err, result) {
                    if (err) {
                        expect(true).toBe(false, "Error occured while converting to JSON");
                    }
                    else {
                        try{
                            fctURNTD = result['s:Envelope']['s:Body'][0]['LenderResponse'][0]['FCTURN'][0]['_'];
                            LenderRefNoTD = result['s:Envelope']['s:Body'][0]['LenderResponse'][0]['LenderReferenceNumber'][0]['_'];
                        }
                        catch(Exception)
                        {
                            expect(true).toBe(false, "CreateTDDeal service failed!!!");
                        }  
                        expect(fctURNTD).not.toBe(null, "CreateTDDeal service failed!!!");
                    }
                });
            }
        });
        return fctURNTD;
    }

    this.CreateTDDealthroughCode_NewProv = function (PropertyProvince) {

        //Document Package ID based on Province: ON - 530116, NB - 530278, SK - 530188, BC - 530134
        var pathBatFile = resolve('..\\Services\\TD\\BatchFiles\\TDDeal_Create.bat');
        var pathSoapUI = resolve('..\\Services\\TD\\SoapProject\\LenderIntegrationTD.xml');
        var keystoreCertificate = resolve('..\\Services\\TD\\TDCertificates\\' + Runsettings.data.Global.keystoreCertificate.value);
        var keystorePassword = Runsettings.data.Global.keystorePassword.value;
        var pathFctURN = resolve('..\\Services\\TD\\ResponseXMLs\\CreateDealResponse.xml');
        var EndPoint = Runsettings.data.Global.TD[Env].EndPoint
        var LawyerID = Runsettings.data.Global.URL_LLCEmulator[Env].LawyerIDNo.value;
        var dealClosed = CustLib.CurrentOrFutureDate();
        //var dealClosed = CustLib.FutureDatenew(2);
        switch (PropertyProvince) {
            case 'ON':
                var DocumentType = "530116";
                break;
            case 'NB':
                var DocumentType = "530278";
                break;
            case 'SK':
                var DocumentType = "530188";
                break;
            case 'BC':
                var DocumentType = "530134";
                break;
        }
        var batchFileArguments = [pathSoapUI, keystoreCertificate, keystorePassword, pathFctURN, EndPoint, LawyerID, dealClosed, DocumentType, PropertyProvince, Runsettings.data.Global.SoapPath.value];
        const child = childprocess.execFileSync(pathBatFile, batchFileArguments);
        if (child.err) {
            console.log("Create BNS Deal Error occured ");
        }
        var xml2js = require('xml2js');
        var parser = new xml2js.Parser();
        fs.readFile(pathFctURN, 'utf-8', function (err, data) {
            if (err) {
                expect(true).toBe(false, "Error occured while creating TD Deal");
            }
            else {
                parser.parseString(data, function (err, result) {
                    if (err) {
                        expect(true).toBe(false, "Error occured while converting to JSON");
                    }
                    else {
                        try{
                            fctURNTD = result['s:Envelope']['s:Body'][0]['LenderResponse'][0]['FCTURN'][0]['_'];
                            LenderRefNoTD = result['s:Envelope']['s:Body'][0]['LenderResponse'][0]['LenderReferenceNumber'][0]['_'];
                        }
                        catch(Exception)
                        {
                            expect(true).toBe(false, "CreateTDDeal service failed!!!");
                        }  
                        expect(fctURNTD).not.toBe(null, "CreateTDDeal service failed!!!");
                    }
                });
            }
        });
        return fctURNTD;
    }
    
    this.CreateTDDealthroughCodeNoLegalDesc = function (PropertyProvince) {

        //Document Package ID based on Province: ON - 530116, NB - 530278, MB - 530206, AB - 530152
        var pathBatFile = resolve('..\\Services\\TD\\BatchFiles\\TDDeal_CreateNoLegalDesc.bat');
        var pathSoapUI = resolve('..\\Services\\TD\\SoapProject\\LenderIntegrationTD.xml');
        var keystoreCertificate = resolve('..\\Services\\TD\\TDCertificates\\' + Runsettings.data.Global.keystoreCertificate.value);
        var keystorePassword = Runsettings.data.Global.keystorePassword.value;
        var pathFctURN = resolve('..\\Services\\TD\\ResponseXMLs\\CreateDealResponse.xml');
        var EndPoint = Runsettings.data.Global.TD[Env].EndPoint
        var LawyerID = Runsettings.data.Global.URL_LLCEmulator[Env].LawyerIDNo.value;
        var dealClosed = CustLib.CurrentOrFutureDate();
        switch (PropertyProvince) {
            case 'ON':
                var DocumentType = "530116";
                break;
            case 'NB':
                var DocumentType = "530278";
                break;
            case 'MB':
                var DocumentType = "530206";
                break;
            case 'AB':
                var DocumentType = "530152";
                break;
            case 'SK':
                var DocumentType = "530188";
                break;
            case 'BC':
                var DocumentType = "530134";
                break;
        }
        var batchFileArguments = [pathSoapUI, keystoreCertificate, keystorePassword, pathFctURN, EndPoint, LawyerID, dealClosed, DocumentType, PropertyProvince, Runsettings.data.Global.SoapPath.value];
        const child = childprocess.execFileSync(pathBatFile, batchFileArguments);
        if (child.err) {
            console.log("Create BNS Deal Error occured ");
        }
        var xml2js = require('xml2js');
        var parser = new xml2js.Parser();
        fs.readFile(pathFctURN, 'utf-8', function (err, data) {
            if (err) {
                expect(true).toBe(false, "Error occured while creating TD Deal");
            }
            else {
                parser.parseString(data, function (err, result) {
                    if (err) {
                        expect(true).toBe(false, "Error occured while converting to JSON");
                    }
                    else {
                        try{
                            fctURNTD = result['s:Envelope']['s:Body'][0]['LenderResponse'][0]['FCTURN'][0]['_'];
                            LenderRefNoTD = result['s:Envelope']['s:Body'][0]['LenderResponse'][0]['LenderReferenceNumber'][0]['_'];
                        }
                        catch(Exception)
                        {
                            expect(true).toBe(false, "CreateTDDeal service failed!!!");
                        }  
                        expect(fctURNTD).not.toBe(null, "CreateTDDeal service failed!!!");
                    }
                });
            }
        });
        return fctURNTD;
    }

    this.CreateTDDealthroughCodeNoPin = function (PropertyProvince) {

        //Document Package ID based on Province: ON - 530116, NB - 530278, MB - 530206, AB - 530152
        var pathBatFile = resolve('..\\Services\\TD\\BatchFiles\\TDDeal_CreateNoPin.bat');
        var pathSoapUI = resolve('..\\Services\\TD\\SoapProject\\LenderIntegrationTD.xml');
        var keystoreCertificate = resolve('..\\Services\\TD\\TDCertificates\\' + Runsettings.data.Global.keystoreCertificate.value);
        var keystorePassword = Runsettings.data.Global.keystorePassword.value;
        var pathFctURN = resolve('..\\Services\\TD\\ResponseXMLs\\CreateDealResponse.xml');
        var EndPoint = Runsettings.data.Global.TD[Env].EndPoint
        var LawyerID = Runsettings.data.Global.URL_LLCEmulator[Env].LawyerIDNo.value;
        var dealClosed = CustLib.CurrentOrFutureDate();
        switch (PropertyProvince) {
            case 'ON':
                var DocumentType = "530116";
                break;
            case 'NB':
                var DocumentType = "530278";
                break;
            case 'MB':
                var DocumentType = "530206";
                break;
            case 'AB':
                var DocumentType = "530152";
                break;
            case 'SK':
                var DocumentType = "530188";
                break;
            case 'BC':
                var DocumentType = "530134";
                break;
        }
        var batchFileArguments = [pathSoapUI, keystoreCertificate, keystorePassword, pathFctURN, EndPoint, LawyerID, dealClosed, DocumentType, PropertyProvince, Runsettings.data.Global.SoapPath.value];
        const child = childprocess.execFileSync(pathBatFile, batchFileArguments);
        if (child.err) {
            console.log("Create BNS Deal Error occured ");
        }
        var xml2js = require('xml2js');
        var parser = new xml2js.Parser();
        fs.readFile(pathFctURN, 'utf-8', function (err, data) {
            if (err) {
                expect(true).toBe(false, "Error occured while creating TD Deal");
            }
            else {
                parser.parseString(data, function (err, result) {
                    if (err) {
                        expect(true).toBe(false, "Error occured while converting to JSON");
                    }
                    else {
                        try{
                            fctURNTD = result['s:Envelope']['s:Body'][0]['LenderResponse'][0]['FCTURN'][0]['_'];
                            LenderRefNoTD = result['s:Envelope']['s:Body'][0]['LenderResponse'][0]['LenderReferenceNumber'][0]['_'];
                        }
                        catch(Exception)
                        {
                            expect(true).toBe(false, "CreateTDDeal service failed!!!");
                        }  
                        expect(fctURNTD).not.toBe(null, "CreateTDDeal service failed!!!");
                    }
                });
            }
        });
        return fctURNTD;
    }

    this.ReturnDealStatus = function (EventTypeVal) {
        var MessageNo = this.ParseGetLawyerDealEventsResponse(EventTypeVal);
        var DealStatus = GetLawyerDealEventsResponse['s:Envelope']['s:Body'][0]['GetLawyerDealEventsResponse'][0]['Messages'][0]['Message'][MessageNo]['DealStatus'];
        DealStatus = DealStatus.toString().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
        return DealStatus;
    }

    this.ReturnWCPValue = function (EventTypeVal) {
        var MessageNo = this.ParseGetLawyerDealEventsResponse(EventTypeVal);
        var WCPVal = GetLawyerDealEventsResponse['s:Envelope']['s:Body'][0]['GetLawyerDealEventsResponse'][0]['Messages'][0]['Message'][MessageNo]['EventData'][0]['SubmitSROT'][0]['FinalReportClosingOption'];
        WCPVal = WCPVal.toString().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
        return WCPVal;
    }

    
    this.ReturnfctURNTD = function () {
        return fctURNTD;
    }

    this.ReturnLenderRefNoTD = function () {
        return LenderRefNoTD;
    }

    this.CancelTDDeal = function (urn, lenderRefNo) {
        var pathBatFile = resolve('..\\Services\\TD\\BatchFiles\\TDDeal_ChangeStatus.bat');
        var pathSoapUI = resolve('..\\Services\\TD\\SoapProject\\LenderIntegrationTD.xml');
        var EndPoint = Runsettings.data.Global.TD[Env].EndPoint
       var ReponsePath = resolve('..\\Services\\TD\\ResponseXMLs');
        var ResponseXMLPath = resolve('..\\Services\\TD\\ResponseXMLs\\SendDealStatusChangeResponse.xml');
        var keystoreCertificate = resolve('..\\Services\\TD\\TDCertificates\\' + Runsettings.data.Global.keystoreCertificate.value);
        var keystorePassword = Runsettings.data.Global.keystorePassword.value;
        //"CANCEL", "REINSTATE" and "CLOSE"
        var batchFileArguments = [pathSoapUI,keystoreCertificate, keystorePassword, urn, lenderRefNo, EndPoint, "CANCEL", ReponsePath,"CANCELLED", Runsettings.data.Global.SoapPath.value];
        var DealStatus;
        const child = childprocess.execFileSync(pathBatFile, batchFileArguments);
        if (child.err) {
            console.log("Error occured while Cancelling TD Deal");
        }
        var xml2js = require('xml2js');
        var parser = new xml2js.Parser();
       fs.readFile(ResponseXMLPath, 'utf-8', function (err, data) {
            if (err) {
                expect(true).toBe(false, "Error occured while Cancelling TD Deal");
            }
            else {
                parser.parseString(data, function (err, result) {
                    if (err) {
                        expect(true).toBe(false, "Error occured while converting to JSON");
                    }
                    else {
                        DealStatus = result['s:Envelope']['s:Body'][0]['LenderResponse'][0]['RequestType'][0]['_'];
                        expect(DealStatus).toContain('DEALSTATUSCHANGE', "Deal Status Changed to Cancelled");
                    }
                });
            }
        });
    }

    this.UpdateTDDeal = function (fctUrn, lenderRefNo, closingDate, MortInterestRate, PropertyProvince) {

        // chnages from lender side
        if (closingDate == null) { closingDate = "2019-11-29" }
        if (MortInterestRate == null) { MortInterestRate = "3" }

        var DocumentType;
        var pathBatFile = resolve('..\\Services\\TD\\BatchFiles\\TDDeal_Update.bat');
        var keystoreCertificate = resolve('..\\Services\\TD\\TDCertificates\\' + Runsettings.data.Global.keystoreCertificate.value);
        var keystorePassword = Runsettings.data.Global.keystorePassword.value;
        var pathSoapUI = resolve('..\\Services\\TD\\SoapProject\\LenderIntegrationTD.xml');
        var EndPoint = Runsettings.data.Global.TD[Env].EndPoint
        var pathResponseFile = resolve('..\\Services\\TD\\ResponseXMLs\\ResponseDealData.xml');
        var LawyerID = Runsettings.data.Global.URL_LLCEmulator[Env].LawyerIDNo.value;

        switch (PropertyProvince) {
            case 'ON':
                DocumentType = "530116";
                break;
            case 'NB':
                DocumentType = "530278";
                break;
            case 'MB':
                DocumentType = "530206";
                break;
            case 'AB':
                DocumentType = "530152";
                break;
            case 'SK':
                DocumentType = "530188";
                break;
            case 'BC':
                DocumentType = "530134";
                break;

        }

        var batchFileArguments = [pathSoapUI,keystoreCertificate, keystorePassword, pathResponseFile, EndPoint, LawyerID, fctUrn, lenderRefNo, closingDate, MortInterestRate, DocumentType, PropertyProvince, Runsettings.data.Global.SoapPath.value];
        const child = childprocess.execFileSync(pathBatFile, batchFileArguments);
        if (child.err) {
            console.log("Error occured ");
        }
    }

    //Dealstatus can be "CANCEL", "REINSTATE" and "CLOSE"
    this.ChangeTDDealStatus = function (urn, lenderRefNo, dealStatus) {

        //  var pathBatFile = resolve('..\\Services\\TDDeal_Cancel.bat');
        var pathBatFile = resolve('..\\Services\\TD\\BatchFiles\\TDDeal_ChangeStatus.bat');
        var pathSoapUI = resolve('..\\Services\\TD\\SoapProject\\LenderIntegrationTD.xml');
        var EndPoint = Runsettings.data.Global.TD[Env].EndPoint
       // var pathResponseFile = resolve('..\\Services\\TD\\ResponseXMLs\\SendDealStatusChange.xml');
       var pathResponseFile = resolve('..\\Services\\TD\\ResponseXMLs');
       var keystoreCertificate = resolve('..\\Services\\TD\\TDCertificates\\' + Runsettings.data.Global.keystoreCertificate.value);
       var keystorePassword = Runsettings.data.Global.keystorePassword.value;
       var ResponseXMLPath = resolve('..\\Services\\TD\\ResponseXMLs\\SendDealStatusChangeResponse.xml');
        var batchFileArguments = [pathSoapUI,keystoreCertificate, keystorePassword, urn, lenderRefNo, EndPoint, dealStatus, pathResponseFile,"CANCELLED", Runsettings.data.Global.SoapPath.value];
        const child = childprocess.execFileSync(pathBatFile, batchFileArguments);
        if (child.err) {
            console.log("Error occured ");
        }
        var xml2js = require('xml2js');
        var parser = new xml2js.Parser();
        var DealStatus;
       fs.readFile(ResponseXMLPath, 'utf-8', function (err, data) {
            if (err) {
                expect(true).toBe(false, "Error occured while Cancelling TD Deal");
            }
            else {
                parser.parseString(data, function (err, result) {
                    if (err) {
                        expect(true).toBe(false, "Error occured while converting to JSON");
                    }
                    else {
                        DealStatus = result['s:Envelope']['s:Body'][0]['LenderResponse'][0]['RequestType'][0]['_'];
                        expect(DealStatus).toContain('DEALSTATUSCHANGE', "Deal Status Changed to Cancelled");
                    }
                });
            }
        });
    }

  //Dealstatus can be "CANCEL", "REINSTATE" and "CLOSE"
  this.ChangeTDDealStatus = function (urn, lenderRefNo, dealStatus, reason) {

    //  var pathBatFile = resolve('..\\Services\\TDDeal_Cancel.bat');
    var pathBatFile = resolve('..\\Services\\TD\\BatchFiles\\TDDeal_ChangeStatus.bat');
    var pathSoapUI = resolve('..\\Services\\TD\\SoapProject\\LenderIntegrationTD.xml');
    var EndPoint = Runsettings.data.Global.TD[Env].EndPoint
   // var pathResponseFile = resolve('..\\Services\\TD\\ResponseXMLs\\SendDealStatusChange.xml');
   var pathResponseFile = resolve('..\\Services\\TD\\ResponseXMLs');
   var keystoreCertificate = resolve('..\\Services\\TD\\TDCertificates\\' + Runsettings.data.Global.keystoreCertificate.value);
   var keystorePassword = Runsettings.data.Global.keystorePassword.value;
   var ResponseXMLPath = resolve('..\\Services\\TD\\ResponseXMLs\\SendDealStatusChangeResponse.xml');
    var batchFileArguments = [pathSoapUI,keystoreCertificate, keystorePassword, urn, lenderRefNo, EndPoint, dealStatus, pathResponseFile,reason, Runsettings.data.Global.SoapPath.value];
    const child = childprocess.execFileSync(pathBatFile, batchFileArguments);
    if (child.err) {
        console.log("Error occured ");
    }
    var xml2js = require('xml2js');
    var parser = new xml2js.Parser();
    var DealStatus;
   fs.readFile(ResponseXMLPath, 'utf-8', function (err, data) {
        if (err) {
            expect(true).toBe(false, "Error occured while Cancelling TD Deal");
        }
        else {
            parser.parseString(data, function (err, result) {
                if (err) {
                    expect(true).toBe(false, "Error occured while converting to JSON");
                }
                else {
                    DealStatus = result['s:Envelope']['s:Body'][0]['LenderResponse'][0]['RequestType'][0]['_'];
                    expect(DealStatus).toContain('DEALSTATUSCHANGE', "Deal Status Changed to Cancelled");
                }
            });
        }
    });
}

    this.UpdateTDDealLegalDescNpin = function (fctUrn, lenderRefNo, closingDate, MortInterestRate, PropertyProvince,updateLegalNPin) {

        // chnages from lender side
        if (closingDate == null) { closingDate = "2019-11-29" }
        if (MortInterestRate == null) { MortInterestRate = "3" }

        var DocumentType;
        var pathBatFile = resolve('..\\Services\\TD\\BatchFiles\\TDDealLegalNpin_Update.bat');
        var pathResponseFile = resolve('..\\Services\\TD\\ResponseXMLs\\ResponseDealData.xml');
        var keystoreCertificate = resolve('..\\Services\\TD\\TDCertificates\\' + Runsettings.data.Global.keystoreCertificate.value);
        var keystorePassword = Runsettings.data.Global.keystorePassword.value;
        var pathSoapUI = resolve('..\\Services\\TD\\SoapProject\\LenderIntegrationTD.xml');
        var EndPoint = Runsettings.data.Global.TD[Env].EndPoint
        var pathResponseFile = resolve('..\\Services\\TD\\ResponseXMLs\\ResponseDealData.xml');
        var LawyerID = Runsettings.data.Global.URL_LLCEmulator[Env].LawyerIDNo.value;

        switch (PropertyProvince) {
            case 'ON':
               // DocuCreateTDDealthroughCodeNoLegalDescmentType = "530116";
               DocumentType="530116";
                break;
            case 'NB':
                DocumentType = "530278";
                break;
            case 'MB':
                DocumentType = "530206";
                break;
            case 'AB':
                DocumentType = "530152";
                break;
            case 'SK':
                DocumentType = "530188";
                break;
            case 'BC':
                DocumentType = "530134";
                break;
        }

        var batchFileArguments = [pathSoapUI,keystoreCertificate, keystorePassword, pathResponseFile, EndPoint, LawyerID, fctUrn, lenderRefNo, closingDate, MortInterestRate, DocumentType, PropertyProvince, Runsettings.data.Global.SoapPath.value,updateLegalNPin];
        const child = childprocess.execFileSync(pathBatFile, batchFileArguments);
        if (child.err) {
            console.log("Error occured ");
        }
    }

    this.UpdateTDDealPin = function (fctUrn, lenderRefNo, closingDate, MortInterestRate, PropertyProvince,updateLegalNPin) {

        // chnages from lender side
        if (closingDate == null) { closingDate = "2019-11-29" }
        if (MortInterestRate == null) { MortInterestRate = "3" }

        var DocumentType;
        var pathBatFile = resolve('..\\Services\\TD\\BatchFiles\\TDDealPin_Update.bat');
        var pathSoapUI = resolve('..\\Services\\TD\\SoapProject\\LenderIntegrationTD.xml');
        var EndPoint = Runsettings.data.Global.TD[Env].EndPoint
        var pathResponseFile = resolve('..\\Services\\TD\\ResponseXMLs\\ResponseDealData.xml');
        var keystoreCertificate = resolve('..\\Services\\TD\\TDCertificates\\' + Runsettings.data.Global.keystoreCertificate.value);
        var keystorePassword = Runsettings.data.Global.keystorePassword.value;
        var LawyerID = Runsettings.data.Global.URL_LLCEmulator[Env].LawyerIDNo.value;

        switch (PropertyProvince) {
            case 'ON':
                DocumentType = "530116";
                break;
            case 'NB':
                DocumentType = "530278";
                break;
            case 'MB':
                DocumentType = "530206";
                break;
            case 'AB':
                DocumentType = "530152";
                break;
            case 'SK':
                DocumentType = "530188";
                break;
            case 'BC':
                DocumentType = "530134";
                break;
        }

        var batchFileArguments = [pathSoapUI, keystoreCertificate, keystorePassword,pathResponseFile, EndPoint, LawyerID, fctUrn, lenderRefNo, closingDate, MortInterestRate, DocumentType, PropertyProvince, Runsettings.data.Global.SoapPath.value,updateLegalNPin];
        const child = childprocess.execFileSync(pathBatFile, batchFileArguments);
        if (child.err) {
            console.log("Error occured ");
        }
    }
   


    this.ReinstateTDDeal = function (urn, lenderRefNo) {
        var pathBatFile = resolve('..\\Services\\TD\\BatchFiles\\TDDeal_ChangeStatus.bat');
        var pathSoapUI = resolve('..\\Services\\TD\\SoapProject\\LenderIntegrationTD.xml');
        var EndPoint = Runsettings.data.Global.TD[Env].EndPoint
        var ReponsePath = resolve('..\\Services\\TD\\ResponseXMLs');
        var ResponseXMLPath = resolve('..\\Services\\TD\\ResponseXMLs\\SendDealStatusChangeResponse.xml');
        var keystoreCertificate = resolve('..\\Services\\TD\\TDCertificates\\' + Runsettings.data.Global.keystoreCertificate.value);
        var keystorePassword = Runsettings.data.Global.keystorePassword.value;
        var DealStatus;
        //"CANCEL", "REINSTATE" and "CLOSE"
        var batchFileArguments = [pathSoapUI,keystoreCertificate, keystorePassword, urn, lenderRefNo, EndPoint, "REINSTATE", ReponsePath, "REINSTATED",Runsettings.data.Global.SoapPath.value];
        const child = childprocess.execFileSync(pathBatFile, batchFileArguments);
        if (child.err) {
            console.log("Error occured ");
        }
        var xml2js = require('xml2js');
        var parser = new xml2js.Parser();
        fs.readFile(ResponseXMLPath, 'utf-8', function (err, data) {
            if (err) {
                expect(true).toBe(false, "Error occured while Reinstating TD Deal");
            }
            else {
                parser.parseString(data, function (err, result) {
                    if (err) {
                        expect(true).toBe(false, "Error occured while converting to JSON");
                    }
                    else {
                        DealStatus = result['s:Envelope']['s:Body'][0]['LenderResponse'][0]['RequestType'][0]['_'];
                        expect(DealStatus).toContain('DEALSTATUSCHANGE', "Deal Status Changed to Reinstate");
                    }
                });
            }
        });
    }

    //GetLawyerDealEvent Response
    this.TDLawyerEvents = function (lenderRefNo) {
        var pathResponseFile = resolve('..\\Services\\TD\\ResponseXMLs\\GetLawyerDealEvents.xml');
        var pathBatFile = resolve('..\\Services\\TD\\BatchFiles\\TDDeal_GetLawyerDealEvents.bat');
        var pathSoapUI = resolve('..\\Services\\TD\\SoapProject\\LenderIntegrationTD.xml');
        var keystoreCertificate = resolve('..\\Services\\TD\\TDCertificates\\' + Runsettings.data.Global.keystoreCertificate.value);
        var keystorePassword = Runsettings.data.Global.keystorePassword.value;
        var EndPoint = Runsettings.data.Global.TD[Env].EndPoint
        var batchFileArguments = [pathSoapUI,keystoreCertificate, keystorePassword, lenderRefNo, EndPoint, pathResponseFile, Runsettings.data.Global.SoapPath.value];
        const child = childprocess.execFileSync(pathBatFile, batchFileArguments);
        if (child.err) {
            console.log("Error occured while Getting TD Lawyer Deal Events.");
        }
    }

     //Verify Events in GetLawyerDealEvent Service
    this.LogLawyerDealEvent = function (eventNumber, status, type) {
        var DealStatus;
        var EventType;
        var pathResponseFile = resolve('..\\Services\\TD\\ResponseXMLs\\GetLawyerDealEvents.xml');
        Counter = 0;
        WaitForFileToBeCreated(pathResponseFile,2000);
        var parser = new xml2js.Parser();
        fs.readFile(pathResponseFile, function (err, data) {
            parser.parseString(data, function (err, result) {
                EventType = result['s:Envelope']['s:Body'][0]['GetLawyerDealEventsResponse'][0]['Messages'][0]['Message'][eventNumber]['EventType']
                DealStatus = result['s:Envelope']['s:Body'][0]['GetLawyerDealEventsResponse'][0]['Messages'][0]['Message'][eventNumber]['DealStatus']
                expect(DealStatus).toContain(status, "Status of GetLawyerDealEvent Service for Lender.");
                expect(EventType).toContain(type, "EventType of GetLawyerDealEvent Service for Lender.");

            });
        });
    }

    this.LogLawyerDealEventFR = function (eventNumber, closingOption) {
        var ClosingOption;
       
        var pathResponseFile = resolve('..\\Services\\TD\\ResponseXMLs\\GetLawyerDealEvents.xml');
        Counter = 0;
        WaitForFileToBeCreated(pathResponseFile,2000);
        var parser = new xml2js.Parser();
        fs.readFile(pathResponseFile, function (err, data) {
            parser.parseString(data, function (err, result) {
               ClosingOption = result['s:Envelope']['s:Body'][0]['GetLawyerDealEventsResponse'][0]['Messages'][0]['Message'][eventNumber]['EventData'][0]['SubmitSROT'][0]['FinalReportClosingOption'];
               expect(ClosingOption).toContain(closingOption, "Status of GetLawyerDealEvent Service for Lender.");
                

            });
        });
    }


    this.LogLawyerDealEventFRNEW = function (EventTypeVal, Option) {
        var pathResponseFile = resolve('..\\Services\\TD\\ResponseXMLs\\GetLawyerDealEvents.xml');
        Counter = 0;
        WaitForFileToBeCreated(pathResponseFile,2000);
        var parser = new xml2js.Parser();
        fs.readFile(pathResponseFile, function (err, data) {
            parser.parseString(data, function (err, result) {
                var ClosingOpt;
                var nodesCount = result['s:Envelope']['s:Body'][0]['GetLawyerDealEventsResponse'][0]['NumberOfMessages'][0]['_'];
                for (var node = 0; node < nodesCount;) {
                               
                   if (result['s:Envelope']['s:Body'][0]['GetLawyerDealEventsResponse'][0]['Messages'][0]['Message'][node]['EventType'] == EventTypeVal) {
                    ClosingOpt = result['s:Envelope']['s:Body'][0]['GetLawyerDealEventsResponse'][0]['Messages'][0]['Message'][node]['EventData'][0]['SubmitSROT'][0]['FinalReportClosingOption'];
        
                        expect(ClosingOpt).toContain(Option, "Closing Option is not matching.");
                          
                        return node;
                    }
                    else {
                        node++;
        
                        if (node == nodesCount) {
                            expect(true).toBe(false, "EventType not found in GetLawyerDealEvents XML");
                           
                        }
        
                    }
                }
                

            });
        });
    }

    this.LogLawyerDealEventStatus = function (EventTypeVal, Option) {
        var pathResponseFile = resolve('..\\Services\\TD\\ResponseXMLs\\GetLawyerDealEvents.xml');
        Counter = 0;
        WaitForFileToBeCreated(pathResponseFile,2000);
        var parser = new xml2js.Parser();
        fs.readFile(pathResponseFile, function (err, data) {
            parser.parseString(data, function (err, result) {
                var DealStatus;
                var nodesCount = result['s:Envelope']['s:Body'][0]['GetLawyerDealEventsResponse'][0]['NumberOfMessages'][0]['_'];
                for (var node = 0; node < nodesCount;) {
                               
                   if (result['s:Envelope']['s:Body'][0]['GetLawyerDealEventsResponse'][0]['Messages'][0]['Message'][node]['EventType'] == EventTypeVal) {
                    DealStatus = result['s:Envelope']['s:Body'][0]['GetLawyerDealEventsResponse'][0]['Messages'][0]['Message'][node]['DealStatus'];
        
                        expect(DealStatus).toContain(Option, "Deal Status is not matching.");
                          
                        return node;
                    }
                    else {
                        node++;
        
                        if (node == nodesCount) {
                            expect(true).toBe(false, "EventType not found in GetLawyerDealEvents XML");
                           
                        }
        
                    }
                }
                

            });
        });
    }


    this.GetTDLawyerDealEvents = function (lenderRefNo){
        Counter = 0;
        GetTDLawyerDealEventsTillSuccess(lenderRefNo);
    }

    var GetTDLawyerDealEventsTillSuccess = function (lenderRefNo) {
        var pathResponseFile = resolve('..\\Services\\TD\\ResponseXMLs\\GetLawyerDealEvents.xml');
        var pathBatFile = resolve('..\\Services\\TD\\BatchFiles\\TDDeal_GetLawyerDealEvents.bat');
        var pathSoapUI = resolve('..\\Services\\TD\\SoapProject\\LenderIntegrationTD.xml');
        var keystoreCertificate = resolve('..\\Services\\TD\\TDCertificates\\' + Runsettings.data.Global.keystoreCertificate.value);
        var keystorePassword = Runsettings.data.Global.keystorePassword.value;
        var EndPoint = Runsettings.data.Global.TD[Env].EndPoint
        var batchFileArguments = [pathSoapUI,keystoreCertificate, keystorePassword, lenderRefNo, EndPoint, pathResponseFile, Runsettings.data.Global.SoapPath.value];
        const child = childprocess.execFileSync(pathBatFile, batchFileArguments);
        if (child.err) {
            console.log("Error occured while Getting TD Lawyer Deal Events.");
        }

        var xml2js = require('xml2js');
        var parser = new xml2js.Parser();
        Counter++;
        fs.readFile(pathResponseFile, 'utf-8', function (err, data) {
            if (err) {
                if ( Counter < 5) { 
                    GetTDLawyerDealEventsTillSuccess(lenderRefNo);
                }
                else{
                    expect(true).toBe(false, "Error occured while reading GetLawyerDealEvent Response");
                }        
            }
            else {
                parser.parseString(data, function (err, result) {
                    if (err) {
                        if ( Counter < 5) { 
                            GetTDLawyerDealEventsTillSuccess(lenderRefNo);
                        }
                        else{
                            expect(true).toBe(false, "Error occured while reading GetLawyerDealEvent Response");
                        }                        
                    }
                    else {
                        NumberOfMessages = result['s:Envelope']['s:Body'][0]['GetLawyerDealEventsResponse'][0]['NumberOfMessages'][0]['_'];
                        GetLawyerDealEventsResponse = result;
                        
                        if (NumberOfMessages == 0 && Counter < 5) { 
                            GetTDLawyerDealEventsTillSuccess(lenderRefNo);
                        }

                    }
                });
            }
        });
    }
   
    this.ParseGetLawyerDealEventsResponse = function (EventTypeVal,expectedResult) {
        for (var node = 0; node < NumberOfMessages;) {
            if (GetLawyerDealEventsResponse['s:Envelope']['s:Body'][0]['GetLawyerDealEventsResponse'][0]['Messages'][0]['Message'][node]['EventType'] == EventTypeVal) {
                expect(expectedResult).toBe(false, "EventType found in GetLawyerDealEvents XML");
                return node;
            }
            else {
                node++;

                if (node == NumberOfMessages) {
                    expect(expectedResult).toBe(true, "EventType not found in GetLawyerDealEvents XML");
                }
            }
        }
        

    }



    this.GenerateTDSendDealStatusChangeXML = function (LenderDealStatus, DealStatusChangeReason) {

        var ns = "q186";
        var MessageId = "{85434d76-8fde-f7f9-" + CustLib.getRandomNumber(4) + "-" + CustLib.getRandomNumber(4) + "D52E" + CustLib.getRandomNumber(4) + "}";
        //var LenderId = LenderIdNo;
        var LenderId = TDData.data[LangTD].RFC.LenderId;
        var str = "<" + ns + ":SendDealStatusChangeRequest><MessageID>" + MessageId + "</MessageID><Deal><DealInfo><LenderId>" + LenderId + "</LenderId><FCTURN>" + fctURNTD + "</FCTURN><LenderReferenceNumber>" + LenderRefNoTD + "</LenderReferenceNumber></DealInfo><RequestType>" + LenderDealStatus + "</RequestType><Reason>" + DealStatusChangeReason + "</Reason></Deal></" + ns + ":SendDealStatusChangeRequest>";

        return str;
    }

    this.TDSendDealStatusChange = function (LenderDealStatus, DealStatusChangeReason) {

        var str = this.GenerateTDSendDealStatusChangeXML(LenderDealStatus, DealStatusChangeReason);
        var args = {
            _xml: str
        };

        soap.createClient(TDWebServiceurl, SetUpClient);

        function SetUpClient(err, client) {

            client.SendDealStatusChange(args, function (err, result) {

                if (err) {
                    console.log('No Result Obtained');
                    defered.reject(err);
                }
                else {
                    defered.resolve(result);

                    console.log('FCT Urn on Send Deal Status Change Service: ', result.FCTURN);

                    if (result.FCTURN != fctURNTD) {
                        console.log('FCT Urn does not match on SendDealStatusChange!!!');
                        return;
                    }

                    fs.writeFile('../Services/TD/ResponseXMLs/SendDealStatusChange.json', JSON.stringify(result), function (err) {
                        if (err) {
                            console.log('Cant write response');
                            console.log(err);
                        }
                        else {
                            console.log("Successful response saved " + 'SendDealStatusChange.JSON');
                        }
                    });

                }

            }, { timeout: 15000 })
        }

        return defered.promise;
    }


    this.SendDealStatusChange = function (LenderDealStatus, DealStatusChangeReason) {

        var childprocess = require("child_process");
        var pathBatFile = resolve('..\\Services\\TD\\BatchFiles\\TDDeal_SendDealStatusChange.bat');
        var pathSoapUI = resolve('..\\Services\\TD\\SoapProject\\LenderIntegrationTD.xml');
        var RequestType = null;
        var keystoreCertificate = resolve('..\\Services\\TD\\TDCertificates\\' + Runsettings.data.Global.keystoreCertificate.value);
        var keystorePassword = Runsettings.data.Global.keystorePassword.value;

        var pathFile = resolve('..\\Services\\TD\\ResponseXMLs');
        var pathResponse = resolve('..\\Services\\TD\\ResponseXMLs\\SendDealStatusChange.xml');

        var batchFileArguments = [pathSoapUI, TDWebServiceurl, keystoreCertificate, keystorePassword, pathFile, LawyerIDNo, fctURNTD, LenderRefNoTD, LenderDealStatus, DealStatusChangeReason, Runsettings.data.Global.SoapPath.value];
        console.log(batchFileArguments);
        const child = childprocess.execFileSync(pathBatFile, batchFileArguments);
        if (child.err) {
            console.log("Error occured: " + child.err);
        }

        var xml2js = require('xml2js');
        var parser = new xml2js.Parser();
        fs.readFile(pathResponse, 'utf-8', function (err, data) {
            if (err) {
                expect(true).toBe(false, "Error occured while sending deal status change");
            }

            else {

                parser.parseString(data, function (err, result) {
                    if (err) {
                        expect(true).toBe(false, "Error occured while converting to JSON");
                    }
                    else {
                            RequestType = result['s:Envelope']['s:Body'][0]['LenderResponse'][0]['RequestType'][0]['_'];
                            if (RequestType == "DEALSTATUSCHANGE") {
                            console.log("Send Deal status change service executed successfully");
                            console.log("Request Type = " + RequestType);
                        }
                            else {
                            expect(true).toBe(false, "Send deal status change service failed!!!");
                            }
                        
                        }
                });
            }
        });

    }

    this.ReturnLenderRefNo = function () {
        return LenderRefNo;
    }

    this.ReturnFctUrn = function () {
        return ResponseFCTURN;
    }


    // Wait for creating  getLawyerDealEvent Response XML
    var WaitForFileToBeCreated = function (path, timeout) {
        setInterval(function() {
            Counter = Counter + 1;
            const fileExists = fs.existsSync(path);
            if (fileExists || Counter >= CounterMax) {
                clearInterval(timeout);
            }
        }, timeout);
    };

    this.CleanUpScript = function () {
        fctURNTD = null;
        LenderRefNoTD = null;
        GetLawyerDealEventsResponse = null;
        NumberOfMessages = null;
    }

};
module.exports = new LenderIntegrationTD();
