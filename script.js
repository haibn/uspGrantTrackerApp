  function popupBtn() {
    let popupForm = document.getElementById("popupid");
    popupForm.style.display = "none";

    // Returns popup content to Error
    let alert = document.getElementById("popupH2");
    let context = document.getElementById("popupP");
    let tick = document.getElementById("tick");
    let ex = document.getElementById("ex");
    alert.innerHTML = "Error!";
    context.style.display = "block";
    tick.style.display = "none";
    ex.style.display = "inline-block";

    // Gets rid of grey overlay
    let overlay = document.getElementById("overlay");
    overlay.style.visibility = "hidden";
    overlay.style.opacity = "0";

    // Gets rid of forgot password button
    let forgotPasswordBtn = document.getElementById("forgot-password-popup-id");
    let forgotPasswordBr = document.getElementById("forgot-password-br");
    if (forgotPasswordBtn) {
      forgotPasswordBtn.remove();
      forgotPasswordBr.remove();
    }

    // Gets rid of loading animation
    loaded()
  }

  //password show/hide toggle
  function togglePassword() {
    let showPassword = document.getElementById("show-password");
    let showPasswordSignUp = document.getElementById("signup-show-password");
    let passwordField = document.getElementById("passwordlogin");
    let passwordFieldSignUp = document.getElementById("passwordSignup");

    let type = passwordField.getAttribute("type") === "password" ? "text" : "password";
    passwordField.setAttribute("type", type);

    if (type == "password") {
      showPassword.style.color = "white";
    } else {
      showPassword.style.color = "#f8b501";
    }

    let signUpType = passwordFieldSignUp.getAttribute("type") === "password" ? "text" : "password";
    passwordFieldSignUp.setAttribute("type", type);

    if (signUpType == "password") {
      showPasswordSignUp.style.color = "white";
    } else {
      showPasswordSignUp.style.color = "#f8b501";
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

    // Gets rid of forgot password button by calling the popup button
    let forgotPasswordBtn = document.getElementById("forgot-password-popup-id");
    if (forgotPasswordBtn) {
      popupBtn();
    }
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
    let sigContent = document.getElementById("signature-content-id");

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
      sigContent.style.color = "white";
    } else {
      home.style.display = "block";
      loginForm.style.display = "none";
    }

    records.textContent = "";
  }

  // Failure Handler function used to alert the user if the inputted SID is not found in the database (google sheets)
  function accountNotCreated(error) {
    showPopup();
    let alert = document.getElementById("popupH2");
    let context = document.getElementById("popupP");
    let errorMsgSplit = error.toString().split("Error: ")[2];
    let errorMsgSplitFinal = errorMsgSplit.split(": ");
    alert.innerHTML = errorMsgSplitFinal[0];
    context.innerHTML = errorMsgSplitFinal[1];
  }

  // Success Handler function to let the user know the account was created successfully
  function accountCreatedSuccessfully() {
    showPopup();
    let alert = document.getElementById("popupH2");
    let context = document.getElementById("popupP");
    let tick = document.getElementById("tick");
    let ex = document.getElementById("ex");
    alert.innerHTML = "Account Created Successfully!";
    context.style.display = "none";
    tick.style.display = "inline-block";
    ex.style.display = "none";
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
      showPopup();
      let context = document.getElementById("popupP");
      context.innerHTML = "Missing fields.";
    }
  }

  // Failure Handler function used to alert the user that he could not login
  function unsuccessfulLogIn(error) {
    showPopup();

    let popup = document.getElementById("popupid");
    let alert = document.getElementById("popupH2");
    let context = document.getElementById("popupP");
    let errorMsgSplit = error.toString().split("Error: ")[2];
    let errorMsgSplitFinal = errorMsgSplit.split(": ");

    alert.innerHTML = errorMsgSplitFinal[0];
    context.innerHTML = errorMsgSplitFinal[1];

    // Add forgot password button to popup
    if (errorMsgSplitFinal[0] == "Incorrect password") {
      popup.innerHTML += "<br id='forgot-password-br'>";
      popup.innerHTML += "<button type='text' class='forgot-password-popup' id='forgot-password-popup-id' onclick='forgotPasswordForm()'>Forgot your password?</button>";
    }
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
    let backBtn = document.getElementById("backBtn");
    let popup = document.getElementById("popup");

    // stores user's name and sid on index.html
    let newName = document.getElementById("summName");
    let newSid = document.getElementById("summSid");
    if (quickSearchForm.style.display == "block") {
      newName.innerHTML = "<span style='background-color: #FF8C00; color: #003262; border-radius: 6px;'>" + name[0] + "</span>";
      backBtn.innerHTML = "Back";
    } else {
      newName.innerHTML = name[0];
      backBtn.innerHTML = "Log out";
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
    let sigContent = document.getElementById("signature-content-id");
    sig.style.color = "#003262";
    sigContent.style.color = "black";

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
    let email = document.getElementById("emailQuickSearch").value;

    // displays announcements
    google.script.run.withSuccessHandler(displayAnnouncements).getAnnouncements();

    google.script.run.withSuccessHandler(loggedIn).withFailureHandler(unsuccessfulLogIn).newQuickSearch(sid, email);
    document.getElementById("sidQuickSearch").value = "";
    document.getElementById("emailQuickSearch").value = "";
  }

  // Displays announcements to user
  function displayAnnouncements(content) {
    let announcement = document.getElementById("announcement-text");
    announcement.innerHTML = content;
  }

  // Alerts users if password is retrieved successfully
  function passwordRetrieved() {
    showPopup();
    let alert = document.getElementById("popupH2");
    let context = document.getElementById("popupP");
    let tick = document.getElementById("tick");
    let ex = document.getElementById("ex");
    alert.innerHTML = "Please check your email for your password.";
    context.style.display = "none";
    tick.style.display = "inline-block";
    ex.style.display = "none";
  }

  // Retrieves password and sends it to the user
  function forgotPassword() {
    loading();
    let sid = document.getElementById("sidForgotPassword").value;
    let email = document.getElementById("emailPasswordRecovery").value;

    google.script.run.withSuccessHandler(passwordRetrieved).withFailureHandler(unsuccessfulLogIn).getPassword(sid, email);

    document.getElementById("sidForgotPassword").value = "";
    document.getElementById("emailPasswordRecovery").value = "";
  }

  function loading() {
    let loader = document.querySelector(".loader");
    loader.style.visibility = "visible";
    loader.style.opacity = "0.9";
  }

  function loaded() {
    let loader = document.querySelector(".loader");
    loader.style.visibility = "hidden";
    loader.style.opacity = "0";
  }

  function showPopup() {
    let popupForm = document.getElementById("popupid");
    let overlay = document.getElementById("overlay");
    popupForm.style.display = "block";
    overlay.style.visibility = "visible";
    overlay.style.opacity = "0.26";
  }