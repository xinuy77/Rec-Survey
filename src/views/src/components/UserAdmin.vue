<template>
  <div>
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
      />
    </transition>
    <UserListTable/>
  </div>
</template>

<script>
    import UserRegisterCard from "../components/UserRegisterCard.vue";
    import UserListTable    from "../components/UserListTable.vue";

    export default {
        name: 'default',
        components: {
            UserRegisterCard,
            UserListTable
        },
        data() {
            return {
                showUserRegister: false
            }
        },
        methods: {
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
