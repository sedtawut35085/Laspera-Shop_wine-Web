var express = require('express'),
    router = express.Router({mergeParams: true}),
    userss = require('../models/user'),
    creditcards = require('../models/creditcard'),
    productcart = require("../models/productcart"),
    Product = require('../models/product'),
    comment = require("../models/comments"),
    passport = require("passport");
    middleware = require('../middleware');

let alert = require('alert'); 
let nowproductt
let amountcart = 0;
let name;
let infouser;
let checkcategory = 'Wine';
let page = 1;
let con = '';
let productsearch;
let sortname = 'Sort by';
let advance;
let product ;
let infoadvance;
let checkadvance = false
let checksearch = false
let infosearch = ''
let countproduct = 0
let filterbrand 
let filtercategory 
let filterprice 
let filteralcohol 

router.get('/productsearch',async (req,res,next) =>{
  req.session.fromUrl = req.originalUrl;
  if(res.locals.currentUser == null){
    amountcart = 0
    name= ''
  }else{
    name = res.locals.currentUser.username
    infouser = await userss.findById(res.locals.currentUser._id)
    amountcart = await productcart.countDocuments({username: res.locals.currentUser.username});
  }
    try{
      page =1
      filterbrand = null
      filtercategory = null
      filterprice = null
      filteralcohol = null
      checkcategory = 'Wine'
      // const productinfo = await Product.find({ $text: { $search: "\"bella\""} })
      infosearch = productsearch
      checksearch = true
      checkadvance = false
      const product  = await Product.find({name: {'$regex' : infosearch, '$options' : 'i'}})
      countproduct  = await Product.countDocuments({name: {'$regex' : infosearch, '$options' : 'i'}})
      // const product = await Product.findById(productinfo[0]._id).populate('comments').exec();
      // console.log('productinfo2: ' + product)
      con = 'Sort by'
      res.render("allproduct.ejs", {
            product,
            name: name,
            amountcart: amountcart,
            sortname: con,
            page : page,
            filterbrand,
            filtercategory,
            filterprice,
            filteralcohol,
            infouser,
            checkcategory,
            infosearch,
            countproduct
          });  
    }catch(err){
      console.log(err)
   
  }
})
  
router.post('/search', async(req, res, next)=>{
    console.log('search')
    console.log(req.body.productsearch)
    productsearch = req.body.productsearch;
    res.redirect('/store/productsearch')
})

router.get('/redproduct' , async(req,res)=>{  
  infosearch = ''
  filterbrand = null
  filtercategory = null
  filterprice = null
  filteralcohol = null
  req.session.fromUrl = req.originalUrl;
  if(res.locals.currentUser == null){
    amountcart = 0
    name= ''
  }else{
    name = res.locals.currentUser.username
    infouser = await userss.findById(res.locals.currentUser._id)
    amountcart = await productcart.countDocuments({username: res.locals.currentUser.username});
  }
    page = 1;
    countproduct = 0
    product  = await Product.find({category: 'Red Wine'})
    checkcategory = 'Red Wine'
    checkadvance = false
    con = 'Sort by'
    res.render("allproduct.ejs", {
      product,
      name: name,
      amountcart: amountcart,
      sortname: con,
      page : page,
      filterbrand,
      filtercategory,
      filterprice,
      filteralcohol,
      infouser,
      checkcategory,
      infosearch,
      countproduct
    }); 
})

router.get('/whiteproduct' , async(req,res)=>{  
  infosearch = ''
  filterbrand = null
  filtercategory = null
  filterprice = null
  filteralcohol = null
  req.session.fromUrl = req.originalUrl;
  if(res.locals.currentUser == null){
    amountcart = 0
    name= ''
  }else{
    name = res.locals.currentUser.username
    infouser = await userss.findById(res.locals.currentUser._id)
    amountcart = await productcart.countDocuments({username: res.locals.currentUser.username});
  }
    page = 1;
    product = await Product.find({category: 'White Wine'})
    checkcategory = 'White Wine'
    checkadvance = false
    con = 'Sort by'
    countproduct = 0
    res.render("allproduct.ejs", {
      product,
      name: name,
      amountcart: amountcart,
      sortname: con,
      page : page,
      filterbrand,
      filtercategory,
      filterprice,
      filteralcohol,
      infouser,
      checkcategory,
      infosearch,
      countproduct
    }); 
})
  
