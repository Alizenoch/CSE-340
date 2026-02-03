const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");
const invValidate = require("../utilities/inventory-validation");

// Inventory homepage
router.get("/", invController.buildInventory);

// Classification view
router.get("/classification/:classificationId", invController.buildByClassificationId);

// Detail view (single inventory item)
router.get("/details/:invId", invController.buildByInvId);

// Management page
router.get("/management", invController.showManagement);

// Add Classification (GET + POST)
router.get("/add-classification", invController.buildAddClassification);
router.post("/add-classification",
    invValidate.classificationRules(),
    invValidate.checkClassificationData,   // ✅ added
    invController.processAddClassification
);

// Add Inventory (GET + POST)
router.get("/add-inventory", invController.buildAddInventory);
router.post("/add-inventory", 
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    invController.processAddInventory
);

// Intentional error route
router.get("/trigger-error", invController.triggerError);

module.exports = router;
