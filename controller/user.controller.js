/**
 * Handler functions for user route endpoints
 * 
 * Author: Ryan Riddiford
 * Student ID: 20862086
 */


//Import dependencies
const {
	baseModel, reviewerModel, restaurantModel, adminModel
} = require('../models/user.model');
const reviewModel = require('../models/review.model');
const reportModel = require('../models/report.model');
const enumUtils = require('../utils/enum.utils');
const userUtils = require('../utils/user.utils');
const path = require('path');
const sharp = require("sharp");
const s3Utils = require('../utils/s3.utils');
const {
	report
} = require('../routes/auth.route');



//User controller containing handler functions for route endpoints
class UserController {

	//Create a user
	Create = async(req, res) => {

		//Sends back 400 response if body content is missing
		if (!Object.keys(req.body).length) {
			return res.status(400).json({
				message: "The user content is empty!"
			});
		}


		let avatarFileName = "";
		let newUser;

		//Find if existing user has the email in the body
		baseModel.findOne({
				email: req.body.email
			})
			.then(async (user) =>  {
				//Prevent creation if user already exists 
				if (user != null) {
					return res.status(400).json({
						message: "The email is taken"
					});
				}

		//Resize and upload the new profile image
		if (req.file && req.file.buffer) {
			avatarFileName = Date.now() + Math.random().toString(24).slice(2, 10) + path.extname(req.body.filename);
			//Resize image and save to S3 bucket
			try {
				let imgBuffer = await sharp(req.file.buffer).resize(320, 320).withMetadata().toBuffer();
				//Upload file to S3 bucket
				s3Utils.uploadFile(imgBuffer, avatarFileName, req.file.mimetype);
			} catch (error) {
				console.log(error);
				return res.status(400).json({
					message: "Image upload failed"
				});
			}
		}


				//Init new reviewer
				if (req.body.accessLevel == enumUtils.accessLevels.reviewer)
					newUser = userUtils.initReviewer(req.body, avatarFileName);
				//Init new restaurant
				else if (req.body.accessLevel == enumUtils.accessLevels.restaurant)
					newUser = userUtils.initRestaurant(req.body, avatarFileName);
				//Init new admin
				else if (req.body.accessLevel == enumUtils.accessLevels.administrator)
					newUser = userUtils.initAdmin(req.body, avatarFileName);


				//Save user to db
				newUser.save()
					.then(savedUser => {
						//Send back 201 status with the new user
						res.status(201).json(savedUser);
					})
					//Logs error and sends back error response
					.catch(err => {
						console.log("Failed to create user", err);
						res.status(500).json({
							message: "Failed to create user",
							error: err
						});
					});


			})
			//Logs error and sends back error response
			.catch(err => {
				console.log(err);
				res.status(500).json({
					message: "Failed to create user"
				});
			});

	}


	//Get a page of users
	GetPage = (req, res) => {

		//The page to find
		const page = req.params.page || 0;

		//Filter for users to find
		const options = {
			'accessLevel': req.params.accessLevel
		};

		//Add restaurant name filter is keywords exist
		if (req.params.keywords && req.params.accessLevel == enumUtils.accessLevels.restaurant)
			options.restaurantName = {
				$regex: req.params.keywords,
				$options: "i"
			};

		//Finds a set number of documents in the db
		baseModel.find(options)
			.skip(page * enumUtils.CONSTANTS.PAGE_LIMIT)
			.limit(enumUtils.CONSTANTS.PAGE_LIMIT)
			//Sends back all users in json format
			.then((users) => {
				res.status(200).json(users);
			})
			//Logs error and sends back error response
			.catch((err) => {
				console.log("Failed to get all users", err);
				res.status(500).json({
					message: "Failed to get all users",
					error: err
				});
			});
	}


