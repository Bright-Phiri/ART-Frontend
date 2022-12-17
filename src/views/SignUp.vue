<template>
  <div class="Login">
    <v-container fluid>
      <v-row align="center" justify="center">
        <v-col class="col-xl-4 col-lg-4 col-sm-7 col-xs-6 col-md-5">
          <div class="d-flex justify-center">
            <v-avatar width="100" height="60">
              <v-img src="../assets/logo1.png"></v-img>
            </v-avatar>
          </div>
          <v-card class="rounded-xl mt-3">
            <v-card-title>
              <span class="teal--text darken-4 font-weight-light"
                >Create Account</span
              >
            </v-card-title>
            <v-card-text>
              <v-form
                v-on:submit.prevent="signUp"
                enctype="multipart/form-data"
              >
                <v-text-field
                  label="Username"
                  outlined
                  dense
                  v-model.trim="user.username"
                ></v-text-field>
                <v-text-field
                  label="Email"
                  outlined
                  dense
                  v-model.trim="user.email"
                ></v-text-field>
                <v-text-field
                  label="Phone"
                  outlined
                  dense
                  v-model.trim="user.phone"
                ></v-text-field>
                <v-file-input
                  accept="image/*"
                  outlined
                  dense
                  show-size
                  label="Avatar"
                  v-on:change="selectFile"
                >
                </v-file-input>
                <v-text-field
                  label="Password"
                  type="password"
                  outlined
                  dense
                  v-model.trim="user.password"
                >
                </v-text-field>
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
                  >Sign up
                </v-btn>
                <v-divider class="my-4"></v-divider>
              </v-form>
            </v-card-text>
            <v-overlay absolute opacity="0" :value="overlay">
              <v-progress-circular
                indeterminate
                color="#008F96"
                size="64"
              ></v-progress-circular>
            </v-overlay>
          </v-card>
          <div class="d-flex justify-center mt-4">
            <span class="text-center font-weight-light">
              Already have an account?
              <router-link to="/login" class="text-decoration-none"
                >Sign in.</router-link
              >
            </span>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";
import config from "@/config";
export default {
  name: "Login",
  data() {
    return {
      user: {
        username: null,
        email: null,
        phone: null,
        avatar: null,
        password: null,
        password_confirmation: null,
      },
      overlay: false,
    };
  },
  methods: {
    selectFile(files) {
      this.user.avatar = files;
    },
    signUp() {
      if (
        !this.user.username ||
        !this.user.email ||
        !this.user.phone ||
        !this.user.password ||
        !this.user.password_confirmation
      ) {
        this.$swal(
          "Fields validation",
          "Please fill in all required fields",
          "warning"
        );
      } else {
        this.overlay = true;
        var userPayload = new FormData();
        userPayload.append("username", this.user.username);
        userPayload.append("email", this.user.email);
        userPayload.append("phone", this.user.phone);
        userPayload.append("avatar", this.user.avatar);
        userPayload.append("password", this.user.password);
        userPayload.append(
          "password_confirmation",
          this.user.password_confirmation
        );
        let endpoint = `${config.BASE_URL}/createaccount`;
        axios
          .post(endpoint, userPayload)
          .then((response) => {
              this.overlay = false;
              this.$swal("Message", response.data.message, "success").then(
                () => {
                  this.$router.push({ path: "/login" });
                }
              );
          })
          .catch((error) => {
            this.overlay = false;
            this.$swal("Error", error.response.data.errors, "error");
            this.overlay = false;
          });
      }
    },
  },
};
</script>
