const express = require("express");
const route = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const Review = require("../models/reviews");
const Listing = require("../models/listing");
const {listingSchema} = require("../Schema");
const {validateReview,isLoggedIn ,isreviewauthor}= require("../middleware");






// Reviews -> POST route 

route.post("/",isLoggedIn,validateReview,wrapAsync(async(req,res)=>{
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

  console.log("New review saved");
  req.flash("success","New Review Created!");
  res.redirect(`/listings/${listing._id}`);
}));

// Delete review route

route.delete("/:reviewId",isLoggedIn,isreviewauthor,wrapAsync(async(req,res)=>{
  let {id,reviewId} = req.params;
  await Listing.findByIdAndUpdate(id,{$pull :{reviews : reviewId}});
  await Review.findByIdAndDelete(reviewId);
   req.flash("success","Review Deleted!");
  res.redirect(`/listings/${id}`);
}))


module.exports = route;