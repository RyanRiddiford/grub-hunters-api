/**
 * Handles the MongoDB Report model
 * 
 * Author: Ryan Riddiford
 * Student ID: 20862086
 */


//Import dependencies
const mongoose = require('mongoose');

//Construct the MongoDB Report Schema
const reportSchema = new mongoose.Schema({
	//The author of the report submission
	authorId: {
		type: String,
		default:""
	},
	//The id of the content being targetted (restaurant or review)
	targetId: {
		type: String,
		required: true
	},
	//The id of the admin who resolved the report
    adminId: {
		type: String,
		required: false
	},
	//Description detailing the report
text: {
type: String,
required: true
},
//Denotes whether the target is a restaurant or review
targetType: {
    type: String,
    required: true
},
//The topic (title) describing the report's nature
topic: {
    type: String,
    required: true
},
//The report's status
status: {
    type: String,
    default: "active"
}}, {
		timestamps: true
	});





//Create the Report model
const reportModel = mongoose.model('Report', reportSchema, 'reports');


//Exports the Report model
module.exports = reportModel;