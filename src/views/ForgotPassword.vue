<template>
  <div class="Login">
    <v-container fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="6" xs="12" md="4" lg="4">
          <v-card class="rounded-xl mt-3">
            <v-card-title>
              <span class="teal--text darken-4 font-weight-light">Reset Your Password</span>
            </v-card-title>
            <v-card-subtitle>Lost your password? Please enter your email address. You will receive a link to crate a new password via email.</v-card-subtitle>
            <v-card-text>
              <v-form v-on:submit.prevent="forgotPassword">
                <v-text-field label="Email Address" outlined dense v-model.trim="user.email"></v-text-field>
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
        email: null
      },
      overlay: false
    }
  },
  methods: {
    forgotPassword() {
      if (!this.user.email) {
        this.$swal("Fields validation", "Please enter your email", "warning")
      } else {
        this.overlay = true
        let userPayload = {
          email: this.user.email
        }
        let endPoint = `${config.BASE_URL}/password/forgot`;
        axios
          .post(endPoint, userPayload)
          .then(response => {
            if (response.data.status === "success") {
              this.overlay = false
              this.$swal(response.data.status, response.data.message, response.data.status).then(()=>{
                 this.$router.push({path: '/reset'})
              })
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
    }
  }
}
</script>
