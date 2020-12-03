'use strict'
var LenderIntegrationBNS = require('../../../PageObjectMethods/LLCUnityPortal/Services/LenderIntegration/LenderIntegrationBNS.js');
var LawyerIntegrationCommon = require('../../../PageObjectMethods/LLCUnityPortal/Services/LawyerIntegration/LawyerIntegrationCommon.js');
var LawyerIntegrationBNS = require('../../../PageObjectMethods/LLCUnityPortal/Services/LawyerIntegration/LawyerIntegrationBNS.js');

//Sprint 4:US 7.1

describe('US: 7.1 All provinces Doc Update ', function () {
    var BNSdealData = '../../../TestData/BNS/BNSDealtData.txt';
    var path = require('path');
    var DocumentPath = path.resolve(__dirname, BNSdealData);
    var BNSFctUrn = null;

    afterAll(function () {
        LenderIntegrationBNS.CleanUpScript();
    });
    
    function maintest(provinceName, docType, expectedValue) {
        it('Generate BNS Deal - Create deal soap service', function () {
            LenderIntegrationBNS.CreateBNSDealWithDocType('false', 'true', provinceName, docType);
        })

        it('Accept Deal - AcceptReject soap service', function () {
            BNSFctUrn = LenderIntegrationBNS.ReturnFctUrn();
            if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) {
                //Accepting the deal
                console.log("FCTURN "+ BNSFctUrn);
                LawyerIntegrationCommon.AcceptRejectDeal(BNSFctUrn, "ACTIVE");
                LawyerIntegrationBNS.verifyBNSDealMortageStdChargeTerm(BNSFctUrn, expectedValue, provinceName, docType);
            }
            else {
                expect(BNSFctUrn).not.toBe(undefined, "CreateBNSDeal service timed out!!!");
                expect(BNSFctUrn).not.toBe(null, "CreateBNSDeal service timed out!!!");
            }
        })
    }

    const fs = require('fs');
    const csv = fs.readFileSync(DocumentPath, 'utf8')
    var row = csv.split(/\r\n|\r|\n/);

    for (var i = 0; i < row.length; i++) {
        var cols = row[i].split(',');
        maintest(cols[0], cols[2].replace("N/A", ""), cols[3].replace("N/A", ""))
    }
});






