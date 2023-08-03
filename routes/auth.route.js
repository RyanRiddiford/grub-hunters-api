/**
 * Handles Auth endpoints
 * 
 * Author: Ryan Riddiford
 * Student ID: 20862086
 */

//Import dependencies
require("dotenv").config();
const express = require("express");
const router = express.Router();

//Handle multipart form data with no file uploads
var multer = require('multer');
var getFields = multer();
//Add handlers for this route's endpoints
const AuthController = require('../controller/auth.controller');
const authController = new AuthController();

/**
 * POST - attempts to sign user in
 */

router.post('/signin', getFields.none(), authController.SignIn);

/**
 * GET - Checks if the sender is authorized
 */
router.get('/validate', authController.Validate);



//Exports the auth router
module.exports = router;