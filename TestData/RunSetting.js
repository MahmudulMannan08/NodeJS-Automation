'use strict';
var conf2 = require('../Configuration/conf.js');
var token = "28CA95A5-3E8D-4EEA-A7B4-4029A7D7AA80";
//var token = conf2.config.partnerToken;
module.exports = {
    "data": {
        "Global": {
            "LANG": { value: "EN" },
            "ENVIRONMENT": { value: conf2.config.environment }, //PREPROD//RQA2//PROD//RQA1//DR
            "SoapPath": { value: conf2.config.soapPath },
            "keystoreCertificate": { value: conf2.config.keystoreCertificate },
            "keystorePassword": { value: conf2.config.keystorePassword },
            "basicAuthUser": { value: conf2.config.basicAuthUser },
            "basicAuthPass": { value: conf2.config.basicAuthPass },
            "basicAuthUserDRPROD": { value: conf2.config.basicAuthUserDRPROD },
            "basicAuthPassDRPROD": { value: conf2.config.basicAuthPassDRPROD },
            "MMS": {
                "PROD": {
                    "URL": "",
                    "UserName": "test123",
                    "Password": "",
                    "Rel1UserName": "ali",
                    "Rel1Password": "",
                    "Rel2UserName": "",
                    "Rel2Password": "",
                    "Lender": {
                        "0": {
                            "Name": "",
                            "Spec": "Street Capital,",
                            "Branch": "1",
                            "ContactName": "SCFC - Lad Support1002",
                            //"ProgramType": "Street - Closing Solution ON",                            
                            "ONTARIO": {
                                "ProgramType": "Street - Closing Solution ON",
                            },
                            "ALBERTA": {
                                "ProgramType": "Street - Closing Solution AB",
                            },
                            "MANITOBA": {
                                "ProgramType": "Street - Closing Solution MB",
                            },
                            "NEW BRUNSWICK": {
                                "ProgramType": "Street - Closing Solution NB",
                            },
                            

                            "MortgageProduct": "Street Select"
                        },
                        "1": {
                            "Name": "",
                            "Spec": "Test, Specialist",
                            "Branch": "1",
                            "ContactName": "User01 Test01",
                            "ProgramType": "Merix - Closing Solution ON",
                            "MortgageProduct": "Adjustable Rate Mortgage"
                        },
                        "2": {
                            "Name": "",
                            "Spec": "Test, Specialist",
                            "Branch": "1",
                            "ContactName": "LAD Support",
                            "ProgramType": "B2B - Closing Solution ON",
                            "MortgageProduct": "Line of Credit"
                        },
                        "3": {
                            "Name": "",
                            "Spec": "Test, Specialist",
                            "Branch": "1",
                            "ContactName": "Test User",
                            "ProgramType": "RMG - Closing Solutions ON",
                            "MortgageProduct": "A5 - Fixed Rate Mortgage"
                        },
                    },

                    "LawyerDataLawFirm": "",
                },
                "DR": {
                    "URL": "http://mmsintdrlb.firstcdn.com/FCTPortal/SignOn.aspx",
                    "UserName": "test123",
                    "Password": "",
                    "Rel1UserName": "ali",
                    "Rel1Password": "",
                    "Rel2UserName": "",
                    "Rel2Password": "",
                    "Lender": {
                        "0": {
                            "Name": "",
                            "Spec": "Street Capital,",
                            "Branch": "1",
                            "ContactName": "SCFC - Lad Support1002",
                            "Province": "ONTARIO",
                            //"ProgramType": "Street - Closing Solution ON",                            
                            "ONTARIO": {
                                "ProgramType": "Street - Closing Solution ON",
                            },
                            "ALBERTA": {
                                "ProgramType": "Street - Closing Solution AB",
                            },
                            "MANITOBA": {
                                "ProgramType": "Street - Closing Solution MB",
                            },
                            "NEW BRUNSWICK": {
                                "ProgramType": "Street - Closing Solution NB",
                            },
                           
                            "MortgageProduct": "Street Select"
                        },
                        "1": {
                            "Name": "",
                            "Spec": "Test, Specialist",
                            "Branch": "1",
                            "ContactName": "User01 Test01",
                            "ProgramType": "Merix - Closing Solution ON",
                            "MortgageProduct": "Adjustable Rate Mortgage"
                        },
                        "2": {
                            "Name": "",
                            "Spec": "Test, Specialist",
                            "Branch": "1",
                            "ContactName": "LAD Support",
                            "ProgramType": "B2B - Closing Solution ON",
                            "MortgageProduct": "Line of Credit"
                        },
                        "3": {
                            "Name": "",
                            "Spec": "Test, Specialist",
                            "Branch": "1",
                            "ContactName": "Test User",
                            "ProgramType": "RMG - Closing Solutions ON",
                            "MortgageProduct": "A5 - Fixed Rate Mortgage"
                        },
                    },

                    "LawyerDataLawFirm": "",
                },
                "PREPROD": {
                    "URL": "http://mmsintsg.prefirstcdn.com/FCTPortal/SignOn.aspx",
                    "UserName": "testabcd",
                    "Password": "",
                    "Rel1UserName": "ali_scfc",
                    "Rel1Password": "",
                    "Rel2UserName": "test123",
                    "Rel2Password": "",
                    "Lender": {
                        "0": {
                            "Name": "",
                            "Spec": "Test, Specialist",
                            "Branch": "1",
                            "ContactName": "Test Automation",
                            // "ProgramType": "Street - Closing Solution ON",
                            "Province": "ONTARIO",
                            "ONTARIO": {
                                "ProgramType": "Street - Closing Solution ON",
                            },
                            "ALBERTA": {
                                "ProgramType": "Street - Closing Solution AB",
                            },
                            "MANITOBA": {
                                "ProgramType": "Street - Closing Solution MB",
                            },
                            "NEW BRUNSWICK": {
                                "ProgramType": "Street - Closing Solution NB",
                            },
                            "BRITISH COLUMBIA": {
                                "ProgramType": "Street - Closing Solution BC",
                            },
                            "SASKATCHEWAN": {
                                "ProgramType": "Street - Closing Solution SK",
                            },

                            "MortgageProduct": "Street Select"
                        },
                        "1": {
                            "Name": "",
                            "Spec": "Test, Specialist",
                            "Branch": "1",
                            "ContactName": "User01 Test01",
                            //"ProgramType": "Merix - Closing Solution ON",
                            "Province": "MANITOBA",
                            "ONTARIO": {
                                "ProgramType": "Merix - Closing Solution ON",
                            },
                            "ALBERTA": {
                                "ProgramType": "Merix - Closing Solution AB",
                            },
                            "MANITOBA": {
                                "ProgramType": "Merix - Closing Solution MB",
                            },
                            "NEW BRUNSWICK": {
                                "ProgramType": "Merix - Closing Solution NB",
                            },
                            "BRITISH COLUMBIA": {
                                "ProgramType": "Merix - Closing Solution BC",
                            },
                            "SASKATCHEWAN": {
                                "ProgramType": "Merix - Closing Solution SK",
                            },

                            "MortgageProduct": "Adjustable Rate Mortgage"
                        },

                        "2": {
                            "Name": "",
                            "Spec": "Test, Specialist",
                            "Branch": "1",
                            "ContactName": "LAD Support",
                            //"ProgramType": "B2B - Closing Solution ON",
                            "Province": "ALBERTA",
                            "ONTARIO": {
                                "ProgramType": "B2B - Closing Solution ON",
                            },
                            "ALBERTA": {
                                "ProgramType": "B2B - Closing Solution AB",
                            },
                            "MANITOBA": {
                                "ProgramType": "B2B - Closing Solution MB",
                            },
                            "NEW BRUNSWICK": {
                                "ProgramType": "B2B - Closing Solution NB",
                            },
                            "BRITISH COLUMBIA": {
                                "ProgramType": "B2B - Closing Solution BC",
                            },
                            "SASKATCHEWAN": {
                                "ProgramType": "B2B - Closing Solution SK",
                            },
                            "MortgageProduct": "Line of Credit"
                        },
                        "3": {
                            "Name": "",
                            "Spec": "Test, Specialist",
                            "Branch": "1",
                            "ContactName": "Test User",
                            // "ProgramType": "RMG - Closing Solutions ON",
                            "Province": "NEW BRUNSWICK",
                            "ONTARIO": {
                                "ProgramType": "RMG - Closing Solutions ON",
                            },
                            "ALBERTA": {
                                "ProgramType": "RMG - Closing Solutions AB",
                            },
                            "MANITOBA": {
                                "ProgramType": "RMG - Closing Solutions MB",
                            },
                            "NEW BRUNSWICK": {
                                "ProgramType": "RMG - Closing Solutions NB",
                            },
                            "BRITISH COLUMBIA": {
                                "ProgramType": "RMG - Closing Solution BC",
                            },
                            "SASKATCHEWAN": {
                                "ProgramType": "RMG - Closing Solution SK",
                            },
                            "MortgageProduct": "A5 - Fixed Rate Mortgage"
                        },
                    },

                    "LawyerDataLawFirm": "LLC Unity Automation 2",
                },
                "RQA2": {
                    "URL": "http://iisprimmsiqa02.prefirstcdn.com/FCTPortal/Signon.aspx",
                    "UserName": "testabcd",
                    "Password": "",
                    "Rel1UserName": "ali_scfc",
                    "Rel1Password": "",
                    "Rel2UserName": "test123",
                    "Rel2Password": "",
                    "Lender": {
                        "0": {
                            "Name": "",
                            "Spec": "Test, Specialist",
                            "Branch": "1",
                            "ContactName": "Test Automation",
                            "Province": "ONTARIO",
                            
                            "ONTARIO": {
                                "ProgramType": "Street - Closing Solution ON",
                            },
                            "ALBERTA": {
                                "ProgramType": "Street - Closing Solution AB",
                            },
                            "MANITOBA": {
                                "ProgramType": "Street - Closing Solution MB",
                            },
                            "NEW BRUNSWICK": {
                                "ProgramType": "Street - Closing Solution NB",
                            },
                            "BRITISH COLUMBIA": {
                                "ProgramType": "Street - Closing Solution BC",
                            },
                            "SASKATCHEWAN": {
                                "ProgramType": "Street - Closing Solution SK",
                            },
                                                  
                            "MortgageProduct": "Street Select"
                        },
                        "1": {
                            "Name": "",
                            "Spec": "Test, Specialist",
                            "Branch": "1",
                            "ContactName": "User01 Test01",
                            "Province": "MANITOBA",
                            
                            "ONTARIO": {
                                "ProgramType": "Merix - Closing Solution ON",
                            },
                            "ALBERTA": {
                                "ProgramType": "Merix - Closing Solution AB",
                            },
                            "MANITOBA": {
                                "ProgramType": "Merix - Closing Solution MB",
                            },
                            "NEW BRUNSWICK": {
                                "ProgramType": "Merix - Closing Solution NB",
                            },
                            "BRITISH COLUMBIA": {
                                "ProgramType": "Merix - Closing Solution BC",
                            },
                            "SASKATCHEWAN": {
                                "ProgramType": "Merix - Closing Solution SK",
                            },

                       
                            "MortgageProduct": "Adjustable Rate Mortgage"
                        
                    },
                        "2": {
                            "Name": "",
                            "Spec": "Test, Specialist",
                            "Branch": "1",
                            "ContactName": "LAD Support",
                            "Province": "ALBERTA",
                            
                            "ONTARIO": {
                                "ProgramType": "B2B - Closing Solution ON",
                            },
                            "ALBERTA": {
                                "ProgramType": "B2B - Closing Solution AB",
                            },
                            "MANITOBA": {
                                "ProgramType": "B2B - Closing Solution MB",
                            },
                            "NEW BRUNSWICK": {
                                "ProgramType": "B2B - Closing Solution NB",
                            },
                            "BRITISH COLUMBIA": {
                                "ProgramType": "B2B - Closing Solution BC",
                            },
                            "SASKATCHEWAN": {
                                "ProgramType": "B2B - Closing Solution SK",
                            },
                                                
                            "MortgageProduct": "Line of Credit"
                        
                    },
                        "3": {
                            "Name": "",
                            "Spec": "Test, Specialist",
                            "Branch": "1",
                            "ContactName": "Test User",
                            "Province": "NEW BRUNSWICK",
                           
                            "ONTARIO": {
                                "ProgramType": "RMG - Closing Solutions ON",
                            },
                            "ALBERTA": {
                                "ProgramType": "RMG - Closing Solutions AB",
                            },
                            "MANITOBA": {
                                "ProgramType": "RMG - Closing Solutions MB",
                            },
                            "NEW BRUNSWICK": {
                                "ProgramType": "RMG - Closing Solutions NB",
                            },
                            "BRITISH COLUMBIA": {
                                "ProgramType": "RMG - Closing Solutions BC",
                            },
                            "SASKATCHEWAN": {
                                "ProgramType": "RMG - Closing Solutions SK",
                            },
                                                 
                            "MortgageProduct": "A5 - Fixed Rate Mortgage"
                        
                    },
                        
                                                
                    }, 


                    "LawyerDataLawFirm": "LLC Unity Automation 2",
                },
                "RQA1": {
                    "URL": "http:iisprimmsiqa01.exfirstcdn.com/FCTPortal/Signon.aspx",
                    "UserName": "testabcd",
                    "Password": "",
                    "Rel1UserName": "ali_scfc",
                    "Rel1Password": "",
                    "Rel2UserName": "test123",
                    "Rel2Password": "",
                    "Lender": {
                        "0": {
                            "Name": "Street Capital Financial Corporation",
                            "Spec": "Test, Specialist",
                            "Branch": "1",
                            "ContactName": "Test Automation",
                            //"ProgramType": "Street - Closing Solution ON",
                            "ONTARIO": {
                                "ProgramType": "Street - Closing Solution ON",
                            },
                            "MortgageProduct": "Street Select"
                        },
                        "1": {
                            "Name": "",
                            "Spec": "Test, Specialist",
                            "Branch": "1",
                            "ContactName": "User01 Test01",
                            //"ProgramType": "Merix - Closing Solution ON",
                            "ONTARIO": {
                                "ProgramType": "Merix - Closing Solution ON",
                            },
                            "MortgageProduct": "Adjustable Rate Mortgage"
                        },
                        "2": {
                            "Name": "",
                            "Spec": "Test, Specialist",
                            "Branch": "1",
                            "ContactName": "LAD Support",
                            // "ProgramType": "B2B - Closing Solution ON",
                            "ONTARIO": {
                                "ProgramType": "B2B - Closing Solution ON",
                            },
                            "MortgageProduct": "Line of Credit"
                        },
                        "3": {
                            "Name": "",
                            "Spec": "Test, Specialist",
                            "Branch": "1",
                            "ContactName": "Test User",
                            // "ProgramType": "RMG - Closing Solutions ON",
                            "ONTARIO": {
                                "ProgramType": "RMG - Closing Solutions ON",
                            },
                            "MortgageProduct": "A5 - Fixed Rate Mortgage"
                        },
                    },
                    "LawyerDataLawFirm": "FCT Lawyers",
                },

            },

            "BNS": {
                "RQA1": {
                    "BNSWebServiceurl": "http://iisprillcdqa01.prefirstcdn.com/PartnerLenderService/PartnerLenderServices.svc?singleWsdl",
                    "EndPoint": "http://iisprillcundqa1.prefirstcdn.com",
                    "Resource": "/LawyerIntegrationGateway/v1/transactions/",
                    "LenderName": "FCT Test BNS",
                    "TrustAcc": "BNS: 002-01455-4567890",
                },

                "RQA2": {
                    "BNSWebServiceurl": "https://fctllcintgqa02.firstcdn.com/PartnerLenderService/PartnerLenderServices.svc?singleWsdll",
                    "EndPoint": "https://lawyerintegrationqa2.firstcdn.com",
                    "Resource": "/LawyerIntegrationGateway/v1/Transactions/",
                    "LenderName": "FCT Test BNS",
                    "TrustAcc": "BNS: 002-01455-4567890",
                },

                "PREPROD": {
                    "BNSWebServiceurl": "https://fctllcintgsg01.firstcdn.com/PartnerLenderService/PartnerLenderServices.svc?singleWsdl",
                   "SERVICE_USERNAME": "BNSLLCSTAGUSER",
                    "SERVICE_PASSWORD": "Acce$$0nl!ne",
                    "EndPoint": "https://fctexintgsg10.prefirstcdn.com",
                    "Resource": "/LawyerIntegrationGateway/v1/Transactions/",
                    "LenderName": "FCT Test BNS",
                    "TrustAcc": "BNS: 002-01455-4567890",
                },
                "PROD": {
                    "BNSWebServiceurl": "",
                    "SERVICE_USERNAME": "testuser",
                    "SERVICE_PASSWORD": "P@33word",
                    "EndPoint": "https://fctexintgpr10.firstcdn.com",
                    "Resource": "/LawyerIntegrationGateway/v1/Transactions/",
                    "LenderName": "FCT Test BNS",
                    "TrustAcc": "BNS: 002-01455-4567890",
                },
                "DR": {
                    "BNSWebServiceurl": "https://fctllcintgdr01.firstcdn.com/PartnerLenderService/PartnerLenderServices.svc?singleWsdl",
                    //https://fctllcintgpr01.firstcdn.com/PartnerLenderService/PartnerLenderServices.svc?singleWsdl
                    "SERVICE_USERNAME": "testuser",
                    "SERVICE_PASSWORD": "P@33word",
                    "EndPoint": "https://fctexintgdr10.firstcdn.com",
                    "Resource": "/LawyerIntegrationGateway/v1/Transactions/",
                    "LenderName": "FCT Test BNS",
                    "TrustAcc": "BNS: 002-01455-4567890",
                }
            },

            "TD": {
                "RQA1": {

                    "TrustAcc": "Toronto Dominion bank: 345 - 23456 - 45677889",
                },
                "RQA2": {
                    "TrustAcc": "Toronto Dominion bank: 345 - 23456 - 45677889",
                    "EndPoint": "https://integrationsrqa2.prefirstcdn.com/InboundLenderService/InboundLenderService.svc",
                },
                "PREPROD": {
                    "TrustAcc": "Toronto Dominion bank: 345 - 23456 - 45677889",
                    "EndPoint": "https://integrations.firstcdn.com/InboundLenderService/InboundLenderService.svc",
                },
                "PROD": {
                    "TrustAcc": "Toronto Dominion bank: 345 - 23456 - 45677889",
                    "EndPoint": "",
                },
                "DR": {
                    "TrustAcc": "Toronto Dominion bank: 345 - 23456 - 45677889",
                    "EndPoint": "https://integrationsdr.firstcdn.com/InboundLenderService/InboundLenderService.svc",
                    //https://integrationsprod.firstcdn.com/InboundLenderService/InboundLenderService.svc
                }
            },

            "LLC": {

                "PROD": {
                    "LenderPortalURL": "",
                    "TDUserName": "TTDASingla",
                    "TDPassword": "",
                    "BNSLenderUser": "TBNSASingla",
                    "BNSLenderPassword": ""
                },
                "DR": {
                    "LenderPortalURL": "https://llcdr.firstcdn.com/LenderPortal/Login.aspx",
                    "TDUserName": "TTDASingla",
                    "TDPassword": "",
                    "BNSLenderUser": "TBNSASingla",
                    "BNSLenderPassword": ""
                },

                "PREPROD": {
                    "LenderPortalURL": "https://llcsg.firstcdn.com/LenderPortal/Login.aspx",
                    "TDUserName": "TTDFAutomation",
                    "TDPassword": "",
                    "BNSLenderUser": "TBNSALender3",
                    "BNSLenderPassword": ""
                },

                "RQA2": {
                    "LenderPortalURL": "https://llcdp.firstcdn.com/LenderPortal/Login.aspx",
                    "TDUserName": "TTDFAutomation2",
                    "TDPassword": "",
                    "BNSLenderUser": "TBNSFAutomation",
                    "BNSLenderPassword": ""
                },

                "RQA1": {
                    "LenderPortalURL": "http://iisprillcdqa01.prefirstcdn.com/LenderPortal/Login.aspx",
                    "TDUserName": "TTDFAutomation1",
                    "TDPassword": "",
                    "BNSLenderUser": "TBNSALender1",
                    "BNSLenderPassword": ""
                },
            },

            "LawyerDetails": {

                "PROD": {
                    "UserName": { value: "" },
                    "Password": { value: "" },
                    "Token": { value: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJxdGVzdGxhd3llcjMiLCJpYXQiOiI4LzE2LzIwMTkgMzowMjoxNSBQTSIsImp0aSI6ImRlZjM0OWUzLTM4ZmMtNGIxNC05YmFhLTQxYzRhMjY3ODg0OCIsIm5iZiI6MTU2NTk4MjEzNSwiZXhwIjoyMTk3MTM0MTM1LCJpc3MiOiJodHRwczovL3d3dy5mY3QuY2EvIiwiYXVkIjoiSW50ZWdyYXRpb24gUGFydG5lcnMifQ.Gq8fhXIJdI3EdN1nbkJG5s1-zKf3cShpnK-SaSE0Xrs" },
                    "XFCTAuthorizationVal": { value: '{"authenticatedFctUser": "qtestlawyer3","userContext":{"partnerUserName": "qtestlawyer3","firstName": "QA","lastName": "Test Lawyer 3","businessRole": "LAWYER","fctUserName": ""}}' },
                    "Endpoint": "",
                    "Resource": "/LawyerIntegrationGateway/v1/Transactions/",
                    "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJxdGVzdGxhd3llcjMiLCJpYXQiOiI4LzE2LzIwMTkgMzowMjoxNSBQTSIsImp0aSI6ImRlZjM0OWUzLTM4ZmMtNGIxNC05YmFhLTQxYzRhMjY3ODg0OCIsIm5iZiI6MTU2NTk4MjEzNSwiZXhwIjoyMTk3MTM0MTM1LCJpc3MiOiJodHRwczovL3d3dy5mY3QuY2EvIiwiYXVkIjoiSW50ZWdyYXRpb24gUGFydG5lcnMifQ.Gq8fhXIJdI3EdN1nbkJG5s1-zKf3cShpnK-SaSE0Xrs",
                    "authenticatedFctUser": "qtestlawyer3",
                    "partnerUserName": "qtestlawyer3",
                    "firstName": "QA",
                    "lastName": "Test Lawyer 3",
                    "businessRole": "LAWYER",
                    "fctUserName": "",
                    "LawyerID": "100037340",
                   
                },
                "DR": {
                    "UserName": { value: "qtestlawyer3" },
                    "Password": { value: "llclawyer@sc2" },
                    "Token": { value: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJxdGVzdGxhd3llcjMiLCJpYXQiOiIxMS84LzIwMTkgMzowOTo0MCBQTSIsImp0aSI6Ijg1NmZkM2M1LThmYzEtNDEyOS1hNzc2LTM0ODliYzliNDg3OCIsIm5iZiI6MTU3MzI0Mzc4MCwiZXhwIjoyMjA0Mzk1NzgwLCJpc3MiOiJodHRwczovL3d3dy5mY3QuY2EvIiwiYXVkIjoiSW50ZWdyYXRpb24gUGFydG5lcnMifQ.S6RL00og7e8w4tWsl7Xny5p0bmQFmWg8wB4MA1LfL0c" },
                    "XFCTAuthorizationVal": { value: '{"authenticatedFctUser": "qtestlawyer3","userContext":{"partnerUserName": "qtestlawyer3","firstName": "QA","lastName": "Test Lawyer 3","businessRole": "LAWYER","fctUserName": ""}}' },                
                    "Endpoint": "https://fctexintgdr10.firstcdn.com",
                    "Resource": "/LawyerIntegrationGateway/v1/Transactions/",
                    "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJxdGVzdGxhd3llcjMiLCJpYXQiOiIxMS84LzIwMTkgMzowOTo0MCBQTSIsImp0aSI6Ijg1NmZkM2M1LThmYzEtNDEyOS1hNzc2LTM0ODliYzliNDg3OCIsIm5iZiI6MTU3MzI0Mzc4MCwiZXhwIjoyMjA0Mzk1NzgwLCJpc3MiOiJodHRwczovL3d3dy5mY3QuY2EvIiwiYXVkIjoiSW50ZWdyYXRpb24gUGFydG5lcnMifQ.S6RL00og7e8w4tWsl7Xny5p0bmQFmWg8wB4MA1LfL0c",
                    "authenticatedFctUser": "qtestlawyer3",
                    "partnerUserName": "qtestlawyer3",
                    "firstName": "QA",
                    "lastName": "Test Lawyer 3",
                    "businessRole": "LAWYER",
                    "fctUserName": "",
                    "LawyerID": "100037340", 
                },

                "PREPROD": {
                    "UserName": { value: "adeveloper2" },
                    "Password": { value: "Itmagnet-03" },
                    "Token": { value: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZGV2ZWxvcGVyMiIsImlhdCI6IjIwMTktMDQtMTcgMzoxNDozNCBQTSIsImp0aSI6IjIwNWU5MThiLWIwYjktNDdmYS05OWVkLWJlZmJkOGExOTgwYiIsIm5iZiI6MTU1NTUyODQ3NCwiZXhwIjoyMTg2NjgwNDc0LCJpc3MiOiJodHRwczovL3d3dy5mY3QuY2EvIiwiYXVkIjoiSW50ZWdyYXRpb24gUGFydG5lcnMifQ.EHG0lCPb2l1EPaSfyT-za3Dt8-Hen29urQxSTTt4MK4" },
                    "XFCTAuthorizationVal": { value: '{"partnerToken": "28CA95A5-3E8D-4EEA-A7B4-4029A7D7AA80","authenticatedFctUser": "adeveloper2","userContext":{"partnerUserName": "adeveloper2","firstName": "Automation","lastName": "Developer2","businessRole": "LAWYER","fctUserName": ""}}' },
                    "Endpoint": "https://fctexintgsg10.prefirstcdn.com",
                    "Resource": "/LawyerIntegrationGateway/v1/Transactions/",
                    "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZGV2ZWxvcGVyMiIsImlhdCI6IjIwMTktMDQtMTcgMzoxNDozNCBQTSIsImp0aSI6IjIwNWU5MThiLWIwYjktNDdmYS05OWVkLWJlZmJkOGExOTgwYiIsIm5iZiI6MTU1NTUyODQ3NCwiZXhwIjoyMTg2NjgwNDc0LCJpc3MiOiJodHRwczovL3d3dy5mY3QuY2EvIiwiYXVkIjoiSW50ZWdyYXRpb24gUGFydG5lcnMifQ.EHG0lCPb2l1EPaSfyT-za3Dt8-Hen29urQxSTTt4MK4",
                    "authenticatedFctUser": "adeveloper2",
                    "partnerUserName": "adeveloper2",
                    "firstName": "Automation",
                    "lastName": "Developer2",
                    "businessRole": "LAWYER",
                    "fctUserName": "",
                    "LawyerID": "100003958",
                },

                "RQA2": {
                    "UserName": { value: "adeveloper2" },  
                    "Password": { value: "Itmagnet-03" },  
                    "Token": { value: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZGV2ZWxvcGVyMiIsImlhdCI6IjMvMS8yMDE5IDM6MTY6NDUgUE0iLCJqdGkiOiI5ZTFhODI1Yi1iNmRiLTRhMzgtOTk3Zi0wNWEzYWNkYmU0ODIiLCJuYmYiOjE1NTE0NzE0MDUsImV4cCI6MjE4MjYyMzQwNSwiaXNzIjoiaHR0cHM6Ly93d3cuZmN0LmNhLyIsImF1ZCI6IkludGVncmF0aW9uIFBhcnRuZXJzIn0.OIK9vEoVMuTO_XM8xosvLBZg3bWTkXaNHGv-8qNlbME" },
                    "XFCTAuthorizationVal": { value: '{"partnerToken": "28CA95A5-3E8D-4EEA-A7B4-4029A7D7AA80","authenticatedFctUser": "adeveloper2","userContext":{"partnerUserName": "adeveloper2","firstName": "Automation","lastName": "Developer2","businessRole": "LAWYER","fctUserName": ""}}' },               
                    "Endpoint": "https://lawyerintegrationqa2.firstcdn.com",
                    "Resource": "/LawyerIntegrationGateway/v1/Transactions/",
                    "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZGV2ZWxvcGVyMiIsImlhdCI6IjMvMS8yMDE5IDM6MTY6NDUgUE0iLCJqdGkiOiI5ZTFhODI1Yi1iNmRiLTRhMzgtOTk3Zi0wNWEzYWNkYmU0ODIiLCJuYmYiOjE1NTE0NzE0MDUsImV4cCI6MjE4MjYyMzQwNSwiaXNzIjoiaHR0cHM6Ly93d3cuZmN0LmNhLyIsImF1ZCI6IkludGVncmF0aW9uIFBhcnRuZXJzIn0.OIK9vEoVMuTO_XM8xosvLBZg3bWTkXaNHGv-8qNlbME",
                    "authenticatedFctUser": "adeveloper2",
                    "partnerUserName": "adeveloper2",
                    "firstName": "Automation",
                    "lastName": "Developer2",
                    "businessRole": "LAWYER",
                    "fctUserName": "",
                    "LawyerID": "100002388",
                },

                "RQA1": {
                    "UserName": { value: "llawyer11" },
                    "Password": { value: "llcuser14#$" },
                    "Token": { value: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJsbGF3eWVyMTEiLCJpYXQiOiI5LzYvMjAxOCA4OjE3OjU5IEFNIiwianRpIjoiYTAxMzExZmMtNWJjOC00OWMyLTlkYzUtNTNmZTY3ZmM5NzFmIiwibmJmIjoxNTM2MjM2Mjc5LCJleHAiOjIxNjczODgyNzksImlzcyI6Imh0dHBzOi8vd3d3LmZjdC5jYS8iLCJhdWQiOiJJbnRlZ3JhdGlvbiBQYXJ0bmVycyJ9.sh1duT0EAG550bk7M1mX4kn0TUl2-a_bAIJCk5gCe20" },
                    "XFCTAuthorizationVal": { value: '{"partnerToken":"28CA95A5-3E8D-4EEA-A7B4-4029A7D7AA80","authenticatedFctUser": "adeveloper","userContext":{"partnerUserName": "adeveloper","firstName": "Automation","lastName": "Developer","businessRole": "LAWYER","fctUserName": ""}}' },   
                    "Endpoint": "http://iisprillcundqa1.prefirstcdn.com",
                    "Resource": "/LawyerIntegrationGateway/v1/Transactions/",
                    "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZGV2ZWxvcGVyIiwiaWF0IjoiOC8yMS8yMDE5IDEyOjIwOjM0IFBNIiwianRpIjoiMDI5NTVkMzUtMDVhMy00N2YxLWE5ODctMWViMjRjYTgwZmZkIiwibmJmIjoxNTY2NDA0NDM0LCJleHAiOjIxOTc1NTY0MzQsImlzcyI6Imh0dHBzOi8vd3d3LmZjdC5jYS8iLCJhdWQiOiJJbnRlZ3JhdGlvbiBQYXJ0bmVycyJ9.jQSNEVkqNZ7gSLYBp5PU291ZmOlPMLHjf2X4beNRKIo",
                    "authenticatedFctUser": "adeveloper",
                    "partnerUserName": "adeveloper",
                    "firstName": "Automation",
                    "lastName": "Developer",
                    "businessRole": "LAWYER",
                    "fctUserName": "",
                    "LawyerID": "100003484",
                },
            },

            "LenderDetails": {

                "RQA1": {
                    "Endpoint": "http://iisprillcundqa1.prefirstcdn.com",
                    "Resource": "/LawyerIntegrationGateway/v1/Transactions/",
                    "ResourcePart": "/lenderchanges",
                    "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZGV2ZWxvcGVyIiwiaWF0IjoiOC8yMS8yMDE5IDEyOjIwOjM0IFBNIiwianRpIjoiMDI5NTVkMzUtMDVhMy00N2YxLWE5ODctMWViMjRjYTgwZmZkIiwibmJmIjoxNTY2NDA0NDM0LCJleHAiOjIxOTc1NTY0MzQsImlzcyI6Imh0dHBzOi8vd3d3LmZjdC5jYS8iLCJhdWQiOiJJbnRlZ3JhdGlvbiBQYXJ0bmVycyJ9.jQSNEVkqNZ7gSLYBp5PU291ZmOlPMLHjf2X4beNRKIo",
                    "authenticatedFctUser": "adeveloper",
                    "partnerUserName": "adeveloper",
                    "firstName": "Automation",
                    "lastName": "Developer",
                    "businessRole": "LAWYER",
                    "fctUserName": ""
                },

                "RQA2": {
                    "Endpoint": "https://lawyerintegrationqa2.firstcdn.com",
                    "Resource": "/LawyerIntegrationGateway/v1/Transactions/",
                    "ResourcePart": "/lenderchanges",
                    "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZGV2ZWxvcGVyMiIsImlhdCI6IjMvMS8yMDE5IDM6MTY6NDUgUE0iLCJqdGkiOiI5ZTFhODI1Yi1iNmRiLTRhMzgtOTk3Zi0wNWEzYWNkYmU0ODIiLCJuYmYiOjE1NTE0NzE0MDUsImV4cCI6MjE4MjYyMzQwNSwiaXNzIjoiaHR0cHM6Ly93d3cuZmN0LmNhLyIsImF1ZCI6IkludGVncmF0aW9uIFBhcnRuZXJzIn0.OIK9vEoVMuTO_XM8xosvLBZg3bWTkXaNHGv-8qNlbME",
                    "authenticatedFctUser": "adeveloper2",
                    "partnerUserName": "adeveloper2",
                    "firstName": "Automation",
                    "lastName": "Developer2",
                    "businessRole": "LAWYER",
                    "fctUserName": ""
                },

                "PREPROD": {
                    "Endpoint": "https://fctexintgsg10.prefirstcdn.com",
                    "Resource": "/LawyerIntegrationGateway/v1/Transactions/",
                    "ResourcePart": "/lenderchanges",
                    "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZGV2ZWxvcGVyMiIsImlhdCI6IjIwMTktMDQtMTcgMzoxNDozNCBQTSIsImp0aSI6IjIwNWU5MThiLWIwYjktNDdmYS05OWVkLWJlZmJkOGExOTgwYiIsIm5iZiI6MTU1NTUyODQ3NCwiZXhwIjoyMTg2NjgwNDc0LCJpc3MiOiJodHRwczovL3d3dy5mY3QuY2EvIiwiYXVkIjoiSW50ZWdyYXRpb24gUGFydG5lcnMifQ.EHG0lCPb2l1EPaSfyT-za3Dt8-Hen29urQxSTTt4MK4",
                    "authenticatedFctUser": "adeveloper2",
                    "partnerUserName": "adeveloper2",
                    "firstName": "Automation",
                    "lastName": "Developer2",
                    "businessRole": "LAWYER",
                    "fctUserName": "",
                },

                "PROD": {
                    "Endpoint": "",
                    "Resource": "/LawyerIntegrationGateway/v1/Transactions/",
                    "ResourcePart": "/lenderchanges",
                    "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJxdGVzdGxhd3llcjMiLCJpYXQiOiI4LzE2LzIwMTkgMzowMjoxNSBQTSIsImp0aSI6ImRlZjM0OWUzLTM4ZmMtNGIxNC05YmFhLTQxYzRhMjY3ODg0OCIsIm5iZiI6MTU2NTk4MjEzNSwiZXhwIjoyMTk3MTM0MTM1LCJpc3MiOiJodHRwczovL3d3dy5mY3QuY2EvIiwiYXVkIjoiSW50ZWdyYXRpb24gUGFydG5lcnMifQ.Gq8fhXIJdI3EdN1nbkJG5s1-zKf3cShpnK-SaSE0Xrs",
                    "authenticatedFctUser": "qtestlawyer3",
                    "partnerUserName": "qtestlawyer3",
                    "firstName": "QA",
                    "lastName": "Test Lawyer 3",
                    "businessRole": "LAWYER",
                    "fctUserName": "",
                },
                "DR": {
                    "Endpoint": "https://fctexintgdr10.firstcdn.com",
                    "Resource": "/LawyerIntegrationGateway/v1/Transactions/",
                    "ResourcePart": "/lenderchanges",
                    "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJxdGVzdGxhd3llcjMiLCJpYXQiOiIxMS84LzIwMTkgMzowOTo0MCBQTSIsImp0aSI6Ijg1NmZkM2M1LThmYzEtNDEyOS1hNzc2LTM0ODliYzliNDg3OCIsIm5iZiI6MTU3MzI0Mzc4MCwiZXhwIjoyMjA0Mzk1NzgwLCJpc3MiOiJodHRwczovL3d3dy5mY3QuY2EvIiwiYXVkIjoiSW50ZWdyYXRpb24gUGFydG5lcnMifQ.S6RL00og7e8w4tWsl7Xny5p0bmQFmWg8wB4MA1LfL0c",
                    "authenticatedFctUser": "qtestlawyer3",
                    "partnerUserName": "qtestlawyer3",
                    "firstName": "QA",
                    "lastName": "Test Lawyer 3",
                    "businessRole": "LAWYER",
                    "fctUserName": "",
                }

            },

            "URL_LLCEmulator": {

                "PROD": {
                    "UserName": { value: "" },
                    "Password": { value: "" },
                    "Token": { value: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJxdGVzdGxhd3llcjMiLCJpYXQiOiI4LzE2LzIwMTkgMzowMjoxNSBQTSIsImp0aSI6ImRlZjM0OWUzLTM4ZmMtNGIxNC05YmFhLTQxYzRhMjY3ODg0OCIsIm5iZiI6MTU2NTk4MjEzNSwiZXhwIjoyMTk3MTM0MTM1LCJpc3MiOiJodHRwczovL3d3dy5mY3QuY2EvIiwiYXVkIjoiSW50ZWdyYXRpb24gUGFydG5lcnMifQ.Gq8fhXIJdI3EdN1nbkJG5s1-zKf3cShpnK-SaSE0Xrs" },
                    "XFCTAuthorizationVal": { value: '{"authenticatedFctUser": "qtestlawyer3","userContext":{"partnerUserName": "qtestlawyer3","firstName": "QA","lastName": "Test Lawyer 3","businessRole": "LAWYER","fctUserName": ""}}' },
                    //"TrustAccount": { value: " TD Canada Trust: 546 - 34532 - 457654674353 " },
                    "TrustAccount": { value: " Bank of Montreal: 345 - 43254 - 435435435435 " },
                    "FirstNameLender": { value: "TBNS" },
                    "LastNameLender": { value: "User" },
                    "FirstNameLawyer": { value: "QA" },
                    "LastNameLawyer": { value: "Test Lawyer 3" },
                    "LawyerIDNo": { value: "100037340" },
                    "LenderIdNo": { value: "-02" },
                    "FirstNameUnity": { value: "QA" },
                    "LastNameUnity": { value: "Test Lawyer 3" },
                },
                "DR": {
                    "UserName": { value: "" },
                    "Password": { value: "" },
                    "Token": { value: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJxdGVzdGxhd3llcjMiLCJpYXQiOiIxMS84LzIwMTkgMzowOTo0MCBQTSIsImp0aSI6Ijg1NmZkM2M1LThmYzEtNDEyOS1hNzc2LTM0ODliYzliNDg3OCIsIm5iZiI6MTU3MzI0Mzc4MCwiZXhwIjoyMjA0Mzk1NzgwLCJpc3MiOiJodHRwczovL3d3dy5mY3QuY2EvIiwiYXVkIjoiSW50ZWdyYXRpb24gUGFydG5lcnMifQ.S6RL00og7e8w4tWsl7Xny5p0bmQFmWg8wB4MA1LfL0c" },
                    "XFCTAuthorizationVal": { value: '{"authenticatedFctUser": "qtestlawyer3","userContext":{"partnerUserName": "qtestlawyer3","firstName": "QA","lastName": "Test Lawyer 3","businessRole": "LAWYER","fctUserName": ""}}' },
                    "TrustAccount": { value: " Bank of Montreal: 345 - 43254 - 435435435435 " },
                    "FirstNameLender": { value: "TBNS" },
                    "LastNameLender": { value: "User" },
                    "FirstNameLawyer": { value: "QA" },
                    "LastNameLawyer": { value: "Test Lawyer 3" },
                    "LawyerIDNo": { value: "100037340" },
                    "LenderIdNo": { value: "-02" },
                    "FirstNameUnity": { value: "QA" },
                    "LastNameUnity": { value: "Test Lawyer 3" },
                },

                "PREPROD": {
                    "UserName": { value: "adeveloper2" },
                    "Password": { value: "" },
                    "Token": { value: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZGV2ZWxvcGVyMiIsImlhdCI6IjIwMTktMDQtMTcgMzoxNDozNCBQTSIsImp0aSI6IjIwNWU5MThiLWIwYjktNDdmYS05OWVkLWJlZmJkOGExOTgwYiIsIm5iZiI6MTU1NTUyODQ3NCwiZXhwIjoyMTg2NjgwNDc0LCJpc3MiOiJodHRwczovL3d3dy5mY3QuY2EvIiwiYXVkIjoiSW50ZWdyYXRpb24gUGFydG5lcnMifQ.EHG0lCPb2l1EPaSfyT-za3Dt8-Hen29urQxSTTt4MK4" },
                    "XFCTAuthorizationVal": { value: '{"authenticatedFctUser": "adeveloper2","userContext":{"partnerUserName": "adeveloper2","firstName": "Automation","lastName": "Developer2","businessRole": "LAWYER","fctUserName": ""}}' },
                    "TrustAccount": { value: " TD Canada Trust: 546 - 34532 - 457654674353 " },
                    "FirstNameLender": { value: "TBNS" },
                    "LastNameLender": { value: "User" },
                    "FirstNameLawyer": { value: "Automation" },
                    "LastNameLawyer": { value: "Developer2" },
                    "LawyerIDNo": { value: "100003958" },
                    "LenderIdNo": { value: "-02" },
                    "FirstNameUnity": { value: "Automated" },
                    "LastNameUnity": { value: "Developer2" },
                },

                "RQA2": {
                    "URL": { value: "https://llcportalqa2.firstcdn.com/unity-emulator/#/emulator" },  //Remove if unused
                    "TransID": { value: "19024076346" },   //Remove if unused
                    "UserName": { value: "adeveloper2" },  //Remove if unused
                    "Password": { value: "" },  //Remove if unused
                    "Token": { value: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZGV2ZWxvcGVyMiIsImlhdCI6IjMvMS8yMDE5IDM6MTY6NDUgUE0iLCJqdGkiOiI5ZTFhODI1Yi1iNmRiLTRhMzgtOTk3Zi0wNWEzYWNkYmU0ODIiLCJuYmYiOjE1NTE0NzE0MDUsImV4cCI6MjE4MjYyMzQwNSwiaXNzIjoiaHR0cHM6Ly93d3cuZmN0LmNhLyIsImF1ZCI6IkludGVncmF0aW9uIFBhcnRuZXJzIn0.OIK9vEoVMuTO_XM8xosvLBZg3bWTkXaNHGv-8qNlbME" },
                    "TrustAccount": { value: " TD Canada Trust: 546 - 34532 - 457654674353 " },  //Remove if unused
                    "XFCTAuthorizationVal": { value: '{"partnerToken":"28CA95A5-3E8D-4EEA-A7B4-4029A7D7AA80", authenticatedFctUser": "adeveloper2","userContext":{"partnerUserName": "adeveloper2","firstName": "Automation","lastName": "Developer2","businessRole": "LAWYER","fctUserName": ""}}' },
                    "FirstNameUnity": { value: "Automated" },  //Remove if unused
                    "LastNameUnity": { value: "Script" },  //Remove if unused
                    "FirstNameLender": { value: "TBNS" },
                    "LastNameLender": { value: "User" },
                    "FirstNameLawyer": { value: "Automation" },
                    "LastNameLawyer": { value: "Developer2" },
                    "LawyerIDNo": { value: "100002388" },
                    "LenderIdNo": { value: "-02" },
                },

                "RQA1": {
                    "URL": { value: "http://iisprillcundqa1.prefirstcdn.com/unity-emulator/#/emulator" },
                    "TransID": { value: "19024076346" },
                    "UserName": { value: "llawyer11" },
                    "Password": { value: "" },
                    "Token": { value: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJsbGF3eWVyMTEiLCJpYXQiOiI5LzYvMjAxOCA4OjE3OjU5IEFNIiwianRpIjoiYTAxMzExZmMtNWJjOC00OWMyLTlkYzUtNTNmZTY3ZmM5NzFmIiwibmJmIjoxNTM2MjM2Mjc5LCJleHAiOjIxNjczODgyNzksImlzcyI6Imh0dHBzOi8vd3d3LmZjdC5jYS8iLCJhdWQiOiJJbnRlZ3JhdGlvbiBQYXJ0bmVycyJ9.sh1duT0EAG550bk7M1mX4kn0TUl2-a_bAIJCk5gCe20" },
                    "TrustAccount": { value: " CIBC: 643 - 56436 - 43643643643 " },
                    "XFCTAuthorizationVal": { value: '{"partnerToken":"28CA95A5-3E8D-4EEA-A7B4-4029A7D7AA80","authenticatedFctUser": "adeveloper","userContext":{"partnerUserName": "adeveloper","firstName": "Automation","lastName": "Developer","businessRole": "LAWYER","fctUserName": ""}}' },
                    "FirstNameUnity": { value: "Automated" },
                    "LastNameUnity": { value: "Script" },
                    "LawyerIDNo": { value: "100003484" },
                }
            },

            "OperationsPortal": {

                "PROD": {
                    "URL": { value: "" },
                },
                "DR": {
                    "URL": { value: "" },
                },

                "PREPROD": {
                    "URL": { value: "https://s-testqa@prefirstcdn.com:Password1@llcintsglb.prefirstcdn.com/OperationsPortal" },
                },

                "RQA2": {
                    "URL": { value:"https://s-testqa@prefirstcdn.com:Password1@llcintrqa2.prefirstcdn.com/OperationsPortal" },//"https://s-testqa@prefirstcdn.com:Password1@iisprimmsiqa02.prefirstcdn.com/operationsportal/" },
                },

                "RQA1": {
                    "URL": { value: "https://s-testqa@prefirstcdn.com:Password1@iisprillciqa01.prefirstcdn.com/OperationsPortal/" },
                }
            },

            "Outlook": {

                "URL": { value: "https://webmail.fct.ca/owa/auth/logon.aspx/" },
                "UserName": { value: "LLCTestAutomation01" },
                "Password": { value: "" },
                "DelegateUserName": { value: "LLCTestAutomation02" },
                "DelegatePassword": { value: "" },
            },

            "RedirectURLCredentials": {

                "PROD": {
                    "AuthToken": { value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJxdGVzdGxhd3llcjMiLCJpYXQiOiI4LzE2LzIwMTkgMzowMjoxNSBQTSIsImp0aSI6ImRlZjM0OWUzLTM4ZmMtNGIxNC05YmFhLTQxYzRhMjY3ODg0OCIsIm5iZiI6MTU2NTk4MjEzNSwiZXhwIjoyMTk3MTM0MTM1LCJpc3MiOiJodHRwczovL3d3dy5mY3QuY2EvIiwiYXVkIjoiSW50ZWdyYXRpb24gUGFydG5lcnMifQ.Gq8fhXIJdI3EdN1nbkJG5s1-zKf3cShpnK-SaSE0Xrs' },
                    "endPoint": { value: '' },
                    "Resource": { value: '/LawyerIntegrationGateway/v1/Llcurls/GetRedirectUrl' },
                },
                "DR": {
                    "AuthToken": { value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJxdGVzdGxhd3llcjMiLCJpYXQiOiIxMS84LzIwMTkgMzowOTo0MCBQTSIsImp0aSI6Ijg1NmZkM2M1LThmYzEtNDEyOS1hNzc2LTM0ODliYzliNDg3OCIsIm5iZiI6MTU3MzI0Mzc4MCwiZXhwIjoyMjA0Mzk1NzgwLCJpc3MiOiJodHRwczovL3d3dy5mY3QuY2EvIiwiYXVkIjoiSW50ZWdyYXRpb24gUGFydG5lcnMifQ.S6RL00og7e8w4tWsl7Xny5p0bmQFmWg8wB4MA1LfL0c' },
                    "endPoint": { value: 'https://fctexintgdr10.firstcdn.com' },
                    "Resource": { value: '/LawyerIntegrationGateway/v1/Llcurls/GetRedirectUrl' },
                },


                "PREPROD": {
                    "AuthToken": { value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZGV2ZWxvcGVyMiIsImlhdCI6IjIwMTktMDQtMTcgMzoxNDozNCBQTSIsImp0aSI6IjIwNWU5MThiLWIwYjktNDdmYS05OWVkLWJlZmJkOGExOTgwYiIsIm5iZiI6MTU1NTUyODQ3NCwiZXhwIjoyMTg2NjgwNDc0LCJpc3MiOiJodHRwczovL3d3dy5mY3QuY2EvIiwiYXVkIjoiSW50ZWdyYXRpb24gUGFydG5lcnMifQ.EHG0lCPb2l1EPaSfyT-za3Dt8-Hen29urQxSTTt4MK4' },
                    "endPoint": { value: 'https://fctexintgsg10.prefirstcdn.com' },
                    "Resource": { value: '/LawyerIntegrationGateway/v1/Llcurls/GetRedirectUrl' },
                },

                "RQA2": {
                    "AuthToken": { value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZGV2ZWxvcGVyMiIsImlhdCI6IjQvMy8yMDE5IDI6MDk6MzUgUE0iLCJqdGkiOiIzYTZlYTk4Zi0yNzAxLTRmMTQtYTIxYi0xZTQ4ZTEzYzVjMzYiLCJuYmYiOjE1NTQzMTQ5NzUsImV4cCI6MjE4NTQ2Njk3NSwiaXNzIjoiaHR0cHM6Ly93d3cuZmN0LmNhLyIsImF1ZCI6IkludGVncmF0aW9uIFBhcnRuZXJzIn0.N93heV_xywDSwch6FNeJ_X7Zalu_CAMdjzio5p_5SLg' },
                    "endPoint": { value: 'https://lawyerintegrationqa2.firstcdn.com' },
                    "Resource": { value: '/LawyerIntegrationGateway/v1/Llcurls/GetRedirectUrl' },
                },

                "RQA1": {
                    "AuthToken": { value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZGV2ZWxvcGVyIiwiaWF0IjoiOC8yMS8yMDE5IDEyOjIwOjM0IFBNIiwianRpIjoiMDI5NTVkMzUtMDVhMy00N2YxLWE5ODctMWViMjRjYTgwZmZkIiwibmJmIjoxNTY2NDA0NDM0LCJleHAiOjIxOTc1NTY0MzQsImlzcyI6Imh0dHBzOi8vd3d3LmZjdC5jYS8iLCJhdWQiOiJJbnRlZ3JhdGlvbiBQYXJ0bmVycyJ9.jQSNEVkqNZ7gSLYBp5PU291ZmOlPMLHjf2X4beNRKIo' },
                    "endPoint": { value: 'http://iisprillcundqa1.prefirstcdn.com' },
                    "Resource": { value: '/LawyerIntegrationGateway/v1/Llcurls/GetRedirectUrl' }
                }
            },

        }
    }
}
