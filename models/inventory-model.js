const pool = require("../database/")

/* ********************************
 * Get all classification data
 * ******************************** */
async function getClassifications() {
  try {
    const data = await pool.query(
      // ✅ corrected: explicitly select only needed columns
      "SELECT classification_id, classification_name FROM public.classification ORDER BY classification_name"
    )
    return data.rows
  } catch (error) {
    console.error("getClassifications error:", error.message)
    throw error
  }
}

/* ***********************************
 * Get vehicles by classification
 * ********************************* */
async function getInventoryByClassification(classificationId) {
  try {
    const data = await pool.query(   
      // ✅ corrected: explicitly select inventory fields + classification_name
      `SELECT i.inv_id, i.inv_make, i.inv_model, i.inv_year, i.inv_price, 
              i.inv_miles, i.inv_color, i.inv_description, i.inv_image, i.inv_thumbnail,
              c.classification_name
       FROM public.inventory AS i
       JOIN public.classification AS c
         ON i.classification_id = c.classification_id
       WHERE i.classification_id = $1`,
      [classificationId]
    )
    return data.rows
  } catch (error) {
    console.error("getInventoryByClassification error:", error.message)
    throw error
  }
}

/* *******************************
 * Get a single vehicle by inventory ID
 * ****************************** */
async function getItemById(invId) {
  try {
    const data = await pool.query(
      // ✅ corrected: explicitly select inventory fields + classification_name
      `SELECT i.inv_id, i.inv_make, i.inv_model, i.inv_year, i.inv_price, 
              i.inv_miles, i.inv_color, i.inv_description, i.inv_image, i.inv_thumbnail,
              c.classification_name
       FROM public.inventory AS i
       JOIN public.classification AS c
         ON i.classification_id = c.classification_id
       WHERE i.inv_id = $1`,
      [invId]
    )
    return data.rows[0] // return just one vehicle object
  } catch (error) {
    console.error("getItemById error:", error.message)
    throw error
  }
}
 
module.exports = {
  getClassifications,
  getInventoryByClassification,
  getItemById
}
