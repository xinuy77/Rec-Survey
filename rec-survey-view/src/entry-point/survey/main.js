import Vue        from 'vue'
import App        from '../../SurveyApp.vue'
import router     from '../../router'
import Vuetify    from 'vuetify'
import axios      from 'axios'
import VueCookies from 'vue-cookies'
import 'vuetify/dist/vuetify.min.css'

axios.defaults.withCredentials = true;
Vue.use(Vuetify);
Vue.use(VueCookies);
Vue.config.productionTip = false;
Vue.prototype.$axios = axios;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
