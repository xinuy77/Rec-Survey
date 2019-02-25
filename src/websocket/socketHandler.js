var   ws                = require('ws');
var   session           = require('express-session');
const kurentoController = require('../kurento').kurentoController;
var recordUri           = 'file:///tmp/kurento-hello-world-recording.mp4';
var kurentoUri          = 'ws://192.168.0.121:8888/kurento';

var sessionHandler  = session({
    secret : 'none',
    rolling : true,
    resave : true,
    saveUninitialized : true
});

function initSocketHandler(app, server) {
	var wss = new ws.Server({
		server : server,
		path : '/websocket'
	});

	app.use(sessionHandler);

	/*
	 * Management of WebSocket messages
	 */
	wss.on('connection', function(ws, req) {
		var sessionId = null;
		var request   = req;
		var response  = {
			writeHead : {}
		};
	
		sessionHandler(request, response, function(err) {
			sessionId = request.session.id;
			console.log('Connection received with sessionId ' + sessionId);
		});

		ws.on('error', function(error) {
			console.log('Connection ' + sessionId + ' error');
			kurentoController.stop(sessionId);
		});

		ws.on('close', function() {
			console.log('Connection ' + sessionId + ' closed');
		    kurentoController.stop(sessionId);
		});

		ws.on('message', function(_message) {
			var message = JSON.parse(_message);
			console.log('Connection ' + sessionId + ' received message ', message);
			console.log(message.id);
			switch (message.id) {
				case 'start':
					sessionId = request.session.id;
					console.log("starting!!!");
					kurentoController.start(sessionId, ws, message.sdpOffer, kurentoUri, recordUri, function(error, sdpAnswer) {
						if (error) {
							return ws.send(JSON.stringify({
								id : 'error',
								message : error
							}));
						}
						ws.send(JSON.stringify({
							id : 'startResponse',
							sdpAnswer : sdpAnswer
						}));
					});
					break;

				case 'stop':
					kurentoController.stop(sessionId);
					break;

				case 'onIceCandidate':
					kurentoController.onIceCandidate(sessionId, message.candidate);
					break;

				default:
					ws.send(JSON.stringify({
						id : 'error',
						message : 'Invalid message ' + message
					}));
					break;
			}

		});
	});
}

module.exports = initSocketHandler;

