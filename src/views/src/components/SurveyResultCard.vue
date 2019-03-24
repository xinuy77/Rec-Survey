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
            selectedResult: Object
        },
        computed: {
        },
        methods: {
            calcResultTime() {
                let index = 0;
                for(let result of this.selectedResult.surveyResult) {
                    let data = {
                        passageReadTime: result.passageRead.endTime - result.passageRead.startTime,
                        passageSpeakTime: result.passageSpeak.endTime - result.passageSpeak.startTime,
                        pictureTime: result.picture.endTime - result.picture.startTime,
                        videoPath: this.selectedResult.videoPath[index]
                    }
                    this.results.push(data);
                    index++;
                }
                console.log(this.results);
            }
        },
        watch: {
            selectedResult() {
                //TODO
                console.log(this.selectedResult);
                this.calcResultTime();

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
