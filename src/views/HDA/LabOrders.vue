<template>
 <div class="LabOrders">
    <v-row>
      <v-col cols="12">
          <v-card tile>
            <v-card-title class="d-flex">
               <span>Lab Orders</span>
               <v-spacer></v-spacer>
               <v-btn class="mr-2" outlined small dark color="#F08200" v-on:click="exportToPdf"><v-icon left>mdi-file-export</v-icon>Export</v-btn>
            </v-card-title>
            <v-card-text>
              <div class="col-lg-3 col-xl-3 col-xm-12 col-sm-5 col-md-3 pa-0"> <v-text-field outlined dense label="Search" v-model="search"  append-icon="mdi-magnify"></v-text-field></div>
               <v-data-table dense :headers="headers" show-select v-model="selected" class="elevation-3" :search="search" :items-per-page="7" :items="lab_orders" :loading="loading" loading-text="loading lab orders">
                 <template v-slot:[`item.created_at`]="{ item }">
                    <span>{{item.created_at.substr(0, 10)}}</span>
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
  import 'jspdf-autotable'
  export default {
    name: 'LabOrders',
    data(){
      return {
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
          text: 'Temperature',
          value: 'temperature',
        },
        {
          text: 'Consultation Date',
          value: 'created_at',
        }
      ],
      }
    },
    methods: {
      loadLabOrders(){
        this.loading = true
        let endpoint = `${sessionStorage.getItem("BASE_URL")}/lab_orders`;
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
        { title: "Blood Type", dataKey: "blood_type" },
        { title: "Blood Temperature", dataKey: "temperature" },
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
      this.loadLabOrders()
    }
  }
</script>
