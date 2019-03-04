<template>
  <div>
    <video
      onplay="onPlay(this)"
      id="inputVideo" 
      autoplay 
      muted
    ></video>
    <canvas 
      id="overlay"
      width="640"
      height="480"
    ></canvas>
    <video  id="remoteVideo" autoplay muted></video>
  </div>
</template>

<script>
    export default {
        name: 'Recorder',
        data() {
          return {
          }
        },
        methods: {
        },
        mounted() {
            videoEl            = document.getElementById('inputVideo');
            outputCroppedVideo = document.getElementById('outputCroppedVideo');
            remoteVideo        = document.getElementById('remoteVideo');
            let canvas         = document.getElementById('overlay');
            if(canvas.getContext) {
                canvas.getContext('2d');
            }
            console.log(videoEl);
            console.log(remoteVideo);
            console.log(canvas);
            setState(I_CAN_START);
            run();
        }
    }
</script>

<style>
    #overlay {
        z-index: -3;
        visibility: hidden;
        position: absolute;
    }
    #inputVideo {
        visibility: hidden;
        position: absolute;
        z-index: -2;
    }
</style>
