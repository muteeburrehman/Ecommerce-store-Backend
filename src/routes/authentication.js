import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import expressSession from 'express-session';
import { queryDatabase } from "../db";

export const authenticationRouter = express.Router();

// Initialize expressSession before initializing passport
authenticationRouter.use(expressSession({
    secret: 'shoestoreapp',
    resave: true,
    saveUninitialized: true
}));

// Initialize Passport and expressSession
authenticationRouter.use(passport.initialize());
authenticationRouter.use(passport.session());

// For Google
const GOOGLE_CLIENT_ID = '612009756713-fevv7ilgb1ltpvrc7cnsolno8bjadb3c.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: '/google/callback'
}, (accessToken, refreshToken, profile, callback) => {
    callback(null, profile);
}));

// For Facebook
const FACEBOOK_CLIENT_ID = '676764303980550';
const FACEBOOK_CLIENT_SECRET = 'eea4293b945fb06207084ae63b231f06';

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_CLIENT_ID,
    clientSecret: FACEBOOK_CLIENT_SECRET,
    callbackURL: '/facebook/callback',
    profileFields: ['emails', 'displayName', 'name', 'picture']
}, (accessToken, refreshToken, profile, callback) => {
    callback(null, profile);
}));

passport.serializeUser((user, callback) => {
    callback(null, user);
});

passport.deserializeUser((user, callback) => {
    callback(null, user);
});

// API route for user login
authenticationRouter.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await queryDatabase('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
        if (!user[0]) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }
        res.status(200).json({ message: 'Login successful', user: user[0] });
    } catch (err) {
        res.status(500).json({ message: 'Database error' });
    }
});

// API route for user registration
authenticationRouter.post('/api/register', async (req, res) => {
    const { email, password, username, phoneNo } = req.body;

    try {
        const usernameExists = await queryDatabase('SELECT * FROM users WHERE username = ?', [username]);
        if (usernameExists[0]) {
            res.status(400).json({ message: 'Username already exists' });
            return;
        }

        const emailExists = await queryDatabase('SELECT * FROM users WHERE email = ?', [email]);
        if (emailExists[0]) {
            res.status(400).json({ message: 'Email already exists' });
            return;
        }

        const phoneNoExists = await queryDatabase('SELECT * FROM users WHERE phoneNo = ?', [phoneNo]);
        if (phoneNoExists[0]) {
            res.status(400).json({ message: 'Phone number already exists' });
            return;
        }

        const insertQuery = `
            INSERT INTO users (username, email, phoneNo, password)
            VALUES (?, ?, ?, ?)
        `;
        await queryDatabase(insertQuery, [username, email, phoneNo, password]);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Database error' });
    }
});

authenticationRouter.get('/login/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
authenticationRouter.get('/login/facebook', passport.authenticate('facebook', { scope: ['email'] }));

authenticationRouter.get('/google/callback', passport.authenticate('google'), (req, res) => {
    res.redirect('http://localhost:8080/');
});

authenticationRouter.get('/facebook/callback', passport.authenticate('facebook'), (req, res) => {
    res.redirect('http://localhost:8080/');
});

authenticationRouter.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/notlogged');
});

authenticationRouter.get('/notlogged', (req, res) => {
    res.send(req.user ? req.user : 'Not logged in. Login with Google or Facebook.');
});

export default authenticationRouter;