router.get('/dessertproduct' , async(req,res)=>{ 
  infosearch = ''
  filterbrand = null
  filtercategory = null
  filterprice = null
  filteralcohol = null 
  checkadvance = false
  req.session.fromUrl = req.originalUrl;
  if(res.locals.currentUser == null){
    amountcart = 0
    name= ''
  }else{
    name = res.locals.currentUser.username
    infouser = await userss.findById(res.locals.currentUser._id)
    amountcart = await productcart.countDocuments({username: res.locals.currentUser.username});
  }
    page = 1;
    product = await Product.find({category: 'Dessert Wine'})
    checkcategory = 'Dessert Wine'
    con = 'Sort by'
    countproduct = 0
    res.render("allproduct.ejs", {
      product,
      name: name,
      amountcart: amountcart,
      sortname: con,
      page : page,
      filterbrand,
      filtercategory,
      filterprice,
      filteralcohol,
      infouser,
      checkcategory,
      infosearch,
      countproduct
    }); 
})
  
router.get('/roseproduct' , async(req,res)=>{
  infosearch = '' 
  filterbrand = null
  filtercategory = null
  filterprice = null
  filteralcohol = null
  req.session.fromUrl = req.originalUrl; 
  checkadvance = false
  if(res.locals.currentUser == null){
    amountcart = 0
    name= ''
  }else{
    name = res.locals.currentUser.username
    infouser = await userss.findById(res.locals.currentUser._id)
    amountcart = await productcart.countDocuments({username: res.locals.currentUser.username});
  }
    page = 1;
    product = await Product.find({category: 'Rose Wine'})
    checkcategory = 'Rose Wine'
    checkadvance = false
    con = 'Sort by'
    countproduct = 0
    res.render("allproduct.ejs", {
      product,
      name: name,
      amountcart: amountcart,
      sortname: con,
      page : page,
      filterbrand,
      filtercategory,
      filterprice,
      filteralcohol,
      infouser,
      checkcategory,
      infosearch,
      countproduct
    }); 
})
  
router.get('/sparklingproduct' , async(req,res)=>{
  infosearch = ''
  filterbrand = null
  filtercategory = null
  filterprice = null
  filteralcohol = null  
  req.session.fromUrl = req.originalUrl;
  if(res.locals.currentUser == null){
    amountcart = 0
    name= ''
  }else{
    name = res.locals.currentUser.username
    infouser = await userss.findById(res.locals.currentUser._id)
    amountcart = await productcart.countDocuments({username: res.locals.currentUser.username});
  }
    page = 1;
    product = await Product.find({category: 'Sparkling Wine'})
    checkcategory = 'Sparkling Wine'
    checkadvance = false
    con = 'Sort by'
    countproduct = 0
    res.render("allproduct.ejs", {
      product,
      name: name,
      amountcart: amountcart,
      sortname: con,
      page : page,
      filterbrand,
      filtercategory,
      filterprice,
      filteralcohol,
      infouser,
      checkcategory,
      infosearch,
      countproduct
    }); 
})
  
