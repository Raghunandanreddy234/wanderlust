const Listing = require("../models/listing");
const axios = require("axios");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing doesn't exists!");
    res.redirect("/listings");
  } else {
    console.log("Listing Data:", listing);
    res.render("listings/show.ejs", { 
      listing, 
      mapToken: process.env.MAP_TOKEN,
      currentUser: req.user  // ✅ ADDED
    });
  }
};

module.exports.createListing = async (req, res) => {
  try {
    const { location, country } = req.body.listing;
    
    console.log("📍 Creating listing with location:", location, "Country:", country);
    console.log("🔑 MAP_TOKEN exists:", !!process.env.MAP_TOKEN);

    // Geocode the location using MapTiler API
    const geoUrl = `https://api.maptiler.com/geocoding/${encodeURIComponent(location + ", " + country)}.json?key=${process.env.MAP_TOKEN}`;
    console.log("🌐 Geocoding URL:", geoUrl.replace(process.env.MAP_TOKEN, "***HIDDEN***"));

    const geoRes = await axios.get(geoUrl);
    
    console.log("✅ Geocoding Response:", JSON.stringify(geoRes.data, null, 2));

    // Safety Check - make sure we got results
    if (!geoRes.data.features || geoRes.data.features.length === 0) {
      console.log("❌ No features found in geocoding response");
      req.flash("error", "Invalid Location! Please check the location and country.");
      return res.redirect("/listings/new");
    }

    const coords = geoRes.data.features[0].geometry.coordinates; // [lng, lat]
    console.log("📌 Final Coordinates:", coords);

    let url = req.file.path;
    let filename = req.file.filename;
    console.log("🖼️ Image URL:", url, "Filename:", filename);

    const newListing = new Listing({
      ...req.body.listing,
      owner: req.user._id,
      image: { url, filename },
      geometry: {
        type: "Point",
        coordinates: coords, // [lng, lat] from MapTiler
      },
    });

    await newListing.save();
    console.log("💾 Listing saved with geometry:", newListing.geometry);
    
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  } catch (error) {
    console.error("❌ ERROR creating listing:");
    console.error("Error Message:", error.message);
    console.error("Error Response:", error.response?.data);
    console.error("Full Error:", error);
    
    req.flash("error", `Error: ${error.message}`);
    res.redirect("/listings/new");
  }
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing doesn't exists!");
    res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  try {
    let { id } = req.params;
    const { location, country } = req.body.listing;

    let listing = await Listing.findById(id);

    // Update geometry if location changed
    if (location && country) {
      console.log("📍 Updating location:", location, country);
      
      const geoUrl = `https://api.maptiler.com/geocoding/${encodeURIComponent(location + ", " + country)}.json?key=${process.env.MAP_TOKEN}`;
      const geoRes = await axios.get(geoUrl);

      if (geoRes.data.features && geoRes.data.features.length > 0) {
        listing.geometry = {
          type: "Point",
          coordinates: geoRes.data.features[0].geometry.coordinates,
        };
        console.log("📌 Updated coordinates:", listing.geometry.coordinates);
      }
    }

    // Update basic fields
    Object.assign(listing, req.body.listing);

    // Update image if new one uploaded
    if (typeof req.file !== "undefined") {
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = { url, filename };
    }

    await listing.save();
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
  } catch (error) {
    console.error("❌ Error updating listing:", error.message);
    req.flash("error", "Error updating listing. Please try again.");
    res.redirect("/listings");
  }
};

module.exports.deleteListing = async (req, res) => {
  try {
    let { id } = req.params;
    const listing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect(`/listings`);
  } catch (error) {
    console.error("❌ Error deleting listing:", error.message);
    req.flash("error", "Error deleting listing. Please try again.");
    res.redirect("/listings");
  }
};