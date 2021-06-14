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


 
router.get('/dashboard' ,middleware.checkAdmin, async function(req,res){
    let checkorder = 0
    let suminvoice = 0
    let sumpurchase = 0
    let sumuser = 0
    let sumproduct = 0
    let i = 0
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
      for(i;;i++){
        sumpurchase += order[i].sumofproduct
        
      }
 
    }catch(err){
      console.log('err: ' + err)
    }
    suminvoice = i-1
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
      res.redirect('/admin/sellproduct');
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
         res.redirect('/admin/seller');
      }catch (err){
         console.log(err); 
         res.redirect('/admin/seller');   
    }
    }
  });

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
                        res.redirect('/admin/accountprofileadmin')
                      }else {
                        console.log('Something went wrong!! Please try again after sometimes.')
                        req.flash('error','Something went wrong!! Please try again after sometimes')
                        res.redirect('/admin/accountprofileadmin')

                      }
            } else {
              console.log('success')
              req.flash('success','Your password has been changed successfully')
              res.redirect('/admin/accountprofileadmin')
             }
           })
        }
      }
    }); 

    });



  router.get('/editproduct',middleware.checkAdmin, async(req,res)=>{
    infouser = await userss.find({username: res.locals.currentUser.username})
    editpros = await Product.find({name : editpro })
    res.render('accounteditproduct.ejs',{
      editpros,
      name: res.locals.currentUser.username,
      amountcart: amountcart,
      infouser
    })
  })

  router.get('/accountprofileadmin',middleware.checkAdmin, async(req,res)=>{
    amountcart = await productcart.countDocuments({username: res.locals.currentUser.username});
    console.log('go account info')
    const infouser = await userss.find({username: res.locals.currentUser.username})
    res.render('accountprofileadmin.ejs',{
      name:  res.locals.currentUser.username,
      amountcart: amountcart,
      infouser,
    })
  })
  

  router.get('/alluser',middleware.checkMasterAdmin, async(req,res)=>{
    infouser = await userss.find({username: res.locals.currentUser.username})
    const infoalluser = await userss.find()
    res.render('accountalluser.ejs',{
      name: res.locals.currentUser.username,
      amountcart: amountcart,
      infouser,
      infoalluser
    })
  })


  router.post('/updateimgprofile', async(req,res)=>{
    req.flash('success','Change image profile success')
    console.log('updateimgprofile')
    const updateuser = new userss({})
    saveImage(updateuser, req.body.img);
    await userss.update({username: res.locals.currentUser.username},{$set:{"img":updateuser.img,"imgType":updateuser.imgType}})
   
    res.redirect('/admin/accountprofileadmin')
  })

  router.post('/editproduct', async(req,res)=>{
    editpro = req.query.ids
    console.log(editpros)
    res.redirect('/admin/editproduct')
  })

  router.post('/updaterole',middleware.checkMasterAdmin, async(req,res)=>{
    console.log(req.body.role)
    console.log(req.query.id)
    req.flash('success',"update " + req.query.name + "'s role  to " + req.body.role + " successfully")
    await userss.findByIdAndUpdate( req.query.id,{$set:{"role": req.body.role}})
    res.redirect('/admin/alluser')
  })

  router.post('/removeorder', async(req,res)=>{
    console.log('romove: ' + req.query.ids);
    console.log('romove2: ' + req.query.idss);
    var removepros = req.query.ids
    await userss.findOneAndUpdate({username: req.query.ids}, 
      {$pull: {invoice: req.query.idss}}, 
       )
    await invoice.findByIdAndRemove(req.query.idss)
    req.flash('success',"remove order by username " + removepros + " success")
    res.redirect('/admin/dashboard')
  }) 

  router.post('/removestore', async(req,res)=>{
    console.log('romove: ' + req.query.idpro);
    console.log('romove namepro: ' + req.query.namepro);
    var removepro = req.query.namepro
    re = await Product.findByIdAndRemove(req.query.idpro)
    req.flash('success', 'remove product name ' + removepro + ' finish.');
    res.redirect('/admin/seller')
  })

  router.post('/updateproduct', async(req,res)=>{
    await Product.update({name: editpro},{$set:{"name": req.body.name,"price": req.body.price,"category": req.body.category,"detail": req.body.detail,"quantity": req.body.quantity,"sweettaste": req.body.sweettaste,"aciditytaste": req.body.aciditytaste,"bodytaste": req.body.bodytaste,"finishtaste": req.body.finishtaste,"brand": req.body.brand,"aging": req.body.aging,"alcohol": req.body.alcohol}})
    req.flash('success',"Your product has been changed successfully")
    updatepro = ''
    res.redirect('/admin/seller') 
  })
  
  router.post('/updateimgproduct', async(req,res)=>{
    console.log('update img')
    const updateproduct = new Product({})
    if(req.body.img != ""){
      saveImage(updateproduct, req.body.img);
      await Product.update({name: editpro},{$set:{"img":updateproduct.img,"imgType":updateproduct.imgType}})
    }
    req.flash('success',"Your Img product has been changed successfully")
    res.redirect('/admin/editproduct') 
  })

  router.post('/removeuser', async(req,res)=>{
    console.log(req.query.ids)
    console.log('remove')
    re = await userss.findByIdAndRemove(req.query.ids)
    req.flash('success',"user id " +  req.query.name + " has been delete successfully")
    res.redirect('/admin/alluser') 
  })


  router.get('/logout2', async (req,res) =>{
    console.log('logout')
    req.flash('error', 'Logged you out successfully');
    req.logout();
    allproduct = false
    name = ''
    amountcart = 0
    res.redirect('/')
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