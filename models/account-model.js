/* *********************
*  Account Model
* ******************** */

// Bring in the database connection pool
const pool = require("../database/")

/* *********************
* Register new account
* ********************* */
async function registerAccount(firstName, lastName, email, password) {
  try {
    const sql = `
      INSERT INTO account
      (account_firstname, account_lastname, account_email, account_password, account_type)
      VALUES ($1, $2, $3, $4, 'Client')
      RETURNING *
    `
    // ✅ RETURNING * ensures regResult.rows contains the new account
    return await pool.query(sql, [firstName, lastName, email, password])
  } catch (error) {
    console.error("Database error in registerAccount:", error)
    throw error   // better to throw so controller can catch
  }
}

module.exports = { registerAccount }