	/**
	 * Counts number of pages with user type filter
	 * @param {*} req 
	 * @param {*} res 
	 */
	NumPages = async(req, res) => {

		//Filter options for counting documents
		let options = {};

		//Reviewer filter -- Find reviews you authored
		if (req.params.access_level == "1")
			options = {
				'type': "reviewer"
			};
		//Restaurant filter -- Find reviews on a restaurant
		else if (req.params.access_level == "2")
			options = {
				'type': "restaurant"
			};

		//Finds a set number of documents in the db
		baseModel.countDocuments(options)
			//Sends back all reviews in json format
			.then((numDocs) => {
				let responseData = Math.ceil((numDocs / enumUtils.CONSTANTS.PAGE_LIMIT));
				res.status(200).json(responseData);
			})
			//Logs error and sends back error response
			.catch((err) => {
				console.log("Failed to count users", err);
				res.status(500).json({
					message: "Failed to count users",
					error: err
				});
			});

	}



	//Get user by id
	GetById = (req, res) => {
		//Find user in db by id
		baseModel.findById(req.params.id).select('-password')
			.then((user) => {
				//Send back 404 response if user doesn't exist
				if (!user) {
					res.status(404).json({
						message: "The user doesn't exist"
					});
				}
				//Send back user data in json format
				else {
					res.status(200).json(user);
				}
			})
			//Logs error and sends back error response
			.catch(err => {
				console.log("Failed to get the user", err);
				res.status(500).json({
					message: "Failed to get the user",
					error: err
				});
			});

	}


	//Get restaurant name by id
	GetRestaurantName = (req, res) => {
		//Find restaurant in db by id
		restaurantModel.findById(req.params.id).select('restaurantName')
			.then((restaurant) => {
				//Send back 404 response if restaurant doesn't exist
				if (!restaurant) {
					res.status(404).json({
						message: "The restaurant doesn't exist"
					});
				}
				//Send back restaurant data in json format
				else {
					res.status(200).json(restaurant);
				}
			})
			//Logs error and sends back error response
			.catch(err => {
				console.log("Failed to get the restaurant name", err);
				res.status(500).json({
					message: "Failed to get the restaurant name",
					error: err
				});
			});

	}


	//Update user by id
	UpdateById = async(req, res) => {
		//Sends back 400 response if body content is missing
		if (!Object.keys(req.body).length) {
			return res.status(400).json({
				message: "The user content is empty!"
			});
		}

		let avatarFileName = "";

		//Resize and upload the new profile image
		if (req.file && req.file.buffer) {
			avatarFileName = Date.now() + Math.random().toString(24).slice(2, 10) + path.extname(req.body.filename);

			//Resize image and save to S3 bucket
			try {
				let imgBuffer = await sharp(req.file.buffer).resize(320, 320).withMetadata().toBuffer();
				//Upload file to S3 bucket
				s3Utils.uploadFile(imgBuffer, avatarFileName, req.file.mimetype);

			} catch (error) {
				console.log(error);
				return res.status(400).json({
					message: "Image upload failed"
				});
			}
		}

		//Find user in db by id
		baseModel.findById(req.params.id)
			.then((user) => {

				//Delete the old profile image if it exists and a new one has been saved
				if (req.file && req.file.buffer && user.avatar != "") {
					s3Utils.deleteFile(user.avatar);
				}

				//Update the reviewer
				if (user.type == "reviewer") {
					//Assign body data to updated user obj
					const updatedUser = req.body;

					//If an avatar was uploaded this request, save the filename to the user
					if (avatarFileName.length > 0) {
						updatedUser.avatar = avatarFileName;
					}



					//Find and update the user entry
					reviewerModel.findByIdAndUpdate(req.params.id, updatedUser, {
							new: true
						})
						.then(user => {
							console.log("update successful");
							//Throw error if no user matched filter
							if (user == null) {
								res.status(500).json({
									message: "User not found"
								});
							}
							//Send back 201 created status, and the new user object
							else
								res.status(201).json(user);


						})
						//Logs error and sends back error response
						.catch(err => {
							console.log("Failed to update user", err);
							res.status(500).json({
								message: "Failed to update user",
								error: err
							});
						});
				}
				//Update the restaurant
				else if (user.type == "restaurant") {
					//Assign body data to updated user obj
					const updatedUser = req.body;

					//If an avatar was uploaded this request, save the filename to the user
					if (avatarFileName.length > 0)
						updatedUser.avatar = avatarFileName;

					//Find and update the user entry
					restaurantModel.findByIdAndUpdate(req.params.id, updatedUser, {
							new: true
						})
						.then(user => {
							console.log("update successful");
							//Throw error if no user matched filter
							if (user == null) {
								res.status(500).json({
									message: "User not found"
								});
							}
							//Send back 201 created status, and the new user object
							else
								res.status(201).json(user);


						})
						//Logs error and sends back error response
						.catch(err => {
							console.log("Failed to update user", err);
							res.status(500).json({
								message: "Failed to update user",
								error: err
							});
						});
				}
				//Update the admin
				else if (user.type == "admin") {
					//Assign body data to updated user obj
					const updatedUser = req.body;

					//If an avatar was uploaded this request, save the filename to the user
					if (avatarFileName.length > 0)
						updatedUser.avatar = avatarFileName;

					//Find and update the user entry
					adminModel.findByIdAndUpdate(req.params.id, updatedUser, {
							new: true
						})
						.then(user => {
							console.log("update successful");
							//Throw error if no user matched filter
							if (user == null) {
								res.status(500).json({
									message: "User not found"
								});
							}
							//Send back 201 created status, and the new user object
							else
								res.status(201).json(user);


						})
						//Logs error and sends back error response
						.catch(err => {
							console.log("Failed to update user", err);
							res.status(500).json({
								message: "Failed to update user",
								error: err
							});
						});
				}



			})
			//Logs error and sends back error response
			.catch(err => {
				console.log("User doesn't exist", err);
				res.status(500).json({
					message: "User doesn't exist",
					error: err
				});
			});

	}


