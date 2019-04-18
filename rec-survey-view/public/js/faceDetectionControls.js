const SSD_MOBILENETV1    = 'ssd_mobilenetv1';
const TINY_FACE_DETECTOR = 'tiny_face_detector';
const MTCNN              = 'mtcnn';

let selectedFaceDetector = SSD_MOBILENETV1;
// ssd_mobilenetv1 options
let minConfidence        = 0.5;
// tiny_face_detector options
let inputSize            = 512;
let scoreThreshold       = 0.5;
//mtcnn options
let minFaceSize          = 20;
let box                  = {
    x: null,
    y: null,
    width: null,
    height: null
};

function getFaceDetectorOptions() {
	return selectedFaceDetector === SSD_MOBILENETV1
	? new faceapi.SsdMobilenetv1Options({ minConfidence })
	: (
		selectedFaceDetector === TINY_FACE_DETECTOR
		? new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })
		: new faceapi.MtcnnOptions({ minFaceSize })
	);
}

function getCurrentFaceDetectionNet() {
	if (selectedFaceDetector === SSD_MOBILENETV1) {
		return faceapi.nets.ssdMobilenetv1;
	}
	if (selectedFaceDetector === TINY_FACE_DETECTOR) {
		return faceapi.nets.tinyFaceDetector;
	}
	if (selectedFaceDetector === MTCNN) {
		return faceapi.nets.mtcnn;
	}
}

function isFaceDetectionModelLoaded() {
	return !!getCurrentFaceDetectionNet().params;
}

async function loadModel() {
  if (!isFaceDetectionModelLoaded()) {
      await faceapi.nets.ssdMobilenetv1.load('/models');
  }
}

function drawCroppedFaceToCanvas(result) {
	var localVideo = $('#inputVideo').get(0);
	var inputCtx   = $( '#overlay' )[ 0 ].getContext( '2d' );
	if(result) {
        if(result.box) {
            box.x = result.box.x;
            box.y = result.box.y;
            if(!box.width) {
                box.width  = result.box.width * 1.3;
                box.height = result.box.height * 1.3;
            }
        }
    }
	// draw video to input canvas
	inputCtx.drawImage( 
		localVideo, 
		box.x, box.y, 
		box.width, box.height,
		0, 0, 
		640, 480
	);
}
