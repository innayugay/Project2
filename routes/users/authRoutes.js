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

// router.post('/login', passport.authenticate('local', {
//   // successRedirect: "/private",
//   // failureRedirect: "/login",
//   // failureFlash: true,
//   // successFlash: true,
//   // passReqToCallback: true
// }));

router.post('/login',
  passport.authenticate('local'),
  function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
  const un = req.body.username;
  const ps = req.body.password;

  if(un === "" || ps === ""){
    res.render('login', {errorMessage: "invalid"})
    return;
  }
  User.findOne({"username": un})
  .then((theUser)=>{
    if(!theUser){
      // console.log("-=-=-=-=--=-=-=-=-=-=-=- NO USEr")
      res.render('login', {errorMessage:"this username doesn't exist"})
      return;
    }
    if (bcrypt.compareSync(ps, theUser.password)) {
      req.session.currentUser = theUser;
      console.log("session info ======================", req.session.currentUser.username);
      res.render("userViews/private", {theUser: theUser});
      console.log('=-=-=-=-=-==- Session Started', theUser)
    } else {
      res.render("userViews/login", {
        errorMessage: "Incorrect password"
      });
    }
  })
  .catch((err)=>{
    next(err);
  })
    
  });


// router.get('/private' , ensureLogin.ensureLoggedIn('/login'),(req, res, next)=>{
//   // let theUser= req.user
//   console.log(currentUser + " CURRRENT USERRRRRRRRR");
//   res.render('userViews/private', {message: req.flash('success'), currentUser})
// });

router.get('/profile/edit/:theID', (req, res, next)=>{
  User.findById(req.params.theID)
  .then((theUserIGet)=>{
    res.render('userViews/edit', {theUser: theUserIGet})
  })
  .catch((err)=>{
    next(err)
  })
})

router.get('/profile/:theID' , ensureLogin.ensureLoggedIn('/signup'),(req, res, next)=>{
  // console.log(req.user.username);
  User.findById(req.params.theID)
  .populate('events')
  .populate('establishments')
  .then((theUserIGet)=>{
    console.log("----------------------------", theUserIGet.events)
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