<template>
  <div class="row">
    <div class="col-md-12 container">
      <div class="floatingDiv">
        <h1>{{ msg }}</h1>
        <h2>Liens essentiels</h2>
        <ul>
          <li><a href="https://github.com/Geinosuke/theming" target="_blank">Github</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Home',
  data () {
    return {
      msg: 'Bienvenue sur Theming'
    }
  },
  methods: {
  }
}
</script>
<style scoped>
.container {
  background-image: url('../assets/wp1.jpg');
  background-size: contain;
  background-repeat: no-repeat;
  width: 100%;
  height: 0;
  padding-top: 50%;
}

.floatingDiv {
  position: absolute;
  top: 10%;
  left: 10%;
  color: white;
}

</style>
