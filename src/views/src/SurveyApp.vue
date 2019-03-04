<template>
  <v-app>
    <div id="app">
      <Toolbar @next-pressed="next()"/>
      {{mode}}
      <transition name="slide-fade">
        <v-progress-linear
          :indeterminate="true"
          v-if="!loaded"
        ></v-progress-linear>
        <div v-else>
          <v-alert
            v-model="alert"
            dismissible
            type="success"
            v-if="recording"
          >
            Recording has started.
          </v-alert>
          <div
            style="position: relative"
            class="margin"
          >
            <Card
              v-bind:mode="mode"
              v-bind:passage="survey.pas.text"
            />
            <v-btn
              dark 
              onclick="start()"
              type="button"
            >
              Start Recording
            </v-btn>
            <v-btn
              dark
              v-on:click="testSwitch()"
              type="button"
            >
              Switch
            </v-btn>
            <v-btn 
              flat color="success"
              @click="alert = true"
            >
              success
            </v-btn>
            <Recorder/>
          </div>
        </div>
      </transition>
    </div>
  </v-app>
</template>

<script>
    import config    from "./config";
    import Toolbar   from "./components/Toolbar.vue";
    import Card      from "./components/Card.vue";
    import Loader    from "./components/Loader.vue";
    import Recorder  from "./components/Recorder.vue";
    import Constants from "./constants";

    export default {
        name: 'SurveyApp',
        components: {
            Toolbar,
            Card,
            Loader,
            Recorder
        },
        data() {
          return {
            alert: true,
            loaded: false,
            recording: false,
            survey: {},
            mode: Constants.MODE.PICTURE_MODE
          }
        },
        methods: {
            testSwitch() {
                this.mode = Constants.MODE.PASSAGE_SPEAK_MODE;
            },
            checkSession() {
                let url = config.API_URL + "/session";
                this.$axios.get(url).catch((error)=>{
                    window.location.href = "/login";
                });
            },
            getSurvey() {
                return new Promise((resolve)=> {
                    let url = config.API_URL + "/survey"
                    this.$axios.get(url).then(({data})=>{
                        resolve(data[0]);
                    });
                });
            },
            async load() {
                await loadModel();
                this.survey = await this.getSurvey();
                this.loaded = true;
            },
            next() {
                const MODE = Constants.MODE;

                if(this.mode === MODE.PICTURE_MODE) {
                    this.mode = MODE.PASSAGE_READ_MODE;
                }
                else if(this.mode === MODE.PASSAGE_READ_MODE) {
                    this.mode = MODE.PASSAGE_SPEAK_MODE;
                }
                else if(this.mode === MODE.PASSAGE_SPEAK_MODE) {
                    this.mode = MODE.DONE;
                }
            }
        },
        mounted() {
            console.log("monted");
        },
        beforeMount() {
            this.checkSession();
            this.load();
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
