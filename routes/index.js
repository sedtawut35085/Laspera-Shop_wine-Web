var express = require('express'),
    router = express.Router({mergeParams: true}),
    userss = require('../models/user'),
    creditcards = require('../models/creditcard'),
    productcart = require("../models/productcart"),
    Product = require('../models/product'),
    comment = require("../models/comments"),
    passport = require("passport");

let alert = require('alert'); 
let commentid;
let checkpro;
let nowproduct;
let amountcart = 0;
let allproduct = false
let countallwine = 0;
let countredwine = 0;
let countwhitewine = 0;
let countrosewine = 0;
let countsparklingwine = 0;
let countdessertwine = 0;
let totalproduct = false
let name;
let comeagain = false
let nowproduct2 = false
let checkcategory = 'Wine';
let page = 1;
let con = '';
let productsearch;
let sortname = 'Sort by';
let advance;

const imageMimeTypes = ["image/jpeg", "image/png", "images/gif"];

router.get('/',  async(req,res) => {

  allproduct = false
    var datetime = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Bangkok'
    });
    console.log(datetime);
    if(res.locals.currentUser == null){
      amountcart = 0
      name= ''
    }else{
      name = res.locals.currentUser.username
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
        amountcart: amountcart,
        countallwine: countallwine,
        countredwine: countredwine,
        countwhitewine: countwhitewine,
        countrosewine: countrosewine,
        countdessertwine: countdessertwine,
        countsparklingwine: countsparklingwine
      })
});

router.get('/productsearch',async (req,res,next) =>{
  const product  = await Product.find({name: productsearch});
  const commentinfo = await comment.find({productname: productsearch})
  console.log(product)
  try{
    if(product[0].name != null){
      const relateproduct  = await Product.find({ category:product[0].category, name: { $ne: product[0].name} });
      res.render('eachproduct.ejs',{
        relateproduct ,
        product,
        name: name,
        amountcart: amountcart,
        commentinfo
      })      
    }
}catch{
    console.log('error')
    res.render('errorproduct.ejs',{
      name: name,
      amountcart: amountcart,
      error: productsearch,
      amountcart: amountcart,
      commentinfo
    })
}
})

router.post('/search', async(req, res, next)=>{
  console.log('search')
  console.log(req.body.productsearch)
  productsearch = req.body.productsearch;
  res.redirect('/productsearch')
})

router.get('/redproduct' , async(req,res)=>{  
  allproduct = false
  page = 1;
  const redproduct  = await Product.find({category: 'Red Wine'})
  product = redproduct
  checkcategory = 'Red Wine'
  con = 'Sort by'
  res.render("allproduct.ejs", {
    product,
    name: name,
    amountcart: amountcart,
    sortname: con,
    page : page
  }); 
})

router.get('/whiteproduct' , async(req,res)=>{  
  allproduct = false
  page = 1;
  const whiteproduct  = await Product.find({category: 'White Wine'})
  product = whiteproduct
  checkcategory = 'White Wine'
  con = 'Sort by'
  res.render("allproduct.ejs", {
    product,
    name: name,
    amountcart: amountcart,
    sortname: con,
    page : page
  }); 
})

router.get('/dessertproduct' , async(req,res)=>{  
  allproduct = false
  page = 1;
  const dessertproduct  = await Product.find({category: 'Dessert Wine'})
  product = dessertproduct
  checkcategory = 'Dessert Wine'
  con = 'Sort by'
  res.render("allproduct.ejs", {
    product,
    name: name,
    amountcart: amountcart,
    sortname: con,
    page : page
  }); 
})

router.get('/roseproduct' , async(req,res)=>{  
  allproduct = false
  page = 1;
  const roseproduct  = await Product.find({category: 'Rose Wine'})
  product = roseproduct
  checkcategory = 'Rose Wine'
  con = 'Sort by'
  res.render("allproduct.ejs", {
    product,
    name: name,
    amountcart: amountcart,
    sortname: con,
    page : page
  }); 
})

router.get('/sparklingproduct' , async(req,res)=>{  
  allproduct = false
  page = 1;
  const sparklingproduct  = await Product.find({category: 'Sparkling Wine'})
  product = sparklingproduct
  checkcategory = 'Rose Wine'
  con = 'Sort by'
  res.render("allproduct.ejs", {
    product,
    name: name,
    amountcart: amountcart,
    sortname: con,
    page : page
  }); 
})

