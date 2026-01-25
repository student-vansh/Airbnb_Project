const express = require("express");
const route = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listing");
const flash = require("connect-flash");
const { listingSchema, reviewSchema } = require("../Schema");
const { isLoggedIn, isOwner,validatelisting } = require("../middleware");


//Index.js Route
route.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
  })
);

// Create ROute

route.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

// put

route.post(
  "/",
  isLoggedIn,
  wrapAsync(async (req, res, next) => {
    // if(!req.body.listing){
    //   throw new ExpressError(400,"Send valid data for listing");
    // }
    //   const newList = new Listing(req.body.listing);
    //   if(!newList.description){
    //     throw new ExpressError(400,"Description is Missing!");
    //   }
    //   if(!newList.title){
    //     throw new ExpressError(400,"Title is Missing!");
    //   }
    //   if(!newList.location){
    //     throw new ExpressError(400,"location is Missing!");
    //   }
    // const result = listingSchema.validate(req.body);
    // console.log(result);
    // if(result.error){
    //   throw new ExpressError(404,result.error);
    // }

    const newList = new Listing({
      ...req.body.listing,
      image: {
        url:
          req.body.listing.image.url ||
          "https://dummyimage.com/600x400/000/fff",
      },
    });
     newList.owner = req.user._id;
    await newList.save();
    req.flash("success", "New Listing Created!");
    console.log("list is saved");
    res.redirect("/listings");

    //  const newList = new Listing(req.body.listing);
    //   await newList.save();
    //   console.log("list is saved");
    //   res.redirect("/listings");
  })
);

// Show Route
route.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path :"reviews",populate :{path :"author",},}).populate("owner");
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist");
      res.redirect("/listings");
    }
    console.log(listing);
    
    res.render("listings/show.ejs", { listing });
  })
);

route.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  })
);
// update

route.put(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;

    if (!req.body.listing.image.url) {
      delete req.body.listing.image;
    }
    // let listing = await Listing.findById(id);
    // if (!listing.owner._id.equals(res.locals.currUser._id)) {
    //   req.flash("error","You don't have permission to edit");
    //  return res.redirect(`/listings/${id}`);
    // }
    await Listing.findByIdAndUpdate(id, req.body.listing, {
      runValidators: true,
    });
    req.flash("success", "Listing Updated !");
    res.redirect(`/listings/${id}`);
  })
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
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletelist = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
  })
);

module.exports = route;
