<template>
  <div class="dashboard-container">
    <!-- <div class="dashboard-text">name: {{ this.user.username }}</div> -->
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { getInfo } from '@/api/system/user'

export default {
  name: 'Dashboard',
  data() {
    return {
      user: {
        // username: "admin",
      }
    }
  },
  methods: {
  },
  created() {
    // this.getUserInfo();

  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
