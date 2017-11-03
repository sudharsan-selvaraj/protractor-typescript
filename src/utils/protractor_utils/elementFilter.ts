'use strict';

import {protractor, ElementFinder} from 'protractor';

/*
 * author : sudharsan selvaraj
 * created on : 28/10/2017
 */

var element:any;

export class ElementFilterRules {

    constructor(browserInstance = protractor.browser) {
        element = browserInstance.element;
    };


    displayFilter(e:ElementFinder):any {
        return e.isDisplayed();
    }

    checkedFilter(childElement?:ElementFinder) {
        return function (e:ElementFinder) {
            return getElement(e, childElement).isSelected();
        }
    }

    textEqualsFilter(childElement?:ElementFinder, expectedText?:any) {
        return function (e:ElementFinder) {
            return getElement(e, childElement).getText().then(equalFilter(expectedText));
        };
    }

    textContainsFilter(childElement?:ElementFinder, expectedText?:any) {
        return function (e:ElementFinder) {
            return getElement(e, childElement).getText().then(containsFilter(expectedText));
        };
    }

}

let equalFilter = function (expectedValue:any) {
    return function (actualValue) {
        return expectedValue == actualValue;
    }
};

let containsFilter = function (expectedValue:any) {
    return function (actualValue) {
        return expectedValue.indexOf(actualValue) >= 0;
    }
};

let getElement = function (parent:ElementFinder, child?:ElementFinder) {
    return !child ? parent : parent.element(child.locator());
};