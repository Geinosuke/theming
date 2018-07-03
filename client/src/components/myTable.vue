<template>
  <table class="table table-hover">
    <th scope="col" v-for="item in header">
      {{item}}
    </th>
    <tr scope="row" v-for="(item, index) in values" @click="clicked(index)">
      <td>{{item.title}}</td>
    </tr>
  </table>
</template>

<script>
export default {
  name: 'my-table',
  props: {
    header: {
      type: Array,
      required: true
    },
    values: Array
  },
  methods: {
      clicked(i){
          this.$emit('clicked', this.values[i]);
      }
  }
}
</script>

<style scoped>
tr:hover {
    background-color: rgba(230, 225, 225, 0.596);
    cursor: pointer;
}
</style>
