<template>
  <div class="container">
    <div class="grid-x search-container">
      <div class="cell auto">
        <el-form :inline="true" @submit.native.prevent="getCurrentWeather" class="form-inline"
                 status-icon>
          <el-autocomplete id="input"
                           popper-class="my-autocomplete"
                           :trigger-on-focus="false"
                           :select-when-unmatched="true"
                           :clearable="true"
                           v-model="query"
                           :fetch-suggestions="querySearch"
                           @focus="showQueryHistory"
                           :placeholder="phrases.searchTitle"
                           @select="handleSelect">
            <template slot-scope="{ item }">
              <div class="value">{{ item.city }}</div>
            </template>
          </el-autocomplete>
          <i v-on:click="getCurrentWeather" class="el-icon-search button-search"/>
        </el-form>

        <div id="queryHistory" v-if="historyView" class="queryHistory-body">
          <div class="queryHistory-container">
            <div class="queryHistory-body-item" v-for="(item, index) in queryHistory"
                 v-bind:key="item">
              <div class="queryHistory-item" v-on:click="getFromHistoryQuery(item)">{{item}}</div>
              <div class="queryHistory-item-delete" v-on:click="deleteHistoryQuery(index)">удалить
              </div>
            </div>
            <div v-on:click="deleteQueryHistoryAll" class="queryHistory-title">
              Очистить историю поиска
            </div>
          </div>
        </div>

        <div class="fail" v-if="queryError">
          {{phrases.searchError}}
        </div>
      </div>
      <div class="cell shrink current-button">
        <el-button v-on:click="getCurrentLocation" class="cell shrink" icon="el-icon-position">
          <span class="hide-for-small-only">{{phrases.location}}</span>
        </el-button>
      </div>
      <div class="cell shrink">
        <el-button v-on:click="$emit('update:layout', 'history')" class="cell shrink" icon="el-icon-receiving" :title="phrases.archive" />
      </div>
    </div>
    <loading class="cell" v-if="loading" />

      <div class="result-container">
        <div class="grid-x grid-margin-x">
          <div v-if="currentReceived" class="cell medium-8">
            <div class="current-title">
              {{phrases.title}}<br>
              {{weather.name}}
            </div>
            <div class="current-data">
              <img :src="weatherImg(weather.current.weather[0].icon)" alt="">
              <div>
                <div class="current-temp">{{weather.current.temp}} °C</div>
                <div class="current-feels">
                  ({{phrases.feels_like}} {{weather.current.feels_like}} °C)
                </div>
              </div>
            </div>
            <div class="current-time">{{this.weather.current.dt | dateTime}}</div>

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
          </div>

          <div v-if="currentReceived" class="cell medium-16">
              <el-tabs tab-position="top">
                <el-tab-pane :label="phrases.daily">
                  <div v-for="day in weather.daily" :key="day.dt" class="grid-x forecast-item">
                    <div class="cell shrink">
                      <div class="forecast-item-time">{{day.dt | date2}}</div>
                      <img :src="weatherImg(day.weather[0].icon)" :alt="day.weather[0].description">
                    </div>
                    <div class="cell auto small-offset-1 medium-offset-3">
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
                        {{phrases.cloudiness}}: {{day.clouds}}%,
                        {{Math.floor(day.pressure / 1.333)}} {{phrases.mercury}}
                      </div>
                    </div>
                  </div>
                </el-tab-pane>

                <el-tab-pane :label="phrases.hourly">
                  <div v-for="(day, index) in weather.hourly" :key="index" class="">
                    <div class="hourly-day-title">{{index}}</div>

                    <div v-for="(hour, index) in day" :key="index" class="grid-x forecast-item">
                      <div class="cell">
                        <div class="grid-x">
                        <div class="cell shrink">
                          <div class="forecast-item-time">{{hour.dt | time}}</div>
                          <img :src="weatherImg(hour.weather[0].icon)"
                               :alt="hour.weather[0].description">
                        </div>
                        <div class="cell auto small-offset-1 medium-offset-3">
                          <div class="forecast-item-row">
                            <div class="hour-temp">
                              {{hour.temp}} °C
                            </div>
                            <div class="cloud-description">
                              {{hour.weather[0].description}}
                            </div>
                          </div>
                          <div class="forecast-item-row">
                            {{hour.wind_speed}} {{phrases.windSpeed}},
                            {{phrases.humidity}} {{hour.humidity}}%
                          </div>
                          <div class="forecast-item-row">
                            {{phrases.windSpeed}} {{hour.clouds}}%,
                            {{Math.floor(hour.pressure / 1.333)}} {{phrases.mercury}}
                          </div>
                        </div>
                        </div>
                      </div>
                    </div>


                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </div>
      </div>
