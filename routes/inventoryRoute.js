const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")

// Inventory homepage
router.get("/", invController.buildInventory)

// Classification view
router.get("/type/:classificationId", invController.buildByClassificationId)

module.exports = router
