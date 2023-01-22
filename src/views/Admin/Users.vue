<template>
  <div class="Users">
    <v-row>
      <v-col cols="12">
        <v-dialog v-model="addUserDialog" transition="scale-transition" max-width="600px">
          <v-card>
            <v-card-title> Add User </v-card-title>
            <v-card-text>
              <v-form ref="userForm" v-on:submit.prevent="saveUser">
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field label="Username" v-model.trim="user.username" dense></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field type="email" label="Email" v-model.trim="user.email" dense>
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field label="Phone" v-model.trim="user.phone" dense></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-autocomplete label="Role" :items="roles" v-model.trim="user.role" dense>
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="12">
                      <v-file-input accept="image/*" show-size label="Avatar" v-on:change="selectFile"></v-file-input>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field type="password" label="Password" v-model.trim="user.password" dense>
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field type="password" label="Confirm Password"
                        v-model.trim="user.password_confirmation" dense></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
                <div class="d-flex justify-end">
                  <v-btn v-on:click="cancel" class="secondary text-capitalize">Cancel</v-btn>
                  <v-btn type="submit" class="ml-2 text-capitalize" dark color="#008F96">Save</v-btn>
                </div>
              </v-form>
            </v-card-text>
            <v-overlay absolute opacity="0" :value="overlay">
              <v-progress-circular indeterminate color="#008F96" size="64"></v-progress-circular>
            </v-overlay>
          </v-card>
        </v-dialog>
        <v-dialog v-model="editUserDialog" transition="scale-transition" max-width="600px">
          <v-card>
            <v-card-title> Edit User </v-card-title>
            <v-card-text>
              <v-form ref="userUpdateForm" v-on:submit.prevent="updateUser">
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field label="Username" v-model.trim="user.username" dense></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field type="email" label="Email" v-model.trim="user.email" dense>
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field label="Phone" v-model.trim="user.phone" dense></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-autocomplete label="Role" :items="roles" v-model.trim="user.role" dense>
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="12">
                      <v-file-input accept="image/*" dense show-size label="Avatar" v-on:change="selectFile">
                      </v-file-input>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field type="password" label="Password" v-model.trim="user.password" dense>
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field type="password" label="Confirm Password"
                        v-model.trim="user.password_confirmation" dense></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
                <div class="d-flex justify-end">
                  <v-btn v-on:click="cancelEdit" class="secondary text-capitalize">Cancel</v-btn>
                  <v-btn type="submit" class="ml-2 text-capitalize" dark color="#008F96">Update user</v-btn>
                </div>
              </v-form>
            </v-card-text>
            <v-overlay absolute opacity="0" :value="overlay">
              <v-progress-circular indeterminate color="#008F96" size="64"></v-progress-circular>
            </v-overlay>
          </v-card>
        </v-dialog>
        <v-card shaped class="elevation-7">
          <v-card-title class="d-flex">
            <span>Manage Users</span>
            <v-spacer></v-spacer>
            <v-btn class="text-capitalize" dark color="#2A9B90" v-on:click="addUserDialog = !addUserDialog" small
              outlined>
              <v-icon left>mdi-account-plus</v-icon>New User
            </v-btn>
          </v-card-title>
          <v-card-text>
            <div class="col-lg-3 col-xl-3 col-xm-12 col-sm-5 col-md-3 pa-0">
              <v-text-field rounded outlined dense label="Search" v-model="search" append-icon="mdi-magnify">
              </v-text-field>
            </div>
            <v-data-table dense :headers="headers" class="elevation-4" :search="search" :items-per-page="7"
              :items="users" :loading="loading" loading-text="loading users">
              <template v-slot:[`item.action`]="{ item }">
                <v-icon small v-on:click="selectUserRecord(item.id)" color="primary">mdi-pencil</v-icon>
                <v-icon small color="red" v-on:click="deleteUser(item.id)">mdi-delete</v-icon>
              </template>
              <template  v-slot:[`item.avatar`]="{ item }">
                <div class="d-flex align-center">
                  <v-avatar size="28" class="my-2">
                  <v-img :src="item.avatar"></v-img>
                  </v-avatar>
                  <div class="d-flex flex-column ms-2">
                  <a class="text-decoration-none font-weight-normal text-capitalize">{{item.username}}</a>
                   <small>@{{item.username}}</small>
                  </div>
                </div>
              </template>
            </v-data-table>
            <v-divider class="my-4 mx-0"></v-divider>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import axios from "axios";
