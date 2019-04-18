<template>
  <v-app>
    <div id="app">
      <Toolbar
          v-bind:mode="mode"
          @next-pressed="next()"/>
      <transition name="slide-fade">
        <v-progress-linear
          :indeterminate="true"
          v-if="!loaded"
        ></v-progress-linear>
        <div v-else>
          <v-progress-linear
            :indeterminate="true"
            v-if="!recording"
          ></v-progress-linear>
          <div v-if="recording">
            <transition name="slide-fade">
              <v-alert
                v-model="alert"
                dismissible
                type="success"
                v-if="showRecordingAlert"
              >
                Recording has started.
              </v-alert>
            </transition>
            <div
              style="position: relative"
              class="margin"
            >
              <Card
                v-bind:mode="mode"
                v-bind:passage="survey.pas.text"
                v-bind:picturePath="survey.pic.path"
                @time-limit="next()"
              />
            </div>
            </div>
            <div v-else="noSurvey">
              <Card
                v-bind:mode="mode"
              />
          </div>
          <Recorder
            @record-started="startSurvey()"
            v-bind:mode="mode"
          />
        </div>
      </transition>
    </div>
  </v-app>
</template>

<script>
    import config    from "./config";
    import Toolbar   from "./components/Toolbar.vue";
    import Card      from "./components/Card.vue";
    import Recorder  from "./components/Recorder.vue";
    import Constants from "./constants";

    export default {
        name: 'SurveyApp',
        components: {
            Toolbar,
            Card,
            Recorder
        },
        data() {
          return {
            alert: true,
            loaded: false,
            recording: false,
            showRecordingAlert: false,
            surveyDone: false,
            survey: {},
            mode: Constants.MODE.PICTURE_MODE,
            surveyResult:{
                picture: {
                    startTime: 0,
                    endTime: 0
                },
                passageRead: {
                    startTime: 0,
                    endTime: 0
                },
                passageSpeak: {
                    startTime: 0,
                    endTime: 0
                },
                surveyDate: new Date().toDateString() + ' ' + new Date().toLocaleTimeString()
            },
            noSurvey: false
          }
        },
        methods: {
            postResult() {
                let url  = config.API_URL + "/result";
                let data = {
                    s_id: this.survey._id,
                    surveyResult: this.surveyResult,
                    identifier: this.survey.identifier
                };
                this.$axios.post(url, data);
            },
            startSurvey() {
                this.setRecording();
                this.surveyResult.picture.startTime = Date.now();
            },
            setRecording() {
                this.recording          = true;
                this.showRecordingAlert = true;
                setTimeout(()=>{this.showRecordingAlert = false},
                  2000
                );
            },
            testSwitch() {
                this.mode = Constants.MODE.PASSAGE_SPEAK_MODE;
            },
            checkSession() {
                let url = config.API_URL + "/session";
                this.$axios.get(url).catch(()=>{
                    window.location.href = "/login";
                });
            },
            getSurvey() {
                return new Promise((resolve)=> {
                    let url = config.API_URL + "/survey"
                    this.$axios.get(url).then(({data})=>{
                        resolve(data[0]);
                    }).catch(()=>{
                        this.mode     = Constants.MODE.NO_SURVEY;
                        this.noSurvey = true;
                        this.loaded   = true;
                        resolve(null);
                    });
                });
            },
            async load() {
                await loadModel();
                this.survey = await this.getSurvey();
                identifier  = this.survey.identifier;
                this.setStunAddress();
                this.setTurnAddress();
                this.loaded = true;
            },
            setStunAddress() {
                stun_url = {
                    "urls": config.STUN.urls
                };
            },
            setTurnAddress() {
                turn_url = {
                    "urls" : config.TURN.urls, 
                    "username": config.TURN.username, 
                    "credential": config.TURN.credential
                };
            },
            next() {
                const MODE = Constants.MODE;

                if(this.mode === MODE.PICTURE_MODE) {
                    this.surveyResult.picture.endTime       = Date.now();
                    this.surveyResult.passageRead.startTime = Date.now();
                    this.mode = MODE.PASSAGE_READ_MODE;
                    
                }
                else if(this.mode === MODE.PASSAGE_READ_MODE) {
                    this.surveyResult.passageRead.endTime    = Date.now();
                    this.surveyResult.passageSpeak.startTime = Date.now();
                    this.mode = MODE.PASSAGE_SPEAK_MODE;
                }
                else if(this.mode === MODE.PASSAGE_SPEAK_MODE) {
                    this.surveyResult.passageSpeak.endTime = Date.now();
                    this.mode = MODE.DONE;
                    this.postResult();
                    stop();
                }
            }
        },
        mounted() {
            this.checkSession();
            this.load();
        },
        beforeMount() {
        }
    }
</script>

<style>
    .bounce-enter-active {
        animation: bounce-in .5s;
    }
    .bounce-leave-active {
        animation: bounce-in .5s reverse;
    }
    .slide-fade-enter-active {
        transition: all .3s ease;
    }
    .slide-fade-leave-active {
        transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .slide-fade-enter, .slide-fade-leave-to
    {
        transform: translateX(10px);
        opacity: 0;
    }
</style>
