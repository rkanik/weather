import React, {
	useEffect,
	useState,
} from 'react'
import http from '../http'

// Styles
import './App.css';

const getDay = date => {
	const day = new Date(date).getDay()
	return {
		1: 'Monday',
		2: 'Tuesday',
		3: 'Wednesday',
		4: 'Thursday',
		5: 'Friday',
		6: 'Saturday',
		7: 'Sunday'
	}[day]
}

const getIconUrl = name => {
	return `http://openweathermap.org/img/wn/${name}.png`
}

const App = () => {

	const [time, setTime] = useState(0)
	const [weather, setWeather] = useState(null)
	const [forecast, setForecast] = useState(null)
	//const [fetching, setFetching] = useState(false)
	const [localTime] = useState(
		new Date().toLocaleString('en-US', {
			timeZone: 'Europe/London'
		}).split(',').pop()
	)

	const fetchData = async () => {

		console.log('FETCHING..')

		// Get current weather data
		let wRes = await http.getWeather()
		if (!wRes.error) {
			setWeather(wRes.data)
			console.log('WEATHER', wRes.data)
			localStorage.setItem('OPEN_WEATHER', JSON.stringify(wRes.data))
		}

		// Get 5 days forecast data
		let fRes = await http.getForecast()
		if (!fRes.error) {
			setForecast(fRes.data)
			console.log('FORECAST', fRes.data)
			localStorage.setItem('OPEN_FORECAST', JSON.stringify(fRes.data))
		}

		console.log('FETCHING DONE')
	}

	const refreshData = async () => {

		// Fetching data
		await fetchData()

		// Initializg time
		let lTime = 0
		setTime(lTime)

		// Interval run every second
		const minInterval = setInterval(() => {
			if (lTime === 59) {
				// Clearing the interval and refreshing data
				clearInterval(minInterval)
				refreshData()
			} else {
				// increasing current second
				lTime += 1
				setTime(lTime)
			}
		}, 1000);
	}

	// Effects
	useEffect(() => {
		let localWeather = localStorage.getItem('OPEN_WEATHER')
		localWeather && setWeather(JSON.parse(localWeather))

		let localForecast = localStorage.getItem('OPEN_FORECAST')
		localForecast && setWeather(JSON.parse(localForecast))

		refreshData()
	}, [])

	const uniqueForecast = (() => {
		return forecast
			? forecast.list.filter(
				a => a.dt_txt.includes('00:00:00')
			)
			: []
	})()

	return (
		<div className="app">
			<header className="app__header">
				<div className="container">
					{(weather && weather.weather) && <div className='header'>
						<h2 className="header__title">
							{weather.name}
						</h2>
						<div className="header__time">
							{localTime}
						</div>
						<div className="header__condition">
							<span>{weather.weather[0].main}</span>
							<img src={getIconUrl(weather.weather[0].icon)} alt="Weather Icon" />
						</div>
						<div className="header__temp">
							{weather.main.temp}
							<sup>°C</sup>
						</div>
					</div>}
					<div className="header__slider">
						<div className='header__progress'>
							<div style={{
								width: `${(time / 59) * 100}%`
							}}>
							</div>
							<span className='header__countdown'>
								Reloading in {60 - time}s
							</span>
						</div>
					</div>
				</div>
			</header>
			<div className="container">
				{forecast && <div className="forecast">
					{uniqueForecast.map((w, wi) => (
						<div className='forecast__box' key={wi}>
							<div className="forecast__day">
								{getDay(w.dt_txt)}
							</div>
							<div className='flex center'>
								<div className="forecast__temp">
									{w.main.temp}<sup>°C</sup>
								</div>
								<div className="forecast__icon">
									<img src={getIconUrl(w.weather[0].icon)} alt="Weather Icon" />
									<span>{w.weather[0].main}</span>
								</div>
							</div>
						</div>
					))}
				</div>}
			</div>
		</div>
	);
}

export default App;
