'use strict';

var nodemailer = require('nodemailer');
var shell = require("shelljs");
var fs = require("fs");
var path = require("path");

var EXECUTION_DETAILS = path.resolve("./spec_execution_status.pid");
var self;
/*
 * 
 * author : sudharsan selvaraj
 * created on : 28/10/2017
 *
 *------------------------------------------------------------------------------
 * Helper Utility class to email HTML reports once the execution is completed.
 * -----------------------------------------------------------------------------
 *
 */

var templatesFolder = path.resolve(__dirname + "/templates/");
export class EmailReporter {

    private emailConfigObject:any;
    private reportZipFilePath:string;
    private reportFolderPath:string;
    private outputOptions:any;

    /*
     * Initialize SMTP server config object parameters.
     *
     * @params {string} email
     * @params {string} password
     * @params {string} resultDir
     */

    constructor(email:string, password:string, resultDir:string, options?:any) {

        /* Construct SMTP config object for sender email account */
        this.emailConfigObject = {
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // use SSL
            auth: {
                user: email,
                pass: password
            }
        };
        this.reportFolderPath = resultDir;
        this.reportZipFilePath = this.reportFolderPath + "/htmlReport.tar.gz";
        this.outputOptions = options || {};
        self = this;
    };


    public setOutputOptions(options:any) {
        if (!options) {
            return;
        }
        Object.keys(options).forEach(function (key) {
            if (!self.outputOptions.hasOwnProperty(key)) {
                self.outputOptions[key] = options[key];
            }
        });
    };

    /*
     * Method to generate a HTML archive file of the results folder that an be sent through email.
     */

    private compressResultsFolder() {
        console.log("***************************************************************");
        console.log("********** Archiving HTML report and screen shots  ***********");
        console.log("***************************************************************");
        shell.exec("npm run gulp -- replaceJsExtension");
        var operatingSystem = shell.exec("uname").stdout.replace("\n", "");

        if (operatingSystem != "Darwin") {
            shell.exec("sudo tar -zcvf " + this.reportZipFilePath + " " + this.reportFolderPath, {silent: true});
        } else {
            shell.exec("tar -zcvf " + this.reportZipFilePath + " " + this.reportFolderPath, {silent: true});
        }
    }

    /*
     * Below method will construct email body based on output options given.
     *
     *  HTML template wil be taken from "./library/template.html" and replaces the content.
     * 
     */
    
    private getMessageBody() {
        var template = fs.readFileSync(templatesFolder+"/template.html", "utf8");
        var icon = require(path.resolve(templatesFolder+"/icons.json"));

        var specExecutionDetails = getGetSpecDetails();
        var tableContent = "";

        this.outputOptions["Totals Tests Executed"] = specExecutionDetails.total;
        this.outputOptions["Total Tests Failed"] = specExecutionDetails.failed;

        var color = specExecutionDetails.failed == 0 ? "greed" : "red";
        var successOrFailure = specExecutionDetails.failed == 0 ? "Success" : "Failed";
        tableContent += "<tr>"
        tableContent += "<td><b>Status:<b></td>";
        tableContent += "<td style=\"color:" + color + "\">" + successOrFailure + "</td>";
        tableContent += "</td>";

        for (var key in this.outputOptions) {
            tableContent += "<tr>"
            tableContent += "<td><b>" + key + ":<b></td>";
            tableContent += "<td>" + this.outputOptions[key] + "</td>";
            tableContent += "</td>";
        }

        template = template.replace("{{statusicon}}", specExecutionDetails.failed == 0 ? icon.success : icon.error);
        template = template.replace("{{tablebody}}", tableContent);
        return template;
    }

    /*
     * Below method will send email to all given recipients.
     *
     * @params {string} emailRecipients
     * @params {Object} outputOptions
     * 
     */

    public sendEmailNotification(emailRecipients:string, outputOptions?:any) {
        this.setOutputOptions(outputOptions);
        if (emailRecipients.toLowerCase() == "no") {
            return new Promise(function (resolve, reject) {
                return resolve(true);
            });
        }

        this.compressResultsFolder();
        var transporter = nodemailer.createTransport(this.emailConfigObject);
        var mailOptions = {
            from: this.emailConfigObject.auth.user,
            to: emailRecipients,
            subject: "E2E execution report for branch " + this.outputOptions.branch,
            html: this.getMessageBody(),
            attachments: [
                {
                    path: path.resolve(this.reportZipFilePath)
                }
            ]
        };

        return new Promise(function (resolve, reject) {
            transporter.sendMail(mailOptions, function (error, info) {
                resolve(true);
                if (error) {
                    console.log(error);
                }
                console.log("Successfully emailed HTML reports to :" + emailRecipients);
            });
        });
    }

}

var getGetSpecDetails = ()=> {
    return JSON.parse(fs.readFileSync(EXECUTION_DETAILS, "utf8"));
};
