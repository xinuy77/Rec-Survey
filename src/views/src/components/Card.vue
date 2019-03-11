<template>
  <v-flex xs12 sm6 offset-sm3>
    <v-card
      id="card"
      v-if="readMode"
    >
      <v-card-title primary-title>
        <div>
          <h3 
            class="headline mb-0"
          >
            Please read following passage below within {{timer_min}} minutes and {{timer_sec}} seconds.
          </h3>
          <div id="passage">
            {{passage}}
          </div>
        </div>
      </v-card-title>
    </v-card>
    <v-card 
      id="card"
      v-if="speakMode"
    >
      <v-card-title primary-title>
        <div>
          <h3
            class="headline mb-0"
          >
            Please retell passage you've read within {{timer_min}} minutes and {{timer_sec}} seconds.
          </h3>
        </div>
      </v-card-title>
    </v-card>
    <v-card
      id="card"
      v-else-if="pictureMode"
    >
      <v-card-title primary-title>
        <div>
          <h3 class="headline mb-0">
            Please speak out and describe following picture below within {{timer_min}} min and {{timer_sec}} seconds.
          </h3>
        </div>
      </v-card-title>
     <v-img
      :src="require('../assets/'+picturePath)"
     ></v-img>
    </v-card>
    <v-card
      id="card"
      v-else-if="done"
    >
      <v-card-title primary-title>
        <div>
          <h3 class="headline mb-0">
              You have finished the survey.
          </h3>
        </div>
      </v-card-title>
    </v-card>
    <v-card
      id="card"
      v-else-if="noSurvey"
    >
      <v-card-title primary-title>
        <div>
          <h3 class="headline mb-0">
              You have no survey assigned. Please contact the administrator.
          </h3>
        </div>
      </v-card-title>
    </v-card>
  </v-flex>
</template>

<script>
    import Constants from "../constants";

    export default {
        name: 'Card',
        data() {
            return {
                timer_min:   0,
                timer_sec:   10,
                timerIsOn:   false,
                readMode:    false,
                speakMode:   false,
                pictureMode: false,
                done:        false,
                noSurvey:    false
            }
        },
        props: {
            mode: Number,
            passage: String,
            picturePath: String
        },
        methods: {
            emitTimeLimit() {
                this.$emit("time-limit");
            },
            resetTimer() {
              this.timer_min = 0;
              this.timer_sec = 10;
            },
            count() {
                if(this.timer_sec == 0 && this.timer_min > 0) {
                    this.timer_sec = 59;
                    this.timer_min--;
                }
                else if(this.timer_sec > 0 && this.timer_min >= 0) {
                    this.timer_sec--;
                }
                else if(this.timer_sec === 0 && this.timer_min === 0) {
                    this.emitTimeLimit();
                }
            },
            startTimer() {
                this.timerIsOn = true;
                setInterval(()=>{this.count()}, 1000);
            },
            switchMode() {
                if(this.mode === Constants.MODE.PASSAGE_READ_MODE) {
                    this.readMode    = true;
                    this.speakMode   = false;
                    this.pictureMode = false;
                }
                else if(this.mode === Constants.MODE.PASSAGE_SPEAK_MODE) {
                    this.speakMode   = true;
                    this.readMode    = false;
                    this.pictureMode = false;
                }
                else if(this.mode === Constants.MODE.PICTURE_MODE) {
                    this.pictureMode = true;
                    this.speakMode   = false;
                    this.readMode    = false;
                }
                else if(this.mode === Constants.MODE.DONE){
                    this.done        = true;
                    this.pictureMode = false;
                    this.speakMode   = false;
                    this.readMode    = false;
                }
                else {
                    this.noSurvey = true;
                }
            }
        },
        watch: {
            mode(newVal) {
                this.timerIsOn = false;
                this.resetTimer();
                this.switchMode();
                this.timerIsOn = true;
            }
        },
        mounted() {
            this.startTimer();
            this.switchMode();
        }
    }
</script>

<style lang="scss">
  #card {
    margin-top: 20px;
  }

  #passage {
    font-size: 20px;
    font-family: cursive
  }
</style>
