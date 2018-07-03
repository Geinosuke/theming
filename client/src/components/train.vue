<template>
  <div class="row">
    <div class="col-md-12">
      <div class="row"><div class="col-md-12"><h1>Entrainer</h1></div></div>
    <div class="row">
      <div class="input-group col-md-8 offset-md-2">
        <textarea v-model="inputText" id="msg" name="msg" rows="5" maxlength="1000" class="form-control" placeholder="Entrez le texte ici" aria-label="texte" aria-describedby="basic-addon1">
        </textarea>
      </div>
    </div>
    <br>
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <div class="myInline"v-for="item in chosenThemeArray">
          <h4><b-badge class="themeBadge" variant="info" @click="handleClick(item)">{{item.title}}</b-badge></h4>
          <span class="tooltiptext">Click pour supprimer</span>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="input-group col-md-8 offset-md-2">
        <div class="input-group-prepend">
          <span class="input-group-text" id="basic-addon1">Rechercher</span>
        </div>
        <input type="text" v-model="inputTheme" class="form-control" placeholder="des themes" aria-label="Username" aria-describedby="basic-addon1">
      </div>
    </div>
    <div class="row">
      <div class="input-group col-md-8 offset-md-2 themeArea">
        <my-table v-bind:header="header1" v-bind:values="filteredthemes" @clicked="handleClick"></my-table>
      </div>
    </div>
    <br>
    <div class="row">
      <div class="col-md-3 offset-md-1">
        <b-btn variant="info" v-b-modal.modalPrevent>Nouveau thème</b-btn>
    <!-- Modal Component -->
        <b-modal id="modalPrevent"
             ref="modal"
             title="Ajouter un nouveau thème"
             @ok="handleOk"
             @shown="clearNewThemeName">
          <form @submit.stop.prevent="handleSubmit">
          <b-form-input type="text"
                      placeholder="Vueillez entrer le nom d'un thème"
                      v-model="newTheme"></b-form-input>
          </form>
        </b-modal>
      </div>
      <div class="col-md-3 offset-md-8">
        <b-button variant="success"  @click="validate">Valider</b-button>
      </div>
    </div>
    </div>
  </div>
</template>
<script>
import services from '../services/service'
import MyTable from './myTable.vue'
import RingLoader from 'vue-spinner/src/RingLoader.vue'

export default {
  name: 'Train',
  components: { MyTable, RingLoader },
  data () {
    return {
      header1: [
        'Theme'
      ],
      newTheme: '',
      themes: [],
      filteredthemes: [],
      chosenThemeArray: [],
      chosenTheme: new Set(),
      inputTheme: "",
      inputText: "",
      isLoading: false,
      colors: "info",
      colors: [
        "success",
        "danger",
        "secondary",
        "info"
      ]
    }
  },
  mounted () {
    this.getTheme();
  },
  methods: {
    async getTestsfromApi () {
      const response = await services.getTests();
      this.tests = response.data
    },
    async getTheme () {
      const response = await services.getTheme();
      this.themes = response.data.sort((a, b) => {
        return (a.title < b.title) ? -1 : 1;
      })
      this.filteredthemes = this.themes;
    },
    async validate(){
      if (this.inputText === "" || this.chosenTheme.length === 0)
        return this.$toaster.error("Ecrivez du texte!!");
      // this.isLoading = true;
      let promise = [];
      this.chosenThemeArray.forEach(element => {
        promise.push(services.postText(this.inputText, element.id));
      });
      await Promise.all(promise);
      this.inputText = "";
      return this.$toaster.success("Nouvelles données envoyées avec succès!");
    },
    handleClick(value){
      if (this.themes.includes(value)){
        if (this.chosenTheme.has(value)){
          this.chosenTheme.delete(value);
        }else{
          this.chosenTheme.add(value);
        }
        this.chosenThemeArray = [...this.chosenTheme.values()]
      }
    },
    getColor () {
      const res = this.colors[Math.floor(Math.random() + this.colors.length)];
      console.log(res);
      return res;
    },
    clearNewThemeName () {
      this.newTheme = ''
    },
    handleOk (evt) {
      // Prevent modal from closing
      evt.preventDefault()
      if (!this.newTheme) {
        alert('Vueillez entrer un nom de thème')
      } else {
        this.handleSubmit()
      }
    },
    async handleSubmit () {
      const name = this.newTheme;
      await services.postNewTheme(this.newTheme);
      this.clearNewThemeName();
      this.$refs.modal.hide();
      this.$toaster.success(`Le thème \"${name}\" à corretement été crée!`);
    }
  },
  watch: {
      inputTheme: function (val){
        if (val.length > 0){
          this.filteredthemes = this.themes.filter(theme => theme.title.toLowerCase().includes(val.toLowerCase()));
        } else {
          this.filteredthemes = this.themes;
        }
      }
  }
}
</script>
<style scoped>
textarea {
    resize: none;
    width: 100%;
}

.themeArea {
    overflow: scroll;
    height: 250px;
}
.myInline {
  display: inline-block;
}

.themeBadge{
  margin: 5px;
}

.themeBadge:hover {
  cursor: pointer;
}
.myInline .tooltiptext{
    visibility: hidden;
    width: 120px;
    background-color: black;
    color: #fff;
    text-align: center;
    padding: 5px 0;
    border-radius: 6px;
    top: 100%;
    left: 50%; 
    margin-left: -60px;
 
    /* Position the tooltip text - see examples below! */
    position: absolute;
    z-index: 1;
    opacity: 0;
    transition: opacity 1s;
}

/* Show the tooltip text when you mouse over the tooltip container */
.myInline:hover .tooltiptext {
    visibility: visible;
    opacity: 1;
}
</style>
