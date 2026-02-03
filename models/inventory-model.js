const pool = require("../database/")

/* ********************************
 * Get all classification data
 * ******************************** */
async function getClassifications() {
  try {
    const data = await pool.query(
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
      `SELECT i.inv_id, i.inv_make, i.inv_model, i.inv_year, i.inv_price, 
              i.inv_miles, i.inv_color, i.inv_description, i.inv_image, i.inv_thumbnail,
              c.classification_name
       FROM public.inventory AS i
       JOIN public.classification AS c
         ON i.classification_id = c.classification_id
       WHERE i.inv_id = $1`,
      [invId]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getItemById error:", error.message)
    throw error
  }
}

/* ***************************
 * Add a new Classification
 * ************************** */
async function addClassification(classificationName) {
  try {
    const sql = "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *"
    const data = await pool.query(sql, [classificationName])
    return data.rows[0]
  } catch (error) {
    console.error("addClassification error:", error.message)
    throw error
  }
}

/* *****************************
 * Add a new inventory item
 * *************************** */
async function addInventory({ make, model, year, price, miles, color, description, image, thumbnail, classificationId }) {
  try {
    const sql = `
      INSERT INTO public.inventory 
      (inv_make, inv_model, inv_year, inv_price, inv_miles, inv_color, inv_description, inv_image, inv_thumbnail, classification_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`
    const values = [make, model, year, price, miles, color, description, image, thumbnail, classificationId]
    const data = await pool.query(sql, values)
    return data.rows[0]
  } catch (error) {
    console.error("addInventory error:", error.message)
    throw error
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassification,
  getItemById,
  addClassification,
  addInventory
}
