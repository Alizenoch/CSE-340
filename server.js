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
const static = require("./routes/static")

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* ***********************
 * Routes
 *************************/
app.use(static)
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
const host = process.env.HOST || "localhost"

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`App listening on ${host}:${port}`)
})

module.exports = { app, pool }
