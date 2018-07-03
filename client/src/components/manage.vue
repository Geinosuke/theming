<template>
  <div class="row">
    <div class="col-md-12">
      <div class="row">
      <div class="col-md-12">
        <h1>Gerer</h1>
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
        <table class="table table-hover">
          <th scope="col" v-for="item in header1">
            {{item}}
          </th>
          <tr scope="row" v-for="(item, index) in filteredthemes" @click="handleClickTheme(item)">
            <td>{{item.title}}</td>
          </tr>
        </table>
      </div>
    </div>
    <br>
    <br>
    <div class="col-md-3 offset-md-8">
        <b-button variant="info"  @click="getGramm">Mettre à jour les n-grammes</b-button>
      </div>
    <br>
    <br>
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <div class="myInline">
          <h4><b-badge class="themeBadge" variant="info" @click="unselect()">{{themeSelected.title}}</b-badge></h4>
          <span class="tooltiptext">Click pour supprimer</span>
        </div>
      </div>
    </div>
    <br>
    <br>
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <b-card no-body v-if="isThemeSelected">
          <b-tabs card>
            <b-tab v-bind:title="cardTitle[index]" v-for="(item, index) in [filteredtexts,...Object.entries(themeSelected.data)]">
              <table class="table table-hover" v-if="isThemeSelected">
                <div v-if="index !== 0">
                  <th scope="col">{{index}}-Gramms</th>
                  <th scope="col">Moyenne TF-IDF</th>
                </div>
                <div v-if="index === 0">
                  <tr scope="row" v-for="(element, i) in filteredtexts" @click="navigateText(i)">
                    <td>{{element.content.substring(0, 200)}}...</td>
                  </tr>
                </div>
                <div v-if="index !== 0">
                  <tr scope="row" v-for="(element, i) in Object.entries(themeSelected.data[index - 1].corpus)" @click="saveGramm(element)" v-b-modal.modal1>
                    <td>{{element[0]}}</td>
                    <td>{{element[1]}}</td>
                  </tr>
                </div>
              </table>
                <b-modal id="modal1" title="Theming" @ok="handleClickGramms()">
                  <p class="my-4">Voulez-vous supprimer ce gramme?</p>
                </b-modal>
            </b-tab>
          </b-tabs>
        </b-card>
      </div>
    </div>
    </div>
  </div>
</template>
<script>
import services from '../services/service'

export default {
  name: 'Manage',
  data () {
    return {
      msg: '',
      inputTheme: '',
      themeSelected : {},
      tmpGramm: [],
      isThemeSelected: false,
      themes: [],
      filteredthemes: [],
      texts: [],
      filteredtexts: [],
      cardTitle: [
        'Textes',
        '1-Grammes',
        '2-Grammes',
        '3-Grammes'
      ],
      header1: [
        'themes'
      ],
      header2: [
        'N-gramms',
        'Indice'
      ],
      ngramms: []
    }
  },
  mounted () {
    this.getTheme();
    this.getTexts();
  },
  methods: {
    async getTexts () {
      const response =  await services.getTextWithTheme();
      this.texts = response.data;
      this.filteredtexts = this.texts;
    },
    async getTheme () {
      const response = await services.getTheme();
      this.themes = response.data.sort((a, b) => {
        return (a.title < b.title) ? -1 : 1;
      })
      this.filteredthemes = this.themes;
    },
    navigateText (index) {
    },
    handleClickTheme (item){
      this.themeSelected = item;
      this.isThemeSelected = true;
    },
    handleClickGramms (){
      console.log(this.themeSelected);
    },
    unselect (){
      this.isThemeSelected = false;
      this.themeSelected = {};
    },
    async getGramm () {
      await services.generateTFIDF();
      this.$toaster.success("N-Grammes et TF-IDF générés avec succès");
    },
    saveGramm(element){
      this.tmpGramm = element;
    }
  },
  watch: {
      inputTheme: function (val){
        if (val.length > 0){
          this.filteredthemes = this.themes.filter(theme => theme.title.toLowerCase().includes(val.toLowerCase()));
        } else {
          this.filteredthemes = this.themes;
        }
      },
      themeSelected: function (val){
        if (val === {} || val === undefined){
          this.filteredtexts = this.texts;
        }else {
          this.filteredtexts = this.texts.filter(el => el.themeId === val.id);
        }
      }
  }
}
</script>
<style scoped>
.themeArea {
    overflow: scroll;
    height: 150px;
}
.grammArea {
    overflow: scroll;
    height: 1000px;
}
th {
  background-color: rgba(66, 185, 131, 0.5)
}
.myInline {
  display: inline-block;
}

.themeBadge{
  margin: 5px;
}

.themeBadge:hover, tr:hover {
  cursor: pointer;
  background-color: rgba(230, 225, 225, 0.596);
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
.myInline:hover .tooltiptext {
    visibility: visible;
    opacity: 1;
}
</style>
