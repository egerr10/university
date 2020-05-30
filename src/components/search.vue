<template>
  <div class="body">

    <el-row :gutter="10">
      <el-col style="display: none" :span="18">
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
      <el-col :span="10">
        <el-form :inline="true" @submit.native.prevent="getCurrentWeather" class="form-inline" status-icon>
          <el-autocomplete id="input"
                           popper-class="my-autocomplete"
                           :trigger-on-focus="false"
                           :select-when-unmatched="true"
                           :clearable="true"
                           v-model="query"
                           :fetch-suggestions="querySearch"
                           @focus="showQueryHistory"
                           placeholder="Выберите город"
                           @select="handleSelect"
          >
            <template slot-scope="{ item }">
              <div class="value">{{ item.city }}</div>
            </template>
          </el-autocomplete>
          <i v-on:click="getCurrentWeather" class="el-icon-search button-search" />
        </el-form>

        <div id="queryHistory" v-if="historyView" class="queryHistory-body">
          <div class="queryHistory-container">
            <div class="queryHistory-body-item" v-for="(item, index) in queryHistory" v-bind:key="item">
              <div class="queryHistory-item" v-on:click="getFromHistoryQuery(item)">{{item}}</div>
              <div class="queryHistory-item-delete" v-on:click="deleteHistoryQuery(index)">удалить</div>
            </div>
            <div v-on:click="deleteQueryHistoryAll" class="queryHistory-title">
              Очистить историю поиска
            </div>
          </div>
        </div>

        <div class="fail" v-if="queryError">
          Поздравляем! Вы нашли город про который не знает никто!
        </div>
      </el-col>
      <el-col :span="10">
        <el-button v-on:click="getCurrentLocation" icon="el-icon-position">
          {{phrases.location}}
        </el-button>
      </el-col>
    </el-row>

    <div class="search-body">

      <loading v-if="loading" />

      <div v-if="currentReceived" class="result-container">
<<<<<<< HEAD
        <el-row>
          <el-col :span="7">
=======
        <el-row :gutter="30">
          <el-col :span="8">
>>>>>>> fb6c05384a8aa525accdf0acf0bb7392b1717979
            <div class="current-title">
              {{phrases.title}}<br>
              {{weather.name}}
            </div>
            <div class="current-data">
<<<<<<< HEAD
              <img :src="weatherImg(currentWeather.weather[0].icon)" alt="">
              <div class="current-data-t">
                {{currentWeather.main.temp}} °C
                ({{phrases.feels_like}} {{currentWeather.main.feels_like}}°)
=======
              <img :src="weatherImg(weather.current.weather[0].icon)" alt="">
              <div>
                <div class="current-temp">{{weather.current.temp}} °C</div>
                <div class="current-feels">
                  ({{phrases.feels_like}} {{weather.current.feels_like}} °C)
                </div>
>>>>>>> fb6c05384a8aa525accdf0acf0bb7392b1717979
              </div>
            </div>
            <div>{{this.weather.current.dt | dateTime}}</div>

            <div class="weather-widget">
            <table class="weather-widget__items table table-striped table-bordered table-condensed">
              <tbody>
              <tr>
                <td>{{phrases.wind}}</td>
                <td>{{weather.current.wind_speed}} {{phrases.windSpeed}}</td>
              </tr>
              <tr>
                <td>{{phrases.cloudiness}}</td>
                <td>{{weather.current.weather[0].description}}</td>
              </tr>
              <tr>
                <td>{{phrases.pressure}}</td>
                <td>{{Math.floor(weather.current.pressure / 1.333)}} {{phrases.mercury}}</td>
              </tr>
              <tr>
                <td>{{phrases.humidity}}</td>
                <td>{{weather.current.humidity}} %</td>
              </tr>

              <tr>
                <td>{{phrases.sunrise}}</td>
                <td>{{weather.current.sunrise | time}}</td>
              </tr>
              <tr>
                <td>{{phrases.sunset}}</td>
                <td>{{weather.current.sunset | time}}</td>
              </tr>
              </tbody>
            </table>
            </div>
          </el-col>
<<<<<<< HEAD
          <el-col :span="17">
            <div class="grid-content bg-purple-light">иииии</div>
