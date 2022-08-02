import Vuex from 'vuex'
import Vue from 'vue'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        user: {}
    },
    mutations: {
        setUser(state, payload) {
            state.user = payload
        }
    },
    plugins: [createPersistedState()]
})