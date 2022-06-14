<template>
 <div class="LabOrders">
    <v-row>
      <v-dialog v-model="resultsDialog" transition="scale-transition" max-width="400">
         <v-card>
           <v-card-title>Lab Order Results</v-card-title>
           <v-card-text>
              <v-form ref="resultsForm" v-on:submit.prevent="addLabOrderResults">
                <v-text-field label="HIV Result" v-model="lab_order.hiv_res"></v-text-field>
                <v-textarea
                 label="Tissue Description"
                 outlined
                 v-model="lab_order.tisuue_res"
              ></v-textarea>
              <div class="d-flex justify-end">
                <v-btn v-on:click="cancel" class="secondary">Cancel</v-btn> <v-btn type="submit" class="ml-2" dark color="#008F96">Save</v-btn>
              </div>
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
      </v-dialog>
      <v-col cols="12">
          <v-card shaped class="elevation-7">
            <v-card-title class="d-flex">
               <span>Lab Orders</span>
               <v-spacer></v-spacer>
                <v-row class="d-flex justify-end" dense>
                 <v-col cols="4" dense>
                  <v-autocomplete label="Select" @change="selectLabOrders" v-model="orderType" :items="order_types"></v-autocomplete>
               </v-col>
               </v-row>
            </v-card-title>
            <v-card-text>
              <div class="col-lg-3 col-xl-3 col-xm-12 col-sm-5 col-md-3 pa-0"> <v-text-field outlined dense label="Scan Qrcode" v-on:change="verify" v-model="search"  append-icon="mdi-magnify"></v-text-field></div>
               <v-data-table dense :headers="headers"  class="elevation-4" :search="search" :items-per-page="6" :items="lab_orders" :loading="loading" loading-text="loading lab orders">
                 <template v-slot:[`item.results`]="{ item }">
                   <v-icon small class="ml-4" color="#35B4E4" v-on:click="showAddResultsDialog(item.id, item.patient_id)">mdi-plus-box</v-icon>
                 </template>
                 <template v-slot:[`item.created_at`]="{ item }">
                    <span>{{item.created_at.substr(0, 10)}}</span>
                 </template>
                 <template v-slot:[`item.verified`]="{ item }">
                   <v-chip
                      small
                      style="width:50px"
                      :color="getColor(item.verified)"
                      dark
                    >
                    {{ item.verified }}
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
  import axios from 'axios'
  export default {
    name: 'LabOrders',
    data(){
      return {
        order_types: ['Active', 'Archieved'],
        orderType: null,
        lab_orders:[],
        lab_order: {
          hiv_res: null,
          tisuue_res: null,
        },
        lab_order_id: null,
        overlay: false,
        patient_id: null,
        resultsDialog: false,
        loading: false,
        search: '',
        headers: [
        {
          text: '#',
          align: 'start',
          value: 'id',
        },
        {
          text: 'Patient Id',
          value: 'patient_id',
        },
        {
          text: 'Qrcode',
          value: 'qrcode',
        },
        {
          text: 'Blood Type',
          value: 'blood_type',
        },
        {
          text: 'Sample Type',
          value: 'tissue_name',
        },
        {
          text: 'Requested By',
          value: 'requested_by',
        },
        {
          text: 'Taken By',
          value: 'taken_by',
        },
        {
          text: 'Consultation Date',
          value: 'created_at',
        },
        {
          text: 'Verified',
          value: 'verified',
        }, {
          text: 'Test Results',
          value: 'results',
        }
      ],
      }
    },
    methods: {
      selectLabOrders(){
        switch (this.orderType){
          case "Active":{
            this.loadLabOrders("lab_orders");
            break;
          }
          case "Archieved":{
            this.loadLabOrders("lab_orders_archieve");
            break;
          }
        }
      },
       getColor (verified) {
        if (verified) return 'green'
        else return 'red'
      },
      verify() {
        if (!this.search) {
          console.log("")
        } else {
            let endpoint = `${sessionStorage.getItem("BASE_URL")}/verify_lab_order/${this.search}`;
          axios
          .get(endpoint, {
              headers: {Authorization: `Bearer ${sessionStorage.getItem("Authorization")}`}
            })
          .then((response) => {
            this.$swal("Message", response.data.message, "info").then(() => {
              this.loadLabOrders("lab_orders")
            })
           })
           .catch((error) => {
             this.$swal("Error", error + ", Couldn't reach API", "error");
           });
        }
      },
      loadLabOrders(resource){
        this.loading = true
        let endpoint = `${sessionStorage.getItem("BASE_URL")}/${resource}`;
        axios
          .get(endpoint, {
              headers: {Authorization: `Bearer ${sessionStorage.getItem("Authorization")}`}
            })
          .then((response) => {
            this.lab_orders = response.data.data
            this.loading = false
           })
           .catch((error) => {
             this.$swal("Error", error + ", Couldn't reach API", "error");
           });
      },
      showAddResultsDialog(lab_order_id, patient_id){
         this.resultsDialog = true
         this.lab_order_id = lab_order_id
         this.patient_id = patient_id
      },
      addLabOrderResults(){
        if (!this.lab_order.hiv_res || !this.lab_order.tisuue_res){
          this.$swal("Fields validation", "Please fill in all required fields", "warning")
        }else{
          this.overlay = true
          let endpoint = `${sessionStorage.getItem("BASE_URL")}/patients/${this.patient_id}/lab_orders/${this.lab_order_id}/results`;
          let lab_orderPayload = {
            hiv_res: this.lab_order.hiv_res,
            tisuue_res: this.lab_order.tisuue_res,
            conducted_by: this.$store.state.user.username
          }
          axios
            .post(endpoint,lab_orderPayload, {
              headers: {Authorization: `Bearer ${sessionStorage.getItem("Authorization")}`}
            })
            .then(response =>{
              if (response.data.status === "success"){
                this.overlay = false
                this.$swal("Message", response.data.message, "success").then(()=>{
                  this.resultsDialog = false
                  this.$refs.resultsForm.reset()
                  this.loadLabOrders("lab_orders")
                })
              } else {
                this.$swal(response.data.status, response.data.message, response.data.status)
                this.overlay = false
              }
            })
            .catch(error=>{
              this.$swal("Error", error + ", Couldn't reach API", "error")
              this.overlay = false
            })
        }
      },
      cancel(){
        this.resultsDialog = false
        this.$refs.resultsForm.reset()
      }
    },
    mounted(){
      this.loadLabOrders("lab_orders")
    }
  }
</script>
