var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const session = require('express-session');
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const passport = require('passport');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


var router = express.Router();

var app = express();

app.use(session({
  secret: 'your-session-secretisRandomSecret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true for HTTPS
}));


app.use(passport.initialize());
app.use(passport.session());


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
// app.use('/auth', authRouter);


/* GET users listing. */
app.get('/auth/linkedin',
  passport.authenticate('linkedin', { scope: ['r_liteprofile'] }));

app.get('/auth/linkedin/callback',
passport.authenticate('linkedin', { failureRedirect: '/login' }),
  function(req, res){    
      // Successful authentication, redirect to the loggedin page.
      res.redirect('/loggedin');
    }
);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new LinkedInStrategy({
    clientID: '77g8fczm492lf6',
    clientSecret: 'G6qAVsHHFPtobk0A',
    profileFields: ['id', 'first-name', 'last-name', 'email-address', 'headline', 'r_fullprofile'],
    callbackURL: 'http://localhost:3000/auth/linkedin/callback'    
  },
  function(accessToken, refreshToken, profile, done) {
    // Save the user's LinkedIn data to the database here.

    profile.accessToken = accessToken;
    
    // console.log(profile);

    return done(null, profile);
  }
));

function ensureAuthenticated(req, res, next) {
  console.log("a");
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/');
  }
}



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
