var fs = require("fs");
var path = require("path");
var colors = require("colors");

var EXECUTION_DETAILS = path.resolve("./spec_execution_status.pid");

/*
 * Below class will create a json file which will track the number of passed and failed tests.
 *
 * The the json will will be used to construct email report body with the total number of failed tests.
 *
 */

export class ConsoleJasmineReporter {

    public displayDetails;

    /*
     * Details that user wants to display in summay.
     *
     * Example : {ur:"http:localhost:8000/#/myapp", branch: "feature/my_branch"}
     *
     */

    constructor(displayDetails?:any) {
        this.displayDetails = displayDetails;
    }

    jasmineStarted(suiteInfo:any) {
        updateSpecCount();
        displayRunSummary(suiteInfo, this.displayDetails);
    }

    specDone(suiteInfo:any) {
        var currentExecutionDetails = getGetSpecDetails();
        var currentFailureCount = currentExecutionDetails.failed;
        if (suiteInfo.failedExpectations && suiteInfo.failedExpectations.length) {
            currentFailureCount += suiteInfo.failedExpectations.length;
        }
        var total = currentExecutionDetails.total;
        updateSpecCount(total + 1, currentFailureCount);
    }

}

/*
 * Method to read data from json file.
 */

var getGetSpecDetails = ()=> {
    return JSON.parse(fs.readFileSync(EXECUTION_DETAILS, "utf8"));
};


/*
 * Method to create/update failed tests count to json file.
 *
 * @params {number} total - Total number of tests.
 * @params {number} failedCount - Total number of failed tests.
 *
 * When running in multicapability, `jasmineStarted` method will be invoked by jasmine at begging of each spec.
 * To avoid resetting the contents of the file, check if file already exists. if not then create a new file and initialize the count values to `0`
 */

var updateSpecCount = (totalCount = 0, failedCount = 0) => {
    if (fs.existsSync(EXECUTION_DETAILS) && totalCount == 0) {
        return;
    }
    fs.writeFileSync(EXECUTION_DETAILS, JSON.stringify(
        {
            "total": totalCount,
            "failed": failedCount,
        })
    );
};

/*
 * Method to display execution summary before running each spec.
 */

var displayRunSummary = (suiteInfo, displayDetails) => {

    console.log("\n\n\n");
    console.log("------------------Test Summary--------------------");

    Object.keys(displayDetails).forEach(function (displayKey) {
            console.log(displayKey + " : " + colors.green(displayDetails[displayKey]));
    });
    console.log('Total number of tests : ' + suiteInfo.totalSpecsDefined);
    console.log("-----------------------------------------------------------------------------");

};
