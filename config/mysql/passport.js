module.exports = function (app) {
    var conn = require('./db')();
    var bkfd2Password = require("pbkdf2-password");
    var passport = require('passport')
    var LocalStrategy = require('passport-local').Strategy;
    var FacebookStrategy = require('passport-facebook').Strategy;
    var hasher = bkfd2Password();
    app.use(passport.initialize()); // passport 초기화
    app.use(passport.session());    // session을 사용

    passport.serializeUser(function (user, done) {
        console.log('serializeUser', user);
        done(null, user.authId);
    });
    passport.deserializeUser(function (id, done) {
        console.log('deserializeUser', id);
        var sql = 'SELECT * FROM users WHERE authId=?';
        conn.query(sql, [id], function (err, results) {
            if (err) {
                console.log(err);
                done('There is no user.');
            } else {
                done(null, results[0]);
            }
        });
    });
    passport.use(new LocalStrategy( // 로컬 전략
        function (username, password, done) {   // 콜백함수
            var uname = username;
            var pwd = password;
            var sql = 'SELECT * FROM users WHERE authId=?';
            conn.query(sql, ['local:' + uname], function (err, results) {
                console.log(results);
                if (err) {
                    return done('There is no user.');
                }
                var user = results[0];
                return hasher({ password: pwd, salt: user.salt }, function (err, pass, salt, hash) {
                    if (hash === user.password) {   // 사용자가 있다면
                        console.log('LocalStrategy', user);
                        done(null, user);   // 로그인 성공
                    } else {    // 사용자가 없다면
                        done(null, false);  // 로그인 실패
                    }
                });
            });
        }
    ));
    passport.use(new FacebookStrategy({
        clientID: 'app id',
        clientSecret: 'app secret',
        callbackURL: "/auth/facebook/callback",
        profileFields: ['id', 'email', 'gender', 'link', 'locale',
            'name', 'timezone', 'updated_time', 'verified', 'displayName']
    },
        function (accessToken, refreshToken, profile, done) {
            console.log(profile);
            var authId = 'facebook:' + profile.id;
            var sql = 'SELECT * FROM users WHERE authId=?';
            conn.query(sql, [authId], function (err, results) {
                if (results.length > 0) {
                    done(null, results[0]);
                } else {
                    var newuser = {
                        'authId': authId,
                        'displayName': profile.displayName,
                        'email': profile.emails[0].value
                    }
                    var sql = 'INSERT INTO users SET ?';
                    conn.query(sql, newuser, function (err, results) {
                        if (err) {
                            console.log(err);
                            done('Error');
                        } else {
                            done(null, newuser);
                        }
                    })
                }
            });
        }
    ));
    return passport;
}