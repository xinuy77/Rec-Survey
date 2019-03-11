var videoEl;
var outputCroppedVideo;
var remoteVideo;

$(document).ready(function() {
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
	//await loadModel();
	// try to access users webcam and stream the images
	// to the video element
	const stream      = await navigator.mediaDevices.getUserMedia({audio:true, video: {} });
	videoEl.srcObject = stream;
}
