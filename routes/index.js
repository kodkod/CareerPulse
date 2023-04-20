var express = require('express');
var router = express.Router();

const generateCV = require('../generateCV');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'CV Generator' });
});
router.get('/loggedin', function(req, res, next) {
  //console.log(req.user);
  if (req.isAuthenticated()) {
    res.render('loggedin', { user: req.user });
  } else {
    res.redirect('/');
  }
});
router.get('/results', function(req, res, next) {
  if (req.isAuthenticated()) {
    const generatedCV = req.session.generatedCV;
    res.render('results', { user: req.user, generatedCV: generatedCV });
  } else {
    res.redirect('/');
  }
});


router.post('/store-cv', function(req, res, next) {
  req.session.generatedCV = req.body.generatedCV;
  res.status(200).send();
});

router.post('/generate-cv', async function(req, res, next) {
  if (!req.isAuthenticated()) {
    res.redirect('/');
    return;
  }

  const cvText = req.body['cv-text'];

  if (!cvText) {
    res.status(400).send("CV text is required");
    return;
  }

  console.log("here");
  try {
    const generatedCV = await generateCV(cvText);
    res.render('results', { user: req.user, generatedCV: generatedCV });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate CV' });
  }
});



module.exports = router;
