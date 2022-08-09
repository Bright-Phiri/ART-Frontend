<template>
 <div class="LabOrders">
    <v-row>
      <v-col cols="12">
          <v-card shaped class="elevation-7">
            <v-card-title class="d-flex mt-0">
               <span>Lab Orders</span>
               <v-spacer></v-spacer>
                <v-row class="d-flex justify-end" dense>
                 <v-col cols="4" dense>
                  <v-autocomplete label="Select" @change="selectLabOrders" v-model="orderType" :items="order_types"></v-autocomplete>
               </v-col>
               </v-row>
               <v-btn class="mr-2 ml-2 text-capitalize" outlined small dark color="#F08200" v-on:click="exportToPdf"><v-icon left>mdi-file-export</v-icon>Export all</v-btn>
            </v-card-title>
            <v-card-text>
              <div class="col-lg-3 col-xl-3 col-xm-12 col-sm-5 col-md-3 pa-0"> <v-text-field rounded outlined dense label="Search" v-model="search"  append-icon="mdi-magnify"></v-text-field></div>
               <v-data-table dense :headers="headers" show-select v-model="selected" class="elevation-4" :search="search" :items-per-page="6" :items="lab_orders" :loading="loading" loading-text="loading lab orders">
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
  import jsPDF from 'jspdf'
  import config from '@/config'
  import 'jspdf-autotable'
  export default {
    name: 'LabOrders',
    data(){
      return {
        order_types: ['Active', 'Archieved'],
        orderType: null,
        heading: 'LabOrders',
        lab_orders:[],
        loading: false,
        selected: [],
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
          value:'verified'
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
      loadLabOrders(resource){
        this.loading = true
        let endpoint = `${config.BASE_URL}/${resource}`;
        axios
          .get(endpoint, {
              headers: { Authorization: `Bearer ${this.$store.state.token}` }
            })
          .then((response) => {
            this.lab_orders = response.data.data
            this.loading = false
           })
           .catch((error) => {
             this.$swal("Error", error + ", Couldn't reach API", "error");
           });
      },
      exportToPdf(){
       let items = [];
       if (this.lab_orders.length == 0){
          this.$swal("Infor","Records not found", "info");
       } else{
         if (this.selected.length == 0){
           items = this.lab_orders
          } else{
           items = this.selected
          }
       const columns = [
        { title: "ID", dataKey: "id" },
        { title: "Patient ID", dataKey: "patient_id" },
        { title: "QRcode", dataKey: "qrcode" },
        { title: "Tissue Name", dataKey: "tissue_name" },
        { title: "Requested By", dataKey: "requested_by" },
        { title: "Taken By", dataKey: "taken_by" },
        { title: "Consultation Date", dataKey: "created_at" },
      ];
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "in",
        format: "letter"
      });
      // Using autoTable plugin
      doc.autoTable({
        columns,
        body: items,
        //margin: { left: 0.5, top: 1.25 }
      });
      // Creating footer and saving file
      doc.save(`${this.heading}.pdf`);
      }
    }
    },
    mounted(){
      this.loadLabOrders("lab_orders")
    }
  }
</script>
