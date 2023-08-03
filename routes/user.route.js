/**
 * Handles User endpoints
 * 
 * Author: Ryan Riddiford
 * Student ID: 20862086
 */  


//Import dependencies
const express = require("express");
const router = express.Router();
const UserController = require("../controller/user.controller");
const userController = new UserController();
const multer = require("multer");
//Image buffer for multipart form file
 const storage = multer.memoryStorage();
 const upload = multer({storage:storage});



/**
 * GET - Get number of user pages with user type match ----------------------------------------------
 */
router.get('/:access_level(1|2|3)/:keywords?', userController.NumPages);


/**
 * GET - Get single user by id ----------------------------------------------
 */
router.get('/:id', userController.GetById);


/**
 * GET - Get name of restaurant by id ----------------------------------------------
 */
router.get('/restaurant-name/:id', userController.GetRestaurantName);


/**
 * GET - Get page of users ----------------------------------------------
 */
router.get('/paginated/:page([0-9]+)/:accessLevel(1|2|3)/:keywords?',  userController.GetPage);

/**
 * PUT - Give demerit to user by id ----------------------------------------------
 */
router.put('/give-demerit/:id', userController.GiveDemerit);


/**
 * DELETE - Delete user by id ----------------------------------------------
 */
router.delete('/:id', userController.DeleteById);



/**
 * POST - Create a new user ----------------------------------------------
 */
router.post('/', upload.single('avatar'), userController.Create);

/**
 * PUT - Update user by id ----------------------------------------------
 */
router.put('/:id', upload.single('avatar'), userController.UpdateById);




//Exports the user router
module.exports = router;