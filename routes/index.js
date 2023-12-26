var express = require('express');
var router = express.Router();

var UsersModel = require('../models/UsersModel');




/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.logged && req.session.role == "admin"){
    res.redirect('/toys');
  }else if(req.session.logged){
    res.redirect('/customers');
  }else{
    res.redirect('/dangnhap');
  }

});




router.get('/dangnhap', function(req, res, next) {
  res.render('auths/dangNhap');
});


router.post('/dangnhap',async function(req, res, next) {
  var users = await UsersModel.find({});  // trả về một mảng các đối tượng là các bản ghi trong mongoDB đại diện bởi UsersModel
  var username = req.body.username;
  var password = req.body.password;
  var role;
  var x = false;

  for(var i = 0; i < users.length; i++) {
    if(users[i].username == username && users[i].password == password) {
      x = true;
      role = users[i].role;
      break;
    }
  }
  if(x == true) {
    req.session.logged = username;//tạo session tên logged có giá trị bằng username
    req.session.role = role;
    res.redirect('/');
    
  }else{
    res.redirect('/dangnhap');
  }

});





router.get('/dangki', function(req, res, next) {
  res.render('auths/dangKi');
});

router.post('/dangki', async function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var passwordAgain = req.body.passwordAgain;
  var users = await UsersModel.find({});

  var x=0;
  for(var i = 0; i < users.length; i++){
    if(users[i].username == username){
      x=1;
      break;
    }
  }

  if(passwordAgain == password && x == 0){
    await UsersModel.create({
      username: username,
      password: password,
      role: "user"
    });
    req.session.logged = username;
    req.session.role = "user";


    
    res.redirect('/');
    
  }
  else{
     res.redirect('/dangki');
  }
});



router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
})


module.exports = router;
