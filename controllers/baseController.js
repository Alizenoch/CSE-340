  const utilities =require("../utilities/")
  const baseController = {}

  baseController.buildHome = async function(req, res, next) {
    try {
    const nav = await utilities.getNav()
    req.flash("notice", ". This is a flash message.")
    res.render("index", {title: "Home", nav})
  } catch (error) {
    next(error) // Passes error to global error handler in server.js
  }
  }
  
   module.exports = baseController