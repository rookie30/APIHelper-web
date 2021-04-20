<template>
  <div class="dashboard-container">
    <div class="content">
      欢迎使用APIHelper
    </div>
  </div>
</template>

<script>

export default {
  name: 'Dashboard',
  data() {
    return {
      user: {
      }
    }
  },
  methods: {
  },
  created() {

  }
}
</script>

<style scoped>
.dashboard-container {
  margin: 0 auto;
  padding: 0;
}
.content {
  position: absolute;
  top: 45%;
  left: 45%;
  color: lightgray;

}
</style>
