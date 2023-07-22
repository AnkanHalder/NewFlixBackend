const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
    vidName: String,
    vidDescription: String,
    vidActors: Array,
    vidTags: Array, 
    vidLikes : Number,
    vidVideoLink: String,
    vidPosterLink: String,
    vidBackdropLink: String
});
const userSchema = new mongoose.Schema({
    userEmail: String,
    userWatchList: Array,
    userLiked: Array,
    userWatched: Array
});
module.exports.videoSchema = videoSchema;
module.exports.userSchema = userSchema;