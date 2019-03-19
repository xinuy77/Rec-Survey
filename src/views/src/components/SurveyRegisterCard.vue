<template>
  <v-card
    id="register-card"
  >
    <v-form
      ref="form"
      lazy-validation
      id="form"
    >
    <v-layout>
      <v-flex xs12 sd8>
        <v-text-field
          v-model="username"
          label="Username"
          :rules="rules"
          required
        ></v-text-field>
      </v-flex>
    </v-layout>
      <v-layout>
        <v-flex xs12 sd4>
          <v-text-field
            v-model="password"
            label="Password"
            :type="'password'"
            :rules="rules"
            required
          ></v-text-field>
        </v-flex>
        <v-flex xs12 sd4>
          <v-text-field
            v-model="confirmPassword"
            label="Confirm Password"
            :type="'confirmPassword'"
            :rules="rulesConfirm"
            required
          ></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout>
        <v-flex xs12 sd4>
          <v-text-field
            v-model="firstName"
            label="First Name"
            :rules="rules"
            required
          ></v-text-field>
          <v-checkbox
            v-model="isAdmin"
            :label="'Administrator'"
          >
          </v-checkbox>
        </v-flex>
        <v-flex xs12 sd4>
          <v-text-field
            v-model="lastName"
            label="Last Name"
            :rules="rules"
            required
          ></v-text-field>
        </v-flex>
      </v-layout>
    <v-btn
      depressed
      color="primary"
      v-on:click="register()"
    >Register</v-btn>
    </v-form>
  </v-card>
</template>

<script>
    import config from "../config";
    
    export default {
        data() {
            return {
                username: "",
                password: "",
                firstName: "",
                lastName: "",
                confirmPassword: "",
                isAdmin: false,
                rules:[
                    v=> !!v || 'this field is required'
                ],
                rulesConfirm:[
                    (v)=> {
                      if(v === "") {
                        return 'this field is required'
                      }
                      if(this.password != v) {
                          return 'password does not match';
                      }
                    }
                ]
                
            }
        },
        methods: {
            register() {
                if(this.username != "" && this.password != "" &&
                   this.confirmPassword != "" && this.firstName != "" &&
                   this.lastName != "") {
                  if(this.password != this.confirmPassword) {
                    return;
                  }
                  
                  let user = {
                      username: this.username,
                      password: this.password, 
                      firstName: this.firstName,
                      lastName: this.lastName,
                      isAdmin: this.isAdmin
                  };
                  let url = config.API_URL + "/register";
                  console.log(url);
                  this.$axios.post(url, user).then(()=>{
                      this.$emit('user-registered');
                  });
                }
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
            }
        },
        mounted() {
        },
        beforeMount() {
        }
    }
</script>

<style>
    #register-card{
        margin-bottom: 12px;
    }
    #form {
        padding: 10px;
    }
    .flex {
        padding: 8px;
    }
</style>
