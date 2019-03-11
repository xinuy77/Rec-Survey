import Vue        from 'vue'
import App        from '../../AdminApp.vue'
import VueRouter  from 'vue-router'
import Vuetify    from 'vuetify'
import axios      from 'axios'
import VueCookies from 'vue-cookies'
import 'vuetify/dist/vuetify.min.css'

axios.defaults.withCredentials = true;

Vue.use(Vuetify);
Vue.use(VueCookies);
Vue.use(VueRouter);

Vue.config.productionTip = false;
Vue.prototype.$axios     = axios;

const router = new VueRouter({
    mode: "history",
    routes: [
        {
            path: "/admin",
            redirect: "/user-admin"
        },
        {
            path: "/survey-admin",
            component: () => import("../../components/SurveyAdmin.vue")
        },
        {
            path: "/user-admin",
            component: () => import("../../components/UserAdmin.vue")
        }
    ]
});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
