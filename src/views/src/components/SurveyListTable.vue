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
          color="orange"
          v-on:click="removeSurvey(props.item)"
          >Edit</v-btn>
      </td>
      <td>
        <v-btn
          flat
          color="red"
          v-on:click="editSurvey(props.item)"
        >Remove</v-btn>
      </td>
    </template>
  </v-data-table>
</template>

<script>

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
                    { text: '', value: 'edit' },
                    { text: '', value: 'remove' },
               ]
            }
        },
        props: {
            surveyList: Array
        },
        watch: {
            userList() {
            }
        },
        methods: {
        },
        mounted() {
        },
        beforeMount() {
        }
    }
</script>
