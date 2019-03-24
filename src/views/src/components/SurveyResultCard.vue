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
        <td>{{ props.item.passageReadTime }} sec</td>
        <td>{{ props.item.passageSpeakTime}} sec</td>
        <td>{{props.item.pictureTime}} sec</td>
        <td>
          <v-btn
            flat
            color="primary"
            v-on:click="getRecordedVideo(props.item.videoPath)"
          >Video</v-btn>
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
                    { text: 'Passage Read Time', value: 'passageReadTime' },
                    {
                        text: 'Passage Speak Time',
                        align: 'left',
                        sortable: false,
                        value: 'maxAttempts'
                    },
                    { text: 'Picture Explain Time', value: '' },
                    { text: '', value: '', align: ''},
                    { text: '', value: ''}
                ],
                pagination: {
                    rowsPerPage: 5,
                    page: 1
                },
                results: [],
                milliPerSec: 1000
            }
        },
        props: {
            selectedResult: Object
        },
        computed: {
        },
        methods: {
            getRecordedVideo(videoPath) {
                let url = config.API_URL + "/video/"+videoPath;
                this.$axios({
                  url: url,
                  method: 'GET',
                  responseType: 'blob', // important
                }).then((response) => {
                   const url = window.URL.createObjectURL(new Blob([response.data]));
                   const link = document.createElement('a');
                   link.href = url;
                   link.setAttribute('download', videoPath); //or any other extension
                   document.body.appendChild(link);
                   link.click();
                });
            },
            calcResultTime() {
                let index = 0;
                this.results = [];
                console.log(this.selectedResult.surveyResult);
                for(let result of this.selectedResult.surveyResult) {
                    let data = {
                        passageReadTime: (result.passageRead.endTime - result.passageRead.startTime)/this.milliPerSec,
                        passageSpeakTime: (result.passageSpeak.endTime - result.passageSpeak.startTime)/this.milliPerSec,
                        pictureTime: (result.picture.endTime - result.picture.startTime)/this.milliPerSec,
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
                this.calcResultTime();

            }
        },
        mounted() {
        },
        beforeMount() {
            this.calcResultTime();
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
