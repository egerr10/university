<template>
  <div class="body">

    <el-row :gutter="10">
      <el-col :span="18">
        <div class="logo-block">
          <a title="https://www.naumen.ru" href="https://www.naumen.ru" target="_blank">
            <div class="n-logo"></div>
          </a>
          <a title="https://ru.wikipedia.org/wiki/Naumen"
             href="https://ru.wikipedia.org/wiki/Naumen" target="_blank">
            <div class="w-logo"><img src="../assets/wikilogo.png" alt=""></div>
          </a>
        </div>
      </el-col>
      <el-col :span="18">
        <el-form :inline="true" @submit.native.prevent="getWeather" class="form-inline" status-icon>
          <el-autocomplete id="input"
                           popper-class="my-autocomplete"
                           :trigger-on-focus="false"
                           :select-when-unmatched="true"
                           :clearable="true"
                           v-model="query"
                           :fetch-suggestions="querySearch"
                           @focus="historyShow"
                           placeholder="Выберите город"
                           @select="handleSelect"
          >
            <template slot-scope="{ item }">
              <div class="value">{{ item.city }}</div>
            </template>
          </el-autocomplete>
        </el-form>

        <div id="history" v-if="historyView" class="history-body">
          <div class="history-container">
            <div class="history-body-item" v-for="(item, index) in history" v-bind:key="item">
              <div class="history-item" v-on:click="getFromHistoryQuery(item)">{{item}}</div>
              <div class="history-item-delete" v-on:click="deleteHistoryQuery(index)">удалить</div>
            </div>
            <div v-on:click="deleteHistoryAll" class="history-title">
              Очистить историю поиска
            </div>
          </div>
        </div>
        <div class="fail" v-if="queryError">
          Поздравляем! Вы нашли город про который не знает никто!
        </div>
      </el-col>
      <el-col :span="2">
        <el-button v-on:click="getWeather" size="medium" type="primary">Найти</el-button>
      </el-col>
    </el-row>

    <div class="search-body">
      <loading v-if="loading"></loading>
      <div v-if="currentReceived" class="result-container">
        <el-row>
          <el-col :span="6">
            <div class="current-title">
              {{phrases.title}}<br>
              {{currentWeather.name}}
            </div>
            <div class="current-data">
              <img :src="weatherImg(currentWeather.weather[0].icon)" alt="">
              <div class="current-data-t">
                {{currentWeather.main.temp}} °C
                ({{phrases.feels_like}} {{currentWeather.main.feels_like}})
              </div>
            </div>

            <div class="weather-widget">
            <table class="weather-widget__items table table-striped table-bordered table-condensed">
              <tbody>
              <tr>
                <td>{{phrases.wind}}</td>
                <td>{{currentWeather.wind.speed}} {{phrases.windSpeed}}</td>
              </tr>
              <tr>
                <td>{{phrases.cloudiness}}</td>
                <td>{{currentWeather.weather[0].description}}</td>
              </tr>
              <tr>
                <td>{{phrases.pressure}}</td>
                <td>{{Math.floor(currentWeather.main.pressure / 1.333)}} мм рт. ст.</td>
              </tr>
              <tr>
                <td>{{phrases.humidity}}</td>
                <td>{{currentWeather.main.humidity}} %</td>
              </tr>

              <tr>
                <td>{{phrases.sunrise}}</td>
                <td>05:56</td>
              </tr>
              <tr>
                <td>{{phrases.sunset}}</td>
                <td>23:55</td>
              </tr>
              </tbody>
            </table>
            </div>
          </el-col>
          <el-col :span="18">
            <div class="grid-content bg-purple-light">иииии</div>
          </el-col>
        </el-row>
      </div>

    </div>
  </div>
</template>

<script>
/* eslint-disable no-console,prefer-destructuring */
import axios from 'axios';
import JQuery from 'jquery';
import citiesBase from '../../DataBase/cities';
import language from '../../DataBase/language';

const $ = JQuery;

