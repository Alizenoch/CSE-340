/* ******************************************
 * This server.js file is the primary file of the 
 * application. It controls the project setup.
 ******************************************/

/* ***********************
 * Require Statements
 *************************/
require("dotenv").config()
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const { Pool } = require("pg")   // PostgreSQL client
const app = express()
const staticRoutes = require("./routes/static")

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* ***********************
 * Middleware
 *************************/
// Serve static files from the "public" folder
app.use(express.static("public"))

/* ***********************
 * Routes
 *************************/
// Explicit homepage route
app.get("/", (req, res) => {
  res.render("index", { title: "Home" })
})

// Mount static routes at root
app.use("/", staticRoutes)

/* ***********************
 * Database Connection
 *************************/
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Use SSL only in production (Render/Heroku)
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
})

// Test the connection on startup with a query
pool.query("SELECT NOW()", (err, result) => {
  if (err) {
    console.error("❌ Database connection error:", err.message)
  } else {
    console.log("✅ Connected to PostgreSQL at:", result.rows[0].now)
  }
})

/* ***********************
 * Local Server Information
 *************************/
const port = process.env.PORT || 5500

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`🚀 App listening on port ${port}`)
})

module.exports = { app, pool }
