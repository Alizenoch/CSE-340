// Import external resources
const express = require('express');
const router = express.Router();

// Import utilities
const utils = require('../utilities');

// Import accounts controller
const accountsController = require('../controllers/accountsController');

// Login routes
router.get('/login', utils.handleErrors(accountsController.buildLogin));
router.post('/login', utils.handleErrors(accountsController.processLogin));

// Registration routes
router.get('/register', utils.handleErrors(accountsController.buildRegister));
router.post('/register', utils.handleErrors(accountsController.registerAccount));

// Default "My Account" page
router.get('/', utils.handleErrors(accountsController.buildAccount));

// ✅ Account Management view (Task 3)
router.get('/management',
  utils.checkJWTToken,
  utils.handleErrors(accountsController.buildAccountManagement)
);

// Logout
router.get('/logout', utils.handleErrors(accountsController.logout));

// ✅ Update Account Information route (Task 3)
router.get('/update/:accountId',
  utils.checkJWTToken,
  utils.handleErrors(accountsController.updateAccountView)
);

router.post('/update/:accountId',
  utils.checkJWTToken,
  utils.handleErrors(accountsController.processUpdateAccount)
);

router.post("/update-password/:accountId", accountsController.processUpdatePassword);


module.exports = router;