router.get('/allproducts' , async(req,res)=>{  
    filterbrand = null
    filtercategory = null
    filterprice = null
    filteralcohol = null
    req.session.fromUrl = req.originalUrl;
    page = 1;
    if(res.locals.currentUser == null){
      name= ''
    }else{
      name = res.locals.currentUser.username
      infouser = await userss.findById(res.locals.currentUser._id)
      amountcart = await productcart.countDocuments({username: res.locals.currentUser.username});
    }
    infosearch = ''
    checkadvance = false
    checksearch = false
    product  = await Product.find()
    checkcategory = 'Wine'
    con = 'Sort by'
    countproduct = 0
    res.render("allproduct.ejs", {
      product,
      infouser,
      name: name,
      amountcart: amountcart,
      sortname: con,
      page : page,
      filterbrand,
      filtercategory,
      filterprice,
      filteralcohol,
      checkcategory,
      infosearch,
      countproduct
    }); 
})
  
router.get('/backpage', async(req,res)=>{
    page = page - 1
    res.redirect('/store/allproduct')
})
  
router.get('/nextpage', async(req,res)=>{
    page = page + 1
    res.redirect('/store/allproduct')
})
  
router.get('/page1', async(req,res)=>{
    page = 1
    res.redirect('/store/allproduct')
})
  
router.get('/page2', async(req,res)=>{
    page = 2
    res.redirect('/store/allproduct')
})
  
router.get('/page3', async(req,res)=>{
    page = 3
    res.redirect('/store/allproduct')
})
  
router.get('/allproduct', async (req,res) => {
    req.session.fromUrl = req.originalUrl;
    if(res.locals.currentUser == null){
      name= ''
    }else{
      name = res.locals.currentUser.username
      infouser = await userss.findById(res.locals.currentUser._id)
      amountcart = await productcart.countDocuments({username: res.locals.currentUser.username});
    }
    amountcart = await productcart.countDocuments({username: name});
    if(con == 'A-Z'){
      console.log('Find A-Z')
      try{
        if(checkadvance == true){
          product  = await Product.find(infoadvance).sort({"name":1});
        }else if(checksearch){
          product  = await Product.find({category: {'$name' : infosearch, '$options' : 'i'}}).sort({"name":1});
        }else{
          product  = await Product.find({category: {'$regex' : checkcategory, '$options' : 'i'}}).sort({"name":1});
        }
        sortname = 'Sort by A-Z'
        res.render("allproduct.ejs", {
          infouser,
          product,
          name: name,
          amountcart: amountcart,
          sortname: sortname,
          page : page , 
          filterbrand,
          filtercategory,
          filterprice,
          filteralcohol,
          checkcategory,
          infosearch,
          countproduct
        });
      }catch (err){
        console.log("err: "+ err); 
      }
    }else if(con =='highprice'){
      console.log('find highprice')
      try{
        if(checkadvance){
          product = await Product.find(infoadvance).sort({"price":-1});
        }else if(checksearch){
          product = await Product.find({name: {'$regex' : infosearch, '$options' : 'i'}}).sort({"price":-1});
        }else{
          product = await Product.find({category: {'$regex' : checkcategory, '$options' : 'i'}}).sort({"price":-1});
        }
        sortname = 'Sort by highest price'
        res.render("allproduct.ejs", {
          infouser,
          product,
          name: name,
          amountcart: amountcart,
          sortname: sortname,
          page : page,
          filterbrand,
          filtercategory,
          filterprice,
          filteralcohol,
          checkcategory,
          infosearch,
      countproduct
        });
      }catch (err){
        console.log("err: "+ err); 
      }
    }else if(con == 'lowprice'){
      console.log('find lowprice');
      try{
        if(checkadvance){
          product  = await Product.find(infoadvance).sort({"price":1});
        }else if(checksearch){
          product  = await Product.find({name: {'$regex' : infosearch, '$options' : 'i'}}).sort({"price":1});
        }else{
          product  = await Product.find({category: {'$regex' : checkcategory, '$options' : 'i'}}).sort({"price":1});
        }
        sortname = 'Sort by lowest price'
        res.render("allproduct.ejs", {
          infouser,
          product,
          name: name,
          amountcart: amountcart,
          sortname: sortname,
          page : page,
          filterbrand,
          filtercategory,
          filterprice,
          filteralcohol,
          checkcategory,
          infosearch,
          countproduct
        });
      }catch (err){
        console.log("err: "+ err); 
      }
    }else if(con == 'newproduct'){
      console.log('Find newproduct')
      try{
        if(checkadvance){
          product = await Product.find(infoadvance).sort({_id:-1});
        }else if(checksearch){
          product = await Product.find({name: {'$regex' : infosearch, '$options' : 'i'}}).sort({_id:-1});
        }else{
          product = await Product.find({category: {'$regex' : checkcategory, '$options' : 'i'}}).sort({_id:-1});
        }
        sortname = 'Sort by New product'
        res.render("allproduct.ejs", {
          infouser,
          product,
          name: name,
          amountcart: amountcart,
          sortname: sortname,
          page : page,
          filterbrand,
          filtercategory,
          filterprice,
          filteralcohol,
          checkcategory,
          infosearch,
          countproduct
        });
      }catch (err){
        console.log("err: "+ err); 
      }    
    }else{    
      console.log('Find normal')
      sortname = 'Sort by'
      try{
        if(checkadvance == true){
          // product = await Product.find(infoadvance); 
        }else if(checksearch){
          product  = await Product.find({name: {'$regex' : infosearch, '$options' : 'i'}});
        }else{
          product  = await Product.find({category: {'$regex' : checkcategory, '$options' : 'i'}});
        }
        res.render("allproduct.ejs", {
          infouser,
          product,
          name: name,
          amountcart: amountcart,
          sortname: sortname,
          page : page,
          filterbrand,
          filtercategory,
          filterprice,
          filteralcohol,
          checkcategory,
          infosearch,
          countproduct
        });    
      }catch (err){
        console.log("err: "+ err);      
      }}   
});

