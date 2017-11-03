'use strict';

import {browser} from 'protractor';
import {AngularHomePO} from '../page_objects/angularHome.po';

let dataProvider = require("jasmine-data-provider"), angularTodoPO;

describe(" Test todo list in angular home page ", function () {

    beforeAll(function () {
        browser.get(browser.baseUrl);
        angularTodoPO = new AngularHomePO();
    });

    var itemList = [
        'Create object repository for angular todo page',
        'Create reusable methods in agularPage.PO.ts file',
        'Import PageObject inside specs for creating testcase'
    ];

    describe(" verify add functionality ", function () {
        dataProvider(itemList, function (item) {
            it('enter new item \"' + item + "\" in todo list", function () {
                angularTodoPO.addNewItem(item);
            });

            it('and verify newly added item \"' + item + "\" is saved", function () {
                expect(angularTodoPO.getAllListItems()).toContain(item, "Newly added item is not available in the list")
            });

        });
    });

    describe("verify check functionality ", function () {
        dataProvider(itemList, function (item) {

            it('Check item \"' + item + "\" in todo list", function () {
                angularTodoPO.checkItemInTodoList(item);
            });

            it('and verify item \"' + item + "\" has class name \"done-true\"", function () {
                expect(angularTodoPO.getItemClassNames(item)).toEqual("done-true");
            });

        });
    });

});
