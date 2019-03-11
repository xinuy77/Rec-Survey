<template>
  <v-toolbar id="toolbar">
    <v-toolbar-title>
      Rect Survey
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn 
      round 
      color="primary"
      v-on:click="emitNextPressed()"
      v-if="!done"
    >
      Next
    </v-btn>
    <v-spacer></v-spacer>
    <v-toolbar-items>
      <v-btn
        flat
        v-on:click="logout()"
      >
        logout
      </v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
    import config    from "../config";
    import Constants from "../constants"; 

    export default {
        name: 'SurveyApp', 
        data() {
            return {
                done: false
            }
        },
        props: {
            mode: Number
        },
        methods: {
            logout() {
                let url = config.API_URL + "/logout";
                this.$axios.get(url).then(()=>{
                    window.location.href = "/login";
                });
            },
            emitNextPressed() {
                this.$emit('next-pressed');
            }
        },
        watch: {
            mode() {
                if(this.mode === Constants.MODE.DONE || this.mode === Constants.MODE.NO_SURVEY) {
                    this.done = true;
                }
            }
        }
    }
</script>
