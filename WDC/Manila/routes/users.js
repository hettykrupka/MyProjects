var express = require('express');
const nodemailer = require('nodemailer');
var router = express.Router();
var argon2 = require('argon2');



router.post('/login', function(req, res, next) {
    req.pool.getConnection(function(err, connection) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        var query = "SELECT staff_id, first_name, last_name, username, email, dob, manager_priv from Staff WHERE username=?;";
        connection.query(query, [req.body.username], function(err, rows, fields) {
            connection.release(); // release connection

            if (err) {
                res.sendStatus(500);
                return;
            }

            if (rows.length > 0) {

                if (argon2.verify(rows[0].password, req.body.password)) {
                    //on success
                    req.session.user = rows[0];
                    console.log(req.session);
                    res.send(req.session.user.username);
                } else {
                    //on failure
                    res.sendStatus(401);
                    return;
                }
            } else {
                //user does not exist
                res.sendStatus(403);
            }

        });
    });
});


//user cannot continue  without login
router.use(function(req, res, next) {
    if (req.session.user) {
        console.log("user log in confirmed, proceed");
        next();
    } else {
        console.log("user is NOT logged in, block further req");
        res.sendStatus(403);
    }
});


router.get('/useravail', function(req, res, next) {
    req.pool.getConnection(function(err, connection) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        var response = [];
        // for (var i=0;i<rows.length;i++){
        var query1 = "SELECT staff_availability.monday, staff_availability.tuesday, staff_availability.wednesday, staff_availability.thursday, staff_availability.friday, staff_availability.saturday, staff_availability.sunday FROM staff_availability WHERE staff_availability.staff_id=?;";
        connection.query(query1, [req.session.user.staff_id], function(err, rows1, fields) {
            //}
            connection.release(); // release connection

            if (err) {
                res.sendStatus(500);
                return;
            }
            //response=rows.length;
            res.json(rows1);
        });
    });
});

router.get('/userdata', function(req, res, next) {
    res.json(req.session.user);
});




router.post('/tasks', function(req, res, next) {
    req.pool.getConnection(function(err, connection) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        console.log(req.body);
        var query = "SELECT Tasks.name, Tasks.description, Tasks.due_date, Tasks.color, Tasks.status, Tasks.task_id FROM Tasks INNER JOIN Staff_Has_Task ON Tasks.task_id=Staff_Has_Task.task_id INNER JOIN Staff ON Staff_Has_Task.staff_id=Staff.staff_id WHERE Staff.staff_id=? AND Tasks.due_date=? UNION SELECT Tasks.name, Tasks.description, Tasks.due_date, Tasks.color, Tasks.status, Tasks.task_id FROM Tasks INNER JOIN Staff_Has_Task ON Tasks.task_id=Staff_Has_Task.task_id INNER JOIN Staff ON Staff_Has_Task.staff_id=Staff.staff_id WHERE Staff.staff_id=?;";
        connection.query(query, [req.session.user.staff_id, req.body.today, req.session.user.staff_id], function(err, rows, fields) {
            connection.release(); // release connection

            if (err) {
                res.sendStatus(500);
                return;
            }

            res.json(rows);
        });
    });
});

router.get('/comments', function(req, res, next) {
    req.pool.getConnection(function(err, connection) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        var response = [];

        var query1 = "SELECT Comments.content, Comments.task_id, Comments.author_id, Staff.first_name AS author_name, Staff.last_name AS author_lname, Comments.time_stamp FROM Comments INNER JOIN Tasks ON Comments.task_id=Tasks.task_id INNER JOIN Staff_Has_Task ON Tasks.task_id=Staff_Has_Task.task_id INNER JOIN Staff ON Comments.author_id=Staff.staff_id WHERE Staff_Has_Task.staff_id=?;";
        connection.query(query1, [req.session.user.staff_id], function(err, rows1, fields) {

            connection.release(); // release connection

            if (err) {
                res.sendStatus(500);
                return;
            }
            //response=rows.length;
            res.json(rows1);
        });
    });
});

router.get('/taskspeople', function(req, res, next) {
    req.pool.getConnection(function(err, connection) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        var response = [];
        // for (var i=0;i<rows.length;i++){
        var query1 = "SELECT Staff_Has_Task.task_id, Tasks.name, Staff_Has_Task.staff_id, Staff.first_name, Staff.last_name FROM Staff_Has_Task INNER JOIN Tasks ON Tasks.task_id=Staff_Has_Task.task_id INNER JOIN Staff ON Staff_Has_Task.staff_id=Staff.staff_id;";
        connection.query(query1, function(err, rows1, fields) {
            //}
            connection.release(); // release connection

            if (err) {
                res.sendStatus(500);
                return;
            }
            //response=rows.length;
            res.json(rows1);
        });
    });
});

