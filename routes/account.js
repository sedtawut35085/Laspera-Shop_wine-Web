var   express = require('express'),
      router = express.Router(),
      userss = require('../models/user'),
      invoice = require("../models/invoice"),
      creditcards = require('../models/creditcard'),
      productcart = require("../models/productcart"),
      Product = require('../models/product');

let alert = require('alert'); 
let amountcart = 0
let name ;

const imageMimeTypes = ["image/jpeg", "image/png", "images/gif"];

 router.get('/', async (req,res,next) => {
    console.log(' +  ' +  res.locals.currentUser)
    if(res.locals.currentUser == null){
      console.log('no user')
      try{
          name = res.locals.currentUser.username
      }catch{
          console.log('error')
      }
      res.redirect('/account/login')
    }else{    
        res.redirect('/account/accountinfo')
    }
});

router.get('/login', async (req,res,next) => {
  try{
    name = res.locals.currentUser.username
    amountcart = await productcart.countDocuments({username: res.locals.currentUser.username});
  }catch{
    console.log('error')
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

 router.get('/accountinfo', async (req,res) => {
    amountcart = await productcart.countDocuments({username: res.locals.currentUser.username});
    console.log('go account info')
    const infouser = await userss.find({username: res.locals.currentUser.username})
    res.render('accountinfo.ejs',{
        name:  res.locals.currentUser.username,
        amountcart: amountcart,
        infouser,
      })
  });

 router.get('/email',async (req,res) =>{
    const infouser  = await userss.find({username:res.locals.currentUser.username})
    res.render('accountemail.ejs',
    {
      name:  res.locals.currentUser.username,
      amountcart: amountcart,
      infouser
  } 
    )
  })

  router.get('/address', async (req,res)=>{
    const infouser  = await userss.find({username:res.locals.currentUser.username})
    res.render('address.ejs',{
      name:  res.locals.currentUser.username,
      amountcart: amountcart,
      infouser
    })
  })

  router.get('/historybuyer', async (req,res)=>{
    const order  = await invoice.find({username:res.locals.currentUser.username});
    const infouser  = await userss.find({username:res.locals.currentUser.username})
    res.render('historybuyer.ejs',{
      order,
      infouser,
      name:  res.locals.currentUser.username,
      amountcart: amountcart,
    })
  })

  router.get('/creditcard', async (req,res,next) => {
    var infocreditcard = await userss.findById(res.locals.currentUser._id).populate('creditcard').exec()
    console.log(infocreditcard)
    console.log(infocreditcard.creditcard[0]._id)
    try{
        res.render("creditcard.ejs", {
          name: res.locals.currentUser.username,
          amountcart: amountcart,
          infocreditcard,
        });
      }catch (err){
        console.log("err: "+ err); 
      }
  });

  router.get('/order' , async function(req,res){
    const infouser = await userss.find({username: res.locals.currentUser.username})
    const order = await invoice.find();
    res.render('order.ejs',{
      order,
      name:  res.locals.currentUser.username,
      amountcart: amountcart,
      infouser
    })
  })
  
  router.get('/seller', async (req,res,next) => {
    try{
      const infouser = await userss.find({username: res.locals.currentUser.username})
        const product  = await Product.find();
        console.log('Product : '+ product)
        res.render("seller.ejs", {
          product,
          name: res.locals.currentUser.username,
          amountcart: amountcart,
          infouser
        });
      }catch (err){
        console.log("err: "+ err); 
      }
  });

  router.get('/sellproduct', async (req,res,next) => {
    try{
      const infouser = await userss.find({username: res.locals.currentUser.username})
        const product  = await Product.find();
        console.log('Product : '+ product)
        res.render("sellproduct.ejs", {
          product,
          name: res.locals.currentUser.username,
          amountcart: amountcart,
          infouser
        });
      }catch (err){
        console.log("err: "+ err); 
      }
  });

  router.post('/addaddress',async(req,res)=>{
    console.log('add address')
    let O  = await userss.update({username: res.locals.currentUser.username},{$set:{ "address":req.body.address, "phone":req.body.phone}})
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
      alert("This product already have in store. !!!")
      res.redirect('/account/seller');
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
      saveImage(product, img);
      try{
         const newProduct = await product.save();
         console.log(newProduct);  
         alert("Product name " + req.body.name + " has been packed in store.")
         res.redirect('/account/seller');
      }catch (err){
         console.log(err);    
    }
    }
  });

  router.post('/updateemail', async(req,res)=>{
    console.log('updateemail')
    let O  = await userss.update({username: res.locals.currentUser.username},{$set:{"email":req.body.email}})
    alert("Update Done.")
    res.redirect('/account/email')
  })

  router.post('/updateprofile', async(req,res)=>{
    console.log('updateprofile')
    const updateuser = new userss({})
    if(req.body.img != ""){
      saveImage(updateuser, req.body.img);
      let e = await userss.update({username: res.locals.currentUser.username},{$set:{"img":updateuser.img,"imgType":updateuser.imgType}})
    }
    alert("Update Done.")
    res.redirect('/account')
  })

  router.post('/updateproduct', async(req,res)=>{
    const updatepro1 = await Product.update({name: updatepro},{$set:{"name": req.body.name,"price": req.body.price,"category": req.body.category,"detail": req.body.detail,"quantity": req.body.quantity,"sweettaste": req.body.sweettaste,"aciditytaste": req.body.aciditytaste,"bodytaste": req.body.bodytaste,"finishtaste": req.body.finishtaste,"brand": req.body.brand,"aging": req.body.aging,"alcohol": req.body.alcohol}})
    updatepro = ''
    res.redirect('/account/seller') 
  })

  router.post('/editproduct', async(req,res)=>{
    const infouser = await userss.find({username: res.locals.currentUser.username})
    var editpro = req.query.ids
    const editpros = await Product.find({name : editpro })
    console.log(editpros)
    updatepro = editpros[0].name
    res.render('editproduct.ejs',{
      editpros,
      name: res.locals.currentUser.username,
      amountcart: amountcart,
      infouser
    })
  })

  router.post('/addcard',async (req,res)=>{
    
    let creditinfo  = await creditcards.findByIdAndUpdate(req.query.id,{$set:{"NameCard":req.body.cardname,"NumberCard":req.body.cardnumber,"ValidDate":req.body.cardvalid,"CVV":req.body.cvv}})
    res.redirect('/account/creditcard')
  })

  router.post('/removeorder', async(req,res)=>{
    console.log('romove: ' + req.query.ids);
    var removepros = req.query.ids
    let wait3 = await invoice.findByIdAndRemove(removepros)
    alert("remove order id " + removepros + " finish.")
    res.redirect('/account/order')
  }) 

  router.post('/removestore', async(req,res)=>{
    console.log('romove: ' + req.query.ids);
    var removepro = req.query.ids
    re = await Product.remove({name : removepro })
    alert("remove product name " + removepro + " finish.")
    res.redirect('/account/seller')
  })

  router.post('/deleteaccount', async (req,res) =>{
    console.log('Delete')
    console.log(req.query.id)
    const infodelete = await userss.findById(req.query.id)
    console.log(infodelete)
    console.log(infodelete.creditcard[0]._id)
    let wait = await userss.findByIdAndRemove(req.query.id)
    let wait1 = await creditcards.findByIdAndRemove(infodelete.creditcard[0]._id)
    let wait2 = await productcart.remove({username: res.locals.currentUser.username})
    alert('account name ' + res.locals.currentUser.username + ' is remove')
    req.logout();
    amountcart = 0
    name = ''
    res.redirect('/account/login')
  });

  router.get('/logout', async (req,res) =>{
    console.log('logout')
    alert('log out.')
    req.logout();
    allproduct = false
    name = ''
    amountcart = 0
    res.redirect('/account/login')
  });

  function saveImage(product, imgEncoded) {
    // CHECKING FOR IMAGE IS ALREADY ENCODED OR NOT
    if (imgEncoded == null) return;
  
    // ENCODING IMAGE BY JSON PARSE
    // The JSON.parse() method parses a JSON string, constructing the JavaScript value or object described by the string
    const img = JSON.parse(imgEncoded);
    console.log( "JSON parse: "+ img);
    
    // CHECKING FOR JSON ENCODED IMAGE NOT NULL 
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types
    // AND HAVE VALID IMAGE TYPES WITH IMAGE MIME TYPES
    if (img != null && imageMimeTypes.includes(img.type)) {
  
      // https://nodejs.org/api/buffer.html
      // The Buffer class in Node.js is designed to handle raw binary data. 
      // SETTING IMAGE AS BINARY DATA
      product.img = new Buffer.from(img.data, "base64");
      product.imgType = img.type;
    }
  }

  module.exports = router;