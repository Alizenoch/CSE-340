/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

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
// Mount static routes at root
app.use("/", staticRoutes)

// Explicit homepage route
app.get("/", (req, res) => {
  res.render("index", { title: "Home" })
})

/* ***********************
 * Database Connection
 *************************/
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

// Test the connection on startup with a query
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("❌ Database connection error:", err)
  } else {
    console.log("✅ Connected to PostgreSQL at:", res.rows[0].now)
  }
})

/* ***********************
 * Local Server Information
 *************************/
const port = process.env.PORT || 3000

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})

module.exports = { app, pool }
