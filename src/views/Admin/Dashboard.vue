<template>
  <div class="Dashboard">
    <v-row dense>
      <v-col cols="12">
        <v-card tile outlined>
          <v-card-text class>
            <v-container fluid>
              <v-row>
                <v-col v-if="user_role === 'Admin'" cols="12" lg="4" sm="6" md="4" class="py-0">
                  <v-alert border="left" colored-border color="#C0CA34" elevation="2">
                    <v-row>
                      <v-col>
                        <v-avatar tile size="50">
                          <v-img src="@/assets/user-group.png"></v-img>
                        </v-avatar>
                      </v-col>
                      <v-col>
                        <h6 class="text-center font-weight-light">Users</h6>
                        <h5 class="text-center text-white" id="patients">
                          <animated-number :value="users" :formatValue="formatValue" :duration="300" />
                        </h5>
                      </v-col>
                    </v-row>
                  </v-alert>
                </v-col>

                <v-col cols="12" lg="4" sm="6" md="4" class="py-0">
                  <v-alert border="left" colored-border color="#FDD830" elevation="2">
                    <v-row>
                      <v-col>
                        <v-avatar tile size="50">
                          <v-img src="@/assets/patients-icon.png"></v-img>
                        </v-avatar>
                      </v-col>
                      <v-col>
                        <h6 class="text-center font-weight-light">Patients</h6>
                        <h5 class="text-center text-white" id="patients">
                          <animated-number :value="patients" :formatValue="formatValue" :duration="1800" />
                        </h5>
                      </v-col>
                    </v-row>
                  </v-alert>
                </v-col>
                <v-col cols="12" lg="4" sm="6" md="4" class="py-0">
                  <v-alert border="left" colored-border color="#0197A8" elevation="2">
                    <v-row>
                      <v-col>
                        <v-avatar tile size="50">
                          <v-img src="@/assets/lab-test.png"></v-img>
                        </v-avatar>
                      </v-col>
                      <v-col>
                        <h6 class="text-center font-weight-light">Lab Orders</h6>
                        <h5 class="text-center text-white" id="patients">
                          <animated-number :value="lab_orders" :formatValue="formatValue" :duration="1000" />
                        </h5>
                      </v-col>
                    </v-row>
                  </v-alert>
                </v-col>

                <v-col v-if="user_role === 'HDA Personnel'" cols="12" lg="4" sm="6" md="4" class="py-0">
                  <v-alert border="left" colored-border color="#65B869" elevation="2">
                    <v-row>
                      <v-col>
                        <v-avatar tile size="50">
                          <v-img src="@/assets/results.jpg"></v-img>
                        </v-avatar>
                      </v-col>
                      <v-col>
                        <h6 class="text-center font-weight-light">Lab Order Results</h6>
                        <h5 class="text-center text-white" id="patients">
                          <animated-number :value="results" :formatValue="formatValue" :duration="500" />
                        </h5>
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
                        <h5 class="text-center text-white" id="patients">
                          <animated-number :value="results" :formatValue="formatValue" :duration="800" />
                        </h5>
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
        <v-card>
          <v-card-text>
            <div class="justify-center">
              <apexchart width="100%" height="226%" type="area" :options="statisticsOptions" :series="stati">
              </apexchart>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" lg="4">
        <v-card>
          <v-card-title class="d-flex justify-space-between font-weight-light">
            Statistics
            <v-btn icon>
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider class="mx-4"></v-divider>
          <v-card-text>
            <div class="d-flex justify-center">
              <apexchart v-if="series && series.length" width="380" type="donut" :options="options" :series="series">
              </apexchart>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import AnimatedNumber from "animated-number-vue";
export default {
  name: 'Dashboard',
  components: {
    AnimatedNumber
  },
  data() {
    return {
      patients: 0,
      users: 0,
      lab_orders: 0,
      results: 0,
      user_role: null,
      statisticsOptions: {
        xaxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        colors: ['#008F96'],
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
        colors: ['#008F96', '#FDD830', '#65B869'],
        labels: ["Users", "Patients", "Lab Order Results"]
      },
      series: [],
    }
  },
  channels: {
    DashboardChannel: {
      connected() { },
      rejected() { },
      received(data) {
        this.displayDashboardData(data);
      },
      disconnected() { },
    },
  },
  methods: {
    formatValue(value) {
      return `${value.toFixed(0)}`;
    },
    updateChart(array, index, data) {
      var arr = this.updateChartSeries(array, index, data);
      arr.push()
      this.series = arr
    },
    updateChartSeries(array, index, newValue) {
      array[index] = newValue;
      return array;
    },
    statistics(data) {
      this.patients = data.patients;
      this.lab_orders = data.lab_orders_count;
      this.users = data.users;
      this.results = data.results
      if (this.user_role === "Admin") {
        this.clearChart(this.series);
        this.series.push(data.users)
        this.series.push(data.patients)
        this.series.push(data.results)
      } else {
        this.options.labels.shift()
        this.options.labels.unshift("Lab orders");
        this.clearChart(this.series);
        this.series.push(data.lab_orders_count)
        this.series.push(data.patients)
        this.series.push(data.results)
      }
    },
    clearChart(series) {
      while (series.length) {
        series.pop();
      }
    },
    labOrdersStati(data) {
      let [januaryCounter, februaryCounter, marchCounter, apilrCounter, mayCounter, juneCounter, julyCounter, augustCounter, septembeCounter, octCounter, novemberCounter, decemberCounter] = Array(12).fill(0);
      let lab_orders = data.lab_orders
      for (let lab_order of lab_orders) {
        let lab_order_date = new Date(lab_order.created_at)
        switch (lab_order_date.getMonth()) {
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
      let labOrdersStatistics = []
      labOrdersStatistics.push(januaryCounter)
      labOrdersStatistics.push(februaryCounter)
      labOrdersStatistics.push(marchCounter)
      labOrdersStatistics.push(apilrCounter)
      labOrdersStatistics.push(mayCounter)
      labOrdersStatistics.push(juneCounter)
      labOrdersStatistics.push(julyCounter)
      labOrdersStatistics.push(augustCounter)
      labOrdersStatistics.push(septembeCounter)
      labOrdersStatistics.push(octCounter)
      labOrdersStatistics.push(novemberCounter)
      labOrdersStatistics.push(decemberCounter)
      this.stati = [{
        data: labOrdersStatistics
      }]
    },
    displayDashboardData(data) {
      switch (data.res) {
        case "all":
          this.statistics(data)
          this.labOrdersStati(data)
          break;
        case "patients":
          this.patients = data.patients
          this.updateChart(this.series, 1, this.patients);
          break;
        case "users":
          this.users = data.users
          this.updateChart(this.series, 0, this.users);
          break;
        case "lab_orders":
          this.labOrdersStati(data)
          break;
        case "lab_orders_count":
          this.lab_orders = data.lab_orders_count
          this.labOrdersStati(data)
          this.updateChart(this.series, 0, this.lab_orders);
          break;
        case "results":
          this.results = data.results
          this.updateChart(this.series, 2, this.results);
          break;
        default:
          this.statistics(data)
          this.labOrdersStati(data)
          break;
      }
    },
    setUser() {
      let loggedUser = this.$store.state.user
      this.user_role = loggedUser.role
    }
  },
  mounted() {
    this.$cable.subscribe({
      channel: "DashboardChannel",
    });
    this.setUser();
  }
}
</script>
