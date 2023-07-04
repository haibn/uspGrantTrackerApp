// Gets the main html file and runs it
function doGet(e){
    return HtmlService.createTemplateFromFile('index').evaluate();
}
  
// Helper function used to link multiple html files (Used to link stylesheet.html and js.html to index.html)
function include(filename){ 
    return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
  
// Helper function that counts how many times a value is repeated in an array
function getOccurrence(array, value) {
    var count = 0;
    array.forEach((v) => (v === value && count++));
    return count;
}

// Helper function that gets all indexes of a ocurrence in an array
function getAllIndexes(arr, val) {
    var indexes = [], i;
    for(i = 0; i < arr.length; i++)
        if (arr[i] === val)
            indexes.push(i);
    return indexes;
}

function newAccount(params) {
    let name = params[0];
    let sid = Number(params[1]);
    let password = params[2];
    let url = "https://docs.google.com/spreadsheets/d/11scOkr3HQhseyUir8YgwOabW3PwbeDA7wTVJUyuK2L8/edit#gid=916264064";
    let ss = SpreadsheetApp.openByUrl(url);
    let wsAccounts = ss.getSheetByName("Emergency Grant Tracker");
    let wsResponses = ss.getSheetByName("Form Responses 1");
    // Logger.log(params);
    let wsAccountsSids = wsAccounts.getRange(2,2,wsAccounts.getLastRow(), 1).getValues();
    let wsResponsesSids = wsResponses.getRange(2,5,wsResponses.getLastRow(), 1).getValues();
    let accountsSidList = wsAccountsSids.map(function(r) { return r[0]; });
    let reponsesSidList = wsResponsesSids.map(function(r) { return r[0]; });
    let accPosition = accountsSidList.indexOf(sid);
    let resPosition = reponsesSidList.indexOf(sid);
    // Logger.log("sid: " + sid + " typeof " + typeof(sid));
    // Logger.log("reponsesSidList: " + reponsesSidList + " typeof " + typeof(reponsesSidList[0]));
    // Logger.log("resPosition: " + resPosition);
    // Logger.log("accountsSidList: " + accountsSidList + " typeof " + typeof(accountsSidList[0]));
    // Logger.log("accPosition: " + accPosition);
    if (resPosition > -1) {
        if (accPosition > -1) {
            throw Error("Account with the given SID already exists.");
        } else {
            wsAccounts.appendRow(params);
        }
    } else {
        throw Error("SID not found in our records.");
    }
}

function newUserLogIn(params) {
    let sid = Number(params[0]);
    let password = params[1];
    let url = "https://docs.google.com/spreadsheets/d/11scOkr3HQhseyUir8YgwOabW3PwbeDA7wTVJUyuK2L8/edit#gid=916264064";
    let ss = SpreadsheetApp.openByUrl(url);

    let wsResponses = ss.getSheetByName("Form Responses 1");
    let wsResponsesSids = wsResponses.getRange(2,5,wsResponses.getLastRow(), 1).getValues();
    let reponsesSidList = wsResponsesSids.map(function(r) { return r[0]; });

    let wsAccounts = ss.getSheetByName("Emergency Grant Tracker");
    let wsAccountsSids = wsAccounts.getRange(2,2,wsAccounts.getLastRow(), 1).getValues();
    let wsAccountsPasswords = wsAccounts.getRange(2,3,wsAccounts.getLastRow(), 1).getValues();
    let sidList = wsAccountsSids.map(function(r) { return r[0]; });
    let passwordList = wsAccountsPasswords.map(function(r) { return r[0]; });
    let position = sidList.indexOf(sid);

    if (position > -1) {
        if (password == passwordList[position]) {
        let resPositions = getAllIndexes(reponsesSidList, sid);
        resPositions = resPositions.map(v=> v+2);
        let data = {
            nameCell : [],
            sidCell : [],
            dateCell : [],
            awardCell : [],
            statusCell : [],
            notesCell : []
        }
        for (i = 0; i < resPositions.length; i ++) {
            data.nameCell.push(wsResponses.getRange('C' + resPositions[i]).getValue());
            data.sidCell.push(wsResponses.getRange('E' + resPositions[i]).getValue());
            data.dateCell.push(wsResponses.getRange('A' + resPositions[i]).getValue().toISOString().substring(0, 10));
            data.awardCell.push(wsResponses.getRange('M' + resPositions[i]).getValue());
            data.statusCell.push(wsResponses.getRange('Z' + resPositions[i]).getValue());
            data.notesCell.push(wsResponses.getRange('AA' + resPositions[i]).getValue());
        }
            Logger.log("nameCell " + data.nameCell);
            Logger.log("sidCell " + data.sidCell);
            Logger.log("dateCell " + data.dateCell + " typeof " + typeof(data.dateCell[0]));
            Logger.log("awardCell " + data.awardCell);
            Logger.log("statusCell " + data.statusCell);
            Logger.log("notesCell " + data.notesCell);
            return data;
        } else {
            throw Error("Incorrect password.");
        }
    } else {
        throw Error("User not found.");
    }
}