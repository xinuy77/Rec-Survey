<template>
  <div>
    <transition name="slide-fade">
      <v-alert
        v-if="showRegistered"
        v-model="showRegistered"
        type="success"
      >
        User registered.
      </v-alert>
    </transition>
    <v-card
      id="button-card"
    >
      <v-card-actions>
        <v-btn 
          depressed
          color="primary"
          v-on:click="toggleUserRegisterCard()"
        >
          Create User
        </v-btn>
      </v-card-actions>
    </v-card>
    <transition name="slide-fade">
      <UserRegisterCard
        v-if="showUserRegister"
        @user-registered="handleFinishUserRegister()"
      />
      <AssignSurveyCard
        v-if="showAssignSurvey"
        v-bind:userList="userList"
        v-bind:selectedIndex="selectedIndex"
        @assigned-survey="getUserList()"
      />
    </transition>
    <UserListTable
      v-bind:userList="userList"
      @assign-survey="handleAssignSurvey"
    />
  </div>
</template>

<script>
    import UserRegisterCard from "../components/UserRegisterCard.vue";
    import UserListTable    from "../components/UserListTable.vue";
    import AssignSurveyCard from "../components/AssignSurveyCard.vue";
    import config from "../config";

    export default {
        name: 'default',
        components: {
            UserRegisterCard,
            UserListTable,
            AssignSurveyCard
        },
        data() {
            return {
                showUserRegister: false,
                showRegistered: false,
                showAssignSurvey: false,
                userList: [],
                selectedIndex: null
            }
        },
        methods: {
            handleAssignSurvey(index) {
                this.selectedIndex     = index;
                this.showAssignSurvey  = true;
                this.showUserRegister  = false;
            },
            toggleUserRegisterCard() {
                if(this.showUserRegister) {
                  this.showUserRegister = false;
                }
                else {
                  this.showUserRegister = true;
                  this.showAssignSurvey = false;
                }
            },
            handleFinishUserRegister() {
                this.showRegisteredNotification();
                this.showUserRegister = false;
            },
            showRegisteredNotification() {
                this.showRegistered = true;
                setTimeout(()=>{
                    this.showRegistered = false;
                }, 3000);
            },
            getUserList() {
                let url = config.API_URL + "/users";
                this.$axios.get(url).then(({data})=>{
                    this.userList = data;
                });
            }
        },
        mounted() {
        },
        beforeMount() {
            this.getUserList();
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
