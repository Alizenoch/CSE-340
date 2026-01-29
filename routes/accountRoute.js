// Import external resources
const express = require('express');
const router = express.Router();

// Import utilities (from index.js in /utilities)
const utils = require('../utilities');

// Import accounts controller (to be built later)
// const accountsController = require('../controllers/accountsController');

// Step 3: Add Get route for "My Account" link
// Notice: only "/login" here, not "/account/login"
// Add error handler middleware
 // Wrap the controller function with utilities.handleErros 
 // router.get('/login', utils.handleErrors(accountsController.buildLogin));

module.exports = router;


