const request = require('request');
const apiOptions = {
  server: 'http://localhost:3000'
};
if(process.env.NODE_ENV === 'production'){
  apiOptions.server = process.env.API_URL;
}

const getLocationInfo = (req, res, callback) => {
  const path = `/api/locations/${req.params.locationid}`;
  const requestOptions = {
    url: `${apiOptions.server}${path}`,
    method: 'GET',
    json: {}
  };
  request(requestOptions,
    (err, {statusCode}, body) => {
      let data = body;
      if(statusCode === 200){
        data.coords = {
          lng: body.coords[0],
          lat: body.coords[1]
        };
        callback(req, res, data);
      } else {
        showError(req, res, statusCode);
      }
  });
}

const showError = (req, res, status) => {
  let title = '';
  let content = '';
  if(status === 404){
    title = 'Page not found';
    content = 'Something has gone wrong, we can\'t find this page';
  } else {
    title = `${status}, something\'s gone wrong`;
    content = 'Well, something, somewhere, has gone really wrong';
  }
  res.status(status);
  res.render('generic-text', {
    title,
    content
  });
}

const renderLocationInfo = function (req, res, location) {
  res.render('location-info', {
    title: location.name,
    pageHeader: {
      title: location.name
    },
    sidebar: {
      context: 'is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
      callToAction: 'If you\'ve been and you like it - or if you don\'t - please leave a review to help other people just like you.'
    },
    location: location
  });
}

const formatDistance = (distance) => {
  let thisDistance = 0;
  let unit = 'm';
  if(distance > 1000){
    thisDistance = parseFloat(distance / 1000).toFixed(1);
    unit = 'km'
  } else {
    thisDistance = Math.floor(distance);
  }
  return thisDistance + unit;
}

const renderHomePage = (req, res, responseBody) => {
  let message = null;
  if(!(responseBody instanceof Array)){
    message = "API lookup error";
    responseBody = [];
  } else {
    if(!responseBody.length){
      message = "No places found nearby";
    }
  }
  res.render('locations-list', {
    title: 'Loc8r - find a place to work with wifi',
    pageHeader: {
      title: 'Loc8r',
      strapline: 'Find places to work with wifi near you!'
    },
    sidebar: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you're looking for.",
    locations: responseBody,
    message
  });
}

const doAddReview = (req, res) => {
  const locationid = req.params.locationid;
  const path = `/api/locations/${locationid}/reviews`;
  const postdata = {
    author: req.body.name,
    rating: parseInt(req.body.rating, 10),
    reviewText: req.body.review
  };
  const requestOptions = {
    url: `${apiOptions.server}${path}`,
    method: 'POST',
    json: postdata
  };
  if (!postdata.author || !postdata.rating || !postdata.reviewText) {
    res.redirect(`/location/${locationid}/review/new?err=val`);
  } else {
    request(requestOptions,
      (err, {statusCode}, {name}) => {
        if (statusCode === 201) {
          res.redirect(`/location/${locationid}`);
        } else if (statusCode === 400 && name && name === 'ValidationError') {
          res.redirect(`/location/${locationid}/review/new?err=val`);
        } else {
          showError(req, res, statusCode);
        }
      }
    );
  }
};

const homelist = (req, res, responseBody) => {
  const path = '/api/locations';
  const requestOptions = {
    url: `${apiOptions.server}${path}`,
    method: 'GET',
    json: {},
    qs: {
      lng: -0.7992599,
      lat: 51.378091,
      maxDistance: 20000
    }
  };
  request(requestOptions, (err, {statusCode}, body) => {
    let data = [];
    if(statusCode === 200 && body.length){
      data = body.map((item) => {
        item.distance = formatDistance(item.distance);
        return item;
      });
    }
    renderHomePage(req, res, data);
  });
};

const locationInfo = (req, res) => {
  getLocationInfo(req, res, (req, res, responseData) => renderLocationInfo(req, res, responseData));
};

const renderReviewForm = (req, res, {name}) => {
  res.render('location-review-form', {
    title: `Review ${name} on Loc8r` ,
    pageHeader: { title: `Review ${name}` },
    error: req.query.err
  });
};

const addReview = (req, res) => {
  getLocationInfo(req, res, (req, res, responseData) => renderReviewForm(req, res, responseData));
};

module.exports = {
  homelist,
  locationInfo,
  addReview,
  doAddReview
};
