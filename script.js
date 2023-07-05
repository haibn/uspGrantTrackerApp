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
  let records = document.getElementById("records");

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

  records.textContent = "";
}

// Failure Handler function used to alert the user if the inputted SID is not found in the database (google sheets)
function accountNotCreated(error) {
  alert(error);
}

// Success Handler function to let the user know the account was created successfully
function accountCreatedSuccessfully() {
  alert("Account Created Successfully!");
}

// Checks that every field is filled out and creates a new account calling newAccount() from Code.gs
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

// Failure Handler function used to alert the user that he could not login
function unsuccessfulLogIn(error) {
  alert(error);
}

// Success Handler function that retrieves the data from the backend (google sheets database) and displays the information to the user.
function loggedIn(data) {
  // stores retrieved data in vars
  let name = data.nameCell;
  let sid = data.sidCell;
  let date = data.dateCell;
  let award = data.awardCell;
  let status = data.statusCell;
  let note = data.notesCell;

  // access the summary, form and records section on index.html
  let summary = document.getElementById("summary");
  let form = document.getElementById("login");
  let records = document.getElementById("records");

  // stores user's name and sid on index.html
  let newName = document.getElementById("summName");
  let newSid = document.getElementById("summSid");
  newName.innerHTML = name[0];
  newSid.innerHTML = sid[0];

  // loops through the retrieved data and appends it to the records section on index.html
  for (i = 0; i < sid.length; i ++) {
    let newRecord = document.createElement("li");

    let bDate = document.createElement("b");
    let bAward = document.createElement("b");
    let bStatus = document.createElement("b");
    let bNote = document.createElement("b");

    bAward.textContent = "Award: ";
    bStatus.textContent = "Status: ";
    bNote.textContent = "Comments: ";

    let spanDate = document.createElement("span");
    let spanAward = document.createElement("span");
    let spanStatus = document.createElement("span");
    let spanNote = document.createElement("span");

    spanDate.textContent = date[i];
    spanDate.setAttribute("class", "dateStyle");

    spanAward.textContent = award[i];

    if (status[i] == "") {
      spanStatus.textContent = "Status yet to be assigned";
    } else {
      spanStatus.textContent = status[i];
    }
    if (note[i] == "") {
      spanNote.textContent = "No comments";
    } else {
      spanNote.textContent = note[i];
    }

    bDate.appendChild(spanDate);
    bAward.appendChild(spanAward);
    bStatus.appendChild(spanStatus);
    bNote.appendChild(spanNote);

    newRecord.appendChild(bDate);
    newRecord.appendChild(bAward);
    newRecord.appendChild(bStatus);
    newRecord.appendChild(bNote);

    records.appendChild(newRecord);
  }

  // displays student summary and hides log in form
  form.style.display = "none";
  summary.style.display = "block";
}

// Gets the user log in information and sends it to the backend by calling newUserLogIn()
function userLogIn() {
  let sid = document.getElementById("sidlogin");
  let password = document.getElementById("passwordlogin");
  let params = [sid.value, password.value];
  google.script.run.withSuccessHandler(loggedIn).withFailureHandler(unsuccessfulLogIn).newUserLogIn(params);
  sid.value = "";
  password.value = "";
}