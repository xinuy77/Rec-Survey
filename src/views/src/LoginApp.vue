<template>
  <v-app>
    <v-layout row wrap align-center id="layout">
      <v-flex xs10 sm4 offset-sm4>
        <v-card id="card">
          Rec-Survey
          <h2 class="headline mb-0">Login</h2>
          <v-form
            ref="form"
            lazy-validation
            id="form"
          >
            <v-text-field
              v-model="username"
              label="Username"
              :rules="rules"
              required
              v-on:keyup.enter="login()"
            ></v-text-field>
            <v-text-field
              v-model="password"
              label="Password"
              :type="'password'"
              :rules="rules"
              required
              v-on:keyup.enter="login()"
            ></v-text-field>
            <transition name="slide-fade">
              <span 
                style="color:red"
                v-if="incorrect"
                >
                Incorrect username or password
              </span>
            </transition>
          </v-form>
          <v-btn 
            raised 
            color="primary"
            v-on:click="login()"
          >Next</v-btn>
        </v-card>
      </v-flex>
    </v-layout>
  </v-app>
</template>

<style lang="scss">
    #card {
        margin: 20px;
        padding: 20px;
    }
    #layout {
        text-align: center;
    }
    #form {
        display: inline-block;
        width: 100%;
    }
    .bounce-enter-active {
        animation: bounce-in .5s;
    }
    .bounce-leave-active {
        animation: bounce-in .5s reverse;
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

<script>
    import config from "./config";

    export default {
        name: 'login',
        data() {
            return {
                username:"",
                password:"",
                rules:[
                    v=> !!v || 'this field is required'
                ],
                incorrect: false
            }
        },
        methods: {
            login() {
                let url = config.API_URL + "/login";
                if(this.username != "" && this.password != "") {
                    let credential = {
                        username: this.username,
                        password: this.password
                    };
                    this.$axios.post(url, credential).then((res)=>{
                        window.location.href = "/survey";
                    }).catch((err)=>{
                        this.incorrect = true;
                        setTimeout(()=>{
                            this.incorrect = false;
                        }, 2000);
                    });
                }
                else {
                    this.incorrect = true;
                    setTimeout(()=>{
                        this.incorrect = false;
                    }, 2000);
                }
            }
        },
        beforeMount() {
            let url = config.API_URL + "/session";
            this.$axios.get(url).then((result)=>{
                window.location.href = "/survey";
            });
        }
    }
</script>
