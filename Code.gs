//global variables for script
//Kissflow API credentials
var domain = "dnth.kissflow.com";
var accountID = "AcGFVUI5pXznS";
var processID = "Leave_Request";
var apiKey = "Ak0b82768d-763e-4f6b-8dc3-fa6d4be26f3c";
var accessKey = "Ak12aa4520-105d-4d8e-bf33-0d78ed48bcac";
var instanceID = "PkI3y9IqzVvzT";


const Excel_Holiday = "https://docs.google.com/spreadsheets/d/1wkSpcFbCxziHvUr9L_fPmOv-GWPt701kppu92tpASLI/edit#gid=0";
const LOG_URL = "https://docs.google.com/document/d/1YPnFpZDvwxCZs_Ul3G7KCENrcIG-ChNz39y0ltOa0Ko/edit";

//API options
// var options = {
//   "method": "GET",
//   "headers": {
//     "x-api-key": apiKey,
//     "Content-Type": "application/json"
//   },
//   "payload": "",
//   "muteHttpExceptions": true
// };



//function: standAlone
//purpose: simulate Kissflow webhook integrations
function standAlone() {
  try {
    var jsonData = VBixLibV4.getUpdateData(domain, accountID, accessKey, processID, instanceID)
    var jsonString = JSON.stringify(jsonData)
    var blob = Utilities.newBlob(jsonString);
    var e = {
      postData: blob
    }
    doPost(e);
  } catch (err) {
    setLog(new Date() + " : " + err.stack);
  }
}

//function: doPost
function doPost(e) {
  try {
    //parse JSON data
    var jsonString = e.postData.getDataAsString();
    var jsonData = JSON.parse(jsonString);
    var instanceID = jsonData["_id"] || "";
    jsonData = VBixLibV4.getUpdateData(domain, accountID, accessKey, processID, jsonData["_id"]);
    // Logger.log(jsonData);
    //get start date or end date from form process kissflow
    var end_date = jsonData["Leave_End_Date"] || "";
    var start_date = jsonData["Leave_Start_Date"] || "";
    var working_day = jsonData["Number_of_Deadline_Summit_Additional_Document"] || "";
    var ss = SpreadsheetApp.openByUrl(Excel_Holiday).getActiveSheet();
    //set value form form process kiss to holidays excel
    if(end_date == ""){
    Logger.log("end_date == null");
    ss.getRange('C2').setValue(start_date);
    } else {
    Logger.log("end_date != null");  
    ss.getRange('C2').setValue(end_date);
    }
    ss.getRange('D2').setValue(working_day);
    //get deadline value form holidays excel
    var deadline_excel = ss.getRange('E2').getValue();
    Logger.log("deadline date : " + deadline_excel);
    var deadline = new Date(deadline_excel).toLocaleDateString("fr-CA");
    // Logger.log(deadline);
    //updatefiled in kissflow
    VBixLibV4.updateSingleField(domain, accountID, accessKey, processID, instanceID, "Deadline_Summit_Additional_Document" , deadline);
    setLog("==================================================================");
    setLog(new Date() + " : " + "Complete");
    setLog("==================================================================");
  }
  catch (err) {
    setLog("==================================================================");
    setLog(new Date() + " : " + err.stack);
    setLog("==================================================================");
  }

}

//setLog
function setLog(message) {
  var docs = DocumentApp.openByUrl(LOG_URL);
  var body = docs.getBody();
  body.appendParagraph(message);
}

function run(){
  Logger.log(VBixLibV4.ACCESS_SECRET_KEY);
}

