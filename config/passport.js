
/********************************
 Passport Middleware Configuration
 ********************************/
var passport = require("passport");
var User = require("../server/models/user");
var LocalStrategy = require("passport-local").Strategy;

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({ username: username }, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            // validatePassword method defined in user.model.js
            if (!user.validatePassword(password, user.password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });
    }
));
