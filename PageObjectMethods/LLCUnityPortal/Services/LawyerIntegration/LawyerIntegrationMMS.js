'use strict';
var Runsettings = require('../../../../testData/RunSetting.js');
var CustLib = require('../../../../CustomLibrary/CustomLibrary.js');
var fs = require('fs');
var Client = require('node-rest-client').Client;
var Env = Runsettings.data.Global.ENVIRONMENT.value;
var Token = Runsettings.data.Global.LawyerDetails[Env].Token.value;
var XFCTAuthorizationVal = Runsettings.data.Global.LawyerDetails[Env].XFCTAuthorizationVal.value;
var Counter = 0;
var LawyerIntegrationMMS = function () {

    this.MMSAcceptRejectDeal = function (dealID, DealType, callback) {
        var EndPoint = Runsettings.data.Global.LawyerDetails[Env].Endpoint;
        var Resource = Runsettings.data.Global.LawyerDetails[Env].Resource;
        var dealData = { "TransactionId": dealID, "Status": DealType };
        var JSONBody1 = JSON.stringify(dealData);
        var options = function () {

            var OPtBody = {
                "headers": {
                    "content-type": "application/json",
                    "Authorization": '' + Token + '',
                    "XFCTAuthorization": '' + XFCTAuthorizationVal + '',

                },
                "url": EndPoint + Resource + dealID + "/status",
                "body": JSONBody1,
                "rejectUnauthorized": false
            }
            return OPtBody

        }
        var Request = require("request");
        return Request.post(options(), function (data, response) {
            expect(response.statusCode).toBe(200, "AcceptReject deal service is unsuccessfull.");
            callback(JSON.stringify(response.statusCode)); // is like a promise
        })

    }

    this.getDealStatus = function (dealID, callback) {
        var EndPoint = Runsettings.data.Global.LawyerDetails[Env].Endpoint;
        var Resource = Runsettings.data.Global.LawyerDetails[Env].Resource;
        var client = new Client();
        // set content-type header and data as json in args parameter
        var args = {
            "headers": {
                    "content-type": "application/json",
                    "Authorization": '' + Token + '',
                    "XFCTAuthorization": '' + XFCTAuthorizationVal + '',

                }
        };

        client.get(EndPoint + Resource + dealID, args, function (data, response) {
            fs.writeFile('../Services/MMS/ResponseXMLs/getDealStatus.json', JSON.stringify(data), function (err) {
                if (err) {
                    console.log('Cant write response')
                    console.log(err);
                }
                else {
                    console.log("Response saved " + 'getDealStatus.JSON');
                    browser.sleep(3000);
                }

            });
            callback(JSON.stringify(data));
        })

    }

    this.getAndSendAcceptRejectAmendment = function (dealID, type) {
        Counter = 0;
        getAndSendAcceptRejectAmendmentTillSuccess(dealID, type);
    }

    var getAndSendAcceptRejectAmendmentTillSuccess = function (dealID, type) {
        var EndPoint = Runsettings.data.Global.LenderDetails[Env].Endpoint;
        var Resource = Runsettings.data.Global.LenderDetails[Env].Resource;
        var ResourcePart = Runsettings.data.Global.LenderDetails[Env].ResourcePart;

        var client = new Client();

        // set content-type header and data as json in args parameter
        var args = {
            "headers": {
                "content-type": "application/json",
                "Authorization": '' + Token + '',
                "XFCTAuthorization": '' + XFCTAuthorizationVal + '',

            }
         };
        client.get(EndPoint + Resource + dealID + ResourcePart, args, function (data, response) {
            expect(response.statusCode).toBe(200, "GetLenderResponse get  method failed, status code " + response.statusCode);
            var client = new Client();
            var databody = [];
            var indx = 0;
            for (var k in data.lenderChanges) {

                if (data.lenderChanges[k].actionable == true) {
                    databody[indx] = "{\"tag\":  \"" + data.lenderChanges[k].tag + "\", \"id\": \"" + data.lenderChanges[k].id + "\", \"Status\": \"" + type + "\"}"
                    indx++;
                }
                else {
                    console.log(" Skipping lender with tag :" + data.lenderChanges[k].tag + " and id " + data.lenderChanges[k].id + " as actionable is set to " + data.lenderChanges[k].actionable)
                }
            }
            var args
            if (databody.length > 0) {
                args = {
                    data: {

                        "transactionId": dealID,
                        "lenderRequestId": data.lenderRequestId,
                        "changeStatusList": [JSON.parse(databody)]
                    },
                    "headers": {
                        "content-type": "application/json",
                        "Authorization": '' + Token + '',
                        "XFCTAuthorization": '' + XFCTAuthorizationVal + '',
    
                    } 
                };
            }
            else {
                args = {
                    data: {

                        "transactionId": dealID,
                        "lenderRequestId": data.lenderRequestId,
                        "changeStatusList": []
                    },
                    "headers": {
                        "content-type": "application/json",
                        "Authorization": '' + Token + '',
                        "XFCTAuthorization": '' + XFCTAuthorizationVal + '',
    
                    } 
                 };
            }
            client.post(EndPoint + Resource + dealID + ResourcePart, args, function (data, response) {
                Counter++;
                if (response.statusCode != 200 && Counter < 5) {
                    getAndSendAcceptRejectAmendmentTillSuccess(dealID, type);
                }
                else {
                    expect(response.statusCode).toBe(200, "amendmentResponse post  method failed, status code " + response.statusCode);
                }

            });
        });
    }
}
module.exports = new LawyerIntegrationMMS();
