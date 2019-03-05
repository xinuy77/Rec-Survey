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
    >
      Next Question
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
    import config from "../config";
    export default {
        name: 'SurveyApp',
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
        }
    }
</script>
