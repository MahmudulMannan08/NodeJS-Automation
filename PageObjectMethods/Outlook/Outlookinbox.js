'use strict';

var CustomLib = require('../../CustomLibrary/CustomLibrary.js');

var EC = protractor.ExpectedConditions;
var isMailAvailable = new Boolean(false);

var counter = 0;

var OutlookInbox = function () {
    
    var txtSearchInbox = element(by.css('._n_l.ms-fwt-sl.ms-fcl-ns.ms-fcl-np')); 
    var txfind =element(by.xpath('//*[@id="primaryContainer"]//form/div/input'));// element(by.css('._is_r')).element(by.tagName('input'));
    
    var imgSearch = element(by.css('._is_w.o365button'));
    var exitSearch = element(by.buttonText('Exit search'));
   // var btnSignOut = element(by.css('.headerMenuDropShadow.contextMenuPopup.removeFocusOutline')).all(by.tagName('button')).get(1);

    var btnSignOut = element(by.xpath('//div[@class=\'headerMenuDropShadow contextMenuPopup removeFocusOutline\']//button/div/span[contains(text(),\'Sign out\')]'));
    var SubjectLine = element(by.id('divConvTopic'));
    var imgclear = element.all(by.xpath('//*[@id="divJnkmItm"]/div[2]/img')).get(0)

    this.OutlookSearchmail = function (LenderRefNo, subtext) {

        element.all(by.xpath('//*[@id="primaryContainer"]//button[@class=\'_n_Y4 o365button\' and @style=\'display: none;\']')).count().then(function (countSearchResult) {
            console.log("Count is "+ countSearchResult);  
            
           if (countSearchResult = 0) {
                        CustomLib.WaitNClick(by.xpath('//*[@id="primaryContainer"]//button[@class=\'_n_Y4 o365button\']'));
                        browser.sleep(1500);                 
                }});
    

        var found = new Boolean();
        var EC = protractor.ExpectedConditions;
        var txtSearchboxVisibility = EC.visibilityOf(txtSearchInbox);
        var txtSearchboxClickable = EC.elementToBeClickable(txtSearchInbox);
        browser.wait(EC.and(txtSearchboxVisibility, txtSearchboxClickable), 65000, 'Waiting for element to become visible').then(() => {
            
            txtSearchInbox.click();
            
        }, (error) => {
            expect(true).toBe(false, "EmailSerachtextbox is not visible");
        })

        browser.sleep(1500);  
        
             
        txfind.sendKeys(LenderRefNo);       

        CustomLib.WaitforElementVisible(imgSearch);
        return imgSearch.click().then(function () {            
            browser.sleep(5000);            
            element.all(by.css('._lvv_W.customScrollBar.scrollContainer')).each(function (searchresult, indx) {
                searchresult.getText().then(function (text) {
                    console.log(text)
                    if (text.includes(subtext)) {
                        found = new Boolean(true);
                        
                    }           
                    return text;
                });
                
            });

        }).then(function () {
            if (found == false) {
                expect(false).toBe(true, 'Email with ref number: ' + LenderRefNo + ' and Subject text:' + subtext + ' NOT FOUND!!');
                
            }
            return found;
        });
    }

    var OutlookSearchmailNew = function (LenderRefNo, subtext) {

            
            var found = false;
            var EC = protractor.ExpectedConditions;
            var txtSearchboxVisibility = EC.visibilityOf(txtSearchInbox);
            var txtSearchboxClickable = EC.elementToBeClickable(txtSearchInbox);
            var txfindVisibility = EC.visibilityOf(txfind);
            browser.wait(EC.and(txtSearchboxVisibility, txtSearchboxClickable), 65000, 'Waiting for element to become visible').then(() => {
                
                txtSearchInbox.click();
                
            }, (error) => {
                expect(true).toBe(false, "EmailSerachtextbox is not visible");
            })
    
                
            browser.wait(EC.and(txfindVisibility), 55000, 'Waiting for field to be visible to enter text').then(() => {
            txfind.sendKeys(LenderRefNo);        
            
            CustomLib.WaitforElementVisible(imgSearch);
            return imgSearch.click().then(function () {   
               
                browser.sleep(5000);            
                element.all(by.css('._lvv_W.customScrollBar.scrollContainer')).each(function (searchresult, indx) {
            return searchresult.getText().then(function (text) {
                       counter++;
                       console.log("Attempt to check email : " + counter); 
                        
                        if (text.includes(subtext)) {  
                            found = true;
                            console.log("Search Result : "+ found);
                            console.log(text);
                            
                        }
                        return text;
                    });
    
                });    
    
                }).then (function(){
    
                     if (found != true && counter < 10) {
                          
                        console.log("Search Result : "+ found);
                        CustomLib.WaitNClick(exitSearch);
                        OutlookSearchmailNew(LenderRefNo, subtext);
                      
                            }

                                                               
                    return found; 
                })
            }, (error) => {
                expect(false).toBe(true, 'Email with ref number: ' + LenderRefNo + ' and Subject text:' + subtext + ' NOT FOUND!!');
            })    
    }
    
    this.OutlookSearchPINmail = function (LenderRefNo, subtext) {

            
        var EC = protractor.ExpectedConditions;
        var txtSearchboxVisibility = EC.visibilityOf(txtSearchInbox);
        var txtSearchboxClickable = EC.elementToBeClickable(txtSearchInbox);
        var txfindVisibility = EC.visibilityOf(txfind);
        browser.wait(EC.and(txtSearchboxVisibility, txtSearchboxClickable), 5000, 'Waiting for element to become visible').then(() => {
            
            txtSearchInbox.click();
            
        }, (error) => {
            expect(true).toBe(false, "EmailSerachtextbox is not visible");
        })

                  
        browser.wait(EC.and(txfindVisibility), 5000, 'Waiting for field to be visible to enter text').then(() => {
        txfind.sendKeys(LenderRefNo);        
        
        CustomLib.WaitforElementVisible(imgSearch);
        imgSearch.click().then(function () {   
           
        browser.sleep(5000);            
        element.all(by.css('._lvv_W.customScrollBar.scrollContainer')).each(function (searchresult, indx) {
        searchresult.getText().then(function (text) {
                    
                    if (text.includes(subtext) == false) {  
                       var flag = false;
                        console.log("Search Result : "+ flag);
                        console.log("Mail not found as exoected!!");
                        expect(true).toBe(true, 'Email with ref number: ' + LenderRefNo + ' and Subject text:' + subtext + ' IS NOT FOUND!!');
                    }

                    else {
                        if (flag !==false){
                        console.log(text);
                        expect(false).toBe(true, 'Email with ref number: ' + LenderRefNo + ' and Subject text:' + subtext + ' IS FOUND!!');
                        }
                    }
                    
                });

            });    

            })
        }, (error) => {
            expect(false).toBe(true, 'Email with ref number: ' + LenderRefNo + ' and Subject text:' + subtext + ' IS FOUND!!');
        })    
}


var OutlookSearchEmail = function (LenderRefNo, subtext) {
       
    var found = false;
    var EC = protractor.ExpectedConditions;
    var txtSearchboxVisibility = EC.visibilityOf(txtSearchInbox);
    var txtSearchboxClickable = EC.elementToBeClickable(txtSearchInbox);
    var txfindVisibility = EC.visibilityOf(txfind);
    browser.wait(EC.and(txtSearchboxVisibility, txtSearchboxClickable), 5000, 'Waiting for element to become visible').then(() => {
        
        txtSearchInbox.click();
        
    }, (error) => {
        expect(true).toBe(false, "EmailSerachtextbox is not visible");
    })

        
    browser.wait(EC.and(txfindVisibility), 5000, 'Waiting for field to be visible to enter text').then(() => {
    txfind.sendKeys(LenderRefNo);        
    
    CustomLib.WaitforElementVisible(imgSearch);
    return imgSearch.click().then(function () {   
       
        browser.sleep(5000);            
        element.all(by.css('._lvv_W.customScrollBar.scrollContainer')).each(function (searchresult, indx) {
    return searchresult.getText().then(function (text) {
                if (counter == 11)  {
                    counter = 0;
                }

               else { 
               counter++;
               console.log("Attempt to check " + subtext + " email : " + counter); 
                
                  if (text.includes(subtext)) {  
                    found = true;
                    console.log("Search Result : "+ found);
                    counter = 0;
                    console.log(text);
                                        
                   }
               
                return text;
            }  
            });
            
        });    

        }).then (function(){

             if (found != true && counter<= 10) {
                  
                console.log("Search Result : "+ found);
                CustomLib.WaitNClick(exitSearch);
                OutlookSearchEmail(LenderRefNo, subtext);

                if (found != true && counter == 10) {
                    expect(false).toBe(true, 'Email with ref number: ' + LenderRefNo + ' and Subject text:' + subtext + ' NOT FOUND!!');
                }
               
             }
                                                       
            return found; 
        })
    }, (error) => {
        expect(false).toBe(true, 'Search Text field is not visible');
    })    
}


    this.WaitUntilsearchResultAppears = function (LenderRefNo, subtext) {
    counter = 0;
    browser.sleep(OutlookSearchEmail(LenderRefNo, subtext), 30000); 
    }

      
            
    
    this.VerifyCancellationEmail = function (LenderRefNo) {
        CustomLib.WaitforElementVisible(txtSearchInbox);
        txtSearchInbox.click();
        txtSearchInbox.sendKeys(LenderRefNo);
        CustomLib.WaitforElementVisible(imgSearch);
        imgSearch.click().then(function () {
            CustomLib.WaitforElementVisible(SubjectLine);

            SubjectLine.getText().then(function (txt) {

                expect(txt).toContain("Deal Cancelled");
                expect(txt).toContain(LenderRefNo);

            })

        })

    }
    this.VerifyLenderAmendmentsEmail = function (LenderRefNo) {
        CustomLib.WaitforElementVisible(txtSearchInbox);
        txtSearchInbox.click();
        txtSearchInbox.sendKeys(LenderRefNo);
        CustomLib.WaitforElementVisible(imgSearch);
        imgSearch.click().then(function () {
            CustomLib.WaitforElementVisible(SubjectLine);

            SubjectLine.getText().then(function (txt) {

                expect(txt).toContain("Amendment(s)");
                expect(txt).toContain(LenderRefNo);

            })

        })

    }
    this.VerifyReactivationEmail = function (LenderRefNo) {
        CustomLib.WaitforElementVisible(txtSearchInbox);
        txtSearchInbox.click();
        txtSearchInbox.sendKeys(LenderRefNo);
        CustomLib.WaitforElementVisible(imgSearch);
        imgSearch.click().then(function () {
            CustomLib.WaitforElementVisible(SubjectLine);
            SubjectLine.getText().then(function (txt) {

                expect(txt).toContain("Deal Reactivated");
                expect(txt).toContain(LenderRefNo);

            })

        })

    }
    this.VerifyNewDealEmail = function (LenderRefNo) {


        CustomLib.WaitforElementVisible(txtSearchInbox);
        txtSearchInbox.click();
        txtSearchInbox.sendKeys(LenderRefNo);
        CustomLib.WaitforElementVisible(imgSearch);
        imgSearch.click().then(function () {
            CustomLib.WaitforElementVisible(SubjectLine);

            SubjectLine.getText().then(function (txt) {

                expect(txt).toContain("New Deal");
                expect(txt).toContain(LenderRefNo);
            })
        })
    }

    this.VerifyNewNoteEmail = function (LenderRefNo) {
        CustomLib.WaitforElementVisible(txtSearchInbox);
        txtSearchInbox.click();
        txtSearchInbox.sendKeys(LenderRefNo);
        CustomLib.WaitforElementVisible(imgSearch);
        imgSearch.click().then(function () {
            CustomLib.WaitforElementVisible(SubjectLine);
            SubjectLine.getText().then(function (txt) {
                expect(txt).toContain("New Note");
                expect(txt).toContain(LenderRefNo);

            })

        })
    }


   


    this.OutlookLogOut = function () {
        element(by.css('._ho2_2._ho2_4.ms-fwt-r.ms-fcl-ns.ms-bcl-nl.o365button')).click();

        btnSignOut.click();

    }

this.VerifyEmailOutlook = function (mailSubject, LenderRefNo) {
    counter = 0;
    WaitUntilEmailFound(mailSubject, LenderRefNo);
}

var WaitUntilEmailFound = function (mailSubject, LenderRefNo) {
    if (counter < 20) {
        counter++;
        console.log('Email search trial: ', counter);
        element.all(by.xpath('//*[@id="primaryContainer"]//button[@class=\'_n_Y4 o365button\' and @style=\'display: none;\']')).count().then(function (countSearchResult) {   
        if (countSearchResult = 0) {
                    CustomLib.WaitNClick(by.xpath('//*[@id="primaryContainer"]//button[@class=\'_n_Y4 o365button\']'));
                    browser.sleep(1500);                 
            }});
            var found = new Boolean();
            var EC = protractor.ExpectedConditions;
            var txtSearchboxVisibility = EC.visibilityOf(txtSearchInbox);
            var txtSearchboxClickable = EC.elementToBeClickable(txtSearchInbox);
            var txtInSearchBox =  element(by.xpath('//*[@id="primaryContainer"]//form/div/input'));
            browser.wait(EC.and(txtSearchboxVisibility, txtSearchboxClickable), 65000, 'Waiting for element to become visible').then(() => {   
                txtSearchInbox.click(); 
                CustomLib.WaitNClick(txtInSearchBox);
                txtInSearchBox.sendKeys(LenderRefNo);
                browser.sleep(1500);   
                CustomLib.WaitforElementVisible(imgSearch);
                imgSearch.click().then(function () {
                browser.sleep(1500);
                return imgSearch.click().then(function () {            
                    browser.sleep(1500);            
                    element.all(by.css('._lvv_W.customScrollBar.scrollContainer')).each(function (searchresult) {
                        searchresult.getText().then(function (text) {
                            if (text.includes(LenderRefNo) && text.includes(mailSubject)) {
                                found = new Boolean(true);
                            }
                            return text;
                        });
                    });
                }).then(function () {
                    if (found == false)  { 
                        if(counter<20)
                        {
                            CustomLib.WaitNClick(exitSearch);
                            WaitUntilEmailFound(mailSubject, LenderRefNo);
                        }
                        else{     
                                expect(false).toBe(true, 'Email with ref number: ' + LenderRefNo + ' and Subject text:' + mailSubject + ' NOT FOUND!!');
                            
                        }
                    }
                 
                   // return found;
                });

            })
    
        }, (error) => {
            expect(true).toBe(false, "EmailSerachtextbox is not visible");
        })
    }
    else{
        expect(counter).toBeLessThan(20, "Expected email " + mailSubject + " is not found");
    }
 }

   
};

module.exports = new OutlookInbox();