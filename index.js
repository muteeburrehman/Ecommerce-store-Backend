import express from 'express';
import passport from 'passport'
import {Strategy as GoogleStrategy} from 'passport-google-oauth2';
import {Strategy as FacebookStrategy} from 'passport-facebook';
import expressSession from 'express-session'


//For Google
const app=express();
const GOOGLE_CLIENT_ID = '612009756713-fevv7ilgb1ltpvrc7cnsolno8bjadb3c.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET ='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';
//For Facebook
const FACEBOOK_CLIENT_ID='990173875566142';
const FACEBOOK_CLIENT_SECRET='ea1259d7c4fc652844b53dd9e8049185';

passport.use(new GoogleStrategy({
    clientId: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackUrl: '/google'
    },(accessToken,refreshToken,profile,callback)=>{
    callback(null,profile);
}))

passport.use(new FacebookStrategy({
    clientId: FACEBOOK_CLIENT_ID,
    clientSecret:FACEBOOK_CLIENT_SECRET,
    callbackUrl:'/facebook',
    profileFields:['emails','displayName','name','picture']
},(accessToken,refreshToken,profile,callback)=>{
    callback(null,profile)
}))

passport.serializeUser((user,callback)=>{
    callback(null,user);
})

passport.deserializeUser((user,callback)=>{
    callback(null,user);
})

app.use(expressSession({
    secret: 'shoestoreapp',
    resave: true,
    saveUninitialized:true

}))
app.use(passport.initialize());
app.use(passport.session());
//routes
app.get('/login/google',passport.authenticate('google',{scope:['profile email']}));
app.get('/login/facebook',passport.authenticate('facebook',{scope:['email']}));

app.get('/google',passport.authenticate('google'),(req,res)=>{
    res.redirect('/');
})

app.get('/facebook',passport.authenticate('facebook'),(req,res)=>{
    res.redirect('/');
})

app.get('/logout',(req,res)=>{
    req.logout();
    res.redirect('/');
})
app.get('/',(req,res)=>{
    res.send(req.user? req.user:'Not logged in','login with Google or facebook');
})
app.listen(8000,()=>{
    console.log('server started on 8000');
})