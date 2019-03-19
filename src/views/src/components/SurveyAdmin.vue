<template>
  <div>
    <v-card
      id="button-card"
    >
      <v-card-actions>
        <v-btn
          depressed
          color="primary"
          v-on:click="toggleSurveyRegisterCard()"
        >
          Create Survey
        </v-btn>
      </v-card-actions>
    </v-card>
    <SurveyRegisterCard/>
    <SurveyListTable
      v-bind:surveyList="surveyList"
    />
  </div>
</template>

<script>
    import config             from "../config";
    import SurveyListTable    from "../components/SurveyListTable.vue";
    import SurveyRegisterCard from "../components/SurveyRegisterCard.vue";

    export default {
        name: 'default',
        components: {
            SurveyListTable,
            SurveyRegisterCard
        },
        data() {
            return {
                surveyList: []
            }
        },
        methods: {
            getSurveyList() {
              return new Promise((resolve, reject)=>{
                  let url = config.API_URL + "/survey-list";
                  this.$axios.get(url).then(({data})=>{
                      resolve(data);
                  });
              });
            }
        },
        mounted() {
        },
        beforeMount() {
            this.getSurveyList().then((data)=>{
                this.surveyList = data;
            });
        }
    }
</script>

<style>
    #button-card {
        margin-bottom: 12px;
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
