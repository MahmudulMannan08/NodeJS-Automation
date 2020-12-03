'use strict';
var TestData = require('../../../../testData/TestData.js');
var Runsettings = require('../../../../testData/RunSetting.js');
var CustLib = require('../../../../CustomLibrary/CustomLibrary.js');
var BNSTestData = require('../../../../testData/BNS/BNSTestData.js');
var fs = require('fs');
var resolve = require('path').resolve;
var soap = require('soap');
var q = require('q');
var defered = q.defer();
var xml2js = require('xml2js');
var ResponseFCTURN = null;
var LenderRefNo = null;
var MortgageNo = null;
var ClosingDate = null;
var MrtgagorFirst = null;
var MrtgagorMid = null;
var MrtgagorLast = null;
var StreetNumber = null;
var StreetAddress1 = null;
var City = null;
var CityCurrent = null;
var Province = null;
var ProvinceCurrent = null;
var PostalCode = null;
var NoteSub = null;
var NoteDetails = null;
var SecNoteSub = null;
var GetLawyerDealEventsResponse = null;
var NumberOfMessages = null;
var Env = Runsettings.data.Global.ENVIRONMENT.value;
var Lang = TestData.data.LANGUAGE.value;
var BNSWebServiceurl = Runsettings.data.Global.BNS[Env].BNSWebServiceurl;
var LawyerIDNo = Runsettings.data.Global.URL_LLCEmulator[Env].LawyerIDNo.value;
var LenderIdNo = Runsettings.data.Global.URL_LLCEmulator[Env].LenderIdNo.value;
var Counter = 0; 



