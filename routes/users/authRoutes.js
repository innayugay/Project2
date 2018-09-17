const express      = require('express');
const router       = express.Router();
const bcrypt       = require("bcryptjs");
const bcryptSalt   = 10;
const User         = require('../../models/User');
const passport     = require('passport');
const ensureLogin  = require("connect-ensure-login");

/* GET home page */



router.get("/signup", (req, res, next) => {
  res.render("userViews/signup");
});



router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    req.flash('error', 'please specify a username and password to sign up')
    res.render("userViews/signup", { message: req.flash("error"), layout: false });
    return;
  }

  User.findOne({ username })
  .then(user => {
    if (user !== null) {
      res.render("userViews/signup", { message: req.flash("error") });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    User.create({
        username: username,
        password: hashPass
    })
    .then((response)=>{
      res.redirect("/");
    })
    .catch((err)=>{
      res.render("userViews/signup", { message: req.flash("error") });
    })
  })
  .catch(error => {
    next(error)
  })
});


router.get('/login', (req, res, next)=>{
    res.render('userViews/login', {message: req.flash('error')})
})

router.post('/login', passport.authenticate('local', {
  successRedirect: "/private",
  failureRedirect: "/login",
  failureFlash: true,
  successFlash: true,
  passReqToCallback: true
}));

router.get('/private' , ensureLogin.ensureLoggedIn('/signup'),(req, res, next)=>{
  console.log(req.user);
  res.render('userViews/private', {message: req.flash('success'), theUser: req.user})
})


router.get('/profile/:theID' , ensureLogin.ensureLoggedIn('/signup'),(req, res, next)=>{
  console.log(req.user.username);
  User.findById(req.params.theID)
  .then((theUserIGet)=>{
    res.render('userViews/profile', {message: req.flash('success'), theUser: theUserIGet})
  })
  .catch((err)=>{
    next(err);
  })
})

router.get('/logout', (req, res, next)=>{
    req.logout()
  res.redirect('/')
})




module.exports = router;