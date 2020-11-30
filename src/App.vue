<template>
  <div id="app">
    <keep-alive :include="routerList">
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      routerList: []
    }
  },
  mounted() {
    this.routerList = JSON.parse(localStorage.getItem('routerList'))
  }
}
</script>
<style >
.el-dialog__body {
  padding-top: 5px;
}
</style>
