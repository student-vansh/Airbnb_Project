if(process.env.NODE_ENV != "production"){
  require('dotenv').config() // or import 'dotenv/config' if you're using ES6
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodoverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const listingRouter = require("./routes/listing");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const session = require("express-session");
const flash = require("connect-flash");
// const cookieParser = require("cookie-parser");
// app.use(cookieParser());

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodoverride("_method"));
app.engine("ejs", ejsMate);

const sessionOptions = {
  secret: "mySuperscretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.get("/", (req, res) => {
  res.send("Hi, I am Vansh");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// app.get("/demouser", async (req, res) => {
//   let fakeUser = new User({
//     email: "Student@gmail.com",
//     username: "delta-student",
//   });

//   let registeredUser = await User.register(fakeUser, "helloworld");
//   res.send(registeredUser);
// });
app.use("/",userRouter);
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewsRouter);


main() 
  .then((res) => {
    console.log("Connection sucessfull");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

// app.get("/testListing",async(req,res)=>{
//   let samplelist = new Listing({
//     title:"My New Villa",
//     description : "By the Beach",
//     price : 1200,
//     location:"Calanguate , Goa",
//     country :"India",
//   })

//   await samplelist.save();

//   console.log("Data Is Saved");

//   res.send("Data is Sucessfully Svaed");
// })

// MiddleWare
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Went Wrong!" } = err;
  // res.status(statusCode).send(message);
  res.status(statusCode).render("Error.ejs", { message });
});
app.listen(8080, () => {
  console.log("Server Is ready");
});
