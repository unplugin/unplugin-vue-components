import VueCompostionAPI from '@vue/composition-api'
import Vue from 'vue'
import App from './App.vue'
import './index.css'

Vue.config.productionTip = false
Vue.use(VueCompostionAPI)

const app = new Vue({ render: h => h(App as any) })

app.$mount('#app')
