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
    <!--<video  id="remoteVideo" autoplay muted></video>-->
  </div>
</template>

<script>
    import Constants from "../constants";

    export default {
        name: 'Recorder',
        data() {
          return {
          }
        },
        methods: {
            emitRecordStarted() {
                this.$emit('record-started');
            },
            record() {
                if(faceDetected) {
                    startRecord();
                    this.emitRecordStarted();
                }
                else {
                    setTimeout(()=>this.record());
                }
            }
        },
        props: {
            mode: Number,
        },
        mounted() {
            videoEl            = document.getElementById('inputVideo');
            outputCroppedVideo = document.getElementById('outputCroppedVideo');
            remoteVideo        = document.getElementById('remoteVideo');
            let canvas         = document.getElementById('overlay');

            if(canvas.getContext) {
                canvas.getContext('2d');
            }

            setState(I_CAN_START);
            if(this.mode != Constants.MODE.NO_SURVEY) {
                run().then(()=>{
                    this.record();
                });
            }
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
