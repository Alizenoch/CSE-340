// Needed Resources
const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");

// Inventory homepage
router.get("/", invController.buildInventory);

// Classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Detail view (single inventory item)
router.get("/details/:invId", invController.buildByInvId);

// Intentional error route
router.get('/trigger-error' , invController.triggerError);

module.exports = router;
