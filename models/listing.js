const mongoose = require("mongoose");
const reviews = require("./reviews");
const Review = require("./reviews");
const { ref } = require("joi");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
   filename: {
      type: String,
      default: "listingimage",
    },
    url: {
      type: String,
      default:
        "https://www.teahub.io/photos/full/1-17137_elegant-modern-luxury-house-wallpaper-luxury-house-images.jpg",
      set: (v) =>
        v === ""
          ? "https://www.teahub.io/photos/full/1-17137_elegant-modern-luxury-house-wallpaper-luxury-house-images.jpg"
          : v,
    },
  },
  price: Number,
  location: String,
  country: String,
  reviews : [
    {
    type : Schema.Types.ObjectId,
    ref : "Review",
    },
  ],
  owner :{
    type : Schema.Types.ObjectId,
    ref : "User",
  },
});

listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
     await Review.deleteMany({_id:{$in : listing.reviews}});
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;