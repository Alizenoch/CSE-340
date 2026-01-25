const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invController = {}


// Inventory homepage
invController.buildInventory = (req, res, next) => {
  try {
    res.render("inventory/index", { title: "Inventory Management" })
  } catch (error) {
    next(error) // Forward errors to global handler
  }
}

// Build inventory Classification view
invController.buildByClassificationId = async function (req, res, next) {
  try {
    // 1. Get classification ID from URL
  const classificationId = req.params.classificationId

  // 2. Query database for vehicles in this classification
  const data = await invModel.getInventoryByClassification(classificationId)

  // 3. Build grid and navigation
  const grid = await utilities.buildClassificationGrid(data) 
  const nav = await utilities.getNav()

  // 4. Handle case where no data is found
  if (!data || data.length === 0) {
  return res.status(404).render("errors/404", { 
    title: "Classification Not Found", 
    nav,
   })
}

// 5. Render classification view
const className = data[0].classification_name
res.render("inventory/classification", {
  title: `${className} Vehicles`,
  nav,
  grid
})
} catch (error) {
  next(error) // Forward errors to global handler
}
}


// New detail view controller
invController.buildById = async function (req, res, next) {
  try {
    // 1. Get the inventory ID from the URL parameter
    const invId = req.params.invId

    // 2. Query the database for this specific item
    const itemData = await invModel.getItemById(invId)

    // 3. Build the navigation
    const nav = await utilities.getNav()

    // 4. Handle case where item is not found
    if (!itemData) {
      return res.status(404).render("errors/404", {
        title: "Item Not Found",
        nav
      })
    }

   // 5. Render the single detail view 
   res.render("inventory/details", {
      title: `${itemData.inv_make} ${itemData.inv_model} (${itemData.inv_year})`,
      nav,
      item: itemData
   }) 
  } catch (error) {
    next(error) // Pass errors to Express error handler
  }

}

// inventoryController.js
invController.triggerError = (req, res, next)  => {
  const error = new Error('Intentional 500 error triggered for testing');
  error.status = 500;
    next(error); // Pass error to middleware
  }

 
  // Export the Controller object at the end of the file
  module.exports = invController
