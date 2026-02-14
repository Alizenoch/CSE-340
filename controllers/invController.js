const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const Comment = require("../models/comment");

const invController = {}

/* ================================
   Inventory Homepage
================================ */
invController.buildInventory = async (req, res, next) => {
  try {
    const nav = await utilities.getNav()
    res.render("inventory/index", { 
      title: "Inventory Management",
      nav
    })
  } catch (error) {
    next(error)
  }
}

/* ================================
   Classification View
================================ */
invController.buildByClassificationId = async (req, res, next) => {
  try {
    const classificationId = req.params.classificationId
    const data = await invModel.getInventoryByClassification(classificationId)
    const nav = await utilities.getNav()

    if (!data || data.length === 0) {
      return res.render("inventory/classification", {
        title: "No Vehicles Found", 
        nav,
        grid: "<p>No vehicles are available in this classification.</p>"
      })
    }

    const grid = await utilities.buildClassificationGrid(data)    
    const className = data[0].classification_name

    res.render("inventory/classification", {
      title: `${className} Vehicles`,
      nav,
      grid
    })
  } catch (error) {
    next(error)
  }
}

/* ================================
   Detail View (Single Item)
================================ */
invController.buildByInvId = async (req, res, next) => {
  try {
    const invId = req.params.invId
    const itemData = await invModel.getItemById(invId)
    const nav = await utilities.getNav()

    if (!itemData) {
      return res.status(404).render("errors/404", {
        title: "Item Not Found",
        nav
      })
    }

    // Fetch comments for this item
    const comments = await Comment.findByItem(invId);
    // Pass both comments and account into the view
    res.render("inventory/details", {
      title: `${itemData.inv_make} ${itemData.inv_model} (${itemData.inv_year})`,
      nav,
      item: itemData,
      comments: comments, // now available in details.ejs
      account: req.session.account // so EJS can check if user is logged in and owns comments
    }); 
  } catch (error) {
    next(error);
  }
};

/* ================================
   Error Testing Route
================================ */
invController.triggerError = (req, res, next) => {
  const error = new Error("Intentional 500 error triggered for testing")
  error.status = 500
  next(error)
}

/* ================================
   Management View
================================ */
invController.showManagement = async (req, res, next) => {
  try {
    // Build navigation bar
    const nav = await utilities.getNav()
     // Build classification select list
     const classificationSelect = await utilities.buildClassificationList()

    //render the management view
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      classificationSelect, //pass to view
      showGlobalHeader: false,
      
      messages: {
        error: req.flash("error"),
        success: req.flash("success")
      },
      showGlobalFooter: false // hide global footer
    })
  } catch (error) {
    next(error)
  }
}


/* ================================
   Add Classification (GET)
================================ */
invController.buildAddClassification = async (req, res, next) => {
  try {
    const nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      messages: {
        error: req.flash("error"),
        success: req.flash("success")
      },
      showGlobalHeader: false,
      showGlobalFooter: false
    })
  } catch (error) {
    next(error)
  }  
}

/* ================================
   Add Inventory Item (GET)
================================ */
invController.buildAddInventory = async (req, res, next) => {
  try {
    const nav = await utilities.getNav()
    // ✅ CHANGE: build classification list dynamically
    const classificationList = await utilities.buildClassificationList()
    res.render("inventory/add-inventory", {
      title: "Add New Inventory Item",
      nav,
      classificationList, // ✅ CHANGE: pass to view
      messages: {
        error: req.flash("error"),
        success: req.flash("success")
      },
      showGlobalHeader: false,
      showGlobalFooter: false
    })
  } catch (error) {
    next(error)
  }
}

/* ================================
   Add Classification (POST)
================================ */
invController.processAddClassification = async (req, res, next) => {
  try {
    const { classificationName } = req.body
    await invModel.addClassification(classificationName)
    req.flash("success", "Classification added successfully!")
    res.redirect("/inv/management")
  } catch (error) {
    req.flash("error", "Failed to add classification.")
    next(error)
  }  
}

/* ================================
   Add Inventory Item (POST)
================================ */
invController.processAddInventory = async (req, res, next) => {
  try {
    const { make, model, year, price, miles, color, description, image, thumbnail, classificationId } = req.body
    const result = await invModel.addInventory({ make, model, year, price, miles, color, description, image, thumbnail, classificationId })

    if (result) {
      req.flash("success", "Vehicle added successfully!")
      res.redirect("/inv/management")
    } else {
      throw new Error("Insert failed")
    }
  } catch (error) {
    req.flash("error", "Failed to add vehicle.")
    const nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList(req.body.classificationId)
    res.render("inventory/add-inventory", {
      title: "Add New Inventory Item",
      nav,
      classificationList,
      make: req.body.make,
      model: req.body.model,
      year: req.body.year,
      price: req.body.price,
      miles: req.body.miles,
      color: req.body.color,
      description: req.body.description,
      image: req.body.image,
      thumbnail: req.body.thumbnail,
      messages: {
        error: req.flash("error"),
        success: req.flash("success")
      }
    })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invController.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ================================
   Edit Vehicle (GET)
================================ */
invController.buildEditVehicle = async (req, res, next) => {
  try {
    const invId = req.params.id;
    const vehicle = await invModel.getItemById(invId);
    const nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList(vehicle.classification_id);

    if (!vehicle) {
      req.flash("error", "Vehicle not found.");
      return res.redirect("/inv/management");
    }

    res.render("inventory/edit-inventory", {
      title: `Edit ${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      classificationList,
      vehicle
    });
  } catch (error) {
    next(error);
  }
};

/* ================================
   Update Vehicle (POST)
================================ */
invController.updateVehicle = async (req, res, next) => {
  try {
    const { inv_id, make, model, year, price, miles, color, description, image, thumbnail, classification_id } = req.body;
    const result = await invModel.updateInventory({ inv_id, make, model, year, price, miles, color, description, image, thumbnail, classification_id });

    if (result) {
      req.flash("success", "Vehicle updated successfully!");
      res.redirect("/inv/management");
    } else {
      throw new Error("Update failed");
    }
  } catch (error) {
    req.flash("error", "Failed to update vehicle.");
    next(error);
  }
};

/* ================================
   Delete Vehicle (POST)
================================ */
invController.deleteVehicle = async (req, res, next) => {
  try {
    const { inv_id } = req.body;
    const result = await invModel.deleteInventory(inv_id);

    if (result) {
      req.flash("success", "Vehicle deleted successfully!");
      res.redirect("/inv/management");
    } else {
      throw new Error("Delete failed");
    }
  } catch (error) {
    req.flash("error", "Failed to delete vehicle.");
    next(error);
  }
};

/* ================================
   Export Controller
================================ */
module.exports = invController

