'use strict';
var Runsettings = require('../../../../testData/RunSetting.js');
var CustomLib= require('../../../../CustomLibrary/CustomLibrary.js');
var fs = require('fs');
var q = require('q');
var defered = q.defer();
var CounterMax = 20;
var Counter = 0;
var CounterDealStatus = 0;
var TransactionStatus = null;
var LenderRequestId = null;
var jsonResponse = null;
var RedirectUrl = null;
var Client = require('node-rest-client').Client;
var Env = Runsettings.data.Global.ENVIRONMENT.value;
var Token = Runsettings.data.Global.LawyerDetails[Env].Token.value;
var XFCTAuthorizationVal = Runsettings.data.Global.LawyerDetails[Env].XFCTAuthorizationVal.value;
var LenderNameValue = element.all(by.css('.form-group.col-md-4')).get(0).all(by.tagName('div')).get(1);
var LawyerIntegrationCommon = function () {

    this.LoginViaRedirectURL = function (dealID, context) {
        Counter = 0;
        GetRedirectURLandLoginTillSucess(dealID, context);
    }


    var GetRedirectURLandLoginTillSucess = function (dealID, context) {
        var RedirectURL = Runsettings.data.Global.RedirectURLCredentials[Env].endPoint.value
        var ResourceURL = Runsettings.data.Global.RedirectURLCredentials[Env].Resource.value
        var OPtBody = {
            "headers": {
                "content-type": "application/json",
                "Authorization": '' + Token + '',
                "XFCTAuthorization": '' + XFCTAuthorizationVal + '',

            },
            'method': 'GET',
            "url": RedirectURL + ResourceURL + "?context=" + context + "&fcturn=" + dealID + "&language=ENGLISH",
            "rejectUnauthorized": false

        }

        var Request = require("request");
        Request(OPtBody, function (error, response, body) {
            if (error) { console.log(error) }
            else {
                try { 
                    browser.get(JSON.parse(response.body).url) 
                    CustomLib.WaitForSpinnerInvisible();

                    var EC = protractor.ExpectedConditions;
                    browser.wait(EC.visibilityOf(element(by.xpath('//app-master/app-top-navbar/nav/a/img')), 65000,  'LLC Image is not visible'));
                   // CustomLib.WaitforElementVisible(LenderNameValue);  //Value loads latest
                    CustomLib.WaitForSpinnerInvisible();
                }
                catch (error) {
                    Counter++;
                    if (Counter < CounterMax) { GetRedirectURLandLoginTillSucess(dealID, context) }

                }
            }
        })

    }
    
    this.LoginViaRedirectURLWithWait = function (dealID, context) {   
        var RedirectURL = Runsettings.data.Global.RedirectURLCredentials[Env].endPoint.value
        var ResourceURL = Runsettings.data.Global.RedirectURLCredentials[Env].Resource.value
        var OPtBody = {
            "headers": {
                "content-type": "application/json",
                "Authorization": '' + Token + '',
                "XFCTAuthorization": '' + XFCTAuthorizationVal + '',

            },
            'method': 'GET',
            "url": RedirectURL + ResourceURL + "?context=" + context + "&fcturn=" + dealID + "&language=ENGLISH",
            "rejectUnauthorized": false
        }
       
        var Request = require("request");
        return Request(OPtBody, function (error, response, body) {
            if (error) {
                console.log('LoginViaRedirectURL service error: ', error);
            }
            else {          
                console.log(JSON.parse(response.body).url)
                browser.get(JSON.parse(response.body).url);
                CustomLib.WaitForSpinnerInvisible();
                CustomLib.WaitforElementVisible(LenderNameValue);  //Value loads latest
                CustomLib.WaitForSpinnerInvisible();
                return JSON.parse(response.body).url;
            }
        })
    }

 
    this.ReturnGetRedirectUrl = function (dealID, context) {

        var RedirectURL = Runsettings.data.Global.RedirectURLCredentials[Env].endPoint.value
        var ResourceURL = Runsettings.data.Global.RedirectURLCredentials[Env].Resource.value
        var url;
        var OPtBody = {
            "headers": {
                "content-type": "application/json",
                "Authorization": '' + Token + '',
                "XFCTAuthorization": '' + XFCTAuthorizationVal + '',

            },
            'method': 'GET',
            "url": RedirectURL + ResourceURL + "?context=" + context + "&fcturn=" + dealID + "&language=ENGLISH",


        }

        var Request = require("request");

        Request(OPtBody, function (error, response, body) {

            if (error || response.statusCode != 200) {
                url = null;
            }

            else {
                if (response.statusCode == 200) {
                    url = JSON.parse(response.body).url;
                }
            }
        })

        return url;
    }

    this.AccceptDealXML = function (TranId) {
        var str = { " TransactionId ": "" + tranid + " ", " Status ": " ACTIVE " };
        return str
    }

    this.SendTransactionAcceptrejectDeal = function () {
        var request = require('request');
        var executeRequest = function (SendTransactionAcceptreject, AcceptDealEndPoint) {
            var defer = protractor.promise.defer();
            // method can be ‘GET’, ‘POST’ or ‘PUT’
            request({ uri: AcceptDealEndPoint, method: SendTransactionAcceptreject, json: true }, function (error, response, body) {
                if (error || response.statusCode >= 400) {
                    defer.reject({
                    error: error,
                    message: response
                });
                } 
                else {
                    defer.fulfill(body);
                }
            });
            // Return a promise so the caller can wait on it for the request to complete
            return defer.promise;
        };
    }

    var AcceptRejectTillSucess = function (fcturn, dealStatus) {
        var AcceptDealEndPoint = Runsettings.data.Global.LawyerDetails[Env].Endpoint;
        var ResourceURL = Runsettings.data.Global.LawyerDetails[Env].Resource + fcturn + '/status';
        var JSONBody = { "TransactionId": "" + fcturn + "", "Status": "" + dealStatus + "" };
        var JSONBody1 = JSON.stringify(JSONBody);
        var options = function () {
            var OPtBody = {
                "headers": {
                    "content-type": "application/json",
                    "Authorization": '' + Token + '',
                    "XFCTAuthorization": '' + XFCTAuthorizationVal + '',
    
                },
                "url": AcceptDealEndPoint + ResourceURL,
                "body": JSONBody1,
                "rejectUnauthorized": false
            }
            return OPtBody
        }

        var callback = function (error, response, body) {
            if (error || response.statusCode != 200) {
                defered.reject(error);
                Counter++;
                if (Counter < CounterMax) { 
                  // console.log("Status Code"+ response.statusCode);
                    AcceptRejectTillSucess(fcturn, dealStatus) }
                else {
                    expect(response.statusCode).toBe(200, "AcceptReject REST service failed after multiple attempts!!!");
                }
            }
            else {
                defered.resolve(response);
                defered.fulfill();
                expect(response.statusCode).toBe(200, "AcceptReject deal service is successfull.");
                /*if (response.statusCode == 200) {
                    console.log("Accept Reject deal was successfull ");
                }*/
            }
        }
        var Request = require("request");
        Request.post(options(), callback);
        return defered.promise
    }

    this.AcceptRejectDeal = function (fcturn, dealStatus) {
        Counter = 0;
        AcceptRejectTillSucess(fcturn, dealStatus);
    }

    var Acceptdeal = function (fcturn, dealStatus) {
        var AcceptDealEndPoint = Runsettings.data.Global.BNS[Env].EndPoint;
        var ResourceURL = Runsettings.data.Global.BNS[Env].Resource + fcturn + '/status';
        var JSONBody = { "TransactionId": "" + fcturn + "", "Status": "" + dealStatus + "" };
        var JSONBody1 = JSON.stringify(JSONBody);
        fs.writeFile('../Services/MMS/ResponseXMLs/AcceptRejectRequest.json', JSONBody1, function (error) {
        
        });

        var options = function () {
            var OPtBody = {
                "headers": {
                    "content-type": "application/json",
                    "Authorization": '' + Token + '',
                    "XFCTAuthorization": '' + XFCTAuthorizationVal + '',
    
                },
                "url": AcceptDealEndPoint + ResourceURL,
                "body": JSONBody1,
                "rejectUnauthorized": false
            }
            return OPtBody
        }
        var callback = function (error, response, body) {
            console.log("working on", fcturn)
            if (error || response.statusCode != 200) {
                defered.reject(error);
                console.log('Accept Reject deal was unsuccessful!!! ');
                fs.writeFile('../Services/MMS/ResponseXMLs/AcceptRejectResponse.json', "Response Status: " + response.statusCode, function (error) {});
            }
            else {
                defered.resolve(response);
                defered.fulfill();
                if (response.statusCode == 200) {
                    console.log("Accept Reject deal was successfull ");
                    fs.writeFile('../Services/MMS/ResponseXMLs/AcceptRejectResponse.json', "Response Status: " + response.statusCode, function (error) {
                        if (error) {
                            console.error("write error:  " + error.message);
                        } else {
                            console.log("Successful Response Status saved " + 'AcceptRejectResponse.json');
                        }
                    });
                }
                browser.sleep(5000);
            }
        }
        var Request = require("request");
        Request.post(options(), callback);
        return defered.promise;
    }

    this.GetTransactionStatus = function (fcturn) {
        var TransactionStatusEndPoint = Runsettings.data.Global.BNS[Env].EndPoint;
        var ResourceURL = Runsettings.data.Global.BNS[Env].Resource + fcturn + '/status';
        var JSONBody = "";
        var JSONBody1 = JSON.stringify(JSONBody)
        var options = function () {

            var OPtBody = {
                "headers": {
                    "content-type": "application/json",
                    "Authorization": '' + Token + '',
                    "XFCTAuthorization": '' + XFCTAuthorizationVal + '',
    
                },
                "url": TransactionStatusEndPoint + ResourceURL,
                "body": JSONBody1,
                "rejectUnauthorized": false
            }
            return OPtBody

        }

        var callback = function (error, response, body) {


            if (error || response.statusCode != 200) {
                defered.reject(error);
                expect(response.statusCode).toBe(200, "GetTransactionStatus service status code.");

            }
            else {
                defered.resolve(response);
                defered.fulfill();
                if (response.statusCode == 200) {
                    console.log("Get transaction status deal was successfull ");
                    var jsonResponse = JSON.parse(response.body);
                    TransactionStatus = jsonResponse.status;
                    expect(response.statusCode).toBe(200, "GetTransactionStatus service status code.");
                }
                browser.sleep(5000);
            }

        }
        var Request = require("request");
        Request.get(options(), callback);

        return defered.promise;
    }

    this.VerifyTransactionStatusTillSuccess= function (fcturn, DealStatus) {
        Counter = 0;
        VerifyTransactionStatus(fcturn, DealStatus);
    }

    var VerifyTransactionStatus = function (fcturn, DealStatus) {
        var TransactionStatusEndPoint = Runsettings.data.Global.BNS[Env].EndPoint;
        var ResourceURL = Runsettings.data.Global.BNS[Env].Resource + fcturn + '/status';
        var JSONBody = "";
        var JSONBody1 = JSON.stringify(JSONBody)
        var options = function () {

            var OPtBody = {
                "headers": {
                    "content-type": "application/json",
                    "Authorization": '' + Token + '',
                    "XFCTAuthorization": '' + XFCTAuthorizationVal + '',
    
                },
                "url": TransactionStatusEndPoint + ResourceURL,
                "body": JSONBody1,
                "rejectUnauthorized": false
            }
            return OPtBody

        }
        Counter++;
        var callback = function (error, response, body) {
            if (error || response.statusCode != 200) {
                defered.reject(error);
                if(Counter < CounterMax )
                    {
                        VerifyTransactionStatus(fcturn, DealStatus);
                    }
                    else{
                        expect(response.statusCode).toBe(200, "DealStatus service status code.");
                    } 
               
            }
            else {
                defered.resolve(response);
                defered.fulfill();
                if (response.statusCode == 200) {
                    var jsonResponse = JSON.parse(response.body);
                    TransactionStatus = jsonResponse.status;
                    if(TransactionStatus != DealStatus && Counter < CounterMax )
                    {
                        VerifyTransactionStatus(fcturn, DealStatus);
                    }
                    else{
                        expect(TransactionStatus).toBe(DealStatus, "DealStatus service - Deal Status");
                    }    
                }
                browser.sleep(5000);
            }
        }
        var Request = require("request");
        Request.get(options(), callback);
        return defered.promise;
    }

    this.ReturnTransactionStatus = function () {

        return TransactionStatus;
    }

    this.GetLenderChanges = function (FCTURN) {

        var LenderChangesEndPoint = Runsettings.data.Global.BNS[Env].EndPoint;
        var ResourceURL = Runsettings.data.Global.BNS[Env].Resource + FCTURN + '/lenderchanges';
        var JSONBody = "";
        var JSONBody1 = JSON.stringify(JSONBody);

        var options = function () {

            var OPtBody = {
                "headers": {
                    "content-type": "application/json",
                    "Authorization": '' + Token + '',
                    "XFCTAuthorization": '' + XFCTAuthorizationVal + '',
    
                },
                "url": LenderChangesEndPoint + ResourceURL,
                "body": JSONBody1,
                "rejectUnauthorized": false
            }
            return OPtBody

        }

        var callback = function (error, response, body) {


            if (error || response.statusCode != 200) {
                defered.reject(error);

                console.log('Get lender changes deal was unsuccessful!!! ');
                console.log(error);

                fs.writeFile('../Services/MMS/ResponseXMLs/GetLenderChangesResponse.json', "Response Status: " + response.statusCode, function (error) {
                    if (error) {
                        console.error("Response write error");
                    } else {
                        console.log("Unsuccessful Response Status saved " + 'GetLenderChangesResponse.json');
                    }
                });

            }
            else {

                defered.resolve(response);
                defered.fulfill();
                if (response.statusCode == 200) {
                    console.log("Get lender changes deal was successfull ");
                    jsonResponse = JSON.parse(response.body);
                    LenderRequestId = jsonResponse.lenderRequestId;

                    fs.writeFile('../Services/MMS/ResponseXMLs/GetLenderChangesResponse.json', "Response Status: " + response.statusCode, function (error) {
                        if (error) {
                            console.error("error");
                        } else {
                            console.log("Successful Response Status saved " + 'GetLenderChangesResponse.json');
                        }
                    });
                }

                browser.sleep(5000);
            }

        }
        var Request = require("request");
        Request.get(options(), callback);

        return defered.promise;
    }

    var ReturnLenderChangesTag = function (i) {
        return jsonResponse.lenderChanges[i].tag;
    }

    var ReturnLenderChangesId = function (i) {
        return jsonResponse.lenderChanges[i].id;
    }

    var ReturnSendLenderChangesAcceptRejectJson = function (LenderChangesArray, Status, FCTURN) {

        var JSONBodyPart = [];
        for (var i = 0; i < LenderChangesArray.length; i++) {
            JSONBodyPart[i] = { "tag": "" + ReturnLenderChangesTag(LenderChangesArray[i]) + "", "id": "" + ReturnLenderChangesId(LenderChangesArray[i]) + "", "Status": "" + Status + "" };
        }
        var JSONBody = { "transactionId": "" + FCTURN + "", "lenderRequestId": "" + LenderRequestId + "", "changeStatusList": JSONBodyPart };

        return JSONBody;
    }

    //For LenderChangesArray, send lenderChanges from GetLenderChanges. Send only the lenderChanges array positions you want to change status for in an array. First one is 0 and onwards
    this.SendLenderChangesAcceptReject = function (LenderChangesArray, Status, FCTURN) {

        var SendLenderChangesEndPoint = Runsettings.data.Global.BNS[Env].EndPoint;
        var ResourceURL = Runsettings.data.Global.BNS[Env].Resource + FCTURN + '/lenderchanges';
        var JSONBody = ReturnSendLenderChangesAcceptRejectJson(LenderChangesArray, Status, FCTURN);
        var JSONBody1 = JSON.stringify(JSONBody);

        fs.writeFile('../Services/MMS/ResponseXMLs/SendLenderChangesAcceptRejectRequest.json', JSONBody1, function (error) {
            if (error) {
                console.error("Error - SendLenderChangesAcceptReject");
            } else {
                console.log("Request saved " + 'SendLenderChangesAcceptRejectRequest.json');
            }
        });

        var options = function () {

            var OPtBody = {
                "headers": {
                    "content-type": "application/json",
                    "Authorization": '' + Token + '',
                    "XFCTAuthorization": '' + XFCTAuthorizationVal + '',
    
                },
                "url": SendLenderChangesEndPoint + ResourceURL,
                "body": JSONBody1,
                "rejectUnauthorized": false
            }
            return OPtBody

        }

        var callback = function (error, response, body) {


            if (error || response.statusCode != 200) {
                defered.reject(error);

                console.log('Send lender changes accept reject request was unsuccessful!!! ');
                console.log(error);

                fs.writeFile('../Services/MMS/ResponseXMLs/SendLenderChangesAcceptRejectResponse.json', "Response Status: " + response.statusCode, function (error) {
                    if (error) {
                        console.error("Response write error ");
                    } else {
                        console.log("Unsuccessful Response Status saved " + 'SendLenderChangesAcceptRejectResponse.json');
                    }
                });

            }
            else {

                defered.resolve(response);
                defered.fulfill();
                if (response.statusCode == 200) {
                    console.log("Send lender changes accept reject request was successfull ");

                    fs.writeFile('../Services/MMS/ResponseXMLs/SendLenderChangesAcceptRejectResponse.json', "Response Status: " + response.statusCode, function (error) {
                        if (error) {
                            console.error("write error");
                        } else {
                            console.log("Successful Response Status saved " + 'SendLenderChangesAcceptRejectResponse.json');
                        }
                    });
                }

                browser.sleep(5000);
            }

        }
        var Request = require("request");
        Request.post(options(), callback);

        return defered.promise;
    }


    this.ReturnGetRedirectUrl = function (dealID, context) {
        var RedirectURL = Runsettings.data.Global.RedirectURLCredentials[Env].endPoint.value
        var ResourceURL = Runsettings.data.Global.RedirectURLCredentials[Env].Resource.value
        var OPtBody = {
            "headers": {
                "content-type": "application/json",
                "Authorization": '' + Token + '',
                "XFCTAuthorization": '' + XFCTAuthorizationVal + '',

            },
            'method': 'GET',
            "url": RedirectURL + ResourceURL + "?context=" + context + "&fcturn=" + dealID + "&language=ENGLISH",
            "rejectUnauthorized": false

        }

        var Request = require("request");

        Request(OPtBody, function (error, response, body) {
            if (error || response.statusCode != 200) {
               RedirectUrl = null;
            }
            else {
                if (response.statusCode == 200) {
                    RedirectUrl = JSON.parse(response.body).url;
                }
            }
        })

        return RedirectUrl;
    }

    this.VerifyGetRedirectUrlIsNull = function (dealID, context) {
        Counter = 0;
        return VerifyGetRedirectUrlIsNullTllSuccess(dealID, context)
    }

    var VerifyGetRedirectUrlIsNullTllSuccess = function (dealID, context) {
        var RedirectURL = Runsettings.data.Global.RedirectURLCredentials[Env].endPoint.value
        var ResourceURL = Runsettings.data.Global.RedirectURLCredentials[Env].Resource.value
        var OPtBody = {
            "headers": {
                "content-type": "application/json",
                "Authorization": '' + Token + '',
                "XFCTAuthorization": '' + XFCTAuthorizationVal + '',

            },
            'method': 'GET',
            "url": RedirectURL + ResourceURL + "?context=" + context + "&fcturn=" + dealID + "&language=ENGLISH",
            "rejectUnauthorized": false

        }

        var Request = require("request");

        Request(OPtBody, function (error, response, body) {
            Counter++
            if ((error || response.statusCode != 200)) {
                if(Counter < CounterMax)
                {
                    VerifyGetRedirectUrlIsNullTllSuccess(dealID, context);
                }
                else{
                    expect(true).toBe(false, "GetRedirectURL Service failed after multiple attempts.");
                }             
            }
            else {
                if (response.statusCode == 200) {
                    RedirectUrl = JSON.parse(response.body).url;
                    if(RedirectUrl != null &&  Counter < CounterMax)
                    {
                        VerifyGetRedirectUrlIsNullTllSuccess(dealID, context);
                    }
                }
            }
        })
        return RedirectUrl;
    }
 
    this.getAndSendAcceptRejectAmendment = function (dealID, type) {

        var Env = Runsettings.data.Global.ENVIRONMENT.value;
        var EndPoint = Runsettings.data.Global.LenderDetails[Env].Endpoint;
        var Resource = Runsettings.data.Global.LenderDetails[Env].Resource;
        var ResourcePart = Runsettings.data.Global.LenderDetails[Env].ResourcePart;
        var Request = require("request");


        var options = function () {
            var OPtBody = {
                "headers": {
                    "content-type": "application/json",
                    "Authorization": '' + Token + '',
                    "XFCTAuthorization": '' + XFCTAuthorizationVal + '',
    
                },
                
                "url": EndPoint + Resource + dealID + ResourcePart,
                "rejectUnauthorized": false
            }
            return OPtBody
        }

  
        Request.get(options(), function (error, response, body) {
            expect(response.statusCode).toBe(200, "GetLenderResponse service response");
            var databody = [];
            var indx = 0;
            var data = JSON.parse(body);
            for (var k in data.lenderChanges) {

                if (data.lenderChanges[k].actionable == true) {
                    databody[indx] = "{\"tag\":  \"" + data.lenderChanges[k].tag + "\", \"id\": \"" + data.lenderChanges[k].id + "\", \"Status\": \"" + type + "\"}"
                    indx++;
                }
                else {
                    console.log(" Skipping lender with tag :" + data.lenderChanges[k].tag + " and id " + data.lenderChanges[k].id + " as actionable is set to " + data.lenderChanges[k].actionable)
                }
            }
            var dealbody;

            if (databody.length > 0) {
                dealbody = {
                        "transactionId": dealID,
                        "lenderRequestId": data.lenderRequestId,
                        "changeStatusList": [JSON.parse(databody)]
                    } 
            }
            else {
                dealbody = {
                    "transactionId": dealID,
                    "lenderRequestId": data.lenderRequestId,
                    "changeStatusList": []
                };  
            }

            var JSONBody1 = JSON.stringify(dealbody);
            console.log(JSONBody1);
            var opts = {
                "headers": {
                    "content-type": "application/json",
                    "Authorization": '' + Token + '',
                    "XFCTAuthorization": '' + XFCTAuthorizationVal + '',
    
                },
                    "body" : JSONBody1, 
                    "url": EndPoint + Resource + dealID + ResourcePart,
                    "rejectUnauthorized": false
            };
            Request.post(opts, function (data, response) { 

                expect(response.statusCode).toBe(200, "Amendment service response");
                browser.sleep(5000);
            });
         
        });
        return defered.promise;
    }


    
    var UpdateIDVInformation = function(mortgagorCollection,lenderCode, IDVType)
    {
        
        var IDVType1, IDVType2;
        if(lenderCode =="-02")  // BNS Deal
        {
            IDVType1 = "Canadian Passport";
            IDVType2="Canadian Permanent Resident Card";
        }
        else
        {
            if(IDVType == "IDVTypeA")
            {
                IDVType1 = "Canadian Driver's License";  //"CanadianDriverLicense" ;
                IDVType2="Passport (Canadian or International)";
            }
            else
            {
                IDVType1 = "Canadian Property Tax Assessment (Municipal)";
                IDVType2="Canadian Birth Certificate";
            }
            
        }
        var MortgagorName;
        for(var i=0;i < mortgagorCollection.length; i++)
        {
            if(mortgagorCollection[i].mortgagorType == 'Person')
            {
                if(mortgagorCollection[i].middleName != null)
                {
                    MortgagorName = mortgagorCollection[i].firstName + " " +mortgagorCollection[i].middleName + " " + mortgagorCollection[i].lastName;
                }
                else
                {
                    MortgagorName = mortgagorCollection[i].firstName + " " + mortgagorCollection[i].lastName;
                }
                if(mortgagorCollection[i].birthdate == null)
                {
                    mortgagorCollection[i].birthdate = "1980-03-03";
                }
                if(mortgagorCollection[i].occupation == null)
                {
                    mortgagorCollection[i].occupation = "Engineer";
                }
                mortgagorCollection[i].identifications  = [{ 
                    "identificationType": IDVType1, 
                     "identificationNumber": "122344",
                     "expiryDate": "2029-02-02", 
                     "issuingJurisdiction": "Oakville",
                     "issuingCountry": "Canada", 
                     "verificationDate": "2020-01-01",
                     "fullName":MortgagorName, // "Marilyn J. Monroe",
                     "birthdate": "1980-01-01",
                     "address": "17, Lakeshore Blvd. West, Toronto",
                     "nameVerified": true,
                     "birthdateVerified": true
                 },
                 { 
                    "identificationType": IDVType2, 
                     "identificationNumber": "787755",
                     "expiryDate": "2029-02-02", 
                     "issuingJurisdiction": "Milton",
                     "issuingCountry": "Canada", 
                     "verificationDate": "2020-01-01",
                     "fullName":MortgagorName,// "Marilyn J. Monroe",
                     "birthdate": "1980-01-01",
                     "address": "17, Lakeshore Blvd. West, Toronto",
                     "nameVerified": true,
                     "birthdateVerified": true
                 }];

             
            }
            else
            {
                mortgagorCollection[i].signatories  =[
                    {
                        "title": "Mr",
                        "firstName": "Ashok",
                       "middleName": "Kumar",
                        "lastName": "Aggarwal",
                        "birthdate": "1967-09-09",
                        "occupation": "Doctor",
                        "identifications": [{ 
                            "identificationType": IDVType1, 
                             "identificationNumber": "122344",
                             "expiryDate": "2029-02-02", 
                             "issuingJurisdiction": "Oakville",
                             "issuingCountry": "Canada", 
                             "verificationDate": "2020-01-01",
                             "fullName": "Marilyn J. Monroe",
                             "birthdate": "1980-01-01",
                             "address": "17, Lakeshore Blvd. West, Toronto",
                             "nameVerified": true,
                             "birthdateVerified": true
                         },
                         { 
                            "identificationType": IDVType2, 
                             "identificationNumber": "787755",
                             "expiryDate": "2029-02-02", 
                             "issuingJurisdiction": "Milton",
                             "issuingCountry": "Canada", 
                             "verificationDate": "2020-01-01",
                             "fullName": "Marilyn J. Monroe",
                             "birthdate": "1980-01-01",
                             "address": "17, Lakeshore Blvd. West, Toronto",
                             "nameVerified": true,
                             "birthdateVerified": true
                         }]
                    }
                ]
            }
        }
        return mortgagorCollection; 
    }


    var UpdateGuarantorIDVInformation = function(guarantorCollection,lenderCode, IDVType)
    {
        
        var IDVType1, IDVType2;
        if(lenderCode =="-02")  // BNS Deal
        {
            IDVType1 = "Canadian Passport";
            IDVType2="Canadian Permanent Resident Card";
        }
        else
        {
            if(IDVType == "IDVTypeA")
            {
                IDVType1 =  "Canadian Driver's License";  //"CanadianDriverLicense" ;//
                IDVType2="Passport (Canadian or International)";
            }
            else
            {
                console.log("In TD IDV B");
               IDVType1 = "Insurance Documents Issued by a Canadian insurer";
                IDVType2="Canadian Credit Card Statement (other than TD)";
            }
            
        }
        var MortgagorName;
        for(var i=0;i < guarantorCollection.length; i++)
        {
            if(guarantorCollection[i].guarantorType == 'Person')
            {
                if(guarantorCollection[i].middleName != null)
                {
                    MortgagorName = guarantorCollection[i].firstName + " " +guarantorCollection[i].middleName + " " + guarantorCollection[i].lastName;
                }
                else
                {
                    MortgagorName = guarantorCollection[i].firstName + " " + guarantorCollection[i].lastName;
                }
                if(guarantorCollection[i].birthdate == null)
                {
                    guarantorCollection[i].birthdate = "1980-03-03";
                }
                if(guarantorCollection[i].occupation == null)
                {
                    guarantorCollection[i].occupation = "Engineer";
                }

                guarantorCollection[i].identifications  = [{ 
                    "identificationType": IDVType1, 
                     "identificationNumber": "122344",
                     "expiryDate": "2029-02-02", 
                     "issuingJurisdiction": "Oakville",
                     "issuingCountry": "Canada", 
                     "verificationDate": "2020-01-01",
                     "fullName":MortgagorName, // "Marilyn J. Monroe",
                     "birthdate": "1980-01-01",
                     "address": "17, Lakeshore Blvd. West, Toronto",
                     "nameVerified": true,
                     "birthdateVerified": true
                 },
                 { 
                    "identificationType": IDVType2, 
                     "identificationNumber": "787755",
                     "expiryDate": "2029-02-02", 
                     "issuingJurisdiction": "Milton",
                     "issuingCountry": "Canada", 
                     "verificationDate": "2020-01-01",
                     "fullName":MortgagorName,// "Marilyn J. Monroe",
                     "birthdate": "1980-01-01",
                     "address": "17, Lakeshore Blvd. West, Toronto",
                     "nameVerified": true,
                     "birthdateVerified": true
                 }];

             
            }
            else
            {
                guarantorCollection[i].signatories  =[
                    {
                        "title": "Mr",
                        "firstName": "Ashok",
                       "middleName": "Kumar",
                        "lastName": "Aggarwal",
                        "birthdate": "1967-09-09",
                        "occupation": "Doctor",
                        "identifications": [{ 
                            "identificationType": IDVType1, 
                             "identificationNumber": "122344",
                             "expiryDate": "2029-02-02", 
                             "issuingJurisdiction": "Oakville",
                             "issuingCountry": "Canada", 
                             "verificationDate": "2020-01-01",
                             "fullName": "Marilyn J. Monroe",
                             "birthdate": "1980-01-01",
                             "address": "17, Lakeshore Blvd. West, Toronto",
                             "nameVerified": true,
                             "birthdateVerified": true
                         },
                         { 
                            "identificationType": IDVType2, 
                             "identificationNumber": "787755",
                             "expiryDate": "2029-02-02", 
                             "issuingJurisdiction": "Milton",
                             "issuingCountry": "Canada", 
                             "verificationDate": "2020-01-01",
                             "fullName": "Marilyn J. Monroe",
                             "birthdate": "1980-01-01",
                             "address": "17, Lakeshore Blvd. West, Toronto",
                             "nameVerified": true,
                             "birthdateVerified": true
                         }]
                    }
                ];
   
            }
        }
        return guarantorCollection; 
    }


    this.UpdateTransactionData = function (dealID,closingdate, AssessmentRollNumber,propertyIdentificationNumbers,instrumentNumber, registrationDate,RegistryOffice,PropertyProvince,IDVType,legalDescription,estateType,attorney,realestate ='Y') {
        var Env = Runsettings.data.Global.ENVIRONMENT.value;
        var AuthorizationToken = Runsettings.data.Global.LawyerDetails[Env].Authorization;
        var authenticatedFctUserName = Runsettings.data.Global.LawyerDetails[Env].authenticatedFctUser;
        var partnerUserName = Runsettings.data.Global.LawyerDetails[Env].partnerUserName;
        var firstName = Runsettings.data.Global.LawyerDetails[Env].firstName;
        var lastName = Runsettings.data.Global.LawyerDetails[Env].lastName;
        var businessRole = Runsettings.data.Global.LawyerDetails[Env].businessRole;
        var fctUserName = Runsettings.data.Global.LawyerDetails[Env].fctUserName;
        var EndPoint = Runsettings.data.Global.LawyerDetails[Env].Endpoint;
        var Resource = Runsettings.data.Global.LawyerDetails[Env].Resource;
        var options = function () {
            var OPtBody = {
                "headers": {
                    "content-type": "application/json",
                    "Authorization": '' + Token + '',
                    "XFCTAuthorization": '' + XFCTAuthorizationVal + '',
    
                },
                "url": EndPoint + Resource + dealID,
                "rejectUnauthorized": false
            }
            return OPtBody
        }

        var Request = require("request");
        Request.get(options(), function (error, response, body) {
            expect(response.statusCode).toBe(200, "GetTransactionData call is unsuccessfull.");
            var dealResponse = JSON.parse(body);

            if(closingdate==null)
            {
                closingdate = dealResponse.mortgage.closingDate;
            }
            if(propertyIdentificationNumbers != null)
            {
                dealResponse.properties[0].propertyIdentificationNumbers =  propertyIdentificationNumbers;
            }
            if(dealResponse.transactionType == null)
            {
                dealResponse.transactionType = "PURCHASE";
            }
            if(PropertyProvince != null)
            {
                dealResponse.properties[0].address.province =  PropertyProvince;
            }
            if(RegistryOffice == null)
            {

                RegistryOffice = 'Peel';
                
            }
            if(instrumentNumber !=null)
            {
                dealResponse.properties[0].instrumentNumber = instrumentNumber;
            }

            if(registrationDate !=null)
            {
                dealResponse.properties[0].registrationDate = registrationDate;
            }

            if(AssessmentRollNumber !=null)
            {
                dealResponse.properties[0].assessmentRollNumbers = AssessmentRollNumber;
            }

            if(legalDescription != null)
            {
                dealResponse.properties[0].legalDescription = legalDescription;
            }
            if(estateType != null)
            {
                dealResponse.properties[0].estateType = estateType;
            }
            else
            {
                if(dealResponse.properties[0].estateType==null)
                {
                    dealResponse.properties[0].estateType = 'FEE SIMPLE';
                }
            }

            var numberOfUnits = '4'
            //Update Property Details
            dealResponse.properties[0].numberOfUnits = numberOfUnits;
            dealResponse.properties[0].newHomeWarranty = true;
            dealResponse.properties[0].municipality = "Oakville";
            dealResponse.properties[0].annualTaxAmount= "3456";
            dealResponse.properties[0].registryOffice= RegistryOffice;
            dealResponse.properties[0].lroNumber= "242423";
            dealResponse.properties[0].newConstruction= true;       
            dealResponse.properties[0].fireInsurancePolicy = {
                "insuranceCompanyName":  "Fire Insurance Co Inc",
                "phone": "647 852 3698",
                "fax": "852 369 8412",
                "policyNumber": "235435",
                "policyActiveDate": "2019-09-05",
                "expiryDate": "2039-09-05",
                "insuranceAmount": "456",
                "broker": "real Estate Broker",
                "agentFirstName": "Ravi Kumar",
                "agentLastName": "Mehra",
                "brokerPhone": "416-987-7654",
                "unitNumber": "1",
                "streetNumber": "232",
                "address": "Test street",
                "address2": null,
                "city": "Oakville",
                "province": "ON",
                "postalCode": "L9J7H9",
                "country": "Canada",
                "guaranteedReplacementCoverage" : true,
              };
            var titleInsuranceDetails = 
              [{ 
                    "insuranceCompany": "Insurance Co", 
                    "policyType": "LENDER", 
                    "policyNumber": "3984759384",
                    "policyDate": "2039-10-10",
                    "nameOfInsured": "Insurance Capital", 
                    "insuredAmount": "4000" 
                }];

            var MortColl, GuarnColl;
            if(IDVType != null)
            {
                MortColl =  UpdateIDVInformation(dealResponse.mortgagors, dealResponse.lenderCode,IDVType);
            }
            else
            {
                MortColl =  dealResponse.mortgagors;
            }

            if(IDVType != null)
            {
                GuarnColl =  UpdateGuarantorIDVInformation(dealResponse.guarantors, dealResponse.lenderCode,IDVType);
            }
            else
            {
                GuarnColl =  dealResponse.guarantors;
            }

            var arroneydata = null;

            if(attorney == "Y")
            {
                arroneydata=  [
                    {
                        "mortgagorId":dealResponse.mortgagors[0].id,
                        "fullName": "Ankur Sharma",
                        "birthdate": "1993-04-17T15:38:34.704Z",
                        "occupation": "Teacher",
                        "identifications": [
                            {
                                "identificationType": "Canadian Driver's License",  //"CanadianDriverLicense",
                                "identificationNumber": "12345678765",
                                "expiryDate": "2024-04-17T15:38:34.704Z",
                                "issuingJurisdiction": "Ontario",
                                "issuingCountry": "Canada",
                                "verificationDate": "2019-04-17T15:38:34.704Z",
                                "fullName": "Ankur Sharma",
                                "birthdate": "1993-04-17T15:38:34.704Z",
                                "address": "56 Test Street Oakville",
                                "nameVerified": true,
                                "birthdateVerified": true,
                                "category": "ABCD"
                            }
                        ]
                    }
                ];
            }

            var realEstateDetails = null;

            if(realestate=='Y')
            {
                realEstateDetails ={
                    "firmName": null,
                    "firstName": "guravtar",
                    "lastName": "sandhu",
                    "phone": null
                };
            }
            
            var dealdata = {
                "transactionId": dealID,
                "closingDate": closingdate, // dealResponse.mortgage.closingDate,
                "purchasePrice": dealResponse.mortgage.purchasePrice,
                "lawyerMatterNumber":"145253256",
                "transactionType": dealResponse.transactionType,
                "encumbrances": dealResponse.encumbrances,
                "mortgagors": MortColl, 
                "guarantors": GuarnColl, 
                "properties": dealResponse.properties,
                "titleInsurancePolicies": titleInsuranceDetails,
                "attorneys": arroneydata,
                "vendorSolicitor": {
                    "firmName": " Besmer Financial Services",
                    "firstName": "Sean",
                    "lastName": "Ainley"
                },
                "realEstateAgent": realEstateDetails,
                 "witness": null
            };
            var JSONBody1 = JSON.stringify(dealdata);
            //console.log(JSONBody1);
            var options = {
                "headers": {
                    "content-type": "application/json",
                    "Authorization": '' + Token + '',
                    "XFCTAuthorization": '' + XFCTAuthorizationVal + '',
    
                },
                "body": JSONBody1,
                "url": EndPoint + Resource,
                "rejectUnauthorized": false

            };
            Request.post(options, function (data, response) {
                expect(response.statusCode).toBe(200, "UpdateTransaction Data service call is unsuccessfull.");
            });

        });
    }


    this.GetDocumentList = function (fcturn, callback) {
        var GetDocumentListEndPoint = Runsettings.data.Global.BNS[Env].EndPoint;
        var ResourceURL = Runsettings.data.Global.BNS[Env].Resource + fcturn + '/documents';
        var JSONBody = "";
        var JSONBody1 = JSON.stringify(JSONBody);
        var DocumentID = null;  

          var OPtBody = {
            "headers": {
                "content-type": "application/json",
                "Authorization": '' + Token + '',
                "XFCTAuthorization": '' + XFCTAuthorizationVal + '',

            },
                'method': 'GET',
                "url": GetDocumentListEndPoint + ResourceURL,
                "body": JSONBody1,
                "rejectUnauthorized": false
            }
            
              
            var Request = require("request");
            return Request(OPtBody, function (error, response, body) {

                if (error || response.statusCode != 200) {
                    expect(response.statusCode).toBe(200, "GetDocumentList service unsuccessful.");
                }
               
                else {  
                    if (response.statusCode == 200) {
                    DocumentID = (JSON.parse(response.body))[0].documentId;       
                    callback(DocumentID); // is like a promise
                }
            }
            })          
    }

    this.VerifyGetDocument = function (fcturn, documentId) {
        Counter = 0;
        return VerifyGetDocumentTllSuccess(fcturn, documentId)
    }

    var VerifyGetDocumentTllSuccess = function (fcturn, documentId) {
        var GetDocumentEndPoint = Runsettings.data.Global.BNS[Env].EndPoint;
        var ResourceURL = Runsettings.data.Global.BNS[Env].Resource + fcturn + '/documents/' + documentId;
        var JSONBody = "";
        var JSONBody1 = JSON.stringify(JSONBody);
        var url = GetDocumentEndPoint + ResourceURL;

      

        var OPtBody = {
            "headers": {
                "content-type": "application/json",
                "Authorization": '' + Token + '',
                "XFCTAuthorization": '' + XFCTAuthorizationVal + '',

            },
                "url": url,
                'method': 'GET',
                "body": JSONBody1,
                "rejectUnauthorized": false
        }
        
        var Request = require("request");

        Request(OPtBody, function (error, response, body) {
            Counter++
            if ((error || response.statusCode != 200)) {
                if(Counter < CounterMax)
                {
                   VerifyGetDocumentTllSuccess(fcturn, documentId) 
                }
          
            }
            else {
                if (response.statusCode == 200) {
                   
                         jsonResponse = JSON.parse(response.body);
                         expect(jsonResponse.documentType).not.toBe(null, "GetDocumentType is null");
               
                }
            }
        })
        
    }

    

    
}
module.exports = new LawyerIntegrationCommon();
