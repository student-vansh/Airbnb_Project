const Listing = require("../models/listing");
module.exports.index = async (req, res) => {
  const allListing = await Listing.find({});
  res.render("listings/index.ejs", { allListing });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist");
    res.redirect("/listings");
  }
  console.log(listing);

  res.render("listings/show.ejs", { listing });
};

module.exports.CreateListing = async (req, res, next) => {
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
  }

  module.exports.EditListing = async (req, res) => {
      let { id } = req.params;
      const listing = await Listing.findById(id);
      if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
      }
      res.render("listings/edit.ejs", { listing });
    }

    module.exports.UpdateListing = async (req, res) => {
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
      }

      module.exports.DestroyListing = async (req, res) => {
          let { id } = req.params;
          let deletelist = await Listing.findByIdAndDelete(id);
          req.flash("success", "Listing Deleted");
          res.redirect("/listings");
        }