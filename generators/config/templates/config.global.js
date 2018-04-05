const config = module.exports = {};

config.hostname = 'dev.example.com';
config.server_port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 3000;
config.server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

config.iow_path = '';

// Redis
config.redis = {
    client: { host:'redis', port: 6379 }
};

// coveo
config.coveo = {};
config.coveo.cdn = 'https://static.cloud.coveo.com/searchui/v2.2900/'
config.coveo.rest_uri = 'https://platform.cloud.coveo.com/rest/search';
config.coveo.cloud_platform_host = 'platform.cloud.coveo.com';
config.coveo.cloud_platform_uri = 'https://cloudplatform.coveo.com/rest';
config.coveo.ops_identity = {
    'name': '<%= authorEmail %>',
    'provider': 'Email Security Provider'
};
config.coveo.filter = '';


// Authentication
config.auth = {};
// OKTA Authentication configurations
config.auth.okta = {
    path: '/auth/okta',
    entryPoint : 'https://yourOktaEntryPointPath/sso/saml',
    cert : 'YourOktaCertificate',
    issuers : {
        devLocal: 'http://localhost:3000',
        azure: 'https://your-azure-app.azurewebsites.net'
    }
};
// Google Authentication configurations
config.auth.google = {
    clientID: 'YourGoogleClientID',
    clientSecret: 'YourGoogleClientSecret',
    callbackURL: '/auth/google/callback',
};