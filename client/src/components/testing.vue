<template>
  <div class="row">
    <div class="col-md-12">
          <div class="row">
          <div class="col-md-12">
            <h1>Tester</h1>
          </div>
    </div>
    <div class="row">
      <div class="input-group col-md-8 offset-md-2">
        <textarea v-model="inputText" id="msg" name="msg" rows="5" maxlength="1000" class="form-control" placeholder="Entrez le texte ici" aria-label="texte" aria-describedby="basic-addon1">
        </textarea>
      </div>
    </div>
    <div class="row">
      <div class="col-md-3 offset-md-8">
        <b-button variant="success" @click="validate">Valider</b-button>
      </div>
    </div>
    <div class="row">
      <div class="input-group col-md-8 offset-md-2 themeArea">
        <table class="table table-hover">
          <th scope="col" v-for="item in header1">
            {{item}}
          </th>
          <tr scope="row" v-for="(item, index) in resThemes" @click="handleClick(item)">
            <td>{{item.theme}}</td>
            <td>{{item.gramm1}}</td>
            <td>{{item.gramm2}}</td>
            <td>{{item.gramm3}}</td>
          </tr>
        </table>
      </div>
    </div>
    </div>
  </div>
</template>
<script>
import services from '../services/service'

export default {
  name: 'Testing',
  data () {
    return {
      msg: '',
      inputText: '',
      header1: [
        "Themes",
        "Jaccard 1-gramm",
        "Jaccard 2-gramm",
        "Jaccard 3-gramm"
      ],
      resThemes: []
    }
  },
  methods: {
    handleClick(value){
      console.log(value);
    },
    async validate() {
      let response = await services.whichTheme({
        text: this.inputText
      })
      this.resThemes = response.data;
      console.log(this.resThemes)
    }
  }
}
</script>
<style scoped>

textarea {
    resize: none;
    width: 100%;
}
button {
  margin: 10px;
}

.themeArea {
    overflow: scroll;
    height: 250px;
}

tr:hover {
    background-color: rgba(230, 225, 225, 0.596);
    cursor: pointer;
}

</style>
