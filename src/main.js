import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import router from './router';
import Loading from './components/Loading.vue';
import './assets/main.css';

Vue.use(ElementUI);
Vue.component('Loading', Loading);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
