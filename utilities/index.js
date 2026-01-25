const invModel = require("../models/inventory-model")
const Util = {}

/* *******************************
 * Constructs the nav HTML unordered list
************************************/
Util.getNav = async function (req, res, next) {
    try {
    let data = await invModel.getClassifications() // returns rows array 
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'

    data.forEach((row) => {
        list += "<li>"
        list += `<a href="/inv/type/${row.classification_id}"
        title="See our inventory of ${row.classification_name} vehicles">
        ${row.classification_name}</a>
        </li>`
    })
        
        list += "</ul>"
        return list
} catch (error) {
        console.error("getNav error:", error)
        throw error // rethrow so controller can handle}
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
        grid += `<li>
          <a href="../../inv/detail/${vehicle.inv_id}" 
          title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
            <img src="${vehicle.inv_thumbnail}" 
            alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" />
          </a>
          <div class="namePrice">
            <hr />
            <h2>
              <a href="../../inv/detail/${vehicle.inv_id}" 
              title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
                ${vehicle.inv_make} ${vehicle.inv_model}
              </a>
            </h2>
            <span>$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</span>
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
    throw error // re-throw so controller can handle
  }
}

/* ********************************
 * Build HTML for a single vehicle detail view
 * ******************************** */
 Util.buildVehicleDetailHTML = function(vehicle) {
    try {
    let html = `
    <div class="vehicle-detail">
        <h2>${vehicle.inv_make} ${vehicle.inv_model}</h2>
        <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
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
          throw error // re-throw so controller can handle 
        }
 }   

/* ********************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error handling
 * ******************************** */
 Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util
   

