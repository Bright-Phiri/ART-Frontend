import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueApexCharts from 'vue-apexcharts'
import VueQRCodeComponent from 'vue-qrcode-component'
import store from './store'

Vue.config.productionTip = false
Vue.use(VueSweetalert2, VueAxios, axios)
Vue.use(VueApexCharts)
Vue.component('apexchart', VueApexCharts)
Vue.component('qr-code', VueQRCodeComponent)

new Vue({
    router,
    vuetify,
    store,
    render: h => h(App)
}).$mount('#app')