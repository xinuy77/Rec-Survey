<template>
  <div>
    <transition name="slide-fade">
      <v-alert
        v-if="showRegistered"
        v-model="showRegistered"
        type="success"
      >
        Survey registered.
      </v-alert>
      <v-alert
        v-if="showRemoved"
        v-model="showRemoved"
        type="success"
      >
        Survey removed.
      </v-alert>
    </transition>
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
    <transition name="slide-fade">
      <SurveyRegisterCard
          v-if="showSurveyRegisterCard"
          @survey-registered="handleSurveyRegistered()"
      />
    </transition>
    <SurveyListTable
      v-bind:surveyList="surveyList"
      @survey-removed="handleSurveyRemoved()"
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
                surveyList: [],
                showSurveyRegisterCard: false,
                showRegistered: false,
                showRemoved: false
            }
        },
        methods: {
            async handleSurveyRemoved() {
                this.surveyList  = await this.getSurveyList();
                this.showRemoved = true;
                setTimeout(()=>{
                    this.showRemoved = false;
                }, 3000);
            },
            async handleSurveyRegistered() {
                this.toggleSurveyRegisterCard();
                this.surveyList     = await this.getSurveyList();
                this.showRegistered = true;
                setTimeout(()=>{
                    this.showRegistered = false;
                }, 3000);
            },
            getSurveyList() {
                return new Promise((resolve, reject)=>{
                    let url = config.API_URL + "/survey-list";
                    this.$axios.get(url).then(({data})=>{
                        resolve(data);
                    });
                });
            },
            toggleSurveyRegisterCard() {
                if(this.showSurveyRegisterCard) {
                    this.showSurveyRegisterCard = false;
                }
                else {
                    this.showSurveyRegisterCard = true;
                }
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
