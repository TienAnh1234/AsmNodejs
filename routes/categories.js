var express = require('express');
const CategoriesModel = require('../models/CategoriesModel');
const ToysModel = require('../models/ToysModel');
const CartModel = require('../models/CartModel');
const CountryModel = require('../models/CountryModel');
var router = express.Router();

// url: .../categories/
router.get('/', async function (req, res, next) {
    var categories = await CategoriesModel.find({});
    res.render('categories/index', { categories: categories });
});




// url: .../categories/add
router.get('/add', async function (req, res, next) {
    var countrys = await CountryModel.find({});
    res.render('categories/add',{ countrys: countrys});
});

router.post('/add', async function (req, res, next) {
    var category = req.body;

    await CategoriesModel.create(category);
    res.redirect('/categories');// đường dẫn đầy đủ
});

// url: .../categories/edit/"id_catrgory"
router.get('/edit/:id', async function (req, res, next) {
    var id = req.params.id;
    var category = await CategoriesModel.findById(id);
    
    res.render('categories/edit', { category: category });
});

router.post('/edit/:id', async function (req, res, next) {
    var id = req.params.id;
    var brand = req.body;
    try {
        await CategoriesModel.findByIdAndUpdate(id, brand);
        console.log('Updated successfully');
        res.redirect('/categories');
    }
    catch (err) {
        console.log('Updated failedly ' + err);
        res.redirect('/categories');
    }
});


// url: .../categories/delete/"id_catrgory"
router.get('/delete/:id', async function (req, res, next) {
    try {
        var id = req.params.id;
        var toys = await ToysModel.find({category : id}).populate('category');
        var carts = await CartModel.find({category : id}).populate('category');
        for(var i = 0; i <toys.length; i++){
            await ToysModel.deleteOne(toys[i]); 
            //console.log('hanoi'); 
        }
        for(var i = 0; i <carts.length; i++){
            await CartModel.deleteOne(carts[i]); 

        }
        await CategoriesModel.findByIdAndDelete(id);


        res.redirect('/categories');
    } catch (err) {
        console.log("Delete category failedly: " + err);
        res.redirect('/categories');
    }
});

router.get('/deleteAll', async function(req, res, next) {
    await CategoriesModel.deleteMany()  // dùng để xóa toàn bộ bản ghi trong bảng
    await ToysModel.deleteMany() 
    await CartModel.deleteMany() 
    console.log("Delete all categories successfully ");
    res.redirect('/categories');
});


router.get('/detail/:id', async function(req, res, next) {
    var id = req.params.id;
    var toys = await ToysModel.find({category : id}).populate('category');
    var categories = await CategoriesModel.find({});
    res.render('toys/index',{toys: toys, categories: categories});
  });


  router.get('/addCountry', async function(req, res, next) {
    res.render('categories/addCountry');
  });


  router.post('/addCountry', async function(req, res, next) {
    var country = req.body;

    await CountryModel.create(country);
    res.redirect('/categories');// đường dẫn đầy đủ

  });

module.exports = router;
