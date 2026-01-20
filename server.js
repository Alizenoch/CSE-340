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

// Parse incoming form data
app.use(express.urlencoded({ extended: true })) 
app.use(express.json())

/* ***********************
* Database Connection
*************************/


const pool = new Pool({ connectionString: process.env.DATABASE_URL,
   ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false }) 
   // Test the connection on startup
    pool.query("SELECT NOW()", (err, result) => { 
      if (err) { console.error("❌ Database connection error:", err.message) 

      } else {
         console.log("✅ Connected to PostgreSQL at:", result.rows[0].now) } })

/* ***********************
 * Routes
 *************************/
// Explicit homepage route
app.get("/", (req, res) => {
  res.render("index", { title: "Home" })
})

// Database route
app.get("/db-test", async (req, res) => {
   try { const result = await pool.query("SELECT NOW()"); 
    res.send(`Database connected! Current time: ${result.rows[0].now}`); 
  } 
  catch (err) { console.error(err); 
    res.status(500).send("Database connection failed"); } })

    // Inventory route
    app.get("/inv", async (req, res)=>{
      try {
        const result = await pool.query("SELECT * FROM inventory");
        res.render("inventory/index", { title: "Inventory",  items: result.rows });
      } catch  (err) {
        console.error(err);
        res.status(500).send("Error retrieving inventory data");

      }
      
    });

// Mount static routes at root
app.use("/", staticRoutes)



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
