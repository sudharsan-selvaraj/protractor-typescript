"use strict";

import {protractor,by} from 'protractor';
import {ObjectRepository} from '../object_repository/inder.or';
import {Interactions} from "../utils/protractor_utils/interactions.utils";
import {ElementFilterRules} from "../utils/protractor_utils/elementFilter";


/*
 * author : sudharsan selvaraj
 * created on : 28/10/2017
 */

var browser:any;
var element:any;
var empty;
export class AngularHomePO extends ObjectRepository {

    public elementInteractions:Interactions;
    public elementFilerRules:ElementFilterRules;

    constructor(browserInstance = protractor.browser) {
        super(browserInstance);
        browser = browserInstance;
        element = browser.element;

        this.elementInteractions = new Interactions(browser);
        this.elementFilerRules = new ElementFilterRules(browser);
    }

    addNewItem(value:any) {
        this.elementInteractions.setText(this.angularPageOR.todo_textbox, value)
            .click(this.angularPageOR.add_button);
        return this;
    }

    clickAddButton() {
        this.elementInteractions.click(this.angularPageOR.add_button);
    }

    getAllListItems() {
        return this.angularPageOR.todoList.getText();
    }

    getItem(item) {
        return this.angularPageOR.todoList.filter(this.elementFilerRules.textEqualsFilter(empty,item)).first();
    }

    getItemClassNames(item) {
        return this.getItem(item).element(by.css("span")).getAttribute("class");
    }

    getCompletedListItem() {
        var completedItems = this.angularPageOR.todoList
            .filter(this.elementFilerRules.checkedFilter(element(by.css("input"))));
        return completedItems.getText();
    }

    checkItemInTodoList(item?:any) {
        this.elementInteractions.toggleCheckBox(this.getItem(item).element(by.css("input")),true);
    }

}
