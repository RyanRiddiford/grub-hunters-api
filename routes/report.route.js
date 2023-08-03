/**
 * Handles Report endpoints
 * 
 * Author: Ryan Riddiford
 * Student ID: 20862086
 */


//Import dependencies
const express = require("express");
const router = express.Router();
const ReportController = require('../controller/report.controller');
const reportController = new ReportController();
//Handle multipart form data with no file uploads
var multer = require('multer');
var getFields = multer();


/**
 * GET - Get page of reports ----------------------------------------------
 */
router.get('/pagination/:page/:report_status/:target_type', reportController.GetPage);


/**
 * GET - Get single report by id ----------------------------------------------
 */
router.get('/:id', reportController.GetById);



/**
 * GET - Get number of report pages ----------------------------------------------
 */
router.get('/num/page/qty/:report_status/:target_type', reportController.NumPages);



/**
 * POST - Create report ----------------------------------------------
 */
router.post('/', getFields.none(), reportController.CreateReport);

/**
 * PUT - Update report by id ----------------------------------------------
 */
router.put('/:id', reportController.UpdateById);


/**
 * PUT - Close report ----------------------------------------------
 */
router.put('/close-report/:id/:admin_id', reportController.CloseById);




/**
 * DELETE - Delete report by id ----------------------------------------------
 */
router.delete('/:id', reportController.DeleteById);




//Exports the report router
module.exports = router;