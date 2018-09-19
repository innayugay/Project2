const express = require('express');
const router  = express.Router();
const Event = require('../../models/Event')
const User = require('../../models/User')
// const passport     = require('passport');
const uploadCloud = require('../../config/cloudinary.js');
let blah = 0;
// passport.authorize();


/* GET Establishments page */

  router.get('/events', (req, res, next) => {
    Event.find()
      .then((theThingIGetBack)=>{
        // console.log(`=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= ${theThingIGetBack}`);
        res.locals.bodyClass = 'tanBackground'
        res.render('eventViews/index',{theList: theThingIGetBack, theUser: req.session.currentUser})
  })
  .catch((err)=>{
    next(err);
  })

});



router.get('/events/new', (req, res, next)=>{
  res.render('eventViews/create', {theUser: req.session.currentUser});

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
    res.render('eventViews/edit', {theEvent: theThingIGetBack, theUser: req.session.currentUser })
  })

  .catch((err)=>{
    next(err);
  })

})

router.post('/events/update/:estID', uploadCloud.single('photo'), (req, res, next)=>{
  Event.findByIdAndUpdate(req.params.estID, {
     name: req.body.updatedName,
     type: req.body.updatedType,
     description: req.body.updatedDescription,
     date: req.body.updatedDate,
     imgPath: req.file.url
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
    
      if(  theEventIGet.attendees.indexOf(req.user._id) > -1 ){
        // console.log("=-=-=-=-==-=-=-=-=-= THE USER IS ALREADY THERE =-=-=-=-=-=-=-=-=-=-");
        req.flash("error", "You've already added this event!")
        res.render('eventViews/show', {event: theEventIGet, message: req.flash("error"), theUser: req.session.currentUser});
        // res.redirect('/events')
      }
      else{
        // console.log("the user is not in the list. !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! ");
        Event.findById(req.params.theID)
        .then((theEventIGet)=>{
          
          User.findByIdAndUpdate(req.session.currentUser._id, {
            $push: {events: theEventIGet} 
          }) 
          .populate('Events')
          .populate('Establishments')
          .then((response)=>{
            blah ++
            res.redirect('/events')
          })
          .catch((err)=>{
            next(err)
          })
        })
        .catch((err)=>{
          next(err);
        })
      
        User.findByIdAndUpdate(req.session.currentUser._id)
        .then((theUserIGet)=>{
            Event.findByIdAndUpdate(req.params.theID,{
              $push: {attendees: theUserIGet}
            })
            .populate('attendees')
            .then((response)=>{
              res.redirect('/events')
            })
            .catch((err)=>{
              next(err);
            })
        })
        .catch((err)=>{
          next(err);
        });
      }
  
    })
  })



router.get('/events/:theid', (req, res, next)=>{

  Event.findById(req.params.theid)
  .populate('attendees')
  .populate('establishments')
  .then((theThingIGetBack)=>{
    res.render('eventViews/show', {event: theThingIGetBack, theUser: req.session.currentUser})
  })
  .catch((err)=>{
     next(err);
  })

})

router.get('/events/:theid/attendees', (req, res, next)=>{

  Event.findById(req.params.theid)
  .populate('attendees')
 
  .then((theThingIGetBack)=>{
    res.render('eventViews/attendees', {event: theThingIGetBack, theUser: req.session.currentUser})
  })
  .catch((err)=>{
     next(err);
  })

})




module.exports = router;