router.get('/staff', function(req, res, next) {
    req.pool.getConnection(function(err, connection) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        var query = "SELECT Staff.first_name, Staff.last_name, Staff.email, Staff.staff_id, staff_availability.monday, staff_availability.tuesday, staff_availability.wednesday, staff_availability.thursday, staff_availability.friday, staff_availability.saturday, staff_availability.sunday FROM Staff INNER JOIN staff_availability ON Staff.staff_id=staff_availability.staff_id;";
        connection.query(query, function(err, rows, fields) {
            connection.release(); // release connection

            if (err) {
                res.sendStatus(500);
                return;
            }

            res.json(rows);
        });
    });
});

router.post('/postcomment', function(req, res, next) {
    //Connect to the database
    req.pool.getConnection(function(err, connection) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        var query1 = "INSERT INTO Comments(content, task_id, time_stamp, author_id) VALUES ( ?, ?, ?,?);";
        connection.query(query1, [req.body.content, req.body.task_id, req.body.time_stamp, req.session.user.staff_id], function(err, fields) {

            if (err) {
                res.sendStatus(500);
                return;
            } else {
                var query2 = "SELECT content FROM Comments WHERE task_id=?;";
                connection.query(query2, [req.body.task_id], function(err, rows, fields) {
                    connection.release(); // release connection

                    if (err) {
                        res.sendStatus(500);
                        return;
                    } else {
                        res.send(rows);
                    }
                });
            }
        });
    });
});

router.post('/newtask', function(req, res, next) {
    var t_id = '';
    req.pool.getConnection(function(err, connection) {
        let query = "INSERT INTO Tasks(name, description, due_date) VALUES ( ?, ?, ?); ";

        //query 1
        connection.query(query, [req.body.name, req.body.des, req.body.date], function(err, rows, fields) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            }

            //query 2
            let query1 = "SELECT Tasks.task_id FROM Tasks WHERE Tasks.task_id=(SELECT MAX(Tasks.task_id) FROM Tasks);";
            connection.query(query1, function(err, rows, fields) {
                if (err) {
                    console.log(err);
                    res.sendStatus(500);
                    return;
                }
                t_id = rows[0].task_id;

                let query2 = "INSERT INTO Staff_Has_Task(task_id, staff_id) VALUES ?;";

                let values = [];
                let people = req.body.people;
                for (let i = 0; i < people.length; i++) {
                    values.push([t_id, people[i]]);
                }

                connection.query(query2, [values], function(err, rows, fields) {
                    if (err) {
                        console.log(err);
                        res.sendStatus(500);
                        return;
                    }
                    res.send('new task id added' + t_id);
                }); //query 3
            }); //query 2
        }); //query 1

    });
});


router.post('/assignpeople', function(req, res, next) {
    var people = req.body.people;
    var query = "INSERT INTO Staff_Has_Task (task_id, staff_id) SELECT Tasks.task_id, 1 FROM Tasks WHERE Tasks.task_id=(SELECT MAX(Tasks.task_id) FROM Tasks);";
    req.pool.getConnection(function(err, connection) {
        for (var i in people) {

            connection.query(query, [people[i]], function(err, rows, fields) {
                if (err) {
                    res.sendStatus(500);
                    return;
                }
            });



        }
    });
    connection.release();

    res.send();

});


router.post('/updatestatus', function(req, res, next) {
    req.pool.getConnection(function(err, connection) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        var query = "UPDATE Tasks SET Tasks.status = ?, Tasks.color=? WHERE Tasks.task_id=?;";
        connection.query(query, [req.body.task_status, req.body.color, req.body.task_id], function(err, fields) {
            connection.release(); // release connection

            if (err) {
                res.sendStatus(500);
                return;
            }

            res.sendStatus(200);
        });
    });
});

router.post('/deletetask', function(req, res, next) {
    req.pool.getConnection(function(err, connection) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        var query = "DELETE FROM Tasks WHERE Tasks.task_id=?;";
        connection.query(query, [req.body.task_id], function(err, fields) {
            connection.release(); // release connection

            if (err) {
                res.sendStatus(500);
                return;
            }

            res.sendStatus(200);
        });
    });
});

router.post('/edittask', function(req, res, next) {
    req.pool.getConnection(function(err, connection) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        var query = "UPDATE Tasks SET Tasks.name=?, Tasks.description=? WHERE Tasks.task_id=?;";
        connection.query(query, [req.body.name, req.body.des, req.body.task_id], function(err, fields) {
            connection.release(); // release connection

            if (err) {
                res.sendStatus(500);
                return;
            }
            res.sendStatus(200);
        });
    });
});

