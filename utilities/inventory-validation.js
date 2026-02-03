const { body, validationResult } = require("express-validator");
const utilities = require("./"); // so we can rebuild nav/classification list

// Rules for adding a classification
const classificationRules = () => {
  return [
    body("classificationName")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a classification name.")
      .matches(/^[A-Za-z]+$/)
      .withMessage("Classification name must contain only letters, no spaces or special characters."),
  ];
};

// Rules for adding inventory
const inventoryRules = () => {
  return [
    body("make").trim().isLength({ min: 1 }).withMessage("Please provide the vehicle make."),
    body("model").trim().isLength({ min: 1 }).withMessage("Please provide the vehicle model."),
    body("year").isInt({ min: 1900, max: new Date().getFullYear() + 1 }).withMessage("Please provide a valid year."),
    body("price").isFloat({ min: 0 }).withMessage("Please provide a valid price."),
    body("classificationId").isInt().withMessage("Please select a classification."),
  ];
};

// Error handling middleware for classification
const checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    return res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      classificationName: req.body.classificationName,
      messages: { error: errors.array().map(err => err.msg), success: [] },
    });
  }
  next();
};

// Error handling middleware for inventory
const checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList(req.body.classificationId);
    return res.render("inventory/add-inventory", {
      title: "Add New Inventory Item",
      nav,
      classificationList,
      make: req.body.make,
      model: req.body.model,
      year: req.body.year,
      price: req.body.price,
      messages: { error: errors.array().map(err => err.msg), success: [] },
    });
  }
  next();
};

module.exports = { classificationRules, inventoryRules, checkClassificationData, checkInventoryData };
