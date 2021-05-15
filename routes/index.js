var express = require('express'),
    router = express.Router({mergeParams: true}),
    userss = require('../models/user'),
    creditcards = require('../models/creditcard'),
    productcart = require("../models/productcart"),
    Product = require('../models/product'),
    comment = require("../models/comments"),
    passport = require("passport");

let alert = require('alert'); 
const e = require('express');
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
let infouser;
let comeagain = false
let nowproduct2 = false
let checkcategory = 'Wine';
let page = 1;
let con = '';
let productsearch;
let sortname = 'Sort by';
let advance;
let product ;
let infoadvance;
let checkadvance =false
let filterbrand 
let filtercategory 
let filterprice 
let filteralcohol 

const imageMimeTypes = ["image/jpeg", "image/png", "images/gif"];

router.get('/',  async(req,res) => {
  filterbrand = null
  filtercategory = null
  filterprice = null
  filteralcohol = null
  checkadvance = false
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

router.get('/productsearch',async (req,res,next) =>{
  
  try{
    const productinfo  = await Product.find({name: productsearch});
    console.log('productinfo: ' + productinfo)
    console.log('productinfo._id: ' + productinfo[0]._id)
    const product = await Product.findById(productinfo[0]._id).populate('comments').exec();
    if(product.name != null){
      const relateproduct  = await Product.find({ category:product.category, name: { $ne: product.name} });
      res.render('eachproduct.ejs',{
        relateproduct ,
        product,
        name: name,
        amountcart: amountcart,
        infouser
        
      })      
    }
  }catch{
    console.log('error')
    res.render('errorproduct.ejs',{
      name: name,
      amountcart: amountcart,
      error: productsearch,
      amountcart: amountcart,
      infouser
      
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
  product  = await Product.find({category: 'Red Wine'})
  checkcategory = 'Red Wine'
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
    filteralcohol
  }); 
})

router.get('/whiteproduct' , async(req,res)=>{  
  allproduct = false
  page = 1;
  product = await Product.find({category: 'White Wine'})
  checkcategory = 'White Wine'
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
    filteralcohol
  }); 
})

router.get('/dessertproduct' , async(req,res)=>{  
  allproduct = false
  page = 1;
  product = await Product.find({category: 'Dessert Wine'})
  checkcategory = 'Dessert Wine'
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
    filteralcohol
  }); 
})

router.get('/roseproduct' , async(req,res)=>{  
  allproduct = false
  page = 1;
  product = await Product.find({category: 'Rose Wine'})
  checkcategory = 'Rose Wine'
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
    filteralcohol
  }); 
})

router.get('/sparklingproduct' , async(req,res)=>{  
  allproduct = false
  page = 1;
  product = await Product.find({category: 'Sparkling Wine'})
  checkcategory = 'Sparkling Wine'
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
    filteralcohol
  }); 
})

