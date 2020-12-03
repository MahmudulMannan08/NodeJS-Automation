'use strict';
var NeedHelp = function () {
    var lnkNeedHelp = element(by.css('.needHelp'));

    this.VerifyNeedHelpPage = function () {

        var lnk1 = element(by.cssContainingText('a', "Frequently Asked Questions"));
        var lnk2 = element(by.cssContainingText('a', "LLC Unity User Guide"));



        this.VerifyNeedHelpPage = function () {
            expect(lnk1.isPresent()).toBe(true, "Frequently Asked Questions link is present.");
            expect(lnk2.isPresent()).toBe(true, "LLC Unity User Guide link is present.");


        }
    }

    this.VerifyNeedHelpLink = function () {
        expect(lnkNeedHelp.isPresent()).toBe(true, 'Need Help link is not present');
       
    }

};


module.exports = new NeedHelp();