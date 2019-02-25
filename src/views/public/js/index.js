var videoEl;
var outputCroppedVideo;
var remoteVideo;

$(document).ready(function() {
	console.log("Hello vue");
	videoEl            = document.getElementById('inputVideo');
	outputCroppedVideo = document.getElementById('outputCroppedVideo');
	remoteVideo        = document.getElementById('remoteVideo');
	var canvas         = document.getElementById('overlay');
	if(canvas.getContext) {
		canvas.getContext('2d');
	}
	canvas.style.zIndex="-1";
	canvas.style.visibility = "hidden";
	canvas.style.position = "absolute";
	videoEl.style.visibility = "hidden";
	videoEl.style.zIndex = "-2";
	videoEl.style.position = "absolute";
	run();
	setState(I_CAN_START);
});

async function onPlay() {
	if(videoEl.paused || videoEl.ended || !isFaceDetectionModelLoaded()) {
		return setTimeout(() => onPlay());
	}
	const options = getFaceDetectorOptions();
	const result  = await faceapi.detectSingleFace(videoEl, options);
	
	if (result) {
		drawCroppedFaceToCanvas(result);
	}
	setTimeout(() => onPlay());
}

async function run() {
	// load face detection model
	await loadModel();
	// try to access users webcam and stream the images
	// to the video element
	const stream      = await navigator.mediaDevices.getUserMedia({ video: {} });
	videoEl.srcObject = stream;
}
