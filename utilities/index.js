const invModel = require("../models/inventory-model")
const pool = require("../database") // keep this for querying classification
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()


/* *******************************
 * Constructs the nav HTML unordered list
************************************/
Util.getNav = async function () {
  try {
    let data = await invModel.getClassifications()
    let list = '<ul class="nav-links">'
    list += '<li><a href="/" title="Home page">Home</a></li>'
    //list += '<li><a href="/inv/management" title="Inventory Management">Management</a></li>'

    data.forEach((row) => {
      list += "<li>"
      list += `<a href="/inv/classification/${row.classification_id}"
        title="See our inventory of ${row.classification_name} vehicles">
        ${row.classification_name}</a>
        </li>`
    })
        
    list += "</ul>"
    // console.log("Generated nav:", list)
    return list
  } catch (error) {
    console.error("getNav error:", error)
    throw error
  }        
}

/* **********************************
 * Build classification dropdown List
 * ******************************** */
 Util.buildClassificationList = async function(selectedId = null) { 
  try { 
    const data = await pool.query( "SELECT classification_id, classification_name FROM public.classification ORDER BY classification_name" 

    )
    
    let options = "" // ✅ renamed to match return 
    data.rows.forEach(row => {
       const selected = selectedId == row.classification_id ? "selected" : ""
        options += `<option value="${row.classification_id}" ${selected}>${row.classification_name}</option>` 
      }) 
        return options // ✅ now consistent 
      } catch (error) {
         console.error("buildClassificationList error:", error) 
         return "<option value=''>Error loading classifications</option>" // ✅ corrected HTML 
      } 
    }
 

/* ********************************
 * Build the classification view HTML
 * ******************************** */
Util.buildClassificationGrid = async function (data) {
  try {
    let grid
    if (data.length > 0) {
      grid = '<ul id="inv-display">'
      data.forEach((vehicle) => {
       // console.log("Vehicle row:", vehicle)

        // ✅ Use full image if available, otherwise fallback to thumbnail
        const imagePath = vehicle.inv_image || vehicle.inv_thumbnail

        grid += `<li>
          <a href="/inv/details/${vehicle.inv_id}" 
          title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
            <img src="${imagePath}" 
            alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" />
          </a>
          <div class="namePrice">
            <hr />
            <h2>
              <a href="/inv/details/${vehicle.inv_id}" 
              title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
                ${vehicle.inv_make} ${vehicle.inv_model} (${vehicle.inv_year})
              </a>
            </h2>
            <span>$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</span>
            <p>${vehicle.inv_description}</p>
          </div>
        </li>`
      })
      grid += '</ul>'
    } else {
      grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
  } catch (error) {
    console.error("buildClassificationGrid error:", error)
    throw error
  }
}

/* ********************************
 * Build HTML for a single vehicle detail view
 * ******************************** */
Util.buildVehicleDetailHTML = function(vehicle) {
  try {
    // ✅ Use full image if available, otherwise fallback to thumbnail
    const imagePath = vehicle.inv_image || vehicle.inv_thumbnail

    let html = `
    <div class="vehicle-detail">
        <h2>${vehicle.inv_make} ${vehicle.inv_model}</h2>
        <img src="${imagePath}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
        <p><strong>Price:</strong> $${new Intl.NumberFormat().format(vehicle.inv_price)}</p>
        <p><strong>Description:</strong> ${vehicle.inv_description}</p>
        <p><strong>Year:</strong> ${vehicle.inv_year}</p>
        <p><strong>Color:</strong> ${vehicle.inv_color}</p>
        <p><strong>Miles:</strong> ${vehicle.inv_miles}</p>
    </div>
    `
    return html
  } catch (error) {
    console.error("buildVehicleDetailHTML error:", error) 
    throw error
  }
}   

/* **********************************
* Middleware to check token validity
* ********************************* */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("notice", "Please log in") // ✅ type + message
          res.clearCookie("jwt")
          return res.redirect("/account/login")
        }
        req.user = accountData
        res.locals.accountData = accountData
        res.locals.loggedin = 1
        next()
      }
    )
  } else {
    next()
  }
}

/* ********************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error handling
 * ******************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

// Middleware for ensureAuthenticated
Util.ensureAuthenticated = (req, res, next) => {
  if (req.user) {
    return next();
    }
    req.flash("notice", "Please log in to access your account");
    res.redirect("/account/login");
    };

   // Middleware to check account type for inventory admin routes
function checkAccountType(req, res, next) {
  const account = req.user || res.locals.accountData;

  if (account && (account.account_type === "Employee" || account.account_type === "Admin")) {
    next(); // authorized
  } else {
    req.flash("notice", "You must be logged in as an Employee or Admin to access that page.");
    return res.redirect("/account/login");
  }
}

Util.checkAccountType = checkAccountType;

module.exports = Util
