var config = require('./config.global');

config.env = 'uat';

//Coveo
config.coveo.api_key = '';
config.coveo.superUser_api_key = '';
config.coveo.expired_token = 'eyJhbGciOiJIUzI1NiJ9.eyJmaWx0ZXIiOiJAb3dzaWQgT1IgKEBzeXNzb3VyY2U9PVwiU2FsZXNmb3JjZSBGdWxsQ29weVwiIChOT1QgKEBzZmNvbnRhY3Rvd25lcnJvbGVjPVBQVCBPUiBAc2ZyZWNvcmR0eXBlbmFtZT1QUFQpKSkiLCJzZWFyY2hIdWIiOiJwaWxvdCIsInY4Ijp0cnVlLCJvcmdhbml6YXRpb24iOiJiaWxsbWVsaW5kYWdhdGVzZm91bmRhdGlvbnNhbmRib3gxIiwidXNlcklkcyI6W3sicHJvdmlkZXIiOiJFbWFpbCBTZWN1cml0eSBQcm92aWRlciIsIm5hbWUiOiJqZmFsbGFpcmVAY292ZW8uY29tIiwidHlwZSI6IlVzZXIifV0sInJvbGVzIjpbInF1ZXJ5RXhlY3V0b3IiXSwiZXhwIjoxNDk3NDc0MzA2LCJpYXQiOjE0OTczODc5MDZ9.DXAZ5ftzKiC_447RaIUXpbJ7D91oLB3VYYYasPPq_6Y';
config.coveo.org_id = '';
config.coveo.searchHub = '';
config.coveo.filter = '';
config.coveo.users = ['platform@coveo.com'];

module.exports = config;