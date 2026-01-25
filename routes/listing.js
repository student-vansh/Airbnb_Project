const express = require("express");
const route = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listing");
const flash = require("connect-flash");
const { listingSchema, reviewSchema } = require("../Schema");
const { isLoggedIn, isOwner, validatelisting } = require("../middleware");

const listingController = require("../Controllers/Listings");
//Index.js Route
route.get("/", wrapAsync(listingController.index));

// Create ROute

route.get("/new", isLoggedIn,listingController.renderNewForm );

// put

route.post(
  "/",
  isLoggedIn,
  wrapAsync(listingController.CreateListing),
);

// Show Route
route.get(
  "/:id",
  wrapAsync(listingController.showListing),
);

route.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.EditListing),
);
// update

route.put(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.UpdateListing),
);

// app.put("/listings/:id",validatelisting,wrapAsync(async (req, res) => {
//   // if(!req.body.listing){
//   //   throw new ExpressError(400,"Send valid data for listing");
//   // }
//   let { id } = req.params;
//   await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//   res.redirect("/listings");
// }));

// Delete

route.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.DestroyListing),
);

module.exports = route;
