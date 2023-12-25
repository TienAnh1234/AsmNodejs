const checkLoginAdmin = (req, res, next) => {
    if (req.session.logged && req.session.role === 'admin') {
       next();
    } else {
       res.redirect('/dangnhap');
    }
 }

 const checkLogin = (req, res, next) => {
   if (req.session.logged && req.session.role === 'user') {
      next();
   } else {
      res.redirect('/dangnhap');
   }
}


 


 module.exports = {
    checkLoginAdmin,
    checkLogin
    // checkMultipleSession
 }
