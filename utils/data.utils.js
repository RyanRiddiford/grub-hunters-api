/**
 * Creates and uploads documents to empty collections
 * 
 * Author: Ryan Riddiford
 * Student ID: 20862086
 */


// Import dependencies
const {
	reviewerModel, restaurantModel, adminModel, baseModel
} = require('../models/user.model');
const reviewModel = require('../models/review.model');
const reportModel = require('../models/report.model');
var mongoose = require('mongoose');

/**
 * Database data utilities
 */
class DataUtils {



	/**
	 * Deletes all documents from all collections
	 */
	async DeleteAllDbDocuments() {
		await baseModel.deleteMany();
		await reportModel.deleteMany();
		await reviewModel.deleteMany();
	}

	/**
	 * Populate db with documents for each schema
	 */
	async PopulateDb() {
		//Upload users to db
		this.PopulateUsers().then((users) => {
			this.PopulateReviews(users).then((reviews) => {
				this.PopulateReports(users, reviews);
			});

		});

	}



	/**
	 * Creates array of admin documents
	 * @returns array of admin documents
	 */
	InitAdminArr() {
		return [
			new adminModel({
				_id: mongoose.Types.ObjectId(),
				firstName: "Anna",
				lastName: "Brown",
				email: "admin1@grubhunters.com.au",
				accessLevel: 3,
				password: "admin123",
				bio: "Hi! My name is Anna",
				username: "Anna",
				avatar: "",
				accountStatus: "Active",
			}),
			new adminModel({
				_id: mongoose.Types.ObjectId(),
				firstName: "Burt",
				lastName: "Cass",
				email: "admin2@grubhunters.com.au",
				accessLevel: 3,
				password: "admin123",
				bio: "Hi! My name is Burt",
				username: "Burt",
				avatar: "",
				accountStatus: "Active",
			})
		];
	}


	/**
	 * Creates array of reviewer documents
	 * @returns array of reviewer documents
	 */
	InitReviewerArr() {
		return [
			new reviewerModel({
				_id: mongoose.Types.ObjectId(),
				firstName: "Nick",
				lastName: "Mullen",
				email: "nick@reviewer.com.au",
				accessLevel: 1,
				password: "reviewer123",
				bio: "Hi! I love food!",
				username: "Nick",
				avatar: "",
				accountStatus: "Active",
			}),
			new reviewerModel({
				_id: mongoose.Types.ObjectId(),
				firstName: "Christopher",
				lastName: "Hitchens",
				email: "hitchens@reviewer.com.au",
				accessLevel: 1,
				password: "reviewer123",
				bio: "Looking for some good, consistent grub!",
				username: "Chris",
				avatar: "",
				accountStatus: "Active",
			}),
			new reviewerModel({
				_id: mongoose.Types.ObjectId(),
				firstName: "Norm",
				lastName: "Macdonald",
				email: "macdonald@reviewer.com.au",
				accessLevel: 1,
				password: "reviewer123",
				bio: "Please don't give me food poisoning!",
				username: "Normie",
				avatar: "",
				accountStatus: "Active",
			}),
			new reviewerModel({
				_id: mongoose.Types.ObjectId(),
				firstName: "Joe",
				lastName: "Rogan",
				email: "rogan@reviewer.com.au",
				accessLevel: 1,
				password: "reviewer123",
				bio: "Any good game restaurants around??",
				username: "Brogan",
				avatar: "",
				accountStatus: "Active",
			}),
		];
	}




