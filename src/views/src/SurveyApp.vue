<template>
  <v-app>
    <div id="app">

      <Toolbar/>

        <v-alert
        v-model="alert"
        dismissible
        type="success"
      >
        Recording has started.
      </v-alert>
      
      <div style="position: relative" class="margin">
        <video onplay="onPlay(this)" id="inputVideo" autoplay muted></video>
        <canvas id="overlay" width="640" height="480"></canvas>
        <!--<video  id="remoteVideo" autoplay muted></video>-->

        <Card/>
        
        <v-btn dark onclick="start()" type="button">Start Recording</v-btn> 
        <v-btn flat>logout</v-btn>
        <v-btn 
          flat color="success"
          @click="alert = true"  
        >
          success
        </v-btn>
      
      </div>
    </div>
  </v-app>
</template>

<script>
  import Toolbar from "./components/Toolbar.vue";
  import Card    from "./components/Card.vue";
   
  export default {
    name: 'SurveyApp',
    components: {
      Toolbar,
      Card
    },
    data() {
      return {
        alert: true
      }
    }
  }
</script>