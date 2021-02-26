<template>
  <div class="dashboard-container">
    <!-- <div class="dashboard-text">name: {{ this.user.username }}</div> -->
    <el-button @click="getUserInfo">test</el-button>
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
    /**
     * 从session中获取用户信息
     */
    getUserInfo() {
      // let user = this.$store.user.getInfo();
      // console.log(user);
      // this.user = JSON.parse(window.sessionStorage.getItem('user'));
    }
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
