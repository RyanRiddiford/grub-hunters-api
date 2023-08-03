/**
 * Handles the MongoDB Review model
 * 
 * Author: Ryan Riddiford
 * Student ID: 20862086
 */


//Import dependencies
const mongoose = require('mongoose');

//Construct the MongoDB Review Schema
const reviewSchema = new mongoose.Schema({
    //The author of the review submission
	authorId: {
		type: String,
		required: true
	},
    //The restaurant being reviewed
	restaurantId: {
		type: String,
		required: true
	},
    //Review content
text: {
type: String,
required: true
},
//Review title
title: {
    type: String,
    required:true,
},
//Review rating
rating: {
    type: Number,
    required: true,
},
//Number of upvotes
upvotes: {
    type: Number,
    default: 0
},
//Number of downvotes
downvotes: {
    type:Number,
    default: 0
},
//Array of upvoter ids
upvoters: {
    type:Array,
    default:[],
},
//Array of upvoter ids
downvoters: {
    type:Array,
    default:[],
},
//Status of the review
status: {
    type: String,
    default: "active"
}}, {
		timestamps: true
	});





//Create the Mongoose Review model
const reviewModel = mongoose.model('Review', reviewSchema, 'reviews');


//Exports the Review model
module.exports = reviewModel;