<template>
  <div class="BloodGroups">
    <v-row>
      <v-col cols="12">
        <v-dialog v-model="addBloodGroupDialog" transition="scale-transition" max-width="500px">
          <v-card>
            <v-card-title> Add Blood Group </v-card-title>
            <v-card-text>
              <v-form ref="bloodGroupForm" v-on:submit.prevent="saveBloodGroup">
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field label="Blood group name" v-model.trim="bloodGroup.name" dense></v-text-field>
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
        <v-dialog v-model="editBloodGroupDialog" transition="scale-transition" max-width="500px">
          <v-card>
            <v-card-title> Edit Blood Group </v-card-title>
            <v-card-text>
              <v-form ref="bloodGroupUpdateForm" v-on:submit.prevent="updateBloodGroup">
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field label="Blood group name" v-model.trim="bloodGroup.name" dense></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
                <div class="d-flex justify-end">
                  <v-btn v-on:click="cancelEdit" class="secondary text-capitalize">Cancel</v-btn>
                  <v-btn type="submit" class="ml-2 text-capitalize" dark color="#008F96">Update</v-btn>
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
            <span>Manage Blood Groups</span>
            <v-spacer></v-spacer>
            <v-btn class="text-capitalize" dark color="#2A9B90" v-on:click="addBloodGroupDialog = !addBloodGroupDialog" small
              outlined>
              <v-icon left>mdi-water</v-icon>New Blood Group
            </v-btn>
          </v-card-title>
          <v-card-text>
            <div class="col-lg-3 col-xl-3 col-xm-12 col-sm-5 col-md-3 pa-0">
              <v-text-field rounded outlined dense label="Search" v-model="search" append-icon="mdi-magnify">
              </v-text-field>
            </div>
            <v-data-table dense :headers="headers" class="elevation-4" :search="search" :items-per-page="7"
              :items="bloodGroups" :loading="loading" loading-text="loading blood groups">
              <template v-slot:[`item.action`]="{ item }">
                <v-icon small v-on:click="selectBloodGroup(item.id)" color="primary">mdi-pencil</v-icon>
                <v-icon small color="red" v-on:click="deleteBloodGroup(item.id)">mdi-delete</v-icon>
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
  name: "BloodGroups",
  data() {
    return {
      search: "",
      loading: false,
      overlay: false,
      bloodGroup: {
        name: null
      },
      blood_group_id: null,
      addBloodGroupDialog: false,
      editBloodGroupDialog: false,
      headers: [
        {
          text: "#",
          align: "start",
          value: "id",
        },
        {
          text: "Blood Group Name",
          value: "name",
        },
        {
          text: "Actions",
          value: "action",
        },
      ],
      bloodGroups: [],
    };
  },
  methods: {
    saveBloodGroup() {
      if (
        !this.bloodGroup.name
      ) {
        this.$swal(
          "Fields validation",
          "Please fill in all required fields",
          "warning"
        );
      } else {
        this.overlay = true;
        var bloodGroupPayload = {
           name: this.bloodGroup.name
        };
        let endpoint = `${config.BASE_URL}/blood_groups`;
        axios
          .post(endpoint, bloodGroupPayload, {
            headers: { Authorization: `Bearer ${this.$store.state.token}` },
          })
          .then((response) => {
            if (response.data.status === "success") {
              this.overlay = false;
              this.$swal("Message", response.data.message, "success").then(
                () => {
                  this.addBloodGroupDialog = false;
                  this.$refs.bloodGroupForm.reset();
                  this.loadBloodGroups();
                }
              );
            } else {
              this.$swal(
                response.data.status,
                response.data.message + ", " + response.data.errors,
                response.data.status
              );
              this.overlay = false;
            }
          })
          .catch((error) => {
            this.$swal("Error", error + ", Couldn't reach API", "error");
            this.overlay = false;
          });
      }
    },
    updateBloodGroup() {
      if (
        !this.bloodGroup.name 
      ) {
        this.$swal(
          "Fields validation",
          "Please fill in all required fields",
          "warning"
        );
      } else {
        this.overlay = true;
        var bloodGroupPayload = {
            name: this.bloodGroup.name 
        };
        let endpoint = `${config.BASE_URL}/blood_groups/${this.blood_group_id}`;
        axios
          .put(endpoint, bloodGroupPayload, {
            headers: { Authorization: `Bearer ${this.$store.state.token}` },
          })
          .then((response) => {
            if (response.data.status === "success") {
              this.overlay = false;
              this.$swal("Message", response.data.message, "success").then(
                () => {
                  this.editBloodGroupDialog = false;
                  this.$refs.bloodGroupUpdateForm.reset();
                  this.loadBloodGroups();
                }
              );
            } else {
              this.$swal(
                response.data.status,
                response.data.message + ", " + response.data.errors,
                response.data.status
              );
              this.overlay = false;
            }
          })
          .catch((error) => {
            this.$swal("Error", error + ", Couldn't reach API", "error");
            this.overlay = false;
          });
      }
    },
    loadBloodGroups() {
      this.loading = true;
      let endpoint = `${config.BASE_URL}/blood_groups`;
      axios
        .get(endpoint, {
          headers: { Authorization: `Bearer ${this.$store.state.token}` },
        })
        .then((response) => {
          this.bloodGroups = response.data.data;
          this.loading = false;
        })
        .catch((error) => {
          this.$swal("Error", error + ", Couldn't reach API", "error");
        });
    },
    selectBloodGroup(id) {
      let endpoint = `${config.BASE_URL}/blood_groups/${id}`;
      axios
        .get(endpoint, {
          headers: { Authorization: `Bearer ${this.$store.state.token}` },
        })
        .then((response) => {
          this.bloodGroup = response.data.data;
          this.blood_group_id = id;
          this.editBloodGroupDialog = true;
        })
        .catch((error) => {
          this.$swal("Error", error + ", Couldn't reach API", "error");
        });
    },
    deleteBloodGroup(id) {
      let endpoint = `${config.BASE_URL}/blood_groups/${id}`;
      this.$swal({
        title: "Delete Blood Group",
        text: "Are you sure you want to delete this blood group?",
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
              if (response.data.status === "success") {
                this.$swal("Message", response.data.message, "success").then(
                  () => {
                    this.loadBloodGroups();
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
      this.$refs.bloodGroupForm.reset();
      this.addBloodGroupDialog = false;
    },
    cancelEdit() {
      this.$refs.bloodGroupUpdateForm.reset();
      this.editBloodGroupDialog = false;
    },
  },
  mounted() {
    this.loadBloodGroups();
  },
};
</script>
