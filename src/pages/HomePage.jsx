import axios from "axios";
import React, { useEffect, useState } from "react";
import rainyImg from "../assets/rainy.jpg";
import sunnyImg from "../assets/sunny.jpg";
import thunderstormsImg from "../assets/thunderstoms.jpg";
import fogImg from "../assets/fog.jpg";
import cloudyImg from "../assets/cloudy.jpg";
import sunsetImg from "../assets/sunset.jpg";

const HomePage = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [backgroundImg, setBackgroundImg] = useState("");
  const [loading, setLoading] = useState(true);

  const getWeather = async () => {
    setLoading(true);
    try {
      const response =
        await axios.get(`http://api.weatherapi.com/v1/forecast.json?key=${
          import.meta.env.VITE_WEATHER_KEY
        }&q=delhi&days=7&aqi=no&alerts=no
`);
      console.log(response.data);
      const time = response.data.location.localtime;
      const weatherType = response.data.current.condition.text;
      const weatherImage = getWeatherImage(weatherType, time);
      console.log(weatherImage);
      setBackgroundImg(weatherImage);
      setWeatherData(response.data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const getTime = (time) => {
    const date = new Date(time);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  useEffect(() => {
    getWeather();
  }, []);

  const getWeatherImage = (weather, localtime) => {
    const hour = new Date(localtime).getHours();

    const isSunrise = hour >= 5 && hour <= 7;
    const isSunset = hour >= 17 && hour <= 19;

    const weatherType = weather.toLowerCase();

    if (
      weatherType.includes("rain") ||
      weatherType.includes("drizzle") ||
      weatherType.includes("shower")
    ) {
      return rainyImg;
    }
    if (
      weatherType.includes("clear") ||
      weatherType.includes("sun") ||
      weatherType.includes("bright")
    ) {
      return sunnyImg;
    }
    if (weatherType.includes("thunder") || weatherType.includes("storm")) {
      return thunderstormsImg;
    }
    if (
      weatherType.includes("snow") ||
      weatherType.includes("sleet") ||
      weatherType.includes("blizzard")
    ) {
      return "";
    }
    if (
      weatherType.includes("fog") ||
      weatherType.includes("mist") ||
      weatherType.includes("haze")
    ) {
      return fogImg;
    }
    if (weatherType.includes("cloud") || weatherType.includes("overcast")) {
      return cloudyImg;
    }
    if (weatherType.includes("wind")) {
      return "";
    }
    if (isSunrise || isSunset) {
      return sunsetImg;
    }

    return "";
  };

  return (
    <>
      {loading ? (
        <div>
          <h1>Loading weather</h1>
        </div>
      ) : (
        <div
          className="w-full min-h-screen  flex flex-col relative"
          style={{
            backgroundImage: `url(${backgroundImg})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        >
          <div className="w-full min-h-screen bg-black opacity-30 absolute blur-2xl "></div>
          <div className="z-50 p-5 md:p-12">
            <nav className="flex flex-row mb-12 ">
              <p className="text-white font-bold text-lg shadow-2xl">
                Weather App
              </p>
            </nav>
            <div className="flex flex-col  md:flex-row min-h-[calc(100vh-250px)] ">
              <div className="flex flex-col p-3 md:p-12  justify-end min-h-full gap-3 ">
                <div className="flex flex-row items-start text-white font-bold">
                  <h1 className="text-8xl">
                    {Math.round(weatherData.current.temp_c)}
                  </h1>
                  <span className="text-2xl mt-3">°C</span>
                </div>
                <div className="flex flex-row items-start text-white font-bold">
                  <p className="text-5xl text-center ">
                    {weatherData.location.name}
                  </p>
                </div>
                <div className="flex flex-row gap-3">
                  <p className="text-xl  text-white font-semibold shadow-2xl">
                    {getTime(weatherData.location.localtime)}
                  </p>
                  <span className="text-white">|</span>
                  <p className="text-xl  text-white font-semibold">
                    H:{weatherData.current.humidity}°C
                  </p>
                </div>
              </div>
              <div></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HomePage;
