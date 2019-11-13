import Vue from 'vue'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import Vuetify from 'vuetify/lib'

Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)

Vue.use(Vuetify)

Vue.config.productionTip = false
