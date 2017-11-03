'use strict';
var fs = require('fs');
const PARAMS_FILE = "./params.env.pid";


/*
 * author : sudharsan selvaraj
 * created on : 28/10/2017
 */

/*
 * Utility class to parse command line paramaeters passed to protractor process and configure capabilities based on parameters.
 *
 */

class ConfigParamsParser {

    public processedParams;

    /*
     * When running tests with multiCapabilities options, `browser.params` object cannot be accessed in `beforeLaunch` and `afterLaunch` methods in config file.
     *
     * Below method will construct params object based on command line arguments and output's the value to a json file.
     * later in `beforeLaunch` and `afterLaunch` methods the same json file can be used to check if specific parameter is passed to params object.
     *
     */

    init(configObject = {}) {
        var defaultParams = require("./configurationData.json").params; // default params are stored as json file

        defaultParams.baseUrl = configObject["baseUrl"] || "";
         /*
          * `process.args` will have all parameters that is passed to the protractor process.
          *
          *  Sample args = ['--suite','test','--baseUrl','localhost','--params.user.name' : 'sudharsan','--params.user.password','testpassword']
          *
          */


        process.argv.forEach(function (val, index) {

            if (val.indexOf("--") != -1) {   // if arguments matches with pattern `--params` then it needs to be included as part of params object
                var currObject = {};

                // In case of multi-level params(--params.user.name ),we need to construct a dummy object like { user: {name : "" } } and later can merge it to original params object.

                var objectHierarchy = process.argv[index].split(".");
                objectHierarchy.shift(); // remove `--params` from result array. output will be ['user','name']

                /*
                 * construct a dummy object with keys ['user','name'] and value for the key will be in the next argument of "argv" array.
                 *
                 * currObject = {},objectHierarchy=['user','name'],process.argv[index + 1]= "sudharsan"
                 *
                 * OUTPUT: { user: {name : "sudharsan" } }
                 *
                 */
                createMultilevelObjectFromArray(currObject, objectHierarchy, process.argv[index + 1]);

                // Combine the newly created object with original params object.
                mergeObjects(defaultParams, currObject);
            }
        });

        this.processedParams = defaultParams;
        storeParamsAsFile(defaultParams);
        return this.getParams();
    }

    /*
     * Method to read stored params from as json object from file.
     */

    getParams() {
        return JSON.parse(fs.readFileSync(PARAMS_FILE, "utf8"));
    }

    /*
     * Method to check if current execution is parallel.
     *
     * if `params` object has `parallel` key with value "yes", then current execution is happening in `multiCapabilities` mode.
     */

    isParallelRun() {
        return (this.processedParams.parallel && this.processedParams.parallel.toLowerCase() == "yes");
    }
}


/*
 * Helper Method to create multilevel object from array of keys and assign the value to the inner most node.
 *
 * Example :
 *
 *  expected output: {
 *                      users: {
 *                         admin : {
 *                           name : "sudharsan"
 *                               }
 *                             }
 *                   }
 *
 *  input :  var object = {},keyPath=[user,admin,name],value="sudharsan";
 *
 *  Below method will construct an Object that will look like the object mentioned in expected output.
 *
 *
 * if `params` object has `parallel` key with value "yes", then current execution is happening in `multiCapabilities` mode.
 */

let createMultilevelObjectFromArray = function (obj, keyPath, value) {
    var lastKeyIndex = keyPath.length - 1;
    for (var i = 0; i < lastKeyIndex; ++i) {
        var key = keyPath[i];
        if (!(key in obj))
            obj[key] = {};
        obj = obj[key];
    }
    obj[keyPath[lastKeyIndex]] = value;
};


/*
 * Helper Method to merge two object into single object. Works for multilevel objects as well.
 *
 * Will the main object contains the same key as the other, then the valu will be replace with the value of second object.
 * Otherwise a new key will be created in the original object and assign the value to it.
 *
 * Example :
 *
 *  var object1 = { user : { name : "sudharsan" }  }
 *  var object2 = { user : {name:"selvaraj" , last_name:"selvaraj" }}
 *
 *  OUTPUT:
 *
 *  { user: { name : "selvaraj" , last_name: "selvaraj" } }
 *
 */

let mergeObjects = function (into:any, from:any):any {
    for (let key in from) {
        if (into[key] instanceof Object && !(into[key] instanceof Array) && !(into[key] instanceof Function)) {
            mergeObjects(into[key], from[key]);
        } else {
            into[key] = from[key];
        }
    }
    return into;
};

let storeParamsAsFile = function (params) {
    fs.writeFileSync(PARAMS_FILE, JSON.stringify(params));
};

export let ConfigParser = new ConfigParamsParser();