  //password show/hide toggle
  function togglePassword() {
    let showPassword = document.getElementById("show-password");
    let passwordField = document.getElementById("passwordlogin");

    let type = passwordField.getAttribute("type") === "password" ? "text" : "password";
    passwordField.setAttribute("type", type);

    if (type == "password") {
      showPassword.style.color = "white";
    } else {
      showPassword.style.color = "#f8b501";
    }
  }

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

  //quick search Student Information button. When clicked, it displays the form. 
  function quickSearchForm() {
    var home = document.getElementById("home");
    var form = document.getElementById("quickSearch");
    console.log(form);
    home.style.display = "none";
    form.style.display = "block";
  }

  //forgot password button. When clicked, it displays the form. 
  function forgotPasswordForm() {
    var login = document.getElementById("login");
    var form = document.getElementById("forgotPassword");
    console.log(form);
    login.style.display = "none";
    form.style.display = "block";
  }

  // Back button. When clicked, it returns to the home page
  function back() {
    var home = document.getElementById("home");
    var signupForm = document.getElementById("signup");
    var loginForm = document.getElementById("login");
    var quickSearchForm = document.getElementById("quickSearch");
    var forgotPasswordForm = document.getElementById("forgotPassword");
    let summary = document.getElementById("summary");
    let records = document.getElementById("records");
    let statusGlossary = document.getElementById("glossary");
    //signature color change
    let sig = document.getElementById("made-by");

    if (signupForm.style.display == "block") {
      home.style.display = "block";
      signupForm.style.display = "none";
    } else if (quickSearchForm.style.display == "block") {
      home.style.display = "block";
      quickSearchForm.style.display = "none";
    } else if (forgotPasswordForm.style.display == "block") {
      loginForm.style.display = "block";
      forgotPasswordForm.style.display = "none"
    } else if (summary.style.display == "block") {
      home.style.display = "block";
      summary.style.display = "none";
      statusGlossary.style.display = "none";
      loginForm.style.display = "none";
      quickSearchForm.style.display = "none";
      sig.style.color = "#f8b501";
    } else {
      home.style.display = "block";
      loginForm.style.display = "none";
    }

    records.textContent = "";
  }

  // Failure Handler function used to alert the user if the inputted SID is not found in the database (google sheets)
  function accountNotCreated(error) {
    loaded();
    alert(error);
  }

  // Success Handler function to let the user know the account was created successfully
  function accountCreatedSuccessfully() {
    loaded();
    alert("Account Created Successfully!");
  }

  // Checks that every field is filled out and creates a new account calling newAccount() from Code.gs
  function createAccount() {
    loading();
    let name = document.getElementById("nameSignup");
    let sid = document.getElementById("sidSignup");
    let password = document.getElementById("passwordSignup");
    let params = [name.value, sid.value, password.value, 0, 0];
    if (name.value != "" && sid.value != "" && password.value != "") {
      google.script.run.withSuccessHandler(accountCreatedSuccessfully).withFailureHandler(accountNotCreated).newAccount(params);
      name.value = "";
      sid.value = "";
      password.value = "";
    } else {
      loaded();
      alert("Missing fields.");
    }
  }

  // Failure Handler function used to alert the user that he could not login
  function unsuccessfulLogIn(error) {
    loaded();
    alert(error);
  }

  // Success Handler function that retrieves the data from the backend (google sheets database) and displays the information to the user.
  function loggedIn(data) {
    // stores retrieved data in vars
    let name = data.nameCell;
    let sid = data.sidCell;
    let date = data.dateCell;
    let award = data.awardCell;
    let amount = data.amountCell;
    let status = data.statusCell;
    let note = data.notesCell;

    // access the summary, form and records section on index.html
    let summary = document.getElementById("summary");
    let statusGlossary = document.getElementById("glossary");
    let form = document.getElementById("login");
    let quickSearchForm = document.getElementById("quickSearch");
    let records = document.getElementById("records");

    // stores user's name and sid on index.html
    let newName = document.getElementById("summName");
    let newSid = document.getElementById("summSid");
    if (quickSearchForm.style.display == "block") {
      newName.innerHTML = "<span style='background-color: #FF8C00; color: #003262; border-radius: 6px;'>" + name[0] + "</span>";
    } else {
      newName.innerHTML = name[0];
    }
    newSid.innerHTML = sid[0];

    // loops through the retrieved data and appends it to the records section on index.html
    for (i = 0; i < sid.length; i ++) {
      let newRecord = document.createElement("li");

      let bDate = document.createElement("b");
      let bAward = document.createElement("b");
      let bAmount = document.createElement("b");
      let bStatus = document.createElement("b");
      let bNote = document.createElement("b");

      bAward.textContent = "Award: ";
      bAmount.textContent = "Amount: ";
      bStatus.textContent = "Status: ";
      bNote.textContent = "Comments: ";

      let spanDate = document.createElement("span");
      let spanAward = document.createElement("span");
      let spanAmount = document.createElement("span");
      let spanStatus = document.createElement("span");
      let spanNote = document.createElement("span");

      spanDate.textContent = date[i];
      spanDate.setAttribute("class", "dateStyle");
      spanDate.setAttribute("style", "white-space: nowrap;");

      spanAward.textContent = award[i];
      spanAmount.textContent = amount[i];

      if (quickSearchForm.style.display == "block") {
        spanAmount.setAttribute("style", "background-color: #FF8C00; color: #003262; border-radius: 6px;");
      }

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
      bAmount.appendChild(spanAmount);
      bStatus.appendChild(spanStatus);
      bNote.appendChild(spanNote);

      newRecord.appendChild(bDate);
      newRecord.appendChild(bAward);
      newRecord.appendChild(bAmount);
      newRecord.appendChild(bStatus);
      newRecord.appendChild(bNote);

      records.appendChild(newRecord);
    }
    //signature color change
    let sig = document.getElementById("made-by");
    sig.style.color = "#003262";

    // displays student summary and hides log in form
    form.style.display = "none";
    quickSearchForm.style.display = "none";
    summary.style.display = "block";
    statusGlossary.style.display = "block";
    loaded();
  }

  // Gets the user log in information and sends it to the backend by calling newUserLogIn()
  function userLogIn() {
    loading();
    let sid = document.getElementById("sidlogin");
    let password = document.getElementById("passwordlogin");
    let params = [sid.value, password.value];

    // displays announcements
    google.script.run.withSuccessHandler(displayAnnouncements).getAnnouncements();

    google.script.run.withSuccessHandler(loggedIn).withFailureHandler(unsuccessfulLogIn).newUserLogIn(params);
    sid.value = "";
    password.value = "";
  }

  function quickSearch() {
    loading();
    let sid = document.getElementById("sidQuickSearch").value;

    // displays announcements
    google.script.run.withSuccessHandler(displayAnnouncements).getAnnouncements();

    google.script.run.withSuccessHandler(loggedIn).withFailureHandler(unsuccessfulLogIn).newQuickSearch(sid);
    document.getElementById("sidQuickSearch").value = "";
  }

  // Displays announcements to user
  function displayAnnouncements(content) {
    let announcement = document.getElementById("announcement-text");
    announcement.innerHTML = content;
  }

  // Alerts users if password is retrieved successfully
  function passwordRetrieved() {
    loaded();
    alert("Your password has been sent to your email!");
  }

  // Retrieves password and sends it to the user
  function forgotPassword() {
    loading();
    let sid = document.getElementById("sidForgotPassword");
    google.script.run.withSuccessHandler(passwordRetrieved).withFailureHandler(unsuccessfulLogIn).getPassword(sid.value);

    sid.value = "";
  }

  function loading() {
    let loader = document.querySelector(".loader");
    loader.style.visibility = "visible";
    loader.style.opacity = "1";
  }

  function loaded() {
    let loader = document.querySelector(".loader");
    loader.style.visibility = "hidden";
    loader.style.opacity = "0";
  }