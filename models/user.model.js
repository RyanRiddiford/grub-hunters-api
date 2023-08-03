/**
 * Creates the user models with discrimators
 * 
 * Author: Ryan Riddiford
 * Student ID: 20862086
 */


//Import dependencies
const mongoose = require('mongoose');
const AuthUtils = require('../utils/auth.utils');
require('mongoose-type-email');

//Mongodb model options
const options = {
	discriminatorKey: "type",
	collection: "users",
	timestamps: true
};

//Construct the MongoDB User base schema
const baseSchema = new mongoose.Schema({
	//Unique email of the account
	email: {
		type: mongoose.SchemaTypes.Email,
		required: true
	},
	//Access level of the account
	accessLevel: {
		type: Number,
		required: true,
	},
	//User profile bio
	bio: {
		type: String,
		required: false,
		default: "",
		maxLength: 1000
	},
	//Status of the account
	accountStatus: {
		type: String,
		required: true
	},
	//The avatar's filename
	avatar: {
		type: String,
		required: false,
		default: ""
	},
	//The account's encrypted password
	password: {
		type: String,
		required: true
	},
	//Used to show a new user the one-time guide/introduction
	showIntro: {
		type: Boolean,
		required: true,
		default: true,
	}
}, options);
//Middleware that encrypts the user's password before they are added to the database
baseSchema.pre('save', function(next) {
	if (this.password && this.isModified()) {
		this.password = AuthUtils.hashPassword(this.password);
	}
	next();
});
//Create user base model
const baseModel = mongoose.model('users', baseSchema);


//Create the Mongoose Administrator model
const adminModel = baseModel.discriminator("admin", new mongoose.Schema({
	//First name
	firstName: {
		type: String,
		required: true,
		max: 100
	},
	//Surname
	lastName: {
		type: String,
		required: true,
		max: 100
	},
	//Username
	username: {
		type: String,
		required: true
	},
}));
//Create the Mongoose Reviewer model
const reviewerModel = baseModel.discriminator("reviewer", new mongoose.Schema({
	//First name
	firstName: {
		type: String,
		required: true
	},
	//Surname
	lastName: {
		type: String,
		required: true
	},
	//Username
	username: {
		type: String,
		required: true
	},
	//Demerit count
	demerits: {
		type: Number,
		required: true,
		default: 0,
	},
	//Warning status to show first demerit popup
	warningStatus: {
		type: Boolean,
		required: true,
		default: false
	},
	//ISO date string of suspension end date
	suspendedTil: {
		type: String,
		required: false,
	}
}));
//Create the Mongoose Restaurant model
const restaurantModel = baseModel.discriminator("restaurant", new mongoose.Schema({
	//Name of the restaurant
	restaurantName: {
		type: String,
		required: true
	},
	//Demerit count
	demerits: {
		type: Number,
		required: true,
		default: 0,
	},
	//Warning status to show first demerit popup
	warningStatus: {
		type: Boolean,
		required: true,
		default: false
	},
	//The restaurant's phone number
	phoneNumber: {
		type: String,
		required: false
	},
	//The restaurant's location
	location: {
		type: String,
		required: true
	},
	//Date of when the restaurant was established
	established: {
		type: String,
		required: false
	},
	//Name of restaurant owner
	owner: {
		type: String,
		required: false
	},
	//The restaurant's cuisine
	cuisine: {
		type: String,
		required: false
	},
	//ISO date string of suspension end date
	suspendedTil: {
		type: String,
		required: false,
	}
}));




//Export the user models
module.exports = {
	baseModel, adminModel, reviewerModel, restaurantModel
};