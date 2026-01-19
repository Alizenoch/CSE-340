const invController = {}

// Inventory homepage
invController.buildInventory = (req, res) => {
  res.render("inventory/index", { title: "Inventory Management" })
}

// Classification view
invController.buildByClassificationId = (req, res) => {
  const classificationId = req.params.classificationId
  res.render("inventory/classification", { title: "Classification " + classificationId })
}

module.exports = invController
