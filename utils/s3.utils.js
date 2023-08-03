/**
 * AWS S3 Bucket file utilities for file handling
 * 
 * Author: Ryan Riddiford
 * Student ID: 20862086
 */

require('dotenv').config();
const S3 = require('aws-sdk/clients/s3');

//Details required to connect to the S3 bucket
const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;



//AWS S3 Bucket file utilities
class S3Utilities {


	/**
	 * Instantiates an AWS S3 client to interact with the S3 bucket
	 */
	constructor() {
		this.s3 = new S3({
			region,
			accessKeyId,
			secretAccessKey
		});
	}




	/**
	 * Upload file to AWS S3 bucket
	 * @param {*} buffer 
	 * @param {*} filename 
	 * @param {*} mimetype 
	 */
	uploadFile(buffer, filename, mimetype) {

		const uploadParams = {
			Bucket: bucketName,
			Body: buffer,
			Key: filename,
			ContentType: mimetype,
			ACL: 'public-read'
		};

		this.s3.upload(uploadParams, () => {}, (err) => {
			console.log(err);
		});
	}


	/**
	 * Deletes a file from the AWS S3 storage bucket
	 * @param {*} filename 
	 */
	deleteFile(filename) {

		const deleteParams = {
			Bucket: bucketName,
			Key: filename
		};

		this.s3.deleteObject(deleteParams, () => {}, (err) => {
			console.log("s3 delete failed");
			console.log(err);
		});


	}



}


//Export S3Utilities
module.exports = new S3Utilities();