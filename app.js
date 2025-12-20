const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing.js'); 
const path = require('path');
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/WrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const methodOverride = require("method-override");
const { listingSchema } = require("./schema.js");


// MongoDB connection
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
    .then(() => {
        console.log(" Connected to MongoDB");
    })
    .catch((err) => {
        console.error(" MongoDB connection error:", err);
    });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, 'public')));
 app.use(express.urlencoded( {extended: true}));
 app.engine("ejs", ejsMate);
 app.use(methodOverride("_method"));
app.set("view engine", "ejs");

// Routes
app.get('/', (req, res) => {
    res.send("I am Groot");
});

const validateListing = (req, res, next) => {
const {value, error }  = listingSchema.validate(req.body);
console.log("result ", error);
if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    next(new ExpressError(400, errMsg));
}
else {
    next(); 
    }
}; 

app.get("/listings", wrapAsync(async (req, res) => {
      const allListings =  await Listing.find({})
    res.render("listings/index", {allListings} );

}));


 app.use(express.static(path.join(__dirname, 'public')));//New route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});


//Show Route

app.get("/listings/:id", wrapAsync(async(req, res) => {
    let { id } = req.params;
const listing = await Listing.findById(id);
 res.render("listings/show", { listing } );
}));

//create route
app.post("/listings"
    , validateListing,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
   res.redirect("/listings");
    })
    
);

//Edit aRoute

app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
}));

//Update Route
app.put("/listings/:id",
    validateListing, wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
}));

//delete a route

app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));


// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My new villa",
//         description: "By the Beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India",
//     });
//     await sampleListing.save();
//     console.log(" Sample listing saved");
//     res.send("Successfully tested");
// });

app.all("/*splat", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});



app.use((err, req, res, next) => {
    let {statusCode=500, message="something went wrong"} = err;
    res.status(statusCode).render("error.ejs", {err, message}); 
    //res.status(statusCode).send("message");
});

app.get('/raghu', (req, res) => {
    res.send("I am Thomas Shelby");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});