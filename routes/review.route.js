/**
 * Handles Review endpoints
 * 
 * Author: Ryan Riddiford
 * Student ID: 20862086
 */


//Import dependencies
const express = require("express");
const router = express.Router();
const ReviewController = require('../controller/review.controller');
const reviewController = new ReviewController();
//Handle multipart form data with no file uploads
var multer = require('multer');
var getFields = multer();


/**
 * GET - Get page of reviews ----------------------------------------------
 */
router.get('/pagination/:id/:page/:accessLevel', reviewController.GetPage);


/**
 * GET - Get average review score of a restaurant ----------------------------------------------
 */
router.get('/avg-score/:id',reviewController.AvgReviewScore);



/**
 * GET - Get number of review pages ----------------------------------------------
 */
router.get('/:id/:accessLevel', reviewController.NumPages);



/**
 * GET - Get single review by id ----------------------------------------------
 */
router.get('/:id', reviewController.GetById);


/**
 * POST - Create review ----------------------------------------------
 */
router.post('/', getFields.none(), reviewController.CreateReview);


/**
 * PUT - Update review by id ----------------------------------------------
 */
router.put('/:id', getFields.none(), reviewController.UpdateById);


/**
 * DELETE - Delete review by id ----------------------------------------------
 */
router.delete('/:id', reviewController.DeleteById);



//Exports the review router
module.exports = router;