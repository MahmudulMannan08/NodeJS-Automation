'use strict';

var TestData = require('../../testData/TestData.js');
var Runsettings = require('../../testData/RunSetting.js');
var TDTestData = require('../../testData/TD/TDData.js');
var CustomLib = require('../../CustomLibrary/CustomLibrary.js');
var MenuPanel = require('../../PageObjectMethods/LLCUnityPortal/MenuPanel.js');
var Lang = Runsettings.data.Global.LANG.value;
var PortalFieldIdentifier = TestData.data[Lang].Header.PortalFieldIdentifier;
var Footer = TestData.data[Lang].Footer.Footer;
var NewNoteMsg = TestData.data[Lang].Notes.NewNoteMsg;
var StdNoteOption1 = TestData.data[Lang].Notes.StdNoteOption1;
var StdNoteOption2 = TestData.data[Lang].Notes.StdNoteOption2;
var StdNoteOption3 = TestData.data[Lang].Notes.StdNoteOption3;
var StdNoteOption4 = TestData.data[Lang].Notes.StdNoteOption4;
var PortalValidationMsg = TestData.data[Lang].Messages.PortalValidationMsg;
var NavigateAwyPopupMsg = TestData.data[Lang].Messages.NavigateawayMsg;
var ActionableNoteMsg = TestData.data[Lang].Notes.ActionableNoteMsg;
var ActionableNoteConfMsg = TestData.data[Lang].Notes.ActionableNoteConfMsg;

var counter = 0;

