<template>
  <div class="Login">
    <v-container fluid>
      <v-row align="center" justify="center">
        <v-col class="col-xl-4 col-lg-4 col-sm-7 col-xs-6 col-md-5">
          <div class="d-flex justify-center">
            <v-avatar size="40" class="text-center">
              <v-img src="../assets/blood_test.png"></v-img>
            </v-avatar>
            <span class="text-h4">ART</span>
          </div>
          <v-card class="rounded-xl mt-3">
            <v-card-title>
              <span class="teal--text darken-4 font-weight-light">Create Account</span>
            </v-card-title>
            <v-card-text>
              <v-form v-on:submit.prevent="signUp">
                <v-text-field label="Username" outlined dense v-model.trim="user.username"></v-text-field>
                <v-text-field label="Email" outlined dense v-model.trim="user.email"></v-text-field>
                <v-text-field label="Phone" outlined dense v-model.trim="user.phone"></v-text-field>
                <v-text-field
                  label="Password"
                  type="password"
                  outlined
                  dense
                  v-model.trim="user.password"
                ></v-text-field>
                <v-text-field
                  label="Confirm Password"
                  type="password"
                  outlined
                  dense
                  v-model.trim="user.password_confirmation"
                ></v-text-field>
                <v-btn
                  type="submit"
                  dark
                  depressed
                  class="text-capitalize"
                  block
                  rounded
                  color="#008F96"
                >Sign up</v-btn>
                <v-divider class="my-4"></v-divider>
              </v-form>
            </v-card-text>
            <v-overlay absolute opacity="0" :value="overlay">
              <v-progress-circular indeterminate color="#008F96" size="64"></v-progress-circular>
            </v-overlay>
          </v-card>
          <div class="d-flex justify-center mt-4">
            <span class="text-center font-weight-light">
              Already have an account?
              <router-link to="/login">Sign in.</router-link>
            </span>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Login',
  data() {
    return {
      user: {
        username: null,
        email: null,
        phone: null,
        password: null,
        password_confirmation: null
      },
      overlay: false
    }
  },
  methods: {
    signUp() {
      if (!this.user.username || !this.user.email || !this.user.phone || !this.user.password || !this.user.password_confirmation) {
        this.$swal("Fields validation", "Please fill in all required fields", "warning")
      } else {
        if (this.user.password === this.user.password_confirmation) {
          this.overlay = true
          let userPayload = {
            username: this.user.username,
            email: this.user.email,
            phone: this.user.phone,
            password: this.user.password,
            password_confirmation: this.user.password_confirmation
          }
          let endpoint = `${sessionStorage.getItem("BASE_URL")}/createaccount`;
          axios
            .post(endpoint, userPayload)
            .then(response => {
              if (response.data.status === "success") {
                this.overlay = false
                this.$swal("Message", response.data.message, "success").then(() => {
                  this.$router.push({ path: "/login" });
                }
                );
              } else {
                this.$swal(response.data.status, response.data.message, response.data.status)
                this.overlay = false
              }
            })
            .catch(error => {
              this.$swal("Error", error + ", Couldn't reach API", "error")
              this.overlay = false
            })
        } else {
          this.$swal("Error", "Passwords dont match", "error");
        }
      }
    }
  },
  mounted() {
    sessionStorage.setItem("BASE_URL", "https://antiviraltreatementapi.herokuapp.com/api/v1");
  }
}
</script>
