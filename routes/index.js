var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'CV Generator' });
});
router.get('/loggedin', function(req, res, next) {
  console.log(req.user);
  if (req.isAuthenticated()) {
    res.render('loggedin', { user: req.user });
  } else {
    res.redirect('/');
  }
});
router.get('/results', function(req, res, next) {
  if (req.isAuthenticated()) {
    res.render('results', { user: req.user, generatedCV: req.generatedCV });
  } else {
    res.redirect('/');
  }
});

router.post('/generate-cv', async function(req, res, next) {
  if (!req.isAuthenticated()) {
    res.redirect('/');
    return;
  }

  // Call the OpenAI API here to generate the CV.
  try {
    const openai = require('openai');
    openai.apiKey = process.env.OPENAI_API_KEY;

    const prompt = `Generate a CV based on the following LinkedIn data:\n\n${JSON.stringify(req.user, null, 2)}\n\nGenerated CV:\n`;

    const response = await openai.Completion.create({
      engine: 'text-davinci-002',
      prompt: prompt,
      max_tokens: 150,
      n: 1,
      stop: null,
      temperature: 0.8,
    });

    req.generatedCV = response.choices[0].text.trim();
    res.redirect('/results');
  } catch (error) {
    console.error('Error generating CV:', error);
    res.redirect('/loggedin');
  }
});



module.exports = router;
