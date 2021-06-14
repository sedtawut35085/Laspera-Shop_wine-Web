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
        msg
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

  router.get('/dashboard' ,middleware.checkAdmin, async function(req,res){
    let checkorder = 0
    let suminvoice = 0
    let sumpurchase = 0
    let sumuser = 0
    let sumproduct = 0
    let countredwine = await Product.countDocuments({category: 'Red Wine'});
    let countwhitewine = await Product.countDocuments({category: 'White Wine'});
    let countrosewine = await Product.countDocuments({category: 'Rose Wine'});
    let countdessertwine = await Product.countDocuments({category: 'Dessert Wine'});
    let countsparklingwine = await Product.countDocuments({category: 'Sparkling Wine'});
    const infouser = await userss.find({username: res.locals.currentUser.username})
    const order = await invoice.find();
    sumuser = await userss.countDocuments();
    sumproduct = await Product.countDocuments();
    try{
      checkorder = order[0].invoiceid
    }catch{
      
    }
    var datetime = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Bangkok'
    });
    try{
      for(let i=0;;i++){
        sumpurchase += order[i].sumofproduct
        suminvoice = order[i].invoiceid
      }
    }catch(err){
      console.log('err: ' + err)
    }
    res.render('accountdashboard.ejs',{
      order,
      name:  res.locals.currentUser.username,
      amountcart: amountcart,
      infouser,
      checkorder,
      datetime,
      sumpurchase,
      suminvoice,
      sumuser,
      sumproduct,
      countredwine,
      countwhitewine,
      countrosewine,
      countdessertwine,
      countsparklingwine
    })
  })
  
  router.get('/seller', middleware.checkAdmin, async (req,res,next) => {
    try{
      const infouser = await userss.find({username: res.locals.currentUser.username})
        const product  = await Product.find();
        res.render("accountseller.ejs", {
          product,
          name: res.locals.currentUser.username,
          amountcart: amountcart,
          infouser
        });
      }catch (err){
        console.log("err: "+ err); 
      }
  });
  
  router.get('/sellproduct', middleware.checkAdmin, async (req,res,next) => {
    const infouser = await userss.find({username: res.locals.currentUser.username})
    res.render("accountsellproduct.ejs", {
      name: res.locals.currentUser.username,
      amountcart: amountcart,
      infouser
    });
  });

  router.get('/allreview',middleware.checkAdmin, async (req,res,next) => {
    req.session.fromUrl = req.originalUrl;
    const infouser = await userss.find({username: res.locals.currentUser.username})
    const product  = await Product.find().populate('comments').exec();
    res.render("accountallreview.ejs", {
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

  router.post('/addproduct', async ( req, res, next)=>{
    let checkproduct = false
    const sellproduct  = await Product.countDocuments({name: req.body.name});
    if(sellproduct == 0){
      checkproduct = false
    }else{
      checkproduct = true
    }
    if(checkproduct == true){
      req.flash('success', "This product already have in store. !!!")
      res.redirect('/account/sellproduct');
    }else{
      var datetime = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Bangkok'
      });
      date = datetime
      const {name, detail, category, price, aging, alcohol, brand, sweettaste, aciditytaste ,bodytaste, finishtaste, quantity, img} = req.body;
      const product = new Product({
        name,
        detail,
        category,
        price, 
        aging,
        alcohol,
        brand,
        sweettaste,
        aciditytaste,
        bodytaste,
        finishtaste,
        quantity,
        date,
      });
      try{
        console.log('req.body.img: ' + req.body.img)
        console.log('req.body.name: ' + req.body.name)
        saveImage(product, req.body.img);
        console.log('succes save image')
         const newProduct = await product.save();
         console.log(newProduct);  
         req.flash('success', "Product name " + req.body.name + " has been packed in store.")
         res.redirect('/account/seller');
      }catch (err){
         console.log(err); 
         res.redirect('/account/seller');   
    }
    }
  });

  router.post('/updateemail', async(req,res)=>{
    console.log('updateemail')
    await userss.update({username: res.locals.currentUser.username},{$set:{"email":req.body.email}})
    req.flash('success', 'Your email has been changed successfully');
    res.redirect('/account/email')
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

  router.post('/updateimgprofile', async(req,res)=>{
    req.flash('success','Change image profile success')
    console.log('updateimgprofile')
    const updateuser = new userss({})
    saveImage(updateuser, req.body.img);
    await userss.update({username: res.locals.currentUser.username},{$set:{"img":updateuser.img,"imgType":updateuser.imgType}})
   
    res.redirect('/account/accountinfo')
  })

  router.get('/editproduct',middleware.isLoggedIn, async(req,res)=>{
    infouser = await userss.find({username: res.locals.currentUser.username})
    editpros = await Product.find({name : editpro })
    res.render('accounteditproduct.ejs',{
      editpros,
      name: res.locals.currentUser.username,
      amountcart: amountcart,
      infouser
    })
  })

  router.post('/editproduct', async(req,res)=>{
    editpro = req.query.ids
    console.log(editpros)
    res.redirect('/account/editproduct')
  })

  router.post('/updateproduct', async(req,res)=>{
    await Product.update({name: editpro},{$set:{"name": req.body.name,"price": req.body.price,"category": req.body.category,"detail": req.body.detail,"quantity": req.body.quantity,"sweettaste": req.body.sweettaste,"aciditytaste": req.body.aciditytaste,"bodytaste": req.body.bodytaste,"finishtaste": req.body.finishtaste,"brand": req.body.brand,"aging": req.body.aging,"alcohol": req.body.alcohol}})
    req.flash('success',"Your product has been changed successfully")
    updatepro = ''
    res.redirect('/account/seller') 
  })

  router.post('/updateimgproduct', async(req,res)=>{
    console.log('update img')
    const updateproduct = new Product({})
    if(req.body.img != ""){
      saveImage(updateproduct, req.body.img);
      await Product.update({name: editpro},{$set:{"img":updateproduct.img,"imgType":updateproduct.imgType}})
    }
    req.flash('success',"Your Img product has been changed successfully")
    res.redirect('/account/editproduct') 
  })

  router.post('/updatecard',async (req,res)=>{ 
    await creditcards.findByIdAndUpdate(req.query.id,{$set:{"NameCard":req.body.cardname,"NumberCard":req.body.cardnumber,"ValidDate":req.body.cardvalid,"CVV":req.body.cvv}})
    req.flash('success',"Your creditcard has been changed successfully")
    res.redirect('/account/creditcard')
  })

  router.post('/removeorder', async(req,res)=>{
    console.log('romove: ' + req.query.ids);
    console.log('romove2: ' + req.query.idss);
    var removepros = req.query.ids
    await userss.findOneAndUpdate({username: req.query.ids}, 
      {$pull: {invoice: req.query.idss}}, 
       )
    await invoice.findByIdAndRemove(req.query.idss)
    req.flash('success',"remove order id " + removepros + " finish.")
    res.redirect('/account/dashboard')
  }) 

  router.post('/removestore', async(req,res)=>{
    console.log('romove: ' + req.query.ids);
    var removepro = req.query.ids
    re = await Product.remove({name : removepro })
    req.flash('success', 'remove product name ' + removepro + ' finish.');
    res.redirect('/account/seller')
  })

  router.post('/deleteaccount', async (req,res) =>{
    console.log('Delete')
    req.flash('success','account name ' + res.locals.currentUser.username + ' is remove');
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