router.get('/allproducts' , async(req,res)=>{  
  allproduct = false
  page = 1;
  if(res.locals.currentUser == null){
    name= ''
  }else{
    name = res.locals.currentUser.username
  }
  const product  = await Product.find()
  checkcategory = 'Wine'
  con = 'Sort by'
  res.render("allproduct.ejs", {
    product,
    name: name,
    amountcart: amountcart,
    sortname: con,
    page : page
  }); 
})

router.get('/backpage', async(req,res)=>{
  page = page - 1
  res.redirect('/allproduct')
})


router.get('/nextpage', async(req,res)=>{
  page = page + 1
  res.redirect('/allproduct')
})

router.get('/page1', async(req,res)=>{
  page = 1
  res.redirect('/allproduct')
})

router.get('/page2', async(req,res)=>{
  page = 2
  res.redirect('/allproduct')
})

router.get('/page3', async(req,res)=>{
  page = 3
  res.redirect('/allproduct')
})

router.get('/allproduct', async (req,res) => {
  
  allproduct = false
  if(res.locals.currentUser == null){
    name= ''
  }else{
    name = res.locals.currentUser.username
  }
  amountcart = await productcart.countDocuments({username: name});
  if(con == 'A-Z'){
    console.log('Find A-Z')
    try{
      const product  = await Product.find({category: {'$regex' : checkcategory, '$options' : 'i'}}).sort({"name":1});
      // console.log('AllProduct : '+ product)
      sortname = 'Sort by A-Z'
      res.render("allproduct.ejs", {
        product,
        name: name,
        amountcart: amountcart,
        sortname: sortname,
        page : page  
      });
    }catch (err){
      console.log("err: "+ err); 
    }
  }else if(con =='highprice'){
    console.log('find highprice')
    try{
      const product  = await Product.find({category: {'$regex' : checkcategory, '$options' : 'i'}}).sort({"price":-1});
      // console.log('AllProduct : '+ product)
      sortname = 'Sort by highest price'
      res.render("allproduct.ejs", {
        product,
        name: name,
        amountcart: amountcart,
        sortname: sortname,
        page : page
      });
    }catch (err){
      console.log("err: "+ err); 
    }
  }else if(con == 'lowprice'){
    console.log('find lowprice');
    try{
      const product  = await Product.find({category: {'$regex' : checkcategory, '$options' : 'i'}}).sort({"price":1});
      // console.log('AllProduct : '+ product)
      sortname = 'Sort by lowest price'
      res.render("allproduct.ejs", {
        product,
        name: name,
        amountcart: amountcart,
        sortname: sortname,
        page : page
      });
    }catch (err){
      console.log("err: "+ err); 
    }
  }else if(con == 'newproduct'){
    console.log('Find newproduct')
    try{
      const product  = await Product.find({category: {'$regex' : checkcategory, '$options' : 'i'}}).sort({_id:-1});
      // console.log('AllProduct : '+ product)
      sortname = 'Sort by New product'
      res.render("allproduct.ejs", {
        product,
        name: name,
        amountcart: amountcart,
        sortname: sortname,
        page : page
      });
    }catch (err){
      console.log("err: "+ err); 
    }    
  }else{    
    console.log('Find normal')
    sortname = 'Sort by'
    try{
      if(advance.brand != null && advance.price1 == '' && advance.price2 == '' && advance.category == null && advance.bodytaste == '-' && advance.aciditytaste == '-' && advance.sweettaste == '-' && advance.finishtaste == '-'  && advance.alcohol1 == '' &&  advance.alcohol2 == ''){
        console.log('brand')
        product  = await Product.find({brand: advance.brand}).sort({brand: 1});
      }
      else if(advance.brand == null && advance.price1 != '' && advance.price2 != '' && advance.category == null && advance.bodytaste == '-' && advance.aciditytaste == '-' && advance.sweettaste == '-' && advance.finishtaste == '-'  && advance.alcohol1 == '' &&  advance.alcohol2 == ''){
        console.log('price')
        product  = await Product.find({price: {$gte: advance.price1, $lte: advance.price2}}).sort({price: 1});
      }
      else if(advance.brand == null && advance.price1 == '' && advance.price2 == '' && advance.category != null && advance.bodytaste == '-' && advance.aciditytaste == '-' && advance.sweettaste == '-' && advance.finishtaste == '-'  && advance.alcohol1 == '' &&  advance.alcohol2 == ''){
        console.log('category')
        product  = await Product.find({category: advance.category}).sort({category: 1});
      }
      else if(advance.brand == null && advance.price1 == '' && advance.price2 == '' && advance.category == null && advance.bodytaste == '-' && advance.aciditytaste == '-' && advance.sweettaste == '-' && advance.finishtaste == '-'  && advance.alcohol1 != '' &&  advance.alcohol2 != ''){
        console.log('alcohol')
        product  = await Product.find({alcohol: {$gte: advance.alcohol1, $lte: advance.alcohol2}}).sort({price: 1});
      }
      else if(advance.brand == null && advance.price1 == '' && advance.price2 == '' && advance.category == null && advance.bodytaste != '-' && advance.aciditytaste == '-' && advance.sweettaste == '-' && advance.finishtaste == '-'  && advance.alcohol1 == '' &&  advance.alcohol2 == ''){
        console.log('bodytaste')
        product  = await Product.find({bodytaste: advance.bodytaste}).sort({bodytaste: 1});
      }
      else if(advance.brand == null && advance.price1 == '' && advance.price2 == '' && advance.category == null && advance.bodytaste == '-' && advance.aciditytaste != '-' && advance.sweettaste == '-' && advance.finishtaste == '-'  && advance.alcohol1 == '' &&  advance.alcohol2 == ''){
        console.log('aciditytaste')
        product  = await Product.find({aciditytaste: advance.aciditytaste}).sort({aciditytaste: 1});
      }
      else if(advance.brand == null && advance.price1 == '' && advance.price2 == '' && advance.category == null && advance.bodytaste == '-' && advance.aciditytaste == '-' && advance.sweettaste != '-' && advance.finishtaste == '-'  && advance.alcohol1 == '' &&  advance.alcohol2 == ''){
        console.log('sweettaste')
        product  = await Product.find({sweettaste: advance.sweettaste}).sort({sweettaste: 1});
      }
      else if(advance.brand == null && advance.price1 == '' && advance.price2 == '' && advance.category == null && advance.bodytaste == '-' && advance.aciditytaste == '-' && advance.sweettaste == '-' && advance.finishtaste != '-'  && advance.alcohol1 == '' &&  advance.alcohol2 == ''){
        console.log('finishtaste')
        product  = await Product.find({finishtaste: advance.finishtaste}).sort({finishtaste: 1});
      }
      else if(advance.brand != null && advance.price1 != '' && advance.price2 != '' && advance.category == null && advance.bodytaste == '-' && advance.aciditytaste == '-' && advance.sweettaste == '-' && advance.finishtaste == '-' && advance.alcohol1 == '' &&  advance.alcohol2 == ''){
        console.log('brand price')
        product  = await Product.find({brand: advance.brand,price: {$gte: advance.price1, $lte: advance.price2}}).sort({price: 1});
      }
      else if(advance.brand != null && advance.price1 == '' && advance.price2 == '' && advance.category != null && advance.bodytaste == '-' && advance.aciditytaste == '-' && advance.sweettaste == '-' && advance.finishtaste == '-' && advance.alcohol1 == '' &&  advance.alcohol2 == ''){
        console.log('brand category')
        product  = await Product.find({brand: advance.brand,category: advance.category}).sort({category: 1});
      }
      else if(advance.brand != null && advance.price1 == '' && advance.price2 == '' && advance.category == null && advance.bodytaste == '-' && advance.aciditytaste == '-' && advance.sweettaste == '-' && advance.finishtaste == '-' && advance.alcohol1 != '' &&  advance.alcohol2 != ''){
        console.log('brand alcohol')
        product  = await Product.find({brand: advance.brand,category: advance.category,alcohol: {$gte: advance.alcohol1, $lte: advance.alcohol2}}).sort({category: 1});
      }
      else if(advance.brand != null && advance.price1 == '' && advance.price2 == '' && advance.category == null && advance.bodytaste != '-' && advance.aciditytaste == '-' && advance.sweettaste == '-' && advance.finishtaste == '-' && advance.alcohol1 == '' &&  advance.alcohol2 == ''){
        console.log('brand bodytaste')
        product  = await Product.find({brand: advance.brand,bodytaste: advance.bodytaste}).sort({category: 1});
      }
      else if(advance.brand != null && advance.price1 != '' && advance.price2 != '' && advance.category != null && advance.bodytaste == '-' && advance.aciditytaste == '-' && advance.sweettaste == '-' && advance.finishtaste == '-'  && advance.alcohol1 == '' &&  advance.alcohol2 == ''){
        console.log('brand price category')
        product  = await Product.find({brand: advance.brand,price: {$gte: advance.price1, $lte: advance.price2}, category: advance.category}).sort({price: 1});
      }
      else if(advance.brand != null && advance.price1 != '' && advance.price2 != '' && advance.category != null && advance.bodytaste != '-' && advance.aciditytaste == '-' && advance.sweettaste == '-' && advance.finishtaste == '-'  && advance.alcohol1 == '' &&  advance.alcohol2 == ''){
        console.log('brand price category bodytaste')
        product  = await Product.find({brand: advance.brand,price: {$gte: advance.price1, $lte: advance.price2}, category: advance.category, bodytaste: advance.bodytaste}).sort({price: 1});
      } 
      else if(advance.brand != null && advance.price1 != '' && advance.price2 != '' && advance.category != '-' && advance.bodytaste == '-' && advance.aciditytaste != '-' && advance.sweettaste == '-' && advance.finishtaste == '-'  && advance.alcohol1 == '' &&  advance.alcohol2 == ''){
        console.log('brand price category aciditytaste')
        product  = await Product.find({brand: advance.brand,price: {$gte: advance.price1, $lte: advance.price2}, category: advance.category, aciditytaste: advance.aciditytaste}).sort({price: 1});
      }  
      else if(advance.brand != null && advance.price1 != '' && advance.price2 != '' && advance.category != null && advance.bodytaste == '-' && advance.aciditytaste == '-' && advance.sweettaste != '-' && advance.finishtaste == '-'  && advance.alcohol1 == '' &&  advance.alcohol2 == ''){
        console.log('brand price category sweettaste')
        product  = await Product.find({brand: advance.brand,price: {$gte: advance.price1, $lte: advance.price2}, category: advance.category, bodytaste: advance.bodytaste, sweettastetaste : advance.sweettastetaste }).sort({price: 1});
      }  
      else if(advance.brand != null && advance.price1 != '' && advance.price2 != '' && advance.category != null && advance.bodytaste == '-' && advance.aciditytaste == '-' && advance.sweettaste == '-' && advance.finishtaste != '-'  && advance.alcohol1 == '' &&  advance.alcohol2 == ''){
        console.log('brand price category finishtaste')
        product  = await Product.find({brand: advance.brand,price: {$gte: advance.price1, $lte: advance.price2}, category: advance.category, bodytaste: advance.bodytaste, finishtaste : advance.finishtaste }).sort({price: 1});
      }  
      else if(advance.brand != null && advance.price1 != '' && advance.price2 != '' && advance.category != null && advance.bodytaste != '-' && advance.aciditytaste != '-' && advance.sweettaste == '-' && advance.finishtaste == '-'  && advance.alcohol1 == '' &&  advance.alcohol2 == ''){
        console.log('brand price category body acidity taste')
        product  = await Product.find({brand: advance.brand,price: {$gte: advance.price1, $lte: advance.price2}, category: advance.category, bodytaste: advance.bodytaste, aciditytaste : advance.aciditytaste}).sort({price: 1});  
      }  
      
      else if(advance.brand != null && advance.price1 != '' && advance.price2 != '' && advance.category != null && advance.bodytaste != '-' && advance.aciditytaste != '-' && advance.sweettaste != '-' && advance.finishtaste == '-'  && advance.alcohol1 == '' &&  advance.alcohol2 == ''){
        console.log('brand price category body acidity sweet taste')
        product  = await Product.find({brand: advance.brand,price: {$gte: advance.price1, $lte: advance.price2}, category: advance.category, bodytaste: advance.bodytaste, aciditytaste : advance.aciditytaste,sweettaste: advance.sweettaste}).sort({price: 1});  
      }  
      else if(advance.brand != null && advance.price1 != '' && advance.price2 != '' && advance.category != null && advance.bodytaste != '-' && advance.aciditytaste != '-' && advance.sweettaste != '-' && advance.finishtaste != '-'  && advance.alcohol1 == '' &&  advance.alcohol2 == ''){
        console.log('brand price category body acidity sweet finish taste')
        product  = await Product.find({brand: advance.brand,price: {$gte: advance.price1, $lte: advance.price2}, category: advance.category, bodytaste: advance.bodytaste, aciditytaste : advance.aciditytaste, finishtaste:advance.finishtaste}).sort({price: 1});
      }  
      else if(advance.brand != null && advance.price1 != '' && advance.price2 != '' && advance.category != null && advance.bodytaste != '-' && advance.aciditytaste != '-' && advance.sweettaste != '-' && advance.finishtaste != '-'  && advance.alcohol1 == '' &&  advance.alcohol2 == ''){
        console.log('brand price category aciditytaste')
        product  = await Product.find({brand: advance.brand,price: {$gte: advance.price1, $lte: advance.price2}, category: advance.category, bodytaste: advance.bodytaste, aciditytaste : advance.aciditytaste, finishtaste:advance.finishtaste}).sort({price: 1});
      }  
      else if(advance.brand != null && advance.price1 != '' && advance.price2 != '' && advance.category != null && advance.bodytaste != '-' && advance.aciditytaste == '-' && advance.sweettaste == '-' && advance.finishtaste == '-'  && advance.alcohol1 != '' &&  advance.alcohol2 != ''){
        if(advance.bodytaste){

        }

      }
      else if(advance.price1 != '' && advance.price2 != ''){
        console.log('price')
        product  = await Product.find({price: {$gte: advance.price1, $lte: advance.price2}}).sort({price:1});
        sortname = 'Sort by'
      }else if(advance.category != null){
        console.log('category')
        product  = await Product.find({category: advance.category}).sort({category: 1});
        sortname = 'Sort by'

      }else if(advance.taste != null){
        console.log('taste')
        if(advance.taste.includes('bodytaste') && advance.taste.includes('aciditytaste') && advance.taste.includes('sweettaste') && advance.taste.includes('finishtaste')){
           product  = await Product.find({bodytaste: {$gte: 4, $lte: 5},aciditytaste: {$gte: 4, $lte: 5},sweettaste: {$gte: 4, $lte: 5},finishtaste: {$gte: 4, $lte: 5}}).sort({sweettaste: -1});
        }
        else if(advance.taste.includes('bodytaste') && advance.taste.includes('aciditytaste') && advance.taste.includes('sweettaste')){
          product  = await Product.find({bodytaste: {$gte: 4, $lte: 5},aciditytaste: {$gte: 4, $lte: 5},sweettaste: {$gte: 4, $lte: 5}}).sort({sweettaste: -1});
        }else if(advance.taste.includes('bodytaste') && advance.taste.includes('aciditytaste') && advance.taste.includes('finishtaste')){
          product  = await Product.find({bodytaste: {$gte: 4, $lte: 5},aciditytaste: {$gte: 4, $lte: 5},finishtaste: {$gte: 4, $lte: 5}}).sort({aciditytaste: -1});
        }else if(advance.taste.includes('bodytaste') && advance.taste.includes('sweettaste') && advance.taste.includes('sweettaste')){
          product  = await Product.find({bodytaste: {$gte: 4, $lte: 5},sweettaste: {$gte: 4, $lte: 5},finishtaste: {$gte: 4, $lte: 5}}).sort({sweettaste: -1});
        }else if(advance.taste.includes('aciditytaste') && advance.taste.includes('sweettaste') && advance.taste.includes('finishtaste')){
          product  = await Product.find({aciditytaste: {$gte: 4, $lte: 5},sweettaste: {$gte: 4, $lte: 5},finishtaste: {$gte: 4, $lte: 5}}).sort({sweettaste: -1});
        }
        else if(advance.taste.includes('bodytaste') && advance.taste.includes('aciditytaste')){
          product  = await Product.find({bodytaste: {$gte: 4, $lte: 5},aciditytaste: {$gte: 4, $lte: 5}}).sort({bodytaste: -1});
        }else if(advance.taste.includes('bodytaste') && advance.taste.includes('sweettaste')){
          product  = await Product.find({bodytaste: {$gte: 4, $lte: 5},sweettaste: {$gte: 4, $lte: 5}}).sort({sweettaste: -1});
        }else if(advance.taste.includes('bodytaste') && advance.taste.includes('finishtaste')){
          product  = await Product.find({bodytaste: {$gte: 4, $lte: 5},finishtaste: {$gte: 4, $lte: 5}}).sort({bodytaste: -1});
        }else if(advance.taste.includes('aciditytaste') && advance.taste.includes('sweettaste')){
          product  = await Product.find({sweettaste: {$gte: 4, $lte: 5},sweettaste: {$gte: 4, $lte: 5}}).sort({sweettaste: -1});
        }else if(advance.taste.includes('aciditytaste') && advance.taste.includes('finishtaste')){
          product  = await Product.find({sweettaste: {$gte: 4, $lte: 5},finishtaste: {$gte: 4, $lte: 5}}).sort({sweettaste: -1});
        }else if(advance.taste.includes('sweettaste') && advance.taste.includes('finishtaste')){
          product  = await Product.find({sweettaste: {$gte: 4, $lte: 5},finishtaste: {$gte: 4, $lte: 5}}).sort({sweettaste: -1});
        }
        else if(advance.taste.includes('bodytaste')){
          product  = await Product.find({bodytaste: {$gte: 4, $lte: 5}}).sort({bodytaste: -1});
        }else if(advance.taste.includes('aciditytaste')){
          product  = await Product.find({aciditytaste: {$gte: 4, $lte: 5}}).sort({aciditytaste: -1});
        }else if(advance.taste.includes('sweettaste')){
          product  = await Product.find({sweettaste: {$gte: 4, $lte: 5}}).sort({sweettaste: -1});
        }else if(advance.taste.includes('finishtaste')){
          product  = await Product.find({finishtaste: {$gte: 4, $lte: 5}}).sort({finishtaste: -1});
        }
        sortname = 'Sort by'
      }else{
         product  = await Product.find({category: {'$regex' : checkcategory, '$options' : 'i'}});

      }
      res.render("allproduct.ejs", {
        product,
        name: name,
        amountcart: amountcart,
        sortname: sortname,
        page : page
      });
    }catch (err){
      console.log("err: "+ err); 
      product  = await Product.find({category: {'$regex' : checkcategory, '$options' : 'i'}});
      res.render("allproduct.ejs", {
        product,
        name: name,
        amountcart: amountcart,
        sortname: sortname,
        page : page
      });
      
    }

  }
    
});

