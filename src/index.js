const express   = require('express');
const path      = require('path');
const app       = express();
const websocket = require('./websocket');
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, 'views')))
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser());

function initWebsocket(server) {
	websocket.initSocketHandler(app, server);
}

module.exports = {
	app: app,
	initWebsocket: initWebsocket
}
