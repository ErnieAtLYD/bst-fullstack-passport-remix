// Require .env files for environment variables (keys and secrets)
require('dotenv').config();

const express = require('express');
const PORT = process.env.PORT || 5050;

// Middleware for creating a session id on server and a session cookie on client
/*
 Creates a session object and inserts it in the request. By checking if this
 object exists we are able to determine that the user is indeed logged in, and
 therefore allow access to parts of our API we want to keep private
*/
const session = require('express-session');

const app = express();

// cors package prevents CORS errors when using client side API calls
const cors = require('cors');

// Add http headers, small layer of security
const helmet = require('helmet');
const passport = require('./passport');

const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');
const morgan = require('morgan');

app.use(morgan('tiny'));

// Enable req.body middleware
app.use(express.json());

// Initialize HTTP Headers middleware
app.use(helmet());

// Enable CORS (with additional config options required for cookies)
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: false,
  })
);

app.use(passport.initialize());

/*
 Passport.session middleware alters the `req` object with the `user` value
 by converting session id from the client cookie into a deserialized user object.
 This middleware also requires `serializeUser` and `deserializeUser` functions written below
 Additional information: https://stackoverflow.com/questions/22052258/what-does-passport-session-middleware-do
*/
app.use(passport.session());

app.use('/auth', authRoutes);
app.use('/api/v1/posts', postsRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}.`);
});
