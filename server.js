/**
 * This is the starting point of the backend application.
 * 
 * Author: Ryan Riddiford
 * Student ID: 20862086
 */


//Import dependencies
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const DataUtils = require("./utils/data.utils");
const {
	baseModel
} = require('./models/user.model');
//Set port number for app to listen to
const port = process.env.PORT || 3000;

//CONNECT TO THE DATABASE ----------------------------------------

//Connect to the mongodb database
mongoose.connect(process.env.MONGO_URI)
	.then(() => {
		console.log("Database connected using SRV Format!");
		checkDbData();
	})
	//Caught error while connecting with SRV connection string
	.catch((err) => {

		console.log("Database connection failed!", err);

		//Attempt connection with standard connection string instead if error is DNS-related
		if (err.code == "EBADNAME") {

			console.log("Attempting to connect with Standard connection string instead of SRV format");
			//Reattempt to connect with standard connection string
			mongoose.connect(process.env.MONGO_LONG_URI)
				.then(() => {
					console.log("Database connected using Standard String Format!");
					checkDbData();
				})
				//Caught error while connecting with Standard connection string
				.catch((err) => {
					console.log("Database connection failed!", err);
				});
		}

	});



/**
 * If the db users collection is empty, load data
 */
async function checkDbData() {
	let numUsers = await baseModel.countDocuments();
	//If no users exist
	if (numUsers == 0) {
		//Delete any documents that exist in any collection
		await DataUtils.DeleteAllDbDocuments();
		//Add data to db
		await DataUtils.PopulateDb();

		console.log("added data to db");
	} else {
		console.log("db has data loaded");
	}
}


//CONFIGURE DEPENDENCIES ----------------------------------------

//Initialise Express app
const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({
	extended: true
}));
app.use('*', cors());




//ROUTING SETUP ----------------------------------------


//Setup auth route
const authRouter = require('./routes/auth.route');
app.use('/auth', authRouter);

//Setup user route
const userRouter = require('./routes/user.route');
app.use('/user', userRouter);

//Setup review route
const reviewRouter = require('./routes/review.route');
app.use('/review', reviewRouter);

//Setup report route
const reportRouter = require('./routes/report.route');
app.use('/report', reportRouter);




//Run the app by having it listen to the port specified
app.listen(port, () => {
	console.log("App is running on port " + port);
});