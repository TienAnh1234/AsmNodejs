var express = require('express');
const CategoriesModel = require('../models/CategoriesModel');
const ToysModel = require('../models/ToysModel');
const CartModel = require('../models/CartModel');


var router = express.Router();


router.get('/', async function (req, res, next) {
    var user = req.session.logged
    var toys = await ToysModel.find({}).populate('category');
    var categories = await CategoriesModel.find({});
    res.render('customer/index',{toys:toys, categories:categories, user: user});
});

router.post('/search', async function(req, res, next) {
    var keyword = req.body.keyword;
    var toys = await ToysModel.find({name: new RegExp(keyword, "i")})
      var categories = await CategoriesModel.find({});
      res.render('customer/index',{toys: toys, categories: categories, user: user});
  });
  
  router.get('/sort/asc', async function(req, res, next) {
    var user = req.session.logged
    var toys = await ToysModel.find({}).populate('category').sort({price:1});
    var categories = await CategoriesModel.find({});
    res.render('customer/index',{toys:toys, categories: categories, user: user});
  });
  
  router.get('/sort/desc', async function(req, res, next) {
    var user = req.session.logged
    var toys = await ToysModel.find({}).populate('category').sort({price:-1});
    var categories = await CategoriesModel.find({});
    res.render('customer/index',{toys: toys, categories: categories, user: user});
  });

  router.get('/detail/:id', async function(req, res, next) {
    var user = req.session.logged
    var id = req.params.id;
    var toys = await ToysModel.find({category : id}).populate('category');
    var categories = await CategoriesModel.find({});
    res.render('customer/index',{toys: toys, categories: categories, user: user});
  });


  router.get('/addToCart/:id', async function(req, res, next) {
    var id = req.params.id;
    var cart = await CartModel.find({toy : id, user : req.session.logged}).populate('category').populate('toy');
    var toy = await ToysModel.findById(id);
    if(cart.length ==  0){
      CartModel.create({
        toy: id,
        category : toy.category,
        quantity : 1,
        user: req.session.logged,
        price : toy.price
      })
    }else{
      var id1 = cart[0]._id;
      var newQuantity = cart[0].quantity + 1;
      var newPrice = newQuantity*(cart[0].toy.price);

      await CartModel.findByIdAndUpdate(id1,{
        toy: id,
        category : cart[0].category,
        quantity : newQuantity,
        user: req.session.logged,
        price : newPrice
      });
      // console.log(cart[0].toy);
      // console.log(cart[0].toy._id);
    }
    res.redirect('/');
  });


  router.get('/cart', async function(req, res, next) {
   var user = req.session.logged

   var carts = await CartModel.find({ user : user}).populate('toy').populate('category');

   res.render('customer/cart',{carts: carts, user: user});

  });

  router.get('/delete1cart/:id', async function(req, res, next) {
    var id = req.params.id;
    await CartModel.findByIdAndDelete(id);
    res.redirect('/customers/cart');
   });

module.exports = router;
