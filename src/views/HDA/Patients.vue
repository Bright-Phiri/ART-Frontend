<template>
  <div class="Patients">
    <v-row>
      <v-col cols="12">
        <v-dialog v-model="addPatientDialog" transition="scale-transition" max-width="600px">
          <v-card>
            <v-card-title>
              Add Patient
            </v-card-title>
            <v-card-text>
              <v-form ref="patientForm" v-on:submit.prevent="addPatient">
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field label="First Name" v-model.trim="patient.first_name" dense></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field label="Last Name" v-model.trim="patient.last_name" dense></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-autocomplete label="Gender" :items="genders" v-model.trim="patient.gender" dense>
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-menu v-model="menu2" :close-on-content-click="false" :nudge-right="40"
                        transition="scale-transition" offset-y min-width="auto">
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field v-model="patient.dob" label="Date of Birth" prepend-icon="mdi-calendar" readonly
                            v-bind="attrs" v-on="on" dense>
                          </v-text-field>
                        </template>
                        <v-date-picker v-model="patient.dob" @input="menu2 = false">
                        </v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field label="Village" v-model.trim="patient.village" dense></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-autocomplete label="District" :items="districts" v-model="patient.district" dense>
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field label="Phone" v-model.trim="patient.phone" dense></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field label="Location" v-model.trim="patient.location" dense></v-text-field>
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
        <v-dialog v-model="labOrderDialog" persistent max-width="430px">
          <v-card>
            <v-card-title class="d-flex">
              <span>Consultation</span>
              <v-spacer></v-spacer>
              <v-btn plain class="text-capitalize" v-on:click="printQrCode" depressed>Print Qrcode</v-btn>
              <div id="toprint" class="d-flex justify-center">
                <qr-code :text="qrCodeId" size="60"></qr-code>
              </div>
            </v-card-title>
            <v-card-text>
              <v-form ref="consultationForm" v-on:submit.prevent="addLabOrder">
                <v-text-field label="QR Code" readonly v-model="lab_order.qrcode"></v-text-field>
                <v-autocomplete label="Blood type" :items="blood_groups" v-model="lab_order.blood_type"></v-autocomplete>
                <v-text-field label="Sample Type" v-model="lab_order.tissue_name"></v-text-field>
                <v-text-field label="Requested By" v-model="lab_order.requested_by"></v-text-field>
                <div class="d-flex justify-end">
                  <v-btn v-on:click="cancelLabOrder" dark class="secondary text-capitalize">Cancel</v-btn>
                  <v-btn class="ml-2 text-capitalize" dark color="#008F96" type="submit">Add lab order</v-btn>
                </div>
              </v-form>
            </v-card-text>
            <v-overlay absolute opacity="0" :value="overlay">
              <v-progress-circular indeterminate color="#008F96" size="64"></v-progress-circular>
            </v-overlay>
          </v-card>
        </v-dialog>

        <v-dialog v-model="editPatientDialog" transition="scale-transition" max-width="600px">
          <v-card>
            <v-card-title>
              Edit Patient
            </v-card-title>
            <v-card-text>
              <v-form ref="editPatientForm" v-on:submit.prevent="updatePatient">
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field label="First Name" v-model.trim="patient.first_name" dense></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field label="Last Name" v-model.trim="patient.last_name" dense></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-autocomplete label="Gender" :items="genders" v-model.trim="patient.gender" dense>
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40"
                        transition="scale-transition" offset-y min-width="auto">
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field v-model="patient.dob" label="Date of Birth" prepend-icon="mdi-calendar" readonly
                            v-bind="attrs" v-on="on" dense>
                          </v-text-field>
                        </template>
                        <v-date-picker v-model="patient.dob" @input="menu2 = false">
                        </v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field label="Village" v-model.trim="patient.village" dense></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-autocomplete label="District" :items="districts" v-model="patient.district" dense>
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field label="Phone" v-model.trim="patient.phone" dense></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field label="Location" v-model.trim="patient.location" dense></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
                <div class="d-flex justify-end">
                  <v-btn v-on:click="cancelEdit" class="text-capitalize secondary">Cancel</v-btn>
                  <v-btn type="submit" class="ml-2 text-capitalize" dark color="#008F96">Update patient</v-btn>
                </div>
              </v-form>
            </v-card-text>
            <v-overlay absolute opacity="0" :value="overlay">
              <v-progress-circular indeterminate color="#008F96" size="64"></v-progress-circular>
            </v-overlay>
          </v-card>
        </v-dialog>
        <v-card shaped class="elevation-7">
          <v-card-title class="d-flex mt-0">
            <span>Patients</span>
            <v-spacer></v-spacer>
            <v-btn class="mr-2 text-capitalize" outlined small dark color="#F08200" v-on:click="exportToPdf">
              <v-icon left>mdi-file-export</v-icon>Export all
            </v-btn>
            <v-btn class="text-capitalize" outlined small dark color="#2A9B90"
              v-on:click="addPatientDialog = !addPatientDialog">
              <v-icon left>mdi-account-plus</v-icon>New Patient
            </v-btn>
          </v-card-title>
          <v-card-text>
            <div class="col-lg-3 col-xl-3 col-xm-12 col-sm-5 col-md-3 pa-0">
              <v-text-field outlined dense label="Search" rounded v-model="search" append-icon="mdi-magnify">
              </v-text-field>
            </div>
            <v-data-table dense :headers="headers" v-model="selected" show-select class="elevation-4" :search="search"
              :items-per-page="7" :items="patients" :loading="loading" loading-text="loading patients">
              <template v-slot:[`item.action`]="{ item }">
                <v-icon small class="mr-0" color="#2A9B90" v-on:click="showLabOrderDialog(item.id)">mdi-plus-box
                </v-icon>
                <v-icon small class="mr-0" v-on:click="selectPatientRecord(item.id)" color="secondary">mdi-pencil
                </v-icon>
                <v-icon small class="mr-0" color="red" v-on:click="deletePatient(item.id)">mdi-delete</v-icon>
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
  name: 'Patients',
  data() {
    return {
      qrCodeId: null,
      heading: 'Patients',
      selected: [],
      patient: {
        first_name: null,
        last_name: null,
        gender: null,
        dob: null,
        district: null,
        village: null,
        phone: null,
        location: null
      },
      lab_order: {
        patient_id: null,
        qrcode: null,
        blood_type: null,
        tissue_name: null,
        requested_by: null,
        taken_by: null
      },
      blood_groups: [],
      labOrderDialog: false,
      patient_id: null,
      editPatientDialog: false,
      menu: false,
      modal: false,
      menu2: false,
      overlay: false,
      genders: ['Male', 'Female'],
      districts: ['Dedza', 'Dowa', 'Kasungu', 'Lilongwe', 'Mchinji', 'Nkhotakota', 'Ntcheu', 'Ntchisi', 'Salima', 'Chitipa', 'Karonga', 'Likoma', 'Mzimba', 'Nkhata Bay', 'Rumphi', 'Balaka', 'Blantyre', 'Chikwawa', 'Chiradzulu', 'Machinga', 'Mangochi', 'Mulanje', 'Mwanza', 'Nsanje', 'Thyolo', 'Phalombe', 'Zomba', 'Neno'],
      addPatientDialog: false,
      patients: [],
      loading: false,
      search: '',
      headers: [
        {
          text: '#',
          align: 'start',
          value: 'id',
        },
        {
          text: 'First Name',
          align: 'start',
          value: 'first_name',
        },
        {
          text: 'Last Name',
          value: 'last_name',
        },
        {
          text: 'Gender',
          value: 'gender',
        },
        {
          text: 'DOB',
          value: 'dob',
        },
        {
          text: 'District',
          value: 'district',
        },
        {
          text: 'Village',
          value: 'village',
        },
        {
          text: 'Phone number',
          value: 'phone',
        }, {
          text: 'Location',
          value: 'location',
        }, {
          text: 'Actions',
          value: 'action',
        }
      ],
    }
  },
  methods: {
    printQrCode() {
      var printwin = window.open("");
      printwin.document.write(document.getElementById("toprint").innerHTML);
      printwin.stop();
      printwin.print();
      printwin.close();
    },
    addPatient() {
      if (!this.patient.first_name || !this.patient.last_name || !this.patient.gender || !this.patient.dob || !this.patient.district || !this.patient.village || !this.patient.phone || !this.patient.location) {
        this.$swal("Fields validation", "Please fill in all required fields", "warning")
      } else {
        this.overlay = true
        let patientPayload = {
          first_name: this.patient.first_name,
          last_name: this.patient.last_name,
          gender: this.patient.gender,
          dob: this.patient.dob,
          district: this.patient.district,
          village: this.patient.village,
          phone: this.patient.phone,
          location: this.patient.location
        }
        let endpoint = `${config.BASE_URL}/patients`;
        axios
          .post(endpoint, patientPayload, {
            headers: { Authorization: `Bearer ${this.$store.state.token}` }
          })
          .then(response => {
            if (response.data.status === "success") {
              this.overlay = false
              this.$swal("Message", response.data.message, "success").then(() => {
                this.addPatientDialog = false
                this.$refs.patientForm.reset()
                this.loadPatients()
              })
            } else {
              this.$swal(response.data.status, response.data.message + ", " + response.data.errors, response.data.status)
              this.overlay = false
            }
          })
          .catch(error => {
            this.$swal("Error", error + ", Couldn't reach API", "error")
            this.overlay = false
          })
      }
    },
    selectPatientRecord(patient_id) {
      let endpoint = `${config.BASE_URL}/patients/${patient_id}`;
      axios
        .get(endpoint, {
          headers: { Authorization: `Bearer ${this.$store.state.token}` }
        })
        .then((response) => {
          this.patient = response.data.data
          this.patient_id = patient_id
          this.editPatientDialog = true
        })
        .catch((error) => {
          this.$swal("Error", error + ", Couldn't reach API", "error");
        })
    },
    showLabOrderDialog(patient_id) {
      this.qrCodeId = '' + Math.floor(Math.random() * 1000000000)
      this.lab_order.qrcode = this.qrCodeId
      this.labOrderDialog = true
      this.lab_order.patient_id = patient_id
    },
    addLabOrder() {
      if (!this.lab_order.qrcode || !this.lab_order.blood_type || !this.lab_order.requested_by) {
        this.$swal("Fields validation", "Please fill in all required fields", "warning")
      } else {
        this.overlay = true
        let lab_orderPayload = {
          qrcode: this.lab_order.qrcode,
          blood_type: this.lab_order.blood_type,
          tissue_name: this.lab_order.tissue_name,
          requested_by: this.lab_order.requested_by,
          taken_by: this.$store.state.user.username
        }
        let endpoint = `${config.BASE_URL}/patients/${this.lab_order.patient_id}/lab_orders`;
        axios
          .post(endpoint, lab_orderPayload, {
            headers: { Authorization: `Bearer ${this.$store.state.token}` }
          })
          .then(response => {
            if (response.data.status === "success") {
              this.overlay = false
              this.$swal("Message", response.data.message, "success").then(() => {
                this.$refs.consultationForm.reset()
                this.labOrderDialog = false
              })
            } else {
              this.$swal(response.data.status, response.data.message + ", " + response.data.errors, response.data.status)
              this.overlay = false
            }
          })
          .catch(error => {
            this.$swal("Error", error + ", Couldn't reach API", "error")
            this.overlay = false
          })
      }
    },
    updatePatient() {
      if (!this.patient.first_name || !this.patient.last_name || !this.patient.gender || !this.patient.dob || !this.patient.district || !this.patient.village || !this.patient.phone || !this.patient.location) {
        this.$swal("Fields validation", "Please fill in all required fields", "warning")
      } else {
        this.overlay = true
        let patientPayload = {
          first_name: this.patient.first_name,
          last_name: this.patient.last_name,
          gender: this.patient.gender,
          dob: this.patient.dob,
          district: this.patient.district,
          village: this.patient.village,
          phone: this.patient.phone,
          location: this.patient.location
        }
        let endpoint = `${config.BASE_URL}/patients/${this.patient_id}`;
        axios
          .put(endpoint, patientPayload, {
            headers: { Authorization: `Bearer ${this.$store.state.token}` }
          })
          .then(response => {
            if (response.data.status === "success") {
              this.overlay = false
              this.$swal("Message", response.data.message, "success").then(() => {
                this.editPatientDialog = false
                this.$refs.editPatientForm.reset()
                this.loadPatients()
              })
            } else {
              this.$swal(response.data.status, response.data.message + ", " + response.data.errors, response.data.status)
              this.overlay = false
            }
          })
          .catch(error => {
            this.$swal("Error", error + ", Couldn't reach API", "error")
            this.overlay = false
          })
      }
    },
    deletePatient(patient_id) {
      let endpoint = `${config.BASE_URL}/patients/${patient_id}`;
      this.$swal({
        title: 'Delete Patient',
        text: "Are you sure you want to delete this patient?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
      })
        .then((result) => {
          if (result.isConfirmed) {
            axios
              .delete(endpoint, {
                headers: { Authorization: `Bearer ${this.$store.state.token}` }
              })
              .then((response) => {
                if (response.data.status === "success") {
                  this.$swal("Message", response.data.message, "success").then(() => {
                    this.loadPatients()
                  }
                  );
                }
              })
              .catch((error) => {
                this.$swal("Error", error + ", Couldn't reach API", "error");
              })
          }
        });
    },
    cancelLabOrder() {
      this.$refs.consultationForm.reset()
      this.qrCodeId = null
      this.labOrderDialog = false
    },
    cancel() {
      this.$refs.patientForm.reset()
      this.addPatientDialog = false
    },
    cancelEdit() {
      this.$refs.editPatientForm.reset()
      this.editPatientDialog = false
    },
    loadPatients() {
      this.loading = true
      let endpoint = `${config.BASE_URL}/patients`;
      axios
        .get(endpoint, {
          headers: { Authorization: `Bearer ${this.$store.state.token}` }
        })
        .then((response) => {
          this.patients = response.data.data
          this.loading = false
        })
        .catch((error) => {
          this.$swal("Error", error + ", Couldn't reach API", "error");
        });
    },
    exportToPdf() {
      let items = [];
      if (this.patients.length == 0) {
        this.$swal("Infor", "Records not found", "info");
      } else {
        if (this.selected.length == 0) {
          items = this.patients
        } else {
          items = this.selected
        }
        const columns = [
          { title: "ID", dataKey: "id" },
          { title: "First Name", dataKey: "first_name" },
          { title: "Last Name", dataKey: "last_name" },
          { title: "Gender", dataKey: "gender" },
          { title: "Date of Birth", dataKey: "dob" },
          { title: "District", dataKey: "district" },
          { title: "Village", dataKey: "village" },
          { title: "Phone Number", dataKey: "phone" },
          { title: "Location", dataKey: "location" },
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
    },
    loadBloodGroups(){
      let endpoint = `${config.BASE_URL}/blood_groups`;
      axios
        .get(endpoint, {
          headers: { Authorization: `Bearer ${this.$store.state.token}` }
        })
        .then((response) => {
          var blood_groups = response.data.data;
          blood_groups.forEach(group => {
             this.blood_groups.push(group.name);
          });
        })
        .catch((error) => {
          this.$swal("Error", error + ", Couldn't reach API", "error");
        });
    }
  },
  mounted() {
    this.loadPatients()
    this.loadBloodGroups();
  }
}
</script>
