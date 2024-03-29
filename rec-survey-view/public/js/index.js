var videoEl;
var outputCroppedVideo;
var remoteVideo;
var faceDetected = false;

$(document).ready(function() {
});

async function onPlay() {
	if(videoEl.paused || videoEl.ended || !isFaceDetectionModelLoaded()) {
		return setTimeout(() => onPlay());
	}
	const options = getFaceDetectorOptions();
	const result  = await faceapi.detectSingleFace(videoEl, options);
	if(result) {
        faceDetected = true;
    }

	var draw = setInterval(()=>{drawCroppedFaceToCanvas(result)}, 10);
	setTimeout(() => {    
        clearInterval(draw);
        onPlay();
    }, 1000);
}

async function run() {
	// load face detection model
	//await loadModel();
	// try to access users webcam and stream the images
	// to the video element
	const stream      = await navigator.mediaDevices.getUserMedia({audio:true, video: {} });
	videoEl.srcObject = stream;
}
