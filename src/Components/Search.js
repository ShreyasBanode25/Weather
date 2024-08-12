import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import './Search.css'; // Import CSS for styling

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const WeatherSearch = () => {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');

  const fetchCoordinates = async (locationName) => {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationName)}&format=json&limit=1`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.length > 0) {
        return data[0];
      } else {
        throw new Error('Location not found');
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      setError('Unable to fetch coordinates. Please try another location.');
    }
  };

  const fetchWeatherData = async (latitude, longitude) => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,precipitation_probability,precipitation,rain,showers,snowfall,temperature_80m,temperature_120m,temperature_180m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,daylight_duration,sunshine_duration,uv_index_max,uv_index_clear_sky_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant,shortwave_radiation_sum,et0_fao_evapotranspiration`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setWeatherData(data);
      setError('');
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError('Unable to fetch weather data. Please try again later.');
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const coordinates = await fetchCoordinates(location);
    if (coordinates) {
      fetchWeatherData(coordinates.lat, coordinates.lon);
    }
  };

  const getHourlyChartData = () => {
    if (!weatherData) return {};

    const labels = weatherData.hourly.time.map(time => time.slice(11, 16)); // Extract time from ISO string
    const temperatureData = weatherData.hourly.temperature_2m;
    const humidityData = weatherData.hourly.relative_humidity_2m;
    const dewPointData = weatherData.hourly.dew_point_2m;

    return {
      labels,
      datasets: [
        {
          label: 'Temperature (°C)',
          data: temperatureData,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
        },
        {
          label: 'Humidity (%)',
          data: humidityData,
          borderColor: 'rgba(153, 102, 255, 1)',
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          fill: true,
        },
        {
          label: 'Dew Point (°C)',
          data: dewPointData,
          borderColor: 'rgba(255, 159, 64, 1)',
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          fill: true,
        },
      ],
    };
  };

  const getDailyChartData = () => {
    if (!weatherData) return {};

    const labels = weatherData.daily.time.map(date => date.slice(0, 10)); // Extract date from ISO string
    const maxTempData = weatherData.daily.temperature_2m_max;
    const minTempData = weatherData.daily.temperature_2m_min;

    return {
      labels,
      datasets: [
        {
          label: 'Max Temperature (°C)',
          data: maxTempData,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          fill: true,
        },
        {
          label: 'Min Temperature (°C)',
          data: minTempData,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          fill: true,
        },
      ],
    };
  };

  return (
    <div className="container">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location"
        />
        <button type="submit">Search</button>
      </form>

      {error && <p>{error}</p>}
      
      {weatherData && (
        <div className="weather-info">
          <div className="chart-container">
            <h2>Hourly Weather Data for {location}</h2>
            <div className="chart-wrapper">
              <Line data={getHourlyChartData()} />
            </div>
          </div>
          <div className="chart-container">
            <h2>Daily Weather Data for {location}</h2>
            <div className="chart-wrapper">
              <Line data={getDailyChartData()} />
            </div>
          </div>
          <div className="feature-box">
            <h2>Weather Features</h2>
            <ul>
              <li>Max Temperature (°C): {weatherData.daily.temperature_2m_max[0]}</li>
              <li>Min Temperature (°C): {weatherData.daily.temperature_2m_min[0]}</li>
              <li>Apparent Max Temperature (°C): {weatherData.daily.apparent_temperature_max[0]}</li>
              <li>Apparent Min Temperature (°C): {weatherData.daily.apparent_temperature_min[0]}</li>
              <li>Rain Sum (mm): {weatherData.daily.rain_sum[0]}</li>
              <li>Precipitation Hours: {weatherData.daily.precipitation_hours[0]}</li>
              <li>Sunshine Duration (h): {weatherData.daily.sunshine_duration[0]}</li>
              <li>Max Wind Speed (km/h): {weatherData.daily.wind_speed_10m_max[0]}</li>
              <li>Max Wind Gusts (km/h): {weatherData.daily.wind_gusts_10m_max[0]}</li>
              <li>UV Index Max: {weatherData.daily.uv_index_max[0]}</li>
              <li>ET0 FAO Evapotranspiration (mm): {weatherData.daily.et0_fao_evapotranspiration[0]}</li>
              <li>Shortwave Radiation Sum (J/m²): {weatherData.daily.shortwave_radiation_sum[0]}</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherSearch;
