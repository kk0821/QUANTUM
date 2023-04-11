import {createApp} from 'vue'
import './tailwind.css'
import App from './App.vue'
import router from './routes.js'
import Notifications from 'notiwind'
import PrimeVue from 'primevue/config';
import DialogService from 'primevue/dialogservice';
import Tooltip from 'primevue/tooltip';

import '../src/theme/amerinode.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

const app = createApp(App)
app
    .use(router)
    .use(Notifications)
    .use(PrimeVue, { ripple: true })
    .use(DialogService)
    .directive('tooltip', Tooltip)
    .mount('#app')
