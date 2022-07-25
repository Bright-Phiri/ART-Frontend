<template>
  <div>
    <v-footer color="blue-grey lighten-5" fixed>
      <v-row justify="center">
        <v-col class="#F5F5F5 text-center grey--text p-5" cols="12">
          Copyright &copy; Alicodes {{ new Date().getFullYear() }}
        </v-col>
      </v-row>
    </v-footer>
  </div>
</template>

<script>
export default {
  name: "Footer"
};
</script>