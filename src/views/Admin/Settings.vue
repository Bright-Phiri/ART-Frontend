<template>
  <div class="home">
    <v-row>
      <v-col cols="12">
        <v-card tile height="470">
          <v-card-text>
            <v-container fluid>
              <v-tabs>
                <v-tab>
                  <v-icon left> mdi-account </v-icon>
                  User Info
                </v-tab>
                <v-tab>
                  <v-icon left> mdi-lock </v-icon>
                  Security
                </v-tab>
                <v-tab-item>
                  <v-card flat>
                    <v-card-title class="font-weight-light">
                      Update User Info
                    </v-card-title>
                    <v-card-text>
                      <v-form v-on:submit.prevent="updateUser">
                        <v-row dense>
                        <v-col cols="12" xl="5" lg="6" sm="7" md="7">
                          <v-text-field v-model.trim="user.username" label="Username" dense prepend-icon="mdi-account"></v-text-field>
                        </v-col>
                        </v-row>
                        <v-row dense>
                        <v-col cols="12" xl="5" lg="6" sm="7" md="7">
                          <v-text-field type="email" v-model.trim="user.email" label="Email" dense prepend-icon="mdi-mail"></v-text-field>
                        </v-col>
                        </v-row>
                        <v-row dense>
                        <v-col cols="12" xl="5" lg="6" sm="7" md="7">
                           <v-text-field v-model.trim="user.phone" label="Phone" dense prepend-icon="mdi-phone"></v-text-field>
                        </v-col>
                        </v-row>
                        <v-row dense>
                        <v-col cols="12" xl="5" lg="6" sm="7" md="7">
                          <v-text-field type="password" v-model.trim="user.password" label="Enter password" dense prepend-icon="mdi-lock"></v-text-field>
                        </v-col>
                        </v-row>
                        <v-btn class="secondary">Cancel</v-btn>  <v-btn type="submit" color="#008F96" class="primary">Save</v-btn>
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
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>
                      <v-card-title class="font-weight-light">
                      Change Password
                    </v-card-title>
                    <v-card-text>
                      <v-form ref="passwordForm" v-on:submit.prevent="changePassword">
                        <v-row dense>
                        <v-col cols="12" xl="5" lg="6" sm="7" md="7">
                          <v-text-field type="password" v-model.trim="user.oldPassword" label="Enter old password" dense prepend-icon="mdi-lock"></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row dense>
                        <v-col cols="12" xl="5" lg="6" sm="7" md="7">
                         <v-text-field type="password" v-model.trim="user.newPassword" label="New password" dense prepend-icon="mdi-lock"></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row dense>
                        <v-col cols="12" xl="5" lg="6" sm="7" md="7">
                         <v-text-field type="password" v-model.trim="user.confirmPassword" label="Confirm new password" dense prepend-icon="mdi-lock"></v-text-field>
                        </v-col>
                      </v-row>
                       <v-btn class="secondary">Cancel</v-btn>  <v-btn type="submit" color="#008F96" class="primary">Save</v-btn>
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
                </v-tab-item>
              </v-tabs>
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: "Settings",
  data() {
    return {
      overlay: false,
      user: {
        username: null,
        email: null,
        phone: null,
        password: null,
        oldPassword: null,
        newPassword: null,
        confirmPassword: null,
      }
    };
  },
  methods:{
    selectFile(files) {
      this.user.avatar = files;
    },
    updateUser(){
      if (!this.user.username || !this.user.email || !this.user.phone || !this.user.password){
        this.$swal("Fields validation","Please fill in all required fields","warning");
      } else{
         this.overlay=true
         let pass = sessionStorage.getItem("temp_pass")
         const user = this.$store.state.user
         if (pass === this.user.password){
            let userPayload = {
                username: this.user.username,
                email: this.user.email,
                phone: this.user.phone,
                password: this.user.password,
                password_confirmation: this.user.password
            }
            let endpoint = `${sessionStorage.getItem("BASE_URL")}/users/${user.id}`;
            axios
               .put(endpoint,userPayload, {
                    headers: {
                      Authorization: `Bearer ${sessionStorage.getItem("Authorization")}`,
                    },
               })
               .then((response)=>{
                  if (response.data.status === "success"){
                   this.overlay = false
                   this.$swal("Message", response.data.message, "success").then(()=>{
                     this.user.password = null
                     let updUser = response.data.data
                     this.$store.commit('setUser', updUser)
                   })
                } else {
                  this.overlay = false
                  this.$swal(response.data.status, response.data.message, response.data.status)
                }
                })
               .catch((error)=>{
                 this.overlay=false
                 this.$swal("Error", error + ", Couldn't reach API", "error");
               })
         }else{
           this.overlay=false
           this.$swal("Error","Old password is incorrect","error");
         }
      }
    },
    changePassword(){
       if (!this.user.oldPassword || !this.user.newPassword || !this.user.confirmPassword){
        this.$swal("Fields validation","Please fill in all required fields","warning");
       } else{
         let pass = sessionStorage.getItem("temp_pass")
         if (pass === this.user.oldPassword){
            this.overlay=true
            let userPayload = {
                password: this.user.newPassword,
                password_confirmation: this.user.confirmPassword
            }
            const user = this.$store.state.user
            let endpoint = `${sessionStorage.getItem("BASE_URL")}/changepassword/${user.id}`;
            axios
               .put(endpoint,userPayload, {
                    headers: {
                      Authorization: `Bearer ${sessionStorage.getItem("Authorization")}`,
                    },
               })
               .then((response)=>{
                  if (response.data.status === "success"){
                   this.overlay = false
                   this.$swal("Message", response.data.message, "success").then(()=>{
                     this.$refs.passwordForm.reset()
                   })
                } else {
                  this.overlay = false
                  this.$swal(response.data.status, response.data.message +", "+response.data.errors, response.data.status)
                }
                })
               .catch((error)=>{
                 this.overlay=false
                 this.$swal("Error", error + ", Couldn't reach API", "error");
               })
         } else{
           this.overlay=false
           this.$swal("Error","Old password is incorrect","error");
         }
       }
    },
    setUser(){
      const user = this.$store.state.user
      this.user.username = user.username
      this.user.email = user.email
      this.user.phone = user.phone
    }
  },
  mounted(){
    this.setUser()
  }
};
</script>