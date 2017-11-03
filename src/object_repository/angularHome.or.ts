'use strict';
 import { by,ElementFinder,ElementArrayFinder,protractor } from 'protractor';

var element:any;

export class AngularHomeOR {

    public todo_textbox:ElementFinder;
    public add_button:ElementFinder;
    public todoList:ElementArrayFinder;

    constructor(browserInstance = protractor.browser){
        element = browserInstance.element;

        this.todo_textbox = element(by.model('todoList.todoText'));
        this.add_button = element(by.css('[value="add"]'));
        this.todoList = element.all(by.repeater('todo in todoList.todos'))
    };


}