import { createApp } from 'vue'
import { createStore } from 'vuex'

// 创建一个新的 store 实例
const store = createStore({
  state () {
    return {
      storeWeb3: 1,
      storeUserAddress: {},
      storeContract: {},
      storeTokenId:0,
      storeValue:0,
      storeETH:0
    }
  },
  mutations: {
    setWeb3 (state, data) {
      state.storeWeb3 = data
    },
    setUserAddress (state, data) {
      state.storeUserAddress = data
    },
    setContract (state, data) {
      state.storeContract = data
    },
    setTokenId (state, data) {
      state.storeTokenId = data
    },
    setValue(state, data) {
      state.storeValue = data
    },
    setETH(state, data) {
      state.storeETH = data
    }
  }
})
export default store;
const app = createApp({ /* 根组件 */ })

// 将 store 实例作为插件安装
app.use(store)