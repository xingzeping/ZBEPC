<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <!-- or name="fade" -->
      <!-- <router-view :key="key"></router-view> -->
      <router-view/>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    // key() {
    //   return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    // }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  position: relative;
  overflow: hidden;
  background-color: #F0F2F5;
}
</style>

<style lang="scss">
  .container{
    background-color: #fff;
    padding: 25px 0;
    box-shadow: 0 1px 1px #999;
    position: relative;
  &.container:nth-child(n+2){
     margin-top: 20px;
   }
  }
  .step-container{
    max-width: 1170px;
    margin: 0 auto;
  }
</style>

<style lang="scss">
  @import '../../../styles/animate.css';
  .datagrid{
    margin: 25px auto;
  .datagrid-head{
    background-color: #D6ECF8;
    height: 36px;
    line-height: 36px;
    color:#fff;
  .datagrid-title{
    background-color: #1B81D0;
    display: block;
    width: 163px;
    text-align: center;
  }
  }
  .datagrid-row{
    height: 42px;
    line-height: 42px;
    display: flex;
    flex-direction: row;
    border-bottom: 1px solid #C7C7C7;
  .datagrid-column{
    width: 163px;
    font-size: 14px;
    background-color: #EBEBEB;
  }
  .datagrid-content{
    flex: 1;
  }
  }
  .datagrid-table{
    width:100%;
    font-size: 14px;
    border-collapse:collapse;
  thead{
    height: 42px;
    line-height: 42px;
    background-color: #EBEBEB;
    box-sizing: border-box;
    border-bottom:1px solid #C7C7C7;
  th:first-child{
    width: 163px;
  }
  }
  tbody{
  tr{
    border-bottom: 1px solid #C7C7C7;
  }
  tr:last-child{
    border-bottom: none;
  }
  }
  tr{
    height: 42px;
    line-height: 42px;
  }
  }
  }
  .fileDownload{
    color:#2A58DB;
    transition: all .3s;
  &:active{
     color:#f00;
   }
  }
</style>
