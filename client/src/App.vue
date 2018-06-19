<template>
  <div id="app">
    <img src="./assets/logo.png">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    <ul>
      <li><a href="https://github.com/Geinosuke/theming" target="_blank">Github</a></li>
    </ul>

    <div v-for="theme in themes">
      <p>
        <span><b>{{ theme.title }}</b></span>
      </p>
    </div>
  </div>
</template>

<script>
import services from './services/service'

export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome in ThemingJS',
      themes: []
    }
  },
  mounted () {
    this.getTheme()
  },
  methods: {
    async getTestsfromApi () {
      const response = await services.getTests();
      this.tests = response.data
    },
    async getTheme () {
      const response = await services.getTheme();
      this.themes = response.data
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
