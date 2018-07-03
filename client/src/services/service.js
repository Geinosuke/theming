import Api from './Api'

export default {
  getTheme () {
    return Api().get('themes');
  },
  // Entrainer
  postTheme (themes) {
    return Api().post('themes', themes);
  },
  postNewTheme (themesName) {
    return Api().post('themes', {
      title: themesName,
      data: []
    });
  },
  deleteTheme (idThemes) {
    return Api().delete(`themes/${idThemes}`);
  },
  patchTheme (idThemes, data) {
    return Api().patch(`themes/${idThemes}`, data);
  },
  postText (text, idThemes) {
    return Api().post(`themes/${idThemes}/texts`, {content: text});
  },
  deleteTextByTheme (idThemes, idText) {
    return Api().delete(`themes/${idThemes}/texts/${idText}`);
  },
  // Gerer
  generateTFIDF () {
    return Api().post('themes/generateTFIDF');
  },
  generateTFIDFbyTheme (idThemes) {
    return Api().post(`themes/${idThemes}/generateTFIDF`);
  },
  patchTheme (data, idThemes) {
    return Api().patch(`themes/${idThemes}`, data);
  },
  resetTheme (idThemes) {
    return Api().post(`themes/${idThemes}/reset`);
  },
  getTextWithTheme () {
    return Api().get('/texts');
  },
  // Tester
  whichTheme (inputText) {
    return Api().post('themes/whichTheme', inputText);
  }
}
