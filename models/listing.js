const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,

    image: { // 'image' field is now an object
        url: {
            type: String,
            // default aur set function ko yahan se hata diya gaya hai
        },
      filename: {
       type: String, 
       default: "listingimage",
      }
    },

    price: Number,
    location: String,
    country: String,
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;