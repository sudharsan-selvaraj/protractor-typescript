import {servicePrototypeBuilder} from '../servicePrototypeBuilder'
import {protractor} from 'protractor';
var browser:any;

export class JsonPlaceHolderServices extends servicePrototypeBuilder {

    public services:any;

    constructor(browserInstance = protractor.browser,_baseUrl?:any) {
        super(browserInstance,_baseUrl);
        browser = browserInstance;
        this.services = this.registerService({
            getAllPosts: {
                path: "/posts/",
                method: "GET"
            },
            getPost: {
                path: "/posts/:postId:",
                method: "GET"
            },
            getComments: {
                path: "posts/:postId:/comments",
                method: "GET"
            },
            addNewPost: {
                path: "/posts/",
                method: "POST"
            }
        });
    }

}