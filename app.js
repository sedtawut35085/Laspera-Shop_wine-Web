const mongoose = require("mongoose");
const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const userss = require('./models/user')
const passport = require("passport")
const LocalStrategy = require("passport-local")

var IndexRoutes = require('./routes/index')
var AccountRoutes = require('./routes/account')
var CartRoutes = require('./routes/cart')
// var StoreRoutes = require('./routes/store')

app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'));
app.use(express.static(__dirname + 'public'))
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));

app.use(require('express-session')({
  secret: 'secret is always secret.',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(userss.authenticate()))
passport.serializeUser(userss.serializeUser())
passport.deserializeUser(userss.deserializeUser())

app.use(async function(req,res,next){
  res.locals.currentUser = req.user;
  next();
});

mongoose.connect("mongodb://localhost:27017/project",function(err,dbs){
    console.log('mongo connect')
});

app.use('/',IndexRoutes)
app.use('/account',AccountRoutes)
app.use('/cart',CartRoutes)
// app.use('/store',StoreRoutes)

app.listen(3000,()=>{
    console.log('server running')
})

  

  

