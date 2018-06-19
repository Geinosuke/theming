import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/home.vue'
import Testing from '../components/testing.vue'
import Docs from '../components/docs.vue'
import Train from '../components/train.vue'
import About from '../components/about.vue'

Vue.use(Router)

export default new Router({
    routes: [
    {
        path: '/',
        redirect: '/home'
      },
      {
        path: '/home',
        name: 'Home',
        component: Home
      },
      {
        path: '/testing',
        name: 'Testing',
        component: Testing
      }
      ,
      {
        path: '/train',
        name: 'Train',
        component: Train
      }
      ,
      {
        path: '/docs',
        name: 'Docs',
        component: Docs
      },
      {
        path: '/about',
        name: 'About',
      }
    ]
})