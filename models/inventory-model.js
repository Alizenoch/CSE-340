const pool = require("../database/")

/* ********************************
 * Get all classification data
 * ******************************** */
async function getClassifications() {
  try {
    const data = await pool.query(
      "SELECT * FROM public.classification ORDER BY classification_name"
    )
    return data.rows
  } catch (error) {
    console.error("getClassifications error:", error)
    throw error // re-throw so controller can handle
  }
}

/* ***********************************
 * Get vehicles by classification
 * ********************************* */
async function getInventoryByClassification(classificationId) {
  try {
    const data = await pool.query(   
      `SELECT * FROM public.inventory AS i
       JOIN public.classification AS c
       ON i.classification_id = c.classification_id
       WHERE i.classification_id = $1`,
      [classificationId] // ✅ fixed
    )
    return data.rows
  } catch (error) {
    console.error("getInventoryByClassification error:", error)
    throw error // re-throw so controller can handle
  }
}

/* *******************************
 * Get a single vehicle by inventory ID
 * ****************************** */
async function getItemById(invId) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
       JOIN public.classification AS c
       ON i.classification_id = c.classification_id
       WHERE i.inv_id = $1`,
      [invId]
    )
    return data.rows[0] // return just one vehicle object
  } catch (error) {
    console.error("getItemById error:", error)
    throw error // re-throw so controller can handle
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassification,
  getItemById
}
