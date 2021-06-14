var express = require('express'),
    router = express.Router({mergeParams: true}),
    userss = require('../models/user'),
    creditcards = require('../models/creditcard'),
    productcart = require("../models/productcart"),
    Product = require('../models/product'),
    passport = require("passport");

let alert = require('alert'); 
let amountcart = 0;
let countallwine = 0;
let countredwine = 0;
let countwhitewine = 0;
let countrosewine = 0;
let countsparklingwine = 0;
let countdessertwine = 0;
let name;
let infouser;

router.get('/',middleware.checkUser, async(req,res) => {
  req.session.fromUrl = req.originalUrl;
  checkadvance = false
    var datetime = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Bangkok'
    });
    console.log(datetime);
    if(res.locals.currentUser == null){
      amountcart = 0
      name= ''
    }else{
      name = res.locals.currentUser.username
      infouser = await userss.findById(res.locals.currentUser._id)
      amountcart = await productcart.countDocuments({username: res.locals.currentUser.username});
    }
    countallwine = await Product.countDocuments();
    countredwine = await Product.countDocuments({category: 'Red Wine'});
    countwhitewine = await Product.countDocuments({category: 'White Wine'});
    countrosewine = await Product.countDocuments({category: 'Rose Wine'});
    countdessertwine = await Product.countDocuments({category: 'Dessert Wine'});
    countsparklingwine = await Product.countDocuments({category: 'Sparkling Wine'});
      res.render('index.ejs',{
        name:  name,
        infouser,
        amountcart: amountcart,
        countallwine: countallwine,
        countredwine: countredwine,
        countwhitewine: countwhitewine,
        countrosewine: countrosewine,
        countdessertwine: countdessertwine,
        countsparklingwine: countsparklingwine
      })
});

router.get('/login', async (req,res,next) => {
  if(res.locals.currentUser){
    name = res.locals.currentUser.username
    amountcart = await productcart.countDocuments({username: res.locals.currentUser.username});
  }else{
    name = ''
  }
  res.render('login.ejs',{
    name:  name,
    amountcart: amountcart,
  })
});

router.get('/register', async (req,res,next) => {
  try{
    name = res.locals.currentUser.username
    amountcart = await productcart.countDocuments({username: res.locals.currentUser.username});
  }catch{
    console.log('error')
  }
  res.render('register.ejs',{
    name:  name,
    amountcart: amountcart,
  })
});

router.post('/login', passport.authenticate('local',
   {  
     failureRedirect: '/login',
     successFlash: true,
     failureFlash: true,
     successFlash: 'Successfully log in',
     failureFlash: 'Invalid username or password'
   }),async function(req,res){
     console.log('req.session.fromUrl : ' + req.session.fromUrl)
     console.log('login done.')
     console.log('req.user.username ' + req.user.username)
     
     console.log('req.user.role ' + req.user.role)
 
     if(req.user.role == 'Admin' || req.user.role == 'Master Admin'){
      res.redirect('/admin/seller');
     }else{
      res.redirect(req.session.fromUrl);
     }

   }
);

router.post('/register', function async (req,res){
    console.log('register')
    var newUser = new userss({username: req.body.username , email: req.body.email , address: '' , phone: '' , img: null , imgType: null , role: 'User'});
      userss.register(newUser, req.body.password, function(err, user){
          if(err) {
              console.log(err);
              req.flash('error', err.message);
              return res.redirect('/register');
          }
          req.flash('success', 'Register finish ');
          const cardinfo = new creditcards({NameCard: '' , NumberCard: '' ,  ValidDate : '', CVV : null})
          cardinfo.save();
          console.log('cardinfo._id ' + cardinfo._id)
          user.creditcard.push(cardinfo._id)
          user.save()  
          res.redirect('/login');
      });
});




module.exports = router;