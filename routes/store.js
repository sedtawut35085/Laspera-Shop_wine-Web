// var express = require('express'),
//     router = express.Router({mergeParams: true}),
//     userss = require('../models/user'),
//     creditcards = require('../models/creditcard'),
//     productcart = require("../models/productcart"),
//     Product = require('../models/product'),
//     comment = require("../models/comments"),
//     passport = require("passport");

// let alert = require('alert'); 

// router.post('/advance', async(req,res)=>{
//     console.log(req.body)
//     console.log(req.body.brand)
//     console.log(req.body.brand[0])
//     console.log(req.body.price1)
//     const product  = await Product.find({category: {'$regex' : checkcategory, '$options' : 'i'}}).sort({"name":1});
//     res.render("allproduct.ejs", {
//         product,
//         name: name,
//         amountcart: amountcart,
//         sortname: sortname,
//         page : page  
//       });
//   })

//   module.exports = router;