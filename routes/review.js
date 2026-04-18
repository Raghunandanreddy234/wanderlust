const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/WrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require('../models/reviews.js');
const Listing = require('../models/listing.js');
const { isLoggedIn, validateReview, isreviewAuthor } = require("../middleware.js");

const  reviewController = require("../controllers/review.js");


//post Review route
router.post("/", validateReview, isLoggedIn, wrapAsync(reviewController.createReview));


//Delete  Review Route


router.delete("/:reviewId",isreviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;