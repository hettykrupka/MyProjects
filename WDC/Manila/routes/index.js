var express = require('express');
var router = express.Router();
var argon2 = require('argon2');

/* GET home page. */
router.use(function(req, res, next) {
    //console.log(req.session);
    next();
});

router.get('/', function(req, res, next) {
    res.redirect('login.html');
});

var new_users = [];


router.post('/signup', function(req, res, next) {
    //Connect to the database
    req.pool.getConnection(async function(err, connection) {
        if (err) {
            res.sendStatus(500);
            return;
        }

        var phash = null;
        try {
            phash = await argon2.hash(req.body.password);
        } catch (err) {
            res.sendStatus(500);
            return;
        }

        // console.log(req.body.first_name);
        // console.log(req.body.username);
        // console.log(req.body.password);
        // console.log(phash);
        // console.log(req.body.email);
        // console.log(req.body.dob);
        // console.log(req.body.manager_priv);
        var query = "INSERT INTO Staff (first_name, last_name, username, password, email, dob, manager_priv) VALUES (?, ?, ?, ? ,? , ?, ?);";
        connection.query(query, [req.body.first_name, req.body.last_name, req.body.username, phash, req.body.email, req.body.dob, req.body.manager_priv], function(err, rows, fields) {
            if (err) {
                res.sendStatus(418);
                return;
            }
            var query1 = "INSERT INTO staff_availability(staff_id) SELECT MAX(staff_id) FROM Staff;";
            connection.query(query1, function(err, rows, fields) {
                connection.release(); // release connection
                if (err) {
                    res.sendStatus(500);
                    return;
                } else {
                    //console.log('added availability');
                }
            }); //query 2

            res.send();
        }); //QUERY 1
    });
});


router.post('/tokensignin', async function(req, res, next) {
    const CLIENT_ID = '893986866377-na5r3u0j3ieqeaqmarct22oljecn3q33.apps.googleusercontent.com';
    const {
        OAuth2Client
    } = require('google-auth-library');
    const client = new OAuth2Client(CLIENT_ID);

    //console.log("recieved at sign in");

    try {
        const ticket = await client.verifyIdToken({
            idToken: req.body.idtoken,
            audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]

        });

        var payload = ticket.getPayload();
        var userid = payload['sub'];
        var email = payload['email'];
        //console.log(email);

    } catch (err) {
        res.sendStatus(500);
    }

    if (email) {
        req.pool.getConnection(function(err, connection) {
            var query = "SELECT staff_id, first_name, last_name, username, email, dob, manager_priv from Staff WHERE email=?;";
            connection.query(query, [email], function(err, rows, fields) {
                connection.release(); // release connection

                if (err) {
                    res.sendStatus(500);
                    return;
                }
                //console.log("checking db");
                if (rows.length > 0) {
                    req.session.user = rows[0];
                    //console.log("GETS TO HERE");
                    res.send(req.session.user.username);
                } else {
                    //user doesn't exist
                    res.sendStatus(403);
                }
            });
        });
    } else {
        //google sign in failed
        res.sendStatus(500);
    }

});




module.exports = router;