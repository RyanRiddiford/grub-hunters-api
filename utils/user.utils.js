/**
 * Provides user-related utilities
 * 
 * Author: Ryan Riddiford
 * Student ID: 20862086
 */


// Import dependencies
const {
	reviewerModel, restaurantModel, adminModel
} = require('../models/user.model');
const enumUtils = require('./enum.utils');


/**
 * User-related utilities
 */
class UserUtils {

	/**
	 * Constructs a new Admin object
	 * @param {Array<any>} userData Array containing User data for Admin object properties
	 * @returns The new Admin Object
	 */
	initAdmin(userData, avatarFilename) {
		return new adminModel({
			firstName: userData.firstName,
			lastName: userData.lastName,
			email: userData.email,
			accessLevel: userData.accessLevel,
			password: userData.password,
			bio: userData.bio || "",
			username: userData.username,
			avatar: avatarFilename || "",
			accountStatus: enumUtils.accountStatus.active
		});
	}

	/**
	 * Constructs a new Reviewer object
	 * @param {Array<any>} userData Array containing User data for Reviewer object properties
	 * @returns The new Reviewer Object
	 */
	initReviewer(userData, avatarFilename = "") {
		return new reviewerModel({
			firstName: userData.firstName,
			lastName: userData.lastName,
			email: userData.email,
			accessLevel: userData.accessLevel,
			password: userData.password,
			bio: userData.bio || "",
			username: userData.username,
			avatar: avatarFilename || "",
			accountStatus: enumUtils.accountStatus.active,
			demerits: 0,
			warningStatus: false
		});
	}

	/**
	 * Constructs a new Restaurant object
	 * @param {Array<any>} userData Array containing User data for Restaurant object properties
	 * @returns The new Restaurant Object
	 */
	initRestaurant(userData, avatarFilename) {
		return new restaurantModel({
			email: userData.email,
			accessLevel: userData.accessLevel,
			password: userData.password,
			bio: userData.bio || "",
			location: userData.location,
			username: userData.username,
			avatar: avatarFilename || "",
			accountStatus: enumUtils.accountStatus.active,
			demerits: 0,
			warningStatus: false,
			restaurantName: userData.restaurantName,
			phoneNumber: userData.phoneNumber,
			cuisine: userData.cuisine,
			established: userData.established,
			owner: userData.owner
		});
	}



}




//Export UserUtils
module.exports = new UserUtils();