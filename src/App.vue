<template>
  <div class="app grid-container" id="app">
    <div class="lang-button">
      <img @click="changeLang" :src="langIcon" height="32" width="32"  alt=""/>
    </div>

    <!--вместо стандартного роутинга используется динамическое переключение компонентов-->
    <component v-if="selectedLanguage" v-bind:layout.sync="layout" v-bind:is="layout" :selectedLanguage="selectedLanguage"></component>
  </div>
</template>

<script>
/* eslint-disable no-console,prefer-destructuring */
/* eslint max-len: ["error", { "code": 200 }] */
import search from './components/Search.vue';
import history from './components/History.vue';

export default {
  name: 'App',
  components: {
    search, history,
  },
  data() {
    return {
      selectedLanguage: null,
      layout: 'search',
    };
  },
  mounted() { /* проверяем LS на наличие поля с локализацией, если нет - записываем в LS */
    if (!localStorage.getItem('language')) {
      this.selectedLanguage = (window.navigator.language === 'ru') ? 'ru' : 'en';
      localStorage.setItem('language', this.selectedLanguage);
    } else {
      this.selectedLanguage = localStorage.getItem('language');
    }
  },
  computed: {
    langIcon() {
      // eslint-disable-next-line global-require
      return (this.selectedLanguage === 'ru') ? require('./assets/img/uk.png') : require('./assets/img/rus.png');
    },
  },
  methods: {
    changeLang() {
      this.selectedLanguage = (this.selectedLanguage === 'ru') ? 'en' : 'ru';
      localStorage.setItem('language', this.selectedLanguage);
    },
  },
};
</script>

<style scoped>
   .app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    padding-bottom: 30px;
    min-height: 100vh;
  }

  .lang-button {
    cursor: pointer;
    position: absolute;
    right: 30px;
    top: 30px;
  }
</style>
