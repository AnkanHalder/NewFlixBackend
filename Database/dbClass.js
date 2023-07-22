require('dotenv').config();
const mongoose = require('mongoose');
const {videoSchema,userSchema} = require('./schemas');

class dbClass {
    constructor(){
        mongoose.connect("mongodb+srv://" + process.env.mongoEmailID+ ":" + process.env.mongoPassword + "@cluster0.bg35g.mongodb.net/newflixDB");
        //mongoose.connect("mongodb://localhost:27017/userDataDB",{useNewUrlParser:true})
        this.video = mongoose.model("videoData", videoSchema);
        this.user = mongoose.model("userData", userSchema);
    }
    async insertVideoData(vidDetails){
        const newVid = new this.video(vidDetails);
        try {
            const savedVideo = await newVid.save();
            console.log('Video data saved successfully:', savedVideo);
          } catch (error) {
            console.error('Error saving video data:', error);
        }
          
    }
    async search(limit) {
        try {
          const videoList = await this.video.find().limit(limit).exec();
          if (videoList == null) {
            console.log('Bad Query. NULL list of videos\n');
            return [];
          } else {
            return videoList;
          }
        } catch (error) {
          console.error('Error retrieving video list:', error);
          return null;
        }
    }
    async searchById(id) {
      try {
        const video = await this.video.findById(id).exec();
        
        if (video == null) {
          console.log('NULL... Bad Query!!\n');
          return null;
        } else {
          return video;
        }
      } catch (error) {
        console.error('Error retrieving video:', error);
        return null;
      }
    }
    
    async searchByCatagory(catagory, reqLimit) {
      try {
        const videoList = await this.video.find({ vidTags: catagory }).limit(reqLimit).exec();
    
        if (videoList == null || videoList.length === 0) {
          console.log('NULL or empty list of videos\n');
          return [];
        } else {
          return videoList;
        }
      } catch (error) {
        console.error('Error retrieving video list:', error);
        return null;
      }
    }
    async searchMostLikedVideos(limit) {
      try {
        const videoList = await this.video.find({}).sort({vidLikes: -1}).limit(limit).exec();
        if (videoList == null || videoList.length === 0) {;
          return [];
        } else {
          return videoList;
        }
      } catch (error) {
        return null;
      }
    }
    // USER UPDATE METHORDS
    async checkOrCreateUser(email){
      const userList = await this.user.find({userEmail: email});
      if (userList == null || userList.length === 0) {
        const newUser = new this.user({
          userEmail: email,
          userWatchList: [],
          userLiked: [],
          userWatched: []
        });
        try {
          const savedUser = await newUser.save();

        } catch (error) {

      }
      }
      //USER ALREADY EXISTS
    }
    async AddToWatchList(email,vidDetails){
      await this.checkOrCreateUser(email);
      try {
        const user = await this.user.findOne({ userEmail: email });  
        if (!user) {
          throw new Error('User not found');
        }
        const existingObjectIndex = user.userWatchList.findIndex((item) => item._id === vidDetails._id);
        if(existingObjectIndex === -1) {
          user.userWatchList.push(vidDetails);
          await user.save();
        } else {
          // Video already in watchlist, remove it
          user.userWatchList.splice(existingObjectIndex, 1);
          await user.save();
        }
        return true;
      } catch (err) {
        console.error(`Error adding object to watch list: ${err.message}`);
        return false;
      }
    }
    async AddToLikedVideos(email,vidDetails){
      await this.checkOrCreateUser(email);
      try {
        const user = await this.user.findOne({ userEmail: email });
        if (!user) {
          throw new Error('User not found');
        }
        const existingObjectIndex = user.userLiked.findIndex((item) => item._id === vidDetails._id);
        if(existingObjectIndex === -1) {
          user.userLiked.push(vidDetails);
          await user.save();
        } else {
          // Video already in watchlist, remove it
          user.userLiked.splice(existingObjectIndex, 1);
          await user.save();
        }
        return true;
      } catch (err) {
        console.error(`Error adding video to liked videos: ${err.message}`);
        return false;
      }
    }
    async AddToWatchedVideos(email, _vidDetails, _percentWatched) {
      await this.checkOrCreateUser(email);
      const obj = {
        videoDetails: _vidDetails,
        percentWatched: _percentWatched
      };
    
      try {
        const user = await this.user.findOne({ userEmail: email });
        if (!user) {
          throw new Error('User not found');
        }
    
        const existingObjectIndex = user.userWatched.findIndex((item) => item.videoDetails._id === _vidDetails._id);
    
        if (existingObjectIndex === -1) {
          if (_percentWatched < 96) {
            user.userWatched.push(obj);
          }
        } else {
          if (_percentWatched < 96) {
            user.userWatched[existingObjectIndex].percentWatched = _percentWatched;
          } else {
            user.userWatched.splice(existingObjectIndex, 1);
          }
        }
        await user.save();
        return true;
      } catch (err) {
        console.error(`Error adding video to watched videos: ${err.message}`);
        return false;
      }
    }
    
    async getUserDetails(email){
      await this.checkOrCreateUser(email);
      try {
        const user = await this.user.findOne({ userEmail: email });
        return user;
      } catch{
        console.log("no User");
      }
    }
}
module.exports = dbClass;