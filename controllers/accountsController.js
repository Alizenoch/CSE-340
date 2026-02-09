/* **********************
* Accounts Controller
* ********************** */
// Require model
const accountModel = require("../models/account-model")
// Require utilities (index.js in /utilities)
const utilities = require("../utilities")
// uncomment bcrypt before pushing it up
const bcrypt = require("bcrypt")

const jwt = require("jsonwebtoken");

/* **********************
*  Deliver login view
* ********************* */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav
  })
}

/* ******************************
*  Deliver registration view
* ***************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
}

/* *******************************
* Process Login
* ****************************** */
async function processLogin(req, res) {
  let nav = await utilities.getNav()
  const { email, password } = req.body

  try {
    const accountData = await accountModel.getAccountByEmail(email)
    // 🔍 Debug logs
    console.log("Login attempt email:", email)
    console.log("Login query result:", accountData.rows)

    if (accountData && accountData.rows.length > 0) {
      const account = accountData.rows[0]

      // ✅ Compare entered password with hashed password
      const match = await bcrypt.compare(password, account.account_password)

      if (match) {
        // Save account in session
        req.session.account = account;
         
        // ✅ Create JWT with all needed fields
        const jwtToken = jwt.sign(
          {
            account_id: account.account_id,
            account_type: account.account_type,
            account_firstname: account.account_firstname,
            account_lastname: account.account_lastname,
            account_email: account.account_email
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "2h" }
        );

        // ✅ Set JWT cookie
        res.cookie("jwt", jwtToken, { httpOnly: true, maxAge: 2 * 60 * 60 * 1000 });

        req.flash("notice", `Welcome back ${account.account_firstname}!`)
        res.redirect("/")
      } else {
        req.flash("notice", "Invalid password.")
        res.status(400).render("account/login", { title: "Login", nav })
      }
    } else {
      req.flash("notice", "No account found with that email.")
      res.status(400).render("account/login", { title: "Login", nav })
    }
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).render("account/login", { title: "Login", nav })
  }
}


/* ********************************
* Process Registration
* ******************************* */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { firstName, lastName, email, password } = req.body

  try {
    // ✅ Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10)

    // ✅ Pass the hashed password to the model
    const regResult = await accountModel.registerAccount(
      firstName,
      lastName,
      email,
      hashedPassword
    )

    // 🔍 Debug log
    console.log("Registration result:", regResult.rows)

    if (regResult.rows.length > 0) {
      req.flash(
        "success",
        `Congratulations, you're registered ${firstName}. Please log in.`
      )
      res.redirect("/account/login")
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/register", {
        title: "Registration",
        nav
      })
    }
  } catch (error) {
    console.error("Registration error:", error)
    req.flash("notice", "An error occurred during registration.")
    res.status(500).render("account/register", {
      title: "Registration",
      nav
    })
  }
}

/* *********************
*  Logout Controller
* ********************* */
async function logout(req, res) {
  res.clearCookie("jwt"); // ✅ clear JWT cookie
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    }
    res.redirect("/"); // Redirect to home after logout
  });
}

/* ************************
* Account Management view
* ************************ */
async function buildAccountManagement(req, res) {
  let nav = await utilities.getNav();
  const account = res.locals.accountData; // comes from JWT middleware

  res.render("account/management", {
    title: "Account Management",
    nav,
    account
  });
}

async function buildAccount(req, res) {
  let nav = await utilities.getNav();
  const account = res.locals.accountData; // comes from JWT middleware
  res.render("account/management", {
    title: "My Account",
    nav,
    account
  });
}

/* ************************
* Update Account Information
* ************************ */
async function updateAccountView(req, res) {
  const accountId = req.params.accountId;
  const account = await accountModel.getAccountById(accountId);
  let nav = await utilities.getNav();
  res.render('account/update', {
    title: "Update Account Information",
    nav,
    account
  });
}

async function processUpdateAccount(req, res) {
  try {
    const accountId = req.params.accountId;
    const { account_firstname, account_lastname, account_email } = req.body;

    // ✅ Server-side validation
    if (!account_firstname || !account_lastname || !account_email) {
      req.flash("error", "All fields are required.");
      return res.redirect(`/account/update/${accountId}`);
    }

    // ✅ Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(account_email)) {
      req.flash("error", "Please enter a valid email address.");
      return res.redirect(`/account/update/${accountId}`);
    }

    // ✅ If validation passes, update account
    await accountModel.updateAccount(accountId, {
      account_firstname,
      account_lastname,
      account_email
    });

    req.flash("success", "Account information updated successfully.");
    res.redirect("/account/management");
  } catch (error) {
    console.error("Error in processUpdateAccount:", error);
    req.flash("error", "Update failed. Please try again.");
    res.redirect(`/account/update/${req.params.accountId}`);
  }
}


async function processUpdatePassword(req, res) {
  try {
    const accountId = req.params.accountId;
    const { password, confirmPassword } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
      req.flash("error", "Passwords do not match.");
      return res.redirect(`/account/update/${accountId}`);
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Call model function to update password
    await accountModel.updatePassword(accountId, hashedPassword);

    req.flash("success", "Password updated successfully.");
    res.redirect("/account/management");
  } catch (error) {
    console.error("Error in processUpdatePassword:", error);
    req.flash("error", "Password update failed. Please try again.");
    res.redirect(`/account/update/${req.params.accountId}`);
  }
}




module.exports = {
  buildLogin,
  buildRegister, 
  processLogin,
  registerAccount,
  logout,
  buildAccountManagement,
  buildAccount,
  updateAccountView,
  processUpdateAccount,
  processUpdatePassword
}