router.get('/allproducts' , async(req,res)=>{  
  allproduct = false
  page = 1;
  if(res.locals.currentUser == null){
    name= ''
  }else{
    name = res.locals.currentUser.username
    infouser = await userss.findById(res.locals.currentUser._id)
    amountcart = await productcart.countDocuments({username: res.locals.currentUser.username});
  }
  product  = await Product.find()
  checkcategory = 'Wine'
  con = 'Sort by'
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
    filteralcohol
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
    infouser = await userss.findById(res.locals.currentUser._id)
    amountcart = await productcart.countDocuments({username: res.locals.currentUser.username});
  }
  amountcart = await productcart.countDocuments({username: name});
  if(con == 'A-Z'){
    console.log('Find A-Z')
    try{
      if(checkadvance == true){
        product  = await Product.find(infoadvance).sort({"name":1});
      }else{
        product  = await Product.find({category: {'$regex' : checkcategory, '$options' : 'i'}}).sort({"name":1});
      }
     
      // console.log('AllProduct : '+ product)
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
        filteralcohol
      });
    }catch (err){
      console.log("err: "+ err); 
    }
  }else if(con =='highprice'){
    console.log('find highprice')
    try{
      if(checkadvance == true){
        product = await Product.find(infoadvance).sort({"price":-1});
      }else{
        product = await Product.find({category: {'$regex' : checkcategory, '$options' : 'i'}}).sort({"price":-1});
      }
    
      // console.log('AllProduct : '+ product)
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
        filteralcohol
      });
    }catch (err){
      console.log("err: "+ err); 
    }
  }else if(con == 'lowprice'){
    console.log('find lowprice');
    try{
      if(checkadvance == true){
        product  = await Product.find(infoadvance).sort({"price":1});
      }else{
        product  = await Product.find({category: {'$regex' : checkcategory, '$options' : 'i'}}).sort({"price":1});
      }
      // console.log('AllProduct : '+ product)
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
        filteralcohol
      });
    }catch (err){
      console.log("err: "+ err); 
    }
  }else if(con == 'newproduct'){
    console.log('Find newproduct')
    try{
      if(checkadvance == true){
        product = await Product.find(infoadvance).sort({_id:-1});
      }else{
        product = await Product.find({category: {'$regex' : checkcategory, '$options' : 'i'}}).sort({_id:-1});
      }
    
      // console.log('AllProduct : '+ product)
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
        filteralcohol
      });
    }catch (err){
      console.log("err: "+ err); 
    }    
  }else{    
    console.log('Find normal')
    sortname = 'Sort by'
    try{
      if(checkadvance == true){
        product = await Product.find(infoadvance);

      }else{
        product  = await Product.find();
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
        filteralcohol
      });
      
    }catch (err){
      
      console.log("err: "+ err); 
      
    }

  }
    
});

