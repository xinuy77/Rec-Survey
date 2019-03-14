<template>
  <v-card
    id="register-card"
  >
    <v-form
      ref="form"
      lazy-validation
      id="form"
    >
    <v-btn
      depressed
      color="primary"
      v-on:click="register()"
>Assign Survey</v-btn>

</v-form>
  <v-card-title primary-title>
  <h2 class="subheading mb-0">Assigned Survey</h2>
  </v-card-title>
  <v-data-table
    :headers="headers"
    :items="user.assignedSurvey"
    class="elevation-1"
  >
    <template v-slot:items="props">
      <td>{{ props.item.s_id }}</td>
      <td>{{ props.item.maxTry }}</td>
      <td>
        <v-btn
          flat
          color="orange"
          v-on:click="showSurveyResult(props.item.surveyResult)"
        >Survey Result</v-btn>
      </td>
      <td>
        <v-btn
          flat
          color="orange"
          v-on:click="unAssignSurvey(props.item.s_id)"
        >Unassign</v-btn>
      </td>
    </template>
  </v-data-table>
  </v-card>
</template>

<script>
    import config from "../config";
    
    export default {
        data() {
            return {
            }
        },
        props: {
            user: {}
        },
        methods: {
        },
        watch: {
            user() {

                console.log(this.user);
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
