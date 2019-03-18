<template>
  <v-card
    id="register-card"
  >
    <v-card-title primary-title>
      <div>
        <h3 class="headline mb-0">Result</h3>
      </div>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="results"
      class="elevation-1"
      :pagination.sync="pagination"
    >
      <template v-slot:items="props">
        <td>{{ props.item.name }}</td>
        <td>{{ props.item.maxTry }}</td>
        <td>{{props.item.tryCount}}</td>
        <td v-if="hasTryCount(props.item.tryCount)">
          <v-btn
            flat
            color="orange"
            v-on:click="showSurveyResult(props.item.surveyResult)"
          >See Result</v-btn>
        </td>
        <td v-else>
          <v-btn
            flat
            color="orange"
            disabled
          >No Attempts</v-btn>
        </td>
        <td v-if="!props.item.disabled">
          <v-btn
            flat
            color="red"
            v-on:click="unAssignSurvey(props.index)"
          >Disable</v-btn>
        </td>
        <td v-else>
          <v-btn
            flat
            color="yellow"
            disabled
          >Disabled</v-btn>
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
                headers: [
                    { text: 'survey name', value: 'surveyName' },
                    {
                        text: 'Maximum Attempts',
                        align: 'left',
                        sortable: false,
                        value: 'maxAttempts'
                    },
                    { text: 'User Attempts', value: '' },
                    { text: '', value: '', align: ''},
                    { text: '', value: ''}
                ],
                pagination: {
                    rowsPerPage: 5,
                    page: 1
                },
                results: []
            }
        },
        props: {
        },
        computed: {
        },
        methods: {
        },
        watch: {
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
