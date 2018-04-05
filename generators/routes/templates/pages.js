'use strict';
const express = require('express');
const app = express();
const cfg = require('../config');
const passport = require('../passports');
const coveoPlatformApi = require('../middleware/cloudPlatformAPI');

app.get('/', (req, res) => {
  res.render('pages/home', { production: process.env.NODE_ENV == 'production' });
});

app.get('/:name', coveoPlatformApi.getSearchToken, (req, res) => {
  var name = req.params.name;
  if (name) {
    res.render(`pages/${name}`, {
      config: config,
      token: req.token,
      production: process.env.NODE_ENV == 'production'
    });
  } else {
    res.redirect('/');
  }
});

module.exports = app;