router.post('/advance', async(req,res)=>{
    checksearch = false
    infosearch = ''
    page =1
    checkcategory = 'Wine'
    filterbrand = null
    filtercategory = null
    filterprice = null
    filteralcohol = null
    advance = req.body
    checkadvance = true
    console.log(advance)
    sortname = 'Sort by'
    if(advance.brand != null && advance.price1 == '' && advance.price2 == '' && advance.category == null && advance.alcohol1 == '' &&  advance.alcohol2 == ''){
      console.log('brand')
      filterbrand = advance.brand
      console.log('filterbrand ' + filterbrand)
      infoadvance = {brand: advance.brand}
      product  = await Product.find(infoadvance).sort({brand: 1});
    }
    else if(advance.brand == null && (advance.price1 != '' || advance.price2 != '') && advance.category == null && advance.alcohol1 == '' &&  advance.alcohol2 == ''){
      console.log('price')
      if(advance.price1 == ''){
        advance.price1 = 0
      }
      if(advance.price2 == ''){
        advance.price2 = 1000
      }
      filterprice = '$'+advance.price1 + ' to ' + '$'+advance.price2 
      console.log(filterprice)
      infoadvance = {price: {$gte: advance.price1, $lte: advance.price2}}
      product  = await Product.find(infoadvance).sort({price: 1});
    }
    else if(advance.brand == null && advance.price1 == '' && advance.price2 == '' && advance.category != null && advance.alcohol1 == '' &&  advance.alcohol2 == ''){
      console.log('category')
      filtercategory = advance.category
      infoadvance = {category: advance.category}
      product  = await Product.find(infoadvance).sort({category: 1});
    }
    else if(advance.brand == null && advance.price1 == '' && advance.price2 == '' && advance.category == null && (advance.alcohol1 != '' ||  advance.alcohol2 != '')){
      console.log('alcohol')
      if(advance.alcohol1 == ''){
        advance.alcohol1 = 0
      }
      if(advance.alcohol2 == ''){
        advance.alcohol2 = 100
      }
      filteralcohol = advance.alcohol1 + ' to ' + advance.alcohol2
      infoadvance = {alcohol: {$gte: advance.alcohol1, $lte: advance.alcohol2}}
      product  = await Product.find(infoadvance).sort({alcohol: 1});
    }
    else if(advance.brand != null && (advance.price1 != '' || advance.price2 != '') && advance.category == null &&  advance.alcohol1 == '' &&  advance.alcohol2 == ''){
      console.log('brand price')
      if(advance.price1 == ''){
        advance.price1 = 0
      }
      if(advance.price2 == ''){
        advance.price2 = 1000
      }
      filterbrand = advance.brand
      filterprice = '$'+advance.price1 + ' to ' + '$'+advance.price2 
      infoadvance = {brand: advance.brand,price: {$gte: advance.price1, $lte: advance.price2}}
      product  = await Product.find(infoadvance).sort({price: 1});
    }
    else if(advance.brand != null && advance.price1 == '' && advance.price2 == '' && advance.category != null && advance.alcohol1 == '' &&  advance.alcohol2 == ''){
      console.log('brand category') 
      filterbrand = advance.brand
      filtercategory = advance.category
      infoadvance = {brand: advance.brand,category: advance.category}
      console.log('advance : ' + infoadvance)
      product  = await Product.find(infoadvance).sort({brand: 1});
    }
    else if(advance.brand != null && advance.price1 == '' && advance.price2 == '' && advance.category == null && (advance.alcohol1 != '' ||  advance.alcohol2 != '')){
      console.log('brand alcohol')
      if(advance.alcohol1 == ''){
        advance.alcohol1 = 0
      }
      if(advance.alcohol2 == ''){
        advance.alcohol2 = 100
      }
      filterbrand = advance.brand
      filteralcohol = advance.alcohol1 + ' to ' + advance.alcohol2
      infoadvance = {brand: advance.brand,alcohol: {$gte: advance.alcohol1, $lte: advance.alcohol2}}
      product  = await Product.find(infoadvance).sort({brand: 1});
    }
    else if(advance.brand == null && (advance.price1 != '' || advance.price2 != '') && advance.category != null && advance.alcohol1 == '' &&  advance.alcohol2 == ''){
      console.log('price category')
      if(advance.price1 == ''){
        advance.price1 = 0
      }
      if(advance.price2 == ''){
        advance.price2 = 1000
      }
      filterprice = '$'+advance.price1 + ' to ' + '$'+advance.price2 
      filtercategory = advance.category
      infoadvance = {price: {$gte: advance.price1, $lte: advance.price2},category: advance.category}
      product  = await Product.find(infoadvance).sort({price: 1});
    }
    else if(advance.brand == null && (advance.price1 != '' || advance.price2 != '') && advance.category == null && (advance.alcohol1 != '' ||  advance.alcohol2 != '')){
      console.log('price alcohol')
      if(advance.alcohol1 == ''){
        advance.alcohol1 = 0
      }
      if(advance.alcohol2 == ''){
        advance.alcohol2 = 100
      }
      if(advance.price1 == ''){
        advance.price1 = 0
      }
      if(advance.price2 == ''){
        advance.price2 = 1000
      }
      filteralcohol = advance.alcohol1 + ' to ' + advance.alcohol2
      filterprice = '$'+advance.price1 + ' to ' + '$'+advance.price2 
      infoadvance = {price: {$gte: advance.price1, $lte: advance.price2},alcohol: {$gte: advance.alcohol1, $lte: advance.alcohol2}}
      product  = await Product.find(infoadvance).sort({category: 1});
    }
    else if(advance.brand == null && advance.price1 == '' && advance.price2 == '' && advance.category != null && (advance.alcohol1 != '' ||  advance.alcohol2 != '')){
      console.log('category alcohol')
      if(advance.alcohol1 == ''){
        advance.alcohol1 = 0
      }
      if(advance.alcohol2 == ''){
        advance.alcohol2 = 100
      }
      filtercategory = advance.category
      filteralcohol = advance.alcohol1 + ' to ' + advance.alcohol2
      infoadvance = {category: advance.category,alcohol: {$gte: advance.alcohol1, $lte: advance.alcohol2}}
      product  = await Product.find(infoadvance).sort({category: 1});
    }
    else if(advance.brand != null && advance.price1 == '' && advance.price2 == '' && advance.category != null && (advance.alcohol1 != '' ||  advance.alcohol2 != '')){
      console.log('brand alcohol category')
      if(advance.alcohol1 == ''){
        advance.alcohol1 = 0
      }
      if(advance.alcohol2 == ''){
        advance.alcohol2 = 100
      }
      filtercategory = advance.category
      filterbrand = advance.brand
      filteralcohol = advance.alcohol1 + ' to ' + advance.alcohol2
      infoadvance = {brand: advance.brand,category: advance.category,alcohol: {$gte: advance.alcohol1, $lte: advance.alcohol2}}
      product  = await Product.find(infoadvance).sort({category: 1});
    }
    else if(advance.brand != null && (advance.price1 != '' || advance.price2 != '') && advance.category != null && advance.alcohol1 == '' &&  advance.alcohol2 == ''){
      console.log('brand price category')
      if(advance.price1 == ''){
        advance.price1 = 0
      }
      if(advance.price2 == ''){
        advance.price2 = 1000
      }
      filterbrand = advance.brand
      filtercategory = advance.category
      filterprice = '$'+advance.price1 + ' to ' + '$'+advance.price2 
      infoadvance = {brand: advance.brand,category: advance.category,price: {$gte: advance.price1, $lte: advance.price2}}
      product  = await Product.find(infoadvance).sort({category: 1});
    }
    else if(advance.brand != null && (advance.price1 != '' || advance.price2 != '') && advance.category != null && advance.alcohol1 == '' &&  advance.alcohol2 == ''){
      console.log('brand price alcohol')
      if(advance.price1 == ''){
        advance.price1 = 0
      }
      if(advance.price2 == ''){
        advance.price2 = 1000
      }
      filterbrand = advance.brand
      filterprice = '$'+advance.price1 + ' to ' + '$'+advance.price2 
      filteralcohol = advance.alcohol1 + ' to ' + advance.alcohol2
      infoadvance = {brand: advance.brand,price: {$gte: advance.price1, $lte: advance.price2},alcohol: {$gte: advance.alcohol1, $lte: advance.alcohol2}}
      product  = await Product.find(infoadvance).sort({category: 1});
    }
    else if(advance.brand == null && (advance.price1 != '' || advance.price2 != '') && advance.category != null && (advance.alcohol1 != '' ||  advance.alcohol2 != '')){
      console.log('price category alcohol')
      if(advance.price1 == ''){
        advance.price1 = 0
      }
      if(advance.price2 == ''){
        advance.price2 = 1000
      }
      if(advance.alcohol1 == ''){
        advance.alcohol1 = 0
      }
      if(advance.alcohol2 == ''){
        advance.alcohol2 = 100
      }
      filterprice = '$'+advance.price1 + ' to ' + '$'+advance.price2 
      filteralcohol = advance.alcohol1 + ' to ' + advance.alcohol2
      filtercategory = advance.category
      infoadvance = {category: advance.category,price: {$gte: advance.price1, $lte: advance.price2},alcohol: {$gte: advance.alcohol1, $lte: advance.alcohol2}}
      product  = await Product.find(infoadvance).sort({category: 1});
    }else if(advance.brand != null && (advance.price1 != '' || advance.price2 != '') && advance.category != null && (advance.alcohol1 != '' ||  advance.alcohol2 != '')){
      console.log('price category alcohol category')
      if(advance.price1 == ''){
        advance.price1 = 0
      }
      if(advance.price2 == ''){
        advance.price2 = 1000
      }
      if(advance.alcohol1 == ''){
        advance.alcohol1 = 0
      }
      if(advance.alcohol2 == ''){
        advance.alcohol2 = 100
      }
      filterprice = '$'+advance.price1 + ' to ' + '$'+advance.price2 
      filteralcohol = advance.alcohol1 + ' to ' + advance.alcohol2
      filtercategory = advance.category
      filterbrand = advance.brand
      infoadvance = {brand: advance.brand,category: advance.category,price: {$gte: advance.price1, $lte: advance.price2},alcohol: {$gte: advance.alcohol1, $lte: advance.alcohol2}}
      product  = await Product.find(infoadvance).sort({category: 1});
    }
    res.redirect('/store/filter')
   
  })

  router.get('/filter',async (req,res)=>{
    req.session.fromUrl = req.originalUrl;
    try{
      name = res.locals.currentUser.username
      infouser = await userss.findById(res.locals.currentUser._id)
      amountcart = await productcart.countDocuments({username: res.locals.currentUser.username});
    }catch{
      console.log('err')
    }
    countproduct = 0
    res.render("allproduct.ejs", {
      infouser,
      product,
      name: name,
      amountcart: amountcart,
      sortname: sortname,
      page : page,
      filterbrand,
      filtercategory,
      filterprice,
      filteralcohol,
      checkcategory,
      infosearch,
      countproduct
    });

  })
  
  router.get('/clearfilter', (req,res)=>{
    page =1
    filterbrand = null
    filtercategory = null
    filterprice = null
    filteralcohol = null
    checkadvance = false
    sortname = 'Sort by'
    con = ''
    res.redirect('/store/allproduct')
  })
  
  router.post('/sort', async (req,res)=>{
    console.log('sort: ' + req.body.example);
    con = req.body.example;
    res.redirect('/store/allproduct')
  });
  
