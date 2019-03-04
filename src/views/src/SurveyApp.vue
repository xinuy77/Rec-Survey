<template>
  <v-app>
    <div id="app">
      <Toolbar/>
      <loader
        v-if="!loaded"
      />
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
          <Card/>
          <v-btn 
            dark 
            onclick="start()"
            type="button"
          >
            Start Recording
          </v-btn>
          <v-btn 
            flat color="success"
            @click="alert = true"  
          >
            success
          </v-btn>
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
      </div>
    </div>
  </v-app>
</template>

<script>
    import config  from "./config";
    import Toolbar from "./components/Toolbar.vue";
    import Card    from "./components/Card.vue";
    import Loader  from "./components/Loader.vue";

    export default {
        name: 'SurveyApp',
        components: {
            Toolbar,
            Card,
            Loader
        },
        data() {
          return {
            alert: true,
            loaded: false,
            recording: false
          }
        },
        methods: {
            checkSession() {
                let url = config.API_URL + "/session";
                this.$axios.get(url).catch((error)=>{
                    window.location.href = "/login";
                });
            },
            async loadModel() {
                await loadModel();
                this.loaded = true;
            }
        },
        mounted() {
            console.log("monted");
        },
        beforeMount() {
            this.checkSession();
            this.loadModel();
        }
    }
</script>
