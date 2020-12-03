'use strict';
var Runsettings = require('../../../../testData/RunSetting.js');
var CustLib = require('../../../../CustomLibrary/CustomLibrary.js');
var LenderIntegrationBNS = require('../LenderIntegration/LenderIntegrationBNS.js');
var fs = require('fs');
var q = require('q');
var defered = q.defer();
var MrtgagorFirst = null;
var MrtgagorMid = null;
var MrtgagorLast = null;
var LawyerMatterNo = null;
var TransactionStatus = null;
var IDVIdNo1st = null;
var IDVIssuingJurisdiction1st = null;
var IDVExpiryDate1st = null;
var IDVIdentificationType1st = null;
var LenderRequestId = null;
var jsonResponse = null;
var RedirectUrl = null;
var Env = Runsettings.data.Global.ENVIRONMENT.value;
var Token = Runsettings.data.Global.LawyerDetails[Env].Token.value;
var XFCTAuthorizationVal = Runsettings.data.Global.LawyerDetails[Env].XFCTAuthorizationVal.value;
var Counter = 0;
var LawyerIntegrationBNS = function () {

    this.ReturnSendUpdateTransactionJsonBNS = function (fcturn, AssessmentRollNumber, ClosingDate, PropertyProvince, InstrumentNumber, RegistrationDate, RegistryOffice) {
        MrtgagorFirst = LenderIntegrationBNS.ReturnMrtgagorFirstName();
        MrtgagorLast = LenderIntegrationBNS.ReturnMrtgagorLastName();
        MrtgagorMid = LenderIntegrationBNS.ReturnMrtgagorMiddleName();
        LawyerMatterNo = CustLib.getRandomNumber(6);
        IDVIdNo1st = CustLib.getRandomNumber(13);
        IDVIssuingJurisdiction1st = 'Oakville';
        IDVExpiryDate1st = '2022-08-03';
        var IDVListBNS = ['Canadian Passport', 'Canadian Citizenship Card (Issued prior to 2012)', 'Canadian Permanent Resident Card', 'Canadian Forces Card', 'Foreign Passport', 'Canadian Provincial/Territory Driver\'s License', 'DND 404 Driver\'s License', 'Ontario Photo Card', 'American Driver\'s License'];
        IDVIdentificationType1st = CustLib.SelectRandomElementArray(IDVListBNS);
        if (!InstrumentNumber) {
            InstrumentNumber = 'Reg.No.8734683';
        }
        if (!RegistrationDate) {
            RegistrationDate = '2010-08-03';
        }
        if (!RegistryOffice) {
            RegistryOffice = 'Peel';
        }

        var MortgagorStreetNumber = '17';
        var MortgagorStreetAddress1 = 'Lakeshore Blvd. West';
        var MortgagorCity = 'Toronto';
        var MortgagorProvince = 'ON';
        var MortgagorPostalCode = 'L4Z 6C9';
    
        var JSONBody = { "transactionId": "" + fcturn + "", "closingDate": "" + ClosingDate + "T00:00:00", "purchasePrice": 125000, "lawyerMatterNumber": "" + LawyerMatterNo + "", "transactionType": "PURCHASE", "encumbrances": "Stores any information that is on title for the final report i.e. any exceptions/non-financials that the lawyer enters for the final report. Encumbrances are things that can be registered against your home and are not always debts- come in all forms of things from mortgages to judgements for unpaid debts like child support or alimony.  Other examples are easements which is basically a right of way across your property.  All utilities (Bell, Rogers, Hydro) have easements on residential properties because their lines are buried there.  An easement would always go with the property no matter who ownes it or if it has a mortgage on it or not.", "mortgagors": [{ "id": 2238, "mortgagorType": "Person", "companyName": null, "firstName": "" + MrtgagorFirst + "", "middleName": "" + MrtgagorMid + "", "lastName": "" + MrtgagorLast + "", "phone": "9052871000", "businessPhone": "9052871000", "language": "ENGLISH", "priorityIndicator": 2, "ilaRequired": null, "birthDate": null, "occupation": null, "spouseFirstName": null, "spouseMiddleName": null, "spouseLastName": null, "spouseIlaRequired": null, "spouseoccupation": null, "provinceOfIncorporation": null, "address": { "unitNumber": "1875", "streetNumber": "" + MortgagorStreetNumber + "", "streetAddress1": "" + MortgagorStreetAddress1 + "", "streetAddress2": "10th Floor", "city": "" + MortgagorCity + "", "province": "" + MortgagorProvince + "", "postalCode": "" + MortgagorPostalCode + "", "country": "Canada" }, "unsecuredDebts": [{ "creditor": "BOC", "action": "CLSACCNT", "amount": 3388 }], "incorporation": null, "identifications": [{ "identificationType": "" + IDVIdentificationType1st + "", "identificationNumber": "" + IDVIdNo1st + "", "expiryDate": "" + IDVExpiryDate1st + "", "issuingJurisdiction": "" + IDVIssuingJurisdiction1st + "", "issuingCountry": "Canada", "verificationDate": null, "fullName": "Marilyn J. Monroe", "birthdate": null, "address": "17, Lakeshore Blvd. West, Toronto", "nameVerified": null, "birthdateVerified": null }], "signatories": null }, { "id": 2239, "mortgagorType": "Person", "companyName": null, "firstName": "George", "middleName": "Matthew", "lastName": "Donald", "phone": "9052871000", "businessPhone": "9052871000", "language": "ENGLISH", "priorityIndicator": 1, "ilaRequired": true, "birthDate": null, "occupation": null, "spouseFirstName": "Monica", "spouseMiddleName": "Jessy", "spouseLastName": "Ruther", "spouseIlaRequired": false, "spouseoccupation": null, "provinceOfIncorporation": null, "address": { "unitNumber": "85", "streetNumber": "245", "streetAddress1": "Glen Erin Drive", "streetAddress2": "Northwest", "city": "Toronto", "province": "ON", "postalCode": "L4Z 8Y6", "country": "Canada" }, "unsecuredDebts": [{ "creditor": "BOC", "action": "CLSACCNT", "amount": 3388 }], "incorporation": null, "identifications": [{ "identificationType": "Ontario Photo Card", "identificationNumber": "4654734876865", "expiryDate": "2022-08-03", "issuingJurisdiction": "Mississauga", "issuingCountry": "Canada", "verificationDate": null, "fullName": "George Matthew Donald", "birthdate": null, "address": "245, Glen Erin Drive, Toronto", "nameVerified": null, "birthdateVerified": null }], "signatories": null }, { "id": 1024, "mortgagorType": "Person", "companyName": null, "firstName": "Rachel", "middleName": "Bruce", "lastName": "Larry", "phone": "9052871000", "businessPhone": "9052871000", "language": "ENGLISH", "priorityIndicator": 2, "ilaRequired": true, "birthDate": null, "occupation": null, "spouseFirstName": "NewMonica", "spouseMiddleName": "NewJessy", "spouseLastName": "MewRuther", "spouseIlaRequired": false, "spouseoccupation": null, "provinceOfIncorporation": null, "address": { "unitNumber": "851", "streetNumber": "2415", "streetAddress1": "Burnhamthrope Road", "streetAddress2": "Southwest Street2", "city": "Toronto", "province": "ON", "postalCode": "L4Z 8P6", "country": "Canada" }, "unsecuredDebts": [{ "creditor": "BOC", "action": "CLSACCNT", "amount": 3388 }], "incorporation": null, "identifications": [{ "identificationType": "Ontario Photo Card", "identificationNumber": "4654765296865", "expiryDate": "2022-08-03", "issuingJurisdiction": "Scarborough", "issuingCountry": "Canada", "verificationDate": null, "fullName": "Rachel Bruce Larry", "birthdate": null, "address": "2415, Burnhamthrope Road, Toronto", "nameVerified": null, "birthdateVerified": null }], "signatories": null }, { "id": 2241, "mortgagorType": "Business", "companyName": "First Canadian Title", "firstName": "Thomas", "middleName": null, "lastName": "James", "phone": null, "businessPhone": "9052871000", "language": "ENGLISH", "priorityIndicator": 5, "ilaRequired": true, "birthDate": null, "occupation": null, "spouseFirstName": null, "spouseMiddleName": null, "spouseLastName": null, "spouseIlaRequired": null, "spouseoccupation": null, "provinceOfIncorporation": null, "address": { "unitNumber": null, "streetNumber": "2425", "streetAddress1": "Bloor Avenue", "streetAddress2": null, "city": "Toronto", "province": "ON", "postalCode": "L4Z 8P6", "country": "Canada" }, "unsecuredDebts": [{ "creditor": "BOC", "action": "CLSACCNT", "amount": 3388 }], "incorporation": null, "identifications": null, "signatories": [{ "FirstName": "Thomas", "MiddleName": null, "LastName": "James", "Birthdate": "1986-01-01", "Occupation": "IT Consultant", "identifications": [{ "identificationType": "Canadian Passport", "identificationNumber": "4694765876865", "expiryDate": "2022-08-03", "issuingJurisdiction": "Oakville", "issuingCountry": "Canada", "verificationDate": null, "fullName": "Thomas James", "birthdate": null, "address": "2425, Bloor Avenue, Toronto", "nameVerified": null, "birthdateVerified": null }] }] }, { "id": 2242, "mortgagorType": "Business", "companyName": "FCT CORP", "firstName": "Tom", "middleName": null, "lastName": "Jones", "phone": null, "businessPhone": "9052871000", "language": "ENGLISH", "priorityIndicator": 5, "ilaRequired": true, "birthDate": null, "occupation": null, "spouseFirstName": null, "spouseMiddleName": null, "spouseLastName": null, "spouseIlaRequired": null, "spouseoccupation": null, "provinceOfIncorporation": null, "address": { "unitNumber": null, "streetNumber": "2425", "streetAddress1": "Bloor Avenue", "streetAddress2": null, "city": "Toronto", "province": "ON", "postalCode": "L4Z 8F6", "country": "Canada" }, "unsecuredDebts": [{ "creditor": "BOC", "action": "CLSACCNT", "amount": 3388 }], "incorporation": null, "identifications": null, "signatories": [{ "FirstName": "Tom", "MiddleName": null, "LastName": "Jones", "Birthdate": "1980-01-01", "Occupation": "IT Supervisor", "identifications": [{ "identificationType": "Canadian Passport", "identificationNumber": "4664765876865", "expiryDate": "2022-08-03", "issuingJurisdiction": "Toronto", "issuingCountry": "Canada", "verificationDate": null, "fullName": "Tom Jones", "birthdate": null, "address": "2425, Bloor Avenue, Toronto", "nameVerified": null, "birthdateVerified": null }] }] }], "guarantors": [{ "id": 1024, "guarantorType": "Person", "companyName": null, "firstName": "Terry", "middleName": "Tek", "lastName": "Lau", "phone": "9052871000", "businessPhone": "9052871000", "ilaRequired": true, "birthDate": null, "occupation": null, "address": { "unitNumber": null, "streetNumber": "28", "streetAddress1": "Canada Street", "streetAddress2": "Second Floor", "city": "Toronto", "province": "ON", "postalCode": "L4Z 8Y6", "country": "Canada" }, "identifications": [{ "identificationType": "Canadian Permanent Resident Card", "identificationNumber": "4999765296865", "expiryDate": "2022-08-03", "issuingJurisdiction": "Toronto", "issuingCountry": "Canada", "verificationDate": null, "fullName": "Terry Tek Lau", "birthdate": null, "address": "28, Canada Street, Toronto", "nameVerified": null, "birthdateVerified": null }], "signatories": null }], "properties": [{ "id": 2238, "legalDescription": "Lot 3423423, Plan 2343DD: Heart of the City close to Mall/Sub/Bus/TTC etc. All aminities included", "condoLevel": null, "condoUnitNumber": null, "occupancyType": "OWNER OCCUPIED", "numberOfUnits": null, "condoPlanNumber": null, "mortgagePriority": "FIRST", "lenderCollectsPropertyTaxes": false, "estateType": "OTHER", "otherEstateTypeDescription": "Testing New Field", "isCondominium": null, "condoCorporationNumber": null, "condoDeclarationRegisterationNumber": null, "condoDeclarationRegistrationDate": null, "condoPageNumberOfDeclaration": null, "condoBookNumberOfDeclaration": null, "condoDeclarationAcceptedDate": null, "condoPlanRegistrationDate": null, "condoDeclarationDate": null, "newHomeWarranty": null, "municipality": "City of Toronto", "annualTaxAmount": null, "instrumentNumber": "" + InstrumentNumber + "", "registrationDate": "" + RegistrationDate + "", "registryOffice": "" + RegistryOffice + "", "lroNumber": null, "newConstruction": null, "address": { "unitNumber": null, "streetNumber": "1233", "streetAddress1": "Victoria Street", "streetAddress2": null, "city": "Toronto", "province": "" + PropertyProvince + "", "postalCode": "L4Z 2Y5", "country": "Canada" }, "propertyIdentificationNumbers": ["026-109-221", "026-101-998"], "existingMortgages": [{ "amount": 700, "mortgagee": "Testing this new schema change", "action": "POSTPONED" }], "assessmentRollNumbers": AssessmentRollNumber, "fireInsurancePolicy": { "InsuranceCompanyName": "Fire Insurance Co Inc", "Phone": "647 852 3698", "Fax": "852 369 8412", "PolicyNumber": "5896363", "PolicyActiveDate": "2019-10-10", "ExpiryDate": "2022-10-10", "InsuranceAmount": 2000.25, "Broker": "Broker Name", "AgentFirstName": "Agent First Name", "AgentLastName": "Agent Last Name", "BrokerPhone": "705 258 7412", "UnitNumber": "1102", "StreetNumber": "8599", "Address": "Norwood Drive", "Address2": "Lakeshore Rd", "Country": "Canada", "City": "Toronto", "Province": "ON", "PostalCode": "L8W0B9" }, "registeredOwners": null }], "titleInsurancePolicies": [{ "insuranceCompany": "Insurance Co", "policyType": "3456453", "policyNumber": "3984759384", "policyDate": "2029-10-10", "nameOfInsured": "Insurance Capital", "insuredAmount": "4000" }], "attorneys": [] };
        return JSONBody;
    }

    this.ReturnSendUpdateTransactionJsonBNSDynamic = function (fcturn, AssessmentRollNumber, ClosingDate, InstrumentNumber, RegistrationDate, RegistryOffice, PropertyProvince) {
        MrtgagorFirst = LenderIntegrationBNS.ReturnMrtgagorFirstName();
        MrtgagorLast = LenderIntegrationBNS.ReturnMrtgagorLastName();
        MrtgagorMid = LenderIntegrationBNS.ReturnMrtgagorMiddleName();
        LawyerMatterNo = CustLib.getRandomNumber(6);
        IDVIdNo1st = CustLib.getRandomNumber(13);
        IDVIssuingJurisdiction1st = 'Oakville';
        IDVExpiryDate1st = '2022-08-03';
        var IDVListBNS = ['Canadian Passport', 'Canadian Citizenship Card (Issued prior to 2012)', 'Canadian Permanent Resident Card', 'Canadian Forces Card', 'Foreign Passport', 'Canadian Provincial/Territory Driver\'s License', 'DND 404 Driver\'s License', 'Ontario Photo Card', 'American Driver\'s License'];
        IDVIdentificationType1st = CustLib.SelectRandomElementArray(IDVListBNS);
        if (!InstrumentNumber) {
            InstrumentNumber = 'Reg.No.8734683';
        }
        if (!RegistrationDate) {
            RegistrationDate = '2010-08-03';
        }
        if (!RegistryOffice) {
            RegistryOffice = 'Peel';
        }

        var MortgagorStreetNumber = '17';
        var MortgagorStreetAddress1 = 'Lakeshore Blvd. West';
        var MortgagorCity = 'Toronto';
        var MortgagorProvince = 'ON';
        var MortgagorPostalCode = 'L4Z 6C9';

        var JSONBody = { "transactionId": "" + fcturn + "", "closingDate": "" + ClosingDate + "T00:00:00", "purchasePrice": 125000, "lawyerMatterNumber": "" + LawyerMatterNo + "", "transactionType": "PURCHASE", "encumbrances": "Stores any information that is on title for the final report i.e. any exceptions/non-financials that the lawyer enters for the final report. Encumbrances are things that can be registered against your home and are not always debts- come in all forms of things from mortgages to judgements for unpaid debts like child support or alimony.  Other examples are easements which is basically a right of way across your property.  All utilities (Bell, Rogers, Hydro) have easements on residential properties because their lines are buried there.  An easement would always go with the property no matter who ownes it or if it has a mortgage on it or not.", "mortgagors": [{ "id": 2238, "mortgagorType": "Person", "companyName": null, "firstName": "" + MrtgagorFirst + "", "middleName": "" + MrtgagorMid + "", "lastName": "" + MrtgagorLast + "", "phone": "9052871000", "businessPhone": "9052871000", "language": "ENGLISH", "priorityIndicator": 2, "ilaRequired": null, "birthDate": null, "occupation": null, "spouseFirstName": null, "spouseMiddleName": null, "spouseLastName": null, "spouseIlaRequired": null, "spouseoccupation": null, "provinceOfIncorporation": null, "address": { "unitNumber": "1875", "streetNumber": "" + MortgagorStreetNumber + "", "streetAddress1": "" + MortgagorStreetAddress1 + "", "streetAddress2": "10th Floor", "city": "" + MortgagorCity + "", "province": "" + MortgagorProvince + "", "postalCode": "" + MortgagorPostalCode + "", "country": "Canada" }, "unsecuredDebts": [{ "creditor": "BOC", "action": "CLSACCNT", "amount": 3388 }], "incorporation": null, "identifications": [{ "identificationType": "" + IDVIdentificationType1st + "", "identificationNumber": "" + IDVIdNo1st + "", "expiryDate": "" + IDVExpiryDate1st + "", "issuingJurisdiction": "" + IDVIssuingJurisdiction1st + "", "issuingCountry": "Canada", "verificationDate": null, "fullName": "Marilyn J. Monroe", "birthdate": null, "address": "17, Lakeshore Blvd. West, Toronto", "nameVerified": null, "birthdateVerified": null }], "signatories": null }, { "id": 2239, "mortgagorType": "Person", "companyName": null, "firstName": "George", "middleName": "Matthew", "lastName": "Donald", "phone": "9052871000", "businessPhone": "9052871000", "language": "ENGLISH", "priorityIndicator": 1, "ilaRequired": true, "birthDate": null, "occupation": null, "spouseFirstName": "Monica", "spouseMiddleName": "Jessy", "spouseLastName": "Ruther", "spouseIlaRequired": false, "spouseoccupation": null, "provinceOfIncorporation": null, "address": { "unitNumber": "85", "streetNumber": "245", "streetAddress1": "Glen Erin Drive", "streetAddress2": "Northwest", "city": "Toronto", "province": "ON", "postalCode": "L4Z 8Y6", "country": "Canada" }, "unsecuredDebts": [{ "creditor": "BOC", "action": "CLSACCNT", "amount": 3388 }], "incorporation": null, "identifications": [{ "identificationType": "Ontario Photo Card", "identificationNumber": "4654734876865", "expiryDate": "2022-08-03", "issuingJurisdiction": "Mississauga", "issuingCountry": "Canada", "verificationDate": null, "fullName": "George Matthew Donald", "birthdate": null, "address": "245, Glen Erin Drive, Toronto", "nameVerified": null, "birthdateVerified": null }], "signatories": null }, { "id": 1024, "mortgagorType": "Person", "companyName": null, "firstName": "Rachel", "middleName": "Bruce", "lastName": "Larry", "phone": "9052871000", "businessPhone": "9052871000", "language": "ENGLISH", "priorityIndicator": 2, "ilaRequired": true, "birthDate": null, "occupation": null, "spouseFirstName": "NewMonica", "spouseMiddleName": "NewJessy", "spouseLastName": "MewRuther", "spouseIlaRequired": false, "spouseoccupation": null, "provinceOfIncorporation": null, "address": { "unitNumber": "851", "streetNumber": "2415", "streetAddress1": "Burnhamthrope Road", "streetAddress2": "Southwest Street2", "city": "Toronto", "province": "ON", "postalCode": "L4Z 8P6", "country": "Canada" }, "unsecuredDebts": [{ "creditor": "BOC", "action": "CLSACCNT", "amount": 3388 }], "incorporation": null, "identifications": [{ "identificationType": "Ontario Photo Card", "identificationNumber": "4654765296865", "expiryDate": "2022-08-03", "issuingJurisdiction": "Scarborough", "issuingCountry": "Canada", "verificationDate": null, "fullName": "Rachel Bruce Larry", "birthdate": null, "address": "2415, Burnhamthrope Road, Toronto", "nameVerified": null, "birthdateVerified": null }], "signatories": null }, { "id": 2241, "mortgagorType": "Business", "companyName": "First Canadian Title", "firstName": "Thomas", "middleName": null, "lastName": "James", "phone": null, "businessPhone": "9052871000", "language": "ENGLISH", "priorityIndicator": 5, "ilaRequired": true, "birthDate": null, "occupation": null, "spouseFirstName": null, "spouseMiddleName": null, "spouseLastName": null, "spouseIlaRequired": null, "spouseoccupation": null, "provinceOfIncorporation": null, "address": { "unitNumber": null, "streetNumber": "2425", "streetAddress1": "Bloor Avenue", "streetAddress2": null, "city": "Toronto", "province": "ON", "postalCode": "L4Z 8P6", "country": "Canada" }, "unsecuredDebts": [{ "creditor": "BOC", "action": "CLSACCNT", "amount": 3388 }], "incorporation": null, "identifications": null, "signatories": [{ "FirstName": "Thomas", "MiddleName": null, "LastName": "James", "Birthdate": "1986-01-01", "Occupation": "IT Consultant", "identifications": [{ "identificationType": "Canadian Passport", "identificationNumber": "4694765876865", "expiryDate": "2022-08-03", "issuingJurisdiction": "Oakville", "issuingCountry": "Canada", "verificationDate": null, "fullName": "Thomas James", "birthdate": null, "address": "2425, Bloor Avenue, Toronto", "nameVerified": null, "birthdateVerified": null }] }] }, { "id": 2242, "mortgagorType": "Business", "companyName": "FCT CORP", "firstName": "Tom", "middleName": null, "lastName": "Jones", "phone": null, "businessPhone": "9052871000", "language": "ENGLISH", "priorityIndicator": 5, "ilaRequired": true, "birthDate": null, "occupation": null, "spouseFirstName": null, "spouseMiddleName": null, "spouseLastName": null, "spouseIlaRequired": null, "spouseoccupation": null, "provinceOfIncorporation": null, "address": { "unitNumber": null, "streetNumber": "2425", "streetAddress1": "Bloor Avenue", "streetAddress2": null, "city": "Toronto", "province": "ON", "postalCode": "L4Z 8F6", "country": "Canada" }, "unsecuredDebts": [{ "creditor": "BOC", "action": "CLSACCNT", "amount": 3388 }], "incorporation": null, "identifications": null, "signatories": [{ "FirstName": "Tom", "MiddleName": null, "LastName": "Jones", "Birthdate": "1980-01-01", "Occupation": "IT Supervisor", "identifications": [{ "identificationType": "Canadian Passport", "identificationNumber": "4664765876865", "expiryDate": "2022-08-03", "issuingJurisdiction": "Toronto", "issuingCountry": "Canada", "verificationDate": null, "fullName": "Tom Jones", "birthdate": null, "address": "2425, Bloor Avenue, Toronto", "nameVerified": null, "birthdateVerified": null }] }] }], "guarantors": [{ "id": 1024, "guarantorType": "Person", "companyName": null, "firstName": "Terry", "middleName": "Tek", "lastName": "Lau", "phone": "9052871000", "businessPhone": "9052871000", "ilaRequired": true, "birthDate": null, "occupation": null, "address": { "unitNumber": null, "streetNumber": "28", "streetAddress1": "Canada Street", "streetAddress2": "Second Floor", "city": "Toronto", "province": "ON", "postalCode": "L4Z 8Y6", "country": "Canada" }, "identifications": [{ "identificationType": "Canadian Permanent Resident Card", "identificationNumber": "4999765296865", "expiryDate": "2022-08-03", "issuingJurisdiction": "Toronto", "issuingCountry": "Canada", "verificationDate": null, "fullName": "Terry Tek Lau", "birthdate": null, "address": "28, Canada Street, Toronto", "nameVerified": null, "birthdateVerified": null }], "signatories": null }], "properties": [{ "id": 2238, "legalDescription": "Lot 3423423, Plan 2343DD: Heart of the City close to Mall/Sub/Bus/TTC etc. All aminities included", "condoLevel": null, "condoUnitNumber": null, "occupancyType": "OWNER OCCUPIED", "numberOfUnits": null, "condoPlanNumber": null, "mortgagePriority": "FIRST", "lenderCollectsPropertyTaxes": false, "estateType": "OTHER", "otherEstateTypeDescription": "Testing New Field", "isCondominium": null, "condoCorporationNumber": null, "condoDeclarationRegisterationNumber": null, "condoDeclarationRegistrationDate": null, "condoPageNumberOfDeclaration": null, "condoBookNumberOfDeclaration": null, "condoDeclarationAcceptedDate": null, "condoPlanRegistrationDate": null, "condoDeclarationDate": null, "newHomeWarranty": null, "municipality": "City of Toronto", "annualTaxAmount": null, "instrumentNumber": "" + InstrumentNumber + "", "registrationDate": "" + RegistrationDate + "", "registryOffice": "" + RegistryOffice + "", "lroNumber": null, "newConstruction": null, "address": { "unitNumber": null, "streetNumber": "1233", "streetAddress1": "Victoria Street", "streetAddress2": null, "city": "Toronto", "province": "" + PropertyProvince + "", "postalCode": "L4Z 2Y5", "country": "Canada" }, "propertyIdentificationNumbers": ["026-109-221", "026-101-998"], "existingMortgages": [{ "amount": 700, "mortgagee": "Testing this new schema change", "action": "POSTPONED" }], "assessmentRollNumbers": AssessmentRollNumber, "fireInsurancePolicy": { "InsuranceCompanyName": "Fire Insurance Co Inc", "Phone": "647 852 3698", "Fax": "852 369 8412", "PolicyNumber": "5896363", "PolicyActiveDate": "2019-10-10", "ExpiryDate": "2022-10-10", "InsuranceAmount": 2000.25, "Broker": "Broker Name", "AgentFirstName": "Agent First Name", "AgentLastName": "Agent Last Name", "BrokerPhone": "705 258 7412", "UnitNumber": "1102", "StreetNumber": "8599", "Address": "Norwood Drive", "Address2": "Lakeshore Rd", "Country": "Canada", "City": "Toronto", "Province": "ON", "PostalCode": "L8W0B9" }, "registeredOwners": null }], "titleInsurancePolicies": [{ "insuranceCompany": "Insurance Co", "policyType": "3456453", "policyNumber": "3984759384", "policyDate": "2029-10-10", "nameOfInsured": "Insurance Capital", "insuredAmount": "4000" }], "attorneys": [] };

        return JSONBody;
    }

    this.ReturnIDVIdentificationType1st = function () {
        return IDVIdentificationType1st;
    }

    this.ReturnIDVExpiryDate1st = function () {
        return IDVExpiryDate1st;
    }

    this.ReturnIDVIssuingJurisdiction1st = function () {
        return IDVIssuingJurisdiction1st;
    }

    this.ReturnIDVIdNo1st = function () {
        return IDVIdNo1st;
    }

    this.ReturnLawyerMatterNo = function () {
        return LawyerMatterNo;
    }

    this.SendUpdateTransactionData = function (JSONBody)  {
        Counter = 0;
        SendUpdateTransactionDataTillSuccess(JSONBody);
    }

    var SendUpdateTransactionDataTillSuccess = function (JSONBody) {
        var SendUpdateTransactionEndPoint = Runsettings.data.Global.BNS[Env].EndPoint;
        var SendUpdateTransactionResourceURL = Runsettings.data.Global.BNS[Env].Resource;
        var JSONBody1 = JSON.stringify(JSONBody);
        var options = function () {

            var OPtBody = {
                "headers": {
                    "content-type": "application/json",
                    "Authorization": '' + Token + '',
                    "XFCTAuthorization": '' + XFCTAuthorizationVal + '',

                },
                "url": SendUpdateTransactionEndPoint + SendUpdateTransactionResourceURL,
                "body": JSONBody1,
                "rejectUnauthorized": false
            }
            return OPtBody
        }
        var callback = function (error, response, body) {  
            if (error || response.statusCode != 200) {
                defered.reject(error);
                Counter++;
                if (Counter < 5) { 
                   SendUpdateTransactionDataTillSuccess(JSONBody);
                }
                else {
                    expect(response.statusCode).toBe(200, "SendTransactionData service unsuccessfull.");
                }
            }
            else {
                defered.resolve(response);
                defered.fulfill();
                browser.sleep(5000);
            }
        }
        var Request = require("request");
        Request.post(options(), callback);
        return defered.promise;
    }


    this.GetTransactionData = function (fcturn) {
        var TransactionStatusEndPoint = Runsettings.data.Global.BNS[Env].EndPoint;
        var ResourceURL = Runsettings.data.Global.BNS[Env].Resource + fcturn;
        var JSONBody = "";
        var JSONBody1 = JSON.stringify(JSONBody);

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
            expect(response.statusCode).toBe(200, "GetTransactionData service unsuccessfull.");
            if (error || response.statusCode != 200) {
                defered.reject(error);
            }
            else {
                defered.resolve(response);
                defered.fulfill();
                if (response.statusCode == 200) {
                    jsonResponse = JSON.parse(response.body);
                    MrtgagorFirst = jsonResponse.mortgagors[0].firstName;
                    MrtgagorMid = jsonResponse.mortgagors[0].middleName;
                    MrtgagorLast = jsonResponse.mortgagors[0].lastName;
                    StreetNumber = jsonResponse.properties[0].address.streetNumber;
                    StreetAddress1 = jsonResponse.properties[0].address.streetAddress1;
                    City = jsonResponse.properties[0].address.city;
                    Province = jsonResponse.properties[0].address.province;
                    PostalCode = jsonResponse.properties[0].address.postalCode;
                }
                browser.sleep(5000);
            }

        }
        var Request = require("request");
        Request.get(options(), callback);

        return defered.promise;

    }

    this.GetTransactionStatus = function (fcturn) {

        var TransactionStatusEndPoint = Runsettings.data.Global.BNS[Env].EndPoint;
        var ResourceURL = Runsettings.data.Global.BNS[Env].Resource + fcturn + '/status';
        var JSONBody = "";
        var JSONBody1 = JSON.stringify(JSONBody)
        fs.writeFile('../Services/MMS/ResponseXMLs/GetTransactionStatusRequest.json', JSONBody1, function (error) {
            if (error) {
                console.error("Request write error ");
            } else {
                console.log("Request saved " + 'GetTransactionStatusRequest.json');
            }
        });

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

                console.log('Get transaction status deal was unsuccessful!!! ');
                console.log(error);

                fs.writeFile('../Services/MMS/ResponseXMLs/GetTransactionStatusResponse.json', "Response Status: " + response.statusCode, function (error) {
                    if (error) {
                        console.error("Response write error");
                    } else {
                        console.log("Unsuccessful Response Status saved " + 'GetTransactionStatusResponse.json');
                    }
                });

            }
            else {

                defered.resolve(response);
                defered.fulfill();
                if (response.statusCode == 200) {
                    console.log("Get transaction status deal was successfull ");
                    var jsonResponse = JSON.parse(response.body);
                    TransactionStatus = jsonResponse.status;

                    fs.writeFile('../Services/MMS/ResponseXMLs/GetTransactionStatusResponse.json', "Response Status: " + response.statusCode, function (error) {
                        if (error) {
                            console.error("write error");
                        } else {
                            console.log("Successful Response Status saved " + 'GetTransactionStatusResponse.json');
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
            expect(response.statusCode).toBe(200, "GetLenderChanges service response.");
            if (error || response.statusCode != 200) {
                defered.reject(error);
            }
            else {
                defered.resolve(response);
                defered.fulfill();
                if (response.statusCode == 200) {
                    jsonResponse = JSON.parse(response.body);
                    LenderRequestId = jsonResponse.lenderRequestId;
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


    this.SendLenderChangesAcceptReject = function (LenderChangesArray, Status, FCTURN) {
        Counter = 0;
        SendLenderChangesAcceptRejectTillSuccess(LenderChangesArray, Status, FCTURN);
    }

    //For LenderChangesArray, send lenderChanges from GetLenderChanges. Send only the lenderChanges array positions you want to change status for in an array. First one is 0 and onwards
    var SendLenderChangesAcceptRejectTillSuccess  = function (LenderChangesArray, Status, FCTURN) {
        var SendLenderChangesEndPoint = Runsettings.data.Global.BNS[Env].EndPoint;
        var ResourceURL = Runsettings.data.Global.BNS[Env].Resource + FCTURN + '/lenderchanges';

        var JSONBody = ReturnSendLenderChangesAcceptRejectJson(LenderChangesArray, Status, FCTURN);
        var JSONBody1 = JSON.stringify(JSONBody);

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
                Counter++;
                if (Counter < 5) { 
                    SendLenderChangesAcceptRejectTillSuccess(LenderChangesArray, Status, FCTURN);
                }
                else {
                    expect(response.statusCode).toBe(200, "SendLenderChangesAcceptReject service response.");
                }
            }
            else {

                defered.resolve(response);
                defered.fulfill();
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
        var AuthToken = Runsettings.data.Global.RedirectURLCredentials[Env].AuthToken.value

        var OPtBody = {
            "headers": {

                "Authorization": AuthToken,
                "XFCTAuthorization": '' + XFCTAuthorizationVal + '',
                "content-type": "application/json",

            },
            'method': 'GET',
            "url": RedirectURL + ResourceURL + "?context=" + context + "&fcturn=" + dealID + "&language=ENGLISH",
            "rejectUnauthorized": false

        }

        var Request = require("request");

        Request(OPtBody, function (error, response, body) {

            if (error || response.statusCode != 200) {
                console.log('GetRedirectUrl request was unsuccessful!!! ');
                RedirectUrl = 'Failed';
            }

            else {
                if (response.statusCode == 200) {
                    RedirectUrl = JSON.parse(response.body).url;
                }
            }
        })

        return RedirectUrl;
    }

    this.ReturnSendUpdateTransactionJsonBNSDynamicModifyTitleNumber = function (fcturn, AssessmentRollNumber, ClosingDate, InstrumentNumber, RegistrationDate, RegistryOffice, PropertyProvince) {

        LawyerMatterNo = CustLib.getRandomNumber(6);
        IDVIdNo1st = CustLib.getRandomNumber(13);
        IDVIssuingJurisdiction1st = 'Oakville';
        IDVExpiryDate1st = '2022-08-03';
        var IDVListBNS = ['Canadian Passport', 'Canadian Citizenship Card (Issued prior to 2012)', 'Canadian Permanent Resident Card', 'Canadian Forces Card', 'Foreign Passport', 'Canadian Provincial/Territory Driver\'s License', 'DND 404 Driver\'s License', 'Ontario Photo Card', 'American Driver\'s License'];
        IDVIdentificationType1st = CustLib.SelectRandomElementArray(IDVListBNS);
        if (!InstrumentNumber) {
            InstrumentNumber = 'Reg.No.8734683';
        }
        if (!RegistrationDate) {
            RegistrationDate = '2010-08-03';
        }
        if (!RegistryOffice) {
            RegistryOffice = 'Peel';
        }

        var MortgagorStreetNumber = '17';
        var MortgagorStreetAddress1 = 'Lakeshore Blvd. West';
        var MortgagorCity = 'Toronto';
        var MortgagorProvince = 'ON';
        var MortgagorPostalCode = 'L4Z 6C9';

        var JSONBody = { "transactionId": "" + fcturn + "", "closingDate": "" + ClosingDate + "T00:00:00", "purchasePrice": 125000, "lawyerMatterNumber": "" + LawyerMatterNo + "", "transactionType": "PURCHASE", "encumbrances": "Stores any information that is on title for the final report i.e. any exceptions/non-financials that the lawyer enters for the final report. Encumbrances are things that can be registered against your home and are not always debts- come in all forms of things from mortgages to judgements for unpaid debts like child support or alimony.  Other examples are easements which is basically a right of way across your property.  All utilities (Bell, Rogers, Hydro) have easements on residential properties because their lines are buried there.  An easement would always go with the property no matter who ownes it or if it has a mortgage on it or not.", "mortgagors": [{ "id": 2238, "mortgagorType": "Person", "companyName": null, "firstName": "" + MrtgagorFirst + "", "middleName": "" + MrtgagorMid + "", "lastName": "" + MrtgagorLast + "", "phone": "9052871000", "businessPhone": "9052871000", "language": "ENGLISH", "priorityIndicator": 2, "ilaRequired": null, "birthDate": null, "occupation": null, "spouseFirstName": null, "spouseMiddleName": null, "spouseLastName": null, "spouseIlaRequired": null, "spouseoccupation": null, "provinceOfIncorporation": null, "address": { "unitNumber": "1875", "streetNumber": "" + MortgagorStreetNumber + "", "streetAddress1": "" + MortgagorStreetAddress1 + "", "streetAddress2": "10th Floor", "city": "" + MortgagorCity + "", "province": "" + MortgagorProvince + "", "postalCode": "" + MortgagorPostalCode + "", "country": "Canada" }, "unsecuredDebts": [{ "creditor": "BOC", "action": "CLSACCNT", "amount": 3388 }], "incorporation": null, "identifications": [{ "identificationType": "" + IDVIdentificationType1st + "", "identificationNumber": "" + IDVIdNo1st + "", "expiryDate": "" + IDVExpiryDate1st + "", "issuingJurisdiction": "" + IDVIssuingJurisdiction1st + "", "issuingCountry": "Canada", "verificationDate": null, "fullName": "Marilyn J. Monroe", "birthdate": null, "address": "17, Lakeshore Blvd. West, Toronto", "nameVerified": null, "birthdateVerified": null }], "signatories": null }, { "id": 2239, "mortgagorType": "Person", "companyName": null, "firstName": "George", "middleName": "Matthew", "lastName": "Donald", "phone": "9052871000", "businessPhone": "9052871000", "language": "ENGLISH", "priorityIndicator": 1, "ilaRequired": true, "birthDate": null, "occupation": null, "spouseFirstName": "Monica", "spouseMiddleName": "Jessy", "spouseLastName": "Ruther", "spouseIlaRequired": false, "spouseoccupation": null, "provinceOfIncorporation": null, "address": { "unitNumber": "85", "streetNumber": "245", "streetAddress1": "Glen Erin Drive", "streetAddress2": "Northwest", "city": "Toronto", "province": "ON", "postalCode": "L4Z 8Y6", "country": "Canada" }, "unsecuredDebts": [{ "creditor": "BOC", "action": "CLSACCNT", "amount": 3388 }], "incorporation": null, "identifications": [{ "identificationType": "Ontario Photo Card", "identificationNumber": "4654734876865", "expiryDate": "2022-08-03", "issuingJurisdiction": "Mississauga", "issuingCountry": "Canada", "verificationDate": null, "fullName": "George Matthew Donald", "birthdate": null, "address": "245, Glen Erin Drive, Toronto", "nameVerified": null, "birthdateVerified": null }], "signatories": null }, { "id": 1024, "mortgagorType": "Person", "companyName": null, "firstName": "Rachel", "middleName": "Bruce", "lastName": "Larry", "phone": "9052871000", "businessPhone": "9052871000", "language": "ENGLISH", "priorityIndicator": 2, "ilaRequired": true, "birthDate": null, "occupation": null, "spouseFirstName": "NewMonica", "spouseMiddleName": "NewJessy", "spouseLastName": "MewRuther", "spouseIlaRequired": false, "spouseoccupation": null, "provinceOfIncorporation": null, "address": { "unitNumber": "851", "streetNumber": "2415", "streetAddress1": "Burnhamthrope Road", "streetAddress2": "Southwest Street2", "city": "Toronto", "province": "ON", "postalCode": "L4Z 8P6", "country": "Canada" }, "unsecuredDebts": [{ "creditor": "BOC", "action": "CLSACCNT", "amount": 3388 }], "incorporation": null, "identifications": [{ "identificationType": "Ontario Photo Card", "identificationNumber": "4654765296865", "expiryDate": "2022-08-03", "issuingJurisdiction": "Scarborough", "issuingCountry": "Canada", "verificationDate": null, "fullName": "Rachel Bruce Larry", "birthdate": null, "address": "2415, Burnhamthrope Road, Toronto", "nameVerified": null, "birthdateVerified": null }], "signatories": null }, { "id": 2241, "mortgagorType": "Business", "companyName": "First Canadian Title", "firstName": "Thomas", "middleName": null, "lastName": "James", "phone": null, "businessPhone": "9052871000", "language": "ENGLISH", "priorityIndicator": 5, "ilaRequired": true, "birthDate": null, "occupation": null, "spouseFirstName": null, "spouseMiddleName": null, "spouseLastName": null, "spouseIlaRequired": null, "spouseoccupation": null, "provinceOfIncorporation": null, "address": { "unitNumber": null, "streetNumber": "2425", "streetAddress1": "Bloor Avenue", "streetAddress2": null, "city": "Toronto", "province": "ON", "postalCode": "L4Z 8P6", "country": "Canada" }, "unsecuredDebts": [{ "creditor": "BOC", "action": "CLSACCNT", "amount": 3388 }], "incorporation": null, "identifications": null, "signatories": [{ "FirstName": "Thomas", "MiddleName": null, "LastName": "James", "Birthdate": "1986-01-01", "Occupation": "IT Consultant", "identifications": [{ "identificationType": "Canadian Passport", "identificationNumber": "4694765876865", "expiryDate": "2022-08-03", "issuingJurisdiction": "Oakville", "issuingCountry": "Canada", "verificationDate": null, "fullName": "Thomas James", "birthdate": null, "address": "2425, Bloor Avenue, Toronto", "nameVerified": null, "birthdateVerified": null }] }] }, { "id": 2242, "mortgagorType": "Business", "companyName": "FCT CORP", "firstName": "Tom", "middleName": null, "lastName": "Jones", "phone": null, "businessPhone": "9052871000", "language": "ENGLISH", "priorityIndicator": 5, "ilaRequired": true, "birthDate": null, "occupation": null, "spouseFirstName": null, "spouseMiddleName": null, "spouseLastName": null, "spouseIlaRequired": null, "spouseoccupation": null, "provinceOfIncorporation": null, "address": { "unitNumber": null, "streetNumber": "2425", "streetAddress1": "Bloor Avenue", "streetAddress2": null, "city": "Toronto", "province": "ON", "postalCode": "L4Z 8F6", "country": "Canada" }, "unsecuredDebts": [{ "creditor": "BOC", "action": "CLSACCNT", "amount": 3388 }], "incorporation": null, "identifications": null, "signatories": [{ "FirstName": "Tom", "MiddleName": null, "LastName": "Jones", "Birthdate": "1980-01-01", "Occupation": "IT Supervisor", "identifications": [{ "identificationType": "Canadian Passport", "identificationNumber": "4664765876865", "expiryDate": "2022-08-03", "issuingJurisdiction": "Toronto", "issuingCountry": "Canada", "verificationDate": null, "fullName": "Tom Jones", "birthdate": null, "address": "2425, Bloor Avenue, Toronto", "nameVerified": null, "birthdateVerified": null }] }] }], "guarantors": [{ "id": 1024, "guarantorType": "Person", "companyName": null, "firstName": "Terry", "middleName": "Tek", "lastName": "Lau", "phone": "9052871000", "businessPhone": "9052871000", "ilaRequired": true, "birthDate": null, "occupation": null, "address": { "unitNumber": null, "streetNumber": "28", "streetAddress1": "Canada Street", "streetAddress2": "Second Floor", "city": "Toronto", "province": "ON", "postalCode": "L4Z 8Y6", "country": "Canada" }, "identifications": [{ "identificationType": "Canadian Permanent Resident Card", "identificationNumber": "4999765296865", "expiryDate": "2022-08-03", "issuingJurisdiction": "Toronto", "issuingCountry": "Canada", "verificationDate": null, "fullName": "Terry Tek Lau", "birthdate": null, "address": "28, Canada Street, Toronto", "nameVerified": null, "birthdateVerified": null }], "signatories": null }], "properties": [{ "id": 2238, "legalDescription": "Lot 3423423, Plan 2343DD: Heart of the City close to Mall/Sub/Bus/TTC etc. All aminities included", "condoLevel": null, "condoUnitNumber": null, "occupancyType": "OWNER OCCUPIED", "numberOfUnits": null, "condoPlanNumber": null, "mortgagePriority": "FIRST", "lenderCollectsPropertyTaxes": false, "estateType": "OTHER", "otherEstateTypeDescription": "Testing New Field", "isCondominium": null, "condoCorporationNumber": null, "condoDeclarationRegisterationNumber": null, "condoDeclarationRegistrationDate": null, "condoPageNumberOfDeclaration": null, "condoBookNumberOfDeclaration": null, "condoDeclarationAcceptedDate": null, "condoPlanRegistrationDate": null, "condoDeclarationDate": null, "newHomeWarranty": null, "municipality": "City of Toronto", "annualTaxAmount": null, "instrumentNumber": "" + InstrumentNumber + "", "registrationDate": "" + RegistrationDate + "", "registryOffice": "" + RegistryOffice + "", "lroNumber": null, "newConstruction": null, "address": { "unitNumber": null, "streetNumber": "1233", "streetAddress1": "Victoria Street", "streetAddress2": null, "city": "Toronto", "province": "" + PropertyProvince + "", "postalCode": "L4Z 2Y5", "country": "Canada" }, "propertyIdentificationNumbers": ["123-109-221", "123-101-998"], "existingMortgages": [{ "amount": 700, "mortgagee": "Testing this new schema change", "action": "POSTPONED" }], "assessmentRollNumbers": AssessmentRollNumber, "fireInsurancePolicy": { "InsuranceCompanyName": "Fire Insurance Co Inc", "Phone": "647 852 3698", "Fax": "852 369 8412", "PolicyNumber": "5896363", "PolicyActiveDate": "2019-10-10", "ExpiryDate": "2022-10-10", "InsuranceAmount": 2000.25, "Broker": "Broker Name", "AgentFirstName": "Agent First Name", "AgentLastName": "Agent Last Name", "BrokerPhone": "705 258 7412", "UnitNumber": "1102", "StreetNumber": "8599", "Address": "Norwood Drive", "Address2": "Lakeshore Rd", "Country": "Canada", "City": "Toronto", "Province": "ON", "PostalCode": "L8W0B9" }, "registeredOwners": null }], "titleInsurancePolicies": [{ "insuranceCompany": "Insurance Co", "policyType": "3456453", "policyNumber": "3984759384", "policyDate": "2029-10-10", "nameOfInsured": "Insurance Capital", "insuredAmount": "4000" }], "attorneys": [] };

        return JSONBody;
    }

    this.ReturnSendUpdateTransactionJsonBNSDynamicRemoveTitleNumber = function (fcturn, AssessmentRollNumber, ClosingDate, InstrumentNumber, RegistrationDate, RegistryOffice, PropertyProvince) {

        LawyerMatterNo = CustLib.getRandomNumber(6);
        IDVIdNo1st = CustLib.getRandomNumber(13);
        IDVIssuingJurisdiction1st = 'Oakville';
        IDVExpiryDate1st = '2022-08-03';
        var IDVListBNS = ['Canadian Passport', 'Canadian Citizenship Card (Issued prior to 2012)', 'Canadian Permanent Resident Card', 'Canadian Forces Card', 'Foreign Passport', 'Canadian Provincial/Territory Driver\'s License', 'DND 404 Driver\'s License', 'Ontario Photo Card', 'American Driver\'s License'];
        IDVIdentificationType1st = CustLib.SelectRandomElementArray(IDVListBNS);
        if (!InstrumentNumber) {
            InstrumentNumber = 'Reg.No.8734683';
        }
        if (!RegistrationDate) {
            RegistrationDate = '2010-08-03';
        }
        if (!RegistryOffice) {
            RegistryOffice = 'Peel';
        }

        var MortgagorStreetNumber = '17';
        var MortgagorStreetAddress1 = 'Lakeshore Blvd. West';
        var MortgagorCity = 'Toronto';
        var MortgagorProvince = 'ON';
        var MortgagorPostalCode = 'L4Z 6C9';

        var JSONBody = { "transactionId": "" + fcturn + "", "closingDate": "" + ClosingDate + "T00:00:00", "purchasePrice": 125000, "lawyerMatterNumber": "" + LawyerMatterNo + "", "transactionType": "PURCHASE", "encumbrances": "Stores any information that is on title for the final report i.e. any exceptions/non-financials that the lawyer enters for the final report. Encumbrances are things that can be registered against your home and are not always debts- come in all forms of things from mortgages to judgements for unpaid debts like child support or alimony.  Other examples are easements which is basically a right of way across your property.  All utilities (Bell, Rogers, Hydro) have easements on residential properties because their lines are buried there.  An easement would always go with the property no matter who ownes it or if it has a mortgage on it or not.", "mortgagors": [{ "id": 2238, "mortgagorType": "Person", "companyName": null, "firstName": "" + MrtgagorFirst + "", "middleName": "" + MrtgagorMid + "", "lastName": "" + MrtgagorLast + "", "phone": "9052871000", "businessPhone": "9052871000", "language": "ENGLISH", "priorityIndicator": 2, "ilaRequired": null, "birthDate": null, "occupation": null, "spouseFirstName": null, "spouseMiddleName": null, "spouseLastName": null, "spouseIlaRequired": null, "spouseoccupation": null, "provinceOfIncorporation": null, "address": { "unitNumber": "1875", "streetNumber": "" + MortgagorStreetNumber + "", "streetAddress1": "" + MortgagorStreetAddress1 + "", "streetAddress2": "10th Floor", "city": "" + MortgagorCity + "", "province": "" + MortgagorProvince + "", "postalCode": "" + MortgagorPostalCode + "", "country": "Canada" }, "unsecuredDebts": [{ "creditor": "BOC", "action": "CLSACCNT", "amount": 3388 }], "incorporation": null, "identifications": [{ "identificationType": "" + IDVIdentificationType1st + "", "identificationNumber": "" + IDVIdNo1st + "", "expiryDate": "" + IDVExpiryDate1st + "", "issuingJurisdiction": "" + IDVIssuingJurisdiction1st + "", "issuingCountry": "Canada", "verificationDate": null, "fullName": "Marilyn J. Monroe", "birthdate": null, "address": "17, Lakeshore Blvd. West, Toronto", "nameVerified": null, "birthdateVerified": null }], "signatories": null }, { "id": 2239, "mortgagorType": "Person", "companyName": null, "firstName": "George", "middleName": "Matthew", "lastName": "Donald", "phone": "9052871000", "businessPhone": "9052871000", "language": "ENGLISH", "priorityIndicator": 1, "ilaRequired": true, "birthDate": null, "occupation": null, "spouseFirstName": "Monica", "spouseMiddleName": "Jessy", "spouseLastName": "Ruther", "spouseIlaRequired": false, "spouseoccupation": null, "provinceOfIncorporation": null, "address": { "unitNumber": "85", "streetNumber": "245", "streetAddress1": "Glen Erin Drive", "streetAddress2": "Northwest", "city": "Toronto", "province": "ON", "postalCode": "L4Z 8Y6", "country": "Canada" }, "unsecuredDebts": [{ "creditor": "BOC", "action": "CLSACCNT", "amount": 3388 }], "incorporation": null, "identifications": [{ "identificationType": "Ontario Photo Card", "identificationNumber": "4654734876865", "expiryDate": "2022-08-03", "issuingJurisdiction": "Mississauga", "issuingCountry": "Canada", "verificationDate": null, "fullName": "George Matthew Donald", "birthdate": null, "address": "245, Glen Erin Drive, Toronto", "nameVerified": null, "birthdateVerified": null }], "signatories": null }, { "id": 1024, "mortgagorType": "Person", "companyName": null, "firstName": "Rachel", "middleName": "Bruce", "lastName": "Larry", "phone": "9052871000", "businessPhone": "9052871000", "language": "ENGLISH", "priorityIndicator": 2, "ilaRequired": true, "birthDate": null, "occupation": null, "spouseFirstName": "NewMonica", "spouseMiddleName": "NewJessy", "spouseLastName": "MewRuther", "spouseIlaRequired": false, "spouseoccupation": null, "provinceOfIncorporation": null, "address": { "unitNumber": "851", "streetNumber": "2415", "streetAddress1": "Burnhamthrope Road", "streetAddress2": "Southwest Street2", "city": "Toronto", "province": "ON", "postalCode": "L4Z 8P6", "country": "Canada" }, "unsecuredDebts": [{ "creditor": "BOC", "action": "CLSACCNT", "amount": 3388 }], "incorporation": null, "identifications": [{ "identificationType": "Ontario Photo Card", "identificationNumber": "4654765296865", "expiryDate": "2022-08-03", "issuingJurisdiction": "Scarborough", "issuingCountry": "Canada", "verificationDate": null, "fullName": "Rachel Bruce Larry", "birthdate": null, "address": "2415, Burnhamthrope Road, Toronto", "nameVerified": null, "birthdateVerified": null }], "signatories": null }, { "id": 2241, "mortgagorType": "Business", "companyName": "First Canadian Title", "firstName": "Thomas", "middleName": null, "lastName": "James", "phone": null, "businessPhone": "9052871000", "language": "ENGLISH", "priorityIndicator": 5, "ilaRequired": true, "birthDate": null, "occupation": null, "spouseFirstName": null, "spouseMiddleName": null, "spouseLastName": null, "spouseIlaRequired": null, "spouseoccupation": null, "provinceOfIncorporation": null, "address": { "unitNumber": null, "streetNumber": "2425", "streetAddress1": "Bloor Avenue", "streetAddress2": null, "city": "Toronto", "province": "ON", "postalCode": "L4Z 8P6", "country": "Canada" }, "unsecuredDebts": [{ "creditor": "BOC", "action": "CLSACCNT", "amount": 3388 }], "incorporation": null, "identifications": null, "signatories": [{ "FirstName": "Thomas", "MiddleName": null, "LastName": "James", "Birthdate": "1986-01-01", "Occupation": "IT Consultant", "identifications": [{ "identificationType": "Canadian Passport", "identificationNumber": "4694765876865", "expiryDate": "2022-08-03", "issuingJurisdiction": "Oakville", "issuingCountry": "Canada", "verificationDate": null, "fullName": "Thomas James", "birthdate": null, "address": "2425, Bloor Avenue, Toronto", "nameVerified": null, "birthdateVerified": null }] }] }, { "id": 2242, "mortgagorType": "Business", "companyName": "FCT CORP", "firstName": "Tom", "middleName": null, "lastName": "Jones", "phone": null, "businessPhone": "9052871000", "language": "ENGLISH", "priorityIndicator": 5, "ilaRequired": true, "birthDate": null, "occupation": null, "spouseFirstName": null, "spouseMiddleName": null, "spouseLastName": null, "spouseIlaRequired": null, "spouseoccupation": null, "provinceOfIncorporation": null, "address": { "unitNumber": null, "streetNumber": "2425", "streetAddress1": "Bloor Avenue", "streetAddress2": null, "city": "Toronto", "province": "ON", "postalCode": "L4Z 8F6", "country": "Canada" }, "unsecuredDebts": [{ "creditor": "BOC", "action": "CLSACCNT", "amount": 3388 }], "incorporation": null, "identifications": null, "signatories": [{ "FirstName": "Tom", "MiddleName": null, "LastName": "Jones", "Birthdate": "1980-01-01", "Occupation": "IT Supervisor", "identifications": [{ "identificationType": "Canadian Passport", "identificationNumber": "4664765876865", "expiryDate": "2022-08-03", "issuingJurisdiction": "Toronto", "issuingCountry": "Canada", "verificationDate": null, "fullName": "Tom Jones", "birthdate": null, "address": "2425, Bloor Avenue, Toronto", "nameVerified": null, "birthdateVerified": null }] }] }], "guarantors": [{ "id": 1024, "guarantorType": "Person", "companyName": null, "firstName": "Terry", "middleName": "Tek", "lastName": "Lau", "phone": "9052871000", "businessPhone": "9052871000", "ilaRequired": true, "birthDate": null, "occupation": null, "address": { "unitNumber": null, "streetNumber": "28", "streetAddress1": "Canada Street", "streetAddress2": "Second Floor", "city": "Toronto", "province": "ON", "postalCode": "L4Z 8Y6", "country": "Canada" }, "identifications": [{ "identificationType": "Canadian Permanent Resident Card", "identificationNumber": "4999765296865", "expiryDate": "2022-08-03", "issuingJurisdiction": "Toronto", "issuingCountry": "Canada", "verificationDate": null, "fullName": "Terry Tek Lau", "birthdate": null, "address": "28, Canada Street, Toronto", "nameVerified": null, "birthdateVerified": null }], "signatories": null }], "properties": [{ "id": 2238, "legalDescription": "Lot 3423423, Plan 2343DD: Heart of the City close to Mall/Sub/Bus/TTC etc. All aminities included", "condoLevel": null, "condoUnitNumber": null, "occupancyType": "OWNER OCCUPIED", "numberOfUnits": null, "condoPlanNumber": null, "mortgagePriority": "FIRST", "lenderCollectsPropertyTaxes": false, "estateType": "OTHER", "otherEstateTypeDescription": "Testing New Field", "isCondominium": null, "condoCorporationNumber": null, "condoDeclarationRegisterationNumber": null, "condoDeclarationRegistrationDate": null, "condoPageNumberOfDeclaration": null, "condoBookNumberOfDeclaration": null, "condoDeclarationAcceptedDate": null, "condoPlanRegistrationDate": null, "condoDeclarationDate": null, "newHomeWarranty": null, "municipality": "City of Toronto", "annualTaxAmount": null, "instrumentNumber": "" + InstrumentNumber + "", "registrationDate": "" + RegistrationDate + "", "registryOffice": "" + RegistryOffice + "", "lroNumber": null, "newConstruction": null, "address": { "unitNumber": null, "streetNumber": "1233", "streetAddress1": "Victoria Street", "streetAddress2": null, "city": "Toronto", "province": "" + PropertyProvince + "", "postalCode": "L4Z 2Y5", "country": "Canada" }, "propertyIdentificationNumbers": [], "existingMortgages": [{ "amount": 700, "mortgagee": "Testing this new schema change", "action": "POSTPONED" }], "assessmentRollNumbers": AssessmentRollNumber, "fireInsurancePolicy": { "InsuranceCompanyName": "Fire Insurance Co Inc", "Phone": "647 852 3698", "Fax": "852 369 8412", "PolicyNumber": "5896363", "PolicyActiveDate": "2019-10-10", "ExpiryDate": "2022-10-10", "InsuranceAmount": 2000.25, "Broker": "Broker Name", "AgentFirstName": "Agent First Name", "AgentLastName": "Agent Last Name", "BrokerPhone": "705 258 7412", "UnitNumber": "1102", "StreetNumber": "8599", "Address": "Norwood Drive", "Address2": "Lakeshore Rd", "Country": "Canada", "City": "Toronto", "Province": "ON", "PostalCode": "L8W0B9" }, "registeredOwners": null }], "titleInsurancePolicies": [{ "insuranceCompany": "Insurance Co", "policyType": "3456453", "policyNumber": "3984759384", "policyDate": "2029-10-10", "nameOfInsured": "Insurance Capital", "insuredAmount": "4000" }], "attorneys": [] };

        return JSONBody;
    }

    this.verifyBNSDealMortageStdChargeTerm = function (dealID, expectedVal, provinceName, docType) {
        var Env = Runsettings.data.Global.ENVIRONMENT.value;
        var AuthorizationToken = Runsettings.data.Global.LawyerDetails[Env].Authorization;
        var EndPoint = Runsettings.data.Global.LawyerDetails[Env].Endpoint;
        var Resource = Runsettings.data.Global.LawyerDetails[Env].Resource;

        var options = function () {
            var OPtBody = {
                headers: {
                    "XFCTAuthorization": '' + XFCTAuthorizationVal + '',
                    "Authorization": AuthorizationToken,
                    "Content-Type": "application/json"
                },
                "url": EndPoint + Resource + dealID,
                "rejectUnauthorized": false
            }
            return OPtBody
        }
        var Request = require("request");
        Request.get(options(), function (error, response, body) {
            expect(response.statusCode).toBe(200, "get deal method passed, status code " + response.statusCode);
            if (response.statusCode == 200) {

                var actualVal;
                body = JSON.parse(body);
                if (body.mortgage["standardChargeTermText"] != null) {
                    actualVal = body.mortgage.standardChargeTermText["textEn"];
                }
                if (body.mortgage["standardChargeTermText"] != null && actualVal == null) {
                    actualVal = body.mortgage.standardChargeTermText["textFr"];
                }
                if (body.mortgage["standardChargeTermText"] == null && actualVal == null) {
                    actualVal = ""
                }
                console.log("Province Name "+ provinceName);
                console.log("Document Type"+ docType);
                expect(expectedVal).toBe(actualVal, "Expected StdChargeTerm value not matching with Actual Value for docType : " + docType);
            }       
        });
    }

    this.CleanUpScript = function () {
    MrtgagorFirst = null;
    MrtgagorMid = null;
    MrtgagorLast = null;
    LawyerMatterNo = null;
    TransactionStatus = null;
    IDVIdNo1st = null;
    IDVIssuingJurisdiction1st = null;
    IDVExpiryDate1st = null;
    IDVIdentificationType1st = null;
    LenderRequestId = null;
    jsonResponse = null;
    RedirectUrl = null;
}
   
}
module.exports = new LawyerIntegrationBNS();
