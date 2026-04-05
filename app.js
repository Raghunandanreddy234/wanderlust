const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing.js'); 
const path = require('path');
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const methodOverride = require("method-override");
const { reviewSchema } = require("./schema.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");



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


const validateReview = (req, res, next) => {
const {value, error }  = reviewSchema.validate(req.body);
console.log("result ", error);
if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    next(new ExpressError(400, errMsg));
}
else {
    next(); 
    }
}; 

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);






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