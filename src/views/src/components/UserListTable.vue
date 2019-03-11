<template>
  <v-data-table
    :headers="headers"
    :items="desserts"
    class="elevation-1"
  >
    <template v-slot:items="props">
      <td>{{ props.item.username }}</td>
      <td>{{ props.item.firstName }}</td>
      <td>{{ props.item.lastName }}</td>
      <td>{{ props.item.lastLogin }}</td>
      <td>
        <v-btn 
          flat 
          color="orange"
          v-on:click="sayHi()"
        >Assign Survey</v-btn>
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
                    { text: 'Username', value: 'username' },
                    {
                        text: 'First Name',
                        align: 'left',
                        sortable: false,
                        value: 'firstName'
                    },
                    { text: 'Last Name', value: 'lastName' },
                    { text: 'Last Login', value: 'lastLogin' },
                    { value: 'assignSurvey' }
                ],
                desserts: [
                    {
                        username: 'test',
                        lastName: 'Yamanaka',
                        firstName: 'Yu',
                        age: 24,
                        lastLogin: new Date().toDateString() + ' ' + new Date().toLocaleTimeString()
                    }
                ]
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
