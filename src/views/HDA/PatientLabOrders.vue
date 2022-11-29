<template>
    <div class="LabOrders">
      <v-row>
        <v-col cols="12">
          <v-card shaped class="elevation-7">
            <v-card-title class="d-flex mt-0">
              <span>{{this.$route.params.first_name}} {{this.$route.params.last_name}} Lab Orders</span>
              <v-spacer></v-spacer>
            </v-card-title>
            <v-card-text>
              <div class="col-lg-3 col-xl-3 col-xm-12 col-sm-5 col-md-3 pa-0">
                <v-text-field rounded outlined dense label="Search" v-model="search" append-icon="mdi-magnify">
                </v-text-field>
              </div>
              <v-data-table dense :headers="headers" show-select v-model="selected" class="elevation-4" :search="search"
                :items-per-page="6" :items="lab_orders" :loading="loading" loading-text="loading lab orders">
                <template v-slot:[`item.verified`]="{ item }">
                <v-chip class="text-center" small style="width: 65px" outlined :color="getColor(item.verified)" dark>
                  {{item.verified ?"verified":"pending"}}
                </v-chip>
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
    name: "LabOrders",
    data() {
      return {
        heading: "LabOrders",
        lab_orders: [],
        loading: false,
        search: "",
        headers: [
          {
            text: "#",
            align: "start",
            value: "id",
          },
          {
            text: "Patient Id",
            value: "patient_id",
          },
          {
            text: "Qrcode",
            value: "qrcode",
          },
          {
            text: "Blood Type",
            value: "blood_type",
          },
          {
            text: "Sample Type",
            value: "tissue_name",
          },
          {
            text: "Requested By",
            value: "requested_by",
          },
          {
            text: "Taken By",
            value: "taken_by",
          },
          {
            text: "Consultation Date",
            value: "created_at",
          },
          {
            text: "Status",
            value: "verified",
          },
        ],
      };
    },
    methods: {
      loadLabOrders(patient_id) {
        this.loading = true;
        let endpoint = `${config.BASE_URL}/patients/${patient_id}/lab_orders/${patient_id}`;
        axios
          .get(endpoint, {
            headers: { Authorization: `Bearer ${this.$store.state.token}` },
          })
          .then((response) => {
            this.lab_orders = response.data.data;
            this.loading = false;
          })
          .catch((error) => {
            this.$swal("Error", error + ", Couldn't reach API", "error");
          });
      },
      getColor(verified) {
       if (verified) return "success";
       else return "warning";
      },
    },
    mounted() {
      this.loadLabOrders(this.$route.params.patient_id);
    },
  };
  </script>
  