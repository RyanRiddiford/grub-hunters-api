/**
 * Handler functions for review route endpoints
 * 
 * Author: Ryan Riddiford
 * Student ID: 20862086
 */

//Import dependencies
const reviewModel = require("../models/review.model");
const enumUtils = require("../utils/enum.utils");


//Review controller
class ReviewController {

	//Get a page of reviews
	GetPage = (req, res) => {

		const page = req.params.page || 0;
		let options;

		//Reviewer filter -- Find reviews you authored
		if (req.params.accessLevel == "1")
			options = {
				'authorId': req.params.id
			};
		//Restaurant filter -- Find reviews on a restaurant
		else if (req.params.accessLevel == "2")
			options = {
				'restaurantId': req.params.id
			};

		//Finds a set number of documents in the db
		reviewModel.find(options)
			.skip(page * enumUtils.CONSTANTS.PAGE_LIMIT)
			.limit(enumUtils.CONSTANTS.PAGE_LIMIT)
			//Sends back all reviews in json format
			.then((reviews) => {
				res.status(200).json(reviews);
			})
			//Logs error and sends back error response
			.catch((err) => {
				console.log("Failed to get all reviews", err);
				res.status(500).json({
					message: "Failed to get all reviews",
					error: err
				});
			});
	}



	//Get average review score of a restaurant
	AvgReviewScore = (req, res) => {

		//Show reviews only for this restaurant
		const options = {
			"restaurantId": req.params.id
		};

		//Find reviews with matching restaurantId
		reviewModel.find(options)
			.then((reviews) => {
				//Send back 0 if no reviews exist
				if (reviews == 0) {
					return res.status(200).json({
						avgRating: 0,
						message: "No Ratings"
					});
				}
				//Send back review data in json format
				else {

					//Finds a set number of documents in the db
					reviewModel.countDocuments(options)
						//Send back average rating and number of reviews
						.then((numDocs) => {

							let data = 0;
							let numReviews = reviews.length;
							//Calculate the average of all review ratings
							for (let review of reviews) {
								data += review.rating;
							}

							data = data / numReviews;

							//Send back average rating and number of reviews in 200 response
							res.status(200).json({
								avgRating: data.toFixed(1),
								message: `Out of ${numDocs} reviews`
							});
						})
						//Logs error and sends back error response
						.catch((err) => {
							console.log("Failed to count reviews", err);
							res.status(500).json({
								message: "Failed to count reviews",
								error: err
							});
						});

				}
			})
			//Logs error and sends back error response
			.catch(err => {
				console.log("Failed to get average review score", err);
				res.status(500).json({
					message: "Failed to get average review score",
					error: err
				});
			});

	}


	//Get review by id
	GetById = (req, res) => {
		//Find review in db by id
		reviewModel.findById(req.params.id).select('-voters')
			.then((review) => {
				//Send back 404 response if review doesn't exist
				if (!review) {
					res.status(404).json({
						message: "The review doesn't exist"
					});
				}
				//Send back review data in json format
				else {
					res.status(200).json(review);
				}
			})
			//Logs error and sends back error response
			.catch(err => {
				console.log("Failed to get the review", err);
				res.status(500).json({
					message: "Failed to get the review",
					error: err
				});
			});

	}

	//Get number of review pages
	NumPages = (req, res) => {

		let options = {};

		//Reviewer filter -- Find reviews you authored
		if (req.params.accessLevel == "1")
			options = {
				'authorId': req.params.id
			};
		//Restaurant filter -- Find reviews on a restaurant
		else if (req.params.accessLevel == "2")
			options = {
				'restaurantId': req.params.id
			};

		//Finds a set number of documents in the db
		reviewModel.countDocuments(options)
			//Sends back all reviews in json format
			.then((numDocs) => {
				let responseData = Math.ceil((numDocs / enumUtils.CONSTANTS.PAGE_LIMIT));
				res.status(200).json(responseData);
			})
			//Logs error and sends back error response
			.catch((err) => {
				console.log("Failed to count reviews", err);
				res.status(500).json({
					message: "Failed to count reviews",
					error: err
				});
			});

	}

	//Create a review
	CreateReview = (req, res) => {
		//Sends back 400 response if body content is missing
		if (!Object.keys(req.body).length) {
			return res.status(400).json({
				message: "The body content is empty!"
			});
		}

		const authorId = req.body.authorId;
		const restaurantId = req.body.restaurantId;

		//Will detect an existing review from the user
		let filter = {
			'authorId': authorId,
			'restaurantId': restaurantId
		};

		//Find if user has already posted review of restaurant
		reviewModel.find(filter)
			.then((review) => {
				//Send back 404 response if user has posted a review on the restaurant already
				if (review != "") {
					return res.status(404).json({
						message: "User has already made a review of the restaurant"
					});
				} else {
					//Instantiate the Review object with body data
					const newReview = new reviewModel({
						authorId: req.body.authorId,
						restaurantId: req.body.restaurantId,
						text: req.body.text,
						title: req.body.title,
						rating: req.body.rating,
						upvotes: req.body.upvotes,
						downvotes: req.body.downvotes,
						status: "active"
					});

					//Save review to db
					newReview.save()
						.then(review => {
							//send back 201 status, and new review
							res.status(201).json(review);
						})
						//Logs error and sends back error response
						.catch(err => {
							console.log("Failed to create review", err);
							res.status(500).json({
								message: "Failed to create review",
								error: err
							});
						});
				}
			})
			//Logs error and sends back error response
			.catch(err => {
				console.log("Failed to check for existing review", err);
				return res.status(500).json({
					message: "Failed to check for existing review",
					error: err
				});
			});

	}

	//Update review by id
	UpdateById = (req, res) => {

		//Sends back 400 response if body content is missing
		if (!Object.keys(req.body).length) {
			return res.status(400).json({
				message: "The review content is empty!"
			});
		}

		//Find and update the review entry
		reviewModel.findByIdAndUpdate(req.params.id, req.body, {
				new: true
			})
			.then(review => {
				//Throw error if no user matched filter
				if (review == null) {
					res.status(500).json({
						message: "review not found"
					});
				}
				//Send back 201 created status, and the new review object
				else
					res.status(201).json(review);
			})
			//Logs error and sends back error response
			.catch(err => {
				console.log("Failed to update review", err);
				res.status(500).json({
					message: "Failed to update review",
					error: err
				});
			});
	}

	//Delete review by id
	DeleteById = (req, res) => {

		//Find and delete the review entry
		reviewModel.findOneAndDelete({
				_id: req.params.id
			})
			.then((model) => {

				//Send error if no review was deleted (this can occur when filters don't have a match)
				if (model == null) {
					console.log("Filter doesn't match an existing review");
					res.status(500).json({
						message: "Filter doesn't match an existing review"
					});
				} else
				//Send back message indicating success
					res.status(200).json({
					message: "review deleted"
				});
			})
			//Logs error and sends back error response
			.catch(err => {
				console.log("Failed to delete review", err);
				res.status(500).json({
					message: "Failed to delete review",
					error: err
				});
			});
	}

}


//Export the review controller
module.exports = ReviewController;