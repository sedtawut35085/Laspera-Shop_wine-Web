var   userss = require('../models/user'),
      invoice = require("../models/invoice"),
      creditcards = require('../models/creditcard'),
      productcart = require("../models/productcart"),
      Product = require('../models/product'),
      comment = require("../models/comments");


var middlewareObj = {};

middlewareObj.checkAdmin = function(req, res, next){
    if(req.isAuthenticated()){
        userss.findById(res.locals.currentUser._id, function(err, foundUser){
            if(err){
                res.redirect('back');
            } else {
                console.log('foundUser : ' + foundUser.username)
                if(foundUser.username == 'admin') {
                    next();
                } else {
                    res.redirect('back');
                }
            }
        });
    } else {
        res.redirect('back');
    }
}


middlewareObj.checkCommentOwner = function(req, res, next){
    if(req.isAuthenticated()){
        comment.findById(res.locals.currentUser._id, function(err, foundComment){
            if(err){
                res.redirect('back');
            } else {
                if(foundComment.author.id == req.user._id) {
                    next();
                } else {
                    res.redirect('back');
                }
            }
        });
    } else {
        res.redirect('back');
    }
}


middlewareObj.isLoggedIn = function(req, res , next){
    if(req.isAuthenticated()){
      console.log('not login')
      return next();
    }
    console.log('req.session.fromUrl : ' + req.session.fromUrl)
    res.redirect('/login')
  }

  module.exports = middlewareObj;