router.post('/updateme', function(req, res, next) {
    req.pool.getConnection(function(err, connection) {
        if (err) {
            res.sendStatus(500);
            return;
        }


        var query = "UPDATE Staff SET Staff.first_name=?, Staff.last_name=?, Staff.email=?, Staff.username=? WHERE Staff.staff_id=?;";
        connection.query(query, [req.body.first_name, req.body.last_name, req.body.email, req.body.username, req.session.user.staff_id], function(err, fields) {

            if (err) {
                res.sendStatus(500);
                return;
            }
            var query1 = "SELECT staff_id, first_name, last_name, username, email, dob, manager_priv from Staff WHERE username=?;";
            connection.query(query1, [req.body.username], function(err, rows, fields) {

                if (err) {
                    res.sendStatus(500);
                    return;
                }

                req.session.user = rows[0];

                connection.release(); // release connection
                res.sendStatus(200);
            });
        });
    });
});

router.post('/updateavail', function(req, res, next) {
    req.pool.getConnection(function(err, connection) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        var query = "UPDATE staff_availability SET staff_availability.monday=?, staff_availability.tuesday=?, staff_availability.wednesday=?, staff_availability.thursday=?, staff_availability.friday=?, staff_availability.saturday=?, staff_availability.sunday=? WHERE staff_availability.staff_id=?;";
        connection.query(query, [req.body.mon, req.body.tues, req.body.wed, req.body.thurs, req.body.fri, req.body.sat, req.body.sun, req.session.user.staff_id], function(err, fields) {
            connection.release(); // release connection

            if (err) {
                res.sendStatus(500);
                return;
            }

            res.sendStatus(200);
        });
    });
});


router.post('/updatepassword', function(req, res, next) {
    req.pool.getConnection(function(err, connection) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        var query = "SELECT password FROM Staff WHERE username=?;";
        connection.query(query, [req.session.user.username], async function(err, rows, fields) {

            if (err) {
                res.sendStatus(500);
                return;
            }
            var update = rows[0].password;

            if (argon2.verify(rows[0].password, req.body.old_password)) {
                try {
                    update = await argon2.hash(req.body.new_password);
                } catch (err) {
                    res.sendStatus(500);
                    return;
                }
            }
            var query1 = "UPDATE Staff SET password=?;"
            connection.query(query1, [update], function(err, rows, fields) {
                connection.release(); // release connection

                res.send('ok');
            });
        });
    });
});

router.post('/logout', function(req, res, next) {
    const CLIENT_ID = '893986866377-na5r3u0j3ieqeaqmarct22oljecn3q33.apps.googleusercontent.com';
    const {
        OAuth2Client
    } = require('google-auth-library');
    const client = new OAuth2Client(CLIENT_ID);



    function init() {
        gapi.load('auth2', function() {
            var auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut().then(function() {
                console.log('User signed out.');
            });
        });
    }


    req.session.destroy();
    res.end();
});

router.post('/email', function(req, res, next) {
    //Nodemailer configuration
    transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        proxy: 'http://wdcmail.hopto.org',
        auth: {
            user: 'stuart.doyle@ethereal.email',
            pass: 'KyvuTD8946M1cBMGy3'
        }
    });

    req.pool.getConnection(function(err, connection) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        var query = "SELECT Tasks.name, Tasks.description, Tasks.due_date FROM Tasks INNER JOIN Staff_Has_Task ON Tasks.task_id=Staff_Has_Task.task_id INNER JOIN Staff ON Staff_Has_Task.staff_id=Staff.staff_id WHERE Staff.staff_id=?;";
        connection.query(query, [req.session.user.staff_id], function(err, rows, fields) {
            connection.release(); // release connection

            if (err) {
                res.sendStatus(500);
                return;
            } else {

                var text = "Hiya " + req.session.user.first_name + "!" + '\n' + '\n' + "This week you have " + rows.length + " tasks due." + '\n' + '\n' + "Here they are:" + '\n' + '\n';
                var recipient = req.session.user.email;
                //console.log(recipient);
                for (var i = 0; i < rows.length; i++) {
                    text += "Task " + (i + 1) + ": " + rows[i].name + '\n' + "Description: " + rows[i].description + '\n' + "Due Date: " + rows[i].due_date + '\n' + '\n';
                }


                const mailOptions = {
                    from: 'admin@manila.com', // sender address
                    to: recipient, // list of receivers
                    subject: "Your Upcoming Tasks", // Subject line
                    text: text
                };

                transporter.sendMail(mailOptions, function(err, res) {
                    if (err) {
                        console.error('there was an error: ', err);
                    } else {
                        //console.log('here is the res: ', res);
                    }
                });
            }
        });
    });

    res.end();
});




module.exports = router;