var   express = require('express'),
      router = express.Router(),
      userss = require('../models/user'),
      invoice = require("../models/invoice"),
      creditcards = require('../models/creditcard'),
      productcart = require("../models/productcart"),
      Product = require('../models/product'),
      comment = require("../models/comments"),
      middleware = require('../middleware');

let alert = require('alert'); 
let amountcart = 0
let msg ;
var editpro;
let editpros;

const imageMimeTypes = ["image/jpeg", "image/png", "images/gif"];

 router.get('/',middleware.isLoggedIn, async (req,res,next) => {
    console.log(' +  ' +  res.locals.currentUser)
    if(res.locals.currentUser == null){
      console.log('no user')
      try{
          name = res.locals.currentUser.username
      }catch{
          console.log('error')
      }
      res.redirect('/login')
    }else{    
        res.redirect('/account/accountinfo')
    }
});

 router.get('/accountinfo',middleware.isLoggedIn, async (req,res) => {
    amountcart = await productcart.countDocuments({username: res.locals.currentUser.username});
    console.log('go account info')
    const infouser = await userss.find({username: res.locals.currentUser.username})
    res.render('accountinfo.ejs',{
        name:  res.locals.currentUser.username,
        amountcart: amountcart,
        infouser,
      })
  });

 router.get('/email',middleware.isLoggedIn,async (req,res) =>{
    const infouser  = await userss.find({username:res.locals.currentUser.username})
    res.render('accountemail.ejs',
    {
      name:  res.locals.currentUser.username,
      amountcart: amountcart,
      infouser
   } 
    )
  })

  router.get('/address',middleware.isLoggedIn, async (req,res)=>{
    const infouser  = await userss.find({username:res.locals.currentUser.username})
    res.render('accountaddress.ejs',{
      name:  res.locals.currentUser.username,
      amountcart: amountcart,
      infouser
    })
  })

  router.get('/historybuyer',middleware.isLoggedIn, async (req,res)=>{
    let checkorder = 0
    const order  = await invoice.find({username:res.locals.currentUser.username});
    const infouser  = await userss.find({username:res.locals.currentUser.username})
    try{
      checkorder = order[0].invoiceid
    }catch{
      
    }
    res.render('accounthistorybuyer.ejs',{
      order,
      infouser,
      name:  res.locals.currentUser.username,
      amountcart: amountcart,
      checkorder
    })
  })

  router.get('/creditcard',middleware.isLoggedIn, async (req,res,next) => {
    var infocreditcard = await userss.findById(res.locals.currentUser._id).populate('creditcard').exec()
    const infouser  = await userss.find({username:res.locals.currentUser.username})
    console.log(infocreditcard)
    console.log(infocreditcard.creditcard[0]._id)
    try{
        res.render("accountcreditcard.ejs", {
          name: res.locals.currentUser.username,
          amountcart: amountcart,
          infocreditcard,
          infouser
        });
      }catch (err){
        console.log("err: "+ err); 
      }
  });

  router.get('/review',middleware.isLoggedIn, async (req,res,next) => {
    req.session.fromUrl = req.originalUrl;
    const infouser = await userss.find({username: res.locals.currentUser.username})
    const product  = await Product.find().populate('comments').exec();
    res.render("accountreview.ejs", {
      name: res.locals.currentUser.username,
      amountcart: amountcart,
      infouser,
      product
    });
  });

  router.post('/addaddress', async(req,res)=>{
    console.log('add address')
    await userss.update({username: res.locals.currentUser.username},{$set:{ "address":req.body.address, "phone":req.body.phone}})
    req.flash('success','Your Address & Phone has been changed successfully')
    res.redirect('/account/address')
    
  })

  router.post('/changepassword', function(req, res) {
    console.log('req.body.oldpassword: ' + req.body.oldpassword)
    console.log('req.body.newpassword: ' + req.body.newpassword)
    userss.findOne({ _id:  res.locals.currentUser._id},(err, user) => {
      if (err) {
        console.log('error')
      } else {
        if (!user) {
          console.log('user not found')
        } else {
          user.changePassword(req.body.oldpassword, req.body.newpassword, function(err) {
             if(err) {
               console.log('err ' + err)
                      if(err.name === 'IncorrectPasswordError'){
                        console.log('Incorrect password')
                        req.flash('error','Old Password is not correct')
                        res.redirect('/account/accountinfo')
                      }else {
                        console.log('Something went wrong!! Please try again after sometimes.')
                        req.flash('error','Something went wrong!! Please try again after sometimes')
                        res.redirect('/account/accountinfo')

                      }
            } else {
              console.log('success')
              req.flash('success','Your password has been changed successfully')
              res.redirect('/account/accountinfo')
             }
           })
        }
      }
    }); 

    });


  router.post('/updateemail', async(req,res)=>{
    console.log('updateemail')
    await userss.update({username: res.locals.currentUser.username},{$set:{"email":req.body.email}})
    req.flash('success', 'Your email has been changed successfully');
    res.redirect('/account/email')
  })

  router.post('/updateimgprofile', async(req,res)=>{
    req.flash('success','Change image profile success')
    console.log('updateimgprofile')
    const updateuser = new userss({})
    saveImage(updateuser, req.body.img);
    await userss.update({username: res.locals.currentUser.username},{$set:{"img":updateuser.img,"imgType":updateuser.imgType}})
   
    res.redirect('/account/accountinfo')
  })

  router.post('/updatecard',async (req,res)=>{ 
    await creditcards.findByIdAndUpdate(req.query.id,{$set:{"NameCard":req.body.cardname,"NumberCard":req.body.cardnumber,"ValidDate":req.body.cardvalid,"CVV":req.body.cvv}})
    req.flash('success',"Your creditcard has been changed successfully")
    res.redirect('/account/creditcard')
  })

  router.post('/deleteaccount', async (req,res) =>{
    console.log('Delete')
    req.flash('success','account name ' + res.locals.currentUser.username + ' has been delete successfully');
    console.log(req.query.id)
    const infodelete = await userss.findById(req.query.id)
    console.log(infodelete)
    console.log(infodelete.creditcard[0]._id)
    await userss.findByIdAndRemove(req.query.id)
    await creditcards.findByIdAndRemove(infodelete.creditcard[0]._id)
    await productcart.remove({username: res.locals.currentUser.username})
    req.logout();
    amountcart = 0
    name = ''
    res.redirect('/')
  });

  router.get('/logout', async (req,res) =>{
    console.log('logout')
    req.flash('error', 'Logged you out successfully');
    req.logout();
    allproduct = false
    name = ''
    amountcart = 0
    res.redirect(req.session.fromUrl)
  });


  function saveImage(product, imgEncoded) {
    if (imgEncoded == null) return;
    const img = JSON.parse(imgEncoded);
    console.log( "JSON parse: "+ img);
    if (img != null && imageMimeTypes.includes(img.type)) {
      product.img = new Buffer.from(img.data, "base64");
      product.imgType = img.type;
    }
  }
  
  module.exports = router;