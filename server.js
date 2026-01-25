/* ******************************************
 * Primary server.js file
 * Controls project setup and configuration
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
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventory")
const utilities = require("./utilities")

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

// Parse incoming form data
app.use(express.urlencoded({ extended: true })) 
app.use(express.json())

/* ***********************
 * Database Connection
 *************************/
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
}) 

// Test the connection on startup
pool.query("SELECT NOW()", (err, result) => { 
  if (err) { 
    console.error("❌ Database connection error:", err.message) 
  } else {
    console.log("✅ Connected to PostgreSQL at:", result.rows[0].now) 
  } 
})

/* ***********************
 * Routes
 *************************/
// Explicit homepage route
app.get("/", baseController.buildHome)

// Database test route
app.get("/db-test", async (req, res) => {
  try { 
    const result = await pool.query("SELECT NOW()") 
    res.send(`Database connected! Current time: ${result.rows[0].now}`) 
  } catch (err) { 
    console.error("db-test error:", err) 
    res.status(500).send("Database connection failed") 
  } 
})

// Mount static and inventory routes
app.use("/", staticRoutes)
app.use("/inventory", inventoryRoute)

/* ***********************
 * File Not Found Route (404)
 *************************/
app.use(async (req, res, next) => { 
  try {
    let nav = await utilities.getNav() 
    res.status(404).render("errors/404", { 
      title: "404 - File Not Found", 
      message: "Sorry, the page you are looking for does not exist.", 
      nav 
    }) 
  } catch (error) {
    console.error("404 handler error:", error)
    res.status(404).send("404 - Page Not Found")
  }
})

/* ***********************
 * Express Error Handler (500)
 *************************/
app.use(async (err, req, res, next) => {
  try {
    let nav = await utilities.getNav()
    console.error(`Error at "${req.originalUrl}": ${err.message}`)
    res.status(err.status || 500).render("errors/500", {
      title: "500 - Server Error",
      message: err.message,
      nav
    }) 
  } catch (navError) {
    console.error("500 handler nav error:", navError)
    res.status(500).send("Server Error")
  }
})


/* ***********************
 * Intentional Error
 *********************** */
app.use((err, req, res, next) => {
  console.error(err.stack); // log error for debugging
  res.status(500).render('errorView' { 
  message: 'Something went wrong!',
  status: 500
  });
});


/* ***********************
 * Local Server Information
 *************************/
const port = process.env.PORT || 5500

app.listen(port, ()  => {
  console.log(`🚀 App listening on port ${port}`)
}).on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`❌ Port ${port} is already in use. Try a different PORT in env.`)
  } else {
    console.error(err)
  }
})

module.exports = { app, pool }