	//Add demerit to user's account and update the account status
	GiveDemerit = (req, res) => {

		//Find user in db by id
		baseModel.findById(req.params.id)
			.then((user) => {
				//Add demerit point to user
				user.demerits++;
				//Set account warning
				if (user.demerits == 1) {
					//Show warning popup on next login
					user.warningStatus = true;
					//Set account status as warned
					user.accountStatus = enumUtils.accountStatus.warned;
				}
				//Suspend the account for a week
				else if (user.demerits == 2) {
					//Don't show first warning popup if the user hasn't seen it
					user.warningStatus = false;
					//Set account status to suspended
					user.accountStatus = enumUtils.accountStatus.suspended;
					//Create the suspension end date
					let timeServed = new Date();
					//Set suspension end date as a week from now
					timeServed.setDate(timeServed.getDate() + 7);
					//Set suspendedTil user field as the suspension date as ISO standard
					user.suspendedTil = timeServed.toISOString();
				}
				//Ban account
				else if (user.demerits == 3) {
					//Set account status as banned
					user.accountStatus = enumUtils.accountStatus.banned;
				}

				//Update the user document
				if (user.accessLevel == enumUtils.accessLevels.reviewer) {
					reviewerModel.findByIdAndUpdate(req.params.id, user, {
							new: true
						}).then((updatedUser) => {
							console.log("update successful");
							//Throw error if no user matched filter
							if (updatedUser == null) {
								res.status(500).json({
									message: "User not found"
								});
							}
							//Send back 201 created status, and the new user object
							else
								res.status(201).json({
									message: "Added demerit to user"
								});


						})
						//Logs error and sends back error response
						.catch(err => {
							console.log("Failed to update user", err);
							res.status(500).json({
								message: "Failed to update user",
								error: err
							});
						});
				} else if (user.accessLevel == enumUtils.accessLevels.restaurant) {
					restaurantModel.findByIdAndUpdate(req.params.id, user, {
							new: true
						}).then((updatedUser) => {
							console.log("update successful");
							//Throw error if no user matched filter
							if (updatedUser == null) {
								res.status(500).json({
									message: "User not found"
								});
							}
							//Send back 201 created status, and the new user object
							else
								res.status(201).json({
									message: "Added demerit to user"
								});


						})
						//Logs error and sends back error response
						.catch(err => {
							console.log("Failed to update user", err);
							res.status(500).json({
								message: "Failed to update user",
								error: err
							});
						});
				}

				//return res.status(200).json({message:"Added demerit to user"});

			})
			//Logs error and sends back error response
			.catch(err => {
				console.log("Failed to add demerit to user", err);
				res.status(500).json({
					message: "Failed to add demerit to user",
					error: err
				});
			});

	}


