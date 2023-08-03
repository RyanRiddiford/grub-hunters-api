/**
 * Handler functions for auth route endpoints
 * 
 * Author: Ryan Riddiford
 * Student ID: 20862086
 */


//Import dependencies
const {
	baseModel
} = require('../models/user.model');
const AuthUtils = require("../utils/auth.utils");
const jwt = require('jsonwebtoken');
const enumUtils = require('../utils/enum.utils');



//Auth controller containing handler functions for route endpoints
class AuthController {


	//Attempts to sign in user
	SignIn = async(req, res) => {

		//Checks if required body data is present
		if (!req.body.email || !req.body.password) {
			return res.status(400).json({
				message: "Please provide an email and password"
			});
		}

		//find user in database
		baseModel.findOne({
				email: req.body.email
			})
			.then(user => {
				if (user == null) {
					//Sends vague error message when any sign in credentials are invalid
					return res.status(400).json({
						message: "Invalid credentials"
					});
				}
				//If user exists, verify the password
				if (AuthUtils.verifyPassword(req.body.password, user.password)) {

					const userObj = user;

					//Generate the access token
					const accessToken = AuthUtils.generateAccessToken(userObj);

					//If user isn't admin, check demerit points
					if (userObj.accessLevel != enumUtils.accessLevels.administrator) {
						//Send response indicating the user has received a warning
						if (userObj.demerits == 1) {
							return res.status(201).json({
								message: "Your account has received a warning",
								code: "WARNED",
								accessToken: accessToken,
								user: userObj
							});
						}
						//Assess suspension date
						else if (userObj.demerits == 2) {

							//Current epoch time
							let currTime = Date.parse(new Date().toISOString());
							//Suspension end date as epoch time 
							let endDate = Date.parse(userObj.suspendedTil);
							//Block suspended users from logging in
							if (currTime <= endDate) {
								//Send response indicating the user is still suspended
								return res.status(201).json({
									message: `Your account is suspended until ${userObj.suspendedTil}`,
									code: "SUSPENDED"
								});
							}

						}
						//Send response indicating the user is banned
						else if (userObj.demerits == 3) {
							return res.status(201).json({
								message: "Your account has been banned",
								code: "BANNED"
							});
						}

					}

					//Send back a response with the access token and user object
					return res.status(201).json({
						accessToken: accessToken,
						user: userObj
					});
				}
				//Sends vague error message when any sign in credentials are invalid
				else {
					return res.status(400).json({
						message: "Invalid credentials"
					});
				}
			})
			.catch((err) => {
				console.log(err);
				return res.status(500).json({
					message: "Failed to sign in",
					err: err.err
				});
			});


	}

	//Attempts to validate JWT token
	Validate = (req, res) => {

		//Send 403 response if authorization header is empty
		if (req.headers.authorization === undefined) {
			return res.sendStatus(403);
		}

		//Get the access token from the authorization header param
		const token = req.headers.authorization.split(' ')[1];


		try {
			//Verify the token
			jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, tokenData) => {
				if (err) {
					//Send back 403 response if the token is invalid      
					return res.status(403).json({
						err: "Forbidden"
					});
				} else {
					//Send back the token data if token is valid 
					res.status(200).json(tokenData);
				}
			});
		}
		//Logs error and sends back error response
		catch (err) {
			const message = "Failed to verify access token";
			console.log(message, err);
			res.status(500).json({
				message: message,
				error: err
			});
		}
	}
}


//Export the auth controller
module.exports = AuthController;