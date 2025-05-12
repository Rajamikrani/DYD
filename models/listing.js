const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = Schema({
    title : {
        type : String ,
        required : true
    } ,
    description : {
        type : String
    } ,
    image : {
        type : String ,
        default : "https://images.unsplash.com/photo-1527555197883-98e27ca0c1ea?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjEyMDd9" ,
        set : (v) =>
             v === "" ? "https://images.unsplash.com/photo-1527555197883-98e27ca0c1ea?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjEyMDd9" : v
    } ,
    price : {
        type : Number
    } ,
    location : {
        type : String
    } , 
    country : {
        type : String
    }
});

const Listing = mongoose.model("listing" , listingSchema);
module.exports = Listing;