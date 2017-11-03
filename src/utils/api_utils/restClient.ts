const request = require("request-promise");

'use strict';
import {jsUtils} from "../js_utils/js_utils";

/*
 * author : sudharsan selvaraj
 * created on : 28/10/2017
 */

export interface IAuth {
    username:string;
    password:string;
}

export interface IParametersForGet {
    baseUrl:string;
    path:string;
    params:any;
    auth:IAuth
}

export interface IParametersForPost {
    baseUrl:string;
    path:string;
    params:any;
    payload:any;
    auth:IAuth
}

export class ApiRestClient {

    /*
     *  Method to perform http GET call with given url and params.
     *  @param {string} path
     *  @param {Object} params
     *
     *  e.g  baseUrl = "http://localhost:8000";
     *       var path = "/datai-api/data-sets/";
     *       var params = {
     *                 page : 1,
     *                 page_size:50,
     *                 pagination : "True"
     *               }
     *     OUTPUT: Returns the list of data sets from API for currently logged in user.
     *
     */

    public get(options:IParametersForGet) {
        var urlString = options.baseUrl + this.interpolateUrlWithParams(options.path, options.params);
        var requestObject = {
            uri: urlString,
            method: "GET"
        };
        return request.get(requestObject).auth(options.auth.username, options.auth.password)
            .then(this.handleSuccessCallback)
            .catch(this.handleErrorCallback);

    }

    /*
     *  Method to perform http POST call with given url and params.
     *  @param {string} path
     *  @param {Object} params
     *
     *  e.g  var url = var url = "http://localhost:8000/datai-api/workflows/"
     *       var params = {}
     *       var payload = { name:"automated_WF",
     *                      details: { some details }
     *                      }
     *     OUTPUT: Will create a new WF with given payload and returns the newly created object details.
     *
     */

    public post(options:IParametersForPost) {
        var urlString = options.baseUrl + this.interpolateUrlWithParams(options.path, options.params);
        var requestObject = {
            uri: urlString,
            method: "POST",
            headers: {
                "content-type": "application/json",
                "cache-control": "no-cache"
            },
            body: JSON.stringify(options.payload),
        };

        return request.post(requestObject).auth(options.auth.username, options.auth.password)
            .then(this.handleSuccessCallback)
            .catch(this.handleErrorCallback);
    }

    /*----------------------- Helper Functions to populate request object ----------------- */

    /**
     * Method to populate URL with paramater which will be passed as a jSON object.
     * @param {string} path
     * @param {Object} params
     *
     * While making GET requests, all parameters should be populated in url string itself.
     *
     * USAGE:
     * var url = "http://localhost:8000/datai-api/data-sets/"
     * var params = {
     *                 page : 1,
     *                 page_size:50,
     *                 pagination : "True"
     *               }
     *
     * OUTPUT: "http://localhost:8000/datai-api/data-sets/?page=1&page_size=50&paginate=True"
     *
     */
    private interpolateUrlWithParams(path?:string, params?:any) {
        var regexObject;
        path+="?";
        for (var param in params) {
            if (params.hasOwnProperty(param) && path.indexOf(":" + param + ":") >= 0) {
                regexObject = new RegExp(":" + param + ":", "g");
                path = path.replace(regexObject, this.convertParamsToStringObject(params[param]));
            } else {
                // Check if end of url contains &.
                path += (path.substr(path.length - 1) == "&" || path.substr(path.length - 1) == "?") ?
                param + "=" + this.convertParamsToStringObject(params[param]) :
                "&" + param + "=" + this.convertParamsToStringObject(params[param]);
            }
        }
        return path;
    };

    /*
     * Util method to parse Array params ([1,2,3]) to respective JSON string.
     * This will be used when array parameter to be passed in GET request url.
     *
     * eg. when filtering data sets under multiple sources,
     *  `filter_source_in` parameter accepts array of data source id.
     */


    private convertParamsToStringObject(param?:any) {
        return jsUtils.isArray(param) ? JSON.stringify(param) : param;
    }

    /*
     * Callback function to return necessary failure log for failed API response.
     * Used in request.get().then().catch(handleErrorCallback) and request.post().then(handleErrorCallback).catch()
     */

    private handleErrorCallback(_error) {
        return _error.error;
    }

    private handleSuccessCallback(data) {
        try {
            return JSON.parse(data)
        } catch (err) {
            return data;
        }
    }

}