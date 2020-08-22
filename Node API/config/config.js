//const fs = require('fs');
require('dotenv').config(); //instatiate environment variables

module.exports = {
    app: process.env.APP || 'dev',
    environment: process.env.NODE_ENV || "development",
    port: process.env.PORT || '3000',

    api_version: process.env.API_VERSION || '/api/v1/',

    jwt_encryption: process.env.JWT_ENCRYPTION || 'jwt_please_change',
    jwt_expiration: process.env.JWT_EXPIRATION || '10000',

    mj_sendername:process.env.MAILJET_SENDER_NAME,
    mj_senderemail:process.env.MAILJET_SENDER_EMAIL,
    mj_apikey: process.env.MJ_APIKEY_PUBLIC,
    mj_secretekey: process.env.MJ_APIKEY_PRIVATE,
    mj_smstoken:process.env.MJ_SMS_TOKEN,

    development: {
        username: 'root',
        password: '',
        database: 'jackfruitdb',
        host: '127.0.0.1',
        port: 3306,
        dialect: 'mysql'
    },
    test: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_DIALECT,
    },
    production: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_DIALECT,
        // dialectOptions: {
        //     ssl: {
        //         ca: fs.readFileSync(__dirname + '/mysql-ca-master.crt')
        //     }
        // }
    }
};