var Notes = function () {

    var lnkNeedHelp = element(by.linkText('Need Help?'));
    //var lblNotes = element(by.css('.title'));
    var Env = Runsettings.data.Global.ENVIRONMENT.value;
    var lblNotes = element.all(by.css('.title')).first();
    var table = element.all(by.css('.table.table-bordered.table-sm')).get(0);
    var tableNotesActionable = element.all(by.css('.table.table-bordered.table-sm.table-hover.table-fixed')).get(0);
    var tabBody = table.element(by.tagName('tbody'));
    var tabBodyNotesActionable = tableNotesActionable.element(by.tagName('tbody'));
    var fieldIdentifrAsterisk = element(by.tagName('app-note-edit')).element(by.tagName('span'));
    var btnNewNote = element(by.buttonText("New Note"));
    var lblNewNote = element(by.tagName('app-note-edit')).element(by.css('.title'));
    var lblNewNoteMsg = element(by.tagName('app-note-edit')).element(by.css('.font-weight-bold'));
    var lblStdNotes = element(by.tagName('app-note-edit')).all(by.css('.form-row.ng-star-inserted')).get(1).element(by.tagName('label'));
    var ddlStandardNotes = element(by.id('standardNotes'));
    var ddlStdNoteOption1 = ddlStandardNotes.all(by.tagName('option')).get(1);
    var ddlStdNoteOption2 = ddlStandardNotes.all(by.tagName('option')).get(2);
    var ddlStdNoteOption3 = ddlStandardNotes.all(by.tagName('option')).get(3);
    var ddlStdNoteOption4 = ddlStandardNotes.all(by.tagName('option')).get(4);
    var lblSubject = element(by.tagName('app-note-edit')).all(by.css('.form-row.ng-star-inserted')).get(2).element(by.tagName('label'));
    var tbSubject = element(by.id('subject'));
    //var lblNote = element(by.tagName('app-note-edit')).element(by.css('.form-group.col-md-11')).all(by.tagName('label')).get(0);
    var lblNote = element(by.css('.control-label.required'));
    //var lblNoteCounter = element(by.tagName('app-note-edit')).element(by.css('.form-group.col-md-11')).all(by.tagName('label')).get(1);
    var lblNoteCounter = element(by.tagName('strong'));
    var tbNote = element(by.id('noteDetail'));
    var btnCancel = element(by.buttonText('Cancel'));
    var btnSendNote = element(by.buttonText('Send Note'));

    var lblNotesMandatory = element(by.css('.text-danger'));
    var lblTextLength = element(by.tagName('strong'));
    var NotesTable = element.all(by.tagName('tbody')).get(1);
    var lblTbHeader = element(by.tagName('app-note-list')).element(by.css('.title'));
    var lnkPrintNotes = element(by.tagName('app-note-list')).element(by.cssContainingText('button', 'Print Notes'));
    var tbColHeader1st = element(by.tagName('app-note-list')).element(by.tagName('thead')).all(by.tagName('th')).get(0);
    var tbColHeader2nd = element(by.tagName('app-note-list')).element(by.tagName('thead')).all(by.tagName('th')).get(1);
    var tbColHeader3rd = element(by.tagName('app-note-list')).element(by.tagName('thead')).all(by.tagName('th')).get(2);
    var tbBody = element(by.tagName('app-note-list')).element(by.tagName('tbody'));
    var tbfirstNoteSubject = tbBody.all(by.css('.notes.subject')).get(0).element(by.tagName('span'));
    var tb1stNoteUser = tbBody.all(by.css('.notes.user')).get(0);
    var tb1stNoteSubject = tbBody.all(by.css('.notes.subject')).get(0).all(by.tagName('span')).get(0);
    var tb1stNoteDetail = tbBody.all(by.css('.notes.subject')).get(0).all(by.tagName('span')).get(1);
    var tb1stNoteDate = tbBody.all(by.css('.notes.timestamp')).get(0);

    var tbBodyAction = element.all(by.css('.table-responsive')).get(0);
    var lblTbHeaderAction = element.all(by.css('.jumbotron.box-outer.ng-star-inserted')).get(1).element(by.css('.title'));
    var lblTbActionMsg = element.all(by.css('.jumbotron.box-outer.ng-star-inserted')).get(1).all(by.tagName('p')).get(0);
    var tbColHeader1stAction = element.all(by.css('.jumbotron.box-outer.ng-star-inserted')).get(1).all(by.tagName('th')).get(0);
    var tbColHeader2ndAction = element.all(by.css('.jumbotron.box-outer.ng-star-inserted')).get(1).all(by.tagName('th')).get(1);
    var tbColHeader3rdAction = element.all(by.css('.jumbotron.box-outer.ng-star-inserted')).get(1).all(by.tagName('th')).get(2);

    var SecFooter = element(by.tagName('app-footer'));
    var lnkLegal = SecFooter.all(by.tagName('a')).get(0);
    var lnkPrivacy = SecFooter.all(by.tagName('a')).get(1);
    var txtFooter = SecFooter.element(by.tagName('span'));

    var navigateAwyPopup = element(by.tagName('app-modal-dialog'));
    var navigateAwyPopupMsg = element(by.tagName('app-modal-dialog')).element(by.css('.modal-body'));
    var navigateAwyStay = element(by.id('btnCancel'));
    var navigateAwyLeave = element(by.id('btnOk'));
    var PartnerSystemValidationMsg = TestData.data[Lang].Messages.PartnerSystemValidationMsg;
    var PortalValidationMsg = TestData.data[Lang].Messages.PortalValidationMsg;
    var UnityValidationMsg = TestData.data[Lang].Messages.UnityValidationMsg;

    var HomeMenu = element(by.id('home'));

    this.VerifyNotesPage = function () {

        CustomLib.WaitforElementVisible(tbColHeader1st);
        expect(lnkNeedHelp.isDisplayed()).toBe(true,'Need help link is not present');

        expect(lblNotes.isDisplayed()).toBe(true,'Label notes is not present');
        expect(lblNotes.getText()).toBe('Notes');

        expect(lblTbHeader.isDisplayed()).toBe(true,'Notes table header is not present');
        expect(lblTbHeader.getText()).toBe('Notes History');

        expect(lnkPrintNotes.isDisplayed()).toBe(true,'Print notes link is not present');
        expect(lnkPrintNotes.getText()).toBe('Print Notes');

        expect(tbColHeader1st.isDisplayed()).toBe(true,'Column header is missing');
        expect(tbColHeader1st.getText()).toBe('User');

        expect(tbColHeader2nd.isDisplayed()).toBe(true,'Column header is missing');
        expect(tbColHeader2nd.getText()).toBe('Subject / Note');

        expect(tbColHeader3rd.isDisplayed()).toBe(true,'Column header is missing');
        expect(tbColHeader3rd.getText()).toBe('Date / Time Created');

        expect(txtFooter.isDisplayed()).toBe(true,'Footer is missing');
        expect(txtFooter.getText()).toContain(Footer);

        expect(lnkLegal.isDisplayed()).toBe(true,'Legal link is missing');
        expect(lnkLegal.getText()).toBe('Legal');

        expect(lnkPrivacy.isDisplayed()).toBe(true,'Privacy link is missing');
        expect(lnkPrivacy.getText()).toBe('Privacy Policy');
    }

    this.NewNoteFeildsHidden = function () {

        expect(fieldIdentifrAsterisk.isPresent()).toBe(false),'Asterisk is present';
        expect(lblNewNote.isPresent()).toBe(false,'New note lable is present');
        expect(lblNewNoteMsg.isPresent()).toBe(false,'New note message is present');
        expect(lblStdNotes.isPresent()).toBe(false,'Label standard notes is present');
        expect(ddlStandardNotes.isPresent()).toBe(false,'Standard notes ddl is present');
        expect(lblSubject.isPresent()).toBe(false,'Label subject is present');
        expect(tbSubject.isPresent()).toBe(false,'Field subject is present');
        expect(lblNote.isPresent()).toBe(false,'Label note is present');
        expect(lblNoteCounter.isPresent()).toBe(false,'Label note counter is present');
        expect(tbNote.isPresent()).toBe(false,'Field note is present');
        expect(btnCancel.isPresent()).toBe(false,'Cancel button is present');
        expect(btnSendNote.isPresent()).toBe(false,'Send note button is present');
    }

     this.waituntilNotesappear=function(Notes){
         counter=0;
        checkNotesappear(Notes);
    }

    var checkNotesappear= function (Notes)
    {
        var btnNotes = element(by.id('notes'));
        var btnFinalReport = element(by.id('reports'))
        var EC = protractor.ExpectedConditions;  
        CustomLib.WaitForSpinnerInvisible();
        browser.wait(EC.elementToBeClickable(btnNotes), 45000,  'Waiting for element to become clickable').then(() => {
                browser.sleep(2000); // Wait for element to be clickable
                btnNotes.click().then(() => {
                   CustomLib.WaitForSpinnerInvisible();
                    tbfirstNoteSubject.getText().then(function (text) { 
                        if(text.includes(Notes) ||  counter > 50){                
                            return true;
                        }   
                        else{
                            counter++;
                            browser.sleep(2000);
                            browser.wait(EC.elementToBeClickable(btnFinalReport), 45000,  'Waiting for element to become clickable').then(() => {
                                browser.sleep(2000); // Wait for element to be clickable
                                btnFinalReport.click();
                            })
                            console.log("Attempt to check notes appear : "+ counter);
                            checkNotesappear(Notes);
                
                        } });
                })
            
            }, (error) => {
                console.log(error);
        })     
    }

    this.ClickNotesButton = function (btn) {

        //CustomLib.WaitForSpinnerInvisible();
        switch (btn) {

            case 'NewNote':
                CustomLib.scrollIntoView(btnNewNote);
                CustomLib.WaitNClick(btnNewNote);
                CustomLib.WaitforElementVisible(btnCancel);
                break;
            case 'Cancel':
                CustomLib.ScrollDown();
                CustomLib.WaitNClick(btnCancel);
                CustomLib.WaitforElementVisible(btnNewNote);
                break;
            case 'SendNote':
                CustomLib.ScrollDown();
                CustomLib.WaitNClick(btnSendNote);
                browser.sleep(2000);
                break;

        }
    }

    this.VerifyNewNoteFeilds = function () {

        expect(fieldIdentifrAsterisk.isDisplayed()).toBe(true,'Asterisk symbol is not present');
        expect(fieldIdentifrAsterisk.getText()).toBe(PortalFieldIdentifier);

        expect(lblNewNote.isDisplayed()).toBe(true,'Label new note is not displayed.');
        expect(lblNewNote.getText()).toBe('New Note');

        expect(lblNewNoteMsg.isDisplayed()).toBe(true,'New note message is not displayed');
        expect(lblNewNoteMsg.getText()).toBe(NewNoteMsg);

        expect(lblStdNotes.isDisplayed()).toBe(true,'Label notes is not displayed');
        expect(lblStdNotes.getText()).toBe('Standard Notes');

        expect(ddlStandardNotes.isDisplayed()).toBe(true,'DDL notes is not displayed');
        expect(ddlStdNoteOption1.getText()).toContain(StdNoteOption1,'Closing delayed option is not present in the DDL');
        expect(ddlStdNoteOption2.getText()).toContain(StdNoteOption2,'Conditions satisfied option is not present in the DDL');
        expect(ddlStdNoteOption3.getText()).toContain(StdNoteOption3,'Confirmation of mortgage registration option is not present in the DDL');
        expect(ddlStdNoteOption4.getText()).toContain(StdNoteOption4,'Fund not yet received option is not present in the DDL');

        expect(lblSubject.isDisplayed()).toBe(true,'Label subject is not present');
        expect(lblSubject.getText()).toBe('Subject');

        expect(tbSubject.isDisplayed()).toBe(true,'Table subject is not displayed');

        expect(lblNote.isDisplayed()).toBe(true,'Label note is not displayed');
        expect(lblNote.getText()).toBe('Note');
        expect(lblNoteCounter.isDisplayed()).toBe(true,'Note character counter is not displayed');
        expect(lblNoteCounter.getText()).toBe('0/1000 characters');

        expect(tbNote.isPresent()).toBe(true,'Table note is not present.');

        expect(btnCancel.isPresent()).toBe(true,'Button cancel is not present.');
        expect(btnSendNote.isPresent()).toBe(true,'Button send note is not present.');
        expect(btnCancel.isEnabled()).toBe(true,'Button cancel is disabled.');
        expect(btnSendNote.isEnabled()).toBe(true,'Button send note is disabled.');
    }

    this.VerifyMMSNewNoteFeilds = function () {

        expect(ddlStandardNotes.isPresent()).toBe(false)
        expect(tbSubject.isPresent()).toBe(false)
        expect(tbNote.isPresent()).toBe(true);
        expect(btnCancel.isPresent()).toBe(true);
        expect(btnSendNote.isPresent()).toBe(true);
        expect(btnCancel.isEnabled()).toBe(true);
        expect(btnSendNote.isEnabled()).toBe(true);
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

    this.EnterNotesText = function (txt) {
        CustomLib.WaitforElementVisible(tbNote);
        tbNote.clear();
        // browser.executeScript("arguments[0].setAttribute('value', '" + txt + "')", tbNote);
        if (txt != null) { tbNote.sendKeys(txt); }

    }

    this.EnterSubjectText = function (txt) {

        tbSubject.clear();
        if (txt != null) { tbSubject.sendKeys(txt); }
    }

    this.GetEnteredTextSize = function () {
        return lblTextLength.getText().then(function (txt) {
            return parseInt(txt.split('/')[0], 10)
        })
    }

    this.VerifyNotesMandatoryFeild = function () {
        expect(lblNotesMandatory.isDisplayed()).toBe(true);
        expect(element.all(by.css('.text-danger')).count()).toBe(1);
    }

    this.ClearNotesFeild = function () {


        tbNote.clear();
        tbNote.sendKeys("A")
        tbNote.sendKeys(protractor.Key.BACK_SPACE);


    }

    this.VerifyMissinfieldMessag = function () {

        expect(element(by.css('.col-md-12.required-message-danger')).isPresent()).toBe(true,'Required Missing field message is not present');
        expect(element(by.css('.col-md-12.required-message-danger')).getText()).toContain(PortalValidationMsg);
    }

    this.GetNotesTableCount = function () {

        return NotesTable.all(by.tagName('tr')).then(function (rows) {

            console.log(rows.length);
            return rows.length;
        })
    }

    this.GetNotesTableCountBNSTD = function () {

        return tbBody.all(by.tagName('tr')).then(function (rows) {

            console.log("Number of note rows: ", rows.length);
            return rows.length;
        })
    }

    this.GetNotesTableCountBNSTDActionable = function () {

        return tbBodyAction.all(by.tagName('tbody')).then(function (rows) {

            console.log("Number of actionable note rows: ", rows.length);
            return rows.length;
        })
    }

    this.WaitForExpectedNoteEntry = function(expectedRowCount) {
        counter=0;
        WaitUntilExpectedRows(expectedRowCount);
    }

    var WaitUntilExpectedRows = function(expectedRowCount) {

        tbBody.all(by.tagName('tr')).then(function (rows) {

            if(counter < 15) {

                counter++;

                if(rows.length < expectedRowCount) {

                    MenuPanel.PrimaryMenuNavigateWithWait('Home');
                    browser.sleep(500);
                    MenuPanel.PrimaryMenuNavigateWithWait('Notes');
                    browser.sleep(500);
                    WaitUntilExpectedRows(expectedRowCount);
                }
            }

            else {

                expect(counter).toBeLessThan(15, "\x1b[41m\x1b[30m" + "Expected notes table entry is not logged" + "\x1b[0m");
                //console.log("\x1b[41m\x1b[30m%s\x1b[0m", "Expected notes table entry is not logged");
            }
        })
    }

    this.VerifyNotesTableEntry = function (rowNumb, firstNameU, lastNameU, subject, detail) {
        
        CustomLib.WaitforElementVisible(tbBody);
        expect(tbBody.all(by.tagName('tr')).get(rowNumb - 1).element(by.css('.notes.user')).getText()).toBe(firstNameU + ' ' + lastNameU);
        expect(tbBody.all(by.tagName('tr')).get(rowNumb - 1).element(by.css('.notes.subject')).all(by.tagName('span')).get(0).getText()).toContain(subject);
        expect(tbBody.all(by.tagName('tr')).get(rowNumb - 1).element(by.css('.notes.subject')).all(by.tagName('span')).get(1).getText()).toBe(detail);
        tbBody.all(by.tagName('tr')).get(rowNumb - 1).element(by.css('.notes.timestamp')).getText().then(function (DateTime) {

            console.log("Note DateTime Created: ", DateTime);
            expect(DateTime).not.toBe(null);
        })
    }

    this.VerifyNotesTableActionable = function () {

        CustomLib.WaitforElementVisible(lblTbHeaderAction);
        expect(lblTbHeaderAction.getText()).toBe('Actionable Notes', 'Actionable notes table header is not as expected!');
        expect(lblTbActionMsg.getText()).toBe(ActionableNoteMsg);
        expect(tbColHeader1stAction.getText()).toBe('Task Action', 'Hearder of column 1 is not Task Action');
        expect(tbColHeader2ndAction.getText()).toBe('Subject / Note', 'Hearder of column 2 is not Subject / Note');
        expect(tbColHeader3rdAction.getText()).toBe('Date/Time Received', 'Hearder of column 3 is not Date/Time Received');
    }

    this.VerifyNotesHistoryTableSearch = function (SearchText,expectResult) {
        var found=false;
        var resultexpected= "not"
        if(expectResult){
            resultexpected ="";
        }
        var rows = tabBody.all(by.tagName('tr'));
        console.log("here U are :" + rows);
        rows.each(function (row, rowindex) {
            var cols = row.all(by.tagName('td'));
            cols.get(1).getText().then(function (txt) {
               
                if (txt.includes(SearchText)) {
                    console.log(txt);
                   found=true;
                  
                }
            });
        }).then (function(){
            console.log("Search Result : "+ found);

            expect(found).toBe(expectResult,"Notes history verification failed, it was "+ resultexpected+" expecting a text like this in the history : " + SearchText);
        })
    }

    this.VerifyNotesActionableTableSearch = function (SearchText,expectResult) {
        var found=false;
        var resultexpected= "not"
        if(expectResult){
            resultexpected ="";
        }
        var rows = tabBodyNotesActionable.all(by.tagName('tr'));
        console.log("here U are :" + rows);
        rows.each(function (row, rowindex) {
            var cols = row.all(by.tagName('td'));
            cols.get(1).getText().then(function (txt) {
               
                if (txt.includes(SearchText)) {
                    console.log(txt);
                   found=true;
                  
                }
            });
        }).then (function(){
            console.log("Search Result : "+ found);

            expect(found).toBe(expectResult,"Notes history verification failed, it was "+ resultexpected+" expecting a text like this in the history : " + SearchText);
        })
    }

    this.VerifyNotesTableForCompletedActionableEntry = function (SearchText,expectResult) {
        var found=false;
        var resultexpected= "not"
        if(expectResult){
            resultexpected ="";
        }
        var rows = tabBody.all(by.tagName('tr'));
        console.log("here U are :" + rows);
        rows.each(function (row, rowindex) {
            var cols = row.all(by.tagName('td'));
            cols.get(1).getText().then(function (txt) {
               
                if (txt.includes((SearchText + '(Actionable Note - completed)')) ){
                    console.log(txt);
                   found=true;
                  
                }
            });
        }).then (function(){
            console.log("Search Result : "+ found);

            expect(found).toBe(expectResult,"Notes history verification failed, it was "+ resultexpected+" expecting a text like this in the history : " + SearchText);
        })
    }

    this.VerifyCancellationRequestMsg = function() {
        var StatusMsg = element(by.css('.msg-container.ng-star-inserted'));
        var CancellationRequestMessage = TestData.data[Lang].Messages.CancellationRequestMsg;
        expect(StatusMsg.getText()).toContain(CancellationRequestMessage,'Cancellation deal message is not present.');
    }

    this.VerifyNotesTableEntryActionable = function (rowNumb, subject, detail) {

        expect(tbBodyAction.all(by.tagName('tbody')).get(rowNumb - 1).element(by.css('.notes.user')).getText()).toBe('Complete');
        expect(tbBodyAction.all(by.tagName('tbody')).get(rowNumb - 1).element(by.css('.notes.user')).isEnabled()).toBe(true);
        expect(tbBodyAction.all(by.tagName('tbody')).get(rowNumb - 1).element(by.css('.notes.subject')).all(by.tagName('span')).get(0).getText()).toBe(subject, 'Actionable notes subject is not as expected');
        expect(tbBodyAction.all(by.tagName('tbody')).get(rowNumb - 1).element(by.css('.notes.subject')).all(by.tagName('span')).get(1).getText()).toBe(detail), 'Actionable notes details are not as expected';
        tbBodyAction.all(by.tagName('tbody')).get(rowNumb - 1).element(by.css('.notes.timestamp')).getText().then(function (DateTime) {

            console.log("Actionable Note DateTime Created: ", DateTime);
            expect(DateTime).not.toBe(null, 'DateTime is null');
        })
    }

    this.ConfirmActionableNote = function (rowNumb, bool) {

        CustomLib.WaitNClick(tbBodyAction.all(by.tagName('tbody')).get(rowNumb - 1).element(by.tagName('button')));
        var btnYes = element(by.css('.card-body')).all(by.tagName('button')).get(1);
        var btnNo = element(by.css('.card-body')).all(by.tagName('button')).get(0);
        CustomLib.WaitforElementVisible(btnYes);
        if (bool) {
            CustomLib.WaitNClick(btnYes);
        }
        else {
            CustomLib.WaitNClick(btnNo);
        }
        CustomLib.WaitForSpinnerInvisible();
    }

    this.VerifyActionableNoteConfirmation = function () {

        CustomLib.WaitNClick(tbBodyAction.all(by.tagName('tbody')).get(0).element(by.tagName('button')));
        var btnYes = element(by.css('.card-body')).all(by.tagName('button')).get(1);
        var btnNo = element(by.css('.card-body')).all(by.tagName('button')).get(0);
        var ConfirmationMsg = element(by.css('.card-header'));
        CustomLib.WaitforElementVisible(btnYes);
        expect(ConfirmationMsg.getText()).toBe(ActionableNoteConfMsg, 'Confirmation message for actionable notes is not as expected.');
        expect(btnYes.isEnabled()).toBe(true,'Yes button is disabled.');
        expect(btnNo.isEnabled()).toBe(true, 'No button is disabled.');
        btnNo.click();
    }

    this.VerifySpecialAttnIcon = function (bool, count) {

        var spanCount = element(by.id('notes')).all(by.tagName('span')).then(function (spans) {
            return spans.length;
        })
        if (bool) {
            //Verify notes indicator icon is available
            //expect(element(by.id('notes')).all(by.tagName('span')).get(1).isPresent()).toBe(true);
            expect(spanCount).toBe(2, 'Notes indicator icon is not available.');

            //Verify notes indicator icon count
            expect(element(by.id('notes')).all(by.tagName('span')).get(1).getText()).toBe(count, 'Notes indicator count is not as expected.');
        }
        else {
            //Verify notes indicator icon is not available
            //expect(element(by.id('notes')).all(by.tagName('span')).get(1).isPresent()).toBe(false);
            expect(spanCount).toBe(1, 'Notes indicator icon is available.');
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

    this.VerifyClosedDealMsg = function (Msg) {

        //var ClosedMsg = element(by.css('.msg-container.ng-star-inserted')).all(by.css('.d-flex.my-1.ng-star-inserted')).get(0);
        var ClosedMsg = element(by.css('.msg-container.ng-star-inserted'));
    
        CustomLib.scrollIntoView(ClosedMsg);
        expect(ClosedMsg.getText()).toContain(Msg);
    }

    this.VerifyActionableNotesTableDisplayed = function (bool) {

        var tablesCount = element.all(by.css('.table-responsive')).then(function (rows) {
            return rows.length;
        })
        if (bool) {
            expect(tablesCount).toBe(2, 'Actionable notes table count is not as expected.');
            expect(lblTbHeaderAction.isDisplayed()).toBe(true, 'Actionable notes table is not displayed.');
        }
        else {
            expect(tablesCount).toBe(1, 'Actionable notes table count is not as expected.');
            expect(lblTbHeaderAction.isPresent()).toBe(false, 'Actionable notes table is displayed.');
        }
    }

    this.VerifySavedChanges = function (SavedMsg) {

        var SuccessMsg = element(by.css('.msg-container.ng-star-inserted'))
        CustomLib.scrollIntoView(SuccessMsg);
        browser.sleep(500);
        expect(SuccessMsg.getText()).toContain(SavedMsg);

    }

    this.VerifyActionableNotesSubmissionMsg = function (Msg) {

        var NotesMsg = element(by.css('.msg-container.ng-star-inserted'))
        CustomLib.scrollIntoView(NotesMsg);
        browser.sleep(500);
        expect(NotesMsg.getText()).toContain(Msg, 'Send note message is not present');

    }



    this.VerifyLenderNotesAreHighlighted = function (SearchText) {
     
        var rows = tabBody.all(by.tagName('tr'));
        var cols = rows.all(by.tagName('td'));
        cols.get(1).getText().then(function (txt) {
           
        if (txt.includes(SearchText)) {
       
        rows.get(0).getAttribute('class').then(function (rowColor) {
        console.log(rowColor);
        expect(rowColor).toBe('new-lender-notes ng-star-inserted');

            }) 

        }
    })            

    } 

  


    this.VerifyNewNoteButtonStatus = function (Status) {

        if (Status == 'Disabled') {
            expect(btnNewNote.isEnabled()).toBe(false);
        }
        if (Status == 'Enabled') {
            expect(btnNewNote.isEnabled()).toBe(true);
        }
    }

    this.VerifyPrintButtonStatus = function (Status) {

        if (Status == 'Disabled') {
            expect(lnkPrintNotes.isEnabled()).toBe(false,"Print Notes button is not disabled.");
        }
        if (Status == 'Enabled') {
            expect(lnkPrintNotes.isEnabled()).toBe(true,"Print notes button is not enabled.");
        }
    }

    this.VerifyPrintNote = function () {

        CustomLib.scrollIntoView(lblTbHeader);
        lnkPrintNotes.click();
        browser.sleep(5000);
        sendKeys(protractor.Key.TAB);
        sendKeys(protractor.Key.ENTER);

    }

    this.ExpandNoteNVerify = function (rowNumb) {

        tbBody.all(by.tagName('tr')).then(function (rows) {

            CustomLib.WaitNClick(rows[rowNumb - 1].all(by.tagName('td')).get(1).element(by.tagName('a')));

            expect(rows[rowNumb - 1].all(by.tagName('td')).get(1).all(by.tagName('span')).get(1).getAttribute('aria-expanded')).toBe('true','Unable to expand notes.');

        })
    }

    this.CollapseNoteNVerify = function (rowNumb) {

        tbBody.all(by.tagName('tr')).then(function (rows) {

            CustomLib.WaitNClick(rows[rowNumb - 1].all(by.tagName('td')).get(1).element(by.tagName('a')));

            //expect(rows[rowNumb - 1].all(by.tagName('td')).get(1).all(by.tagName('span')).get(2).getAttribute('aria-expanded')).toBe('false');
            expect(rows[rowNumb - 1].all(by.tagName('td')).get(1).all(by.tagName('span')).get(3).getAttribute('aria-expanded')).toBe('false','Unable to collapse notes.');
        })
    }

    this.NavigateAway = function () {
        browser.sleep(1000);
        CustomLib.WaitNClick(HomeMenu);
    }

    this.VerifyNavigateAway = function () {
        CustomLib.WaitforElementVisible(navigateAwyPopupMsg);
        expect(navigateAwyPopup.isDisplayed()).toBe(true,'Navigate away pop up is not displayed.');
        expect(navigateAwyPopupMsg.getText()).toBe(NavigateAwyPopupMsg,'Navigate away pop up is displaying incorrect message');
        expect(navigateAwyStay.isDisplayed()).toBe(true,'Stay button is not displayed in navigate away pop up');
        expect(navigateAwyLeave.isDisplayed()).toBe(true,'Leave button is not displayed in navigate away pop up');

    }

    this.NavigateAwayAcceptReject = function (buttonSelect) {

        CustomLib.WaitForSpinnerInvisible();
        if (buttonSelect == 'Cancel') {
            CustomLib.WaitNClick(navigateAwyStay);
        }
        if (buttonSelect == 'OK') {
            CustomLib.WaitNClick(navigateAwyLeave);
        }

    }
    this.VerifyNotesUnavailableforTDMessage = function () {
        var msg = element(by.css('.m-0'));
        CustomLib.WaitforElementVisible(msg);
        msg.getText().then(function (txt) {
            //expect(txt).toContain("Notes functionality is unavailable for TTD deals. Please contact TTD directly by phone or fax to communicate your message.")
            expect(txt).toContain(TDTestData.data[TestData.data.LANGUAGE.value].Notes.NoteMsg)
           
        })
    }
    
    this.clearSubjectFeild = function () {
        tbSubject.clear();
    }

    //MMS
    this.ExpandNote2 = function (i) {

        NotesTable.all(by.tagName('tr')).then(function (rows) {

            rows[i].element(by.tagName('td')).element(by.tagName('a')).click();

            expect(rows[i].all(by.tagName('td')).get(2).all(by.tagName('span')).get(0).getAttribute('aria-expanded')).toBe('true')

        })
    }
    this.VerifyCollapsedNote2 = function (i) {


        NotesTable.all(by.tagName('tr')).then(function (rows) {
            expect(rows[i].all(by.tagName('td')).get(2).all(by.tagName('span')).get(1).getAttribute('aria-expanded')).toBe('false')

        })
    }
    this.GetNotesText = function (i) {

        return element.all(by.tagName('tbody')).all(by.tagName('tr')).then(function (rows) {
            return rows[i].all(by.tagName('td')).get(1).getText();

        })

    }
    this.GetNotesUserName = function (i) {

        return NotesTable.all(by.tagName('tr')).then(function (rows) {
            return rows[i].all(by.tagName('td')).get(1).getText();

        })

    }
    this.VerifyTDMessage = function () {
        expect(element(by.css('.text-danger')).getText()).toContain("Notes functionality is unavailable for TTD deals. Please contact TTD directly by phone or fax to communicate your message.");;

    }

    this.SelectStandardNoteType = function (type) {

        ddlStandardNotes.element(by.cssContainingText('option', type)).click();
        browser.sleep(1000);
    }

    this.VerifyPopulatedSubjectTB = function (txt) {

        expect(tbSubject.getAttribute('value')).toContain(txt);
        expect(tbSubject.isEnabled()).toBe(true,'Subject field is disabled');
    }

    this.VerifyPopulatedNoteTB = function (txt) {
        expect(tbNote.getAttribute('value')).toContain(txt, 'Expected notes text is not present.');
        expect(tbNote.isEnabled()).toBe(true,'Notes field is disabled');
    }

    this.OnCancelClick = function () {
        expect(tbNote.isPresent()).toBe(false);
    }

    this.VerifyNotesHistory = function () {
        var btnSavePrint = element(by.id('button-strip')).element(by.css('.action-button'));

        var btnCancelPrint = element(by.id('sidebar')).element(by.css('.cancel-button'));
        expect(lnkPrintNotes.isEnabled()).toBe(true);
        //lnkPrintNotes.click();
            // browser.sleep(5000);

    }

    this.GetNotesSubjectTimeStamp = function (inputmmsnote) {       
        CustomLib.WaitforElementVisible(tbfirstNoteSubject);
        expect(tbfirstNoteSubject.getText()).toContain(inputmmsnote, "Verify Notes Message");
    }

    //Lawyer Amendments 

    // this.VerifyAmendmentDeclineNote=function(declinednotes){
    //     expect(tbfirstNoteSubject.getText()).toContain(declinednotes);


    // }

    this.WaitForNoteToBeVisisble = function()
    {
        browser.wait(WaitForNotes, 60000);
    }

    var WaitForNotes = function()
    {
        MenuPanel.PrimaryMenuNavigateWithWait('Home');
        CustomLib.WaitForSpinnerInvisible();
        MenuPanel.PrimaryMenuNavigateWithWait('Notes');
        CustomLib.WaitForSpinnerInvisible();
        return element(by.xpath('//app-note-list//table/tbody')).all(by.tagName('tr')).count().then(function (count) {
            if (count > 0) {
                return true;
            }
        });      
    }


    this.VerifyAmendmentDeclineNote = function (declinednotes) {

        CustomLib.WaitforElementVisible(tbfirstNoteSubject);
        var NoteText = tbfirstNoteSubject.getText();
        var trimNote = NoteText.then(function (text) {
            expect(text.trim()).toContain(declinednotes.trim(), "Decline Note Message");
          // expect(declinednotes.trim()).toContain(NoteText.trim(), "Decline Note Message");
            //return text.trim()
            //expect(trimNote.toContain(declinednotes.trim()));
        });
    }
    //Lawyer Amendments




};

module.exports = new Notes();