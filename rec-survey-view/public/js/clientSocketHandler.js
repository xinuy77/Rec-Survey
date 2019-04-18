var turn_url      = null;
var stun_url      = null;
var webSocketHost = location.hostname;
var ws            = new WebSocket('wss://' + webSocketHost +  '/api/websocket');
var webRtcPeer;
var state = null;
var identifier = null;

const I_CAN_START = 0;
const I_CAN_STOP = 1;
const I_AM_STARTING = 2;

window.onbeforeunload = function() {
	ws.close();
}

ws.onmessage = function(message) {
	var parsedMessage = JSON.parse(message.data);
	console.info('Received message: ' + message.data);

	switch (parsedMessage.id) {
	case 'startResponse':
		startResponse(parsedMessage);
		break;
	case 'error':
		if (state == I_AM_STARTING) {
			setState(I_CAN_START);
		}
		onError('Error message from server: ' + parsedMessage.message);
		break;
	case 'iceCandidate':
		webRtcPeer.addIceCandidate(parsedMessage.candidate)
		break;
	default:
		if (state == I_AM_STARTING) {
			setState(I_CAN_START);
		}
		onError('Unrecognized message', parsedMessage);
	}
}

function startRecord() {
	console.log('Starting video call ...')

	// Disable start button
	setState(I_AM_STARTING);

	console.log('Creating WebRtcPeer and generating local sdp offer ...');
	console.log('this is stream');
    console.log(outputCroppedVideo);
	console.log("lookup");
    console.log(stun_url);
    console.log(turn_url);
	var options = {
	  remoteVideo:     remoteVideo,
	  mediaConstraints: {
	  	audio: true,
		video: {
			width: 640,
			framerate: 15
		}
	  },
      onicecandidate : onIceCandidate,
      configuration: {
            iceServers: [stun_url, turn_url]
      }
    }

    webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerSendrecv(options, function(error) {
        if(error) return onError(error);
        if(identifier != null) 
            this.generateOffer(onOffer);
    });
}

function onIceCandidate(candidate) {
	   console.log('Local candidate' + JSON.stringify(candidate));

	   var message = {
	      id : 'onIceCandidate',
	      candidate : candidate
	   };
	   sendMessage(message);
}

function onOffer(error, offerSdp) {
	if(error) return onError(error);

	console.info('Invoking SDP offer callback function ' + location.host);

    var message = {
		id : 'start',
		sdpOffer : offerSdp,
        identifier: identifier
	}
	sendMessage(message);
}

function onError(error) {
	console.error(error);
}

function startResponse(message) {
	setState(I_CAN_STOP);
	console.log('SDP answer received from server. Processing ...');
	webRtcPeer.processAnswer(message.sdpAnswer);
}

function stop() {
	console.log('Stopping video call ...');
	setState(I_CAN_START);
	if (webRtcPeer) {
		webRtcPeer.dispose();
		webRtcPeer = null;

		var message = {
			id : 'stop'
		}
		sendMessage(message);
	}
    videoEl.srcObject.getTracks()[0].stop();
    videoEl.srcObject.getTracks()[1].stop();
}

function setState(nextState) {
	state = nextState;
}

function sendMessage(message) {
	var jsonMessage = JSON.stringify(message);
	console.log('Senging message: ' + jsonMessage);
	ws.send(jsonMessage);
}

