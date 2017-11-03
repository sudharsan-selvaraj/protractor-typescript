'use strict';

import {Config} from 'protractor';
import {ReportManager} from "../utils/reports/reportManager"
import {ConfigParser} from "./configParser";


/*
 * author : sudharsan selvaraj
 * created on : 28/10/2017
 *
 *
 *  Below configuration can be used for executing tests in both normal and parallel  mode.
 *
 *  To run in parallel mode pass `--params.parallel "yes"` argument.
 */


let configParams = require("./configurationData.json");

/*
 * Init method will be invokes as soon as the configuration file is loaded.
 *
 * @params {Object} config - default config object.
 *
 * Method will determine on which mode the execution should be done based on `--params.parallel` argument.
 *
 */

let init = function (config) {

    /* parse the command line arguments and store the final params object to a file*/
    ConfigParser.init(config);

    /*
     * By default, configuration object will not have multiCapabilities key.
     *
     * `ConfigParser.isParallelRun()` will return true, if current execution is parallel and only then multiCapabilities option will be added to config object.
     *
     * protractor by default ignores `capabilities` option if `multiCapabilities` is mentioned.
     */

    if (ConfigParser.isParallelRun()) {
        config.multiCapabilities = [
            {
                browserName: "chrome",
                specs: ["../specs/angularTodo.spec.js"],
                shardTestFiles: true,
                maxInstances: 1,
                sequential: true,
            },
            {
                browserName: "chrome",
                specs: ["../specs/apiTest.spec.js"],
                shardTestFiles: true,
                maxInstances: 1,
                sequential: true,
            }
        ];
    } else {

        /*
         * `multiCapabilities` and `suites` key won't work together.
         *  so if current mode is normal, then add `suites` key with respective object.
         *
         *  Here value for suites will be stored in json and is accessed using  `configParams.suites`.
         *
         */
        config.suites = configParams.suites;
    }
};


/*
 * -----------------------------------------------------------
 *              CONFIG OBJECT
 * -----------------------------------------------------------
 */

export let config:Config = {
    framework: 'jasmine2',

    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 11000, //45 mins
        includeStackTrace: false,
        print: function () {
        }
    },

    baseUrl : "https://angularjs.org/",

    onPrepare: ()=> {

        var globalParams = ConfigParser.getParams();
        ReportManager.registerJasmineReporters(globalParams);

        /*
         * Register Jasmine custom matcher.
         * reference : https://www.npmjs.com/package/jasmine-expect
         */

        beforeEach(function () {
            jasmine.addMatchers(require('jasmine-expect'));
        });
    },

    afterLaunch: async function () {
        /*
         * `browser.params` object cannot be accessed in afterLaunch method.
         *  so using the `params` object from file that is created when configuration file is loaded.
         */

        var globalParams = ConfigParser.getParams();
        await ReportManager.emailHtmlReport(globalParams.report.email, {branch: globalParams.branch});
    },

    params: configParams.params,

};

/* Call init method with config object to parse command line arguments and decide the mode of execution (with or without multiCapabilities) */
init(config);