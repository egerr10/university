import Vue from 'vue';
import ElementUI from 'element-ui';
import moment from 'moment';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import router from './router';
import Loading from './components/Loading.vue';
import './assets/main.css';

Vue.use(ElementUI);
Vue.component('Loading', Loading);

moment.locale('ru');

Vue.filter('date', (value) => {
  if (!value) return value;
  return moment.unix(value).format('L');
});

Vue.filter('date2', (value) => {
  if (!value) return value;
  return moment.unix(value).format('LL');
});

Vue.filter('dateTime', (value) => {
  if (!value) return value;
  return moment.unix(value).format('LLL');
});

Vue.filter('time', (value) => {
  if (!value) return value;
  return moment.unix(value).format('LT');
});

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
