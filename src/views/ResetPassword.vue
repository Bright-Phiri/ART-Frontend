<template>
  <div class="Login">
    <v-container fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="6" xs="12" md="4" lg="4">
          <v-card class="rounded-xl mt-3">
            <v-card-title>
              <span class="teal--text darken-4 font-weight-light">Reset Your Password</span>
            </v-card-title>
            <v-card-subtitle>Reset your password below</v-card-subtitle>
            <v-card-text>
              <v-form v-on:submit.prevent="resetPassword">
                <v-text-field label="Password Reset Token" type="text" outlined dense v-model.trim="user.token">
                </v-text-field>
                <v-text-field label="New Password" type="password" outlined dense v-model.trim="user.password">
                </v-text-field>
                <v-text-field label="Re-enter new password" type="password" outlined dense v-model.trim="user.password_confirmation">
                </v-text-field>
                <v-btn type="submit" dark depressed class="text-capitalize font-weight-light mb-2" rounded
                  color="#008F96">Reset Password</v-btn>
              </v-form>
            </v-card-text>
            <v-overlay absolute opacity="0" :value="overlay">
              <v-progress-circular indeterminate color="#008F96" size="64"></v-progress-circular>
            </v-overlay>
          </v-card>
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
        password: null,
        password_confirmation: null,
        token: null
      },
      overlay: false
    }
  },
  methods: {
    resetPassword() {
      if (!this.user.password || !this.user.password_confirmation || !this.user.token) {
        this.$swal("Fields validation", "Please fill in all required fields", "warning")
      } else {
        this.overlay = true
        let userPayload = {
          password: this.user.password,
          password_confirmation: this.user.password_confirmation,
          token: this.user.token
        }
        let endPoint = `${config.BASE_URL}/password/reset`;
        axios
          .post(endPoint, userPayload)
          .then(response => {
            if (response.status === 200) {
              this.overlay = false
              this.$swal(response.data.status, response.data.message, response.data.status).then(()=>{
                 this.$router.push({path: '/login'})
              })
            }
          })
          .catch(error => {
            if (!error.status) {
              this.$swal("Error", error + ", Couldn't reach API", "error");
              this.overlay = false;
            }
            this.$swal("Error", error.response.data.message + ", " + error.response.data.errors, "error")
            this.overlay = false
          })
      }
    }
  }
}
</script>
