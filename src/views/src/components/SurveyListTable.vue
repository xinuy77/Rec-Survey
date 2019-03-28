<template>
  <div>
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
            v-on:click="confirmRemove(props.item._id)"
          >Remove</v-btn>
        </td>
      </template>
    </v-data-table>
    <v-dialog
      v-model="dialog"
      max-width="375"
    >
      <v-card>
        <v-card-text>
            This survey will be disabled to user. Results will remain. <br>
            Would you like to remove this survey?
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
            @click="removeSurvey(selectedId)"
          >
            Remove
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
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
                ],
                dialog: false,
                selectedId: null
            }
        },
        props: {
            surveyList: Array
        },
        watch: {
        },
        methods: {
            confirmRemove(id) {
              this.dialog     = true;
              this.selectedId = id;
            },
            removeSurvey(survey_id) {
                let url = config.API_URL + "/survey/"+survey_id;
                this.$axios.delete(url).then(()=>{
                    this.dialog = false;
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