var LenderIntegrationBNS = function () {

    this.CreateBNSDeal = function (IsSolicitorClose, IsRFF, PropertyProvince) {
        var childprocess = require("child_process");
        var pathBatFile = resolve('..\\Services\\BNS\\BatchFiles\\BNSDeal_Create.bat');
        var pathSoapUI = resolve('..\\Services\\BNS\\SoapProject\\LenderIntegrationBNS.xml');
        var basicAuthUser = null;
        var basicAuthPass = null;

        if (Env == "PROD" || Env == "DR") {
            basicAuthUser = Runsettings.data.Global.basicAuthUserDRPROD.value;
            basicAuthPass = Runsettings.data.Global.basicAuthPassDRPROD.value;
            
        }
        else {
            basicAuthUser = Runsettings.data.Global.basicAuthUser.value;
            basicAuthPass = Runsettings.data.Global.basicAuthPass.value;

        }
        var pathFile = resolve('..\\Services\\BNS\\ResponseXMLs');
        var pathRequest = resolve('..\\Services\\BNS\\ResponseXMLs\\CreateBNSDealRequest.xml');
        var pathResponse = resolve('..\\Services\\BNS\\ResponseXMLs\\CreateBNSDealResponse.xml');

        ClosingDate = CustLib.CurrentOrFutureDate();

        //console.log("WebServiceURL:" + "s 'BNS Test Suite' -c 'CreateDeal' -PDealResponseFilePath=" + pathFile + " -PLenderId=" + LenderIdNo + " -PLawyerID=" + LawyerIDNo + " -PClosingDate=" + ClosingDate + " -PProvince=" + PropertyProvince + " -PIsRFF=" + IsRFF + " -PIsSolicitorClose=" + IsSolicitorClose + " -e" + BNSWebServiceurl + " " + pathSoapUI);
        var batchFileArguments = [pathSoapUI, BNSWebServiceurl, basicAuthUser, basicAuthPass, pathFile, LenderIdNo, LawyerIDNo, ClosingDate, PropertyProvince, IsRFF, IsSolicitorClose, Runsettings.data.Global.SoapPath.value];
        const child = childprocess.execFileSync(pathBatFile, batchFileArguments);
        if (child.err) {
            console.log("Create BNS Deal Error occured ");
        }

        var xml2js = require('xml2js');
        var parser = new xml2js.Parser();
        fs.readFile(pathResponse, 'utf-8', function (err, data) {
            if (err) {
                expect(true).toBe(false, "Error occured while creating BNS Deal");
            }

            else {

                parser.parseString(data, function (err, result) {
                    if (err) {
                        expect(true).toBe(false, "Error occured while converting to JSON");
                    }
                    else {
                        ResponseFCTURN = result['s:Envelope']['s:Body'][0]['LenderResponse'][0]['FCTURN'][0]['_'];
                        LenderRefNo = result['s:Envelope']['s:Body'][0]['LenderResponse'][0]['LenderReferenceNumber'][0]['_'];
                        expect(ResponseFCTURN).not.toBe(null, "CreateBNSDeal service failed!!!");
                    }
                });
            }
        });

        fs.readFile(pathRequest, 'utf-8', function (err, data) {
            if (err) {
                console.error('Unable to read XML');
            }
            else {
                parser.parseString(data, function (err, result) {
                    if (err) {
                        console.error('Unable to convert to JSON');
                    }
                    else {
                        MrtgagorFirst = result['soapenv:Envelope']['soapenv:Body'][0]['ns:LenderRequest'][0]['Mortgagors'][0]['Mortgagor'][0]['Person'][0]['FirstName'];
                        MrtgagorMid = result['soapenv:Envelope']['soapenv:Body'][0]['ns:LenderRequest'][0]['Mortgagors'][0]['Mortgagor'][0]['Person'][0]['MiddleName'];
                        MrtgagorLast = result['soapenv:Envelope']['soapenv:Body'][0]['ns:LenderRequest'][0]['Mortgagors'][0]['Mortgagor'][0]['Person'][0]['LastName'];

                        StreetNumber = result['soapenv:Envelope']['soapenv:Body'][0]['ns:LenderRequest'][0]['Properties'][0]['Property'][0]['PropertyAddress'][0]['StreetNumber'];
                        StreetAddress1 = result['soapenv:Envelope']['soapenv:Body'][0]['ns:LenderRequest'][0]['Properties'][0]['Property'][0]['PropertyAddress'][0]['StreetAddress1'];
                        City = result['soapenv:Envelope']['soapenv:Body'][0]['ns:LenderRequest'][0]['Properties'][0]['Property'][0]['PropertyAddress'][0]['City'];
                        CityCurrent = City;
                        // Province = TestData.data[Lang].WebService.Province;
                        Province=PropertyProvince;
                        ProvinceCurrent = Province;
                        PostalCode = result['soapenv:Envelope']['soapenv:Body'][0]['ns:LenderRequest'][0]['Properties'][0]['Property'][0]['PropertyAddress'][0]['PostalCode'];
                    }
                });
            }
        });
    }


    this.CreateBNSDealNoLegalDescNpin = function (IsSolicitorClose, IsRFF, PropertyProvince) {
        var childprocess = require("child_process");
        var pathBatFile = resolve('..\\Services\\BNS\\BatchFiles\\BNSDeal_CreateNoLegalDesNpin.bat');
        var pathSoapUI = resolve('..\\Services\\BNS\\SoapProject\\LenderIntegrationBNS.xml');
        var basicAuthUser = null;
        var basicAuthPass = null;

        if (Env == "PROD" || Env == "DR") {
            basicAuthUser = Runsettings.data.Global.basicAuthUserDRPROD.value;
            basicAuthPass = Runsettings.data.Global.basicAuthPassDRPROD.value;
            
        }
        else {
            basicAuthUser = Runsettings.data.Global.basicAuthUser.value;
            basicAuthPass = Runsettings.data.Global.basicAuthPass.value;

        }
        var pathFile = resolve('..\\Services\\BNS\\ResponseXMLs');
        var pathRequest = resolve('..\\Services\\BNS\\ResponseXMLs\\CreateBNSDealRequest.xml');
        var pathResponse = resolve('..\\Services\\BNS\\ResponseXMLs\\CreateBNSDealResponse.xml');

        ClosingDate = CustLib.CurrentOrFutureDate();

        //console.log("WebServiceURL:" + "s 'BNS Test Suite' -c 'CreateDeal' -PDealResponseFilePath=" + pathFile + " -PLenderId=" + LenderIdNo + " -PLawyerID=" + LawyerIDNo + " -PClosingDate=" + ClosingDate + " -PProvince=" + PropertyProvince + " -PIsRFF=" + IsRFF + " -PIsSolicitorClose=" + IsSolicitorClose + " -e" + BNSWebServiceurl + " " + pathSoapUI);
        var batchFileArguments = [pathSoapUI, BNSWebServiceurl, basicAuthUser, basicAuthPass, pathFile, LenderIdNo, LawyerIDNo, ClosingDate, PropertyProvince, IsRFF, IsSolicitorClose, Runsettings.data.Global.SoapPath.value];
        const child = childprocess.execFileSync(pathBatFile, batchFileArguments);
        if (child.err) {
            console.log("Create BNS Deal Error occured ");
        }

        var xml2js = require('xml2js');
        var parser = new xml2js.Parser();
        fs.readFile(pathResponse, 'utf-8', function (err, data) {
            if (err) {
                expect(true).toBe(false, "Error occured while creating BNS Deal");
            }

            else {

                parser.parseString(data, function (err, result) {
                    if (err) {
                        expect(true).toBe(false, "Error occured while converting to JSON");
                    }
                    else {
                        ResponseFCTURN = result['s:Envelope']['s:Body'][0]['LenderResponse'][0]['FCTURN'][0]['_'];
                        LenderRefNo = result['s:Envelope']['s:Body'][0]['LenderResponse'][0]['LenderReferenceNumber'][0]['_'];
                        expect(ResponseFCTURN).not.toBe(null, "CreateBNSDeal service failed!!!");
                    }
                });
            }
        });

        fs.readFile(pathRequest, 'utf-8', function (err, data) {
            if (err) {
                console.error('Unable to read XML');
            }
            else {
                parser.parseString(data, function (err, result) {
                    if (err) {
                        console.error('Unable to convert to JSON');
                    }
                    else {
                        MrtgagorFirst = result['soapenv:Envelope']['soapenv:Body'][0]['ns:LenderRequest'][0]['Mortgagors'][0]['Mortgagor'][0]['Person'][0]['FirstName'];
                        MrtgagorMid = result['soapenv:Envelope']['soapenv:Body'][0]['ns:LenderRequest'][0]['Mortgagors'][0]['Mortgagor'][0]['Person'][0]['MiddleName'];
                        MrtgagorLast = result['soapenv:Envelope']['soapenv:Body'][0]['ns:LenderRequest'][0]['Mortgagors'][0]['Mortgagor'][0]['Person'][0]['LastName'];

                        StreetNumber = result['soapenv:Envelope']['soapenv:Body'][0]['ns:LenderRequest'][0]['Properties'][0]['Property'][0]['PropertyAddress'][0]['StreetNumber'];
                        StreetAddress1 = result['soapenv:Envelope']['soapenv:Body'][0]['ns:LenderRequest'][0]['Properties'][0]['Property'][0]['PropertyAddress'][0]['StreetAddress1'];
                        City = result['soapenv:Envelope']['soapenv:Body'][0]['ns:LenderRequest'][0]['Properties'][0]['Property'][0]['PropertyAddress'][0]['City'];
                        CityCurrent = City;
                        Province = TestData.data[Lang].WebService.Province;
                        ProvinceCurrent = Province;
                        PostalCode = result['soapenv:Envelope']['soapenv:Body'][0]['ns:LenderRequest'][0]['Properties'][0]['Property'][0]['PropertyAddress'][0]['PostalCode'];
                    }
                });
            }
        });
    }

    this.CreateBNSDealWithDocType = function (IsSolicitorClose, IsRFF, PropertyProvince, docType) {
        var childprocess = require("child_process");
        var pathBatFile = resolve('..\\Services\\BNS\\BatchFiles\\BNSDeal_Create.bat');
        var pathSoapUI = resolve('..\\Services\\BNS\\SoapProject\\LenderIntegrationBNS.xml');
        var basicAuthUser = null;
        var basicAuthPass = null;

        if (Env == "PROD" || Env == "DR") {
            basicAuthUser = Runsettings.data.Global.basicAuthUserDRPROD.value;
            basicAuthPass = Runsettings.data.Global.basicAuthPassDRPROD.value;

        }
        else {
            basicAuthUser = Runsettings.data.Global.basicAuthUser.value;
            basicAuthPass = Runsettings.data.Global.basicAuthPass.value;
        }
        var pathFile = resolve('..\\Services\\BNS\\ResponseXMLs');
        var pathRequest = resolve('..\\Services\\BNS\\ResponseXMLs\\CreateBNSDealRequest.xml');
        var pathResponse = resolve('..\\Services\\BNS\\ResponseXMLs\\CreateBNSDealResponse.xml');
        ClosingDate = CustLib.CurrentOrFutureDate();
        //console.log("WebServiceURL:" + "s 'BNS Test Suite' -c 'CreateDeal' -PDealResponseFilePath=" + pathFile + " -PLenderId=" + LenderIdNo + " -PLawyerID=" + LawyerIDNo + " -PClosingDate=" + ClosingDate + " -PProvince=" + PropertyProvince + " -PIsRFF=" + IsRFF + " -PIsSolicitorClose=" + IsSolicitorClose + " -e" + BNSWebServiceurl + " " + pathSoapUI);
        var batchFileArguments = [pathSoapUI, BNSWebServiceurl, basicAuthUser, basicAuthPass, pathFile, LenderIdNo, LawyerIDNo, ClosingDate, PropertyProvince, IsRFF, IsSolicitorClose, Runsettings.data.Global.SoapPath.value, docType];
        const child = childprocess.execFileSync(pathBatFile, batchFileArguments);
        if (child.err) {
            console.log("Create BNS Deal Error occured ");
        }

        var xml2js = require('xml2js');
        var parser = new xml2js.Parser();
        fs.readFile(pathResponse, 'utf-8', function (err, data) {
            if (err) {
                // console.error('Unable to read XML');
                expect(true).toBe(false, "Error occured while creating BNS Deal");
            }
            else {
                parser.parseString(data, function (err, result) {
                    if (err) {
                        expect(true).toBe(false, "Error occured while converting to JSON");
                    }
                    else {
                        ResponseFCTURN = result['s:Envelope']['s:Body'][0]['LenderResponse'][0]['FCTURN'][0]['_'];
                        LenderRefNo = result['s:Envelope']['s:Body'][0]['LenderResponse'][0]['LenderReferenceNumber'][0]['_'];
                        expect(ResponseFCTURN).not.toBe(null, "CreateBNSDeal service failed!!!");
                    }
                });
            }
        });
        fs.readFile(pathRequest, 'utf-8', function (err, data) {
            if (err) {
                expect(true).toBe(false, "Error occured while reading Response");
            }
            else {
                parser.parseString(data, function (err, result) {
                    if (err) {
                        expect(true).toBe(false, "Error occured while reading Response");
                    }
                    else {
                        MrtgagorFirst = result['soapenv:Envelope']['soapenv:Body'][0]['ns:LenderRequest'][0]['Mortgagors'][0]['Mortgagor'][0]['Person'][0]['FirstName'];
                        MrtgagorMid = result['soapenv:Envelope']['soapenv:Body'][0]['ns:LenderRequest'][0]['Mortgagors'][0]['Mortgagor'][0]['Person'][0]['MiddleName'];
                        MrtgagorLast = result['soapenv:Envelope']['soapenv:Body'][0]['ns:LenderRequest'][0]['Mortgagors'][0]['Mortgagor'][0]['Person'][0]['LastName'];
                        StreetNumber = result['soapenv:Envelope']['soapenv:Body'][0]['ns:LenderRequest'][0]['Properties'][0]['Property'][0]['PropertyAddress'][0]['StreetNumber'];
                        StreetAddress1 = result['soapenv:Envelope']['soapenv:Body'][0]['ns:LenderRequest'][0]['Properties'][0]['Property'][0]['PropertyAddress'][0]['StreetAddress1'];
                        City = result['soapenv:Envelope']['soapenv:Body'][0]['ns:LenderRequest'][0]['Properties'][0]['Property'][0]['PropertyAddress'][0]['City'];
                        CityCurrent = City;
                        Province = TestData.data[Lang].WebService.Province;
                        ProvinceCurrent = Province;
                        PostalCode = result['soapenv:Envelope']['soapenv:Body'][0]['ns:LenderRequest'][0]['Properties'][0]['Property'][0]['PropertyAddress'][0]['PostalCode'];
                    }
                });
            }
        });
    }
    

    this.UpdateBNSDeal = function (IsSolicitorClose, IsRFF, CityUpdate, ProvinceUpdate, MortgageCentreFirstName) {

        var childprocess = require("child_process");
        var pathBatFile = resolve('..\\Services\\BNS\\BatchFiles\\BNSDeal_Update.bat');
        var pathSoapUI = resolve('..\\Services\\BNS\\SoapProject\\LenderIntegrationBNS.xml');
        var basicAuthUser = null;
        var basicAuthPass = null;

        if (Env == "PROD" || Env == "DR") {
            basicAuthUser = Runsettings.data.Global.basicAuthUserDRPROD.value;
            basicAuthPass = Runsettings.data.Global.basicAuthPassDRPROD.value;
        }
        else {
            basicAuthUser = Runsettings.data.Global.basicAuthUser.value;
            basicAuthPass = Runsettings.data.Global.basicAuthPass.value;
        }
        var pathFile = resolve('..\\Services\\BNS\\ResponseXMLs');
        var pathRequest = resolve('..\\Services\\BNS\\ResponseXMLs\\UpdateBNSDealRequest.xml');
        var pathResponse = resolve('..\\Services\\BNS\\ResponseXMLs\\UpdateBNSDealResponse.xml');

        if (!CityUpdate) {
            City = CityCurrent;
        }
        else {
            City = CityUpdate;
            CityCurrent = CityUpdate;
        }
        if (!ProvinceUpdate) {
            Province = ProvinceCurrent;
        }
        else {
            Province = ProvinceUpdate;
            ProvinceCurrent = ProvinceUpdate;
        }
        if (!MortgageCentreFirstName) {
            MortgageCentreFirstName = 'Mortgage';
        }

        var batchFileArguments = [pathSoapUI, BNSWebServiceurl, basicAuthUser, basicAuthPass, pathFile, LawyerIDNo, ResponseFCTURN, LenderRefNo, ClosingDate, City, MortgageCentreFirstName, Province, IsRFF, IsSolicitorClose, Runsettings.data.Global.SoapPath.value];
        try {
            const child = childprocess.execFileSync(pathBatFile, batchFileArguments);
            if (child.err) {
                console.log("Update BNSDeal Error occured");
            }
        } catch (ex) { }


        var xml2js = require('xml2js');
        var parser = new xml2js.Parser();
        fs.readFile(pathResponse, 'utf-8', function (err, data) {
            if (err) {
                console.error('Unable to read XML');
            }
            else {
                parser.parseString(data, function (err, result) {
                    if (err) {
                        console.error('Unable to convert to JSON ');
                    }
                    else {
                        ResponseFCTURN = result['s:Envelope']['s:Body'][0]['LenderResponse'][0]['FCTURN'][0]['_'];
                        console.log('Updated FCT Urn: ', ResponseFCTURN);
                    }
                });
            }
        });
    }

    this.UpdateBNSDealWithLegalNPin = function (IsSolicitorClose, IsRFF, CityUpdate, ProvinceName, MortgageCentreFirstName,closingdateupdate,updateLegalNPin) {

        var childprocess = require("child_process");
        var pathBatFile = resolve('..\\Services\\BNS\\BatchFiles\\BNSDeal_UpdateLegalDescNPin.bat');
        var pathSoapUI = resolve('..\\Services\\BNS\\SoapProject\\LenderIntegrationBNS.xml');
        var basicAuthUser = null;
        var basicAuthPass = null;

        if (Env == "PROD" || Env == "DR") {
            basicAuthUser = Runsettings.data.Global.basicAuthUserDRPROD.value;
            basicAuthPass = Runsettings.data.Global.basicAuthPassDRPROD.value;
        }
        else {
            basicAuthUser = Runsettings.data.Global.basicAuthUser.value;
            basicAuthPass = Runsettings.data.Global.basicAuthPass.value;
        }
        var pathFile = resolve('..\\Services\\BNS\\ResponseXMLs');
        var pathRequest = resolve('..\\Services\\BNS\\ResponseXMLs\\UpdateBNSDealRequest.xml');
        var pathResponse = resolve('..\\Services\\BNS\\ResponseXMLs\\UpdateBNSDealResponse.xml');
          Province=ProvinceName;
        if (!CityUpdate) {
            City = CityCurrent;
        }
        else {
            City = CityUpdate;
            CityCurrent = CityUpdate;
        }
      /* if (!ProvinceUpdate) {
            Province = ProvinceCurrent;
        }
        else {
            Province = ProvinceUpdate;
            ProvinceCurrent = ProvinceUpdate;
        }*/
        if (!MortgageCentreFirstName) {
            MortgageCentreFirstName = 'Mortgage';
        }
        if(!closingdateupdate){
            ClosingDate = CustLib.CurrentOrFutureDate();
           // console.log("hereere****")
        }
        else{
            ClosingDate = CustLib.FutureDate();
           // console.log("not heree****")
        }
        if(updateLegalNPin){
            updateLegalNPin="true"
        }
        else{
            updateLegalNPin="false"
        }
        console.log("***********************************************  "+ ClosingDate +closingdateupdate);
        var batchFileArguments = [pathSoapUI, BNSWebServiceurl, basicAuthUser, basicAuthPass, pathFile, LawyerIDNo, ResponseFCTURN, LenderRefNo, ClosingDate, City, MortgageCentreFirstName, Province, IsRFF, IsSolicitorClose, Runsettings.data.Global.SoapPath.value,updateLegalNPin];
        try {
            const child = childprocess.execFileSync(pathBatFile, batchFileArguments);
            if (child.err) {
                console.log("Update BNSDeal Error occured");
            }
        } catch (ex) { }


        var xml2js = require('xml2js');
        var parser = new xml2js.Parser();
        fs.readFile(pathResponse, 'utf-8', function (err, data) {
            if (err) {
                console.error('Unable to read XML');
            }
            else {
                parser.parseString(data, function (err, result) {
                    if (err) {
                        console.error('Unable to convert to JSON ');
                    }
                    else {
                        ResponseFCTURN = result['s:Envelope']['s:Body'][0]['LenderResponse'][0]['FCTURN'][0]['_'];
                        console.log('Updated FCT Urn: ', ResponseFCTURN);
                        //console.log(JSON.stringify(result));
                    }
                });
            }
        });
    }

   

    /*this.GetBNSLawyerDealEvents = function () {
        var childprocess = require("child_process");
        var pathBatFile = resolve('..\\Services\\BNS\\BatchFiles\\BNSDeal_GetLawyerDealEvent.bat');
        var pathSoapUI = resolve('..\\Services\\BNS\\SoapProject\\LenderIntegrationBNS.xml');
        var basicAuthUser = null;
        var basicAuthPass = null;

        if (Env == "PROD" || Env == "DR") {
            basicAuthUser = Runsettings.data.Global.basicAuthUserDRPROD.value;
            basicAuthPass = Runsettings.data.Global.basicAuthPassDRPROD.value;
        }
        else {
            basicAuthUser = Runsettings.data.Global.basicAuthUser.value;
            basicAuthPass = Runsettings.data.Global.basicAuthPass.value;
        }
        var pathFile = resolve('..\\Services\\BNS\\ResponseXMLs');
        var pathResponse = resolve('..\\Services\\BNS\\ResponseXMLs\\GetlawyereventsResponse.xml');

        var batchFileArguments = [pathSoapUI, BNSWebServiceurl, basicAuthUser, basicAuthPass, pathFile, LenderIdNo, LawyerIDNo, LenderRefNo, Runsettings.data.Global.SoapPath.value];
        const child = childprocess.execFileSync(pathBatFile, batchFileArguments);
        if (child.err) {
            console.log("CreateBNSDeal Error occured");
        }

        var xml2js = require('xml2js');
        var parser = new xml2js.Parser();
        fs.readFile(pathResponse, 'utf-8', function (err, data) {
            if (err) {
                expect(true).toBe(false, "Error occured while reading GetLawyerDealEvent Response");
            }
            else {
                parser.parseString(data, function (err, result) {
                    if (err) {
                        expect(true).toBe(false, "Error occured while reading GetLawyerDealEvent Response");
                    }
                    else {
                        NumberOfMessages = result['s:Envelope']['s:Body'][0]['GetLawyerDealEventsResponse'][0]['NumberOfMessages'][0]['_'];
                        GetLawyerDealEventsResponse = result;
                    }
                });
            }
        });
    }*/
    this.GetBNSLawyerDealEvents = function (){
        Counter = 0;
        GetBNSLawyerDealEventsTillSuccess();
    }

    var GetBNSLawyerDealEventsTillSuccess = function () {
        var childprocess = require("child_process");
        var pathBatFile = resolve('..\\Services\\BNS\\BatchFiles\\BNSDeal_GetLawyerDealEvent.bat');
        var pathSoapUI = resolve('..\\Services\\BNS\\SoapProject\\LenderIntegrationBNS.xml');
        var basicAuthUser = null;
        var basicAuthPass = null;

        if (Env == "PROD" || Env == "DR") {
            basicAuthUser = Runsettings.data.Global.basicAuthUserDRPROD.value;
            basicAuthPass = Runsettings.data.Global.basicAuthPassDRPROD.value;
        }
        else {
            basicAuthUser = Runsettings.data.Global.basicAuthUser.value;
            basicAuthPass = Runsettings.data.Global.basicAuthPass.value;
        }
        var pathFile = resolve('..\\Services\\BNS\\ResponseXMLs');
        var pathResponse = resolve('..\\Services\\BNS\\ResponseXMLs\\GetlawyereventsResponse.xml');

        var batchFileArguments = [pathSoapUI, BNSWebServiceurl, basicAuthUser, basicAuthPass, pathFile, LenderIdNo, LawyerIDNo, LenderRefNo, Runsettings.data.Global.SoapPath.value];
        const child = childprocess.execFileSync(pathBatFile, batchFileArguments);
        if (child.err) {
            console.log("CreateBNSDeal Error occured");
        }

        var xml2js = require('xml2js');
        var parser = new xml2js.Parser();
        Counter++;
        fs.readFile(pathResponse, 'utf-8', function (err, data) {
            if (err) {
                if ( Counter < 5) { 
                    GetBNSLawyerDealEventsTillSuccess();
                }
                else{
                    expect(true).toBe(false, "Error occured while reading GetLawyerDealEvent Response");
                }        
            }
            else {
                parser.parseString(data, function (err, result) {
                    if (err) {
                        if ( Counter < 5) { 
                            GetBNSLawyerDealEventsTillSuccess();
                        }
                        else{
                            expect(true).toBe(false, "Error occured while reading GetLawyerDealEvent Response");
                        }                        
                    }
                    else {
                        NumberOfMessages = result['s:Envelope']['s:Body'][0]['GetLawyerDealEventsResponse'][0]['NumberOfMessages'][0]['_'];
                        GetLawyerDealEventsResponse = result;
                        
                        if (NumberOfMessages == 0 && Counter < 5) { 
                            GetBNSLawyerDealEventsTillSuccess();
                        }

                    }
                });
            }
        });
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

     //Verify Events in GetLawyerDealEvent Service
     this.LogLawyerDealEvent = function (eventNumber, status, type) {
    var DealStatus;
    var EventType;
    var pathResponseFile = resolve('..\\Services\\BNS\\ResponseXMLs\\GetlawyereventsResponse.xml');
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

    this.SendDealStatusChange = function (LenderDealStatus, DealStatusChangeReason) {

        var childprocess = require("child_process");
        var pathBatFile = resolve('..\\Services\\BNS\\BatchFiles\\BNSDeal_SendDealStatusChange.bat');
        var pathSoapUI = resolve('..\\Services\\BNS\\SoapProject\\LenderIntegrationBNS.xml');
        var basicAuthUser = null;
        var basicAuthPass = null;

        if (Env == "PROD" || Env == "DR") {
            basicAuthUser = Runsettings.data.Global.basicAuthUserDRPROD.value;
            basicAuthPass = Runsettings.data.Global.basicAuthPassDRPROD.value;
        }
        else {
            basicAuthUser = Runsettings.data.Global.basicAuthUser.value;
            basicAuthPass = Runsettings.data.Global.basicAuthPass.value;
        }
        var pathFile = resolve('..\\Services\\BNS\\ResponseXMLs');
        var batchFileArguments = [pathSoapUI, BNSWebServiceurl, basicAuthUser, basicAuthPass, pathFile, LenderIdNo, LawyerIDNo, ResponseFCTURN, LenderRefNo, LenderDealStatus, DealStatusChangeReason, Runsettings.data.Global.SoapPath.value];
        const child = childprocess.execFileSync(pathBatFile, batchFileArguments);
        if (child.err) {
            console.log("Error occured: " + child.err);
        }
    }

    this.SendBNSNote = function (NoteID, NoteType, NoteStatus, LenderNoteSubject, LenderNoteDetails) {

        var childprocess = require("child_process");
        var pathBatFile = resolve('..\\Services\\BNS\\BatchFiles\\BNSDeal_SendNote.bat');
        var pathSoapUI = resolve('..\\Services\\BNS\\SoapProject\\LenderIntegrationBNS.xml');
        var basicAuthUser = null;
        var basicAuthPass = null;

        if (Env == "PROD" || Env == "DR") {
            basicAuthUser = Runsettings.data.Global.basicAuthUserDRPROD.value;
            basicAuthPass = Runsettings.data.Global.basicAuthPassDRPROD.value;
        }
        else {
            basicAuthUser = Runsettings.data.Global.basicAuthUser.value;
            basicAuthPass = Runsettings.data.Global.basicAuthPass.value;
        }
        var pathFile = resolve('..\\Services\\BNS\\ResponseXMLs');
        var batchFileArguments = [pathSoapUI, BNSWebServiceurl, basicAuthUser, basicAuthPass, pathFile, LenderIdNo, ResponseFCTURN, LenderRefNo, NoteID, NoteType, NoteStatus, LenderNoteSubject, LenderNoteDetails, Runsettings.data.Global.SoapPath.value];
        const child = childprocess.execFileSync(pathBatFile, batchFileArguments);
        if (child.err) {
            console.log("Error occured");
        }
    }

    this.GenerateBNSCreateDealXML = function (IsSolicitorClose, IsRFF) {
        var ns = "q187";
        var MessageId = "{85434d76-8fde-f7f9-" + CustLib.getRandomNumber(4) + "-" + CustLib.getRandomNumber(4) + "D52E" + CustLib.getRandomNumber(4) + "}";
        var LawyerId = LawyerIDNo;
        LenderRefNo = 'BNS-DEC-' + CustLib.getRandomString(2) + '-A1-' + CustLib.getRandomNumber(3);
        MortgageNo = LenderRefNo;
        var LenderId = LenderIdNo;
        //ClosingDate = '2020-12-08';
        ClosingDate = CustLib.CurrentOrFutureDate();
        MrtgagorFirst = 'Marilyn';
        MrtgagorMid = 'J.';
        MrtgagorLast = 'Monroe';
        StreetNumber = '1233';
        StreetAddress1 = 'Victoria Street';
        City = 'Toronto';
        CityCurrent = City;
        Province = 'ON';
        ProvinceCurrent = Province;
        PostalCode = 'L4Z 2Y5';

        //var str = "<" + ns + ":LenderRequest><MessageID>" + MessageId + "</MessageID><TransactionType>NEW</TransactionType><LenderReferenceNumber>" + LenderRefNo + "</LenderReferenceNumber><BasicTransactionData><LenderId>" + LenderId + "</LenderId><LawyerId>" + LawyerId + "</LawyerId></BasicTransactionData><BridgeLoan><MortgageAmount>100000</MortgageAmount><InterestRate>0.025</InterestRate><InterestAdjustmentDate>2019-10-10</InterestAdjustmentDate><FirstPaymentDate>2019-10-10</FirstPaymentDate><MaturityDate>2020-05-05</MaturityDate><Address><UnitNumber>15</UnitNumber><StreetNumber>23</StreetNumber><StreetAddress1>KAM SING MANSION</StreetAddress1><StreetAddress2>TAI KOO</StreetAddress2><Country>Canada</Country><City>Oakville</City><Province>ON</Province><PostalCode>L6R 1Y7</PostalCode></Address></BridgeLoan><MortgageCentre><Name>Ottawa 114</Name><FirstName>Mortgage</FirstName><MiddleName>Middle</MiddleName><LastName>Centre</LastName><Phone>9052871000</Phone><Fax>9052872400</Fax><Email>mtgcnt@firstcdn.com</Email><Address><UnitNumber>12</UnitNumber><StreetNumber>1234</StreetNumber><StreetAddress1>First Street</StreetAddress1><StreetAddress2>Address 2</StreetAddress2><Country>Canada</Country><City>Etobicoke</City><Province>ON</Province><PostalCode>L4Z 2Y6</PostalCode></Address><TransitNumber>23456</TransitNumber></MortgageCentre><DealSource><MortgageSpecialist><Name>Ottawa 15</Name><FirstName>Mortgage</FirstName><MiddleName>Middle</MiddleName><LastName>Specialist</LastName><Phone>9052871000</Phone><Fax>9052872400</Fax><Email>mtgspecialist@firstcdn.com</Email><Address><UnitNumber>55</UnitNumber><StreetNumber>777</StreetNumber><StreetAddress1>Second Street</StreetAddress1><StreetAddress2>5th Floor</StreetAddress2><Country>Canada</Country><City>Kitchener</City><Province>ON</Province><PostalCode>L4Z 2Y8</PostalCode></Address><TransitNumber>23457</TransitNumber></MortgageSpecialist></DealSource><ServiceAddress>MORTGAGE CENTRE</ServiceAddress><MailingAddress>DEAL SOURCE</MailingAddress><Mortgage><Mortgagee>123</Mortgagee><MortgageNumber>" + MortgageNo + "</MortgageNumber><MortgageProduct>SPRO</MortgageProduct><OwningBranch><Name>Owning Branch 15</Name><FirstName>Frank</FirstName><MiddleName>Owen</MiddleName><LastName>Scott</LastName><Phone>9052871000</Phone><Fax>9052872400</Fax><Email>ownbrn@firstcdn.com</Email><Address><UnitNumber>15</UnitNumber><StreetNumber>333</StreetNumber><StreetAddress1>Main Street West</StreetAddress1><StreetAddress2>10th Floor</StreetAddress2><Country>Canada</Country><City>Toronto</City><Province>ON</Province><PostalCode>L4Z 5Y6</PostalCode></Address><TransitNumber>23458</TransitNumber></OwningBranch><ClosingDate>" + ClosingDate + "</ClosingDate><MortgageInsurer>Peter</MortgageInsurer><MortgageTermYear>8</MortgageTermYear><MortgageTermMonth>6</MortgageTermMonth><RegistrationAmountText><TextValue><Text>Test Registration Text EnglishTC</Text><Language>ENGLISH</Language></TextValue></RegistrationAmountText><RegisteredInterestRate><TextValue><Text>Test Registered Interest Rate English</Text><Language>ENGLISH</Language></TextValue></RegisteredInterestRate><RegistrationPaymentFrequency>MORE FREQUENT</RegistrationPaymentFrequency><MonthlyPayment><PaymentAmount>1475</PaymentAmount><FirstPaymentDate>2019-06-02</FirstPaymentDate><PaymentDateAndPeriod><TextValue><Text>The first day of each month</Text><Language>ENGLISH</Language></TextValue><TextValue><Text>The first day of each month</Text><Language>FRENCH</Language></TextValue></PaymentDateAndPeriod><PropertyTaxAmount>125</PropertyTaxAmount><InsuranceAmount>150</InsuranceAmount></MonthlyPayment><MoreFrequentPayment><PaymentAmount>1600</PaymentAmount><FirstPaymentDateText><TextValue><Text>Test First Payment Date Text English Test1</Text><Language>ENGLISH</Language></TextValue><TextValue><Text>TestFirstPaymentDateTextFrench</Text><Language>FRENCH</Language></TextValue></FirstPaymentDateText><PropertyTaxAmount>50</PropertyTaxAmount><InsuranceAmount>50</InsuranceAmount><IsAccelerated>true</IsAccelerated><PaymentFrequency>BI_WEEKLY</PaymentFrequency></MoreFrequentPayment><TotalLoanAmount>125460</TotalLoanAmount><DateOfLoanApplication>2019-03-03</DateOfLoanApplication><SolicitorConditions><SolicitorCondition><ClauseSequence>22</ClauseSequence><ClauseData>This is a First Clause Data</ClauseData></SolicitorCondition><SolicitorCondition><ClauseSequence>23</ClauseSequence><ClauseData>This is second Clause Data</ClauseData></SolicitorCondition><SolicitorCondition><ClauseSequence>24</ClauseSequence><ClauseData>This is Third Clause Data</ClauseData></SolicitorCondition></SolicitorConditions><InterestRateType><Variable><BaseRate>10</BaseRate><IncrementAboveBelowPrime>-1.075</IncrementAboveBelowPrime><EquivalentRate>1.5</EquivalentRate><ActualMortgageRate>5.25555</ActualMortgageRate><MaximumChargeRate>2.12345</MaximumChargeRate><EarlyPaymentAmount>0.12345</EarlyPaymentAmount></Variable></InterestRateType><CalculationPeriod>1002</CalculationPeriod><MaturityDate>2023-11-10</MaturityDate><InterestAdjustmentDate>2019-11-10</InterestAdjustmentDate><AmortizationYears>25</AmortizationYears><AmortizationMonths>5</AmortizationMonths><IsConstructionMortgage>true</IsConstructionMortgage><IsAssignmentOfRents>false</IsAssignmentOfRents><CashBackAmount>1800</CashBackAmount><StandardChargeTermsNumber><TextValue><Text>MT030091</Text><Language>ENGLISH</Language></TextValue><TextValue><Text>MT030091</Text><Language>FRENCH</Language></TextValue></StandardChargeTermsNumber><RateExpiryDate>2019-11-10</RateExpiryDate><HighRatioIndicator>LOW</HighRatioIndicator><ILAs><ILA><FirstName>DavidILA1</FirstName><MiddleName>LampILA1</MiddleName><LastName>PardILA1</LastName></ILA><ILA><FirstName>DavidILA2</FirstName><MiddleName>LampILA2</MiddleName><LastName>PardILA2</LastName></ILA></ILAs><IsSolicitorClose>" + IsSolicitorClose + "</IsSolicitorClose></Mortgage><Funding><FundingInfo><PaymentMethod>DIRECT DEPOSIT</PaymentMethod><DirectDeposit><AccountNumber>4567890</AccountNumber><TransitNumber>01455</TransitNumber><BankNumber>002</BankNumber><BankName>BNS</BankName></DirectDeposit></FundingInfo><IsHold>false</IsHold><IsRFF>" + IsRFF + "</IsRFF></Funding><MortgageLoanFees><InsurancePremium>110.50</InsurancePremium><TaxOnInsurancePremium>125.75</TaxOnInsurancePremium><InsuranceApplicationFee>108.95</InsuranceApplicationFee><AppraisalFee>105.50</AppraisalFee><LenderFee>107.05</LenderFee><MiscellaneousFee>115.80</MiscellaneousFee><HoldbackFee>116.15</HoldbackFee><BuydownAtCommitmentFee>107.29</BuydownAtCommitmentFee><BridgeLoanApplicationFee>108.65</BridgeLoanApplicationFee><NetMortgageAdvance>1.023</NetMortgageAdvance></MortgageLoanFees><Mortgagors><Mortgagor><Person><FirstName>" + MrtgagorFirst + "</FirstName><MiddleName>" + MrtgagorMid + "</MiddleName><LastName>" + MrtgagorLast + "</LastName><Phone>9052871000</Phone><BusinessPhone>9052871000</BusinessPhone></Person><Address><UnitNumber>1875</UnitNumber><StreetNumber>17</StreetNumber><StreetAddress1>Lakeshore Blvd. West</StreetAddress1><StreetAddress2>10th Floor</StreetAddress2><Country>Canada</Country><City>Toronto</City><Province>ON</Province><PostalCode>L4Z 6C9</PostalCode></Address><Id>2238</Id><PriorityIndicator>2</PriorityIndicator><UnsecuredDebts><UnsecuredDebt><Creditor>BOC</Creditor><Action>CLSACCNT</Action><Amount>3388</Amount></UnsecuredDebt></UnsecuredDebts></Mortgagor><Mortgagor><Person><FirstName>George</FirstName><MiddleName>Matthew</MiddleName><LastName>Donald</LastName><Phone>9052871000</Phone><BusinessPhone>9052871000</BusinessPhone></Person><Address><UnitNumber>85</UnitNumber><StreetNumber>245</StreetNumber><StreetAddress1>Glen Erin Drive</StreetAddress1><StreetAddress2>Northwest</StreetAddress2><Country>Canada</Country><City>Toronto</City><Province>ON</Province><PostalCode>L4Z 8Y6</PostalCode></Address><Id>2239</Id><PriorityIndicator>1</PriorityIndicator><UnsecuredDebts><UnsecuredDebt><Creditor>BOC</Creditor><Action>CLSACCNT</Action><Amount>3388</Amount></UnsecuredDebt></UnsecuredDebts><IsILARequired>true</IsILARequired><SpouseInformation><FirstName>Monica</FirstName><MiddleName>Jessy</MiddleName><LastName>Ruther</LastName><IsILARequired>false</IsILARequired></SpouseInformation></Mortgagor><Mortgagor><Person><FirstName>Rachel</FirstName><MiddleName>Bruce</MiddleName><LastName>Larry</LastName><Phone>9052871000</Phone><BusinessPhone>9052871000</BusinessPhone></Person><Address><UnitNumber>851</UnitNumber><StreetNumber>2415</StreetNumber><StreetAddress1>Burnhamthrope Road</StreetAddress1><StreetAddress2>Southwest Street2</StreetAddress2><Country>Canada</Country><City>Toronto</City><Province>ON</Province><PostalCode>L4Z 8P6</PostalCode></Address><Id>1024</Id><PriorityIndicator>2</PriorityIndicator><UnsecuredDebts><UnsecuredDebt><Creditor>BOC</Creditor><Action>CLSACCNT</Action><Amount>3388</Amount></UnsecuredDebt></UnsecuredDebts><IsILARequired>true</IsILARequired><SpouseInformation><FirstName>NewMonica</FirstName><MiddleName>NewJessy</MiddleName><LastName>MewRuther</LastName><IsILARequired>false</IsILARequired></SpouseInformation></Mortgagor><Mortgagor><Company><Name>First Canadian Title</Name><ContactFirstName>Thomas</ContactFirstName><ContactLastName>James</ContactLastName><Phone>9052871000</Phone></Company><Address><StreetNumber>2425</StreetNumber><StreetAddress1>Bloor Avenue</StreetAddress1><Country>Canada</Country><City>Toronto</City><Province>ON</Province><PostalCode>L4Z 8P6</PostalCode></Address><Id>2241</Id><PriorityIndicator>5</PriorityIndicator><UnsecuredDebts><UnsecuredDebt><Creditor>BOC</Creditor><Action>CLSACCNT</Action><Amount>3388</Amount></UnsecuredDebt></UnsecuredDebts><IsILARequired>true</IsILARequired></Mortgagor><Mortgagor><Company><Name>FCT CORP</Name><ContactFirstName>Tom</ContactFirstName><ContactLastName>Jones</ContactLastName><Phone>9052871000</Phone></Company><Address><StreetNumber>2425</StreetNumber><StreetAddress1>Bloor Avenue</StreetAddress1><Country>Canada</Country><City>Toronto</City><Province>ON</Province><PostalCode>L4Z 8F6</PostalCode></Address><Id>2242</Id><PriorityIndicator>5</PriorityIndicator><UnsecuredDebts><UnsecuredDebt><Creditor>BOC</Creditor><Action>CLSACCNT</Action><Amount>3388</Amount></UnsecuredDebt></UnsecuredDebts><IsILARequired>true</IsILARequired></Mortgagor></Mortgagors><MortgagorPreferredLanguage>ENGLISH</MortgagorPreferredLanguage><Guarantors><Guarantor><Person><FirstName>Terry</FirstName><MiddleName>Tek</MiddleName><LastName>Lau</LastName><Phone>9052871000</Phone><BusinessPhone>9052871000</BusinessPhone></Person><Address><StreetNumber>28</StreetNumber><StreetAddress1>Canada Street</StreetAddress1><StreetAddress2>Second Floor</StreetAddress2><Country>Canada</Country><City>Toronto</City><Province>ON</Province><PostalCode>L4Z 8Y6</PostalCode></Address><Id>1024</Id><IsILARequired>true</IsILARequired></Guarantor></Guarantors><Properties><Property><Id>2238</Id><LegalDescription>Lot 3423423, Plan 2343DD: Heart of the City close to Mall/Sub/Bus/TTC etc. All aminities included</LegalDescription><PropertyType>SINGLE FAMILY RESIDENCE</PropertyType><OccupancyType>OWNER OCCUPIED</OccupancyType><PropertyAddress><StreetNumber>" + StreetNumber + "</StreetNumber><StreetAddress1>" + StreetAddress1 + "</StreetAddress1><Country>Canada</Country><City>" + City + "</City><Province>" + Province + "</Province><PostalCode>" + PostalCode + "</PostalCode></PropertyAddress><PropertyIdentificationNumbers><Number>026-109-221</Number><Number>026-101-998</Number></PropertyIdentificationNumbers><MortgagePriority>FIRST</MortgagePriority><IsLenderToCollectPropertyTaxes>false</IsLenderToCollectPropertyTaxes><ExistingMortgages><ExistingMortgage><Amount>700</Amount><Mortgagee>Testing this new schema change</Mortgagee><Action>POSTPONED</Action></ExistingMortgage></ExistingMortgages><EstateType>OTHER</EstateType><OtherEstateTypeDescription>Testing New Field</OtherEstateTypeDescription></Property></Properties><Attachments><Attachment><DocumentAttachment>JVBERi0xLjMNJeLjz9MNCjYgMCBvYmoNPDwgDS9MaW5lYXJpemVkIDEgDS9PIDggDS9IIFsgNzczIDE3OCBdIA0vTCA3NTgyIA0vRSA2MzU0IA0vTiAxIA0vVCA3MzQ1IA0+PiANZW5kb2JqDSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4cmVmDTYgMTcgDTAwMDAwMDAwMTYgMDAwMDAgbg0KMDAwMDAwMDY4NCAwMDAwMCBuDQowMDAwMDAwOTUxIDAwMDAwIG4NCjAwMDAwMDExMDIgMDAwMDAgbg0KMDAwMDAwMTIxNSAwMDAwMCBuDQowMDAwMDAxNTU0IDAwMDAwIG4NCjAwMDAwMDE3ODcgMDAwMDAgbg0KMDAwMDAwMjAzOSAwMDAwMCBuDQowMDAwMDAyMTkxIDAwMDAwIG4NCjAwMDAwMDI0MjcgMDAwMDAgbg0KMDAwMDAwMjcxNiAwMDAwMCBuDQowMDAwMDAyODM1IDAwMDAwIG4NCjAwMDAwMDMxNjcgMDAwMDAgbg0KMDAwMDAwMzQ2NCAwMDAwMCBuDQowMDAwMDA2MjQ2IDAwMDAwIG4NCjAwMDAwMDA3NzMgMDAwMDAgbg0KMDAwMDAwMDkzMSAwMDAwMCBuDQp0cmFpbGVyDTw8DS9TaXplIDIzDS9JbmZvIDQgMCBSIA0vUm9vdCA3IDAgUiANL1ByZXYgNzMzNiANL0lEWzw5MDBhZjExY2MxN2RhMjYxMzgwNGNlYzJmNzYwZWQ1Nz48YWIyYmI4NDBjMjc2ZTAxNjk2NWVlNDg4NTAzMDdhZmE+XQ0+Pg1zdGFydHhyZWYNMA0lJUVPRg0gICAgICANNyAwIG9iag08PCANL1R5cGUgL0NhdGFsb2cgDS9QYWdlcyAzIDAgUiANL01ldGFkYXRhIDUgMCBSIA0vUGFnZUxhYmVscyAyIDAgUiANPj4gDWVuZG9iag0yMSAwIG9iag08PCAvUyAzNiAvTCA4MiAvRmlsdGVyIC9GbGF0ZURlY29kZSAvTGVuZ3RoIDIyIDAgUiA+PiANc3RyZWFtDQpIiWJgYOBnYGBmZQACkb8M2AAHlBYAYl4oZmDwY+BhmaAsEDCb64EX54PLTBP+8e6aAFXJyMAgwQSkQdgDIMAAUKcJow1lbmRzdHJlYW0NZW5kb2JqDTIyIDAgb2JqDTY4IA1lbmRvYmoNOCAwIG9iag08PCANL1R5cGUgL1BhZ2UgDS9QYXJlbnQgMyAwIFIgDS9SZXNvdXJjZXMgOSAwIFIgDS9Db250ZW50cyAxMiAwIFIgDS9NZWRpYUJveCBbIDAgMCA2MTIgNzkyIF0gDS9Dcm9wQm94IFsgMCAwIDYxMiA3OTIgXSANL1JvdGF0ZSAwIA0+PiANZW5kb2JqDTkgMCBvYmoNPDwgDS9Qcm9jU2V0IFsgL1BERiAvVGV4dCBdIA0vRm9udCA8PCAvRjEgMTAgMCBSIC9HMSAxMyAwIFIgPj4gDS9FeHRHU3RhdGUgPDwgL0dTMSAyMCAwIFIgPj4gDT4+IA1lbmRvYmoNMTAgMCBvYmoNPDwgDS9UeXBlIC9Gb250IA0vU3VidHlwZSAvVHlwZTEgDS9GaXJzdENoYXIgNjUgDS9MYXN0Q2hhciA5NyANL1dpZHRocyBbIDEwMDAgMTAwMCAxMDAwIDEwMDAgMTAwMCAxMDAwIDEwMDAgMTAwMCAxMDAwIDEwMDAgMTAwMCAxMDAwIDEwMDAgDTEwMDAgMTAwMCAxMDAwIDEwMDAgMTAwMCAxMDAwIDEwMDAgMTAwMCAxMDAwIDEwMDAgMTAwMCAxMDAwIDEwMDAgDTEwMDAgMTAwMCAxMDAwIDEwMDAgMTAwMCAxMDAwIDEwMDAgXSANL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcgDS9CYXNlRm9udCAvSUZMRkdIK0RhdmUgDS9Gb250RGVzY3JpcHRvciAxMSAwIFIgDT4+IA1lbmRvYmoNMTEgMCBvYmoNPDwgDS9UeXBlIC9Gb250RGVzY3JpcHRvciANL0FzY2VudCAwIA0vQ2FwSGVpZ2h0IDAgDS9EZXNjZW50IDAgDS9GbGFncyAzMiANL0ZvbnRCQm94IFsgMCAwIDEwMDAgMTAwMCBdIA0vRm9udE5hbWUgL0lGTEZHSCtEYXZlIA0vSXRhbGljQW5nbGUgMCANL1N0ZW1WIDgwIA0vWEhlaWdodCAwIA0vU3RlbUggODAgDS9DaGFyU2V0ICgvQS9hKQ0vRm9udEZpbGUzIDE1IDAgUiANPj4gDWVuZG9iag0xMiAwIG9iag08PCAv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UjIgL0RlZmF1bHQgDT4+IA1lbmRvYmoNMSAwIG9iag08PCANL1MgL0QgDT4+IA1lbmRvYmoNMiAwIG9iag08PCANL051bXMgWyAwIDEgMCBSIF0gDT4+IA1lbmRvYmoNMyAwIG9iag08PCANL1R5cGUgL1BhZ2VzIA0vS2lkcyBbIDggMCBSIF0gDS9Db3VudCAxIA0+PiANZW5kb2JqDTQgMCBvYmoNPDwgDS9DcmVhdGlvbkRhdGUgKEQ6MjAwMjExMjYxNDA4NDItMDgnMDAnKQ0vTW9kRGF0ZSAoRDoyMDAyMTEyNjE0MDg0Mi0wOCcwMCcpDS9Qcm9kdWNlciAoQWNyb2JhdCBEaXN0aWxsZXIgNS4wLjUgXChXaW5kb3dzXCkpDT4+IA1lbmRvYmoNNSAwIG9iag08PCAvVHlwZSAvTWV0YWRhdGEgL1N1YnR5cGUgL1hNTCAvTGVuZ3RoIDY0OCA+PiANc3RyZWFtDQo8P3hwYWNrZXQgYmVnaW49JycgaWQ9J1c1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCcgYnl0ZXM9JzY0Nyc/PjxyZGY6UkRGIHhtbG5zOnJkZj0naHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIycgeG1sbnM6aVg9J2h0dHA6Ly9ucy5hZG9iZS5jb20vaVgvMS4wLyc+PHJkZjpEZXNjcmlwdGlvbiBhYm91dD0nJyB4bWxucz0naHR0cDovL25zLmFkb2JlLmNvbS9wZGYvMS4zLycgeG1sbnM6cGRmPSdodHRwOi8vbnMuYWRvYmUuY29tL3BkZi8xLjMvJyBwZGY6Q3JlYXRpb25EYXRlPScyMDAyLTExLTI2VDIyOjA4OjQyWicgcGRmOk1vZERhdGU9JzIwMDItMTEtMjZUMjI6MDg6NDJaJyBwZGY6UHJvZHVjZXI9J0Fjcm9iYXQgRGlzdGlsbGVyIDUuMC41IChXaW5kb3dzKScvPgo8cmRmOkRlc2NyaXB0aW9uIGFib3V0PScnIHhtbG5zPSdodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvJyB4bWxuczp4YXA9J2h0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8nIHhhcDpDcmVhdGVEYXRlPScyMDAyLTExLTI2VDIyOjA4OjQyWicgeGFwOk1vZGlmeURhdGU9JzIwMDItMTEtMjZUMjI6MDg6NDJaJyB4YXA6TWV0YWRhdGFEYXRlPScyMDAyLTExLTI2VDIyOjA4OjQyWicvPgo8L3JkZjpSREY+PD94cGFja2V0IGVuZD0ncic/PgplbmRzdHJlYW0NZW5kb2JqDXhyZWYNMCA2IA0wMDAwMDAwMDAwIDY1NTM1IGYNCjAwMDAwMDYzMjQgMDAwMDAgbg0KMDAwMDAwNjM1NCAwMDAwMCBuDQowMDAwMDA2Mzk2IDAwMDAwIG4NCjAwMDAwMDY0NjAgMDAwMDAgbg0KMDAwMDAwNjYwNiAwMDAwMCBuDQp0cmFpbGVyDTw8DS9TaXplIDYNL0lEWzw5MDBhZjExY2MxN2RhMjYxMzgwNGNlYzJmNzYwZWQ1Nz48YWIyYmI4NDBjMjc2ZTAxNjk2NWVlNDg4NTAzMDdhZmE+XQ0+Pg1zdGFydHhyZWYNMTczDSUlRU9GDQ==</DocumentAttachment><Type>SIP</Type><FileFormat>APPLICATION/PDF</FileFormat><Language>ENGLISH</Language></Attachment></Attachments><Documents><IsOtherAllowed>true</IsOtherAllowed><Document><Type>2341212</Type><Version>1.0</Version><FileFormat>APPLICATION/PDF</FileFormat><NumberOfInstances>1</NumberOfInstances></Document><Document><Type>2350614</Type><Version>(1.0)</Version><FileFormat>APPLICATION/PDF</FileFormat><NumberOfInstances>1</NumberOfInstances></Document></Documents><PurchasePrice>125000</PurchasePrice><Remarks>Multiguarantor/mortgagors not in order/ILAS/SROT on 25thAugust</Remarks></" + ns + ":LenderRequest>";
        var str = "<" + ns + ":LenderRequest><MessageID>" + MessageId + "</MessageID><TransactionType>NEW</TransactionType><LenderReferenceNumber>" + LenderRefNo + "</LenderReferenceNumber><BasicTransactionData><LenderId>" + LenderId + "</LenderId><LawyerId>" + LawyerId + "</LawyerId></BasicTransactionData><BridgeLoan><MortgageAmount>100000</MortgageAmount><InterestRate>0.025</InterestRate><InterestAdjustmentDate>2019-10-10</InterestAdjustmentDate><FirstPaymentDate>2019-10-10</FirstPaymentDate><MaturityDate>2020-05-05</MaturityDate><Address><UnitNumber>15</UnitNumber><StreetNumber>23</StreetNumber><StreetAddress1>KAM SING MANSION</StreetAddress1><StreetAddress2>TAI KOO</StreetAddress2><Country>Canada</Country><City>Oakville</City><Province>ON</Province><PostalCode>L6R 1Y7</PostalCode></Address></BridgeLoan><MortgageCentre><Name>Ottawa 114</Name><FirstName>Mortgage</FirstName><MiddleName>Middle</MiddleName><LastName>Centre</LastName><Phone>9052871000</Phone><Fax>9052872400</Fax><Email>mtgcnt@firstcdn.com</Email><Address><UnitNumber>12</UnitNumber><StreetNumber>1234</StreetNumber><StreetAddress1>First Street</StreetAddress1><StreetAddress2>Address 2</StreetAddress2><Country>Canada</Country><City>Etobicoke</City><Province>ON</Province><PostalCode>L4Z 2Y6</PostalCode></Address><TransitNumber>23456</TransitNumber></MortgageCentre><DealSource><MortgageSpecialist><Name>Ottawa 15</Name><FirstName>Mortgage</FirstName><MiddleName>Middle</MiddleName><LastName>Specialist</LastName><Phone>9052871000</Phone><Fax>9052872400</Fax><Email>mtgspecialist@firstcdn.com</Email><Address><UnitNumber>55</UnitNumber><StreetNumber>777</StreetNumber><StreetAddress1>Second Street</StreetAddress1><StreetAddress2>5th Floor</StreetAddress2><Country>Canada</Country><City>Kitchener</City><Province>ON</Province><PostalCode>L4Z 2Y8</PostalCode></Address><TransitNumber>23457</TransitNumber></MortgageSpecialist></DealSource><ServiceAddress>MORTGAGE CENTRE</ServiceAddress><MailingAddress>DEAL SOURCE</MailingAddress><Mortgage><Mortgagee>123</Mortgagee><MortgageNumber>" + MortgageNo + "</MortgageNumber><MortgageProduct>SPRO</MortgageProduct><OwningBranch><Name>Owning Branch 15</Name><FirstName>Frank</FirstName><MiddleName>Owen</MiddleName><LastName>Scott</LastName><Phone>9052871000</Phone><Fax>9052872400</Fax><Email>ownbrn@firstcdn.com</Email><Address><UnitNumber>15</UnitNumber><StreetNumber>333</StreetNumber><StreetAddress1>Main Street West</StreetAddress1><StreetAddress2>10th Floor</StreetAddress2><Country>Canada</Country><City>Toronto</City><Province>ON</Province><PostalCode>L4Z 5Y6</PostalCode></Address><TransitNumber>23458</TransitNumber></OwningBranch><ClosingDate>" + ClosingDate + "</ClosingDate><MortgageInsurer>Peter</MortgageInsurer><MortgageTermYear>8</MortgageTermYear><MortgageTermMonth>6</MortgageTermMonth><RegistrationAmountText><TextValue><Text>Test Registration Text EnglishTC</Text><Language>ENGLISH</Language></TextValue></RegistrationAmountText><RegisteredInterestRate><TextValue><Text>Test Registered Interest Rate English</Text><Language>ENGLISH</Language></TextValue></RegisteredInterestRate><RegistrationPaymentFrequency>MORE FREQUENT</RegistrationPaymentFrequency><MonthlyPayment><PaymentAmount>1475</PaymentAmount><FirstPaymentDate>2019-06-02</FirstPaymentDate><PaymentDateAndPeriod><TextValue><Text>The first day of each month</Text><Language>ENGLISH</Language></TextValue><TextValue><Text>The first day of each month</Text><Language>FRENCH</Language></TextValue></PaymentDateAndPeriod><PropertyTaxAmount>125</PropertyTaxAmount><InsuranceAmount>150</InsuranceAmount></MonthlyPayment><MoreFrequentPayment><PaymentAmount>1600</PaymentAmount><FirstPaymentDateText><TextValue><Text>Test First Payment Date Text English Test1</Text><Language>ENGLISH</Language></TextValue><TextValue><Text>TestFirstPaymentDateTextFrench</Text><Language>FRENCH</Language></TextValue></FirstPaymentDateText><PropertyTaxAmount>50</PropertyTaxAmount><InsuranceAmount>50</InsuranceAmount><IsAccelerated>true</IsAccelerated><PaymentFrequency>BI_WEEKLY</PaymentFrequency></MoreFrequentPayment><TotalLoanAmount>125460</TotalLoanAmount><DateOfLoanApplication>2019-03-03</DateOfLoanApplication><SolicitorConditions><SolicitorCondition><ClauseSequence>22</ClauseSequence><ClauseData>This is a First Clause Data</ClauseData></SolicitorCondition><SolicitorCondition><ClauseSequence>23</ClauseSequence><ClauseData>This is second Clause Data</ClauseData></SolicitorCondition><SolicitorCondition><ClauseSequence>24</ClauseSequence><ClauseData>This is Third Clause Data</ClauseData></SolicitorCondition></SolicitorConditions><InterestRateType><Variable><BaseRate>10</BaseRate><IncrementAboveBelowPrime>-1.075</IncrementAboveBelowPrime><EquivalentRate>1.5</EquivalentRate><ActualMortgageRate>5.25555</ActualMortgageRate><MaximumChargeRate>2.12345</MaximumChargeRate><EarlyPaymentAmount>0.12345</EarlyPaymentAmount></Variable></InterestRateType><CalculationPeriod>1002</CalculationPeriod><MaturityDate>2023-11-10</MaturityDate><InterestAdjustmentDate>2019-11-10</InterestAdjustmentDate><AmortizationYears>25</AmortizationYears><AmortizationMonths>5</AmortizationMonths><IsConstructionMortgage>true</IsConstructionMortgage><IsAssignmentOfRents>false</IsAssignmentOfRents><CashBackAmount>1800</CashBackAmount><StandardChargeTermsNumber><TextValue><Text>MT030091</Text><Language>ENGLISH</Language></TextValue><TextValue><Text>MT030091</Text><Language>FRENCH</Language></TextValue></StandardChargeTermsNumber><RateExpiryDate>2019-11-10</RateExpiryDate><HighRatioIndicator>LOW</HighRatioIndicator><ILAs><ILA><FirstName>DavidILA1</FirstName><MiddleName>LampILA1</MiddleName><LastName>PardILA1</LastName></ILA><ILA><FirstName>DavidILA2</FirstName><MiddleName>LampILA2</MiddleName><LastName>PardILA2</LastName></ILA></ILAs><IsSolicitorClose>" + IsSolicitorClose + "</IsSolicitorClose></Mortgage><Funding><FundingInfo><PaymentMethod>DIRECT DEPOSIT</PaymentMethod><DirectDeposit><AccountNumber>4567890</AccountNumber><TransitNumber>01455</TransitNumber><BankNumber>002</BankNumber><BankName>BNS</BankName></DirectDeposit></FundingInfo><IsHold>false</IsHold><IsRFF>" + IsRFF + "</IsRFF></Funding><MortgageLoanFees><InsurancePremium>110.50</InsurancePremium><TaxOnInsurancePremium>125.75</TaxOnInsurancePremium><InsuranceApplicationFee>108.95</InsuranceApplicationFee><AppraisalFee>105.50</AppraisalFee><LenderFee>107.05</LenderFee><MiscellaneousFee>115.80</MiscellaneousFee><HoldbackFee>116.15</HoldbackFee><BuydownAtCommitmentFee>107.29</BuydownAtCommitmentFee><BridgeLoanApplicationFee>108.65</BridgeLoanApplicationFee><NetMortgageAdvance>1.023</NetMortgageAdvance></MortgageLoanFees><Mortgagors><Mortgagor><Person><FirstName>" + MrtgagorFirst + "</FirstName><MiddleName>" + MrtgagorMid + "</MiddleName><LastName>" + MrtgagorLast + "</LastName><Phone>9052871000</Phone><BusinessPhone>9052871000</BusinessPhone></Person><Address><UnitNumber>1875</UnitNumber><StreetNumber>17</StreetNumber><StreetAddress1>Lakeshore Blvd. West</StreetAddress1><StreetAddress2>10th Floor</StreetAddress2><Country>Canada</Country><City>Toronto</City><Province>ON</Province><PostalCode>L4Z 6C9</PostalCode></Address><Id>2238</Id><PriorityIndicator>2</PriorityIndicator><UnsecuredDebts><UnsecuredDebt><Creditor>BOC</Creditor><Action>CLSACCNT</Action><Amount>3388</Amount></UnsecuredDebt></UnsecuredDebts></Mortgagor><Mortgagor><Person><FirstName>George</FirstName><MiddleName>Matthew</MiddleName><LastName>Donald</LastName><Phone>9052871000</Phone><BusinessPhone>9052871000</BusinessPhone></Person><Address><UnitNumber>85</UnitNumber><StreetNumber>245</StreetNumber><StreetAddress1>Glen Erin Drive</StreetAddress1><StreetAddress2>Northwest</StreetAddress2><Country>Canada</Country><City>Toronto</City><Province>ON</Province><PostalCode>L4Z 8Y6</PostalCode></Address><Id>2239</Id><PriorityIndicator>1</PriorityIndicator><UnsecuredDebts><UnsecuredDebt><Creditor>BOC</Creditor><Action>CLSACCNT</Action><Amount>3388</Amount></UnsecuredDebt></UnsecuredDebts><IsILARequired>true</IsILARequired><SpouseInformation><FirstName>Monica</FirstName><MiddleName>Jessy</MiddleName><LastName>Ruther</LastName><IsILARequired>false</IsILARequired></SpouseInformation></Mortgagor><Mortgagor><Person><FirstName>Rachel</FirstName><MiddleName>Bruce</MiddleName><LastName>Larry</LastName><Phone>9052871000</Phone><BusinessPhone>9052871000</BusinessPhone></Person><Address><UnitNumber>851</UnitNumber><StreetNumber>2415</StreetNumber><StreetAddress1>Burnhamthrope Road</StreetAddress1><StreetAddress2>Southwest Street2</StreetAddress2><Country>Canada</Country><City>Toronto</City><Province>ON</Province><PostalCode>L4Z 8P6</PostalCode></Address><Id>1024</Id><PriorityIndicator>2</PriorityIndicator><UnsecuredDebts><UnsecuredDebt><Creditor>BOC</Creditor><Action>CLSACCNT</Action><Amount>3388</Amount></UnsecuredDebt></UnsecuredDebts><IsILARequired>true</IsILARequired><SpouseInformation><FirstName>NewMonica</FirstName><MiddleName>NewJessy</MiddleName><LastName>MewRuther</LastName><IsILARequired>false</IsILARequired></SpouseInformation></Mortgagor><Mortgagor><Company><Name>First Canadian Title</Name><ContactFirstName>Thomas</ContactFirstName><ContactLastName>James</ContactLastName><Phone>9052871000</Phone></Company><Address><StreetNumber>2425</StreetNumber><StreetAddress1>Bloor Avenue</StreetAddress1><Country>Canada</Country><City>Toronto</City><Province>ON</Province><PostalCode>L4Z 8P6</PostalCode></Address><Id>2241</Id><PriorityIndicator>5</PriorityIndicator><UnsecuredDebts><UnsecuredDebt><Creditor>BOC</Creditor><Action>CLSACCNT</Action><Amount>3388</Amount></UnsecuredDebt></UnsecuredDebts><IsILARequired>true</IsILARequired></Mortgagor><Mortgagor><Company><Name>FCT CORP</Name><ContactFirstName>Tom</ContactFirstName><ContactLastName>Jones</ContactLastName><Phone>9052871000</Phone></Company><Address><StreetNumber>2425</StreetNumber><StreetAddress1>Bloor Avenue</StreetAddress1><Country>Canada</Country><City>Toronto</City><Province>ON</Province><PostalCode>L4Z 8F6</PostalCode></Address><Id>2242</Id><PriorityIndicator>5</PriorityIndicator><UnsecuredDebts><UnsecuredDebt><Creditor>BOC</Creditor><Action>CLSACCNT</Action><Amount>3388</Amount></UnsecuredDebt></UnsecuredDebts><IsILARequired>true</IsILARequired></Mortgagor></Mortgagors><MortgagorPreferredLanguage>ENGLISH</MortgagorPreferredLanguage><Guarantors><Guarantor><Person><FirstName>Terry</FirstName><MiddleName>Tek</MiddleName><LastName>Lau</LastName><Phone>9052871000</Phone><BusinessPhone>9052871000</BusinessPhone></Person><Address><StreetNumber>28</StreetNumber><StreetAddress1>Canada Street</StreetAddress1><StreetAddress2>Second Floor</StreetAddress2><Country>Canada</Country><City>Toronto</City><Province>ON</Province><PostalCode>L4Z 8Y6</PostalCode></Address><Id>1024</Id><IsILARequired>true</IsILARequired></Guarantor></Guarantors><Properties><Property><Id>2238</Id><LegalDescription>Lot 3423423, Plan 2343DD: Heart of the City close to Mall/Sub/Bus/TTC etc. All aminities included</LegalDescription><PropertyType>SINGLE FAMILY RESIDENCE</PropertyType><OccupancyType>OWNER OCCUPIED</OccupancyType><PropertyAddress><StreetNumber>" + StreetNumber + "</StreetNumber><StreetAddress1>" + StreetAddress1 + "</StreetAddress1><Country>Canada</Country><City>" + City + "</City><Province>" + Province + "</Province><PostalCode>" + PostalCode + "</PostalCode></PropertyAddress><PropertyIdentificationNumbers><Number>026-109-221</Number><Number>026-101-998</Number></PropertyIdentificationNumbers><MortgagePriority>FIRST</MortgagePriority><IsLenderToCollectPropertyTaxes>false</IsLenderToCollectPropertyTaxes><ExistingMortgages><ExistingMortgage><Amount>700</Amount><Mortgagee>Testing this new schema change</Mortgagee><Action>POSTPONED</Action></ExistingMortgage></ExistingMortgages><EstateType>OTHER</EstateType><OtherEstateTypeDescription>Testing New Field</OtherEstateTypeDescription></Property></Properties><Attachments><Attachment><DocumentAttachment>p/9biuk19creUgW/ZxG1QA==</DocumentAttachment><Type>SIP</Type><FileFormat>APPLICATION/PDF</FileFormat><Language>ENGLISH</Language></Attachment><Attachment><DocumentAttachment>p/9biuk19creUgW/ZxG1QA==</DocumentAttachment><Type>BLIP</Type><FileFormat>APPLICATION/PDF</FileFormat><Language>ENGLISH</Language></Attachment></Attachments><Documents><IsOtherAllowed>true</IsOtherAllowed><Document><Type>2153718</Type><Version>1.0</Version><FileFormat>APPLICATION/PDF</FileFormat><NumberOfInstances>1</NumberOfInstances></Document><Document><Type>1150413</Type><Version>1.0</Version><FileFormat>APPLICATION/PDF</FileFormat><NumberOfInstances>1</NumberOfInstances></Document><Document><Type>2161117</Type><Version>1.0</Version><FileFormat>APPLICATION/PDF</FileFormat><NumberOfInstances>1</NumberOfInstances></Document><Document><Type>2349914</Type><Version>1.0</Version><FileFormat>APPLICATION/PDF</FileFormat><NumberOfInstances>1</NumberOfInstances></Document><Document><Type>2350319</Type><Version>1.0</Version><FileFormat>APPLICATION/PDF</FileFormat><NumberOfInstances>1</NumberOfInstances></Document><Document><Type>2348617</Type><Version>1.0</Version><FileFormat>APPLICATION/PDF</FileFormat><NumberOfInstances>1</NumberOfInstances></Document></Documents><PurchasePrice>125000</PurchasePrice><Remarks>Multiguarantor/mortgagors not in order/ILAS/SROT on 25thAugust</Remarks></" + ns + ":LenderRequest>";

        return str
    }

    //CityUpdate, ProvinceUpdate, MortgageCentreFirstName are optional parameters. Send these if update required.
    this.GenerateBNSUpdateDealXML = function (IsSolicitorClose, IsRFF, CityUpdate, ProvinceUpdate, MortgageCentreFirstName) {
        var ns = "q187";

        var MessageId = "{85434d76-8fde-f7f9-" + CustLib.getRandomNumber(4) + "-" + CustLib.getRandomNumber(4) + "D52E" + CustLib.getRandomNumber(4) + "}";
        var LawyerId = LawyerIDNo;
        MortgageNo = LenderRefNo;
        var LenderId = LenderIdNo;
        MrtgagorFirst = 'Marilyn';
        MrtgagorMid = 'J.';
        MrtgagorLast = 'Monroe';
        StreetNumber = '1233';
        StreetAddress1 = 'Victoria Street';
        if (!CityUpdate) {
            City = CityCurrent;
        }
        else {
            City = CityUpdate;
            CityCurrent = CityUpdate;
        }
        if (!ProvinceUpdate) {
            Province = ProvinceCurrent;
        }
        else {
            Province = ProvinceUpdate;
            ProvinceCurrent = ProvinceUpdate;
        }
        PostalCode = 'L4Z 2Y5';
        if (!MortgageCentreFirstName) {
            MortgageCentreFirstName = 'Mortgage';
        }

        var str = "<" + ns + ":LenderRequest><MessageID>" + MessageId + "</MessageID><TransactionType>UPDATE</TransactionType><LenderReferenceNumber>" + LenderRefNo + "</LenderReferenceNumber><BasicTransactionData><FCTURN>" + ResponseFCTURN + "</FCTURN><LenderId>" + LenderId + "</LenderId><LawyerId>" + LawyerId + "</LawyerId></BasicTransactionData><BridgeLoan><MortgageAmount>100000</MortgageAmount><InterestRate>0.025</InterestRate><InterestAdjustmentDate>2019-10-10</InterestAdjustmentDate><FirstPaymentDate>2019-10-10</FirstPaymentDate><MaturityDate>2020-05-05</MaturityDate><Address><UnitNumber>15</UnitNumber><StreetNumber>23</StreetNumber><StreetAddress1>KAM SING MANSION</StreetAddress1><StreetAddress2>TAI KOO</StreetAddress2><Country>Canada</Country><City>Oakville</City><Province>ON</Province><PostalCode>L6R 1Y7</PostalCode></Address></BridgeLoan><MortgageCentre><Name>Ottawa 114</Name><FirstName>" + MortgageCentreFirstName + "</FirstName><MiddleName>Middle</MiddleName><LastName>Centre</LastName><Phone>9052871000</Phone><Fax>9052872400</Fax><Email>mtgcnt@firstcdn.com</Email><Address><UnitNumber>12</UnitNumber><StreetNumber>1234</StreetNumber><StreetAddress1>First Street</StreetAddress1><StreetAddress2>Address 2</StreetAddress2><Country>Canada</Country><City>Etobicoke</City><Province>ON</Province><PostalCode>L4Z 2Y6</PostalCode></Address><TransitNumber>23456</TransitNumber></MortgageCentre><DealSource><MortgageSpecialist><Name>Ottawa 15</Name><FirstName>Mortgage</FirstName><MiddleName>Middle</MiddleName><LastName>Specialist</LastName><Phone>9052871000</Phone><Fax>9052872400</Fax><Email>mtgspecialist@firstcdn.com</Email><Address><UnitNumber>55</UnitNumber><StreetNumber>777</StreetNumber><StreetAddress1>Second Street</StreetAddress1><StreetAddress2>5th Floor</StreetAddress2><Country>Canada</Country><City>Kitchener</City><Province>ON</Province><PostalCode>L4Z 2Y8</PostalCode></Address><TransitNumber>23457</TransitNumber></MortgageSpecialist></DealSource><ServiceAddress>MORTGAGE CENTRE</ServiceAddress><MailingAddress>DEAL SOURCE</MailingAddress><Mortgage><Mortgagee>123</Mortgagee><MortgageNumber>" + MortgageNo + "</MortgageNumber><MortgageProduct>SPRO</MortgageProduct><OwningBranch><Name>Owning Branch 15</Name><FirstName>Frank</FirstName><MiddleName>Owen</MiddleName><LastName>Scott</LastName><Phone>9052871000</Phone><Fax>9052872400</Fax><Email>ownbrn@firstcdn.com</Email><Address><UnitNumber>15</UnitNumber><StreetNumber>333</StreetNumber><StreetAddress1>Main Street West</StreetAddress1><StreetAddress2>10th Floor</StreetAddress2><Country>Canada</Country><City>Toronto</City><Province>ON</Province><PostalCode>L4Z 5Y6</PostalCode></Address><TransitNumber>23458</TransitNumber></OwningBranch><ClosingDate>" + ClosingDate + "</ClosingDate><MortgageInsurer>Peter</MortgageInsurer><MortgageTermYear>8</MortgageTermYear><MortgageTermMonth>6</MortgageTermMonth><RegistrationAmountText><TextValue><Text>Test Registration Text EnglishTC</Text><Language>ENGLISH</Language></TextValue></RegistrationAmountText><RegisteredInterestRate><TextValue><Text>Test Registered Interest Rate English</Text><Language>ENGLISH</Language></TextValue></RegisteredInterestRate><RegistrationPaymentFrequency>MORE FREQUENT</RegistrationPaymentFrequency><MonthlyPayment><PaymentAmount>1475</PaymentAmount><FirstPaymentDate>2019-06-02</FirstPaymentDate><PaymentDateAndPeriod><TextValue><Text>The first day of each month</Text><Language>ENGLISH</Language></TextValue><TextValue><Text>The first day of each month</Text><Language>FRENCH</Language></TextValue></PaymentDateAndPeriod><PropertyTaxAmount>125</PropertyTaxAmount><InsuranceAmount>150</InsuranceAmount></MonthlyPayment><MoreFrequentPayment><PaymentAmount>1600</PaymentAmount><FirstPaymentDateText><TextValue><Text>Test First Payment Date Text English Test1</Text><Language>ENGLISH</Language></TextValue><TextValue><Text>TestFirstPaymentDateTextFrench</Text><Language>FRENCH</Language></TextValue></FirstPaymentDateText><PropertyTaxAmount>50</PropertyTaxAmount><InsuranceAmount>50</InsuranceAmount><IsAccelerated>true</IsAccelerated><PaymentFrequency>BI_WEEKLY</PaymentFrequency></MoreFrequentPayment><TotalLoanAmount>125460</TotalLoanAmount><DateOfLoanApplication>2019-03-03</DateOfLoanApplication><SolicitorConditions><SolicitorCondition><ClauseSequence>22</ClauseSequence><ClauseData>This is a First Clause Data</ClauseData></SolicitorCondition><SolicitorCondition><ClauseSequence>23</ClauseSequence><ClauseData>This is second Clause Data</ClauseData></SolicitorCondition><SolicitorCondition><ClauseSequence>24</ClauseSequence><ClauseData>This is Third Clause Data</ClauseData></SolicitorCondition></SolicitorConditions><InterestRateType><Variable><BaseRate>10</BaseRate><IncrementAboveBelowPrime>-1.075</IncrementAboveBelowPrime><EquivalentRate>1.5</EquivalentRate><ActualMortgageRate>5.25555</ActualMortgageRate><MaximumChargeRate>2.12345</MaximumChargeRate><EarlyPaymentAmount>0.12345</EarlyPaymentAmount></Variable></InterestRateType><CalculationPeriod>1002</CalculationPeriod><MaturityDate>2023-11-10</MaturityDate><InterestAdjustmentDate>2019-11-10</InterestAdjustmentDate><AmortizationYears>25</AmortizationYears><AmortizationMonths>5</AmortizationMonths><IsConstructionMortgage>true</IsConstructionMortgage><IsAssignmentOfRents>false</IsAssignmentOfRents><CashBackAmount>1800</CashBackAmount><StandardChargeTermsNumber><TextValue><Text>MT030091</Text><Language>ENGLISH</Language></TextValue><TextValue><Text>MT030091</Text><Language>FRENCH</Language></TextValue></StandardChargeTermsNumber><RateExpiryDate>2019-11-10</RateExpiryDate><HighRatioIndicator>LOW</HighRatioIndicator><ILAs><ILA><FirstName>DavidILA1</FirstName><MiddleName>LampILA1</MiddleName><LastName>PardILA1</LastName></ILA><ILA><FirstName>DavidILA2</FirstName><MiddleName>LampILA2</MiddleName><LastName>PardILA2</LastName></ILA></ILAs><IsSolicitorClose>" + IsSolicitorClose + "</IsSolicitorClose></Mortgage><Funding><FundingInfo><PaymentMethod>DIRECT DEPOSIT</PaymentMethod><DirectDeposit><AccountNumber>4567890</AccountNumber><TransitNumber>01455</TransitNumber><BankNumber>002</BankNumber><BankName>BNS</BankName></DirectDeposit></FundingInfo><IsHold>false</IsHold><IsRFF>" + IsRFF + "</IsRFF></Funding><MortgageLoanFees><InsurancePremium>110.50</InsurancePremium><TaxOnInsurancePremium>125.75</TaxOnInsurancePremium><InsuranceApplicationFee>108.95</InsuranceApplicationFee><AppraisalFee>105.50</AppraisalFee><LenderFee>107.05</LenderFee><MiscellaneousFee>115.80</MiscellaneousFee><HoldbackFee>116.15</HoldbackFee><BuydownAtCommitmentFee>107.29</BuydownAtCommitmentFee><BridgeLoanApplicationFee>108.65</BridgeLoanApplicationFee><NetMortgageAdvance>1.023</NetMortgageAdvance></MortgageLoanFees><Mortgagors><Mortgagor><Person><FirstName>" + MrtgagorFirst + "</FirstName><MiddleName>" + MrtgagorMid + "</MiddleName><LastName>" + MrtgagorLast + "</LastName><Phone>9052871000</Phone><BusinessPhone>9052871000</BusinessPhone></Person><Address><UnitNumber>1875</UnitNumber><StreetNumber>17</StreetNumber><StreetAddress1>Lakeshore Blvd. West</StreetAddress1><StreetAddress2>10th Floor</StreetAddress2><Country>Canada</Country><City>Toronto</City><Province>ON</Province><PostalCode>L4Z 6C9</PostalCode></Address><Id>2238</Id><PriorityIndicator>2</PriorityIndicator><UnsecuredDebts><UnsecuredDebt><Creditor>BOC</Creditor><Action>CLSACCNT</Action><Amount>3388</Amount></UnsecuredDebt></UnsecuredDebts></Mortgagor><Mortgagor><Person><FirstName>George</FirstName><MiddleName>Matthew</MiddleName><LastName>Donald</LastName><Phone>9052871000</Phone><BusinessPhone>9052871000</BusinessPhone></Person><Address><UnitNumber>85</UnitNumber><StreetNumber>245</StreetNumber><StreetAddress1>Glen Erin Drive</StreetAddress1><StreetAddress2>Northwest</StreetAddress2><Country>Canada</Country><City>Toronto</City><Province>ON</Province><PostalCode>L4Z 8Y6</PostalCode></Address><Id>2239</Id><PriorityIndicator>1</PriorityIndicator><UnsecuredDebts><UnsecuredDebt><Creditor>BOC</Creditor><Action>CLSACCNT</Action><Amount>3388</Amount></UnsecuredDebt></UnsecuredDebts><IsILARequired>true</IsILARequired><SpouseInformation><FirstName>Monica</FirstName><MiddleName>Jessy</MiddleName><LastName>Ruther</LastName><IsILARequired>false</IsILARequired></SpouseInformation></Mortgagor><Mortgagor><Person><FirstName>Rachel</FirstName><MiddleName>Bruce</MiddleName><LastName>Larry</LastName><Phone>9052871000</Phone><BusinessPhone>9052871000</BusinessPhone></Person><Address><UnitNumber>851</UnitNumber><StreetNumber>2415</StreetNumber><StreetAddress1>Burnhamthrope Road</StreetAddress1><StreetAddress2>Southwest Street2</StreetAddress2><Country>Canada</Country><City>Toronto</City><Province>ON</Province><PostalCode>L4Z 8P6</PostalCode></Address><Id>1024</Id><PriorityIndicator>2</PriorityIndicator><UnsecuredDebts><UnsecuredDebt><Creditor>BOC</Creditor><Action>CLSACCNT</Action><Amount>3388</Amount></UnsecuredDebt></UnsecuredDebts><IsILARequired>true</IsILARequired><SpouseInformation><FirstName>NewMonica</FirstName><MiddleName>NewJessy</MiddleName><LastName>MewRuther</LastName><IsILARequired>false</IsILARequired></SpouseInformation></Mortgagor><Mortgagor><Company><Name>First Canadian Title</Name><ContactFirstName>Thomas</ContactFirstName><ContactLastName>James</ContactLastName><Phone>9052871000</Phone></Company><Address><StreetNumber>2425</StreetNumber><StreetAddress1>Bloor Avenue</StreetAddress1><Country>Canada</Country><City>Toronto</City><Province>ON</Province><PostalCode>L4Z 8P6</PostalCode></Address><Id>2241</Id><PriorityIndicator>5</PriorityIndicator><UnsecuredDebts><UnsecuredDebt><Creditor>BOC</Creditor><Action>CLSACCNT</Action><Amount>3388</Amount></UnsecuredDebt></UnsecuredDebts><IsILARequired>true</IsILARequired></Mortgagor><Mortgagor><Company><Name>FCT CORP</Name><ContactFirstName>Tom</ContactFirstName><ContactLastName>Jones</ContactLastName><Phone>9052871000</Phone></Company><Address><StreetNumber>2425</StreetNumber><StreetAddress1>Bloor Avenue</StreetAddress1><Country>Canada</Country><City>Toronto</City><Province>ON</Province><PostalCode>L4Z 8F6</PostalCode></Address><Id>2242</Id><PriorityIndicator>5</PriorityIndicator><UnsecuredDebts><UnsecuredDebt><Creditor>BOC</Creditor><Action>CLSACCNT</Action><Amount>3388</Amount></UnsecuredDebt></UnsecuredDebts><IsILARequired>true</IsILARequired></Mortgagor></Mortgagors><MortgagorPreferredLanguage>ENGLISH</MortgagorPreferredLanguage><Guarantors><Guarantor><Person><FirstName>Terry</FirstName><MiddleName>Tek</MiddleName><LastName>Lau</LastName><Phone>9052871000</Phone><BusinessPhone>9052871000</BusinessPhone></Person><Address><StreetNumber>28</StreetNumber><StreetAddress1>Canada Street</StreetAddress1><StreetAddress2>Second Floor</StreetAddress2><Country>Canada</Country><City>Toronto</City><Province>ON</Province><PostalCode>L4Z 8Y6</PostalCode></Address><Id>1024</Id><IsILARequired>true</IsILARequired></Guarantor></Guarantors><Properties><Property><Id>2238</Id><LegalDescription>Lot 3423423, Plan 2343DD: Heart of the City close to Mall/Sub/Bus/TTC etc. All aminities included</LegalDescription><PropertyType>SINGLE FAMILY RESIDENCE</PropertyType><OccupancyType>OWNER OCCUPIED</OccupancyType><PropertyAddress><StreetNumber>" + StreetNumber + "</StreetNumber><StreetAddress1>" + StreetAddress1 + "</StreetAddress1><Country>Canada</Country><City>" + City + "</City><Province>" + Province + "</Province><PostalCode>" + PostalCode + "</PostalCode></PropertyAddress><PropertyIdentificationNumbers><Number>026-109-221</Number><Number>026-101-998</Number></PropertyIdentificationNumbers><MortgagePriority>FIRST</MortgagePriority><IsLenderToCollectPropertyTaxes>false</IsLenderToCollectPropertyTaxes><ExistingMortgages><ExistingMortgage><Amount>700</Amount><Mortgagee>Testing this new schema change</Mortgagee><Action>POSTPONED</Action></ExistingMortgage></ExistingMortgages><EstateType>OTHER</EstateType><OtherEstateTypeDescription>Testing New Field</OtherEstateTypeDescription></Property></Properties><Attachments><Attachment><DocumentAttachment>p/9biuk19creUgW/ZxG1QA==</DocumentAttachment><Type>SIP</Type><FileFormat>APPLICATION/PDF</FileFormat><Language>ENGLISH</Language></Attachment><Attachment><DocumentAttachment>p/9biuk19creUgW/ZxG1QA==</DocumentAttachment><Type>BLIP</Type><FileFormat>APPLICATION/PDF</FileFormat><Language>ENGLISH</Language></Attachment></Attachments><Documents><IsOtherAllowed>true</IsOtherAllowed><Document><Type>2153718</Type><Version>1.0</Version><FileFormat>APPLICATION/PDF</FileFormat><NumberOfInstances>1</NumberOfInstances></Document><Document><Type>1150413</Type><Version>1.0</Version><FileFormat>APPLICATION/PDF</FileFormat><NumberOfInstances>1</NumberOfInstances></Document><Document><Type>2161117</Type><Version>1.0</Version><FileFormat>APPLICATION/PDF</FileFormat><NumberOfInstances>1</NumberOfInstances></Document><Document><Type>2349914</Type><Version>1.0</Version><FileFormat>APPLICATION/PDF</FileFormat><NumberOfInstances>1</NumberOfInstances></Document><Document><Type>2350319</Type><Version>1.0</Version><FileFormat>APPLICATION/PDF</FileFormat><NumberOfInstances>1</NumberOfInstances></Document><Document><Type>2348617</Type><Version>1.0</Version><FileFormat>APPLICATION/PDF</FileFormat><NumberOfInstances>1</NumberOfInstances></Document></Documents><PurchasePrice>125000</PurchasePrice><Remarks>Multiguarantor/mortgagors not in order/ILAS/SROT on 25thAugust</Remarks></" + ns + ":LenderRequest>";

        return str
    }

    this.CreateUpdateBNSDeal = function (IsSolicitorClose, IsRFF, TransactionType, CityUpdate, ProvinceUpdate, MortgageCentreFirstName) {

        if (TransactionType == 'NEW') {
            var str = this.GenerateBNSCreateDealXML(IsSolicitorClose, IsRFF);
        }
        if (TransactionType == 'UPDATE') {
            var str = this.GenerateBNSUpdateDealXML(IsSolicitorClose, IsRFF, CityUpdate, ProvinceUpdate, MortgageCentreFirstName);
        }

        var args = { _xml: str };
        soap.createClient(BNSWebServiceurl, SetUpClient);

        function SetUpClient(err, client) {

            if (err) {
                console.log('Unable to create client');
            }

            else {
                console.log(client.describe());

                client.CreateDeal(args, function (err, result) {
                    if (err) {
                        console.log('Error unable to call soap method');
                        defered.reject(err);
                    }
                    else {
                        defered.resolve(result);
                        console.log("Created/Updated BNS deal URN:", result.FCTURN);
                        ResponseFCTURN = result.FCTURN;

                        for (var lapse = 0; lapse < 60;) {
                            if (ResponseFCTURN == null) {
                                console.log('Lapse: ', lapse);
                                browser.sleep(1000);
                                lapse++;
                                defered.resolve(result);
                                ResponseFCTURN = result.FCTURN;
                            }
                            else {
                                break;
                            }
                        }

                        console.log("Created/Updated BNS deal Lender Ref No: ", LenderRefNo);

                        fs.writeFile('../Services/BNS/ResponseXMLs/CreateUpdateBNSResponse.json', JSON.stringify(result), function (err) {
                            if (err) {
                                console.log('Cant write response');
                                console.log(err);
                            }
                            else {
                                console.log("Successful response saved " + 'CreateUpdateBNSResponse.JSON');
                            }
                        });

                    }

                    fs.writeFile('../Services/BNS/ResponseXMLs/CreateUpdateBNSRequest.json', client.lastRequest, function (err) {
                        if (err) {
                            console.log('Cant write request')
                            console.log(err);
                        }
                        else {
                            console.log("Request saved " + '../testData/BNS/ResponseXMLs/CreateUpdateBNSRequest.json');
                            browser.sleep(3000);
                        }
                    });
                }, { timeout: 60000 })
            }
        }

        return defered.promise;
    }

    this.GenerateBNSGetLawyerDealEventsXML = function () {

        var ns = "q193";
        var MessageId = "{85434d76-8fde-f7f9-" + CustLib.getRandomNumber(4) + "-" + CustLib.getRandomNumber(4) + "D52E" + CustLib.getRandomNumber(4) + "}";
        var LenderId = LenderIdNo;

        var str = "<" + ns + ":GetLawyerDealEventsRequest><MessageID>" + MessageId + "</MessageID><LenderID>" + LenderId + "</LenderID><LenderReferenceNumbers><Number>" + LenderRefNo + "</Number></LenderReferenceNumbers><EventsLimit>50</EventsLimit></" + ns + ":GetLawyerDealEventsRequest>";

        return str
    }

    this.BNSGetLawyerDealEvents = function () {

        var str = this.GenerateBNSGetLawyerDealEventsXML();
        var args = { _xml: str };

        soap.createClient(BNSWebServiceurl, SetUpClient);

        function SetUpClient(err, client) {

            client.GetLawyerDealEvents(args, function (err, result) {

                if (err) {
                    console.log('No Result Obtained');
                    defered.reject(err);
                }
                else {
                    defered.resolve(result);

                    NumberOfMessages = result.NumberOfMessages;
                    console.log('Total Messages: ', NumberOfMessages);

                    if (result.Messages.Message[NumberOfMessages - 1].FCTURN != ResponseFCTURN) {
                        console.log('FCT Urn does not match on GetLawyerDealEvents!!!');
                        return;
                    }

                    GetLawyerDealEventsResponse = result;

                    fs.writeFile('../testData/GetLawyerDealResponse.json', JSON.stringify(result), function (err) {
                        if (err) {
                            console.log('Cant write response');
                            console.log(err);
                        }
                        else {
                            console.log("Successful response saved " + 'GetLawyerDealResponse.JSON');
                        }
                    });

                }

            }, { timeout: 30000 })
        }

        return defered.promise;
    }

    //NoteType enum values are 'STANDARD' & 'ACTIONABLE'. Note status enum values are 'NEW' & 'COMPLETED'
    this.GenerateBNSSendNoteXML = function (NoteType, NoteStatus, LenderNoteSubject, LenderNoteDetails) {

        var ns = "q189";
        var MessageId = "{85434d76-8fde-f7f9-" + CustLib.getRandomNumber(4) + "-" + CustLib.getRandomNumber(4) + "D52E" + CustLib.getRandomNumber(4) + "}";
        var LenderId = LenderIdNo;
        var NoteID = CustLib.getRandomNumber(3);

        var str = "<" + ns + ":SendNoteRequest><MessageID>" + MessageId + "</MessageID><DealInfo><LenderId>" + LenderId + "</LenderId><FCTURN>" + ResponseFCTURN + "</FCTURN><LenderReferenceNumber>" + LenderRefNo + "</LenderReferenceNumber></DealInfo><Note><ID>" + NoteID + "</ID><NotesType>" + NoteType + "</NotesType><Status>" + NoteStatus + "</Status><Subject>" + LenderNoteSubject + "</Subject><Details>" + LenderNoteDetails + "</Details></Note></" + ns + ":SendNoteRequest>";

        return str;
    }

    this.BNSSendNote = function (NoteType, NoteStatus, LenderNoteSubject, LenderNoteDetails) {

        var str = this.GenerateBNSSendNoteXML(NoteType, NoteStatus, LenderNoteSubject, LenderNoteDetails);
        var args = { _xml: str };

        soap.createClient(BNSWebServiceurl, SetUpClient);

        function SetUpClient(err, client) {

            client.SendNote(args, function (err, result) {

                if (err) {
                    console.log('No Result Obtained');
                    defered.reject(err);
                }
                else {
                    defered.resolve(result);

                    console.log('FCT Urn on Send Note Service: ', result.FCTURN);

                    if (result.FCTURN != ResponseFCTURN) {
                        console.log('FCT Urn does not match on SendNote!!!');
                        return;
                    }

                    fs.writeFile('../Services/BNS/ResponseXMLs/SendNote.json', JSON.stringify(result), function (err) {
                        if (err) {
                            console.log('Cant write response');
                            console.log(err);
                        }
                        else {
                            console.log("Successful response saved " + 'SendNote.JSON');
                        }
                    });

                }

            }, { timeout: 30000 })
        }

        return defered.promise;
    }

    this.GenerateBNSSendDealStatusChangeXML = function (LenderDealStatus, DealStatusChangeReason) {

        var ns = "q184";
        var MessageId = "{85434d76-8fde-f7f9-" + CustLib.getRandomNumber(4) + "-" + CustLib.getRandomNumber(4) + "D52E" + CustLib.getRandomNumber(4) + "}";
        var LenderId = LenderIdNo;

        var str = "<" + ns + ":SendDealStatusChangeRequest><MessageID>" + MessageId + "</MessageID><Deal><DealInfo><LenderId>" + LenderId + "</LenderId><FCTURN>" + ResponseFCTURN + "</FCTURN><LenderReferenceNumber>" + LenderRefNo + "</LenderReferenceNumber></DealInfo><RequestType>" + LenderDealStatus + "</RequestType><Reason>" + DealStatusChangeReason + "</Reason></Deal></" + ns + ":SendDealStatusChangeRequest>";

        return str;
    }

    this.BNSSendDealStatusChange = function (LenderDealStatus, DealStatusChangeReason) {

        var str = this.GenerateBNSSendDealStatusChangeXML(LenderDealStatus, DealStatusChangeReason);
        var args = {
            _xml: str
        };

        soap.createClient(BNSWebServiceurl, SetUpClient);

        function SetUpClient(err, client) {

            client.SendDealStatusChange(args, function (err, result) {

                if (err) {
                    console.log('No Result Obtained');
                    defered.reject(err);
                }
                else {
                    defered.resolve(result);

                    console.log('FCT Urn on Send Deal Status Change Service: ', result.FCTURN);

                    if (result.FCTURN != ResponseFCTURN) {
                        console.log('FCT Urn does not match on SendDealStatusChange!!!');
                        return;
                    }

                    fs.writeFile('../Services/BNS/ResponseXMLs/SendDealStatusChange.json', JSON.stringify(result), function (err) {
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

    this.ParseGetLawyerDealEventsResponse = function (EventTypeVal) {

        for (var node = 0; node < NumberOfMessages;) {
            if (GetLawyerDealEventsResponse['s:Envelope']['s:Body'][0]['GetLawyerDealEventsResponse'][0]['Messages'][0]['Message'][node]['EventType'] == EventTypeVal) {
                return node;
            }
            else {
                node++;

                if (node == NumberOfMessages) {
                    console.log('Could not find the expected event');
                }
            }
        }

    }


     this.ReturnNoteSubject = function (NoteNo, EventTypeVal) {
        var MessageNo = this.ParseGetLawyerDealEventsResponse(EventTypeVal);
        NoteSub = GetLawyerDealEventsResponse['s:Envelope']['s:Body'][0]['GetLawyerDealEventsResponse'][0]['Messages'][0]['Message'][MessageNo + (NoteNo - 1)]['EventData'][0]['LawyerAmendments'][0]['Notes'][0]['Note'][0]['Subject'];
        NoteSub = NoteSub.toString().replace(/[&\/\\#+()$~%'":*?<>{}]/g, '');
        return NoteSub;
    }

    this.ReturnNoteDetails = function (NoteNo, EventTypeVal) {
        var MessageNo = this.ParseGetLawyerDealEventsResponse(EventTypeVal);
        NoteDetails = GetLawyerDealEventsResponse['s:Envelope']['s:Body'][0]['GetLawyerDealEventsResponse'][0]['Messages'][0]['Message'][MessageNo + (NoteNo - 1)]['EventData'][0]['LawyerAmendments'][0]['Notes'][0]['Note'][0]['Details'];
        NoteDetails = NoteDetails.toString().replace(/[&\/\\#+()$~%'":*?<>{}]/g, '');
        return NoteDetails;
    }

    this.ReturnDealStatus = function (EventTypeVal) {
        var MessageNo = this.ParseGetLawyerDealEventsResponse(EventTypeVal);
        var DealStatus = GetLawyerDealEventsResponse['s:Envelope']['s:Body'][0]['GetLawyerDealEventsResponse'][0]['Messages'][0]['Message'][MessageNo]['DealStatus'];
        DealStatus = DealStatus.toString().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
        return DealStatus;
    }

    this.VerifyDealEvent = function (EventTypeVal) {

        var MessageNo = this.ParseGetLawyerDealEventsResponse(EventTypeVal);
        if (MessageNo < NumberOfMessages) {
            return true;
        }
        else {
            return false;
        }
    }

    this.ReturnDocDisplayName = function (EventTypeVal) {
        var MessageNo = this.ParseGetLawyerDealEventsResponse(EventTypeVal);
        var DocDisplayName = GetLawyerDealEventsResponse['s:Envelope']['s:Body'][0]['GetLawyerDealEventsResponse'][0]['Messages'][0]['Message'][MessageNo]['EventData'][0]['Documents'][0]['DisplayName'];
        DocDisplayName = DocDisplayName.toString().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
        return DocDisplayName;
    }

    this.ReturnWCPValue = function (EventTypeVal) {
        var MessageNo = this.ParseGetLawyerDealEventsResponse(EventTypeVal);
        var WCPVal = GetLawyerDealEventsResponse['s:Envelope']['s:Body'][0]['GetLawyerDealEventsResponse'][0]['Messages'][0]['Message'][MessageNo]['EventData'][0]['SubmitSROT'][0]['WesternProtocolClosing'];
        WCPVal = WCPVal.toString().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
        return WCPVal;
    }

    this.ReturnLawyerAmendments = function (EventTypeVal) {
        var MessageNo = this.ParseGetLawyerDealEventsResponse(EventTypeVal);
        var ClosingDate = GetLawyerDealEventsResponse['s:Envelope']['s:Body'][0]['GetLawyerDealEventsResponse'][0]['Messages'][0]['Message'][MessageNo]['EventData'][0]['LawyerAmendments'][0]['ClosingDate'];
        ClosingDate = ClosingDate.toString().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
        return ClosingDate;
    }

    this.ReturnDocumentID = function (EventTypeVal) {
        var MessageNo = this.ParseGetLawyerDealEventsResponse(EventTypeVal);
        var DocumentID = GetLawyerDealEventsResponse['s:Envelope']['s:Body'][0]['GetLawyerDealEventsResponse'][0]['Messages'][0]['Message'][MessageNo]['EventData'][0]['Documents'][0]['DocumentID'];
        DocumentID = DocumentID.toString().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
        return DocumentID;
    }

    this.ReturnDocumentType = function (EventTypeVal) {
        var MessageNo = this.ParseGetLawyerDealEventsResponse(EventTypeVal);
        var DocumentType = GetLawyerDealEventsResponse['s:Envelope']['s:Body'][0]['GetLawyerDealEventsResponse'][0]['Messages'][0]['Message'][MessageNo]['EventData'][0]['Documents'][0]['DocumentType'];
        DocumentType = DocumentType.toString().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
        return DocumentType;
    }


    this.GenerateBNSSendRFFRejectXML = function () {

        var ns = "q198";
        var MessageId = "{85434d76-8fde-f7f9-" + CustLib.getRandomNumber(4) + "-" + CustLib.getRandomNumber(4) + "D52E" + CustLib.getRandomNumber(4) + "}";
        var LenderId = "-02";
        ClosingDate = CustLib.CurrentOrFutureDate();
    
        var str = "<" + ns + ":SendRFFRejectRequest><MessageID>" + MessageId + "</MessageID><DealInfo><LenderId>" + LenderId + "</LenderId><FCTURN>" + ResponseFCTURN + "</FCTURN><LenderReferenceNumber>" + LenderRefNo + "</LenderReferenceNumber></DealInfo><ClosingDate>" + ClosingDate + "</ClosingDate><Reason>" + RFFReason1 + "</Reason></" + ns + ":SendRFFRejectRequest>";
    
        return str;
    }


    this.BNSSendRFFReject = function () {

        var str = this.GenerateBNSSendRFFRejectXML();
        var args = { _xml: str };

        soap.createClient(BNSWebServiceurl, SetUpClient);

        function SetUpClient(err, client) {

            client.SendRFFReject(args, function (err, result) {

                if (err) {
                    console.log('No Result Obtained');
                    defered.reject(err);
                }
                else {
                    defered.resolve(result);

                    console.log('FCT Urn on Send RFFReject Service: ', result.FCTURN);

                    if (result.FCTURN != ResponseFCTURN) {
                        console.log('FCT Urn does not match on RFF Reject!!!');
                        return;
                    }

                    fs.writeFile('../Services/BNS/ResponseXMLs/SendRFFReject.json', JSON.stringify(result), function (err) {
                        if (err) {
                            console.log('Cant write response');
                            console.log(err);
                        }
                        else {
                            console.log("Successful response saved " + 'SendRFFReject.JSON');
                        }
                    });

              }

            }, { timeout: 30000 })
        }

        return defered.promise;
    }

    this.SendRFFReject = function (lenderReferenceNumber) {

        var childprocess = require("child_process");
        var pathBatFile = resolve('..\\Services\\BNS\\BatchFiles\\BNSDeal_SendRFFReject.bat');
        var pathSoapUI = resolve('..\\Services\\BNS\\SoapProject\\LenderIntegrationBNS.xml');
        var basicAuthUser = null;
        var basicAuthPass = null;
        var RequestType = null;
       
        
       
        if (Env == "PROD" || Env == "DR") {
            basicAuthUser = Runsettings.data.Global.basicAuthUserDRPROD.value;
            basicAuthPass = Runsettings.data.Global.basicAuthPassDRPROD.value;
        }
        else {
            basicAuthUser = Runsettings.data.Global.basicAuthUser.value;
            basicAuthPass = Runsettings.data.Global.basicAuthPass.value;
        }

        ClosingDate = CustLib.CurrentOrFutureDate();

        var pathFile = resolve('..\\Services\\BNS\\ResponseXMLs');
        var pathResponse = resolve('..\\Services\\BNS\\ResponseXMLs\\SendRFFRejectResponse.xml');

        var batchFileArguments = [pathSoapUI, BNSWebServiceurl, basicAuthUser, basicAuthPass, pathFile,  ResponseFCTURN, LenderRefNo, ClosingDate, Runsettings.data.Global.SoapPath.value];
        const child = childprocess.execFileSync(pathBatFile, batchFileArguments);
        if (child.err) {
            console.log("Error occured");
        }
       
        var xml2js = require('xml2js');
        var parser = new xml2js.Parser();
        fs.readFile(pathResponse, 'utf-8', function (err, data) {
            if (err) {
                expect(true).toBe(false, "Error occured while rejecting RFF");
            }

            else {

                parser.parseString(data, function (err, result) {
                    if (err) {
                        expect(true).toBe(false, "Error occured while converting to JSON");
                    }
                    else {
                            RequestType = result['s:Envelope']['s:Body'][0]['LenderResponse'][0]['RequestType'][0]['_'];
                            if (RequestType == "REJECTRFF") {
                            console.log("RFF rejected successfully");
                             }
                            else {
                            expect(true).toBe(false, "RFF Reject service failed!!!");
                            }
                        
                        }
                });
            }
        });

      

    }   
   
    this.GetDocument = function (DocumentID, DocumentType, lenderReferenceNumber) {

        var childprocess = require("child_process");
        var pathBatFile = resolve('..\\Services\\BNS\\BatchFiles\\BNSDeal_GetDocument.bat');
        var pathSoapUI = resolve('..\\Services\\BNS\\SoapProject\\LenderIntegrationBNS.xml');
        var basicAuthUser = null;
        var basicAuthPass = null;
        var Type = null;
             
               
        if (Env == "PROD" || Env == "DR") {
            basicAuthUser = Runsettings.data.Global.basicAuthUserDRPROD.value;
            basicAuthPass = Runsettings.data.Global.basicAuthPassDRPROD.value;
        }
        else {
            basicAuthUser = Runsettings.data.Global.basicAuthUser.value;
            basicAuthPass = Runsettings.data.Global.basicAuthPass.value;
        }

        
        var pathFile = resolve('..\\Services\\BNS\\ResponseXMLs');
        var pathResponse = resolve('..\\Services\\BNS\\ResponseXMLs\\GetDocumentResponse.xml');

        var batchFileArguments = [pathSoapUI, BNSWebServiceurl, basicAuthUser, basicAuthPass, pathFile,  ResponseFCTURN, LenderRefNo, DocumentID, Runsettings.data.Global.SoapPath.value];
        const child = childprocess.execFileSync(pathBatFile, batchFileArguments);
        if (child.err) {
            console.log("Error occured");
        }
       
        var xml2js = require('xml2js');
        var parser = new xml2js.Parser();
        fs.readFile(pathResponse, 'utf-8', function (err, data) {
            if (err) {
                expect(true).toBe(false, "Error occured while getting document");
            }

            else {

                parser.parseString(data, function (err, result) {
                    if (err) {
                        expect(true).toBe(false, "Error occured while converting to JSON");
                    }
                    else {
                            Type = result['s:Envelope']['s:Body'][0]['GetDocumentResponse'][0]['Attachment'][0]['Type'];
                            Type = Type.toString().replace(/[&\/\\#+()$~%'":*?<>{}]/g, '');
                            expect(Type).toBe(DocumentType, 'Verify Type parameter value is invalid'); 
                        }
                            
                        
                        
                });
            }
        });

      

    }  
 
    this.SendDocument = function (Type, lenderReferenceNumber) {

        var childprocess = require("child_process");
        var pathBatFile = resolve('..\\Services\\BNS\\BatchFiles\\BNSDeal_SendDocument.bat');
        var pathSoapUI = resolve('..\\Services\\BNS\\SoapProject\\LenderIntegrationBNS.xml');
        var basicAuthUser = null;
        var basicAuthPass = null;
        var RequestType = null;
       
        
       
        if (Env == "PROD" || Env == "DR") {
            basicAuthUser = Runsettings.data.Global.basicAuthUserDRPROD.value;
            basicAuthPass = Runsettings.data.Global.basicAuthPassDRPROD.value;
        }
        else {
            basicAuthUser = Runsettings.data.Global.basicAuthUser.value;
            basicAuthPass = Runsettings.data.Global.basicAuthPass.value;
        }

        
        var pathFile = resolve('..\\Services\\BNS\\ResponseXMLs');
        var pathResponse = resolve('..\\Services\\BNS\\ResponseXMLs\\SendDocumentResponse.xml');

        var batchFileArguments = [pathSoapUI, BNSWebServiceurl, basicAuthUser, basicAuthPass, pathFile,  ResponseFCTURN, LenderRefNo, Type, Runsettings.data.Global.SoapPath.value];
        const child = childprocess.execFileSync(pathBatFile, batchFileArguments);
        if (child.err) {
            console.log("Error occured");
        }
       
        var xml2js = require('xml2js');
        var parser = new xml2js.Parser();
        fs.readFile(pathResponse, 'utf-8', function (err, data) {
            if (err) {
                expect(true).toBe(false, "Error occured while Sending document");
            }

            else {

                parser.parseString(data, function (err, result) {
                    if (err) {
                        expect(true).toBe(false, "Error occured while converting to JSON");
                    }
                    else {
                            RequestType = result['s:Envelope']['s:Body'][0]['LenderResponse'][0]['RequestType'][0]['_'];
                            expect(RequestType).toBe('SENDDOCUMENT', 'RequestType is invalid'); 
                        }
                                                    
                        
                });
            }
        });

      

    }   

    this.ReturnFctUrn = function () {
        return ResponseFCTURN;
    }

    this.ReturnLenderRefNo = function () {
        return LenderRefNo;
    }

    this.ReturnClosingDate = function () {
        return ClosingDate;
    }

    this.ReturnMrtgagorFull = function () {
        return MrtgagorFirst + " " + MrtgagorMid + " " + MrtgagorLast;
    }

    this.ReturnMrtgagor = function () {
        return MrtgagorFirst + " " + MrtgagorLast;
    }

    this.ReturnMrtgagorMiddleName = function () {
        return MrtgagorMid ;
    }

    this.ReturnMrtgagorFirstName = function () {
        return MrtgagorFirst ;
    }
    
    this.ReturnMrtgagorLastName = function () {
        return MrtgagorLast;
    }

    this.ReturnPropertyAddress = function () {
        return StreetNumber + " " + StreetAddress1 + ", " + City + ", " + Province + " " + PostalCode;
    }

    this.CleanUpScript = function () {
        ResponseFCTURN = null;
         LenderRefNo = null;
        MortgageNo = null;
         ClosingDate = null;
        MrtgagorFirst = null;
        MrtgagorMid = null;
         MrtgagorLast = null;
         StreetNumber = null;
        StreetAddress1 = null;
        City = null;
        CityCurrent = null;
        Province = null;
        ProvinceCurrent = null;
        PostalCode = null;
         NoteSub = null;
        NoteDetails = null;
        SecNoteSub = null;
        GetLawyerDealEventsResponse = null;
        NumberOfMessages = null;
    }
   
}
module.exports = new LenderIntegrationBNS();

