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
    return await pool.query(sql, [firstName, lastName, email, password])
  } catch (error) {
    console.error("Database error in registerAccount:", error)
    throw error
  }
}

/* *************************
* Return account data using email address
* ************************ */
async function getAccountByEmail(account_email) {
  try {
    const sql = `
      SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password
      FROM account
      WHERE LOWER(account_email) = LOWER($1)
      ORDER BY account_id DESC
      LIMIT 1
    `
    const result = await pool.query(sql, [account_email])
    return result
  } catch (error) {
    console.error("Database error in getAccountByEmail:", error)
    throw error
  }
}

/* *************************
* Return account data using account_id
* ************************ */
async function getAccountById(accountId) {
  try {
    const sql = `
      SELECT account_id, account_firstname, account_lastname, account_email, account_type
      FROM account
      WHERE account_id = $1
    `
    const result = await pool.query(sql, [accountId])
    return result.rows[0]
  } catch (error) {
    console.error("Database error in getAccountById:", error)
    throw error
  }
}

/* *************************
* Update account information
* ************************ */
async function updateAccount(accountId, updatedData) {
  try {
    const sql = `
      UPDATE account
      SET account_firstname = $1,
          account_lastname = $2,
          account_email = $3
      WHERE account_id = $4
      RETURNING *
    `
    const values = [
      updatedData.account_firstname,
      updatedData.account_lastname,
      updatedData.account_email,
      accountId
    ]
    const result = await pool.query(sql, values)
    return result.rows[0]
  } catch (error) {
    console.error("Database error in updateAccount:", error)
    throw error
  }
}

async function updatePassword(accountId, hashedPassword) {
  return pool.query(
    `UPDATE account
     SET account_password = $1
     WHERE account_id = $2
     RETURNING *`,
    [hashedPassword, accountId]
  );
}



module.exports = { 
  registerAccount,
  getAccountByEmail,
  getAccountById,
  updateAccount,
  updatePassword
}