	/**
	 * Deletes the user, their authored reviews, and reports that target them
	 * @param {*} req 
	 * @param {*} res 
	 */
	DeleteById = (req, res) => {

		//Find and delete the user entry
		baseModel.findOneAndDelete({
				_id: req.params.id
			})
			.then((model) => {

				//Send error if no user was deleted (this can occur when filters don't have a match)
				if (model == null) {
					console.log("Filter doesn't match an existing user");
					return res.status(500).json({
						message: "Filter doesn't match an existing user"
					});
				}

				//Delete the user's profile image
				if (model.avatar != "")
					s3Utils.deleteFile(model.avatar);


				//User deleted. Delete relevant documents
				else {
					//If restaurant, delete reviews on it and review reports
					if (model.type == "restaurant") {
						//Delete all reviews on your restaurant
						reviewModel.countDocuments({
							"restaurantId": model._id
						}).then((numReviews) => {
							let reviewCount = 0;
							while (reviewCount < numReviews) {
								reviewModel.findOneAndDelete({
										'restaurantId': model._id
									}).then((review) => {

										reportModel.countDocuments({
												"targetId": review._id
											})
											.then((numReports) => {
												let reportCount = 0;

												while (reportCount < numReports) {
													if (review != undefined && review != null) {
														//Delete reports where your authored review is the target
														reportModel.findOneAndDelete({
																"targetId": review._id
															}, () => {
																console.log("Deleted report")
															})
															//Logs error and sends back error response
															.catch(err => {
																console.log("Failed to delete user reports", err);
																res.status(500).json({
																	message: "Failed to delete user reports",
																	error: err
																});
															});

														reportCount++;
													}
												}
											});
									})
									//Logs error and sends back error response
									.catch(err => {
										console.log("Failed to delete user reviews", err);
										res.status(500).json({
											message: "Failed to delete user reviews",
											error: err
										});
									});

								reviewCount++;
							}

						});

					}
					//If reviewer, delete authored reviews
					else if (model.type == "reviewer") {

						reviewModel.countDocuments({
							"authorId": model._id
						}).then((numReviews) => {
							let reviewCount = 0;
							while (reviewCount < numReviews) {
								reviewModel.findOneAndDelete({
										"authorId": model._id
									}).then((review) => {

										reportModel.countDocuments({
												"targetId": review._id
											})
											.then((numReports) => {
												let reportCount = 0;

												while (reportCount < numReports) {
													if (review != undefined && review != null) {
														//Delete reports where your authored review is the target
														reportModel.findOneAndDelete({
																"targetId": review._id
															}, () => {
																console.log("Deleted report")
															})
															//Logs error and sends back error response
															.catch(err => {
																console.log("Failed to delete user reports", err);
																res.status(500).json({
																	message: "Failed to delete user reports",
																	error: err
																});
															});

														reportCount++;
													}
												}
											});
									})
									//Logs error and sends back error response
									.catch(err => {
										console.log("Failed to delete user reviews", err);
										res.status(500).json({
											message: "Failed to delete user reviews",
											error: err
										});
									});

								reviewCount++;
							}
						});


					}



					//Delete reports where you are the author
					reportModel.deleteMany({
							"authorId": model._id
						}).then((reports) => {})
						//Logs error and sends back error response
						.catch(err => {
							console.log("Failed to delete user reports", err);
							res.status(500).json({
								message: "Failed to delete user reports",
								error: err
							});
						});
					//Delete reports where your profile is the target
					reportModel.deleteMany({
							"targetId": model._id
						}).then((reports) => {})
						//Logs error and sends back error response
						.catch(err => {
							console.log("Failed to delete user reports", err);
							res.status(500).json({
								message: "Failed to delete user reports",
								error: err
							});
						});


					//Send back message indicating success
					res.status(200).json({
						message: "User data deleted"
					});
				}

			})
			//Logs error and sends back error response
			.catch(err => {
				console.log("Failed to delete user", err);
				res.status(500).json({
					message: "Failed to delete user",
					error: err
				});
			});
	}
}


//Export the user controller
module.exports = UserController;