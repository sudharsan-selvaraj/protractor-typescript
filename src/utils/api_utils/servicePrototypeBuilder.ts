'use strict';

import {ApiRestClient, IAuth, IParametersForGet, IParametersForPost} from "./restClient";
import {protractor} from "protractor";

/*
 * author : sudharsan selvaraj
 * created on : 28/10/2017
 */

var browser:any;
var baseUrl:any;
export class servicePrototypeBuilder extends ApiRestClient {


    constructor(browserInstance = protractor.browser,_baseUrl = (browser.baseUrl || browser.params.url)) {
        super();
        browser = browserInstance;
        baseUrl = _baseUrl;
    };

    private getRequest(requestObject:any) {
        var self = this;
        return function (params:any = requestObject["params"], credentials:IAuth = {username:"",password:""}) {
            var getOptions:IParametersForGet = {
                baseUrl: baseUrl,
                path: requestObject["path"],
                params: params,
                auth: {
                    username: credentials.username || (browser.params.apiCredentials && browser.params.apiCredentials.username) || "",
                    password: credentials.password ||  (browser.params.apiCredentials && browser.params.apiCredentials.password) || ""
                }
            };

            return self.get(getOptions);
        };
    }

    private postRequest(requestObject:any) {
        var self = this;
        return function (params:any = requestObject["params"], payload:any = {}, credentials:IAuth = {username:"",password:""}) {

            var postOptions:IParametersForPost = {
                baseUrl: baseUrl,
                path: requestObject["path"],
                params: params,
                payload: payload,
                auth: {
                    username: credentials.username || (browser.params.apiCredentials && browser.params.apiCredentials.username) || "",
                    password: credentials.password ||  (browser.params.apiCredentials && browser.params.apiCredentials.password) || ""
                }
            };

            return self.post(postOptions);
        };
    }

    registerService(serviceObject:any):Object {
        var finalObject:any = {};
        for (var obj in serviceObject) {
            if (serviceObject.hasOwnProperty(obj)) {
                if (serviceObject[obj].method == "GET") {
                    finalObject[obj] = this.getRequest(serviceObject[obj]);
                } else {
                    finalObject[obj] = this.postRequest(serviceObject[obj]);
                }
            }
        }
        return finalObject;
    }

}