"use strict";

import {protractor, ExpectedConditions, ElementFinder} from 'protractor';

/*
 * author : sudharsan selvaraj
 * created on : 28/10/2017
 */

var browser:any;

export class WaitHandler {

    constructor(browserInstance = protractor.browser) {
        browser = browserInstance;
    }

    public waitTime = 5000;

    waitForElementPresent(_element:ElementFinder, customWaitTime?:number) {
        return this.browserWait(ExpectedConditions.presenceOf(_element), customWaitTime, "Wait timeout after waiting for element to be Present with locator " + _element.locator().toString());
    }

    waitForElementNotPresent(_element:ElementFinder, customWaitTime?:number) {
        return this.browserWait(ExpectedConditions.not(ExpectedConditions.presenceOf(_element)), customWaitTime, "Wait timeout after waiting for element to be not Present with locator " + _element.locator().toString());
    }

    waitForElementVisible(_element:ElementFinder, customWaitTime?:number) {
        return this.browserWait(ExpectedConditions.visibilityOf(_element), customWaitTime, "Wait timeout after waiting for element to be visible with locator " + _element.locator().toString());
    }

    waitForElementNotVisible(_element:ElementFinder, customWaitTime?:number) {
        return this.browserWait(ExpectedConditions.visibilityOf(_element), customWaitTime, "Wait timeout after waiting for element to be not visible with locator " + _element.locator().toString());
    }

    waitForElementClickable(_element:ElementFinder, customWaitTime?:number) {
        return this.browserWait(ExpectedConditions.elementToBeClickable(_element), customWaitTime, "Wait timeout after waiting for element to be visible with locator " + _element.locator().toString());
    }

    waitForElementContainsText(_element:ElementFinder, expectedText:string, customWaitTime?:number) {
        return this.browserWait(ExpectedConditions.textToBePresentInElement(_element, expectedText), customWaitTime, "Wait timeout after waiting for element to Contain text as " + expectedText + " with locator " + _element.locator().toString())
    }

    private browserWait(waitCondition:Function, customWaitTime?:number, timeoutMessage?:any) {
        return browser.wait(waitCondition, customWaitTime | this.waitTime, timeoutMessage);
    }

}