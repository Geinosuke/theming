import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/home.vue'
import Testing from '../components/testing.vue'
import Manage from '../components/manage.vue'
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
      },
      {
        path: '/train',
        name: 'Train',
        component: Train
      },
      {
        path: '/manage',
        name: 'Manage',
        component: Manage
      },
      {
        path: '/about',
        name: 'About',
        component: About
      }
    ]
})