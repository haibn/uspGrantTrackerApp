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
  
  // Access the database, authenticates the provided sign up data, and stores the new data for the new account.
  function newAccount(params) {
    // retrieves the sid inputted by the user converting it to a Number type for comparison purposes
    let sid = Number(params[1]);
  
    // access the database
    let url = "https://docs.google.com/spreadsheets/d/11scOkr3HQhseyUir8YgwOabW3PwbeDA7wTVJUyuK2L8/edit#gid=916264064";
    let ss = SpreadsheetApp.openByUrl(url);
    // access to the "Emergency Grant Tracker sheet and the "Form Responses 1" sheet
    let wsAccounts = ss.getSheetByName("Emergency Grant Tracker");
    let wsResponses = ss.getSheetByName("Form Responses 1");
    // get the list of sids in the "Emergency Grant Tracker" sheet and "Form Responses 1" sheet
    let wsAccountsSids = wsAccounts.getRange(2,2,wsAccounts.getLastRow(), 1).getValues();
    let wsResponsesSids = wsResponses.getRange(2,5,wsResponses.getLastRow(), 1).getValues();
    let accountsSidList = wsAccountsSids.map(function(r) { return r[0]; });
    let reponsesSidList = wsResponsesSids.map(function(r) { return r[0]; });
    
    // checks if the provided sid exists in the database and if there's an account already with the given sid
    let accPosition = accountsSidList.indexOf(sid);
    let resPosition = reponsesSidList.indexOf(sid);
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
  
  // Access the database, retrieves user's information and send the information back to the frontend.
  function newUserLogIn(params) {
    // retrieves the sid and password inputted by the user (converting the sid to a Number type for comparison purposes)
    let sid = Number(params[0]);
    let password = params[1];
  
    // access the database
    let url = "https://docs.google.com/spreadsheets/d/11scOkr3HQhseyUir8YgwOabW3PwbeDA7wTVJUyuK2L8/edit#gid=916264064";
    let ss = SpreadsheetApp.openByUrl(url);
    // get the list of sids in the "Form Responses 1" sheet
    let wsResponses = ss.getSheetByName("Form Responses 1");
    let wsResponsesSids = wsResponses.getRange(2,5,wsResponses.getLastRow(), 1).getValues();
    let reponsesSidList = wsResponsesSids.map(function(r) { return r[0]; });
    // get the list of sids and passwords in the "Emergency Grant Tracker" sheet
    let wsAccounts = ss.getSheetByName("Emergency Grant Tracker");
    let wsAccountsSids = wsAccounts.getRange(2,2,wsAccounts.getLastRow(), 1).getValues();
    let wsAccountsPasswords = wsAccounts.getRange(2,3,wsAccounts.getLastRow(), 1).getValues();
    let sidList = wsAccountsSids.map(function(r) { return r[0]; });
    let passwordList = wsAccountsPasswords.map(function(r) { return r[0]; });
  
    // check if there's an existing account with the given sid
    let position = sidList.indexOf(sid);
    if (position > -1) {
      // if so check if the given password matches the one in the database
      if (password == passwordList[position]) {
        // retrieves the user's data from the database and sends it back to the frontend
        let resPositions = getAllIndexes(reponsesSidList, sid);
        resPositions = resPositions.map(v=> v+2)
        let data = {
          nameCell : [],
          sidCell : [],
          dateCell : [],
          awardCell : [],
          amountCell: [],
          statusCell : [],
          notesCell : []
        }
        for (i = 0; i < resPositions.length; i ++) {
          data.nameCell.push(wsResponses.getRange('C' + resPositions[i]).getValue());
          data.sidCell.push(wsResponses.getRange('E' + resPositions[i]).getValue());
          data.dateCell.push(wsResponses.getRange('A' + resPositions[i]).getValue().toISOString().substring(0, 10));
          data.awardCell.push(wsResponses.getRange('M' + resPositions[i]).getValue());
          data.amountCell.push(wsResponses.getRange('N' + resPositions[i]).getValue());
          data.statusCell.push(wsResponses.getRange('Z' + resPositions[i]).getValue());
          data.notesCell.push(wsResponses.getRange('AA' + resPositions[i]).getValue());
        }
        return data;
      } else {
        throw Error("Incorrect password.");
      }
    } else {
      throw Error("User not found.");
    }
  }
  
  function newQuickSearch(param) {
    let sid = Number(param);
    // access the database
    let url = "https://docs.google.com/spreadsheets/d/11scOkr3HQhseyUir8YgwOabW3PwbeDA7wTVJUyuK2L8/edit#gid=916264064";
    let ss = SpreadsheetApp.openByUrl(url);
    // get the list of sids in the "Form Responses 1" sheet
    let wsResponses = ss.getSheetByName("Form Responses 1");
    let wsResponsesSids = wsResponses.getRange(2,5,wsResponses.getLastRow(), 1).getValues();
    let reponsesSidList = wsResponsesSids.map(function(r) { return r[0]; });
    // get the list of sids and passwords in the "Emergency Grant Tracker" sheet
    let wsAccounts = ss.getSheetByName("Emergency Grant Tracker");
    let wsAccountsSids = wsAccounts.getRange(2,2,wsAccounts.getLastRow(), 1).getValues();
    let wsAccountsPasswords = wsAccounts.getRange(2,3,wsAccounts.getLastRow(), 1).getValues();
    let sidList = wsAccountsSids.map(function(r) { return r[0]; });
    let passwordList = wsAccountsPasswords.map(function(r) { return r[0]; });
  
    // check if there's an existing account with the given sid
    let position = sidList.indexOf(sid);
    if (position > -1) {
      // retrieves the user's data from the database and sends it back to the frontend
      let resPositions = getAllIndexes(reponsesSidList, sid);
      resPositions = resPositions.map(v=> v+2)
      let data = {
        nameCell : [],
        sidCell : [],
        dateCell : [],
        awardCell : [],
        amountCell: [],
        statusCell : [],
        notesCell : []
      }
      for (i = 0; i < resPositions.length; i ++) {
          data.nameCell.push("Log-in for more information");
          data.sidCell.push(wsResponses.getRange('E' + resPositions[i]).getValue());
          data.dateCell.push(wsResponses.getRange('A' + resPositions[i]).getValue().toISOString().substring(0, 10));
          data.awardCell.push(wsResponses.getRange('M' + resPositions[i]).getValue());
          data.amountCell.push("Log-in for more information");
          data.statusCell.push(wsResponses.getRange('Z' + resPositions[i]).getValue());
          data.notesCell.push(wsResponses.getRange('AA' + resPositions[i]).getValue());
      }
      return data;
    } else {
      throw Error("User not found.");
    }
  }
  
  // retrieve announcements from database
  function getAnnouncements() {
    let url = "https://docs.google.com/spreadsheets/d/11scOkr3HQhseyUir8YgwOabW3PwbeDA7wTVJUyuK2L8/edit#gid=916264064";
    let ss = SpreadsheetApp.openByUrl(url);
    let ws = ss.getSheetByName("Form Responses 1");
    let content = ws.getRange("AB7").getValue();
    return content;
  }
  
  function getPassword(param) {
    // retrieves the sid inputted by the user converting it to a Number type for comparison purposes
    let sid = Number(param);
  
    // access the database
    let url = "https://docs.google.com/spreadsheets/d/11scOkr3HQhseyUir8YgwOabW3PwbeDA7wTVJUyuK2L8/edit#gid=916264064";
    let ss = SpreadsheetApp.openByUrl(url);
    // access to the "Emergency Grant Tracker sheet and the "Form Responses 1" sheet
    let wsAccounts = ss.getSheetByName("Emergency Grant Tracker");
    let wsResponses = ss.getSheetByName("Form Responses 1");
    // get the list of sids in the "Emergency Grant Tracker" sheet and "Form Responses 1" sheet
    let wsAccountsSids = wsAccounts.getRange(2,2,wsAccounts.getLastRow(), 1).getValues();
    let wsResponsesSids = wsResponses.getRange(2,5,wsResponses.getLastRow(), 1).getValues();
    let accountsSidList = wsAccountsSids.map(function(r) { return r[0]; });
    let reponsesSidList = wsResponsesSids.map(function(r) { return r[0]; });
    
    // checks if the provided sid exists in the database and if there's an account already with the given sid
    let accPosition = accountsSidList.indexOf(sid);
    let resPosition = reponsesSidList.indexOf(sid);
    if (resPosition > -1) {
      resPosition = resPosition + 2;
      let email = wsResponses.getRange('B' + resPosition).getValue();
      let name = wsResponses.getRange('C' + resPosition).getValue();
      if (accPosition > -1) {
        accPosition = accPosition + 2;
        let password = wsAccounts.getRange('C' + accPosition).getValue();
        MailApp.sendEmail(email, "USP Grant Tracking App Password", "Hi " + name + ", your password is: " + password);
      } else {
        throw Error("Account with the given SID does not exist. Please create an account first.");
      }
    } else {
      throw Error("SID not found in our records.");
    }
  }