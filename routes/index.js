var express = require('express');
var router = express.Router();

// router.get('/api-doc', function(req, res, next) {
//   // res.redirect('dashboard');
//   res.render('index', {
//     title: "cricheroes: login"
//   });
// });

/* GET home page. */
 router.get('/', function(req, res, next) {
   // res.redirect('dashboard');
   res.render('pages/login', {
     title: "EasyPay Admin: login"
   });
 });
//
 router.get('/dashboard', function(req, res, next) {
   // if any specif value pass in page than wrte here like
   //var drinks = [{
   //  name: 'Bloody Mary',
   //  drunkness: 3
   //}, {
   //  name: 'Martini',
   //  drunkness: 5
   //}, {
   //  name: 'Scotch',
   //  drunkness: 10
   //}];
   //var tagline = "Any code of your own that you haven't looked at for six or more months might as well have been written by someone else.";

   res.render('pages/dashboard', {
     title: "EasyPay Admin: dashboard"
     //drinks: drinks,
     //tagline: tagline
   });
 });


//router.get('/scorecard', function(req, res, next) {
//  res.render('pages/scorecard', {
//    title: "cricheroes: scorecard"
//  });
//});

//router.get('/matches', function(req, res, next) {
//  res.render('pages/matches', {
//    title: "cricheroes: matches"
//  });
//});


module.exports = router;
