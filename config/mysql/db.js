module.exports = function () {
    var mysql = require('mysql');
    var conn = mysql.createConnection({
        host: 'localhost',
        user: '',
        password: '',
        database: ''
    });
    conn.connect();

    return conn;
}