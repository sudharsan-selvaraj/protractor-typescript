'use strict';

/*
 * author : sudharsan selvaraj
 * created on : 28/10/2017
 */

class JavascriptUtils {

    isArray(obj?:any) {
        return !!obj && Array === obj.constructor;
    };

    getHostFromUrlString(url:string){
        return url.split("//")[1].split(":")[0];
    }
    
    getPortNumberFromUrl (url:string) {
       return url.split("//")[1].split(":")[1].replace(/[^0-9]/g, "");
    }
}

export let jsUtils = new JavascriptUtils();