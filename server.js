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
const session = require("express-session")
const pool = require('./database')
const app = express()

const staticRoutes = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventory")
const utilities = require("./utilities")

const accountsRouter = require('./routes/accountRoute');


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

app.use(session({
  store: new (require('connect-pg-simple') (session)) ({
    createTableIfMissing: true,
    pool,
  }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: 'sessionId', 
}))

const flash = require("connect-flash")
app.use(flash())
app.use((req,res, next) => {
  res.locals.messages = req.flash()
  next()
})

/* ***********************
 * Database Connection
 *************************/


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

// Intentional error route for testing
app.get("/trigger-error", (req, res, next) =>  {
  const error = new Error("Intentional 500 error triggered for testing");
  error.status = 500;
  next(error); // Pass to error middleware
});


// Mount static and inventory routes
app.use("/", staticRoutes)
app.use("/inventory", inventoryRoute) 
app.use("/account", accountsRouter)

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
