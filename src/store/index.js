import Vuex from 'vuex'
import Vue from 'vue'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        user: {},
        token: null,
        temp_pass: null,
        isUserLoggedIn: false
    },
    mutations: {
        setUser(state, payload) {
            state.user = payload
        },
        setToken(state, token){
            state.token = token
            if(token){
                state.isUserLoggedIn = true
            } else {
                state.isUserLoggedIn = false
            }
        },
        setTempPass(state, temp_pass){
            state.temp_pass = temp_pass
        }
    },
    plugins: [createPersistedState()]
})