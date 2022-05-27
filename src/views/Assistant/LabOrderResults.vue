<template>
 <div class="LabOrderResults">
    <v-row>
      <v-col cols="12">
          <v-card shaped class="elevation-7">
            <v-card-title class="d-flex mt-0">
               <span>Lab Order Results</span>
               <v-spacer></v-spacer>
               <v-row class="d-flex justify-end" dense>
                 <v-col cols="4" dense>
                  <v-autocomplete label="Select Results" @change="selectResults" v-model="resultsType" :items="results_types"></v-autocomplete>
               </v-col>
               </v-row>
               <v-btn class="mr-2 ml-4" outlined small dark color="#F08200" v-on:click="exportToPdf"><v-icon left>mdi-file-export</v-icon>Export</v-btn>
            </v-card-title>
            <v-card-text>
              <div class="col-lg-3 col-xl-3 col-xm-12 col-sm-5 col-md-3 pa-0"> <v-text-field outlined dense label="Search" v-model="search"  append-icon="mdi-magnify"></v-text-field></div>
               <v-data-table dense :headers="headers" show-select v-model="selected" class="elevation-4" :search="search" :items="lab_order_results" :items-per-page="7"  :loading="loading" loading-text="loading lab order results">
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
    name: 'LabOrderResults',
    data(){
      return {
        lab_order_results:[],
        selected: [],
        results_types: ['Active', 'Archieved'],
        resultsType: null,
        loading: false,
        heading: 'Lab order Results',
        search: '',
        headers: [
        {
          text: '#',
          align: 'start',
          value: 'id',
        },
        {
          text: 'Lab Order Id',
          value: 'lab_order_id',
        },
        {
          text: 'Patient Name',
          value: 'patient_name',
        },
        {
          text: 'Blood Type',
          value: 'blood_type',
        },
        {
          text: 'HIV Results',
          value: 'hiv_res',
        },
         {
          text: 'Tissue Descr',
          value: 'tisuue_res',
        },
        {
          text: 'Results Date',
          value: 'created_at',
        }
      ],
      }
    },
    methods: {
      selectResults(){
        switch (this.resultsType){
          case "Active":{
            this.loadLabOrderResults("results");
            break;
          }
          case "Archieved":{
            this.loadLabOrderResults("results_archieve");
            break;
          }
        }
      },
      loadLabOrderResults(resource){
        this.loading = true
        let endpoint = `${sessionStorage.getItem("BASE_URL")}/${resource}`;
        axios
          .get(endpoint, {
              headers: {Authorization: `Bearer ${sessionStorage.getItem("Authorization")}`}
            })
          .then((response) => {
            this.lab_order_results = response.data.data
            this.loading = false
           })
           .catch((error) => {
             this.$swal("Error", error + ", Couldn't reach API", "error");
           });
      },
      exportToPdf(){
        let items = [];
        if (this.lab_order_results.length == 0) {
          this.$swal("Infor", "Records not found", "info");
        } else {
          if (this.selected.length == 0){
           items = this.patients
          } else{
           items = this.selected
          }
       const columns = [
        { title: "Order ID", dataKey: "lab_order_id" },
        { title: "Patient Name", dataKey: "patient_name" },
        { title: "Blood Type", dataKey: "blood_type" },
        { title: "Blood Temperature", dataKey: "temperature" },
        { title: "Results Date", dataKey: "created_at" },
        { title: "Results ", dataKey: "name" },
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
      this.loadLabOrderResults("results");
    }
  }
</script>
