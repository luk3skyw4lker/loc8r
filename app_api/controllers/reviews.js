const mongoose = require('mongoose');
const request = require('request');
const Loc = mongoose.model('Location');
const User = mongoose.model('User');

const getAuthor = (req, res, callback) => {
  if(req.payload && req.payload.email) {
    User.findOne({ email: req.payload.email }).exec((err, user) => {
      if(!user){
        return res.status(404).json({ "Error": "User not found" });
      } else if (err){
        console.log(err);
        return res.status(500).json(err);
      }
      callback(req, res, user.name);
    });
  } else {
    return res.status(400).json({ "Error": "User email required" });
  }
}

const doAddReview = (req, res, location, author) => {
  if(!location){
    res.status(400).json({ "message": "Location id is required" });
  } else {
    const { rating, reviewText } = req.body;
    location.reviews.push({
      author,
      rating,
      reviewText
    });
    location.save((err, location) => {
      if(err) {
        res.status(400).json(err);
      } else {
        updateAverageRating(location._id);
        const thisReview = location.reviews.slice(-1).pop();
        res.status(201).json(thisReview);
      }
    });
  }
}

const doSetAveraging = (location) => {
  if(location.reviews && location.reviews.length > 0) {
    const count = location.reviews.length;
    const total = location.reviews.reduce((acc, {rating}) => {
      console.log("acc: " + acc + "rating: " + rating);
      return acc + rating;
    }, 0);

    console.log("total: " + total + " count: " + count);
    location.rating = parseInt(total / count, 10);
    location.save(err => {
      if(err){
        console.log("Erro");
        //console.log(err);
      } else {
        console.log("Average rating updated to", location.rating);
      }
    });
  }
};

const updateAverageRating = (locationId) => {
  Loc.findById(locationId).select('reviews').exec((err, location) => {
    if(!err){
      doSetAveraging(location);
    }
  });
};

const reviewsCreate = (req, res) => {
  getAuthor(req, res,
    (req, res, userName) => {
      const locationId = req.params.locationid;
      if(locationId) {
        Loc.findById(locationId).select('reviews').exec((err, location) => {
          if(err) {
            res.status(400).json(err);
          } else {
            doAddReview(req, res, location, userName);
          }
        });
      } else {
        res.status(400).json({ "message": "Location id is required" });
      }
    });
  //res.stauts(200).json({ "status" : "ok" });
};

const reviewsReadOne = (req, res) => {
  Loc.findById(req.params.locationid).select("name reviews").exec((err, location) => {
      if(!location){
        return res.status(404).json({
            "message":"Location not found"
          });
      }

      if(location.reviews && location.reviews.length > 0){
        const review = location.reviews.id(req.params.reviewid);
        if(!review){
          return res
            .status(404)
            .json({
              "message":"Review not found"
            });
        } else if(err) {
          return res
            .status(500)
            .json({
              "message":"Unknown server error"
            });
        } else {
          response = {
            location: {
              name: location.name,
              id: req.params.locationid
            },
            review
          };
          return res
            .status(200)
            .json(response);
        }
      } else {
        return res
          .status(404)
          .json({
            "message":"No reviews found"
          });
      }
    });
};

const reviewsUpdateOne = (req, res) => {
  if (!req.params.locationid || !req.params.reviewid) {
    return res.status(400).json({
        "message": "Locationid and reviewid are both required"
      });
  }
  Loc.findById(req.params.locationid).select('reviews').exec((err, location) => {
      if (!location) {
        return res.status(404).json({
            "message": "Location not found"
          });
      } else if (err) {
        return res.status(400).json(err);
      }
      if (location.reviews && location.reviews.length > 0) {
        const thisReview = location.reviews.id(req.params.reviewid);
        if (!thisReview) {
          res.status(404).json({
              "message": "Review not found"
            });
        } else {
          thisReview.author = req.body.author;
          thisReview.rating = req.body.rating;
          thisReview.reviewText = req.body.reviewText;
          location.save((err, location) => {
            if (err) {
              res.status(404).json(err);
            } else {
              updateAverageRating(location._id);
              res.status(200).json(thisReview);
            }
          });
        }
      } else {
        res.status(404).json({
            "message": "No review to update"
          });
      }
    }
  );
};

const reviewsDeleteOne = (req, res) => {
  const { locationid, reviewid } = req.params;
  if(!locationid || !reviewid){
    res.status(400).json({ "Error": "Location id and review id are required" })
  } else {
    Loc.findById(locationid).select('reviews').exec((err, location) => {
      if(!location){
        return res.status(404).json({ "Error": "Location not found" });
      } else if (err) {
        return res.status(500).json(err);
      }
      if(location.reviews && location.reviews.length > 0){
        if(!location.reviews.id(reviewid)){
          return res.status(404).json({ "Error": "Review not found" });
        } else {
          location.reviews.id(reviewid).remove();
          location.save(err => {
            if(err){
              return res.status(500).json({ "Error": "Error on removing review" });
            } else {
              updateAverageRating(location._id);
              res.status(204).json(null);
            }
          });
        }
      } else {
        res.status(404).json({ "Error": "No reviews to delete" });
      }
    });
  }
  //res.stauts(200).json({ "status" : "ok" });
};


module.exports = {
  reviewsCreate,
  reviewsUpdateOne,
  reviewsReadOne,
  reviewsDeleteOne
};
