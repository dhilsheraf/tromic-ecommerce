const passport = require('passport');
const GoogleStrategy = require("passport-google-oauth20").Strategy
const User = require('../models/userModel')
const env = require('dotenv').config()


passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:8080/auth/google/callback' 
},

async (accessToken,refreshToken,profile,done) => {
    try {

        let user = await User.findOne({googleId:profile.id});
        if(user){
             return done(null,user)
        }

        else{
            const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;

            if (!email) {
                return done(new Error("Google account does not have an email address"));
            }

            user = await User.findOne({ email: email });
            if (user) {
                // If user with this email already exists, return that user
                return done(null, user);
            }

            // Creating a new user instance properly
            user = new User({
                username: profile.displayName,
                email: email,
                googleId: profile.id
            });

            // Save the new user to the database
            await user.save();
            return done(null, user);
        }
    } catch (error) {

        return done(error,null)


    }
}
))


passport.serializeUser((user,done)=>{

    done(null,user.id)
})

passport.deserializeUser((id,done)=>{
    User.findById(id)
    .then(user =>{
        done(null,user)
    })
    .catch(err =>{
        done(err,null)
    })
})

module.exports = passport 