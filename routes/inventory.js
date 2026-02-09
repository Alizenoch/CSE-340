const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");
const invValidate = require("../utilities/inventory-validation");
const invModel = require("../models/inventory-model"); // import my model here
const utilities = require("../utilities/"); // Importing utilities

// Inventory homepage (public)
router.get("/", invController.buildInventory);

// Classification view (public)
router.get("/classification/:classificationId", invController.buildByClassificationId);

// Detail view (single inventory item) (public)
router.get("/details/:invId", invController.buildByInvId);

// Management page (🔒 Admin only)
router.get("/management", utilities.checkAccountType, invController.showManagement);

// Add Classification (GET + POST) (🔒 Admin only)
router.get("/add-classification", utilities.checkAccountType, invController.buildAddClassification);
router.post("/add-classification",
    utilities.checkAccountType,
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    invController.processAddClassification
);

// Add Inventory (GET + POST) (🔒 Admin only)
router.get("/add-inventory", utilities.checkAccountType, invController.buildAddInventory);
router.post("/add-inventory", 
    utilities.checkAccountType,
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    invController.processAddInventory
);

// Edit/Delete Inventory (🔒 Admin only)
router.get("/edit/:id", utilities.checkAccountType, invController.buildEditVehicle);
router.post("/edit/:id", utilities.checkAccountType, invController.updateVehicle);
router.post("/delete/:id", utilities.checkAccountType, invController.deleteVehicle);

// Intentional error route (public)
router.get("/trigger-error", invController.triggerError);

// Public JSON endpoint
router.get("/getInventory/:classificationId", async (req, res, next) => {
    try {
        const classificationId = req.params.classificationId;
        const data = await invModel.getInventoryByClassification(classificationId); 
        res.json(data);
    } catch (error) {
        next(error);
    }
});

// Classification view using query string (?classificationId=3) (public)
router.get("/classification", async (req, res, next) => {
  try {
    const classificationId = req.query.classificationId;
    req.params.classificationId = classificationId;
    return invController.buildByClassificationId(req, res, next);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