router.post('/advance', async(req,res)=>{
  page =1
  advance = req.body
  console.log(advance)
  console.log(advance)
  res.redirect('allproduct')
})

router.post('/sort', async (req,res)=>{
  console.log('sort: ' + req.body.example);
  con = req.body.example;
  res.redirect('/allproduct')
});

router.post('/addcomment', async(req,res)=>{
  console.log('addcomment')
  console.log('id : ' + req.query.id)
  if(res.locals.currentUser == null){
    comeagain = true
    allproduct = true
    res.redirect('/account/login')
  }else{
    console.log('idcomment : ' + commentid)
    console.log(req.body.comment)
    const comment12 = await Product.findById(req.query.id)
    console.log(comment12)
    var datetime = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Bangkok'
    });
    const infocomment = new comment({text : req.body.comment,date : datetime})
    infocomment.author.id = req.user._id
    infocomment.author.username = req.user.username;
    infocomment.save()
    comment12.comments.push(infocomment._id)
    let wait5 = await comment12.save()
    comeagain = true
    res.redirect('/oneproduct')
  }
})

router.post('/login', passport.authenticate('local',
   {  
     failureRedirect: '/account/login'
   }), async function(req,res){
     console.log('login done.') 
     try{
      amountcart  = await productcart.countDocuments({username: res.locals.currentUser.username});
       name = res.locals.currentUser.username
     }catch{
       console.log('error')
     }
     alert('login success.')
     if(allproduct){
      allproduct = false
      comeagain = true
      console.log('oneproduct')
      nowproduct1 = nowproduct
      nowproduct2 = true
      res.redirect('/oneproduct')
    }else if(totalproduct){
      console.log('totalproduct')
      totalproduct = false
      res.redirect('/totalproduct')
    }else{
      res.redirect('/')
    }
   }
);

