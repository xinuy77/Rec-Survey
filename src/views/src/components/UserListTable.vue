<template>
  <v-data-table
    :headers="headers"
    :items="userList"
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
          v-on:click="assignSurvey(props.item)"
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
               ]
            }
        },
        props: {
            userList: Array
        },
        watch: {
            userList() {
            }
        },
        methods: {
            assignSurvey(user) {
                let selectedIndex;

                for(let i = 0; i < this.userList.length; i++) {
                    if(user._id === this.userList[i]._id) {
                        selectedIndex = i;
                        break;
                    }
                }

                this.$emit("assign-survey", selectedIndex);
            }
        },
        mounted() {
        },
        beforeMount() {
        }
    }
</script>
