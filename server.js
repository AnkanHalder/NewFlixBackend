const express = require('express');
const dbClass = require('./Database/dbClass');
const app = express();
const db = new dbClass();
const bodyParser = require('body-parser');


const cors = require('cors'); //CORS (Cross-Origin Resource Sharing)
app.use(cors());
// app.use(cors({
//   origin: 'https://example.com', // Replace with the actual allowed origin(s)
// }));


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.route('/').get((req,res)=>{
    res.send("Root Route");
})

///////////POST routes
app.route('/post/insertVideo').post((req,res)=>{
  req.body.vidTags = req.body.vidTags.split(" ");
  db.insertVideoData(req.body);
  res.send("Message Sent");
});

//////////GET routes
app.route('/get/video/search/:limit').get((req,res)=>{
  db.search(req.params.limit).then((vList) => {
    res.send(vList);
  }).catch(error => {
    console.error('Error retrieving video list:', error);
  });
});
app.route('/get/video/searchByID/:id').get((req,res)=>{
  db.searchById(req.params.id).then((vList) => {
    res.send(vList);
  }).catch(error => {
    console.error('Error retrieving video list:', error);
  });
});
app.route('/get/video/searchByCatagory/:cat').get((req,res)=>{
  db.searchByCatagory(req.params.cat).then((vList) => {
    res.send(vList);
  }).catch(error => {
    console.error('Error retrieving video list:', error);
  });
});
app.route('/get/video/searchMostLikedVideos/:limit').get((req,res)=>{
  db.searchMostLikedVideos(req.params.limit).then((vList) => {
    res.send(vList);
  }).catch(error => {
    console.error('Error retrieving video list:', error);
  });
});

//USER UPDATE ROUTES
app.route('/updateUser/watchList').post((req,res)=>{
  db.AddToWatchList(req.body.email, req.body.data).then((success)=>{
    res.send(success);
  }).catch(error => { console.error('Error retrieving video list:', error);});
});
app.route('/updateUser/likedVideos').post((req,res)=>{
  db.AddToLikedVideos(req.body.email, req.body.data).then((success)=>{
    res.send(success);
  }).catch(error => { console.error('Error retrieving video list:', error);});
});
app.route('/updateUser/watchedVideos').post((req,res)=>{
  db.AddToWatchedVideos(req.body.email, req.body.data,req.body.percentWatched);
});
//USER GET ROUTES 
app.route('/get/userDetails/:email').get((req,res)=>{
    db.getUserDetails(req.params.email)
    .then((userDetails) => {
      res.send(userDetails);
    })
    .catch((error) => {
      console.error('Error fetching user details:', error);
      res.status(500).send('Error fetching user details');
    });
})


let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.listen(port, () => {
  console.log("Server is Running on Port " + port + ".....");
});