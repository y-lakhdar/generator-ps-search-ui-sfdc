'use strict';
const request = require('request');
const _ = require('underscore');
var config = require('../config');

module.exports = {
  getSearchToken: (middlewareRequest, middlewareResponse, next) => {
    const users = process.env.ADDITIONAL_USER || config.coveo.users;
    const userids = _.map(users, user => {
      return { name: user, provider: 'Email Security Provider' };
    });

    const postData = {
      userIds: process.env.FILTER_EXPRESSION || userids,
      searchHub: process.env.SEARCH_HUB || config.coveo.searchHub,
      filter: process.env.ADDITIONAL_USER || config.coveo.filter
    };

    request(
      `https://${config.coveo.cloud_platform_host}/rest/search/token`,
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
            next(JSON.stringify(res, null, 2));
          }
          middlewareRequest.token = res.token;
          next();
        }
      }
    );
  }
};
