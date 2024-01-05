var express = require('express');

const CategoriesModel = require('../models/CategoriesModel');
const ToysModel = require('../models/ToysModel');
const OrderModel = require('../models/OrderModel');


var router = express.Router();


router.get('/', async function (req, res, next) {
  var user = req.session.logged
  var toys = await ToysModel.find({}).populate('category');
  var categories = await CategoriesModel.find({});
  res.render('customer/index', { toys: toys, categories: categories, user: user });
});

router.post('/search', async function (req, res, next) {
  var user = req.session.logged

  var keyword = req.body.keyword;
  var toys = await ToysModel.find({ name: new RegExp(keyword, "i") })
  var categories = await CategoriesModel.find({});
  res.render('customer/index', { toys: toys, categories: categories, user: user });
});

router.get('/sort/asc', async function (req, res, next) {
  var user = req.session.logged
  var toys = await ToysModel.find({}).populate('category').sort({ price: 1 });
  var categories = await CategoriesModel.find({});
  res.render('customer/index', { toys: toys, categories: categories, user: user });
});

router.get('/sort/desc', async function (req, res, next) {
  var user = req.session.logged
  var toys = await ToysModel.find({}).populate('category').sort({ price: -1 });
  var categories = await CategoriesModel.find({});
  res.render('customer/index', { toys: toys, categories: categories, user: user });
});

router.get('/detail/:id', async function (req, res, next) {
  var user = req.session.logged
  var id = req.params.id;
  var toys = await ToysModel.find({ category: id }).populate('category');
  var categories = await CategoriesModel.find({});
  res.render('customer/index', { toys: toys, categories: categories, user: user });
});


router.get('/addToOrder/:id', async function (req, res, next) {
  var id = req.params.id;
  var order = await OrderModel.find({ toy: id, user: req.session.logged }).populate('category').populate('toy');
  var toy = await ToysModel.findById(id);
  if (order.length == 0) {
    OrderModel.create({
      toy: id,
      category: toy.category,
      quantity: 1,
      user: req.session.logged,
      price: toy.price
    })
  } else {
    var id1 = order[0]._id;
    var newQuantity = order[0].quantity + 1;
    var newPrice = newQuantity * (order[0].toy.price);

    await OrderModel.findByIdAndUpdate(id1, {
      toy: id,
      category: order[0].category,
      quantity: newQuantity,
      user: req.session.logged,
      price: newPrice
    });

  }
  res.redirect('/');
});


router.get('/addToOrderFromCart/:id/:quantity', async function (req, res, next) {
  var newCart =  [];
  var user = req.session.logged
  var id = req.params.id;
  var quantity =parseInt(req.params.quantity, 10);
  var order = await OrderModel.find({ toy: id, user: req.session.logged }).populate('category').populate('toy');
  var toy = await ToysModel.findById(id);
  if (order.length == 0) {
    OrderModel.create({
      toy: id,
      category: toy.category,
      quantity: quantity,
      user: req.session.logged,
      price: (toy.price)*quantity
    })

    for(var i = 0 ; i < req.cookies.cartAll.length; i++){
      if(req.cookies.cartAll[i].user == user && req.cookies.cartAll[i].id == id  
        && req.cookies.cartAll[i].quantity == quantity){
          continue;
      } 
      newCart.push(req.cookies.cartAll[i]);
    }
    res.cookie('cartAll', newCart, { maxAge: 900000, httpOnly: true })

  } else {
    var id1 = order[0]._id;
    var newQuantity = order[0].quantity + quantity;
    var newPrice = newQuantity * (order[0].toy.price);

    await OrderModel.findByIdAndUpdate(id1, {
      toy: id,
      category: order[0].category,
      quantity: newQuantity,
      user: req.session.logged,
      price: newPrice
    });

    for(var i = 0 ; i < req.cookies.cartAll.length; i++){
      if(req.cookies.cartAll[i].user == user && req.cookies.cartAll[i].id == id  
        && req.cookies.cartAll[i].quantity == quantity){
          continue;
      } 
      newCart.push(req.cookies.cartAll[i]);
    }
    res.cookie('cartAll', newCart, { maxAge: 900000, httpOnly: true })

  }
  res.redirect('/');
});

router.get('/order', async function (req, res, next) {
  var user = req.session.logged

  var orders = await OrderModel.find({ user: user }).populate('toy').populate('category');

  var totalAll = 0;
  for (var i = 0; i < orders.length; i++) {
    totalAll += orders[i].price;
  }

  res.render('customer/order', { orders: orders, user: user, totalAll: totalAll });

});

router.get('/delete1order/:id', async function (req, res, next) {
  var id = req.params.id;
  await OrderModel.findByIdAndDelete(id);
  res.redirect('/customers/order');
});









router.get('/addToCartReal/:id', function (req, res, next) {
  var check = false;
  var idProduct = req.params.id;
  var userCart = req.session.logged;

  var cart1 = {
    id: idProduct,
    user: userCart,
    quantity: 1
  }

  if (!req.cookies.cartAll) {

    res.cookie('cartAll', [cart1], { maxAge: 900000, httpOnly: true })

    res.redirect('/');

  } else {

    for (var i = 0; i < req.cookies.cartAll.length; i++) {
      if (idProduct == req.cookies.cartAll[i].id && userCart == req.cookies.cartAll[i].user) {
        req.cookies.cartAll[i].quantity++;
        check = true;
        res.cookie('cartAll', req.cookies.cartAll, { maxAge: 900000, httpOnly: true })
        break;
      }
    }

    if (check == false) {
      var arr = req.cookies.cartAll
      arr.push(cart1);
      res.cookie('cartAll', arr, { maxAge: 900000, httpOnly: true })
    }
    res.redirect('/');


  }

});




router.get('/cart', async function (req, res, next) {
  var user = req.session.logged;
  var yourcart = [];

  var toy;
  var obj;
  
  if(!req.cookies.cartAll) {

    res.redirect('/');


  }else{

    for(var i = 0 ; i < req.cookies.cartAll.length; i++){
      if(req.cookies.cartAll[i].user == user){
        toy = await ToysModel.findById(req.cookies.cartAll[i].id).populate('category');

        obj ={
          toy: toy,
          quantity: req.cookies.cartAll[i].quantity,
          user: req.cookies.cartAll[i].user
        }
        yourcart.push(obj);
  
      } 
    }

    res.render('customer/cart', {  yourcart: yourcart, user: user });
  }

});


router.get('/delete1cart/:id/:user/:quantity',  function (req, res, next) {
  var user = req.params.user;
  var id = req.params.id;
  var quantity = req.params.quantity;
  var newCart =  [];

  for(var i = 0 ; i < req.cookies.cartAll.length; i++){
    if(req.cookies.cartAll[i].user == user && req.cookies.cartAll[i].id == id  
      && req.cookies.cartAll[i].quantity == quantity){
        continue;
    } 
    newCart.push(req.cookies.cartAll[i]);
  }

  res.cookie('cartAll', newCart, { maxAge: 900000, httpOnly: true })

  res.redirect('/customers/cart');

});



module.exports = router;
