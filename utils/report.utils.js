/**
 * Report utility tools
 * 
 * Author: Ryan Riddiford
 * Student ID: 20862086
 */

/**
 * Database data utilities
 */
class ReportUtils {


	/**
	 * Creates regex conditions for report field filtering
	 * @param {*} status 
	 * @param {*} targetType 
	 * @returns Object containing the field filter conditions
	 */
	getFilterConditions(status, targetType) {

		let conditions = {
			status: "",
			targetType: ""
		};


		let statusCondition = "";
		let targetTypeCondition = "";



		if (targetType == "all") {
			targetTypeCondition = /(review|restaurant)/;
		} else {
			if (targetType == "review")
				targetTypeCondition = /review/;
			else if (targetType == "restaurant")
				targetTypeCondition = /restaurant/;
		}


		if (status == "all") {
			statusCondition = /(active|closed)/;
		} else {
			if (status == "active")
				statusCondition = /active/;
			else if (status == "closed")
				statusCondition = /closed/;
		}


		conditions.status = statusCondition;
		conditions.targetType = targetTypeCondition;


		return conditions;
	}

}




//Export ReportUtils
module.exports = new ReportUtils();