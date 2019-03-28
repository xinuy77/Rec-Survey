<template>
  <div>
    <transition name="slide-fade">
      <v-alert
        v-if="showRemoved"
        v-model="showRemoved"
        type="success"
      >
        User removed.
      </v-alert>
      <v-alert
        v-if="showRegistered"
        v-model="showRegistered"
        type="success"
      >
        User registered.
      </v-alert>
      <v-alert
        v-if="showUpdated"
        v-model="showUpdated"
        type="success"
      >
        User updated.
      </v-alert>
      <v-alert
        v-if="showAssigned"
        v-model="showAssigned"
        type="success"
      >
        Survey assigned to user.
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
      <SurveyResultCard
        v-bind:selectedResult="selectedResult"
        v-if="showSurveyResult"
      />
    </transition>
    <transition name="slide-fade">
      <UserRegisterCard
        v-if="showUserRegister"
        @user-registered="handleFinishUserRegister()"
        @user-updated="handleFinishUserUpdate()"
        @user-removed="handleFinishUserRemove()"
        v-bind:editUser="editUser"
        v-bind:editUserMode="editUserMode"
      />
    </transition>
    <transition name="slide-fade">
      <AssignSurveyCard
        v-if="showAssignSurvey"
        v-bind:userList="userList"
        v-bind:selectedIndex="selectedIndex"
        @update-userlist="getUserList()"
        @survey-assigned="showAssignedNote()"
        @show-result="handleShowSurveyResult"
      />
    </transition>
    <UserListTable
      v-bind:userList="userList"
      @assign-survey="handleAssignSurvey"
      @edit-user="handleEditUser"
    />
  </div>
</template>

<script>
    import UserRegisterCard from "../components/UserRegisterCard.vue";
    import UserListTable    from "../components/UserListTable.vue";
    import AssignSurveyCard from "../components/AssignSurveyCard.vue";
    import SurveyResultCard from "../components/SurveyResultCard.vue";
    import config from "../config";

    export default {
        name: 'default',
        components: {
            UserRegisterCard,
            UserListTable,
            AssignSurveyCard,
            SurveyResultCard
        },
        data() {
            return {
                showUserRegister: false,
                showRegistered: false,
                showUpdated: false,
                showRemoved: false,
                showAssignSurvey: false,
                userList: [],
                selectedIndex: null,
                showAssigned: false,
                showSurveyResult: false,
                selectedResult: {},
                editUserMode: false,
                editUser: {}
            }
        },
        methods: {
            handleEditUser(user) {
                this.editUserMode     = true;
                this.editUser         = user;
                this.showUserRegister = true;
                this.showAssignSurvey = false;
            },
            handleShowSurveyResult(result) {
                this.selectedResult    = result;
                this.showSurveyResult  = true;
            },
            showAssignedNote() {
                this.showAssigned = true;
                setTimeout(()=>{
                    this.showAssigned = false;
                }, 3000);
            },
            handleAssignSurvey(index) {
                this.selectedIndex     = index;
                this.showAssignSurvey  = true;
                this.showUserRegister  = false;
                this.showSurveyResult  = false;
            },
            toggleUserRegisterCard() {
                if(this.showUserRegister) {
                  this.showUserRegister = false;
                }
                else {
                  this.editUser         = {};
                  this.editUserMode     = false;
                  this.showUserRegister = true;
                  this.showAssignSurvey = false;
                  this.showSurveyResult = false;
                }
            },
            handleFinishUserRegister() {
                this.showRegisteredNotification();
                this.showUserRegister = false;
                this.getUserList();
            },
            handleFinishUserUpdate() {
                this.showUpdatedNotification();
                this.showUserRegister = false;
                this.editUserMode     = false;
                this.editUser         = {};
                this.getUserList();
            },
            handleFinishUserRemove() {
                this.showRemovedNotification();
                this.showUserRegister = false;
                this.editUserMode     = false;
                this.editUser         = {};
                this.getUserList();
            },
            showRegisteredNotification() {
                this.showRegistered = true;
                setTimeout(()=>{
                    this.showRegistered = false;
                }, 3000);
            },
            showUpdatedNotification() {
                this.showUpdated = true;
                setTimeout(()=>{
                    this.showUpdated = false;
                }, 3000);
            },
            showRemovedNotification() {
                this.showRemoved = true;
                setTimeout(()=>{
                    this.showRemoved = false;
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
