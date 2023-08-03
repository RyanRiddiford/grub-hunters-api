/**
 * Handler functions for report route endpoints
 * 
 * Author: Ryan Riddiford
 * Student ID: 20862086
 */



//Import dependencies
const enumUtils = require("../utils/enum.utils");
const reportModel = require("../models/report.model");
const reportUtils = require("../utils/report.utils");




//Report controller
class ReportController {

	//Get a page of reports
	GetPage = (req, res) => {

		//The page index
		const page = req.params.page || 0;
		//Report field requirements
		const status = req.params.report_status;
		const targetType = req.params.target_type;

		//Object with report field requirement regex
		let conditions = reportUtils.getFilterConditions(status, targetType);

		//Find the page
		reportModel.find({
				status: conditions.status,
				targetType: conditions.targetType
			})
			.skip(page * enumUtils.CONSTANTS.PAGE_LIMIT)
			.limit(enumUtils.CONSTANTS.PAGE_LIMIT)
			//Sends back all reports in json format
			.then((reports) => {
				res.status(200).json(reports);
			})
			//Logs error and sends back error response
			.catch((err) => {
				console.log("Failed to get all reports", err);
				res.status(500).json({
					message: "Failed to get all reports",
					error: err
				});
			});
	}

	//Get report by id
	GetById = (req, res) => {

		//Find report in db by id
		reportModel.findById(req.params.id)
			.then((report) => {
				//Send back 404 response if report doesn't exist
				if (!report) {
					res.status(404).json({
						message: "The report doesn't exist"
					});
				}
				//Send back report data in json format
				else {
					res.status(200).json(report);
				}
			})
			//Logs error and sends back error response
			.catch(err => {
				console.log("Failed to get the report", err);
				res.status(500).json({
					message: "Failed to get the report",
					error: err
				});
			});

	}

	//Create a report
	CreateReport = (req, res) => {


		//Sends back 400 response if body content is missing
		if (!Object.keys(req.body).length) {
			return res.status(400).json({
				message: "The body content is empty!"
			});
		}



		//Instantiate the Report object with body data
		const newReport = new reportModel({
			authorId: req.body.authorId,
			adminId: "",
			targetId: req.body.targetId,
			text: req.body.text,
			targetType: req.body.targetType,
			topic: req.body.topic,
			status: enumUtils.ticketStatus.active
		});

		//Save report to db
		newReport.save()
			.then(report => {
				//send back 201 status, and new report
				res.status(201).json(report);
			})
			//Logs error and sends back error response
			.catch(err => {
				console.log("Failed to create report", err);
				res.status(500).json({
					message: "Failed to create report",
					error: err
				});
			});

	}

	//Update report by id
	UpdateById = (req, res) => {

		//Sends back 400 response if body content is missing
		if (!Object.keys(req.body).length) {
			return res.status(400).json({
				message: "The report content is empty!"
			});
		}



		//Find and update the report entry
		reportModel.findByIdAndUpdate(req.params.id, req.body, {
				new: true
			})
			.then(report => {
				//Throw error if no user matched filter
				if (report == null) {
					res.status(500).json({
						message: "report not found"
					});
				}
				//Send back 201 created status, and the new report object
				else
					res.status(201).json(report);


			})
			//Logs error and sends back error response
			.catch(err => {
				console.log("Failed to update report", err);
				res.status(500).json({
					message: "Failed to update report",
					error: err
				});
			});
	}

	//Close a ticket
	CloseById = (req, res) => {


		//Create object containing changes
		const changes = {
			//Set status to closed
			"status": enumUtils.ticketStatus.closed,
			//Set report assessor to admin id
			"adminId": req.params.admin_id
		};

		//Find and update the report entry
		reportModel.findByIdAndUpdate(req.params.id, changes, {
				new: true
			})
			.then(report => {
				//Throw error if no user matched filter
				if (report == null) {
					res.status(500).json({
						message: "report not found"
					});
				}
				//Send back 201 created status, and the new report object
				else
					res.status(201).json(report);


			})
			//Logs error and sends back error response
			.catch(err => {
				console.log("Failed to update report", err);
				res.status(500).json({
					message: "Failed to update report",
					error: err
				});
			});
	}

	//Get number of report pages
	NumPages = (req, res) => {

		//Report field requirements
		const status = req.params.report_status;
		const targetType = req.params.target_type;

		//Object with regex field requirement properties
		let conditions = reportUtils.getFilterConditions(status, targetType);

		//Find documents by filter
		reportModel.find({
				status: conditions.status,
				targetType: conditions.targetType
			})
			//Send back number of pages
			.then((docs) => {

				//Number of documents
				let numDocs = docs.length;

				//Number of pages
				let responseData = Math.ceil((numDocs / enumUtils.CONSTANTS.PAGE_LIMIT));
				//Return number of pages in 200 response
				res.status(200).json(responseData);
			})
			//Logs error and sends back error response
			.catch((err) => {
				console.log("Failed to count reports", err);
				res.status(500).json({
					message: "Failed to count reports",
					error: err
				});
			});

	}

	//Delete report by id
	DeleteById = (req, res) => {

		//Find and delete the report entry
		reportModel.findOneAndDelete({
				_id: req.params.id
			})
			.then((model) => {

				//Send error if no report was deleted (this can occur when filters don't have a match)
				if (model == null) {
					console.log("Filter doesn't match an existing report");
					res.status(500).json({
						message: "Filter doesn't match an existing report"
					});
				} else
				//Send back message indicating success
					res.status(200).json({
					message: "report deleted"
				});
			})
			//Logs error and sends back error response
			.catch(err => {
				console.log("Failed to delete report", err);
				res.status(500).json({
					message: "Failed to delete report",
					error: err
				});
			});
	}
}


//Export report controller
module.exports = ReportController;