router.post('/advance', async(req,res)=>{
  page =1
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
  else if(advance.brand == null && advance.price1 != '' && advance.price2 != '' && advance.category == null && advance.alcohol1 == '' &&  advance.alcohol2 == ''){
    console.log('price')
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
  else if(advance.brand == null && advance.price1 == '' && advance.price2 == '' && advance.category == null && advance.alcohol1 != '' &&  advance.alcohol2 != ''){
    console.log('alcohol')
    filteralcohol = advance.alcohol1 + ' to ' + advance.alcohol2
    infoadvance = {alcohol: {$gte: advance.alcohol1, $lte: advance.alcohol2}}
    product  = await Product.find(infoadvance).sort({alcohol: 1});
  }
  else if(advance.brand != null && advance.price1 != '' && advance.price2 != '' && advance.category == null &&  advance.alcohol1 == '' &&  advance.alcohol2 == ''){
    console.log('brand price')
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
  else if(advance.brand != null && advance.price1 == '' && advance.price2 == '' && advance.category == null && advance.alcohol1 != '' &&  advance.alcohol2 != ''){
    console.log('brand alcohol')
    filterbrand = advance.brand
    filteralcohol = advance.alcohol1 + ' to ' + advance.alcohol2
    infoadvance = {brand: advance.brand,alcohol: {$gte: advance.alcohol1, $lte: advance.alcohol2}}
    product  = await Product.find(infoadvance).sort({brand: 1});
  }
  else if(advance.brand == null && advance.price1 != '' && advance.price2 != '' && advance.category != null && advance.alcohol1 == '' &&  advance.alcohol2 == ''){
    console.log('price category')
    filterprice = '$'+advance.price1 + ' to ' + '$'+advance.price2 
    filtercategory = advance.category
    infoadvance = {price: {$gte: advance.price1, $lte: advance.price2},category: advance.category}
    product  = await Product.find(infoadvance).sort({price: 1});
  }
  else if(advance.brand == null && advance.price1 != '' && advance.price2 != '' && advance.category == null && advance.alcohol1 != '' &&  advance.alcohol2 != ''){
    console.log('price alcohol')
    filteralcohol = advance.alcohol1 + ' to ' + advance.alcohol2
    filterprice = '$'+advance.price1 + ' to ' + '$'+advance.price2 
    infoadvance = {price: {$gte: advance.price1, $lte: advance.price2},alcohol: {$gte: advance.alcohol1, $lte: advance.alcohol2}}
    product  = await Product.find(infoadvance).sort({category: 1});
  }
  else if(advance.brand == null && advance.price1 == '' && advance.price2 == '' && advance.category != null && advance.alcohol1 != '' &&  advance.alcohol2 != ''){
    console.log('category alcohol')
    filtercategory = advance.category
    filteralcohol = advance.alcohol1 + ' to ' + advance.alcohol2
    infoadvance = {category: advance.category,alcohol: {$gte: advance.alcohol1, $lte: advance.alcohol2}}
    product  = await Product.find(infoadvance).sort({category: 1});
  }
  else if(advance.brand != null && advance.price1 == '' && advance.price2 == '' && advance.category != null && advance.alcohol1 != '' &&  advance.alcohol2 != ''){
    console.log('brand alcohol category')
    filtercategory = advance.category
    filterbrand = advance.brand
    filteralcohol = advance.alcohol1 + ' to ' + advance.alcohol2
    infoadvance = {brand: advance.brand,category: advance.category,alcohol: {$gte: advance.alcohol1, $lte: advance.alcohol2}}
    product  = await Product.find(infoadvance).sort({category: 1});
  }
  else if(advance.brand != null && advance.price1 != '' && advance.price2 != '' && advance.category != null && advance.alcohol1 == '' &&  advance.alcohol2 == ''){
    console.log('brand price category')
    filterbrand = advance.brand
    filtercategory = advance.category
    filterprice = '$'+advance.price1 + ' to ' + '$'+advance.price2 
    infoadvance = {brand: advance.brand,category: advance.category,price: {$gte: advance.price1, $lte: advance.price2}}
    product  = await Product.find(infoadvance).sort({category: 1});
  }
  else if(advance.brand != null && advance.price1 != '' && advance.price2 != '' && advance.category != null && advance.alcohol1 == '' &&  advance.alcohol2 == ''){
    console.log('brand price alcohol')
    filterbrand = advance.brand
    filterprice = '$'+advance.price1 + ' to ' + '$'+advance.price2 
    filteralcohol = advance.alcohol1 + ' to ' + advance.alcohol2
    infoadvance = {brand: advance.brand,price: {$gte: advance.price1, $lte: advance.price2},alcohol: {$gte: advance.alcohol1, $lte: advance.alcohol2}}
    product  = await Product.find(infoadvance).sort({category: 1});
  }
  else if(advance.brand == null && advance.price1 != '' && advance.price2 != '' && advance.category != null && advance.alcohol1 != '' &&  advance.alcohol2 != ''){
    console.log('price category alcohol')
    filterprice = '$'+advance.price1 + ' to ' + '$'+advance.price2 
    filteralcohol = advance.alcohol1 + ' to ' + advance.alcohol2
    filtercategory = advance.category
    infoadvance = {category: advance.category,price: {$gte: advance.price1, $lte: advance.price2},alcohol: {$gte: advance.alcohol1, $lte: advance.alcohol2}}
    product  = await Product.find(infoadvance).sort({category: 1});
  }else if(advance.brand != null && advance.price1 != '' && advance.price2 != '' && advance.category != null && advance.alcohol1 != '' &&  advance.alcohol2 != ''){
    console.log('price category alcohol category')
    filterprice = '$'+advance.price1 + ' to ' + '$'+advance.price2 
    filteralcohol = advance.alcohol1 + ' to ' + advance.alcohol2
    filtercategory = advance.category
    filterbrand = advance.brand
    infoadvance = {brand: advance.brand,category: advance.category,price: {$gte: advance.price1, $lte: advance.price2},alcohol: {$gte: advance.alcohol1, $lte: advance.alcohol2}}
    product  = await Product.find(infoadvance).sort({category: 1});
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
    filteralcohol
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
  res.redirect('/allproduct')
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
    await comment12.save()
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
      name = res.locals.currentUser.username
      infouser = await userss.findById(res.locals.currentUser._id)
      amountcart = await productcart.countDocuments({username: res.locals.currentUser.username});
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
        infouser,
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
        infouser,
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
      const infouser = await userss.findById(res.locals.currentUser._id)
      infouser.cart.push(newProduct._id)
      await infouser.save()
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