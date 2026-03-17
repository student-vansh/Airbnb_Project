const express = require("express");
const route = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { listingSchema } = require("../Schema");
const { validateReview, isLoggedIn, isreviewauthor } = require("../middleware");
const reviewController = require("../Controllers/reviews");
// Reviews -> POST route

route.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview),
);

// Delete review route

route.delete(
  "/:reviewId",
  isLoggedIn,
  isreviewauthor,
  wrapAsync(reviewController.destroyreview),
);

module.exports = route;