	/**
	 * Creates array of restaurant documents
	 * @returns array of restaurant documents
	 */
	InitRestaurantArr() {



		const dummyBio = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a,";

		return [
			new restaurantModel({
				_id: mongoose.Types.ObjectId(),
				restaurantName: "Adam's Pizzaria",
				email: "adam@restaurant.com.au",
				accessLevel: 2,
				password: "restaurant123",
				bio: dummyBio,
				avatar: "",
				accountStatus: "Active",
				phoneNumber: "0412345678",
				location: "123 Fake Street",
				established: "1980",
				owner: "Adam Friedland",
				cuisine: "Italian"
			}),
			new restaurantModel({
				_id: mongoose.Types.ObjectId(),
				restaurantName: "Dino's Pizzaria",
				email: "dino@restaurant.com.au",
				accessLevel: 2,
				password: "restaurant123",
				bio: dummyBio,
				avatar: "",
				accountStatus: "Active",
				phoneNumber: "0412345678",
				location: "125 Fake Street",
				established: "1990",
				owner: "Mario Luigiana",
				cuisine: "Italian"
			}),
			new restaurantModel({
				_id: mongoose.Types.ObjectId(),
				restaurantName: "McDonalds",
				email: "mcdonalds@restaurant.com.au",
				accessLevel: 2,
				password: "restaurant123",
				bio: dummyBio,
				avatar: "",
				accountStatus: "Active",
				phoneNumber: "0412345678",
				location: "125 Fake Street",
				established: "1990",
				owner: "Ronald McDonald",
				cuisine: "Fast Food"
			}),
			new restaurantModel({
				_id: mongoose.Types.ObjectId(),
				restaurantName: "Papa Johns",
				email: "papajohns@restaurant.com.au",
				accessLevel: 2,
				password: "restaurant123",
				bio: dummyBio,
				avatar: "",
				accountStatus: "Active",
				phoneNumber: "0412345678",
				location: "125 Fake Street",
				established: "1980",
				owner: "Papa John",
				cuisine: "Pizza"
			}),
			new restaurantModel({
				_id: mongoose.Types.ObjectId(),
				restaurantName: "Kebab Central",
				email: "kebabs@restaurant.com.au",
				accessLevel: 2,
				password: "restaurant123",
				bio: dummyBio,
				avatar: "",
				accountStatus: "Active",
				phoneNumber: "0412345678",
				location: "125 Fake Street",
				established: "1990",
				owner: "John Graham",
				cuisine: "Middle Eastern"
			}),
			new restaurantModel({
				_id: mongoose.Types.ObjectId(),
				restaurantName: "KFC",
				email: "kfc@restaurant.com.au",
				accessLevel: 2,
				password: "restaurant123",
				bio: dummyBio,
				avatar: "",
				accountStatus: "Active",
				phoneNumber: "0412345678",
				location: "125 Fake Street",
				established: "1990",
				owner: "Colonel Sanders",
				cuisine: "Fried Chicken"
			}),
			new restaurantModel({
				_id: mongoose.Types.ObjectId(),
				restaurantName: "Nandos",
				email: "nandos@restaurant.com.au",
				accessLevel: 2,
				password: "restaurant123",
				bio: dummyBio,
				avatar: "",
				accountStatus: "Active",
				phoneNumber: "0412345678",
				location: "125 Fake Street",
				established: "1999",
				owner: "Adam McDowell",
				cuisine: "Chicken"
			}),
			new restaurantModel({
				_id: mongoose.Types.ObjectId(),
				restaurantName: "Pizza Hut",
				email: "pizzahut@restaurant.com.au",
				accessLevel: 2,
				password: "restaurant123",
				bio: dummyBio,
				avatar: "",
				accountStatus: "Active",
				phoneNumber: "0412345678",
				location: "125 Fake Street",
				established: "1980",
				owner: "Mark Peroni",
				cuisine: "Pizza"
			}),
			new restaurantModel({
				_id: mongoose.Types.ObjectId(),
				restaurantName: "Burger Town",
				email: "burgertown@restaurant.com.au",
				accessLevel: 2,
				password: "restaurant123",
				bio: dummyBio,
				avatar: "",
				accountStatus: "Active",
				phoneNumber: "0412345678",
				location: "125 Fake Street",
				established: "1990",
				owner: "John Graham",
				cuisine: "Fast Food"
			}),
			new restaurantModel({
				_id: mongoose.Types.ObjectId(),
				restaurantName: "Red Rooster",
				email: "redrooster@restaurant.com.au",
				accessLevel: 2,
				password: "restaurant123",
				bio: dummyBio,
				avatar: "",
				accountStatus: "Active",
				phoneNumber: "0412345678",
				location: "125 Fake Street",
				established: "1990",
				owner: "Harry Roost",
				cuisine: "Chicken"
			}),
			new restaurantModel({
				_id: mongoose.Types.ObjectId(),
				restaurantName: "Hungry Jacks",
				email: "hungryjacks@restaurant.com.au",
				accessLevel: 2,
				password: "restaurant123",
				bio: dummyBio,
				avatar: "",
				accountStatus: "Active",
				phoneNumber: "0412345678",
				location: "125 Fake Street",
				established: "1989",
				owner: "Jack Jackson",
				cuisine: "Fast Food"
			}),
			new restaurantModel({
				_id: mongoose.Types.ObjectId(),
				restaurantName: "Wendy's",
				email: "wendys@restaurant.com.au",
				accessLevel: 2,
				password: "restaurant123",
				bio: dummyBio,
				avatar: "",
				accountStatus: "Active",
				phoneNumber: "0412345678",
				location: "125 Fake Street",
				established: "1990",
				owner: "Wendy",
				cuisine: "Fast Food"
			}),
			new restaurantModel({
				_id: mongoose.Types.ObjectId(),
				restaurantName: "Casa Bonita",
				email: "casabonita@restaurant.com.au",
				accessLevel: 2,
				password: "restaurant123",
				bio: dummyBio,
				avatar: "",
				accountStatus: "Active",
				phoneNumber: "0412345678",
				location: "125 Fake Street",
				established: "1989",
				owner: "Casa Bonita",
				cuisine: "Mexican"
			})
		];

	}


