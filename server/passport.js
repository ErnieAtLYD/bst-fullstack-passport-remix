const User = require('./models/user');

// Passport library and Github Strategy
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

// Initialize GitHub strategy middleware
// http://www.passportjs.org/packages/passport-github2/
// We can add multiple strategies with `passport.use` syntax
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    (_accessToken, _refreshToken, profile, done) => {
      /*
       For our implementation we don't need access or refresh tokens.
       Profile parameter will be the profile object we get back from GitHub
      */
      console.log('GitHub profile:', profile);

      // First let's check if we already have this user in our DB
      User.findOne({ github_id: profile.id })
        .then((user) => {
          if (user) {
            // If user is found, pass the user object to serialize function
            done(null, user);
          } else {
            // If user isn't found, we create a record
            User.create({
              github_id: profile.id,
              avatar_url: profile._json.avatar_url,
              username: profile.username,
            })
              .then((userId) => {
                // Pass the user object to serialize function
                done(null, { id: userId });
              })
              .catch((err) => {
                console.log('Error fetching a user', err);
              });
          }
        })
        .catch((err) => {
          console.log('Error fetching a user', err);
        });
    }
  )
);

/*
 `serializeUser` determines which data of the auth user object should be stored in the session
 The data comes from `done` function of the strategy
 The result of the method is attached to the session as `req.session.passport.user = 12345`
*/
passport.serializeUser((user, done) => {
  console.log('serializeUser (user object):', user);
  // Store only the user id in session
  done(null, user.id);
});

/*
 `deserializeUser` receives a value sent from serializeUser's `done` function
 We can then retrieve full user information from our database using the userId
*/
passport.deserializeUser((userId, done) => {
  console.log('deserializeUser (user id):', userId);
  User.findOne({ id: userId })
    .then((user) => {
      // Remember that knex will return an array of records, so we need to get a single record from it
      console.log('req.user:', user);
      // The full user object will be attached to request object as `req.user`
      done(null, user);
    })
    .catch((err) => {
      console.log('Error finding user', err);
    });
});

module.exports = passport;