=======

          <el-col :span="16">
            <div class="grid-content">
              <el-tabs tab-position="top">
                <el-tab-pane :label="phrases.daily">
                  <div v-for="day in weather.daily" :key="day.dt" class="forecast-item">
                    <div class="forecast-item-column-first">
                      <div>{{day.dt | date2}}</div>
                      <img :src="weatherImg(day.weather[0].icon)" :alt="day.weather[0].description">
                    </div>
                    <div class="forecast-item-column-second">
                      <div class="forecast-item-row">
                        <div class="day-temp">
                          {{day.temp.day}} °C
                        </div>
                        <div class="night-temp">
                          {{day.temp.night}} °C
                        </div>
                        <div class="cloud-description">
                          {{day.weather[0].description}}
                        </div>
                      </div>
                      <div class="forecast-item-row">
                        {{day.wind_speed}} {{phrases.windSpeed}},
                        {{phrases.humidity}} {{day.humidity}}%
                      </div>
                      <div class="forecast-item-row">
                        {{phrases.windSpeed}} {{day.clouds}}%,
                        {{Math.floor(day.pressure / 1.333)}} {{phrases.mercury}}
                      </div>
                    </div>
                  </div>
                </el-tab-pane>

                <el-tab-pane :label="phrases.hourly">
                  Почасовой прогноз на 48 часов
                </el-tab-pane>
              </el-tabs>
            </div>
>>>>>>> fb6c05384a8aa525accdf0acf0bb7392b1717979
          </el-col>
        </el-row>

      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-console,prefer-destructuring */
import axios from 'axios';
import moment from 'moment';
import JQuery from 'jquery';
import citiesBase from '../../DataBase/cities';
import language from '../../DataBase/language';

const $ = JQuery;

