'use strict';
const express = require('express');
const router = express.Router();
const cfg = require('../config');
const passport = require('../passports');
const middleware = require('../middleware');
const coveoPlatformApi = require('../utils/cloudPlatformAPI');

router.use((req, res, next) => {
  req.filter = cfg.coveo.filter;
  next();
});

router.get('/', (req, res) => {
  res.redirect('/agent-full-search');
});

// unprotected Full Search page
router.get('/full-search', (req, res) => {
  res.render('pages/full-search', {
    prototypeTitle: 'Full Search Test',
    config: cfg
  });
});

// Pilot Search [Protected + generatedSearchToken]
router.get('/pilot-search', passport.protected, middleware.ensureTokenGenerated, (req, res) => {
  res.render('pages/pilot-search', {
    prototypeTitle: 'Pilot Search',
    config: cfg,
    token: req.session.tokens[req.originalUrl]
  });
});

// Community Search
router.get('/community-search', (req, res) => {
  coveoPlatformApi
    .getSearchToken()
    .then(data => {
      res.render('pages/community-search', {
        prototypeTitle: 'Community Search Prototype',
        config: cfg,
        token: data.token
      });
    })
    .catch(err => console.error(err));
});

// SFDC Agent Box
router.get('/agent-box', (req, res) => {
  coveoPlatformApi
    .getSearchToken()
    .then(data => {
      res.render('pages/agent-box', {
        prototypeTitle: 'Agent Insight Panel',
        config: cfg,
        token: data.token
      });
    })
    .catch(err => console.error(err));
});

// SFDC Agent Full
router.get('/agent-full-search', (req, res) => {
  coveoPlatformApi
    .getSearchToken()
    .then(data => {
      res.render('pages/agent-full-search', {
        prototypeTitle: 'Agent Full Search',
        config: cfg,
        token: data.token
      });
    })
    .catch(err => console.error(err));
});

module.exports = router;
