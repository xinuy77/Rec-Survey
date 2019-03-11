<template>
  <v-app>
    <v-navigation-drawer 
      dark
      permanent
      fixed
      clipped
      width="200px"
    >
      <v-toolbar flat>
        <v-list>
          <v-list-tile>
            <v-list-tile-title class="title">
              Rec-Survey Admin
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-toolbar>

      <v-divider></v-divider>

      <v-list class="pt-0">
        <v-list-tile
          v-for="item in items"
          :key="item.title"
          :to="item.path"
          @click=""
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-list id="logout">
        <v-list-tile
          active-class="true"
          @click=""
        >
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Logout</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-content>
      <v-container fluid>
        <v-layout justify-center>
          <v-flex xs6 offset-sm1>
            <router-view></router-view>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
    import UserAdmin  from "./components/UserAdmin.vue";
    import config     from "./config";

    export default {
        name: 'AdminApp',
        data() {
          return {
            items: [
              {
                path: "/user-admin",
                title: "Users",
                icon:  "supervised_user_circle"
              },
              {
                path:"/survey-admin",
                title: "Survey",
                icon:  "description"
              },
            ]
          }
        },
        methods: {
            logout() {
                let url = config.API_URL + "/logout";
                this.$axios.get(url).then(()=>{
                    window.location.href = "/login";
                });
            },
            checkSession() {
                let url = config.API_URL + "/session";
                this.$axios.get(url).catch(()=>{
                    window.location.href = "/login";
                }).then(({data})=>{
                    if(!data.isAdmin) {
                        window.location.href = "/survey";
                    }
                });
            }
        },
        mounted() {
        },
        beforeMount() {
            this.checkSession();
        }
    }

</script>

<style>
#logout {
  position: fixed;
  bottom: 0;
  width: 100%;
}
</style>

