<template>
  <v-card
    id="register-card"
    v-if="showUserRegister"  
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
      <transition name="slide-fade">
        <span
          style="color:red"
          v-if="incorrect"
          >
          Incorrect username or password
        </span>
      </transition>
    <v-btn
      depressed
      color="primary"
      v-on:click="login()"
    >Register</v-btn>
    </v-form>
  </v-card>
</template>
