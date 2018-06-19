<template>
  <div class="row">
    <div class="col-md-12">
      <h1>Entrainement</h1>
      <div v-for="theme in themes">
      <p>
        <span><b>{{ theme.title }}</b></span>
      </p>
    </div>
    </div>
  </div>
</template>
<script>
import services from '../services/service'

export default {
  name: 'Train',
  data () {
    return {
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
<style scoped>

</style>
