<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"/>
    <sidebar class="sidebar-container"/>
    <div class="main-container">
      <navbar/>
      <app-main/>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import request from '@/utils/request'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  mounted() {
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('CloseSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
</style>

<style lang="scss">
  /*Chrome 下去除type ==  "number"  时 的右侧图标*/
  input[type="number"]::-webkit-outer-spin-button, input[type="number"]::-webkit-inner-spin-button{
    -webkit-appearance: none !important;
    margin: 0;
  } /*火狐 下去除type ==  "number"  时 的右侧图标*/
  input[type="number"]{-moz-appearance:textfield;}
  /*IE下去除 右边的×*/
  input::-ms-clear{display:none;}
  /*IE下去除 小眼睛*/
  input[type="number"]::-ms-reveal{display:none;}
  .messageBox{
    display: flex;
    .messageContent{
      flex: 1;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
    .messageLink{
      width: 60px;
    }
  }
</style>