	/**
	 * Populate db with users
	 */
	async PopulateUsers() {

		const users = {
			reviewers: this.InitReviewerArr(),
			restaurants: this.InitRestaurantArr(),
			admins: this.InitAdminArr()
		};

		//Save admin documents to db
		users.admins.forEach(async(admin) => {
			await admin.save();
		});
		//Save reviewer documents to db
		users.reviewers.forEach(async(reviewer) => {
			await reviewer.save();
		});
		//Save restaurant documents to db
		users.restaurants.forEach(async(restaurant) => {
			await restaurant.save();
		});

		return users;

	}





	/**
	 * Populate db with reviews
	 */
	async PopulateReviews(users) {

		const reviewArr = [
			new reviewModel({
				_id: mongoose.Types.ObjectId(),
				authorId: users.reviewers[0]._id,
				restaurantId: users.restaurants[0]._id,
				text: "Great Service! Will come again!",
				title: "Great Service!",
				rating: 8.4,
			}),
			new reviewModel({
				_id: mongoose.Types.ObjectId(),
				authorId: users.reviewers[1]._id,
				restaurantId: users.restaurants[1]._id,
				text: "A++ Service! Would definitely recommend!",
				title: "Quality food at a reasonable price",
				rating: 9.9,
			}),
			new reviewModel({
				_id: mongoose.Types.ObjectId(),
				authorId: users.reviewers[1]._id,
				restaurantId: users.restaurants[0]._id,
				text: "A++ Service! Would definitely recommend!",
				title: "Quality food at a reasonable price",
				rating: 9
			})
		];

		reviewArr.forEach(async(review) => {
			await review.save();
		});


		return reviewArr;

	}




	/**
	 * Populate db with reports
	 */
	PopulateReports(users, reviews) {

		let reportArr = [
			new reportModel({
				authorId: users.reviewers[0]._id,
				targetId: users.restaurants[1]._id,
				text: "This restaurant's bio contains rude language",
				topic: "Offensive Language",
				targetType: "restaurant"
			}),
			new reportModel({
				authorId: users.reviewers[1]._id,
				targetId: users.restaurants[1]._id,
				text: "This restaurant's bio contains rude language",
				topic: "Offensive Language",
				targetType: "restaurant"
			}),
			new reportModel({
				authorId: users.restaurants[0]._id,
				targetId: users.restaurants[1]._id,
				text: "This restaurant's bio contains rude language",
				topic: "Offensive Language",
				targetType: "restaurant"
			}),
			new reportModel({
				authorId: users.restaurants[3]._id,
				targetId: users.restaurants[4]._id,
				text: "Frauds!",
				topic: "Scammers!",
				targetType: "restaurant"
			}),
			new reportModel({
				authorId: users.restaurants[1]._id,
				targetId: reviews[0]._id,
				text: "This is a fake review!",
				topic: "Spam",
				targetType: "review"
			}),
			new reportModel({
				authorId: users.restaurants[1]._id,
				targetId: reviews[0]._id,
				text: "This is a fake review!",
				topic: "Spam",
				targetType: "review"
			}),
			new reportModel({
				authorId: users.reviewers[2]._id,
				targetId: reviews[0]._id,
				text: "This is a fake review!",
				topic: "Spam",
				targetType: "review"
			}),
		];

		reportArr.forEach(async(report) => {
			await report.save();
		});

	}

}




//Export DataUtils
module.exports = new DataUtils();