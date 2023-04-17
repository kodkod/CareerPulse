var express = require('express');
var router = express.Router();


/* GET users listing. */
router.get('/linkedin',
//   passport.authenticate('linkedin', { state: 'SOME STATE' }),
  function(req, res){
    // The request will be redirected to LinkedIn for authentication, so this
    // function will not be called.
    res.send('respond with a resource');
  }  
);

module.exports = router;
