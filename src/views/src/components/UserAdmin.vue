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
        v-bind:user="user"
      />
    </transition>
    <UserListTable
      @assign-survey="handleAssignSurvey"
    />
  </div>
</template>

<script>
    import UserRegisterCard from "../components/UserRegisterCard.vue";
    import UserListTable    from "../components/UserListTable.vue";
    import AssignSurveyCard from "../components/AssignSurveyCard.vue";

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
                showAssignSurvey: true,
                user: null
            }
        },
        methods: {
            handleAssignSurvey(user) {
                this.user = user;
            },
            sayHi() {
                console.log("Hi");
            },
            toggleUserRegisterCard() {
                if(this.showUserRegister) {
                  this.showUserRegister = false;
                }
                else {
                  this.showUserRegister = true;
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
            }
        },
        mounted() {
        },
        beforeMount() {
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