export default {
  name: 'MyWeather',
  data() {
    const query = '';
    const result = {};
    const queryHistory = [];
    const historyView = false;
    const loading = false;
    const queryError = false;
    return {
      query,
      result,
      historyView,
      queryHistory,
      loading,
      queryError,
      wheatherHistory: [],
      cities: [],
      timeout: null,
      weather: null,
      phrases: null,
      selectedLanguage: null,
      currentReceived: false,
      forecastReceived: false,
      geoOptions: {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      },
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

    if (!JSON.parse(localStorage.getItem('queryHistory'))) {
      localStorage.setItem('queryHistory', JSON.stringify(this.queryHistory));
    } else {
      this.queryHistory = JSON.parse(localStorage.getItem('queryHistory'));
    }

    this.wheatherHistory = JSON.parse(localStorage.getItem('wheatherHistory')) || [];

    $(document).mouseup((e) => {
      const div = $('#input');
      const div2 = $('#queryHistory');
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
    handleSelect(item) { // запускаем функцию поиска по википедии
      if (item.city || item.city === '') {
        this.query = item.city;
        this.getCurrentWeather();
      } else {
        this.query = item.value;
      }
    },

    showQueryHistory() { // отображаем историю запросов
      if (!this.query && this.queryHistory.length > 0) {
        this.historyView = true;
      }
    },
    checkQueryHistory() { // проверяем есть ли такой запрос в истории, если есть не добавляем
      const word = this.query;
      const checkHistory = this.queryHistory.slice();
      for (let i = 0; i < checkHistory.length; i += 1) {
        checkHistory[i] = checkHistory[i].toLowerCase();
      }
      return checkHistory.indexOf(word.toLowerCase()) !== -1;
    },
    pushQueryHistory() { // добавляем запрос в историю
      this.query = this.query.trim();
      if (this.queryHistory.length < 15 && !this.checkQueryHistory() && this.query.length > 0) {
        this.queryHistory.unshift(this.query);
        this.saveQueryHistory();
      } else if (this.queryHistory.length >= 15 && !this.checkQueryHistory() && this.query.length > 0) {
        this.queryHistory.unshift(this.query);
        this.queryHistory.pop();
        this.saveQueryHistory();
      }
    },
    saveQueryHistory() { // сохраняем в localStorage
      localStorage.setItem('queryHistory', JSON.stringify(this.queryHistory));
    },
    deleteQueryHistoryAll() { // очищаем историю
      this.historyView = false;
      this.queryHistory = [];
      this.saveQueryHistory();
    },
    deleteHistoryQuery(index) { // очищаем запрос из истории
      this.queryHistory.splice(index, 1);
      this.saveQueryHistory();
    },
    getFromHistoryQuery(query) { // поиск по запросу из истории
      this.query = query;
      this.historyView = false;
      this.getCurrentWeather();
    },

    pushWhetherHistory(wheather) { // добавляем запрос в историю
      if (this.wheatherHistory.length < 30) {
        this.wheatherHistory.unshift(wheather);
        this.saveWhetherHistory();
      } else {
        this.queryHistory.unshift(wheather);
        this.queryHistory.pop();
        this.saveWhetherHistory();
      }
    },
    saveWhetherHistory() { // сохраняем в localStorage
      localStorage.setItem('wheatherHistory', JSON.stringify(this.wheatherHistory));
    },

    group(array) {
      return array.reduce((acc, obj) => {
        acc[obj.day] = acc[obj.day] || [];
        acc[obj.day].push(obj);
        return acc;
      }, {});
    },
    getCurrentLocation() {
      function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
      }

      navigator.geolocation.getCurrentPosition((position) => {
        const coord = {};
        coord.lat = position.coords.latitude;
        coord.lon = position.coords.longitude;
        this.getWeatherCurrentLocation(coord);
      }, error, this.geoOptions);
    },
    getWeatherCurrentLocation(coord) {
      this.currentReceived = false;
      this.weather = [];
      this.queryError = false;
      this.loading = true;
      axios({
        url: `http://api.openweathermap.org/data/2.5/weather?lat=${coord.lat}&lon=${coord.lon}&lang=${this.selectedLanguage}&units=metric&appid=f05a9d4f7cb1c74744d098bfaefdd35e`,
        method: 'GET',
      })
        .then((response) => {
          this.getOnecallWeather(response.data.coord, response.data.name);
        })
        .catch((error) => {
          this.loading = false;
          this.queryError = true;
          console.log(error);
        });
    },
    getCurrentWeather() { // получаем координаты и название для полноценного запроса:(
      this.currentReceived = false;
      this.weather = [];
      this.queryError = false;
      this.loading = true;
      axios({
        url: `http://api.openweathermap.org/data/2.5/weather?q=${this.query},ru&lang=${this.selectedLanguage}&units=metric&appid=f05a9d4f7cb1c74744d098bfaefdd35e`,
        method: 'GET',
      })
        .then((response) => {
          this.getOnecallWeather(response.data.coord, response.data.name);
        })
        .catch((error) => {
          this.loading = false;
          this.queryError = true;
          console.log(error);
        });
    },
    getOnecallWeather(coord, name) {
      this.currentReceived = false;
      this.weather = [];
      this.queryError = false;
      this.loading = true;
      axios({
        url: `http://api.openweathermap.org/data/2.5/onecall?lat=${coord.lat}&lon=${coord.lon}&exclude=minutely&lang=${this.selectedLanguage}&units=metric&appid=f05a9d4f7cb1c74744d098bfaefdd35e`,
        method: 'GET',
      })
        .then((response) => {
          this.weather = response.data;
          this.weather.name = name;
          this.weather.current.date = moment.unix(this.weather.current.dt).format('L');

          this.weather.hourly.forEach((item, i) => {
            this.weather.hourly[i].day = moment.unix(item.dt).format('L');
          });

          this.weather.hourly = this.group(this.weather.hourly);

          this.loading = false;
          this.currentReceived = true;
          this.loading = false;

          this.pushQueryHistory();
          this.pushWhetherHistory(this.weather);
          console.log('onecall', this.weather);
        })
        .catch((error) => {
          this.loading = false;
          this.queryError = true;
          console.log(error);
        });
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

  .queryHistory-body {
    padding: 10px;
    margin-top: 10px;
    border: 1px solid #dcdfe6;
    position: relative;
    z-index: 10;
    background-color: white;
  }

  .queryHistory-container {
    width: 100%;
    border-top: none;
  }

  .queryHistory-body-item {
    margin-bottom: 10px;
    display: -webkit-box;
    display: flex;
  }
  .queryHistory-item, .queryHistory-item-delete, .queryHistory-title {
    cursor: pointer;
    color: #237ace;
    text-decoration: none;
    font-size: 14px;
  }

  .queryHistory-title {
    font-weight: 600;
    font-size: 12px;
    cursor: pointer;
  }

  .queryHistory-item {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .queryHistory-item-delete {
    margin-left: auto;
  }
  .queryHistory-item:hover,
  .queryHistory-item-delete:hover,
  .queryHistory-title:hover {
    color: red;
  }
  .search-body {
    margin: 0 auto;
  }
  .form-inline {
    position: relative;
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

  .button-search {
    position: absolute;
    top: 0;
    right: 0;
    padding: 12px;
    cursor: pointer;
    font-size: 16px;
  }

  @media screen and (max-width: 500px) {
    .body {
      padding-top: 0;
    }
    .queryHistory-item, .queryHistory-item-delete, .queryHistory-title {
      font-size: 12px;
    }
  }
</style>
