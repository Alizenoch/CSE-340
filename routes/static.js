const express = require("express")
const router = express.Router()

/* ***********************
 * Static Routes
 *************************/
// Example: About page
router.get("/about", (req, res) => {
  res.render("about", { title: "About" })
})

// Example: Contact page
router.get("/contact", (req, res) => {
  res.render("contact", { title: "Contact" })
})

/* ***********************
 * Export Router
 *************************/
module.exports = router