router.post('/register', function async (req,res){
    console.log('register')
    var newUser = new userss({username: req.body.username , email: req.body.email , address: '' , phone: '' , img: null , imgType: null});
      userss.register(newUser, req.body.password, function(err, user){
          if(err) {
              console.log(err);
              alert('username already use')
              return res.redirect('/account/login');
          }
          alert('register finish.')
          const cardinfo = new creditcards({NameCard: '' , NumberCard: '' ,  ValidDate : '', CVV : null})
          cardinfo.save();
          console.log('cardinfo._id ' + cardinfo._id)
          user.creditcard.push(cardinfo._id)
          user.save()
          
          res.redirect('/account/login');
      });
});

router.get('/oneproduct', async (req,res) => {
  console.log('id : ' + req.query.id)
    try{
      amountcart = await productcart.countDocuments({username: res.locals.currentUser.username});
      name = res.locals.currentUser.username
    }catch{
      console.log('err')
    }
    allproduct = true
    if(comeagain){
      nowproduct = nowproduct3
      comeagain = false
    }else{
      nowproduct = req.query.id
      nowproduct3 = nowproduct
    }
    if(nowproduct2){
      const product  = await Product.findById(nowproduct1).populate('comments').exec();
      console.log(product)
      commentid = product._id
      checkpro = product.quantity
      const relateproduct  = await Product.find({ category:product.category, name: { $ne: product.name} });
      res.render('eachproduct.ejs',{
        relateproduct,
        product,
        name: name,
        amountcart: amountcart,
       })
      nowproduct2 = false
    }else{ 
      const product  = await Product.findById(nowproduct).populate('comments').exec();
      commentid = product._id
      checkpro = product.quantity
      const relateproduct  = await Product.find({category:product.category, name: { $ne: product.name}});
      res.render('eachproduct.ejs',{
        relateproduct,
        product,
        name: name,
        amountcart: amountcart,     
    })
  }
});

