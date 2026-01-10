const express = require("express")
const router = express.Router()

/* ***********************
 * Static Routes
 *************************/

// Homepage route (optional here, but you can keep it if you prefer routes centralized)
router.get("/", (req, res) => {
  res.render("index", { title: "Home" })
})

/* ***********************
 * Export Router
 *************************/
module.exports = router



