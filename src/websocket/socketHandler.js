const ws                = require('ws');
const kurentoController = require('../kurento').kurentoController;
const recordUri         = 'file:///tmp/';
const kurentoUri        = 'ws://192.168.0.121:8888/kurento';
//const kurentoUri        = 'ws://localhost:8888/kurento';
const dbControl         = require('../mongo').Controller;

function initSocketHandler(app, server, sessionHandler) {
	let wss = new ws.Server({
		server : server,
		path : '/websocket'
	});


	/*
	 * Management of WebSocket messages
	 */
	wss.on('connection', function(ws, req) {
		let u_id      = null;
        let request   = req;
		let response  = {
			writeHead : {}
		};

        sessionHandler(request, response, function() {
            if(!request.session.user) {
                console.log("This session is not established");
                return;
            }
            u_id = request.session.user;
			console.log('Connection received with userId ' + request.session.user);
		});

		ws.on('error', function() {
            if(!u_id) {
                return;
            }
			console.log('Connection ' + u_id + ' error');
			kurentoController.stop(u_id);
		});

		ws.on('close', function() {
            if(!u_id) {
                return;
            }
			console.log('Connection ' + u_id + ' closed');
             kurentoController.stop(u_id);
		});

		ws.on('message', function(_message) {
            if(!u_id) {
                return;
            }
			let message  = JSON.parse(_message); //TODO add s_id in message at client side
            let fileName = "" + new Date() + ".mp4";
            let r_uri    = recordUri + fileName;


			console.log('Connection ' + request.session.user + ' received message ', message);
			console.log(message.id);

             if(message.id === 'start' ) {
                let s_id  = message.s_id;

                setFilePath(s_id, u_id, r_uri, (res, err)=>{
                    if(err) {
                        return;
                    }
                    console.log("starting!!!");
                    kurentoController.start(u_id, ws, message.sdpOffer, kurentoUri, r_uri, function(error, sdpAnswer) {
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
                });
            }
            else if(message.id === 'stop') {
                kurentoController.stop(u_id);
            }
			else if(message.id === 'onIceCandidate') {
                kurentoController.onIceCandidate(u_id, message.candidate);
            }
			else {
                ws.send(JSON.stringify({
                    id : 'error',
                    message : 'Invalid message ' + message
                }));
            }

		});
	});
}

function setFilePath(s_id, u_id, r_uri, callback) {
    dbControl.getUserById(u_id, (result, err)=>{
        if(!result || err) {
            callback(null, true);
            return;
        }

        for(let i = 0; i < result.assignedSurvey.length; i++) {
            if(result.assignedSurvey.s_id != s_id) {
                continue;
            }
            if(!result.assignedSurvey.videoPath) {
                result.assignedSurvey.videoPath = [r_uri];
            }
            else {
                result.assignedSurvey.videoPath.push(r_uri);
            }
            break;
        }

        dbControl.updateUser(result, (result, err)=>{
            if(err) {
                callback(null, err)
                return;
            }
            callback(result, err);
            return;
        });
    });
}

module.exports = initSocketHandler;

