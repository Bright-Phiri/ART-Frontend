<template>
  <div name="NavBar">
    <nav>
      <v-navigation-drawer color="#008F96" app  v-model="drawer" :mini-variant.sync="mini">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="text-h4">
              <div class="d-flex justify-space-between">
                <v-avatar width="100" height="55">
                  <v-img src="../assets/logo.png"></v-img>
                </v-avatar>
                <v-btn
                   icon
                   @click.stop="mini = !mini"
                   class="d-none d-xl-flex d-none d-lg-flex d-xl-none"
                >
                  <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
              </div>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider class="mx-2 grey"></v-divider>

        <v-list dense nav shaped>
          <div v-if="user_role === 'Admin'">
            <v-list-item dense v-for="item in admin" :key="item.title" link router :to="item.route">
              <v-list-item-icon>
                <v-icon color="#F3F1E6">{{ item.icon }}</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title class="white--text">{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </div>

          <div v-if="user_role === 'HDA Personnel'">
            <v-list-item dense v-for="item in hda" :key="item.title" link router :to="item.route">
               <v-list-item-icon>
             <v-tooltip right>
               <template v-slot:activator="{ on, attrs }">
                 <v-icon  v-bind="attrs" v-on="on" color="#F3F1E6">{{ item.icon }}</v-icon>
               </template>
               <span>{{item.title}}</span>
             </v-tooltip>  
          </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title class="white--text">{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </div>

          <div v-if="user_role === 'Lab Assistant'">
            <v-list-item
              dense
              v-for="item in assistant"
              :key="item.title"
              link
              router
              :to="item.route"
            >
              <v-list-item-icon>
                <v-icon color="#F3F1E6">{{ item.icon }}</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title class="white--text">{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </div>
        </v-list>
      </v-navigation-drawer>
      <v-app-bar app flat color="blue-grey lighten-5">
        <v-app-bar-nav-icon class="grey--text d-xl-none d-lg-none d-xl-flex" v-on:click="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>
          <span class="text-color">ART </span>|
          <span>{{time}}</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <div class="d-flex">
           <v-badge
            bordered
            bottom
            color="green accent-4"
            dot
            offset-x="10"
            offset-y="10"
          >
            <v-avatar size="30">
              <v-img :src="user.avatar">
                <template v-slot:placeholder>
                  <v-sheet>
                    <v-skeleton-loader type="image"> </v-skeleton-loader>
                  </v-sheet>
                </template>
              </v-img>
            </v-avatar>
          </v-badge>
          <span class="ml-2">{{user.username}}</span>
        </div>
      </v-app-bar>
    </nav>
    <transition name="page" mode="out-in">
      <router-view/>
    </transition>  
    <Footer></Footer>
  </div>
</template>

<script>
import Footer from "@/components/Footer.vue";
export default {
  name: 'NavBar',
  components: {
    Footer,
  },
  data() {
    return {
      drawer: true,
      mini: true,
      user_name: null,
      avatar: null,
      user_role: null,
      time: null,
      date: null,
      admin: [
        { title: 'Dashboard', icon: 'mdi-home', route: "/" },
        { title: 'Users', icon: 'mdi-account-multiple', route: "/users" },
        { title: 'Settings', icon: 'mdi-cogs', route: "/settings" },
        { title: 'Logout', icon: 'mdi-logout', route: "/logout" }
      ],
      hda: [
        { title: 'Dashboard', icon: 'mdi-home', route: "/" },
        { title: 'Patients', icon: 'mdi-account-multiple', route: "/patients" },
        { title: 'Lab Orders', icon: 'mdi-hospital-box', route: "/laborders" },
        { title: 'Results', icon: 'mdi-checkbox-blank-badge', route: "/results" },
        { title: 'Logout', icon: 'mdi-logout', route: "/logout" }
      ],
      assistant: [
        { title: 'Dashboard', icon: 'mdi-home', route: "/" },
        { title: 'Lab Orders', icon: 'mdi-hospital-box', route: "/assistant" },
        { title: 'Results', icon: 'mdi-checkbox-blank-badge', route: "/results" },
        { title: 'Logout', icon: 'mdi-logout', route: "/logout" }
      ],
      right: null,
    }
  },
 computed: {
    user () {
      return this.$store.state.user
    }
  },
  methods: {
    printTime() {
      var v = this;
      setInterval(function () {
        v.time = new Date().toLocaleTimeString();
        this.date = new Date().toLocaleString();
    }, 1000);
   }
  },

  mounted() {
    let loggedUser = this.$store.state.user
    this.avatar = loggedUser.avatar
    this.user_role = loggedUser.role
    this.printTime();
  }
}
</script>

<style>
.page-enter-active, .page-leave-active {
  transition: opacity 1s, transform 1s;
}
.page-enter, .page-leave-to {
  opacity: 0;
  transform: translateX(-2%);
}
.text-color{
  color: #F25039;
}
</style>
