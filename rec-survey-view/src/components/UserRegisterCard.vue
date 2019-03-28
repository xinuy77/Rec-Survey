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
            :type="'password'"
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
      v-if="!editUserMode"
      color="primary"
      v-on:click="register()"
    >Register</v-btn>
    <v-btn
      v-else
      depressed
      color="primary"
      v-on:click="updateUser()"
    >Update</v-btn>
    <v-btn
      depressed
      v-if="editUserMode"
      color="error"
      v-on:click="confirmRemove()"
    >Remove</v-btn>
        <span
          v-if="showDuplicatedErr"
          style="color:red"
            >Error: Duplicated Username, please use different name</span>
        <span
            v-if="showRequiredFieldErr"
          style="color:red"
            >Error: Missing required field, please fill out required field</span>
    </v-form>
    <v-dialog
      v-model="dialog"
      max-width="365"
    >
      <v-card>
        <v-card-text>
            All user data including survey results will be removed. <br>
            Would you like to remove user?
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="green darken-1"
            flat="flat"
            @click="dialog = false"
          >
            Continue
          </v-btn>

          <v-btn
            color="red"
            flat="flat"
            @click="removeUser()"
          >
            Remove
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
                         return true;
                    }
                ],
                showDuplicatedErr: false,
                showRequiredFieldErr: false,
                dialog: false
            }
        },
        props: {
            editUserMode: Boolean,
            editUser: {}
        },
        watch: {
            editUser() {
                this.setUserData();
            }
        },
        methods: {
            confirmRemove() {
                this.dialog = true;
            },
            setUserData() {
                this.username  = this.editUser.username;
                this.firstName = this.editUser.firstName;
                this.lastName  = this.editUser.lastName;
                this.isAdmin   = this.editUser.isAdmin;
            },
            validInput() {
                if(this.username != "" && this.password != "" &&
                   this.confirmPassword != "" && this.firstName != "" &&
                   this.lastName != "") {
                    if(this.password === this.confirmPassword) {
                        return true;
                    }
                }
                return false;
            },
            alertRequiredFieldErr() {
                this.showRequiredFieldErr = true;
                setTimeout(()=>{
                    this.showRequiredFieldErr = false;
                }, 3000);
            },
            alertDuplicatedErr() {
                this.showDuplicatedErr = true;
                setTimeout(()=>{
                    this.showDuplicatedErr = false;
                }, 3000);
            },
            removeUser() {
                let url = config.API_URL + "/user/" + this.editUser._id;
                this.$axios.delete(url).then(()=>{
                    this.dialog = false;
                    this.$emit("user-removed");
                });
            },
            register() {
                if(this.validInput()) {
                  let user = {
                      username: this.username,
                      password: this.password, 
                      firstName: this.firstName,
                      lastName: this.lastName,
                      isAdmin: this.isAdmin
                  };
                  let url = config.API_URL + "/register";
                  this.$axios.post(url, user).then(()=>{
                      this.$emit('user-registered');
                  }).catch(()=>{
                      this.alertDuplicatedErr();
                  });
                }
                else {
                    this.alertRequiredFieldErr();
                }
            },
            updateUser() {
                if(this.validInput()) {
                  let user = {
                      _id: this.editUser._id,
                      username: this.username,
                      password: this.password, 
                      firstName: this.firstName,
                      lastName: this.lastName,
                      isAdmin: this.isAdmin
                  };
                  let url = config.API_URL + "/user";
                  this.$axios.put(url, user).then(()=>{
                      this.$emit('user-updated');
                  }).catch(()=>{
                      this.alertDuplicatedErr();
                  });
                }
                else {
                    this.alertRequiredFieldErr();
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
            this.username  = this.editUser.username;
            this.firstName = this.editUser.firstName;
            this.lastName  = this.editUser.lastName;
            if(this.editUser.isAdmin) {
                this.isAdmin = true;
            }
            else {
                this.isAdmin = false;
            }
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
