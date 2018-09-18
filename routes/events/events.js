const express = require('express');
const router  = express.Router();
const Event = require('../../models/Event')
const User = require('../../models/User')
// const passport     = require('passport');
const uploadCloud = require('../../config/cloudinary.js');
// passport.authorize();


/* GET Establishments page */

  router.get('/events', (req, res, next) => {
    Event.find()
      .then((theThingIGetBack)=>{
        // console.log(`=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= ${theThingIGetBack}`);
        res.render('eventViews/index',{theList: theThingIGetBack})
  })
  .catch((err)=>{
    next(err);
  })

});



router.get('/events/new', (req, res, next)=>{
  res.render('eventViews/create');

})


router.post('/events/create', uploadCloud.single('photo'), (req, res, next)=>{

  // const imgPath = req.file.url;
  // const imgName = req.file.originalname;

  Event.create({
     name: req.body.name,
     type: req.body.type,
     description: req.body.description,
     date: req.body.date,
     imgPath: req.file.url
  })
  .then((response)=>{
      res.redirect('/events')
  })
  .catch((err)=>{
      next(err);
  })

});





router.post('/events/delete/:id', (req, res, next)=>{

  Event.findByIdAndRemove(req.params.id)
  .then((response)=>{
    res.redirect('/events')
  })
  .catch((err)=>{
    next(err)
  })
})

router.get('/events/edit/:estID', (req, res, next)=>{
  Event.findById(req.params.estID)
  .then((theThingIGetBack)=>{
    res.render('eventViews/edit', {theEvent: theThingIGetBack })
  })

  .catch((err)=>{
    next(err);
  })

})

router.post('/events/update/:estID', (req, res, next)=>{
  Event.findByIdAndUpdate(req.params.estID, {
     name: req.body.updatedName,
     type: req.body.updatedType,
     description: req.body.updatedDescription,
     date: req.body.updatedDate
    //  address: req.body.updatedAddress,

  })
  .then((response)=>{
    res.redirect('/events')
  })
  .catch((err)=>{
    next(err)
  })


})


router.post('/events/interested/:theID', (req,res,next)=>{
  
  Event.findById(req.params.theID)
  .then((theEventIGet)=>{
    console.log(`=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= ${req.session.currentUser}=-=-=-=-=-=-=-==-=-=-=-=-=`);
    User.findByIdAndUpdate(req.session.currentUser._id, {
      $push: {events: theEventIGet} 
    }) 
    .populate('Events')
    .populate('Establishments')
    .then((response)=>{
      res.redirect('/events')
    })
    .catch((err)=>{
      next(err)
    })
  })
  .catch((err)=>{
    next(err);
  })
})


router.get('/events/:theid', (req, res, next)=>{

  Event.findById(req.params.theid)
  .populate('Users')
  .populate('Establishments')
  .then((theThingIGetBack)=>{
    res.render('eventViews/show', {event: theThingIGetBack})
  })
  .catch((err)=>{
     next(err);
  })

})


// router.get('/fancypage', (req, res, next)=>{
//   res.render('estViews/fancy.hbs')
// })




module.exports = router;