export default {
  name: 'MyWeather',
  data() {
    const query = '';
    const result = {};
    const history = [];
    const exampleResult = [];
    const historyView = false;
    const loading = false;
    const queryError = false;
    return {
      query,
      result,
      historyView,
      exampleResult,
      history,
      loading,
      queryError,
      cities: [],
      timeout: null,
      currentWeather: null,
      phrases: null,
      selectedLanguage: null,
      currentReceived: false,
      forecastReceived: false,
    };
  },
  mounted() {
    this.cities = citiesBase;
    if (!localStorage.getItem('language')) {
      this.selectedLanguage = window.navigator.language;
      localStorage.setItem('language', this.selectedLanguage);
    } else {
      this.selectedLanguage = localStorage.getItem('language');
    }
    this.phrases = (this.selectedLanguage === 'ru') ? language.ru : language.en;

    if (!JSON.parse(localStorage.getItem('history'))) {
      localStorage.setItem('history', JSON.stringify(this.history));
    } else {
      this.history = JSON.parse(localStorage.getItem('history'));
    }

    $(document).mouseup((e) => {
      const div = $('#input');
      const div2 = $('#history');
      if (!div.is(e.target) && div.has(e.target).length === 0
          && !div2.is(e.target) && div2.has(e.target).length === 0) {
        this.historyView = false;
      }
    });
  },
  computed: {
  },
  methods: {
    weatherImg(code) {
      return `http://openweathermap.org/img/wn/${code}.png`;
    },
    querySearch(queryString, cb) {
      this.historyView = false;
      const results = this.cities.filter(this.createFilter(queryString));
      cb(results);
    },
    createFilter(queryString) {
      return item => (item.city.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
    },

    historyShow() { // отображаем историю запросов
      if (!this.query && this.history.length > 0) {
        this.historyView = true;
      }
    },
    handleSelect(item) { // запускаем функцию поиска по википедии
      if (item.city || item.city === '') {
        this.query = item.city;
        this.getWeather();
      } else {
        this.query = item.value;
      }
    },
    checkHistory() { // проверяем есть ли такой запрос в истории, если есть не добавляем
      const word = this.query;
      const checkHistory = this.history.slice();
      for (let i = 0; i < checkHistory.length; i += 1) {
        checkHistory[i] = checkHistory[i].toLowerCase();
      }
      return checkHistory.indexOf(word.toLowerCase()) !== -1;
    },
    pushHistory() { // добавляем запрос в историю
      this.query = this.query.trim();
      if (this.history.length < 15 && !this.checkHistory() && this.query.length > 0) {
        this.history.unshift(this.query);
        this.saveHistory();
      } else if (this.history.length >= 15 && !this.checkHistory() && this.query.length > 0) {
        this.history.unshift(this.query);
        this.history.pop();
        this.saveHistory();
      }
    },
    saveHistory() { // сохраняем в localStorage
      localStorage.setItem('history', JSON.stringify(this.history));
    },
    deleteHistoryAll() { // очищаем историю
      this.historyView = false;
      this.history = [];
      this.saveHistory();
    },
    deleteHistoryQuery(index) { // очищаем запрос из истории
      this.history.splice(index, 1);
      this.saveHistory();
    },
    getFromHistoryQuery(query) { // поиск по запросу из истории
      this.query = query;
      this.historyView = false;
      this.getWeather();
    },
    group(array) {
      return array.reduce((acc, obj) => {
        acc[obj.day] = acc[obj.day] || [];
        acc[obj.day].push(obj);
        return acc;
      }, {});
    },
    getCurrentWeather() {
      this.currentWeather = [];
      this.currentReceived = false;
      axios({
        url: `http://api.openweathermap.org/data/2.5/weather?q=${this.query},ru&lang=ru&units=metric&appid=f05a9d4f7cb1c74744d098bfaefdd35e`,
        method: 'GET',
      })
        .then((response) => {
          this.loading = false;
          this.currentWeather = response.data;
          this.pushHistory();
          this.currentReceived = true;
          console.log('current', this.currentWeather);
        })
        .catch((error) => {
          this.loading = false;
          this.queryError = true;
          console.log(error);
        });
    },
    getWeather() {
      this.query = this.query.trim();
      if (this.query.length > 1) {
        this.forecastReceived = false;
        this.queryError = false;
        this.loading = true;
        this.result = [];
        this.getCurrentWeather();
        axios({
          url: `http://api.openweathermap.org/data/2.5/forecast?q=${this.query},ru&lang=ru&units=metric&appid=f05a9d4f7cb1c74744d098bfaefdd35e`,
          method: 'GET',
        })
          .then((response) => {
            this.loading = false;
            this.result = response.data;

            this.result.list.forEach((item, i) => {
              [this.result.list[i].day] = item.dt_txt.split(' ');
            });

            this.result.list = this.group(this.result.list);
            console.log('111', this.result);
            this.forecastReceived = true;
          })
          .catch((error) => {
            this.loading = false;
            this.queryError = true;
            console.log(error);
          });
      }
    },
  },
};
</script>


<style>
  .body {
    margin: 0 auto;
    max-width: 1000px;
    padding-top: 50px;
  }
  .logo-block {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    margin: 15px auto;
    width: 220px;
  }
  .n-logo {
    background-image: url(https://www.naumen.ru/local/templates/naumen/images/svg/build/sprite.svg);
    display: block;
    background-color: transparent;
    background-size: 4865px 3930px;
    width: 179px;
    height: 20px;
    background-position: -2988px -2708px;
  }
  .w-logo {
    position: relative;
    bottom: 20px;
  }

  .history-body {
    padding: 10px;
    border: 1px solid #dcdfe6;
    position: relative;
    z-index: 10;
    background-color: white;
  }

  .history-container {
    width: 100%;
    border-top: none;
  }

  .history-body-item {
    margin-bottom: 10px;
    display: -webkit-box;
    display: flex;
  }
  .history-item, .history-item-delete, .history-title {
    cursor: pointer;
    color: #237ace;
    text-decoration: none;
    font-size: 14px;
  }

  .history-title {
    font-weight: 600;
    font-size: 12px;
    cursor: pointer;
  }

  .history-item {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .history-item-delete {
    margin-left: auto;
  }
  .history-item:hover,
  .history-item-delete:hover,
  .history-title:hover {
    color: red;
  }
  .search-body {
    margin: 0 auto;
  }
  .form-inline {
    width: auto;
    text-align: left;
    display: -webkit-flex;
    display: flex;

  }
  .el-form-item {
    display: inline-block;
    margin-left: 20px;
  }
  .result-container {
    text-align: left;
    width: 100%;
    margin-top: 50px;
  }
  .el-form-item {
    margin-bottom: 0;
  }
  .item-container {
    margin-bottom: 30px;
  }
  .item-link {
  }
  .item-link a {
    font-size: 18px;
    color: #237ace;
    text-decoration: none;
  }
  .item-link a:hover {
    color: red;
  }
  .item-ext {
    display: -webkit-flex;
    display: flex;
    padding-top: 10px;
    -ms-flex-align: center!important;
    align-items: center!important;
  }
  .item-ext img {
    margin-right: 15px;
    background-color: white;
  }
  .item-ext-text p {
    margin: 0!important;
  }

  .el-autocomplete-suggestion li.highlighted, .el-autocomplete-suggestion li:hover {
    background-color: #cde5ff;
  }

  .el-popper .popper__arrow, .el-popper .popper__arrow::after {
    border-style: hidden;
  }
  .el-autocomplete-suggestion__wrap {
    max-height: 400px;
  }

  .el-autocomplete {
    width: 100%;
  }

  .result-info {
    text-align: left;
    padding: 10px;
    position: absolute;
    z-index: 5;
    font-size: 14px;
  }
  .fail {
    margin-top: 22px;
    font-size: 18px;
    color: #6d6d6d;
  }

  @media screen and (max-width: 500px) {
    .body {
      padding-top: 0;
    }
    .history-item, .history-item-delete, .history-title {
      font-size: 12px;
    }
  }
</style>
