<template>
  <div class="Login">
    <v-container fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="6" xs="12" md="4" lg="3">
          <div class="d-flex justify-center">
            <v-avatar width="100" height="60">
              <v-img src="../assets/logo1.png"></v-img>
            </v-avatar>
          </div>
          <v-card class="rounded-xl mt-3">
            <v-card-title>
              <span class="teal--text darken-4 font-weight-light">Login</span>
            </v-card-title>
            <v-card-text>
              <v-form v-on:submit.prevent="signIn">
                <v-text-field label="Username" outlined dense v-model.trim="user.username"></v-text-field>
                <v-text-field label="Password" type="password" outlined dense v-model.trim="user.password">
                </v-text-field>
                <v-btn type="submit" dark depressed class="text-capitalize font-weight-light" block rounded
                  color="#008F96">Sign in</v-btn>
                <div class="d-flex">
                  <v-divider class="my-4 mr-2"></v-divider>
                  <span class="mt-1">or</span>
                  <v-divider class="my-4 ml-2"></v-divider>
                </div>
              </v-form>
            </v-card-text>
            <v-overlay absolute opacity="0" :value="overlay">
              <v-progress-circular indeterminate color="#008F96" size="64"></v-progress-circular>
            </v-overlay>
          </v-card>
          <div class="d-flex justify-center mt-4">
            <span class="text-center font-weight-light">
              New to ART?
              <router-link class="text-decoration-none" to="/signup">Sign up.</router-link>
            </span>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios'
import config from '@/config'

export default {
  name: 'Login',
  data() {
    return {
      user: {
        username: null,
        password: null
      },
      overlay: false
    }
  },
  methods: {
    signIn() {
      if (!this.user.username || !this.user.password) {
        this.$swal("Fields validation", "Please fill in all required fields", "warning")
      } else {
        this.overlay = true
        let userPayload = {
          username: this.user.username,
          password: this.user.password
        }
        let authEndpoint = `${config.BASE_URL}/login`;
        axios
          .post(authEndpoint, userPayload)
          .then(response => {
            if (response.data.status === "success") {
              this.overlay = false
              let user = response.data.user
              this.$store.commit('setToken', response.data.token)
              this.$store.commit('setUser', user)
              this.$store.commit('setTempPass', this.user.password)
              this.switchUserPanel(user.role)
            } else {
              this.$swal(response.data.status, response.data.message, response.data.status)
              this.overlay = false
            }
          })
          .catch(error => {
            this.$swal("Error", error + ", Couldn't reach API", "error")
            this.overlay = false
          })
      }
    },
    switchUserPanel(userRole){
       switch (userRole) {
          case "Admin":
            this.$router.push({ path: '/' })
            break;
          case "HDA Personnel":
            this.$router.push({ path: '/patients' })
            break;
          case "Lab Assistant":
            this.$router.push({ path: '/assistant' })
            break;
        }
    }
  }
}
</script>
