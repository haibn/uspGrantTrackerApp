//signup Student Information button. When clicked, it displays the form. 
function signupForm() {
    var home = document.getElementById("home");
    var form = document.getElementById("signup");
    console.log(form);
    home.style.display = "none";
    form.style.display = "block";
}

//login Student Information button. When clicked, it displays the form. 
function loginForm() {
    var home = document.getElementById("home");
    var form = document.getElementById("login");
    console.log(form);
    home.style.display = "none";
    form.style.display = "block";
}

// Back button. When clicked, it returns to the home page
function back() {
    var home = document.getElementById("home");
    var signupForm = document.getElementById("signup");
    var loginForm = document.getElementById("login");
    let summary = document.getElementById("summary");

    if (signupForm.style.display == "block") {
      home.style.display = "block";
      signupForm.style.display = "none";
    } else if (summary.style.display == "block") {
      home.style.display = "block";
      summary.style.display = "none";
      loginForm.style.display = "none";
    } else {
      home.style.display = "block";
      loginForm.style.display = "none";
    }
}

// Helper function used to alert the user if the inputted SID is not found in the database (google sheets)
function accountNotCreated(error) {
    alert(error);
}

// Helper function used to alert the user if the inputted SID is not found in the database (google sheets)
function accountCreatedSuccessfully() {
    alert("Account Created Successfully!");
}

// Function used to add the given infomation inputted by the user on the web app to google sheets.
// This function is triggered when the "add" button is clicked.
function createAccount() {
    let name = document.getElementById("nameSignup");
    let sid = document.getElementById("sidSignup");
    let password = document.getElementById("passwordSignup");
    let params = [name.value, sid.value, password.value];
    if (name.value != "" && sid.value != "" && password.value != "") {
      google.script.run.withSuccessHandler(accountCreatedSuccessfully).withFailureHandler(accountNotCreated).newAccount(params);
      name.value = "";
      sid.value = "";
      password.value = "";
    } else {
      alert("Missing fields.");
    }
}

// Helper function used to alert the user if the inputted SID is not found in the database (google sheets)
function unsuccessfulLogIn(error) {
    alert(error);
}

// Helper function used to alert the user if the inputted SID is not found in the database (google sheets)
function loggedIn(data) {
    console.log(data);
    let name = data.nameCell;
    let sid = data.sidCell;
    let date = data.dateCell;
    let award = data.awardCell;
    let status = data.statusCell;
    let note = data.notesCell;
    console.log(name)
    console.log(sid)
    console.log(date)
    console.log(award)
    console.log(status)
    console.log(note)
    alert("Logged in!");
}

function userLogIn() {
    let sid = document.getElementById("sidlogin");
    let password = document.getElementById("passwordlogin");
    let params = [sid.value, password.value];
    google.script.run.withSuccessHandler(loggedIn).withFailureHandler(unsuccessfulLogIn).newUserLogIn(params);
    sid.value = "";
    password.value = "";
}