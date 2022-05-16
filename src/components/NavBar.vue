<template>
  <div name="NavBar">
    <nav>
      <v-navigation-drawer color="#35B4E4" app v-model="drawer">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="text-h4">
              <div class="d-flex">
                <v-avatar size="40" class="text-center">
                  <v-img src="../assets/blood_test.png"></v-img>
                </v-avatar>
                <span class="text-h4">ART</span>
              </div>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider class="mx-2"></v-divider>

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
                <v-icon color="#F3F1E6">{{ item.icon }}</v-icon>
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
        <v-app-bar-nav-icon v-on:click="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>
          ART
          <span class="red--text">MIF</span> | 
          <span>{{time}}</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <div class="d-flex">
          <v-badge bordered bottom color="green" dot offset-x="10" offset-y="10">
            <v-icon size="25">mdi-account-circle</v-icon>
          </v-badge>
          <span class="ml-2">{{user.username}}</span>
        </div>
      </v-app-bar>
    </nav>
    <router-view />
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
      drawer: null,
      user_name: null,
      user_role: null,
      time: null,
      date: null,
      admin: [
        { title: 'Dashboard', icon: 'mdi-view-dashboard', route: "/" },
        { title: 'Users', icon: 'mdi-account-multiple', route: "/users" },
        { title: 'Settings', icon: 'mdi-cogs', route: "/settings" },
        { title: 'Logout', icon: 'mdi-logout', route: "/logout" }
      ],
      hda: [
        { title: 'Dashboard', icon: 'mdi-view-dashboard', route: "/" },
        { title: 'Patients', icon: 'mdi-account-multiple', route: "/patients" },
        { title: 'Lab Orders', icon: 'mdi-hospital-box', route: "/laborders" },
        { title: 'Results', icon: 'mdi-checkbox-blank-badge', route: "/results" },
        { title: 'Logout', icon: 'mdi-logout', route: "/logout" }
      ],
      assistant: [
        { title: 'Dashboard', icon: 'mdi-view-dashboard', route: "/" },
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
    this.user_role = loggedUser.role
    this.printTime();
  }
}
</script>