</template>

<script>
/* eslint-disable no-console,prefer-destructuring */
/* eslint max-len: ["error", { "code": 200 }] */
import axios from 'axios';
import moment from 'moment';
import JQuery from 'jquery';
import citiesBase from '../../DataBase/cities';
import language from '../../DataBase/language';

const $ = JQuery;
export default {
  name: 'MyWeather',
  props: ['selectedLanguage'],
  data() {
    return {
      query: null,
      result: {},
      queryHistory: [],
      historyView: false,
      loading: false,
      queryError: false,
      weatherHistory: [],
      cities: [],
      timeout: null,
      weather: null,
      phrases: [],
      currentReceived: false,
      geoOptions: {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      },
    };
  },
  mounted() {
    this.cities = citiesBase; // получаем массив городов для автокомплита
    moment.locale(this.selectedLanguage);
    this.phrases = (this.selectedLanguage === 'ru') ? language.ru : language.en; // берем правильную локализацию

    if (!JSON.parse(localStorage.getItem('queryHistory'))) { // получаем из LS историю запросов для поиска
      localStorage.setItem('queryHistory', JSON.stringify(this.queryHistory));
    } else {
      this.queryHistory = JSON.parse(localStorage.getItem('queryHistory'));
    }
    this.weatherHistory = JSON.parse(localStorage.getItem('weatherHistory')) || []; // получаем историю погоды

    $(document).mouseup((e) => { // немного jQuery, да простят меня на ревью)) просто ради экономии времени
      const div = $('#input');
      const div2 = $('#queryHistory');
      if (!div.is(e.target) && div.has(e.target).length === 0
          && !div2.is(e.target) && div2.has(e.target).length === 0) {
        this.historyView = false;
      }
    });
  },
  methods: {
    weatherImg(code) {
      return `http://openweathermap.org/img/wn/${code}.png`;
    },
    querySearch(queryString, cb) { // ищем наш город в автокомплите
      this.historyView = false;
      const results = this.cities.filter(this.createFilter(queryString));
      cb(results);
    },
    createFilter(queryString) { // фильтр автокомплита
      return (item) => (item.city.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
    },
    handleSelect(item) { // хэндл из автокомплита
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
    checkQueryHistory() { // проверяем есть ли такой запрос в истории
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
    saveQueryHistory() { // сохраняем историю запросов в localStorage
      localStorage.setItem('queryHistory', JSON.stringify(this.queryHistory));
    },
    deleteQueryHistoryAll() { // очищаем историю запросов
      this.historyView = false;
      this.queryHistory = [];
      this.saveQueryHistory();
    },
    deleteHistoryQuery(index) { // очищаем запрос из истории
      this.queryHistory.splice(index, 1);
      this.saveQueryHistory();
    },
    getFromHistoryQuery(query) { // получаем погоду по запросу из истории
      this.query = query;
      this.historyView = false;
      this.getCurrentWeather();
    },
    pushWhetherHistory(weather) { // добавляем запись погоды в историю
      if (this.weatherHistory.length < 100) {
        this.weatherHistory.unshift(weather);
        this.saveWhetherHistory();
      } else {
        this.weatherHistory.unshift(weather);
        this.weatherHistory.pop();
        this.saveWhetherHistory();
      }
    },
    saveWhetherHistory() { // сохраняем массив истории погоды в localStorage
      localStorage.setItem('weatherHistory', JSON.stringify(this.weatherHistory));
    },
    group(array) { // обрабатываем массив с почасовой погодой, группируем по дате
      return array.reduce((acc, obj) => {
        acc[obj.day] = acc[obj.day] || [];
        acc[obj.day].push(obj);
        return acc;
      }, {});
    },
    getCurrentLocation() { // получаем гео своей локации и делаем запрос погоды
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
    getWeatherCurrentLocation(coord) { /* получаем погоду по текущей геолокации и вызываем getOnecallWeather.
    это необходимо только для того, чтобы у нас было название города :( */
      this.currentReceived = false;
      this.weather = [];
      this.queryError = false;
      this.loading = true;
      axios({
        url: `https://api.openweathermap.org/data/2.5/weather?lat=${coord.lat}&lon=${coord.lon}&lang=${this.selectedLanguage}&units=metric&appid=f05a9d4f7cb1c74744d098bfaefdd35e`,
        method: 'GET',
      })
        .then((response) => {
          this.query = response.data.name;
          this.getOnecallWeather(response.data.coord, response.data.name);
        })
        .catch((error) => {
          this.loading = false;
          this.queryError = true;
          console.log(error);
        });
    },
    getCurrentWeather() { // получаем координаты и название города, вызываем основной метод getOnecallWeather
      this.currentReceived = false;
      this.weather = [];
      this.queryError = false;
      this.loading = true;
      axios({
        url: `https://api.openweathermap.org/data/2.5/weather?q=${this.query},ru&lang=${this.selectedLanguage}&units=metric&appid=f05a9d4f7cb1c74744d098bfaefdd35e`,
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
    getOnecallWeather(coord, name) { /* получаем все данные по погоде одним методом. метод работает только по координатам,
     не предоставляет название города, поэтому приходится использовать дополнительные запросы выше, не имея бд с городами и координатами */
      this.currentReceived = false;
      this.weather = [];
      this.queryError = false;
      this.loading = true;
      axios({
        url: `https://api.openweathermap.org/data/2.5/onecall?lat=${coord.lat}&lon=${coord.lon}&exclude=minutely&lang=${this.selectedLanguage}&units=metric&appid=f05a9d4f7cb1c74744d098bfaefdd35e`,
        method: 'GET',
      })
        .then((response) => {
          this.weather = response.data;
          this.weather.name = name;
          this.weather.current.date = moment.unix(this.weather.current.dt).format('L');

          this.weather.hourly.forEach((item, i) => { // добавляем свойство с датой, для последующей группировки
            this.weather.hourly[i].day = moment.unix(item.dt).format('LL');
          });

          this.weather.hourly = this.group(this.weather.hourly); // группируем по дате

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
  watch: {
    selectedLanguage(selectedLanguage) { // отслеживаем изменения в props и меняем язык, запрашиваем погоду в выбранном языке
      moment.locale(selectedLanguage);
      this.phrases = (selectedLanguage === 'ru') ? language.ru : language.en;
      if (this.query) this.getCurrentWeather();
    },
  },
};
</script>


<style>
  .container {
    margin: 0 auto;
    max-width: 1000px;
  }
  .search-container {
    margin-top: 80px;
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
  .item-link a {
    font-size: 18px;
    color: #237ace;
    text-decoration: none;
  }
  .item-link a:hover {
    color: red;
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

  .current-button {
    margin: 0 15px;
  }
  @media screen and (max-width: 500px) {
    .queryHistory-item, .queryHistory-item-delete, .queryHistory-title {
      font-size: 12px;
    }

    .current-button {
      margin: 0 5px;
    }
  }
</style>
