const express = require('express');
const router  = express.Router();
const Establishment = require('../../models/Establishment')
// const uploadCloud = require('../config/cloudinary.js');


/* GET Establishments page */

  router.get('/establishments', (req, res, next) => {
    Establishment.find()
      .then((listOfEstablishments)=>{
        console.log(listOfEstablishments);
        res.render('establishmentViews/index',{theList: listOfEstablishments})
  })
  .catch((err)=>{
    next(err);
  })

});



router.get('/establishments/new', (req, res, next)=>{
  res.render('establishmentViews/create');

})


router.post('/establishments/create', (req, res, next)=>{

  // const imgPath = req.file.url;
  // const imgName = req.file.originalname;

  Establishment.create({
      owner: req.body.owner,
      // imgPath: req.file.url,
      type: req.body.type,
      name: req.body.name,
      description: req.body.description,
      address: req.body.address,
      // rating: req.body.,
      image: req.body.imageURL,
      // imgName: req.file.originalname
  })
  .then((response)=>{
      res.redirect('/establishments')
  })
  .catch((err)=>{
      next(err);
  })

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
    res.render('establishmentViews/edit', {theEstablishment: theThingIGetBack })
  })

  .catch((err)=>{
    next(err);
  })

})

router.post('/establishments/update/:estID', (req, res, next)=>{
  Establishment.findByIdAndUpdate(req.params.estID, {
     name: req.body.updatedName,
     type: req.body.updatedType,
     description: req.body.updatedDescription,
     address: req.body.updatedAddress,

  })
  .then((response)=>{
    res.redirect('/establishments')
  })
  .catch((err)=>{
    next(err)
  })


})


router.get('/establishments/:theid', (req, res, next)=>{

  Establishment.findById(req.params.theid)
  .then((theEstablishment)=>{
    res.render('establishmentViews/show', {est: theEstablishment})
  })
  .catch((err)=>{
     next(err);
  })

})


// router.get('/fancypage', (req, res, next)=>{
//   res.render('estViews/fancy.hbs')
// })




module.exports = router;