router.get('/oneproduct', async (req,res) => {
    req.session.fromUrl = req.originalUrl;
    console.log('oneproduct')
    console.log('id : ' + req.query.id)
    if(req.query.id != null){
      nowproductt = req.query.id
    }
    try{
        name = res.locals.currentUser.username
        infouser = await userss.findById(res.locals.currentUser._id)
        amountcart = await productcart.countDocuments({username: res.locals.currentUser.username});
    }catch{
        name = ''
        console.log('err')
    }
    const product  = await Product.findById(nowproductt).populate('comments').exec();
    console.log(product)
    const relateproduct  = await Product.find({ category:product.category, name: { $ne: product.name} }).limit(4);
    res.render('eachproduct.ejs',{
        relateproduct,
        product,
        infouser,
        name: name,
        amountcart: amountcart,
       })
  });
  
  router.post('/addcart', middleware.isLoggedIn, async(req,res)=>{
    var datetime = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Bangkok'
    });
    let date = datetime
    let checkcart = '';  
    console.log('checkcount')
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
        const infouser = await userss.findById(res.locals.currentUser._id)
        infouser.cart.push(newProduct._id)
        await infouser.save()
        // alert(productname + ' is added to your cart.')
        req.flash('addcartsuccess', productname + ' is added to your cart.');
        res.redirect('/store/oneproduct')
       }catch (err){
        console.log(err);   
        }
      }else{
       await productcart.update({productname: req.query.id , username: res.locals.currentUser.username},{$set:{"productquantity": Number(currentquality) + Number(req.body.quantity)}})
        // alert('This product update quantity in your cart ' + currentquality + ' to ' + (Number(currentquality) + Number(req.body.quantity)) )
        req.flash('addcartsuccess', 'This product update quantity in your cart ' + currentquality + ' to ' + (Number(currentquality) + Number(req.body.quantity)) );
        res.redirect('/store/oneproduct')
     }
  })
  
  module.exports = router;