'use strict';
var testData = require('../testData/RunSetting.js');
var fs = require('fs');
const { browser } = require('protractor');
var limit = 500;
var counter = 0;

var Env = testData.data.Global.ENVIRONMENT.value;
var CustomeLibrary = function () {

    this.WaitForElementPresent = function (elem) {
        var until = protractor.ExpectedConditions;
        browser.wait(until.presenceOf(elem), 45000, 'Element taking too long to appear in the DOM');
    }
       
    this.DeleteFile = function (path) {
        fs.unlink(path, function (error) {
            if (error) {
                throw error;
            }
            else {
                console.log("Deleted file at", path)
            }
        });
    }

    this.GenerateRandomEmailAdd = function () {
        var string = '';
        var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        for (var i = 0; i < 7; i++) {
            string += letters.charAt(Math.floor(Math.random() * letters.length));
        }
        return string + "@" + string + '.com'
    }

    this.CloseOpenDoc2 = function (indx) {
        browser.getAllWindowHandles().then(function (handles) {
            browser.driver.switchTo().window(handles[indx]);
            browser.driver.close();
            browser.sleep(2000);
        });
    }

    this.ZoomOut = function () {
        browser.actions().keyDown(protractor.Key.COMMAND).sendKeys(protractor.Key.SUBTRACT).perform();
        browser.actions().keyDown(protractor.Key.COMMAND).sendKeys(protractor.Key.SUBTRACT).perform();
        browser.actions().keyDown(protractor.Key.COMMAND).sendKeys(protractor.Key.SUBTRACT).perform();
        browser.sleep(2000)
    }

    this.ConvertToLowerCase = function () {

    }

    this.SwitchToiFrame = function () {
        var driver = browser.driver;
        var loc = by.tagName('iframe');
        var el = driver.findElement(loc);
        if (!el.isPresent()) { browser.sleep(4000) }
        browser.switchTo().frame(el);
    }

    this.SendTabEnter=function(i){
        for (let index = 0; index < i; index++) {
            browser.actions().sendKeys(protractor.Key.TAB);
        }
        browser.actions().sendKeys(protractor.Key.ENTER);
    }

    this.SwitchTab = function (i) {
        browser.getAllWindowHandles().then(function (handles) {
            browser.switchTo().window(handles[i]);
            browser.sleep(2000);
        });
    }

 


    this.navigateToWindow = function (windowTitle, windowCount) {
        var isWindowPresent = false;
        var waitForWindow = function () {
            return browser.getAllWindowHandles().then(function (handles) {
                return handles.length == windowCount
            })
        }
        return browser.wait(waitForWindow, 25000).then(function () {
            browser.getAllWindowHandles().then(function (handles) {
                handles.forEach(function (handle) {
                    browser.driver.switchTo().window(handle).then(function () {
                        browser.getTitle().then(function (title) {
                            console.log("fdg " + title);
                            browser.getCurrentUrl().then(function(url)
                            {
                                console.log("Url  " + url);
                            })
                            if (title == windowTitle) {
                                browser.driver.manage().window(windowTitle).maximize();
                                  isWindowPresent = true;
                                return
                            }
                        });
                    });
                });
            })
            if (!isWindowPresent) {
                expect(isWindowPresent).toBe(false, "Required window" + windowTitle + " is not present to navigate, please check")
            } 
        })
    
    }

    this.navigateToWindowTitleNotMatch = function (windowTitle, windowCount) {
        var waitForWindow = function () {
            return browser.getAllWindowHandles().then(function (handles) {
                console.log("No of handles " + handles.length);
                return handles.length == windowCount
            })
        }
        return browser.wait(waitForWindow, 25000).then(function () {
            browser.getAllWindowHandles().then(function (handles) {
                handles.forEach(function (handle) {
                    browser.driver.switchTo().window(handle).then(function () {
                        browser.getTitle().then(function (title) {
                            console.log("fdg " + title);
                            browser.getCurrentUrl().then(function(url)
                            {
                                console.log("Url  " + url);
                            })
                         
                            if (title != windowTitle) {
                                return
                            }
                        });
                    });
                });
            })
        })
    
    }

    
    this.navigateToWindowWithUrlContains = function (URLContains, windowCount) {
        var isWindowPresent = false;
        var waitForWindow = function () {
            return browser.getAllWindowHandles().then(function (handles) {
                return handles.length == windowCount
            })
        }
        return browser.wait(waitForWindow, 25000).then(function () {
            browser.getAllWindowHandles().then(function (handles) {
                handles.forEach(function (handle) {
                    browser.driver.switchTo().window(handle).then(function () {
                        browser.getCurrentUrl().then(function (url) { 
                            if (url.includes(URLContains)) {
                                
                                  isWindowPresent = true;
                                return
                            }
                        });
                    });
                });
            })
            if (!isWindowPresent) {
                expect(isWindowPresent).toBe(false, "Required window" + URLContains + " is not present to navigate, please check")
            } 
        })
    
    }


    this.OpenNewTab = function (i) {
        //browser.sleep(5000);
        browser.executeScript('window.open()');   
        
    }

    

    this.CloseTab = function () {
        browser.getAllWindowHandles().then(function (handles) {
            if (handles.length >= 1){
            browser.switchTo().window(handles[1]).then(function () { browser.close() })
            browser.switchTo().window(handles[0])
            }
            else{
                console.log("Closetab call ignored as only 1 window open")
            }
        });
    }

    this.CloseTab2 = function (i) {
        browser.getAllWindowHandles().then(function (handles) {
            if(handles.length >= i){
            browser.switchTo().window(handles[i]).then(function () { browser.close() })
            browser.switchTo().window(handles[i - 1])
            }
            else{
                console.log("Closetab2 called failed as window "+ i + " not found");
            }
        });
    }

    this.closeWindow = function (windowcloseTitle) {
        browser.getAllWindowHandles().then(function (handles) {
            handles.forEach(function (handle) {
                browser.driver.switchTo().window(handle).then(function () {
                    browser.getTitle().then(function (title) {
                        if (title == windowcloseTitle) {
                            browser.close();
                            return;
                        }   
                    });
                 });
            });
        })
    
    }

    this.closeWindowTitleNotMatch = function (windowcloseTitle) {
        browser.getAllWindowHandles().then(function (handles) {
            handles.forEach(function (handle) {
                browser.driver.switchTo().window(handle).then(function () {
                    browser.getTitle().then(function (title) {
                        if (title != windowcloseTitle) {
                            browser.close();
                            return;
                        }   
                    });
                 });
            });
        })
    
    }

    this.closeWindowUrlContains = function (URLcontains) {
        browser.getAllWindowHandles().then(function (handles) {
            handles.forEach(function (handle) {
                browser.driver.switchTo().window(handle).then(function () {
                    browser.getCurrentUrl().then(function (url) {
                        if (url.includes(URLcontains)) {
                            browser.close();
                            return;
                        }   
                    });
                 });
            });
        })
    
    }

    this.closeWindowUrlContainsWithCount = function (URLcontains,windowCount ) {
        var waitForWindow = function () {
            return browser.getAllWindowHandles().then(function (handles) {
                return handles.length == windowCount
            })
        }
        browser.getAllWindowHandles().then(function (handles) {
            handles.forEach(function (handle) {
                browser.driver.switchTo().window(handle).then(function () {
                    browser.getCurrentUrl().then(function (url) {
                        if (url.includes(URLcontains)) {
                            browser.close();
                            return;
                        }   
                    });
                 });
            });
        })
    
    }

   

    this.GenerateUniqueAutomationNumber = function () {
        var now = new Date();
        var AutomationNumber = Env + now.getFullYear() + (now.getMonth() + 1) + now.getDay() + now.getHours() + now.getMinutes() + now.getSeconds();
        return AutomationNumber;
    };

    this.ScrollToTop = function () {
        var x = element(by.id('totalItemsCount'));
        browser.executeScript(function (x) { x.scrollIntoViewIfNeeded(); }, x.getWebElement());
        browser.sleep(2000)
    }

    this.ScrollTableRow = function (i) {
        var tblEndList = element(by.tagName('tbody'));
        tblEndList.all(by.tagName('tr')).then(function (rows) {
            rows[i].all(by.tagName('td')).then(function (cells) {
                cells[1].getText().then(function (value) {
                    var x = element(by.cssContainingText('a', value))
                    browser.executeScript(function (x) { x.scrollIntoViewIfNeeded(); }, x.getWebElement());
                })
            })
        })
    }

    this.GetFilePathToUpload = function (folderLoc, fileName) {
        var path = require('path');
        var absolutePath = path.resolve(folderLoc, fileName);
        console.log(absolutePath)
        return absolutePath;
    };

    this.getRandomString = function (length) {
        var string = '';
        var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        for (var i = 0; i < length; i++) {
            string += letters.charAt(Math.floor(Math.random() * letters.length));
        }
        return string;
    }

    this.getRandomNumber = function (length) {
        var string = '';
        var letters = '1234567890'
        for (var i = 0; i < length; i++) {
            string += letters.charAt(Math.floor(Math.random() * letters.length));
        }
        return string;
    }

    this.getRandomAlphaNumericString = function (length) {
        var string = '';
        var letters = '!@#$%^&*()abcdefghijklmnopqrstuvwxyz'
        for (var i = 0; i < length; i++) {
            string += letters.charAt(Math.floor(Math.random() * letters.length));
        }
        return string;
    }

    this.CancelIconDilogBox = function () {
        iconCancelDlgBox.click();
        browser.sleep(5000);
    }

    this.getRandomNumber = function (length) {
        var string = '';
        var numbers = '156789345627896086308'
        for (var i = 0; i < length; i++) {
            string += numbers.charAt(Math.floor(Math.random() * numbers.length));
        }
        return string;
    }

    this.scrollIntoView = function (el) {
        browser.executeScript(function (el) {
            el.scrollIntoView({
                behavior: 'auto',
                block: 'center',
                inline: 'center'
            });
        }
            , el.getWebElement()
        );
    }

    this.elementwait = function (el){
        browser.manage().timeouts().implicitlyWait(0);
        browser.wait(function () {
            browser.sleep(2000);
            return el
                .then(
                    function (isDisplayed) {
                        return isDisplayed;
                    },
                    function (error) {
                        return false
                    });
        }, 200 * 1000);
    }

    this.ConvertDate = function (date) {
        var x = date.split('/')
        var day = x[1]
        if (day <= 9) { day = day.charAt(1) }
        var month = x[0];
        var year = x[2];
        var month2
        switch (month) {
            case '01': month2 = 'Jan'; break;
            case '02': month2 = 'Feb'; break;
            case '03': month2 = 'Mar'; break;
            case '04': month2 = 'Apr'; break;
            case '05': month2 = 'May'; break;
            case '06': month2 = 'Jun'; break;
            case '07': month2 = 'Jul'; break;
            case '08': month2 = 'Aug'; break;
            case '09': month2 = 'Sept'; break;
            case '10': month2 = 'Oct'; break;
            case '11': month2 = 'Nov'; break;
            case '12': month2 = 'Dec'; break;
        }
        return month2 + " " + day + ", " + year
    }

    this.DatePicker = function () {
        var ClosingDate = new Date();
        var dd = ClosingDate.getDate() - 1;
        var mm = ClosingDate.getMonth() + 1; //January is 0!
        var yyyy = ClosingDate.getFullYear();
        var weekday = new Array(7);
        weekday[0] = "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";

        var day = weekday[ClosingDate.getDay()];
        if (dd > 30) {
            mm = mm + 1;
        }

        if (day == "Saturday") {
            dd = 2 + dd

        }
        if (day = "Sunday") {
            dd = 1 + dd
        }

        if (dd < 10) {
            dd = '0' + dd
        }

        if (mm < 10) {
            mm = '0' + mm
        }
        if (dd > 30) {
            dd = dd - 4
            if (day == "Saturday") {
                dd = 2 + dd

            }
            if (day = "Sunday") {
                dd = 1 + dd
            }
        }
        return ClosingDate = mm + '/' + dd + '/' + yyyy;
    };

    this.DatePicker2 = function (i) {
        var ClosingDate = new Date();
        var dd = ClosingDate.getDate() - 1;
        var mm = ClosingDate.getMonth() + 1; //January is 0!
        var yyyy = ClosingDate.getFullYear() - i;
        var weekday = new Array(7);
        weekday[0] = "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";
        var day = weekday[ClosingDate.getDay()];
        if (dd > 30) {
            mm = mm + 1;
        }

        if (day == "Saturday") {
            dd = 2 + dd

        }
        if (day = "Sunday") {
            dd = 1 + dd
        }

        if (dd < 10) {
            dd = '0' + dd
        }

        if (mm < 10) {
            mm = '0' + mm
        }
        if (dd > 30) {
            dd = dd - 4
            if (day == "Saturday") {
                dd = 2 + dd

            }
            if (day = "Sunday") {
                dd = 1 + dd
            }
        }

        return ClosingDate = mm + '/' + dd + '/' + yyyy;


    };

    //@29
    this.DatePicker3 = function (i) {
        var ClosingDate = new Date();
        var dd = ClosingDate.getDate() - 1;
        var mm = ClosingDate.getMonth() + 1 + i; //January is 0!
        var yyyy = ClosingDate.getFullYear();
        var weekday = new Array(7);
        weekday[0] = "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";
        var day = weekday[ClosingDate.getDay()];

        if (dd > 30) {
            mm = mm + 1;
        }

        if (day == "Saturday") {
            dd = 2 + dd

        }
        if (day = "Sunday") {
            dd = 1 + dd
        }

        if (dd < 10) {
            dd = '0' + dd
        }

        if (mm < 10) {
            mm = '0' + mm
        }
        if (dd > 30) {
            dd = dd - 4
            if (day == "Saturday") {
                dd = 2 + dd

            }
            if (day = "Sunday") {
                dd = 1 + dd
            }
        }




        return ClosingDate = mm + '/' + dd + '/' + yyyy;


    };

    this.FutureDate = function (i) {

         var mydate = new Date();

         mydate.setDate(mydate.getDate() + i);
        var date = mydate.getDate();
        if (date < 10) { date = '0' + date }
        var month = mydate.getMonth() + 1;
        if (month < 10) { month = '0' + month }

        //console.log(month + '/' + date + '/' + mydate.getFullYear());
        return month + '/' + date + '/' + mydate.getFullYear();
    };

    this.FutureDatenew = function (i) {

          var Today = new Date();
          var CurrentDayofWeek = Today.getDay();

        if (CurrentDayofWeek == 0)          //0 for Sunday
        {
            i=parseInt(i)+1;
        }
        if (CurrentDayofWeek == 6)          //0 for Sunday
        {
            i=parseInt(i)+2;
        }

          var mydate = new Date(new Date().getTime()+(parseInt(i)*24*60*60*1000));
         // mydate.setDate(mydate.getDate() + i);
          var date = mydate.getDate();
          //console.log("$$$$$$  " +date)
          if (date < 10) { date = '0' + date }
          var month = mydate.getMonth() + 1;
          if (month < 10) { month = '0' + month } 
          
          return mydate.getFullYear() + "-"+month +  "-" + date ;
      };

   // Will Return date as January 01, 02 and expect input as yyyy-mm-dd
   this.DateConversion = function (inputclosingdate) {
    var month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var dateClosingDate = inputclosingdate.split("-");
    return month[(dateClosingDate[1] - 1)] + " " + dateClosingDate[2] + ", " + dateClosingDate[0];
}

   // Will Return date as MM/DD/YYYY and expect input as yyyy-mm-dd
   this.DateConversionMMDDYYYYY = function (inputclosingdate) {
    var dateClosingDate = inputclosingdate.split("-");
    return dateClosingDate[1] + "/ " + dateClosingDate[2] + "/" + dateClosingDate[0];
}

   // Will Return date as MM/DD/YYYY and expect input as yyyy-mm-dd
   this.DateConversionMMDDYYYYY2 = function (inputclosingdate) {
    var dateClosingDate = inputclosingdate.split("-");
    return dateClosingDate[1] + "/" + dateClosingDate[2] + "/" + dateClosingDate[0];
}
    this.FutureDate = function () {
        var today = new Date();
        var futureDate = new Date(today.getFullYear(),today.getMonth(),today.getDate() + 2);
        var CurrentYear = futureDate.getFullYear();
        var CurrentMonth = futureDate.getMonth() + 1;
        var CurrentDate = futureDate.getDate();
        var CurrentDayofWeek = futureDate.getDay();

        if (CurrentDayofWeek == 0)          //0 for Sunday
        {
            if ((CurrentMonth == 1) || (CurrentMonth == 3) || (CurrentMonth == 5) || (CurrentMonth == 7) || (CurrentMonth == 8) || (CurrentMonth == 10) || (CurrentMonth == 12)) {
                if (CurrentDate < 31) {
                    CurrentDate = CurrentDate + 1;
                }
                if (CurrentDate == 31) {
                    if (CurrentMonth < 12) {
                        CurrentMonth = CurrentMonth + 1;
                    }
                    if (CurrentMonth == 12) {
                        CurrentMonth = 1;
                        CurrentYear = CurrentYear + 1;
                    }

                    CurrentDate = 1;
                }
            }
            if ((CurrentMonth == 4) || (CurrentMonth == 6) || (CurrentMonth == 9) || (CurrentMonth == 11))  //30 day months
            {
                if (CurrentDate < 30) {
                    CurrentDate = CurrentDate + 1;
                }
                if (CurrentDate == 30) {
                    if (CurrentMonth < 12) {
                        CurrentMonth = CurrentMonth + 1;
                    }
                    if (CurrentMonth == 12) {
                        CurrentMonth = 1;
                        CurrentYear = CurrentYear + 1;
                    }

                    CurrentDate = 1;
                }
            }
            if (CurrentMonth == 2)  //February - leap year or not
            {
                if (((CurrentYear % 4 == 0) && (CurrentYear % 100 != 0)) || (CurrentYear % 400 == 0))  //Leap year
                {
                    if (CurrentDate < 29) {
                        CurrentDate = CurrentDate + 1;
                    }
                    if (CurrentDate == 29) {
                        CurrentDate = 1;
                        CurrentMonth = 3;
                    }
                }
                if (!((CurrentYear % 4 == 0) && (CurrentYear % 100 != 0)) || !(CurrentYear % 400 == 0)) {
                    if (CurrentDate < 28) {
                        CurrentDate = CurrentDate + 1;
                    }
                    if (CurrentDate == 28) {
                        CurrentDate = 1;
                        CurrentMonth = 3;
                    }
                }
            }

        }
        if (CurrentDayofWeek == 6)          //6 for Saturday
        {
            if ((CurrentMonth == 1) || (CurrentMonth == 3) || (CurrentMonth == 5) || (CurrentMonth == 7) || (CurrentMonth == 8) || (CurrentMonth == 10) || (CurrentMonth == 12)) {
                if (CurrentDate < 30) {
                    CurrentDate = CurrentDate + 2;
                }
                if (CurrentDate == 30) {
                    if (CurrentMonth < 12) {
                        CurrentMonth = CurrentMonth + 1;
                    }
                    if (CurrentMonth == 12) {
                        CurrentMonth = 1;
                        CurrentYear = CurrentYear + 1;
                    }

                    CurrentDate = 1;
                }
                if (CurrentDate == 31) {
                    if (CurrentMonth < 12) {
                        CurrentMonth = CurrentMonth + 1;
                    }
                    if (CurrentMonth == 12) {
                        CurrentMonth = 1;
                        CurrentYear = CurrentYear + 1;
                    }

                    CurrentDate = 2;
                }
            }
            if ((CurrentMonth == 4) || (CurrentMonth == 6) || (CurrentMonth == 9) || (CurrentMonth == 11))  //30 day months
            {
                if (CurrentDate < 29) {
                    CurrentDate = CurrentDate + 2;
                }
                if (CurrentDate == 29) {
                    if (CurrentMonth < 12) {
                        CurrentMonth = CurrentMonth + 1;
                    }
                    if (CurrentMonth == 12) {
                        CurrentMonth = 1;
                        CurrentYear = CurrentYear + 1;
                    }

                    CurrentDate = 1;
                }
                if (CurrentDate == 30) {
                    if (CurrentMonth < 12) {
                        CurrentMonth = CurrentMonth + 1;
                    }
                    if (CurrentMonth == 12) {
                        CurrentMonth = 1;
                        CurrentYear = CurrentYear + 1;
                    }

                    CurrentDate = 2;
                }
            }
            if (CurrentMonth == 2)  //February - leap year or not
            {
                if (((CurrentYear % 4 == 0) && (CurrentYear % 100 != 0)) || (CurrentYear % 400 == 0))  //Leap year
                {
                    if (CurrentDate < 28) {
                        CurrentDate = CurrentDate + 2;
                    }
                    if (CurrentDate == 28) {
                        CurrentDate = 1;
                        CurrentMonth = 3;
                    }
                    if (CurrentDate == 29) {
                        CurrentDate = 2;
                        CurrentMonth = 3;
                    }
                }
                if (!((CurrentYear % 4 == 0) && (CurrentYear % 100 != 0)) || !(CurrentYear % 400 == 0)) {
                    if (CurrentDate < 27) {
                        CurrentDate = CurrentDate + 2;
                    }
                    if (CurrentDate == 27) {
                        CurrentDate = 1;
                        CurrentMonth = 3;
                    }
                    if (CurrentDate == 28) {
                        CurrentDate = 2;
                        CurrentMonth = 3;
                    }
                }
            }
        }
        if (CurrentDate < 10) {
            CurrentDate = '0' + CurrentDate;
        }

        if (CurrentMonth < 10) {
            CurrentMonth = '0' + CurrentMonth;
        }

        var ClosingDate = CurrentYear + '-' + CurrentMonth + '-' + CurrentDate;
        return ClosingDate;
    }


    this.DatePickerDay = function (i) {
        var ClosingDate = new Date();
        var dd = ClosingDate.getDate() - i;
        var mm = ClosingDate.getMonth() + 1; //January is 0!
        var yyyy = ClosingDate.getFullYear();


        var weekday = new Array(7);
        weekday[0] = "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";

        var day = weekday[ClosingDate.getDay()];

        if (dd > 26) {
            mm = mm + 1;
        }

        if (day == "Saturday") {
            dd = 2 + dd

        }
        if (day = "Sunday") {
            dd = 1 + dd
        }

        if (dd < 10) {
            dd = '0' + dd
        }

        if (mm < 10) {
            mm = '0' + mm
        }
        if (dd > 26) {
            dd = dd - 4
            if (day == "Saturday") {
                dd = 2 + dd

            }
            if (day = "Sunday") {
                dd = 1 + dd
            }
        }

        return ClosingDate = mm + '/' + dd + '/' + yyyy;
    }




    this.HandleAlert = function () {
        try {
            browser.driver.switchTo().alert().then(
                function (alert) {
                    alert.accept();
                    console.log('Alert Found')
                },
                function (err) { }
            );
        }  
        catch (Error) {}   
    }
    this.CheckAlert = function () {
        try {
            browser.switchTo().alert();
            return true;
        }   // try 
        catch (Error) {
            return false;
        }   // catch 

    }

    this.DismissAlert = function () {
        try {

            browser.driver.switchTo().alert().then(
                function (alert) {
                    alert.dismiss();
                    console.log('Alert Found')
                },
                function (err) { }
            );

        }  
        catch (Error) {
            
        }   

    }

    this.GetTableRowCount = function () {

        var tblResultList = element(by.tagName('tbody'));
        return tblResultList.all(by.tagName("tr")).then(function (Rows) {
            var length = (Rows.length) / 2;
            console.log(length)
            return length

        });
    }
    this.ScrollToEnd = function () {

        this.GetTableRowCount().then(function (count) {
            if (count != 0) {
                var ListCount = element(by.id('totalItemsCount'));

                ListCount.getText().then(function (txt) { return parseInt(txt.slice(1, txt.length - 1), 10) }).then(function (counter) {
                    var tblProgramList = element(by.tagName('tbody'))
                    tblProgramList.click();
                    for (var i = 0; i < (counter * 3.5); i++) {
                        browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
                        endMsg.isPresent().then(function (bool) { if (bool) { i = 100000000000000 } })
                    };


                })

            }
        })
        var endMsg = element(by.id('resultsGrid')).element(by.tagName('em'));
        this.ReadRowCount().then(function (count) {
            if (count < limit) {
                expect(endMsg.getText()).toContain(EndListMsg)
            }
            else {
                expect(endMsg.getText()).toContain(EndListMsg2)
            }

        })
    }


    this.ScrollDown = function () {
        browser.executeScript('window.scrollTo(0,10000);')
    }

    this.ScrollUp = function () {
        browser.executeScript('window.scrollTo(10000,0);')
    }
    this.WaitForSpinner = function () {
        browser.wait(function () {
            return element(by.tagName('mat-spinner')).isPresent().then(function (result) { return !result });
        }, 45000);
    }

    this.WaitForSpinnerDisappear = function () {
        browser.wait(function () {
            return element(by.css('.loading-spinner')).isPresent().then(function (result) { return !result });
        }, 65000);
    }

    this.SelectRandomElementArray = function (targetArray) {
        return targetArray[Math.floor(Math.random() * targetArray.length)];
    }

    this.anyTextToBePresentInElement = function (elementFinder) {
        var EC = protractor.ExpectedConditions;
        var hasText = function () {
            return elementFinder.getText().then(function (actualText) {
                return actualText;
            });
        };
        return EC.and(EC.presenceOf(elementFinder), hasText);
    }

    this.WaitNClick = function (elementFinder) {
       this.WaitForSpinnerInvisible();
        var EC = protractor.ExpectedConditions;
        browser.wait(EC.elementToBeClickable(elementFinder), 65000, elementFinder + ' is not found').then(() => {
            browser.sleep(3000);
            elementFinder.click();
        });
        this.WaitForSpinnerInvisible();
    }

    this.WaitForContentToBePresent = function (elementFinder, txt) {
         var EC = protractor.ExpectedConditions;
         browser.wait(EC.textToBePresentInElement(elementFinder, txt), 65000, "Content is not present");
     }

    this.WaitNClickOP = function (elementFinder) {
        var EC = protractor.ExpectedConditions;
        browser.wait(EC.invisibilityOf(element(by.id('divSpinner'))), 65000, 'Spinner is still visible');

        var EC = protractor.ExpectedConditions;
        browser.wait(EC.elementToBeClickable(elementFinder), 65000, elementFinder + ' is not found');
        elementFinder.click();

        browser.wait(EC.invisibilityOf(element(by.id('divSpinner'))), 65000, 'Spinner is still visible');
    }

    this.WaitforElementVisible = function (elementFinder) {
        var EC = protractor.ExpectedConditions;
        browser.wait(EC.visibilityOf(elementFinder), 65000, elementFinder + ' is not visible');
    }

    this.WaitforElementInvisible = function (elementFinder) {
        var EC = protractor.ExpectedConditions;
        browser.wait(EC.invisibilityOf(elementFinder), 65000, elementFinder + ' is still visible');
    }

    this.WaitForSpinnerInvisible = function () {
        browser.wait(function () {
            return element(by.css('.loading-spinner.ng-star-inserted')).isPresent().then(function (result) { return !result });
        }, 95000);
    }

    this.WaitForFadderInvisible = function () {
        browser.wait(function () {
            return element(by.css('.modal fade show')).isPresent().then(function (result) { return !result });
        }, 65000);
    }

    this.WaitForSpinnerInvisibleOP = function () {
        var EC = protractor.ExpectedConditions;
        browser.wait(EC.invisibilityOf(element(by.id('divSpinner'))), 45000, 'Spinner is still visible');
    }

    this.CloseOpenDoc = function () {
        browser.getAllWindowHandles().then(function (handles) {
            browser.driver.switchTo().window(handles[1]);
            browser.driver.close();
            browser.driver.switchTo().window(handles[0]);
            browser.sleep(2000);
            browser.driver.navigate().refresh();
            //browser.actions().sendKeys('%{F4}').perform();
        });
    };

    this.Refreshbrowser = function () {

        browser.sleep(15000);
        browser.driver.navigate().refresh();
        browser.sleep(15000);
        browser.driver.navigate().refresh();
        //browser.actions().sendKeys('%{F4}').perform();
    }

    this.ClosePopup = function () {
        
        browser.wait(function () {
            return element(by.css('.loading-spinner.ng-star-inserted')).isPresent().then(function (result) { return !result });
        }, 65000);

        browser.wait(function () {
            
            browser.sleep(2000);
            return browser.getAllWindowHandles().then(function (handles) {
                if (handles.length > 1) {
                    browser.driver.switchTo().window(handles[1]);
                    browser.sleep(2500);
                    browser.driver.close();
                    browser.driver.switchTo().window(handles[0]);
                    return true;
                }
            });
        }, 65000);
    };

    this.ClosePopupWithWindowTitleNotMatch = function (WindowTitle) {
            browser.sleep(2000);
            return browser.getAllWindowHandles().then(function (handles) {
                handles.forEach(function (handle) {
                    browser.driver.switchTo().window(handle).then(function () {
                        browser.sleep(2500);
                        browser.getTitle().then(function (title) {
                            console.log("uytrrr " + title);
                            if (title != WindowTitle) {
                                browser.close();
                                return;
                            }   
                        });
                     });
                });
            })

    };

  
    this.IsDocPopUpAvailable = function () {
        return browser.getAllWindowHandles().then(function (handles) {
                if (handles.length > 1) {
                    return true;
                }
                else
                {
                    return false;
                }
            });    
    };

    this.CloseEmulator = function () {
        browser.driver.switchTo().defaultContent();
        var btnClose = element(by.css('.modal-header')).element(by.tagName('button'));
        this.WaitNClick(btnClose);
    }

    this.CurrentOrPastDate = function () {

        var Today = new Date();
        var CurrentYear = Today.getFullYear();
        var CurrentMonth = Today.getMonth() + 1;  //0 for January
        var CurrentDate = Today.getDate();
        var CurrentDayofWeek = Today.getDay();

        if (CurrentDayofWeek == 0)          //0 for Sunday
        {
            if (CurrentDate > 2) {
                CurrentDate = CurrentDate - 2;
            }
            if (CurrentDate == 2) {
                if (CurrentMonth > 1) {
                    CurrentMonth = CurrentMonth - 1;
                }
                if (CurrentMonth == 1) {
                    CurrentMonth = 12;
                    CurrentYear = CurrentYear - 1;
                }

                if ((CurrentMonth == 1) || (CurrentMonth == 3) || (CurrentMonth == 5) || (CurrentMonth == 7) || (CurrentMonth == 8) || (CurrentMonth == 10) || (CurrentMonth == 12))  //31 day months
                {
                    CurrentDate = 31;
                }
                if ((CurrentMonth == 4) || (CurrentMonth == 6) || (CurrentMonth == 9) || (CurrentMonth == 11))  //30 day months
                {
                    CurrentDate = 30;
                }
                if (CurrentMonth == 2)  //February - leap year or not
                {
                    if (((CurrentYear % 4 == 0) && (CurrentYear % 100 != 0)) || (CurrentYear % 400 == 0))  //Leap year
                    {
                        CurrentDate = 29;
                    }
                    if (!((CurrentYear % 4 == 0) && (CurrentYear % 100 != 0)) || !(CurrentYear % 400 == 0)) {
                        CurrentDate = 28;
                    }
                }
            }
            if (CurrentDate == 1) {
                if (CurrentMonth > 1) {
                    CurrentMonth = CurrentMonth - 1;
                }
                if (CurrentMonth == 1) {
                    CurrentMonth = 12;
                    CurrentYear = CurrentYear - 1;
                }

                if ((CurrentMonth == 1) || (CurrentMonth == 3) || (CurrentMonth == 5) || (CurrentMonth == 7) || (CurrentMonth == 8) || (CurrentMonth == 10) || (CurrentMonth == 12))  //31 day months
                {
                    CurrentDate = 30;
                }
                if ((CurrentMonth == 4) || (CurrentMonth == 6) || (CurrentMonth == 9) || (CurrentMonth == 11))  //30 day months
                {
                    CurrentDate = 29;
                }
                if (CurrentMonth == 2)  //February - leap year or not
                {
                    if (((CurrentYear % 4 == 0) && (CurrentYear % 100 != 0)) || (CurrentYear % 400 == 0))  //Leap year
                    {
                        CurrentDate = 28;
                    }
                    if (!((CurrentYear % 4 == 0) && (CurrentYear % 100 != 0)) || !(CurrentYear % 400 == 0)) {
                        CurrentDate = 27;
                    }
                }
            }
        }
        if (CurrentDayofWeek == 6)          //6 for Saturday
        {
            if (CurrentDate > 1) {
                CurrentDate = CurrentDate - 1;
            }
            if (CurrentDate == 1) {
                if (CurrentMonth > 1) {
                    CurrentMonth = CurrentMonth - 1;
                }
                if (CurrentMonth == 1) {
                    CurrentMonth = 12;
                    CurrentYear = CurrentYear - 1;
                }

                if ((CurrentMonth == 1) || (CurrentMonth == 3) || (CurrentMonth == 5) || (CurrentMonth == 7) || (CurrentMonth == 8) || (CurrentMonth == 10) || (CurrentMonth == 12)) {
                    CurrentDate = 31;
                }
                if ((CurrentMonth == 4) || (CurrentMonth == 6) || (CurrentMonth == 9) || (CurrentMonth == 11)) {
                    CurrentDate = 30;
                }
                if (CurrentMonth == 2) {
                    if (((CurrentYear % 4 == 0) && (CurrentYear % 100 != 0)) || (CurrentYear % 400 == 0))  //Leap year
                    {
                        CurrentDate = 29;
                    }
                    if (!((CurrentYear % 4 == 0) && (CurrentYear % 100 != 0)) || !(CurrentYear % 400 == 0)) {
                        CurrentDate = 28;
                    }
                }
            }
        }
        if (CurrentDate < 10) {
            CurrentDate = '0' + CurrentDate;
        }

        if (CurrentMonth < 10) {
            CurrentMonth = '0' + CurrentMonth;
        }

        var ClosingDate = CurrentYear + '-' + CurrentMonth + '-' + CurrentDate;
        return ClosingDate;
    }

    this.CurrentOrFutureDate = function () {

        var Today = new Date();
        var CurrentYear = Today.getFullYear();
        var CurrentMonth = Today.getMonth() + 1;
        var CurrentDate = Today.getDate();
        var CurrentDayofWeek = Today.getDay();

        if (CurrentDayofWeek == 0)          //0 for Sunday
        {
            if ((CurrentMonth == 1) || (CurrentMonth == 3) || (CurrentMonth == 5) || (CurrentMonth == 7) || (CurrentMonth == 8) || (CurrentMonth == 10) || (CurrentMonth == 12)) {
                if (CurrentDate < 31) {
                    CurrentDate = CurrentDate + 1;
                }
                if (CurrentDate == 31) {
                    if (CurrentMonth < 12) {
                        CurrentMonth = CurrentMonth + 1;
                    }
                    if (CurrentMonth == 12) {
                        CurrentMonth = 1;
                        CurrentYear = CurrentYear + 1;
                    }

                    CurrentDate = 1;
                }
            }
            if ((CurrentMonth == 4) || (CurrentMonth == 6) || (CurrentMonth == 9) || (CurrentMonth == 11))  //30 day months
            {
                if (CurrentDate < 30) {
                    CurrentDate = CurrentDate + 1;
                }
                if (CurrentDate == 30) {
                    if (CurrentMonth < 12) {
                        CurrentMonth = CurrentMonth + 1;
                    }
                    if (CurrentMonth == 12) {
                        CurrentMonth = 1;
                        CurrentYear = CurrentYear + 1;
                    }

                    CurrentDate = 1;
                }
            }
            if (CurrentMonth == 2)  //February - leap year or not
            {
                if (((CurrentYear % 4 == 0) && (CurrentYear % 100 != 0)) || (CurrentYear % 400 == 0))  //Leap year
                {
                    if (CurrentDate < 29) {
                        CurrentDate = CurrentDate + 1;
                    }
                    if (CurrentDate == 29) {
                        CurrentDate = 1;
                        CurrentMonth = 3;
                    }
                }
                if (!((CurrentYear % 4 == 0) && (CurrentYear % 100 != 0)) || !(CurrentYear % 400 == 0)) {
                    if (CurrentDate < 28) {
                        CurrentDate = CurrentDate + 1;
                    }
                    if (CurrentDate == 28) {
                        CurrentDate = 1;
                        CurrentMonth = 3;
                    }
                }
            }

        }
        if (CurrentDayofWeek == 6)          //6 for Saturday
        {
            if ((CurrentMonth == 1) || (CurrentMonth == 3) || (CurrentMonth == 5) || (CurrentMonth == 7) || (CurrentMonth == 8) || (CurrentMonth == 10) || (CurrentMonth == 12)) {
                if (CurrentDate < 30) {
                    CurrentDate = CurrentDate + 2;
                }
                if (CurrentDate == 30) {
                    if (CurrentMonth < 12) {
                        CurrentMonth = CurrentMonth + 1;
                    }
                    if (CurrentMonth == 12) {
                        CurrentMonth = 1;
                        CurrentYear = CurrentYear + 1;
                    }

                    CurrentDate = 1;
                }
                if (CurrentDate == 31) {
                    if (CurrentMonth < 12) {
                        CurrentMonth = CurrentMonth + 1;
                    }
                    if (CurrentMonth == 12) {
                        CurrentMonth = 1;
                        CurrentYear = CurrentYear + 1;
                    }

                    CurrentDate = 2;
                }
            }
            if ((CurrentMonth == 4) || (CurrentMonth == 6) || (CurrentMonth == 9) || (CurrentMonth == 11))  //30 day months
            {
                if (CurrentDate < 29) {
                    CurrentDate = CurrentDate + 2;
                }
                if (CurrentDate == 29) {
                    if (CurrentMonth < 12) {
                        CurrentMonth = CurrentMonth + 1;
                    }
                    if (CurrentMonth == 12) {
                        CurrentMonth = 1;
                        CurrentYear = CurrentYear + 1;
                    }

                    CurrentDate = 1;
                }
                if (CurrentDate == 30) {
                    if (CurrentMonth < 12) {
                        CurrentMonth = CurrentMonth + 1;
                    }
                    if (CurrentMonth == 12) {
                        CurrentMonth = 1;
                        CurrentYear = CurrentYear + 1;
                    }

                    CurrentDate = 2;
                }
            }
            if (CurrentMonth == 2)  //February - leap year or not
            {
                if (((CurrentYear % 4 == 0) && (CurrentYear % 100 != 0)) || (CurrentYear % 400 == 0))  //Leap year
                {
                    if (CurrentDate < 28) {
                        CurrentDate = CurrentDate + 2;
                    }
                    if (CurrentDate == 28) {
                        CurrentDate = 1;
                        CurrentMonth = 3;
                    }
                    if (CurrentDate == 29) {
                        CurrentDate = 2;
                        CurrentMonth = 3;
                    }
                }
                if (!((CurrentYear % 4 == 0) && (CurrentYear % 100 != 0)) || !(CurrentYear % 400 == 0)) {
                    if (CurrentDate < 27) {
                        CurrentDate = CurrentDate + 2;
                    }
                    if (CurrentDate == 27) {
                        CurrentDate = 1;
                        CurrentMonth = 3;
                    }
                    if (CurrentDate == 28) {
                        CurrentDate = 2;
                        CurrentMonth = 3;
                    }
                }
            }
        }
        if (CurrentDate < 10) {
            CurrentDate = '0' + CurrentDate;
        }

        if (CurrentMonth < 10) {
            CurrentMonth = '0' + CurrentMonth;
        }

        var ClosingDate = CurrentYear + '-' + CurrentMonth + '-' + CurrentDate;
        return ClosingDate;
    }
}
module.exports = new CustomeLibrary();