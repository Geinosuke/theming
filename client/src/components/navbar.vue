<template>
  <b-navbar toggleable="md" type="light">
    <b-navbar-brand href="#">Theming</b-navbar-brand>
    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
    <b-collapse is-nav id="nav_collapse">
      <b-navbar-nav>
        <b-nav-item><router-link class="nav-link" to="Home">Home</router-link></b-nav-item>
        <b-nav-item><router-link class="nav-link" to="Testing">Tester</router-link></b-nav-item>
        <b-nav-item><router-link class="nav-link" to="Train">Entrainement</router-link></b-nav-item>
        <b-nav-item><router-link class="nav-link" to="Docs">Documentations</router-link></b-nav-item>
        <b-nav-item><router-link class="nav-link" to="About">A propos</router-link></b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>
<script>
export default {
  name: 'Navbar',
  data () {
    return {
      msg: ''
    }
  }
}
</script>
<style scoped>
</style>