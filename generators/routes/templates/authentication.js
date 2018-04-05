
'use strict';
const express = require('express');
const app = express();
const passport = require('../passports');
const middleware = require('../middleware');


app.get('/renewToken', authentication.resetToken, middleware.ensureTokenGenerated, (req, res) => {
    res.redirect('/');
});

app.get('/logout', (req, res) => {
    req.logout();
    req.session.destroy((err) => {
        res.redirect('/login'); //Inside a callback… bulletproof!
    });
})

app.get('/login', (req, res) => {
    res.render('pages/login');
})


app.get('/auth/okta', passport.authenticate('saml', { failureRedirect: '/login', failureFlash: true }), (req, res, next) => {
    res.redirect(req.session.redirect_to || '/');
    delete req.session.redirect_to;
});

//POST Methods, redirect to home successful login
app.post('/auth/okta', passport.authenticate('saml', { failureRedirect: '/login', failureFlash: true }), (req, res, next) => {
    // Successful authentication, redirect to redirect_to route or home.
    res.redirect(req.session.redirect_to || '/');
    delete req.session.redirect_to;
});


// Google aauthenticationuth routes
// app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
//   // Successful authentication, redirect home.
//   res.redirect(req.session.redirect_to || '/');
//   delete req.session.redirect_to;
// });

// Facebook authentication routes
// app.get('/auth/facebook', passport.authenticate('facebook'));

// app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
//   // Successful authentication, redirect home.
//   res.redirect(req.session.redirect_to || '/');
//   delete req.session.redirect_to;
// });

module.exports = app;