const dbControl   = require('../mongo').Controller;
const crypto      = require('crypto');
const nullChecker = require('../commons').NullChecker;

function initUser(app) {
    initDB();
    app.get('/user/:u_id', (req, res)=>{getUser(req, res)});
    app.put('/user', (req, res)=>{handlePutUser(req, res)});
    app.delete('/user/:u_id', (req, res)=>{handleDeleteUser(req, res)});
    app.get('/users', (req, res)=>{getAllUsers(req, res)});
    app.get('/session', (req, res)=>{checkUserSession(req, res)});
    app.get('/logout', (req, res)=>{removeUserSession(req, res)});
    app.post('/register', (req, res)=>{handleRegister(req, res)});
    app.post('/login', (req, res)=>{handleLogin(req, res)});
    app.get('/video/:v_name', (req, res)=>{getUserRecordedVideo(req, res)});
}

function initDB() {
    let password = crypto.createHash('md5').update("admin").digest('hex');
    let user = {
        username:  "admin",
        password:  password,
        isAdmin:   true,
        firstName: "AdminFirstName",
        lastName:  "AdminLastName"
    };
    
    dbControl.setOnInsertUserByUsername(user);
}

async function handleDeleteUser(req, res) {
    if(!req.session.isAdmin || !req.params.u_id) {
        res.sendStatus(400);
        return;
    }

    let u_id = req.params.u_id;
    
    try {
        await dbControl.deleteUser(u_id);
    } catch(err) {
        res.sendStatus(400);
        return;
    }

    res.sendStatus(200);
}

function handlePutUser(req, res) {
    if(!req.session.isAdmin) {
        res.sendStatus(400);
        return;
    }
    let password = crypto.createHash('md5').update(req.body.password).digest('hex');
    let user = {
        _id:       req.body._id,
        username:  req.body.username,
        password:  password,
        isAdmin:   req.body.isAdmin,
        firstName: req.body.firstName,
        lastName:  req.body.lastName
    };

    if(nullChecker.hasNull(user)) {
        res.sendStatus(400);
        return;
    }

    dbControl.updateUser(user, (result, err)=>{
        if(err) {
            res.sendStatus(400);
            return;
        }
        res.sendStatus(200);
    });
}

async function getUserRecordedVideo(req, res) {
    if(!req.session.isAdmin || !req.params.v_name) {
        res.sendStatus(400);
        return;
    }
    let videoPath = '/mediafile/'+req.params.v_name;
    res.download(videoPath);
}

async function getAllUsers(req, res) {
    if(!req.session.isAdmin) {
        res.sendStatus(400);
        return;
    }
    
    let users = await dbControl.getAllUsers().catch(()=>{
        res.sendStatus(400);
        return;
    });

    res.send(JSON.stringify(users));
}

function removeUserSession(req, res) {
    req.session.destroy();
    res.sendStatus(200);
}

function checkUserSession(req, res) {
    if(req.session.isAdmin) {
        let data = {isAdmin: true};
        res.send(JSON.stringify(data));
        return;
    }
    if(req.session.user) {
        res.sendStatus(200);
        return;
    }
    res.sendStatus(400);
}

function getUser(req, res) {
    let u_id = req.params.u_id;
    
    console.log("u_id : " + u_id);

    if(!req.session.user) {
        res.sendStatus(400);
        return;
    }

    if(req.session.user == u_id) {
        console.log("u_id matched");
        sendUserData(u_id, res);
    }
    else {
        isAdmin(u_id, (isAdminUid)=>{
            if(!isAdminUid) {
                res.sendStatus(400);
                return;
            }
            sendUserData(u_id, res);
        });
    }
}

function sendUserData(u_id, res) {
    dbControl.getUserById(u_id, (result, err)=>{
        if(!result || err) {
            res.sendStatus(400);
            return;
        }
        delete result.password;
        res.send(JSON.stringify(result));
    });
}

function handleLogin(req, res) {
    if(req.session.user) {
        res.sendStatus(200);
        return;
    }
    let password = crypto.createHash('md5').update(req.body.password).digest('hex');

    let credential = {
        username: req.body.username,
        password: password
    };
    
    if(nullChecker.hasNull(credential)) {
        res.sendStatus(400);
        return;
    }

    dbControl.getUserIdByCredential(credential, (result, err)=>{
        if(!result || err) {
            res.sendStatus(400);
        }
        else {
            let lastLogin = {
                _id:       result._id,
                lastLogin: new Date().toDateString() + ' ' + new Date().toLocaleTimeString()
            };
            dbControl.updateUser(lastLogin, ()=>{
                console.log("id: " + result._id);
                req.session.user = result._id;
                if(result.isAdmin) {
                    req.session.isAdmin = true;
                    let data = {isAdmin: true};
                    res.send(JSON.stringify(data));
                }
                else {
                    res.sendStatus(200);
                }
            });
        }        
    });
}

function handleRegister(req, res) {
    if(!req.session.isAdmin) {
        res.sendStatus(400);
        return;
    }

    let password = crypto.createHash('md5').update(req.body.password).digest('hex');
    let user = {
        username:  req.body.username,
        password:  password, 
        isAdmin:   req.body.isAdmin,
        firstName: req.body.firstName,
        lastName:  req.body.lastName
    };
    
    console.log(user);

    if(!nullChecker.hasNull(user)) {
        dbControl.getUserByUsername(user.username, (userExists, err)=> {
            if(userExists || err) {
                console.log("user exists");
                res.sendStatus(400);
                return;
            }
            dbControl.addNewUser(user, (result, err)=>{
                if(!result || err) {
                    console.log(err);
                    res.sendStatus(400);
                }
                else {
                    console.log("added new user");
                    res.sendStatus(200);
                }
            });
        }); 
    }
    else {
        res.sendStatus(400);
    }
}

function isAdmin(u_id, callback) {
    dbControl.getUserById(u_id, (res, err)=>{
        if(!res || err) {
            callback(false, err);
        }
        else if(res.isAdmin) {
            callback(true, err);
        }
        else {
            callback(false, err);
        }
    });
}

module.exports = initUser;
