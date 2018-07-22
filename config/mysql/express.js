module.exports = function () {

    var express = require('express');
    var session = require('express-session');
    var MySQLStore = require('express-mysql-session')(session);
    var bodyParser = require('body-parser');

    var app = express();
    app.set('views', './views/mysql');
    app.set('view engine', 'pug');
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(session({   // session 미들웨어
        secret: '1234DSFs@adf1234!@#&asd',
        resave: false,
        saveUninitialized: true,
        store: new MySQLStore({
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: '7101',
            database: 'o2'
        })
    }));

    return app;
}