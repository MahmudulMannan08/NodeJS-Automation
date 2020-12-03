'use strict';
var resolve = require("path").resolve;
var date = new Date();
var month = date.getMonth() + 1;
var timeStamp = '_' + month + '-' + date.getDate() + '-' + date.getFullYear() + '-' + date.getHours() + 'h' + date.getMinutes() + 'm' + date.getSeconds() + 's';
var reportsDirectory = '..\\reports';
var jasmineReportsPDirectory = '..\\reports\\JasmineReports';
var jasmineReportsDirectory = '..\\reports\\JasmineReports\\jasmine-report' + "_" + timeStamp;
var htmlReportDirectory = '..\\reports\\HTMLReports\\';
var allureReportDirectory = '..\\reports\\AllureReports\\allure-results' + "_" + timeStamp;
exports.config = {

    framework: 'jasmine2',
    seleniumAddress: 'http://localhost:4444/wd/hub',
    //chromeDriver: '..\\resources\\chromedriver.exe',
    //seleniumserverjar: '..\\resources\\selenium-server-standalone-3.141.59.jar',
    environment:'RQA2', //PREPROD//RQA2//PROD//RQA1//DR
    soapPath:"C:\\Program Files\\SmartBear\\SoapUI-5.2.1\\bin",
    keystoreCertificate:"intprod.pfx",
    keystorePassword:"Oakville1",
    basicAuthUser: "s-testqa@prefirstcdn.com",
    basicAuthPass:"Password1",
    basicAuthUserDRPROD: "testuser",
    basicAuthPassDRPROD: "P@33word",
    multiCapabilities: [
        { browserName: "chrome" ,
        trustAllSSLCertificates: true,
        acceptInsecureCerts: true,
        ACCEPT_SSL_CERTS: true,},
    ],
    // multiCapabilities: [
    //     { browserName: "chrome" },
    // ],
    directConnect: true,
    suites: {

       PatchFlow: '..//TestScripts/Patchflow.js',
       // ApplicationHealthCheck: '..//TestScripts/ApplicationHealthCheck.js',
       /*---   TD Regression Scripts ---*/
      /* TDDealHistory: '..//TestScripts/TD/DealHistory/DealHistory.js',
        TDFinalReportON: '..//TestScripts/TD/FinalReport/FinalReport.js',
        TDRequstForFundsON: '..//TestScripts/TD/RequstForFunds/RequstForFunds.js',
        Others: '..//TestScripts/TD/Others/Others.js',
        TDNotes: '..//TestScripts/TD/Notes/Notes.js',
        TDDealHistory_AllProv: '..//TestScripts/TD/DealHistory/PINInfoVerification.js',  //US 24.1
        TDDealFlowAllProv: '..//TestScripts/TD/DealFlow/DealFlow_AllProv.js',
        TDAmendments_AllProv: '..//TestScripts/TD/Amendments/TDAmendmentLegalDescPINScenarios_Allprov.js', //US 21.1 - Lender amendments
        TDDocuments: '..//TestScripts/TD/ManageDocuments/Documents.js',
        TDCancellation: '..//TestScripts/TD/Cancellation/DealCancellation.js',*/
      //  TDAmendments: '..//TestScripts/TD/Amendments/Amendments.js',

        /*---   BNS Regression Scripts ---*/
        /*BNSSROTScenarioAllProv:'..//TestScripts/BNS/FinalReport/FinalReport_AllProv.js', //US 3.3, US 17.2
        BNSDealFlowONSolicitorFalse:'..//TestScripts/BNS/DealFlow/DealFlow_ON_SolicitorCloseFalse.js',
        BNSDealFlowONSolicitorTrue:'..//TestScripts/BNS/DealFlow/DealFlow_ON_SolicitorTrue.js',
        BNSDealFlowAllProvinces: '..//TestScripts/BNS/DealFlow/BNSDealFlow_AllProv.js',
        BNSStandardCharUS:'..//TestScripts/BNS/Documents/Scenarios_AllProv_Doctype.js',  //US 7.1
        BNSRFF:'..//TestScripts/BNS/RequestForFunds/RequestForFunds.js',
        BNSDealCancellation:'..//TestScripts/BNS/Others/DealCancellation.js',
        BNSDocs:'..//TestScripts/BNS/Documents/Documents.js',
        BNSAmendments_AllProv:'..//TestScripts/BNS/Amendments/BNSAmendmentPINLegalDescScenarios_Allprov.js',  //US 21.1 - Lender amendments  
        BNSAmendments:'..//TestScripts/BNS/Amendments/Amendments.js',
        BNSEmailVerification:'..//TestScripts/BNS/Others/EmailValidation.js',*/

    /*---   MMS Regression Scripts  ---*/
    //MMSDealflowCOI: '..//TestScripts/MMS/DealFlow/MMS-DealFlow_COI.js',
   // MMSFlow_All4Lenders_ON: '..//TestScripts/MMS/DealFlow/MMS-Deal Flow_4 lenders.js',
    //MMSPrefundingscenariosAB: '..//TestScripts/MMS/PIF/MMS-PreFundingScenarios-AB.js',  //US 1.1
    //MMSPrefundingscenariosMB: '..//TestScripts/MMS/PIF/MMS-PreFundingScenarios-MB.js', //US 1.2
   // MMSPrefundingscenariosON: '..//TestScripts/MMS/PIF/MMS-PreFundingScenarios-ON.js',  
    //MMSPrefundingscenariosNB: '..//TestScripts/MMS/PIF/MMS-PreFundingScenarios-NB.js',
    //MMSManageDocAll4Lenders: '..//TestScripts/MMS/Documents/MMS-ManageDocScenario_4 Lenders.js',
    //MMSAmendmentScenarios: '..//TestScripts/MMS/Amendments/MMS-AmendmentScenarios.js',  
     // MMS_AllProvinces_PIF_Decoupling: '..//TestScripts/MMS/DealFlow/AllProvinces_PIF_Decoupling.js',
       // MMSDealCancel: '..//TestScripts/MMS/DealFlow/MMS-Deal Cancellation.js',
      //  MMSDealDecline: '..//TestScripts/MMS/DealFlow/MMS-DeclineDeal.js',
       //MMSManageDocScenarios: '..//TestScripts/MMS/Documents/MMS-Manage Documents.js',
       // MMSNotes: '..//TestScripts/MMS/Notes/MMS-Notes.js',
      //  MMSAmendmentsUS21: '..//TestScripts/MMS/Amendments/MMSAmendmentLegalDescScenarios_AllProv.js',  //US 21.1 - Lender amendments 

    },


    getPageTimeout: 15000, // time to load URL
    allScriptsTimeout: 15000, // wait for angular sync timeout

    jasmineNodeOpts: {
        defaultTimeoutInterval: 2500000,
        showColors: true,
        isVerbose: true,
        includeStackTrace: true,
        //shardTestFiles:true,
        //showTiming: true,
    },
    params: './Testdata.JSON',
    useAllAngular2AppRoots: true,
    beforeLaunch: function () {
    },

    onPrepare: function () {
        //*********SpecReport, HTML Report**************//
        var SpecReporter = require('jasmine-spec-reporter').SpecReporter;
        var HtmlScreenshotReporter = require('protractor-jasmine2-html-reporter');
        browser.manage().window().maximize();
        jasmine.getEnv().addReporter(new SpecReporter()); // ----------- Better terminal output  
        jasmine.getEnv().addReporter(
            new HtmlScreenshotReporter({
                //baseDirectory: '../TestResults/',
                savePath: htmlReportDirectory,
                fileName: 'TestReport',
                fileNameDateSuffix: true,
                cleanDestination: false,
            })
        )
        //********Allure Report*********/      

        var AllureReporter = require('jasmine-allure-reporter');
        jasmine.getEnv().addReporter(new AllureReporter({
            resultsDir: allureReportDirectory
        }));
        jasmine.getEnv().afterEach(function (done) {
            browser.takeScreenshot().then(function (png) {
                allure.createAttachment('Screenshot', function () {
                    return new Buffer(png, 'base64')
                }, 'image/png')();
                done();
            })
        });

        //*************Jasmine Report*******/        
        var jasmineReporters = require('jasmine-reporters');
        return browser.getProcessedConfig().then(function (config) {
            var browserName = config.capabilities.browserName;
            var junitReporter = new jasmineReporters.JUnitXmlReporter({
                consolidateAll: true,
                savePath: jasmineReportsDirectory,
                filePrefix: 'xmlOutput'
            });
            jasmine.getEnv().addReporter(junitReporter);

            var fs = require('fs-extra');
            if (!fs.existsSync(reportsDirectory)) {
                fs.mkdirSync(reportsDirectory);
            }
            if (!fs.existsSync(jasmineReportsPDirectory)) {
                fs.mkdirSync(jasmineReportsPDirectory);
            }
             if (!fs.existsSync(jasmineReportsDirectory)) {
                fs.mkdirSync(jasmineReportsDirectory);
            }
            if (!fs.existsSync(jasmineReportsDirectory + '\\' + "screenshots")) {
                fs.mkdirSync(jasmineReportsDirectory + '\\' + "screenshots");
            }

            jasmine.getEnv().addReporter({
                specDone: function (result) {
                    if (result.status == 'failed') {
                        browser.getCapabilities().then(function (caps) {                            
                            browser.takeScreenshot().then(function (png) {
                                if(result.fullName.length<99){                                
                                var stream = fs.createWriteStream(jasmineReportsDirectory + '/' + "screenshots" + '/' + browserName + '-' + result.fullName + '.png');
                                stream.write(new Buffer(png, 'base64'));
                                stream.end();
                                }
                            });
                        });
                    }
                }
            });
        });
    },

    onComplete: function () {
        //*************Jasmine Report*******/
        var browserName, browserVersion, platform;
        var capsPromise = browser.getCapabilities();
        capsPromise.then(function (caps) {
            browserName = caps.get('browserName');
            browserVersion = caps.get('version');
            platform = caps.get('platform');

            var HTMLReport = require('protractor-html-reporter-2');
            var testConfig = {
                reportTitle: 'Protractor Test Execution Report',
                outputPath: jasmineReportsDirectory,
                outputFilename: 'jasmine-report',
                screenshotPath: '.\\screenshots',
                testBrowser: browserName,
                browserVersion: browserVersion,
                modifiedSuiteName: false,
                screenshotsOnlyOnFailure: true,
                testPlatform: platform
            };
            new HTMLReport().from(jasmineReportsDirectory + '/xmlOutput.xml', testConfig);
        });
    }
};

