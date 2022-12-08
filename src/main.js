import { createApp} from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
import 'virtual:windi.css'

// 视频插件
import App from './App.vue'

// Vue.prototype.socketApi = socketApi

const app = createApp(App)

// app.use(ElementPlus)
app.use(router)
app.mount('#app')


