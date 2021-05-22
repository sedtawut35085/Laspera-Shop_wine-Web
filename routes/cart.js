var express = require('express'),
    router = express.Router(),
    userss = require('../models/user'),
    invoice = require("../models/invoice"),
    creditcards = require('../models/creditcard'),
    productcart = require("../models/productcart"),
    Product = require('../models/product');
    middleware = require('../middleware');
  
let alert = require('alert'); 
let amountcart = 0;
let subtotal = 0 
let total = 0
let tax = 0
let sum;
const imageMimeTypes = ["image/jpeg", "image/png", "images/gif"];

router.post('/updatecarts', async(req,res)=>{
    console.log('updatecarts')
    let checkproduct = await Product.find({name: req.query.idss})
    if(req.body.quantity <= 0){
      req.body.quantity = 1;
    }
    if(req.body.quantity <= checkproduct[0].quantity){
      let updatepro  = await productcart.update({productname: req.query.idss , username: res.locals.currentUser.username},{$set:{"productquantity":req.body.quantity}})
    }else{
      alert('The inventory is not enough for your product requirements.')
    }
    res.redirect('/cart/totalproduct')
})

router.post('/removecart', async(req,res)=>{
    console.log('romove: ' + req.query.ids);
    var removepro = req.query.ids
    re = await productcart.remove({username: res.locals.currentUser.username,productname: removepro})
    amountcart = await productcart.countDocuments({username: res.locals.currentUser.username}); 
    res.redirect('/cart/totalproduct') 
})

router.get('/checkout', async function(req,res){
    total =0 
    tax =0
    subtotal = 0
    const infouser = await userss.findById(res.locals.currentUser._id).populate('creditcard').exec()
    const infocart = await productcart.find({username: res.locals.currentUser.username})
      try{
        for(i=0;;i++){
          try{   
            subtotal = Number(subtotal) + Number((infocart[i].productprice)*infocart[i].productquantity);     
          }catch{
            console.log('error')
            console.log('subtotal : ' + subtotal) 
            break 
          }
        } 
      }catch{
        console.log('subtotal : ' + subtotal)  
      }
      subtotal = subtotal.toFixed(2)
      if(subtotal<=100){
        tax = 10 
        total = (Number(subtotal) + Number(tax))
    
      }else{
        tax = 0;
        total = subtotal
      }
      total = Number(total).toFixed(2)
      res.render('checkout.ejs',{
        tax,
        total,
        subtotal,
        infouser,
        infocart,
        name: res.locals.currentUser.username,
        amountcart: amountcart
      })
})
  
router.post('/buy',async function(req,res){
    let m
    const check2  = await invoice.find();
    let n = await invoice.countDocuments();    
    console.log('n : ' + n)  
    if(n==0){
      m=0
    }else{
      m = check2[n-1].invoiceid         
      m = m+1
    }
    await userss.update({username: res.locals.currentUser.username},{$set:{"address": req.body.address,"phone": req.body.phone}});
    await creditcards.findByIdAndUpdate(req.query.id,{$set:{"NameCard":req.body.cardname,"NumberCard":req.body.cardnumber,"ValidDate":req.body.cardvalid,"CVV":req.body.cvv}})
    const purchase  = await productcart.find({username: res.locals.currentUser.username});
    const infouser = await userss.findById(res.locals.currentUser._id)
    try{
      for(i=0;;i++){
        try{   
          const product  = await Product.find({name : purchase[i].productname});
          sum = product[0].quantity - purchase[i].productquantity
          console.log('sum ' + sum)
          await Product.update({name: purchase[i].productname},{$set:{"quantity": sum}});
          let datetime = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Bangkok'
          });
          const invoiceinfo = new invoice({invoiceid: m,username: res.locals.currentUser.username,useraddress: infouser.address,userphone: infouser.phone,productname: purchase[i].productname,productprice: purchase[i].productprice,productquantity: purchase[i].productquantity,productcategory: purchase[i].productcategory,date: datetime,productimg: purchase[i].productimg,productimgType: purchase[i].productimgType,sumofproduct: purchase[i].productquantity*purchase[i].productprice})
          invoiceinfo.save();
          infouser.invoice.push(invoiceinfo._id)
          await infouser.save()
          console.log('save')
        }catch(err){
          console.log(err)
          break
        }
      } 
    }catch{
      console.log('error')  
    }
    const updateinfouser = await userss.find({username: res.locals.currentUser.username})
    let date2 = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Bangkok'
    });
    await productcart.remove({username: res.locals.currentUser.username})
    await userss.findOneAndUpdate({username: res.locals.currentUser.username}, 
      {"$set": { "cart": []}}, 
       )
    alert('Thank for your purchase')
    res.render('purchase.ejs',{
          invoiceid: m,
          subtotal: subtotal,
          total: total,
          tax: tax,
          purchase: purchase,
          adduser: updateinfouser[0].address,
          phoneuser: updateinfouser[0].phone,
          date: date2,
          name: res.locals.currentUser.username.toUpperCase(),
          amountcart: amountcart,
    })
})
  
router.post('/firstaddadress',async(req,res)=>{
    console.log('add address')
    await userss.update({username: res.locals.currentUser.username},{$set:{ "address":req.body.address, "phone":req.body.phone}})
    res.redirect('/cart/checkout')
})

router.get('/totalproducts', async(req,res)=>{
  req.session.fromUrl = '/cart/totalproduct'
  res.redirect('/cart/totalproduct')
})
  
router.get('/totalproduct', middleware.isLoggedIn, async(req,res) => {
  try{
    name = res.locals.currentUser.username
    infouser = await userss.findById(res.locals.currentUser._id)
    amountcart = await productcart.countDocuments({username: res.locals.currentUser.username});
  }catch{
    console.log('err')
  }
  allproduct = false
  total =0 
  tax =0
  subtotal = 0
  console.log("totalproduct")
  const cartproduct  = await productcart.find({username: res.locals.currentUser.username});
  const info = await userss.find({username: res.locals.currentUser.username})
  const creditcard = await creditcards.find({Username: res.locals.currentUser.username})
  try{
      for(i=0;;i++){
        try{   
          subtotal = Number(subtotal) + Number((cartproduct[i].productprice)*cartproduct[i].productquantity);     
        }catch{
          console.log('error')
          console.log('subtotal : ' + subtotal) 
          break 
        }
      } 
    }catch{
      console.log('subtotal : ' + subtotal)  
    }
    subtotal = subtotal.toFixed(2)
    if(subtotal<=100){
      tax = 10 
      total = (Number(subtotal) + Number(tax))
  
    }else{
      tax = 0;
      total = subtotal
    }
    total = Number(total).toFixed(2)
    res.render('totalproduct.ejs',{
      infouser,
        tax,
        subtotal,
        total,
        cartproduct,
        name: res.locals.currentUser.username,
        amountcart: amountcart, 
        info,
        creditcard  
  })
});
  
module.exports = router;