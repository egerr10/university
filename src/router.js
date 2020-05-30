import Vue from 'vue';
import Router from 'vue-router';
import search from './components/search.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'search',
      component: search,
    },
  ],
});
