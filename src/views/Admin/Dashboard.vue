<template>
  <div class="Dashboard">
    <v-row dense>
      <v-col cols="12">
        <v-card tile outlined>
          <v-card-text class>
            <v-container fluid>
              <v-row >
                <v-col v-if="user_role === 'Admin'" cols="12" lg="4" sm="6" md="4" class="py-0">
                  <v-alert border="left" colored-border color="info" elevation="2">
                    <v-row>
                      <v-col>
                        <v-avatar tile size="50">
                          <v-img src="@/assets/user-group.png"></v-img>
                        </v-avatar>
                      </v-col>
                      <v-col>
                        <h6 class="text-center font-weight-light">Users</h6>
                        <h5 class="text-center text-white" id="patients">{{ users }}</h5>
                      </v-col>
                    </v-row>
                  </v-alert>
                </v-col>

                <v-col cols="12" lg="4" sm="6" md="4" class="py-0">
                  <v-alert border="left" colored-border color="info" elevation="2">
                    <v-row>
                      <v-col>
                        <v-avatar tile size="50">
                          <v-img src="@/assets/patients-icon.png"></v-img>
                        </v-avatar>
                      </v-col>
                      <v-col>
                        <h6 class="text-center font-weight-light">Patients</h6>
                        <h5 class="text-center text-white" id="patients">{{ patients }}</h5>
                      </v-col>
                    </v-row>
                  </v-alert>
                </v-col>
                <v-col cols="12" lg="4" sm="6" md="4" class="py-0">
                  <v-alert border="left" colored-border color="info" elevation="2">
                    <v-row>
                      <v-col>
                        <v-avatar tile size="50">
                          <v-img src="@/assets/lab-test.png"></v-img>
                        </v-avatar>
                      </v-col>
                      <v-col>
                        <h6 class="text-center font-weight-light">Lab Orders</h6>
                        <h5 class="text-center text-white" id="patients">{{ lab_orders }}</h5>
                      </v-col>
                    </v-row>
                  </v-alert>
                </v-col>

                <v-col v-if="user_role === 'HDA Personnel'" cols="12" lg="4" sm="6" md="4" class="py-0">
                  <v-alert border="left" colored-border color="info" elevation="2">
                    <v-row>
                      <v-col>
                        <v-avatar tile size="50">
                          <v-img src="@/assets/results.jpg"></v-img>
                        </v-avatar>
                      </v-col>
                      <v-col>
                        <h6 class="text-center font-weight-light">Lab Order Results</h6>
                        <h5 class="text-center text-white" id="patients">{{ results }}</h5>
                      </v-col>
                    </v-row>
                  </v-alert>
                </v-col>

                  <v-col v-if="user_role === 'Lab Assistant'" cols="12" lg="4" sm="6" md="4" class="py-0">
                  <v-alert border="left" colored-border color="info" elevation="2">
                    <v-row>
                      <v-col>
                        <v-avatar tile size="50">
                          <v-img src="@/assets/results.jpg"></v-img>
                        </v-avatar>
                      </v-col>
                      <v-col>
                        <h6 class="text-center font-weight-light">Lab Order Results</h6>
                        <h5 class="text-center text-white" id="patients">{{ results }}</h5>
                      </v-col>
                    </v-row>
                  </v-alert>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" lg="8">
        <v-card tile outlined>
          <v-card-text>
            <div class="d-flex justify-center">
              <apexchart width="600" type="area"  :options="option1" :series="stati"></apexchart>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" lg="4">
        <v-card tile outlined>
          <v-card-title class="d-flex">Statistics</v-card-title>
          <v-divider class="mx-4"></v-divider>
          <v-card-text>
            <div class="d-flex justify-center">
              <apexchart width="380" type="donut" :options="options" :series="series"></apexchart>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>

import axios from 'axios'
export default {
  name: 'Dashboard',
  data() {
    return {
      patients: 0,
      users: 0,
      lab_orders: 0,
      results: 0,
      user_role: null,
      option1: {
        xaxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        stroke: {
          curve: 'smooth'
        },
      },
      stati: [{
        name: 'Lab orders',
        data: []
      }],
      options: {
        legend: {
          position: 'bottom'
        },
        labels: ["Users", "Patients", "Lab Order Results"]
      },
      series: [],
    }
  },
  methods: {
    statistics() {
      let endpoint = `${sessionStorage.getItem("BASE_URL")}/statistics`;
      axios
        .get(endpoint, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("Authorization")}`,
          },
        })
        .then((response) => {
          this.patients = response.data.patients;
          this.lab_orders = response.data.lab_orders;
          this.users = response.data.users;
          this.results = response.data.results
          if(this.user_role === "Admin"){
             this.series.push(response.data.users)
             this.series.push(response.data.patients)
             this.series.push(response.data.results)
          }else{
           this.options.labels.shift()
           this.options.labels.unshift("Lab orders");
           this.series.push(response.data.lab_orders)
           this.series.push(response.data.patients)
           this.series.push(response.data.results)
          }
        })
        .catch((error) => {
          this.$swal("Error", error + ", Couldn't reach API", "error");
        });
    },
    labOrdersStati() {
      let januaryCounter = 0;
      let februaryCounter = 0;
      let marchCounter = 0;
      let apilrCounter = 0;
      let mayCounter = 0;
      let juneCounter = 0;
      let julyCounter = 0;
      let augustCounter = 0;
      let septembeCounter = 0;
      let octCounter = 0;
      let novemberCounter = 0;
      let decemberCounter = 0;
      let endpoint = `${sessionStorage.getItem("BASE_URL")}/lab_orders_statistics`;
      axios
        .get(endpoint, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("Authorization")}`,
          },
        })
        .then((response) => {
          let lab_orders = response.data.lab_orders
          for (let lab_order of lab_orders) {
            let order_date = new Date(lab_order.created_at)
            switch (order_date.getMonth()) {
              case 0:
                januaryCounter++;
                break;
              case 1:
                februaryCounter++;
                break;
              case 2:
                marchCounter++;
                break;
              case 3:
                apilrCounter++;
                break;
              case 4:
                mayCounter++;
                break;
              case 5:
                juneCounter++;
                break;
              case 6:
                julyCounter++;
                break;
              case 7:
                augustCounter++;
                break;
              case 8:
                septembeCounter++;
                break;
              case 9:
                octCounter++;
                break;
              case 10:
                novemberCounter++;
                break;
              case 11:
                decemberCounter++;
                break;
            }
          }
          let newData = []
          newData.push(januaryCounter)
          newData.push(februaryCounter)
          newData.push(marchCounter)
          newData.push(apilrCounter)
          newData.push(mayCounter)
          newData.push(juneCounter)
          newData.push(julyCounter)
          newData.push(augustCounter)
          newData.push(septembeCounter)
          newData.push(octCounter)
          newData.push(novemberCounter)
          newData.push(decemberCounter)
          this.stati = [{
            data: newData
          }]
        })
        .catch((error) => {
          this.$swal("Error", error + ", Couldn't reach API", "error");
        });
    }
  },
  mounted() {
    this.statistics();
    this.labOrdersStati()
    let loggedUser = this.$store.state.user
    this.user_role = loggedUser.role
  }
}
</script>
