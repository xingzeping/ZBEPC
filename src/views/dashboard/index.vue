<template>
  <div class="dashboard-container">
    <h1 class="dashboard-text">欢迎<span class="blue">{{ name }}</span>来到,正邦环保管理系统</h1>
    <div class="description">把小公司做成大公司,把大公司做成大家的公司</div>
    <img src="../../assets/dashboard_bg.png" alt="">
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
  .dashboard-container{
    text-align: center;
    font-family: Avenir,Helvetica,Arial,sans-serif;
    h1{
      font-size: 30px;
      font-weight: 400;
    }
    .description{
      font-size: 18px;
      color:#909399
    }
    span.blue{
      color:#539FFF
    }
  }
</style>
