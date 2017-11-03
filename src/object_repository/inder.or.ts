'use strict';
import {AngularHomeOR} from './angularHome.or';

/*
 * author : sudharsan selvaraj
 * created on : 28/10/2017
 * 
 * ObjectRepository class is a collection of Object Repository classes of all pages.
 *
 */

export class ObjectRepository {

    public angularPageOR:AngularHomeOR;

    constructor(browserInstance?:any) {
        this.angularPageOR = new AngularHomeOR(browserInstance);
    };

}