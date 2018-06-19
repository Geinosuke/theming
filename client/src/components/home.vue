<template>
  <div class="row">
    <div class="col-md-12">
    <img src="../assets/logo.png">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    <ul>
      <li><a href="https://github.com/Geinosuke/theming" target="_blank">Github</a></li>
    </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Home',
  data () {
    return {
      msg: 'Welcome in ThemingJS'
    }
  },
  methods: {
  }
}
</script>
<style scoped>

</style>
