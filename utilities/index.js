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
      list += `<a href="/inventory/type/${row.classification_id}"
        title="See our inventory of ${row.classification_name} vehicles">
        ${row.classification_name}</a>
        </li>`
    })
        
    list += "</ul>"
    return list
  } catch (error) {
    console.error("getNav error:", error)
    throw error
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
        console.log("Vehicle row:", vehicle)

        // ✅ Use full image if available, otherwise fallback to thumbnail
        const imagePath = vehicle.inv_image || vehicle.inv_thumbnail

        grid += `<li>
          <a href="/inventory/details/${vehicle.inv_id}" 
          title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
            <img src="${imagePath}" 
            alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" />
          </a>
          <div class="namePrice">
            <hr />
            <h2>
              <a href="/inventory/details/${vehicle.inv_id}" 
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

/* ********************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error handling
 * ******************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util
