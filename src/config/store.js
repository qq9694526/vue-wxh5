import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
        count: 0,
        user: {}
    },
    mutations: {
        increment(state) {
            state.count++
        },
        updateUser(state, user) {
            state.user = user;
        }
    }
})

export default store