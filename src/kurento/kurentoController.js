var kurento         = require('kurento-client');
var candidatesQueue = {};
var sessions        = {};
var kurentoClient   = null;

function getKurentoClient(uri, callback) {
    if (kurentoClient !== null) {
        return callback(null, kurentoClient);
    }
	console.log("URI!!");
	console.log(uri);
    kurento(uri, function(error, _kurentoClient) {
        if (error) {
            console.log("Could not find media server at address xxx");
            return callback("Could not find media server at address" + "xxx"
                    + ". Exiting with error " + error);
        }

        kurentoClient = _kurentoClient;
        callback(null, kurentoClient);
    });
}

function start(sessionId, ws, sdpOffer, kurentoUri, recordUri, callback) {
	console.log("starting...");
    if (!sessionId) {
        return callback('Cannot use undefined sessionId');
    }
	console.log("getting currento client");
    getKurentoClient(kurentoUri, function(error, kurentoClient) {
        if (error) {
			console.log("error!");
			console.log(error);
            return callback(error);
        }
		console.log("creating media pipeline");
        kurentoClient.create('MediaPipeline', function(error, pipeline) {
            if (error) {
                return callback(error);
            }

			console.log("creating media elements");
            createMediaElements(pipeline, ws, function(error, webRtcEndpoint) {
                if (error) {
                    pipeline.release();
                    return callback(error);
                }

                if (candidatesQueue[sessionId]) {
                    while(candidatesQueue[sessionId].length) {
                        var candidate = candidatesQueue[sessionId].shift();
                        webRtcEndpoint.addIceCandidate(candidate);
                    }
                }
				console.log("creating recorder endpoint");
				createRecorderEndpoint(recordUri, pipeline, (error, recorderEndpoint)=>{
					if (error) {
						pipeline.release();
						return callback(error);
					}
					webRtcEndpoint.connect(recorderEndpoint, (error)=>{
						if (error) {
							pipeline.release();
							return callback(error);
						}
						recorderEndpoint.record((result)=>{
							console.log("started recording..");
							console.log(result);
						});
					});

				});
				
                connectMediaElements(webRtcEndpoint, function(error) {
                    if (error) {
                        pipeline.release();
                        return callback(error);
                    }

                    webRtcEndpoint.on('OnIceCandidate', function(event) {
                        var candidate = kurento.getComplexType('IceCandidate')(event.candidate);
                        ws.send(JSON.stringify({
                            id : 'iceCandidate',
                            candidate : candidate
                        }));
                    });

                    webRtcEndpoint.processOffer(sdpOffer, function(error, sdpAnswer) {
                        if (error) {
                            pipeline.release();
                            return callback(error);
                        }

                        sessions[sessionId] = {
                            'pipeline' : pipeline,
                            'webRtcEndpoint' : webRtcEndpoint
                        }
                        return callback(null, sdpAnswer);
                    });

                    webRtcEndpoint.gatherCandidates(function(error) {
                        if (error) {
                            return callback(error);
                        }
                    });
                });
            });
        });
    });
}

function createMediaElements(pipeline, ws, callback) {
    pipeline.create('WebRtcEndpoint', function(error, webRtcEndpoint) {
        if (error) {
            return callback(error);
        }

        return callback(null, webRtcEndpoint);
    });
}

function createRecorderEndpoint(uri, pipeline, callback) {
	pipeline.create('RecorderEndpoint', {uri: uri, mediaProfile: 'WEBM_VIDEO_ONLY'}, (error, recorderEndpoint)=>{
		if(error) {
			return callback(error);
		}
		return callback(null, recorderEndpoint);
	});
}

function connectMediaElements(webRtcEndpoint, callback) {
    webRtcEndpoint.connect(webRtcEndpoint, function(error) {
        if (error) {
            return callback(error);
        }
        return callback(null);
    });
}

function stop(sessionId) {
    if (sessions[sessionId]) {
        var pipeline = sessions[sessionId].pipeline;
        console.info('Releasing pipeline');
        pipeline.release();

        delete sessions[sessionId];
        delete candidatesQueue[sessionId];
    }
}

function onIceCandidate(sessionId, _candidate) {
    var candidate = kurento.getComplexType('IceCandidate')(_candidate);

    if (sessions[sessionId]) {
        console.info('Sending candidate');
        var webRtcEndpoint = sessions[sessionId].webRtcEndpoint;
        webRtcEndpoint.addIceCandidate(candidate);
    }
    else {
        console.info('Queueing candidate');
        if (!candidatesQueue[sessionId]) {
            candidatesQueue[sessionId] = [];
        }
        candidatesQueue[sessionId].push(candidate);
    }
}

module.exports = {
	getKurentoClient:       getKurentoClient,
	start:                  start,
	createMediaElements:    createMediaElements,
	createRecorderEndpoint: createRecorderEndpoint,
	connectMediaElements:   connectMediaElements,
	stop:                   stop,
	onIceCandidate:         onIceCandidate
};
