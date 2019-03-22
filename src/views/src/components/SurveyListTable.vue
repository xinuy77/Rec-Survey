<template>
  <v-data-table
    :headers="headers"
    :items="surveyList"
    class="elevation-1"
  >
    <template v-slot:items="props">
      <td>{{ props.item.name }}</td>
      <td>{{ props.item.pic.name }}</td>
      <td>{{ props.item.pas.name }}</td>
      <td>
        <v-btn
          flat
          color="red"
          v-on:click="removeSurvey(props.item._id)"
        >Remove</v-btn>
      </td>
    </template>
  </v-data-table>
</template>

<script>
    import config from "../config";

    export default {
        name: 'default',
        data() {
            return {
                headers: [
                    { text: 'Survey', value: 'name' },
                    {
                        text: 'Picture',
                        align: 'left',
                        sortable: false,
                        value: 'pictureName'
                    },
                    { text: 'Passage', value: 'passageName' },
                    { text: '', value: 'remove' }
               ]
            }
        },
        props: {
            surveyList: Array
        },
        watch: {
        },
        methods: {
            removeSurvey(survey_id) {
                let url = config.API_URL + "/survey/"+survey_id;
                this.$axios.delete(url).then(()=>{
                    this.$emit("survey-removed");
                });
            }
        },
        mounted() {
        },
        beforeMount() {
        }
    }
</script>
