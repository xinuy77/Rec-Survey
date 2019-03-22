const express      = require('express');
const path         = require('path');
const app          = express();
const websocket    = require('./websocket');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const session      = require('express-session');
const config       = require('config');

let sessionHandler  = session({
    secret : 'none',
    rolling : true,
    resave : true,
    saveUninitialized : true
});

app.use(bodyParser.urlencoded({
        extended: true
}));
app.use(bodyParser.json());
app.use(sessionHandler);
app.use(cookieParser());

app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'https://'+config.get('view.host')+':'+config.get('view.port')); 

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(express.static(path.join(__dirname, 'views')))
app.use(express.static(path.join(__dirname, 'public')))

require('./user').init(app);
require('./survey').init(app);
require('./picture').init(app);
require('./passage').init(app);

function initWebsocket(server) {
	websocket.initSocketHandler(app, server, sessionHandler);
}

module.exports = {
	app: app,
	initWebsocket: initWebsocket
}
