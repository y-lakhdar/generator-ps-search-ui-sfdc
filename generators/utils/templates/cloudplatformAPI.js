'use strict';
var https = require('https');
var _ = require('underscore')
var config = require('../config');

module.exports = {
    getSearchToken: function (users, filter, searchHub){
        console.log('entering getSearchToken!!!');
        var userids = _.map(users, (user) => {
            return { 'name': user, 'provider': 'Email Security Provider' }
        });

        const postData = {
            userIds: userids,
            filter: filter || '',
            searchHub: searchHub || 'pilot'
        };

        const options = {
            method: 'POST',
            host: config.coveo.cloud_platform_host,
            path: '/rest/search/token',
            headers: {
                'Authorization': 'Bearer ' + config.coveo.api_key,
                'Content-Type': 'application/json'
            }
        };

        console.log('post DATA >>> ' + JSON.stringify(postData));

        return new Promise((resolve, reject) => {

            console.log('before request !!!');
            const request = https.request(options, (res) => {
                console.log(`STATUS: ${res.statusCode}`);
                console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
                // handle http errors
                if (res.statusCode < 200 || res.statusCode > 299) {
                    reject(new Error('Failed to load page, status code: ' + res.statusCode));
                }
                // temporary data holder
                const body = [];
                res.setEncoding('utf8');
                // on every content chunk, push it to the data array
                res.on('data', (chunk) => body.push(chunk));
                // we are done, resolve promise with those joined chunks
                res.on('end', () => resolve(body.join('')));

            });
            // handle connection errors of the request
            request.on('error', (err) => reject(err));

            request.write(JSON.stringify(postData));
            request.end();
        });

    }
};
