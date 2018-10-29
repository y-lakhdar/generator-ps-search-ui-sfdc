'use strict';
const express = require('express');
const app = express();
const cfg = require('../config');
const coveoPlatformApi = require('../middlewares/cloudPlatformAPI');

app.get('/', (req, res) => {
  res.redirect('/community-search');
});

app.get('/:name', coveoPlatformApi.getSearchToken, (req, res) => {
  var name = req.params.name;
  var userLocale = req.query.local || 'en';
  if (name) {
    res.render(
      `pages/${name}`,
      {
        title: name.replace(/-/g, ' '),
        config: cfg,
        token: req.token,
        userLocale: userLocale,
        production: process.env.NODE_ENV == 'production'
      },
      (err, html) => {
        if (err) {
          res.status(404).send('Page not found');
        } else {
          res.send(html);
        }
      }
    );
  } else {
    res.status(400).send('Bad Request: Missing page name');
  }
});

module.exports = app;