router.post('/addcart', async(req,res)=>{
  var datetime = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Bangkok'
  });
  let date = datetime
  let checkcart = '';  
  if(res.locals.currentUser != null){
    console.log('checkcount')
    console.log(checkpro)
    if(req.body.quantity > checkpro){
      comeagain= true
      alert('The inventory is not enough for your product requirements.')
      res.redirect('/oneproduct')
    }else{
      rr  = await productcart.find({productname: req.query.id , username: res.locals.currentUser.username})
      console.log('rr : ' + rr)
    try{
      checkcart = rr[0].productname
      currentquality = rr[0].productquantity
    }catch{
      checkcart = ''
      currentquality = 0
    }
    console.log('checkcart : ' + checkcart)
    if(checkcart == ''){
      console.log('addcart');
      let username = res.locals.currentUser.username;
      const product  = await Product.find({name: req.query.id});
      console.log(product)
      var productname = product[0].name;
      var productquantity = req.body.quantity;
      var productprice = product[0].price;
      var productimg = product[0].img;
      var productimgType = product[0].imgType;
      var productcategory = product[0].category
      var productmaxquantity = product[0].quantity
      const cart = new productcart({
        username,
        productname,
        productprice,
        productquantity,
        productcategory,
        productmaxquantity,
        date,
        productimg,
        productimgType,
        
     })
      
  try{
      const newProduct = await cart.save();
      console.log('newproduct ' + newProduct);  
      comeagain= true
      alert(productname + ' is added to your cart.')
      res.redirect('/oneproduct')

     }catch (err){
      console.log(err);   
        }
   }else{
      alert('This product already have in your cart.')
      comeagain= true
      res.redirect('/oneproduct')
   }
  }  
  }else{
    allproduct = true;
    comeagain= true
    res.render('login.ejs',{
      name:  name,
      amountcart: amountcart,
    })
  }
})
  
router.get('/totalproduct', async(req,res) => {
  try{
    amountcart = await productcart.countDocuments({username: res.locals.currentUser.username});
    name = res.locals.currentUser.username
  }catch{
    console.log('err')
  }
  allproduct = false
  total =0 
  tax =0
  subtotal = 0
  if(res.locals.currentUser != null){
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
        tax,
        subtotal,
        total,
        cartproduct,
        name: res.locals.currentUser.username,
        amountcart: amountcart, 
        info,
        creditcard  
  })
  }else{
    totalproduct = true
    res.render('login.ejs',{
      name:  name,
      amountcart: amountcart,
    })
  }
});

function isLoggedIn(req, res , next){
  if(req.isAuthenticated()){
    console.log('not login')
    return next();
  }
  res.redirect('/login')
}

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