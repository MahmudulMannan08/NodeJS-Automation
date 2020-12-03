'use strict';
var Runsettings = require('../../../../testData/RunSetting.js');
var q = require('q');
var defered = q.defer();
var CounterDealStatus = 0;
var TransactionStatus = null;
var Client = require('node-rest-client').Client;
var Env = Runsettings.data.Global.ENVIRONMENT.value;
var Token = Runsettings.data.Global.LawyerDetails[Env].Token.value;
var XFCTAuthorizationVal = Runsettings.data.Global.LawyerDetails[Env].XFCTAuthorizationVal.value;
var LawyerIntegrationTD = function () {

    this.ReturnTransactionStatus = function () {

        return TransactionStatus;
    }
    
    var VerifyIfDealUpdatedinDB = function (fcturn, status) {
        var AcceptDealEndPoint = Runsettings.data.Global.LawyerDetails[Env].Endpoint;
        var ResourceURL = Runsettings.data.Global.LawyerDetails[Env].Resource + fcturn + '/status';
        var options = function () {
            var OPtBody = {
                "headers": {
                    "content-type": "application/json",
                    "Authorization": '' + Token + '',
                    "XFCTAuthorization": '' + XFCTAuthorizationVal + '',

                },
                "url": AcceptDealEndPoint + ResourceURL,
                "rejectUnauthorized": false
            }
            return OPtBody
        }

        var request = require('request');
        request.get(options(), function (error, response, body) {
            if (response.statusCode != 200) {
                defered.reject(error)
                browser.sleep(2000);
                CounterDealStatus++
                if (CounterDealStatus < 1000) {
                    console.log("Counter " + CounterDealStatus);
                    VerifyIfDealUpdatedinDB(fcturn, status);

                }
            }
            else {
                defered.resolve(response);
                defered.fulfill();
            }
        });
        return defered.promise;
    }

    this.EstablishConnection = function (fcturn, status) {
        CounterDealStatus = 0;
        VerifyIfDealUpdatedinDB(fcturn, status);

    }


}
module.exports = new LawyerIntegrationTD();
