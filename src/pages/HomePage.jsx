import axios from "axios";
import React, { useEffect } from "react";

const HomePage = () => {
  const getWeather = async () => {
    try {
      const response =
        await axios.get(`http://api.weatherapi.com/v1/forecast.json?key=${
          import.meta.env.VITE_WEATHER_KEY
        }&q=London&days=7&aqi=no&alerts=no
`);
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getWeather();
  }, []);
  return (
    <>
      <div>HomePage</div>
      <h1>Hello weather</h1>
    </>
  );
};

export default HomePage;
