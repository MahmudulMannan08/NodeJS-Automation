'use strict';

var MenuPanel = function () {
    
    //Primary Menu Navigation Panel
    var btnHome
    var btnManageDocuments
    var btnReqForFunds
    var btnFinalReport
    var btnNotes
    var btnReqCancel
    var btnDealHistory

    // Pages Panel
    var txtSearchPages
    var btnLLCUnityFolder
    var btnOOAUnityFolder


    //Secondary Menu
    var btnPagesSM
    var btnNotesSM
    var btnDiscussSM
    var btnConsoleSM

    this.PrimaryMenuNavigateTo = function (option) { 
    
        switch (option) {
            case 'Home':
                btnHome.click();
                break;
            case 'ManageDocs':
                btnManageDocuments.click();
                break;
            case 'RequestForFunds':
                btnReqForFunds.click();
                break;

            case 'FinalReport':
                btnFinalReport.click();
                break;
            case 'Notes':
                btnNotes.click();
                break;
            case 'ReqCancel':
                btnReqCancel.click();
                break;
            case 'dealHistory':
                btnDealHistory
                break;

        
        
        
        }
    }
    this.SecondaryMenuNavigateTo = function (option) {
        
        switch (option) {
            case 'Pages':
                btnPagesSM.click();
                break;
            case 'Notes':
                btnNotesSM.click();
                break;
            case 'Discuss':
                btnDiscussSM.click();
                break;

            case 'Console':
                btnConsoleSM.click();
                break;
           
        }
    }
    this.SearchPageMenu = function (txt) { 
        txtSearchPages.sendKeys(txt);
    }

};

module.exports = new MenuPanel();