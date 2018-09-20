const express = require('express');
const router  = express.Router();
const Establishment = require('../../models/Establishment')
const User = require('../../models/User')
const uploadCloud = require('../../config/cloudinary.js');



/* GET Establishments page */

  router.get('/establishments', (req, res, next) => {
    Establishment.find()
      .then((listOfEstablishments)=>{
        console.log(listOfEstablishments);
        res.locals.bodyClass = 'tanBackground'
        res.render('establishmentViews/index',{theList: listOfEstablishments, theUser: req.session.currentUser})
  })
  .catch((err)=>{
    next(err);
  })

});



router.get('/establishments/new', (req, res, next)=>{
  res.render('establishmentViews/create', {theUser: req.session.currentUser});

})


router.post('/establishments/create', uploadCloud.single('photo'), (req, res, next)=>{



const newEst = new Establishment({
      owner: req.body.owner,
      type: req.body.type,
      name: req.body.name,
      description: req.body.description,
      address: req.body.address,
})

if(req.file){
  newEst.imgPath = req.file.url;
}

newEst.save()
  .then(()=>{
      res.redirect('/establishments')
  })
  .catch(err =>next(err))

});





router.post('/establishments/delete/:id', (req, res, next)=>{

  Establishment.findByIdAndRemove(req.params.id)
  .then((response)=>{
    res.redirect('/establishments')
  })
  .catch((err)=>{
    next(err)
  })
})

router.get('/establishments/edit/:estID', (req, res, next)=>{
  Establishment.findById(req.params.estID)
  .then((theThingIGetBack)=>{
    res.render('establishmentViews/edit', {theEstablishment: theThingIGetBack, theUser: req.session.currentUser })
  })

  .catch((err)=>{
    next(err);
  })

})

router.post('/establishments/update/:estID', uploadCloud.single('photo'), (req, res, next)=>{
  Establishment.findByIdAndUpdate(req.params.estID, {
     name: req.body.updatedName,
     type: req.body.updatedType,
     description: req.body.updatedDescription,
     address: req.body.updatedAddress,
     imgPath: req.file.url

  })
  .then((response)=>{
    res.redirect('/establishments')
  })
  .catch((err)=>{
    next(err)
  })


})

router.post('/establishments/favourite/:theID', (req,res,next)=>{
  
  User.findById(req.session.currentUser._id)
  .then((theUserIGetBack)=>{
    if( theUserIGetBack.establishments.indexOf(req.params.theID) > -1){
      Establishment.findById(req.params.theID)
      .then((theEstIGet)=>{
        req.flash("error", "You've already added this establishment!")
        res.render('establishmentViews/show', {est: theEstIGet, message: req.flash("error")})
      })
      .catch((err)=>{
        next(err);
      })
    }
    else{
      
      Establishment.findById(req.params.theID)
      .then((thePlaceIGet)=>{
        console.log(`=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= ${req.session.currentUser}=-=-=-=-=-=-=-==-=-=-=-=-=`);
        User.findByIdAndUpdate(req.session.currentUser._id, {
          $push: {establishments: thePlaceIGet} 
        }) 
        .populate('Events')
        .populate('Establishments')
        .then((response)=>{
          res.redirect('/establishments')
        })
        .catch((err)=>{
          next(err)
        })
      })
      .catch((err)=>{
        next(err);
      })


    }

  })
  .catch((err)=>{
      next(err);
  })
  
})

router.get('/establishments/rating/:theID', (req,res,next)=>{

    Establishment.findById(req.params.theID)
    .then((theEstThatIGet)=>{
      res.render('establishmentViews/rating', {theEst:theEstThatIGet})
    })
    .catch((err)=>{
      next(err);
    }) 
  })
  
router.post('/establishments/rating/:theID', (req,res,next)=>{

  Establishment.findById(req.params.theID)
  .then((theEstIGet)=>{
    theEstIGet.rating.push(req.body.rating);
    // console.log('after push: ', theEstIGet.rating)
    const theTotalRat = theEstIGet.rating.reduce((a,b) => Number(a)+ Number(b));
    // console.log("theTotalRat: ", theTotalRat)
    theEstIGet.avgRating = (theTotalRat/theEstIGet.rating.length).toFixed(2);
    console.log('after everything: ', theEstIGet);
    theEstIGet.save()
    .then(() => {
      res.redirect('/establishments')
    })
    .catch(err => next(err))
  })
  .catch((err)=>{
    next(err);
  })


})


router.post('/estList/delete/:id', (req, res, next) => {
  User.findById(req.user.id)
  .then((theUserIGet)=>{
      let index = theUserIGet.establishments.indexOf(req.params.id);
      theUserIGet.establishments.splice(index, 1);
      theUserIGet.save()

      .then((resp)=>{
        res.redirect('/establishments')
      })
      .catch(err=>next(err))
    })
  .catch((err)=>{
      next(err)
  })

})


router.get('/establishments/:theid', (req, res, next)=>{

  Establishment.findById(req.params.theid)
  .then((theEstablishment)=>{
  //   res.locals.
    res.render('establishmentViews/show', {est: theEstablishment, theUser: req.session.currentUser})
  })
  .catch((err)=>{
     next(err);
  })

})


// router.get('/fancypage', (req, res, next)=>{
//   res.render('estViews/fancy.hbs')
// })




module.exports = router;