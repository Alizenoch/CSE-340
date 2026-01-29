const { Pool } = require("pg")
require("dotenv").config()
/* ************
 * Connection Pool
 * Handles SSL depending on environment
 * ************* */   
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
}) 
// In development, wrap queries with logging for easier debugging
if (process.env.NODE_ENV === "development") {
    const originalQuery = pool.query.bind(pool)
    pool.query = async (text, params) => {
        try {
            const res = await originalQuery(text, params)
            console.log("Executed query:", text)
            return res
         }  catch (error) {
                console.error("Error in query:", text, error.message)
                throw error
         }
    }
}
  
    module.exports = pool