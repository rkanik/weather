import axios from "axios"
import {
	APP_ID,
	WEATHER,
	FORECAST
} from './constants'

/* eslint-disable import/no-anonymous-default-export */
export default {
	get: url => new Promise(async resolve => {
		axios.get(url)
			.then(data => resolve({ error: false, data: data.data }))
			.catch(error => resolve({ error: true, data: error.response }))
	}),
	getWeather(){
		return this.get(`${WEATHER}?units=metric&q=London&appid=${APP_ID}`)
	},
	getForecast(){
		return this.get(`${FORECAST}?units=metric&q=London&appid=${APP_ID}`)
	}
}