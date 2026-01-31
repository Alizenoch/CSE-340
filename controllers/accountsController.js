/* **********************
* Accounts Controller
* ********************** */
// Require model
const accountModel = require("../models/account-model")
// Require utilities (index.js in /utilities)
const utilities = require("../utilities")
// uncomment bcrypt before pushing it up
// const bcrypt = require("bcrypt")

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

    if (accountData && accountData.rows.length > 0) {
      const account = accountData.rows[0]

      if (account.account_password === password) {
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

  const regResult = await accountModel.registerAccount(
    firstName,
    lastName,
    email,
    password
  )

  if (regResult.rows.length > 0) {
    req.flash(
      "notice",
      `Congratulations, you're registered ${firstName}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav
    })
  }
}

module.exports = { buildLogin, buildRegister, processLogin,  registerAccount }
