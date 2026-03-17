const express = require("express");
const route = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listing");
const flash = require("connect-flash");
const { listingSchema, reviewSchema } = require("../Schema");
const { isLoggedIn, isOwner, validatelisting } = require("../middleware");
const multer = require("multer");
const { storage } = require("../Cloudconfig.js");
const upload = multer({ storage });

const listingController = require("../Controllers/Listings");

route
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn,upload.single("listing[image][url]"),validatelisting, wrapAsync(listingController.CreateListing));
// .post(upload.single("listing[image][url]"), (req, res) => {
//   res.send(req.file);
// });

//New ROute
route.get("/new", isLoggedIn, listingController.renderNewForm);

route
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(isLoggedIn, isOwner, wrapAsync(listingController.UpdateListing))
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.DestroyListing));

route.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.EditListing),
);
// app.put("/listings/:id",validatelisting,wrapAsync(async (req, res) => {
//   // if(!req.body.listing){
//   //   throw new ExpressError(400,"Send valid data for listing");
//   // }
//   let { id } = req.params;
//   await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//   res.redirect("/listings");
// }));
module.exports = route;
