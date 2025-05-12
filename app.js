const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError =require("./utils/ExpressError");
const {listingSchema} = require("./schema.js");
const { log } = require("console");
const app = express();


app.use(methodOverride("_method"));
app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "views"));
app.use(express.urlencoded({extended : true}));
app.use(express.static(path.join(__dirname , "public")));

app.engine("ejs" , ejsMate);

const MONGO_URL = "mongodb://127.0.0.1:27017/dyd_db";

main()
.then(() => {
    console.log("Connection Sucessful");
})
.catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.get("/" , (req , res) => {
    console.log("App is Working");
    res.send("App is working.");
})

const validateListing = (req , res , next) => {
   const {error} =  listingSchema.validate(req.body);
    console.log(result);
    
    if (error) {
        let errMsg = error.details.map((e) => e.message).join(",");
        throw new ExpressError("400" , errMsg);
    }else{
        next();
    }
}

app.get("/listings" , wrapAsync( async (req , res) => {
   const allListing = await Listing.find({});
   res.render("./listings/index.ejs" , {allListing});
}));

app.get("/listings/new" , (req , res) => {
    console.log("New Listing Page");
    res.render("./listings/new.ejs");
})

app.get("/listings/:id" ,wrapAsync( async (req , res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    // console.log(listing);
    console.log(id);
    res.render("listings/show.ejs" , {listing});
}));

// Create Route
app.post("/listings" , validateListing , wrapAsync(async (req , res , next) => {
    // if (!req.body.listing) {
    //     throw new ExpressError(400 , "Send valid data for Listing");
    // }

    const newListing = new Listing(req.body.listing);
    // let listing = req.body; 
    // console.log(listing);
    await newListing.save();
    res.redirect("/listings");
})
);

 app.get("/listings/:_id/edit" , validateListing ,wrapAsync( async (req , res) => {
    let {_id} = req.params;
    const listing = await Listing.findById(_id);
    res.render("./listings/edit.ejs" , {listing});
 }));

 app.put("/listings/:_id"  ,wrapAsync( async(req , res) => {
    let {_id} = req.params;
    await Listing.findByIdAndUpdate(_id , {...req.body.listing});
    res.redirect(`/listings/${_id}`);
 }));

 app.delete("/listings/:_id" ,wrapAsync( async (req , res) => {
    let {_id} = req.params;
    const deletedListing = await Listing.findByIdAndDelete(_id);
    console.log(deletedListing);
    res.redirect("/listings");
 }));



// app.get("/testListing" , async (req , res) => {
//     let sampleListing = listing({
//         title : "New House Villa" ,
//         description : "by the Nature View of Mountain" ,
//         price : 1000 ,
//         location : "Kathmandu" ,
//         country : "Nepal"
//     });
//     await sampleListing.save(); 
//     console.log("Sample was Saved.");
//     res.send("Sucessful");
// });

app.all( "/*splat" , (req , res , next) => {
    next(new ExpressError(404 , "Page Not Found"));
});

app.use((err , req , res , next) => {
    let {statusCode = 500 , message = "SomeThing went wrong"} = err;
    res.render("error.ejs" , {message});
    // res.status(statusCode).send(message);
});

app.listen("8080" , () => {
    console.log("App is listening at Port 8080");
});