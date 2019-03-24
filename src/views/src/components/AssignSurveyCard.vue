<template>
  <v-card
    id="register-card"
  >
    <v-card-title primary-title>
      <div>
        <h3 class="headline mb-0">Username: {{user.username}}</h3>
      </div>
    </v-card-title>
    <v-form
      ref="form"
      lazy-validation
      id="form"
    >
      <v-layout>
        <v-flex xs8 sd8>
          <v-select
            :items="surveyNames"
            label="Select Survey"
            v-model="surveyName"
          ></v-select>
        </v-flex>
        <v-flex xs8 sd8>
          <v-text-field
            label="Maximum Attempts"
            mask="###"
            v-model="maxTry"
          ></v-text-field>
        </v-flex>
        <v-flex xs3 sd8>
          <v-btn
            depressed
            color="primary"
            v-on:click="assignSurvey()"
          >Assign Survey</v-btn>
        </v-flex>
      </v-layout>
    </v-form>
    <v-data-table
      :headers="headers"
      :items="user.assignedSurvey"
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
            v-on:click="showSurveyResult(props.item)"
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
                maxTry: 1,
                surveyList: [],
                surveyNames: [],
                surveyName: "",
                user: {},
                pagination: {
                    rowsPerPage: 5,
                    page: 1
                }
            }
        },
        props: {
            userList: Array,
            selectedIndex: Number
        },
        computed: {
        },
        methods: {
            showSurveyResult(result) {
                this.$emit("show-result", result);
            },
            unAssignSurvey(index) {
                let url  = config.API_URL + "/unassign";
                let arrIndex = (this.pagination.page - 1) * this.pagination.rowsPerPage + index;
                let data = {
                    _id: this.user._id,
                    index: arrIndex
                };
                this.$axios.post(url, data).then(()=>{
                    this.$emit("update-userlist");
                }).catch(()=>{
                    console.log("error");
                });
            },
            hasTryCount(tryCount) {
                if(tryCount > 0) {
                    return true;
                }
                return false;
            },
            getSurveyList() {
              return new Promise((resolve, reject)=>{
                  let url = config.API_URL + "/survey-list";
                  this.$axios.get(url).then(({data})=>{
                      resolve(data);
                  });
              });
            },
            setSurveyNames() {
                for(let survey of this.surveyList) {
                    this.surveyNames.push(survey.name);
                }
            },
            async handleBeforeMount() {
                this.surveyList = await this.getSurveyList();
                this.setSurveyNames();
                this.updateUserIndex();
            },
            assignSurvey() {
                let url  = config.API_URL + "/assign";
                let data = {
                    u_id: this.user._id,
                    s_id: "",
                    maxTry: this.maxTry,
                    name: this.surveyName
                };

                for(let survey of this.surveyList) {
                    if(survey.name === this.surveyName) {
                        data.s_id = survey._id;
                        break;
                    }
                }
                this.$axios.post(url, data).then(()=>{
                    this.$emit("update-userlist");
                    this.$emit("survey-assigned");
                });
            },
            updateUserIndex() {
                this.user = this.userList[this.selectedIndex];
            }
        },
        watch: {
            userList() {
                this.updateUserIndex();
            },
            selectedIndex() {
                this.updateUserIndex();
            }
        },
        mounted() {
        },
        beforeMount() {
            this.handleBeforeMount();
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
