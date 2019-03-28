import Vue     from 'vue'
import App     from '../../LoginApp.vue'
import router  from '../../router'
import Vuetify from 'vuetify'
import axios   from 'axios'
import 'vuetify/dist/vuetify.min.css'

axios.defaults.withCredentials = true;
Vue.use(Vuetify);
Vue.config.productionTip = false;
Vue.prototype.$axios = axios;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