import config from "@/config";
export default {
  name: "Users",
  data() {
    return {
      search: "",
      loading: false,
      overlay: false,
      user: {
        username: null,
        email: null,
        phone: null,
        avatar: null,
        role: null,
        password: null,
        password_confirmation: null,
      },
      user_id: null,
      roles: ["Lab Assistant", "HDA Personnel"],
      addUserDialog: false,
      editUserDialog: false,
      headers: [
        {
          text: "#",
          align: "start",
          value: "id",
        },
        { 
          text: "User", 
          value: "avatar",
          sortable: false 
        },
        {
          text: "Email Address",
          value: "email",
        },
        {
          text: "Phone",
          value: "phone",
        },
        {
          text: "Role",
          value: "role",
        },
        {
          text: "Actions",
          value: "action",
        },
      ],
      users: [],
    };
  },
  methods: {
    selectFile(files) {
      this.user.avatar = files;
    },
    saveUser() {
      if (
        !this.user.username ||
        !this.user.email ||
        !this.user.phone ||
        !this.user.role ||
        !this.user.password ||
        !this.user.password_confirmation ||
        !this.user.avatar
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
        userPayload.append("role", this.user.role);
        userPayload.append("password", this.user.password);
        userPayload.append(
          "password_confirmation",
          this.user.password_confirmation
        );
        let endpoint = `${config.BASE_URL}/users`;
        axios
          .post(endpoint, userPayload, {
            headers: { Authorization: `Bearer ${this.$store.state.token}` },
          })
          .then((response) => {
            if (response.status === 201) {
              this.overlay = false;
              this.$swal("Message", response.data.message, "success").then(
                () => {
                  this.addUserDialog = false;
                  this.$refs.userForm.reset();
                  this.loadUsers();
                }
              );
            } 
          })
          .catch((error) => {
            if (!error.status) {
              this.$swal("Error", error + ", Couldn't reach API", "error");
              this.overlay = false;
            }
            this.$swal("Error", error.response.data.message + ", " + error.response.data.errors, "error")
            this.overlay = false
          });
      }
    },
    updateUser() {
      if (
        !this.user.username ||
        !this.user.email ||
        !this.user.phone ||
        !this.user.role ||
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
        userPayload.append("role", this.user.role);
        userPayload.append("password", this.user.password);
        userPayload.append(
          "password_confirmation",
          this.user.password_confirmation
        );
        let endpoint = `${config.BASE_URL}/users/${this.user_id}`;
        axios
          .put(endpoint, userPayload, {
            headers: { Authorization: `Bearer ${this.$store.state.token}` },
          })
          .then((response) => {
            if (response.status === 200) {
              this.overlay = false;
              this.$swal("Message", response.data.message, "success").then(
                () => {
                  this.editUserDialog = false;
                  this.$refs.userUpdateForm.reset();
                  this.loadUsers();
                }
              );
            } 
          })
          .catch((error) => {
            if (!error.status) {
              this.$swal("Error", error + ", Couldn't reach API", "error");
              this.overlay = false;
            }
            this.$swal("Error", error.response.data.message + ", " + error.response.data.errors, "error")
            this.overlay = false;
          });
      }
    },
    loadUsers() {
      this.loading = true;
      let endpoint = `${config.BASE_URL}/users`;
      axios
        .get(endpoint, {
          headers: { Authorization: `Bearer ${this.$store.state.token}` },
        })
        .then((response) => {
          this.users = response.data.data;
          this.loading = false;
        })
        .catch((error) => {
          this.$swal("Error", error + ", Couldn't reach API", "error");
        });
    },
    selectUserRecord(user_id) {
      let endpoint = `${config.BASE_URL}/users/${user_id}`;
      axios
        .get(endpoint, {
          headers: { Authorization: `Bearer ${this.$store.state.token}` },
        })
        .then((response) => {
          this.user = response.data.data;
          this.user_id = user_id;
          this.editUserDialog = true;
        })
        .catch((error) => {
          if (!error.status) {
            this.$swal("Error", error + ", Couldn't reach API", "error");
          }
          this.$swal("Error", error + ", Couldn't reach API", "error");
        });
    },
    deleteUser(user_id) {
      let endpoint = `${config.BASE_URL}/users/${user_id}`;
      this.$swal({
        title: "Delete User",
        text: "Are you sure you want to delete this user?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(endpoint, {
              headers: { Authorization: `Bearer ${this.$store.state.token}` },
            })
            .then((response) => {
              if (response.status === 204) {
                this.$swal("Message", "User successfully deleted", "success").then(
                  () => {
                    this.loadUsers();
                  }
                );
              }
            })
            .catch((error) => {
              this.$swal("Error", error + ", Couldn't reach API", "error");
            });
        }
      });
    },
    cancel() {
      this.$refs.userForm.reset();
      this.addUserDialog = false;
    },
    cancelEdit() {
      this.$refs.userUpdateForm.reset();
      this.editUserDialog = false;
    },
  },
  mounted() {
    this.loadUsers();
  },
};
</script>
