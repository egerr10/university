<template>
  <div class="container">
    <div class="result-container">
      <div class="grid-x grid-margin-x">
        <div class="cell archive-title">
          <div>{{phrases.archiveQuery}}</div>
        </div>
        <div class="cell">
          <el-button v-on:click="$emit('update:layout', 'search')" icon="el-icon-search">
            {{phrases.backToSearch}}
          </el-button>
        </div>
        <div class="cell medium-16">
              <div v-for="day in infinityEmulator()" :key="day.dt" class="grid-x forecast-item">
                <div class="cell shrink">
                  <div class="forecast-item-name">{{day.name}}</div>
                  <div class="forecast-item-time">{{day.current.dt | dateTime}}</div>
                  <img :src="weatherImg(day.current.weather[0].icon)" :alt="day.current.weather[0].description">
                </div>
                <div class="cell auto small-offset-1 medium-offset-3">
                  <div class="forecast-item-row">
                    <div class="day-temp">
                      {{day.current.temp}} °C
                    </div>
                    <div class="cloud-description">
                      {{day.current.weather[0].description}}
                    </div>
                  </div>
                  <div class="forecast-item-row">
                    {{day.current.wind_speed}} {{phrases.windSpeed}},
                    {{phrases.humidity}} {{day.current.humidity}}%
                  </div>
                  <div class="forecast-item-row">
                    {{phrases.cloudiness}}: {{day.current.clouds}}%,
                    {{Math.floor(day.current.pressure / 1.333)}} {{phrases.mercury}}
                  </div>
                </div>
                <div class="cell">
                  <el-collapse>
                    <el-collapse-item :title="phrases.daily" name="1">
                      <div>Consistent with real life: in line with the process and logic of real life, and comply with languages and habits that the users are used to;</div>
                      <div>Consistent within interface: all elements should be consistent, such as: design style, icons and texts, position of elements, etc.</div>
                    </el-collapse-item>
                  </el-collapse>
                </div>
              </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-console,prefer-destructuring */
/* eslint max-len: ["error", { "code": 200 }] */
import moment from 'moment';
import language from '../../DataBase/language';

export default {
  name: 'history',
  props: ['selectedLanguage'],
  data() {
    return {
      phrases: [],
      weather: [],
      page: 10,
    };
  },
  mounted() {
    window.addEventListener('scroll', this.infinityScroll);
    moment.locale(this.selectedLanguage);
    this.phrases = (this.selectedLanguage === 'ru') ? language.ru : language.en;

    this.weather = JSON.parse(localStorage.getItem('weatherHistory')) || [];
  },
  methods: {
    weatherImg(code) {
      return `http://openweathermap.org/img/wn/${code}.png`;
    },
    infinityEmulator() { // эмулируем страницы
      return this.weather.slice(0, this.page);
    },
    infinityScroll() { // инфинити
      const diffHeight = Math.floor(Math.abs(document.documentElement.scrollHeight
        - document.documentElement.scrollTop));
      if (diffHeight <= 1000) {
        this.page += 10;
      }
    },
  },
  watch: {
    selectedLanguage(selectedLanguage) { /* отслеживаем изменения в props и меняем язык.
      так как дескрипторы хранятся в том языке, в котором был запрос к API, в реальном приложении пришлось бы писать метод
      который возвращал бы правильный перевод, в зависимости от выбранного языка. Тут, я думаю, достаточно этой ремарки */
      moment.locale(selectedLanguage);
      this.phrases = (selectedLanguage === 'ru') ? language.ru : language.en;
    },
  },
};
</script>

<style scoped>
  .result-container {
    margin-top: 80px;
  }

  .archive-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 20px;
  }

  .forecast-item-name {
    font-size: 16px;
    font-weight: 600;
  }

  .forecast-item {
    border-bottom: 1px solid #dddddd;
    padding-bottom: 15px;
  }

  .forecast-item-time {
    font-size: 14px;
  }
</style>
