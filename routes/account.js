var   express = require('express'),
      router = express.Router(),
      userss = require('../models/user'),
      invoice = require("../models/invoice"),
      creditcards = require('../models/creditcard'),
      productcart = require("../models/productcart"),
      Product = require('../models/product'),
      middleware = require('../middleware');

let alert = require('alert'); 
let amountcart = 0
let msg ;
var editpro;
let editpros;

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
      res.redirect('/login')
    }else{    
        res.redirect('/account/accountinfo')
    }
});

 router.get('/accountinfo', async (req,res) => {
    
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
    let checkorder = 0
    const order  = await invoice.find({username:res.locals.currentUser.username});
    const infouser  = await userss.find({username:res.locals.currentUser.username})
    try{
      checkorder = order[0].invoiceid
    }catch{
      
    }
    res.render('historybuyer.ejs',{
      order,
      infouser,
      name:  res.locals.currentUser.username,
      amountcart: amountcart,
      checkorder
    })
  })

  router.get('/creditcard', async (req,res,next) => {
    var infocreditcard = await userss.findById(res.locals.currentUser._id).populate('creditcard').exec()
    const infouser  = await userss.find({username:res.locals.currentUser.username})
    console.log(infocreditcard)
    console.log(infocreditcard.creditcard[0]._id)
    try{
        res.render("creditcard.ejs", {
          name: res.locals.currentUser.username,
          amountcart: amountcart,
          infocreditcard,
          infouser
        });
      }catch (err){
        console.log("err: "+ err); 
      }
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
    res.render('dashboard.ejs',{
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
    const infouser = await userss.find({username: res.locals.currentUser.username})
    res.render("sellproduct.ejs", {
      name: res.locals.currentUser.username,
      amountcart: amountcart,
      infouser
    });
  });

  router.post('/addaddress', async(req,res)=>{
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
      try{
        console.log('req.body.img: ' + req.body.img)
        console.log('req.body.name: ' + req.body.name)
        saveImage(product, req.body.img);
        console.log('succes save image')
         const newProduct = await product.save();
         console.log(newProduct);  
         alert("Product name " + req.body.name + " has been packed in store.")
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
    alert("Update Done.")
    res.redirect('/account/email')
  })

  router.post('/updateprofile', async(req,res)=>{
    console.log('updateprofile')
    alert("Update Done.")
    res.redirect('/account')
  })

  router.post('/updateimgprofile', async(req,res)=>{
    req.flash('success','Update Img Profile Done!!')
    req.flash('error','Update Img Profile Done!!')
    msg = req.flash('success')
    console.log('msg : '+ msg )
    console.log('updateimgprofile')
    const updateuser = new userss({})
    console.log('req.body.img: ' + req.body.img)
    saveImage(updateuser, req.body.img);
    await userss.update({username: res.locals.currentUser.username},{$set:{"img":updateuser.img,"imgType":updateuser.imgType}})
    alert("Change image profile success.")
   
    res.redirect('/account')
  })

  router.get('/editproduct', async(req,res)=>{
    infouser = await userss.find({username: res.locals.currentUser.username})
    editpros = await Product.find({name : editpro })
    res.render('editproduct.ejs',{
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
    alert('Update Done')
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
    alert('Update Img Done')
    res.redirect('/account/editproduct') 
  })

  router.post('/addcard',async (req,res)=>{ 
    await creditcards.findByIdAndUpdate(req.query.id,{$set:{"NameCard":req.body.cardname,"NumberCard":req.body.cardnumber,"ValidDate":req.body.cardvalid,"CVV":req.body.cvv}})
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
    alert("remove order id " + removepros + " finish.")
    res.redirect('/account/dashboard')
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
    await userss.findByIdAndRemove(req.query.id)
    await creditcards.findByIdAndRemove(infodelete.creditcard[0]._id)
    await productcart.remove({username: res.locals.currentUser.username})
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
    res.redirect('/login')
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