"use strict";

import {WaitHandler} from './waithandler.utils';
import {ElementFinder,ElementArrayFinder, protractor} from "protractor";

/*
 * author : sudharsan selvaraj
 * created on : 28/10/2017
 */


var browser:any;
var element:any;
var self:Interactions;

export class Interactions extends WaitHandler {

    constructor(browserInstance = protractor.browser) {
        super(browserInstance);
        browser = browserInstance;
        element = browser.element;
        self =this;
    };

    /**
     * Method to click any element using native click. Wait for element clickable before clicking the element.
     * @param {ElementFinder} e
     */

    click(e:ElementFinder):this {
        this.waitForElementClickable(e);
        e.click();
        return this;
    }

    /**
     * Method to clear the value of text boxes(any text based input fields)
     * @param {ElementFinder} e
     */

    clear(e:ElementFinder):this {
        this.waitForElementClickable(e);
        e.clear();
        return this;
    }

    /**
     * Method to clear the value of text boxes(any text based input fields) after clicking the field.
     * @param {ElementFinder} e
     */

    clickAndClear(e:ElementFinder) {
        return this.click(e).clear(e);
    }

    /**
     * Method to enter value for text boxes(any text based input fields)
     * @param {ElementFinder} e
     * @param {string} valueTobeEntered
     */

    setText(e:ElementFinder, valueTobeEntered:string) {
        this.waitForElementClickable(e);
        e.sendKeys(valueTobeEntered);
        return this;
    }


    /**
     * Method to clear and enter value for text boxes(any text based input fields)
     * @param {ElementFinder} e
     * @param {string} valueTobeEntered
     */

    clearAndSetText(e:ElementFinder, valueTobeEntered:string) {
        this.waitForElementClickable(e);
        return this.clear(e).setText(e, valueTobeEntered);
    }

    /**
     * Method to simulate TAB key press event on any given element.
     * @param {ElementFinder} e
     */

    tabOut(e:ElementFinder):this {
        return this.click(e).setText(e, protractor.Key.TAB);
    };


    /**
     * Method to select any checkbox based on the section status.
     * @param {ElementFinder} e
     * @param {boolean} selectionState
     *  if selectionState is `True` - selects if checkbox is not already selected.
     *  if selectionState is `False` - un-selects if checkbox is already selected.
     */

    async toggleCheckBox(e:ElementFinder, selectionState:boolean) {
        var checkBoxAlreadySelected = await e.isSelected();
        if (checkBoxAlreadySelected != selectionState) {
            this.click(e);
        }
    }

    /*--------------- MOUSE EVENTS -----------------*/

    /**
     * Method to simulate Mouse Hover event on any given element.
     * @param {ElementFinder} e
     */

    mouseHover(e:ElementFinder):this {
        this.waitForElementClickable(e);
        browser.actions().mouseMove(e).perform();
        return this;
    };


    /**
     * Method to simulate Drag and drop event on given from and to elements.
     * @param {ElementFinder} fromElement
     * @param {ElementFinder} toElement
     */

    dragAndDrop(fromElement:ElementFinder, toElement:ElementFinder):this {
        this.waitForElementClickable(fromElement);
        this.waitForElementClickable(toElement);
        browser.actions().mouseMove(fromElement).mouseDown().mouseMove(toElement).mouseUp().perform();
        return this;
    };

    /*--------------- JAVASCRIPT EVENTS -----------------*/

    /**
     * Method to make element available into viewport by scrolling.
     * @param {ElementFinder} e
     */

    scrollIntoView(e:ElementFinder) {
        browser.executeScript(" arguments[0].scrollIntoView(true);", e.getWebElement());
    };


    /**
     * Method to trigger click event using Javascript native click method.
     * @param {ElementFinder} e
     */

    jsClick(e:ElementFinder) {
        browser.executeScript("arguments[0].click();", e.getWebElement());
    };

    /**
     * Method to make element available into viewport by scrolling and then click using native Javascript click() method.
     * @param {ElementFinder} e
     */
    scrollIntoViewAndClick(e:ElementFinder) {
        browser.executeScript("arguments[0].scrollIntoView(true);arguments[0].click();", e.getWebElement());
    };

}