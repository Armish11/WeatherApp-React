import React, { useState } from 'react';
import axios from 'axios';
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm } from 'react-icons/wi';
import dayjs from 'dayjs';

const Weather = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [hourlyData, setHourlyData] = useState([]);
    const [weeklyData, setWeeklyData] = useState([]);
    const [city, setCity] = useState('');
    const [error, setError] = useState('');

    const API_KEY = 'ca0e4a8c82e5c736f911ec53bfcbab95';

    const getWeather = async (event) => {
        event.preventDefault();

        try {
            // Fetch current weather data
            const currentResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
            setWeatherData(currentResponse.data);

            // Fetch hourly weather data (note: OpenWeatherMap has a separate API for this)
            const hourlyResponse = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`);
            setHourlyData(hourlyResponse.data.list.slice(0, 12)); // Get only the next 12 hours

            // Fetch daily weather data
            const dailyResponse = await axios.get(`https://api.openweathermap.org/data/2.5/forecast/daily?q=${city}&cnt=7&appid=${API_KEY}&units=metric`);
            setWeeklyData(dailyResponse.data.list);

            setError('');
        } catch (err) {
            setError('City not found');
            setWeatherData(null);
            setHourlyData([]);
            setWeeklyData([]);
        }
    };

    const getWeatherIcon = (id) => {
        if (id >= 200 && id < 300) {
            return <WiThunderstorm size={40} />;
        } else if (id >= 300 && id < 400) {
            return <WiRain size={40} />;
        } else if (id >= 500 && id < 600) {
            return <WiRain size={40} />;
        } else if (id >= 600 && id < 700) {
            return <WiSnow size={40} />;
        } else if (id >= 800) {
            return <WiDaySunny size={40} />;
        } else {
            return <WiCloudy size={40} />;
        }
    };

    const containerStyle = {
        textAlign: 'center',
        minHeight: '100vh',
        backgroundImage: "url('https://images.unsplash.com/photo-1526715875108-ed5fa46df641?q=80&w=1495&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        margin: '0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        boxSizing: 'border-box',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
    };

    const formStyle = {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '20px',
        width: '100%',
        maxWidth: '500px',
    };

    const inputStyle = {
        flex: '1',
        padding: '10px',
        border: 'none',
        borderRadius: '5px 0 0 5px',
        fontSize: '16px',
    };

    const buttonStyle = {
        padding: '10px 20px',
        border: 'none',
        backgroundColor: 'rgb(211 35 19)',
        color: 'white',
        borderRadius: '0 5px 5px 0',
        cursor: 'pointer',
        fontSize: '16px',
    };

    const sectionStyle = {
        width: '100%',
        maxWidth: '800px',
        marginBottom: '30px',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: '20px',
        borderRadius: '10px',
    };

    const hourlyContainerStyle = {
        display: 'flex',
        overflowX: 'scroll',
        gap: '10px',
        padding: '10px 0',
    };

    const hourlyItemStyle = {
        minWidth: '80px',
        padding: '10px',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    };

    const weeklyContainerStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: '10px',
        padding: '10px 0',
    };

    const weeklyItemStyle = {
        padding: '10px',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    };

    return (
        <div style={containerStyle} >
            <h1>SkyScout</h1>
            <form style={formStyle} onSubmit={getWeather}>
                <input
                    type="text"
                    style={inputStyle}
                    placeholder="Enter your city, e.g., London,UK"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
                <button type="submit" style={buttonStyle}>
                    Get Weather
                </button>
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {weatherData && (
                <div style={sectionStyle}>
                    <h2>{weatherData.name}</h2>
                    <p style={{ fontSize: '48px', margin: '10px 0' }}>{weatherData.main.temp}°C</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {getWeatherIcon(weatherData.weather[0].id)}
                        <p style={{ marginLeft: '10px', fontSize: '20px' }}>{weatherData.weather[0].description}</p>
                    </div>
                </div>
            )}

            {hourlyData.length > 0 && (
                <div style={sectionStyle}>
                    <h3>Hourly Forecast</h3>
                    <div style={hourlyContainerStyle}>
                        {hourlyData.map((hour, index) => (
                            <div key={index} style={hourlyItemStyle}>
                                <p>{dayjs(hour.dt * 1000).format('h A')}</p>
                                {getWeatherIcon(hour.weather[0].id)}
                                <p>{hour.main.temp}°C</p>
                                {hour.pop > 0 && <p>{Math.round(hour.pop * 100)}% chance of rain</p>}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {weeklyData.length > 0 && (
                <div style={sectionStyle}>
                    <h3>7-Day Forecast</h3>
                    <div style={weeklyContainerStyle}>
                        {weeklyData.map((day, index) => (
                            <div key={index} style={weeklyItemStyle}>
                                <p>{dayjs(day.dt * 1000).format('dddd')}</p>
                                {getWeatherIcon(day.weather[0].id)}
                                <p>{day.temp.day}°C</p>
                                <p>{day.weather[0].description}</p>
                                {day.pop > 0 && <p>{Math.round(day.pop * 100)}% chance of rain</p>}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Weather;
