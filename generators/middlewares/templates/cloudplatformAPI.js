'use strict';
const request = require('request');
const _ = require('underscore');
var config = require('../config');

module.exports = {
  getSearchToken: (middlewareRequest, middlewareResponse, next) => {
    const userids = _.map(config.coveo.users.split(','), user => {
      return { name: user, provider: 'Email Security Provider' };
    });

    const postData = {
      userIds: userids,
      searchHub: config.coveo.searchHub,
      filter: config.coveo.filter || ''
    };

    request(
      `https://${config.cloud_platform_host}/rest/search/token`,
      {
        auth: { bearer: config.coveo.api_key },
        json: true,
        method: 'POST',
        body: postData,
        qs: { organizationId: config.coveo.org_id }
      },
      (err, req, res) => {
        if (err) {
          next(err);
        } else {
          if (res.statusCode < 200 || res.statusCode > 299) {
            next(new Error('Failed to load page, status code: ' + res.statusCode));
          }
          middlewareRequest.token = res.token;
          next();
        }
      }
    );
  }
};
