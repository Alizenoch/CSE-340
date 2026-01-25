// Needed Resources
const express = require("express")
const router = express.Router()
const invController = require("../controllers/invController")

// Inventory homepage
router.get("/", invController.buildInventory)

// Classification view
router.get("/type/:classificationId", invController.buildByClassificationId)

// Detail view (single inventory item)
router.get("/detail/:invId", invController.buildById)

// Intentional error route
router.get('/trigger-error' , inventoryController.triggerError);

module.exports = router
