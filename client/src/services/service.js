import Api from './Api'

export default {
  fetchPosts () {
    return Api().get('posts');
  },
  getTests (){
      return Api().get('tests');
  },
  getTheme () {
    return Api().get('themes');
  }
}
