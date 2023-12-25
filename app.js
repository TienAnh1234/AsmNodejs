var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// thêm middlewares cần sử dụng
const { checkLoginAdmin } = require('./middlewares/auth');
const { checkLogin } = require('./middlewares/auth');



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var categoriesRouter = require('./routes/categories');
var toysRouter = require('./routes/toys');
var customerRouter = require('./routes/customer');





const session = require("express-session");

var app = express();

app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false,
}));


// dùng để tải ảnh
app.use(express.json());

//cấu hình kết nối với mongoDB
var mongoose = require("mongoose");
var uri = "mongodb+srv://anhdtgch211417:001202000220@cluster0.dnbucqu.mongodb.net/ToyStore";
mongoose.connect(uri)
.then(() => console.log ("Connect to DB succeed !"))
.catch((err) => console.log (err));

// cấu hình body-parser dùng để nhập liệu và lấy dữ liệu từ form
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended : false}))

// cấu hình handlebars 
var hbs = require('hbs');
hbs.registerHelper('equal', require('handlebars-helper-equal'))

hbs.registerHelper('equal', require('handlebars-helper-equal'))
hbs.registerHelper('eq', function(a, b) {
  return a === b;
});
hbs.registerHelper('gt', function(a, b) {
  return a > b;
});
hbs.registerHelper('lt', function(a, b) {
  return a < b;
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/categories',checkLoginAdmin, categoriesRouter);
app.use('/toys', checkLoginAdmin, toysRouter);
app.use('/customers',checkLogin, customerRouter);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


const port = process.env.PORT || 3001;  // thiết lập lại port để có thể đẩy lên render chạy online web
const host = 'localhost';

app.listen(port, ()=>{
  console.log('server is running at http://'+host+':'+port)
})

module.exports = app;
