// Import external resources
const express = require('express');
const router = express.Router();

// Import utilities (from index.js in /utilities)
const utils = require('../utilities');

// Import accounts controller (to be built later)
 const accountsController = require('../controllers/accountsController');

// Step 3: Add Get route for "My Account" link
// Notice: only "/login" here, not "/account/login"
// Add error handler middleware
 // Wrap the controller function with utilities.handleErrors 
  router.get('/login', utils.handleErrors(accountsController.buildLogin));

  // Route to build the registration view
  router.get('/register', utils.handleErrors(accountsController.buildRegister));

  // Route to process the form
  router.post('/login', utils.handleErrors(accountsController.processLogin))
  
// Route to process the registration form
  router.post('/register', utils.handleErrors(accountsController.registerAccount))
  
  module.exports = router;


