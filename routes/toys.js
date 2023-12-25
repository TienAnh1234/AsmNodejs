var express = require('express');
const CategoriesModel = require('../models/CategoriesModel');
const ToysModel = require('../models/ToysModel');
const CartModel = require('../models/CartModel');
var router = express.Router();

// upload file ảnh
var cloudinary = require('../configs/cloudinaryconfig');
var multer = require('multer');
var {CloudinaryStorage} = require('multer-storage-cloudinary');
var storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    folder: "BANK",
    allowFormats:['jpg','png','jpeg'],
    transformation:[{width:500, height:500,crop:'limit'}],

});
var upload = multer({
  storage:storage
});


// url: .../toys/
router.get('/', async function (req, res, next) {
    var toys = await ToysModel.find({}).populate('category');
    var categories = await CategoriesModel.find({});
    res.render('toys/index',{toys:toys, categories:categories});
});


// url: .../toys/add
router.get('/add', async function (req, res, next) {
    var categories = await CategoriesModel.find({});
    res.render('toys/add',{categories: categories});
});

router.post('/add',upload.single('image') ,async function(req, res, next) {
    //var toy = req.body;
    await ToysModel.create({
      name : req.body.name,
      image : req.file.path,
      manufacture : req.body.manufacture,
      material : req.body.material,
      category : req.body.category,
      price : req.body.price
    });

    res.redirect('/toys');// đường dẫn đầy đủ
});



// url: .../toys/edit/"id_catrgory"
router.get('/edit/:id', async function (req, res, next) {
    var id = req.params.id;
    var categories = await CategoriesModel.find({});
    var toy = await ToysModel.findById(id);
    res.render('toys/edit', { toy: toy, categories: categories });
});

router.post('/edit/:id',upload.single('image'), async function(req, res, next) {
    var id = req.params.id;
    var image12 = req.body.image;

    if(req.file) {  // kiểm tra file có tồn tại không
      image12 = req.file.path
      // console.log("hanoi");
    }
    
  try{
    await ToysModel.findByIdAndUpdate(id,{
      name : req.body.name,
      image : image12,
      manufacture : req.body.manufacture,
      material : req.body.material,
      category : req.body.category,
      price : req.body.price
    });
    console.log('Updated successfully');
    res.redirect('/toys');
  }
  catch(err){
    console.log('Updated failedly ' +err );
    res.redirect('/toys');

  }
});


// url: .../toys/delete/"id_catrgory"
router.get('/delete/:id', async function (req, res, next) {
    try {
        var id = req.params.id;
        var carts = await CartModel.find({toy : id}).populate('category').populate('toy');
        for(var i = 0; i <carts.length; i++){
          await CartModel.deleteOne(carts[i]); 
      }
        await ToysModel.findByIdAndDelete(id);
        res.redirect('/toys');
    } catch (err) {
        console.log("Delete brand failedly: " + err);
        res.redirect('/toys');
    }
});



router.get('/deleteAll', async function(req, res, next) {
    await ToysModel.deleteMany()  // dùng để xóa toàn bộ bản ghi trong bảng
    await CartModel.deleteMany();
    console.log("Delete all categories successfully ");
    res.redirect('/toys');
});
  

router.post('/search', async function(req, res, next) {
  var keyword = req.body.keyword;
  var toys = await ToysModel.find({name: new RegExp(keyword, "i")})
    var categories = await CategoriesModel.find({});
    res.render('toys/index',{toys: toys, categories: categories});
});

router.get('/sort/asc', async function(req, res, next) {
  var toys = await ToysModel.find({}).populate('category').sort({price:1});
  var categories = await CategoriesModel.find({});
  res.render('toys/index',{toys:toys, categories: categories});
});

router.get('/sort/desc', async function(req, res, next) {
  var toys = await ToysModel.find({}).populate('category').sort({price:-1});
  var categories = await CategoriesModel.find({});
  res.render('toys/index',{toys: toys, categories: categories});
});


router.get('/addCountry', async function(req, res, next) {
  res.render('toys/index',{toys: toys, categories: categories});
});

module.exports = router;