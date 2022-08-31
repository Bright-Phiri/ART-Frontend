import Vue from 'vue'
import VueRouter from 'vue-router'
import Navbar from '@/components/NavBar.vue'
import store from '../store'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        component: Navbar,
        beforeEnter(to, from, next) {
            if (!store.state.isUserLoggedIn) {
                next({ path: "/login" })
            } else {
                next();
            }
        },
        children: [{
                path: '',
                component: () =>
                    import ('../views/Admin/Dashboard.vue'),
                beforeEnter(to, from, next) {
                    if (!store.state.isUserLoggedIn) {
                        next({ path: "/login" })
                    } else {
                        next();
                    }
                }
            }, {
                path: '/users',
                name: 'users',
                component: () =>
                    import ('../views/Admin/Users.vue'),
                beforeEnter(to, from, next) {
                    if (!store.state.isUserLoggedIn) {
                        next({ path: "/login" })
                    } else {
                        let loggedUser = store.state.user
                        let user_role = loggedUser.role
                        if (user_role != "Admin") {
                            next({ path: "/login" })
                        } else {
                            next();
                        }
                    }
                }
            }, {
                path: '/blood_groups',
                name: 'blood_groups',
                component: () =>
                    import ('../views/Admin/BloodGroups.vue'),
                beforeEnter(to, from, next) {
                    if (!store.state.isUserLoggedIn) {
                        next({ path: "/login" })
                    } else {
                        let loggedUser = store.state.user
                        let user_role = loggedUser.role
                        if (user_role != "Admin") {
                            next({ path: "/login" })
                        } else {
                            next();
                        }
                    }
                }
            },
            {
                path: '/settings',
                name: 'settings',
                component: () =>
                    import ('../views/Admin/Settings.vue'),
                beforeEnter(to, from, next) {
                    if (!store.state.isUserLoggedIn) {
                        next({ path: "/login" })
                    } else {
                        let loggedUser = store.state.user
                        let user_role = loggedUser.role
                        if (user_role != "Admin") {
                            next({ path: "/login" })
                        } else {
                            next();
                        }
                    }
                }
            },
            {
                path: '/patients',
                name: 'patients',
                component: () =>
                    import ('../views/HDA/Patients.vue'),
                beforeEnter(to, from, next) {
                    if (!store.state.isUserLoggedIn) {
                        next({ path: "/login" })
                    } else {
                        let loggedUser = store.state.user
                        let user_role = loggedUser.role
                        if (user_role != "HDA Personnel") {
                            next({ path: "/login" })
                        } else {
                            next();
                        }
                    }
                }

            },
            {
                path: '/laborders',
                name: 'laborders',
                component: () =>
                    import ('../views/HDA/LabOrders.vue'),
                beforeEnter(to, from, next) {
                    if (!store.state.isUserLoggedIn) {
                        next({ path: "/login" })
                    } else {
                        let loggedUser = store.state.user
                        let user_role = loggedUser.role
                        if (user_role != "HDA Personnel") {
                            next({ path: "/login" })
                        } else {
                            next();
                        }
                    }
                }
            },
            {
                path: '/assistant',
                name: 'assistant',
                component: () =>
                    import ('../views/Assistant/LabOrders.vue'),
                beforeEnter(to, from, next) {
                    if (!store.state.isUserLoggedIn) {
                        next({ path: "/login" })
                    } else {
                        let loggedUser = store.state.user
                        let user_role = loggedUser.role
                        if (user_role != "Lab Assistant") {
                            next({ path: "/login" })
                        } else {
                            next();
                        }
                    }
                }
            },
            {
                path: '/results',
                name: 'results',
                component: () =>
                    import ('../views/Assistant/LabOrderResults.vue'),
                beforeEnter(to, from, next) {
                    if (!store.state.isUserLoggedIn) {
                        next({ path: "/login" })
                    } else {
                        let loggedUser = store.state.user
                        let user_role = loggedUser.role
                        if (user_role != "Lab Assistant" && user_role != "HDA Personnel") {
                            next({ path: "/login" })
                        } else {
                            next();
                        }
                    }
                }
            }
        ]
    }, {
        path: '/login',
        name: 'login',
        component: () =>
            import ('../views/Login.vue')
    },
    {
        path: '/signup',
        name: 'signup',
        component: () =>
            import ('../views/SignUp.vue')
    },
    {
        path: '/forgot',
        name: 'forgot',
        component: () =>
            import ('../views/ForgotPassword.vue')
    },
    {
        path: '/reset',
        name: 'reset',
        component: () =>
            import ('../views/ResetPassword.vue')
    },
    {
        path: '/logout',
        name: 'logout',
        beforeEnter(to, from, next) {
            store.commit('setToken', null)
            store.commit('setUser', null)
            store.commit('setTempPass', null)
            next({ path: "/login" })
        }
    }
]

const router = new VueRouter({
    mode: process.env.IS_ELECTRON ? 'hash' : 'history',
    base: process.env.BASE_URL,
    routes
})

export default router