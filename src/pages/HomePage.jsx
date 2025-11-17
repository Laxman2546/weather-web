import axios from "axios";
import React, { useEffect, useState } from "react";
import rainyImg from "../assets/rainy.jpg";
import sunnyImg from "../assets/sunny.jpg";
import thunderstormsImg from "../assets/thunderstoms.jpg";
import fogImg from "../assets/fog.jpg";
import cloudyImg from "../assets/cloudy.jpg";
import sunsetImg from "../assets/sunset.jpg";
import loader from "../assets/loader.gif";
import sad from "../assets/sad.png";
import "../App.css";

const HomePage = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [backgroundImg, setBackgroundImg] = useState("");
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [error, setError] = useState(false);

  const getWeather = async (query) => {
    setLoading(true);
    try {
      const response =
        await axios.get(`https://api.weatherapi.com/v1/forecast.json?key=${
          import.meta.env.VITE_WEATHER_KEY
        }&q=${query || "hyderabad"}&days=7&aqi=no&alerts=no
`);
      console.log(response.data);
      const time = response.data.location.localtime;
      const weatherType = response.data.current.condition.text;
      const weatherImage = getWeatherImage(weatherType, time);
      console.log(weatherImage);
      setBackgroundImg(weatherImage);
      setWeatherData(response.data);
      setError(false);
    } catch (e) {
      console.log(e);
      setError(true);
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
  const getDay = (time) => {
    const date = new Date(time);
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const day = days[date.getDay()];
    return day;
  };
  useEffect(() => {
    getWeather();
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (query) {
        getWeather(query);
      }
    }, 3000);
    return () => {
      clearInterval(debounce);
    };
  }, [query]);

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
        <div className="w-full min-h-screen flex flex-col items-center justify-center gap-5">
          <img src={loader} alt="loader" className="w-24 h-24" />
          <h1 className="text-2xl font-bold">Fetching Weather Data</h1>
        </div>
      ) : (
        <>
          <div
            className="w-full min-h-screen   flex flex-col relative overflow-hidden"
            style={{
              backgroundImage: `url(${backgroundImg})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          >
            <div className="w-full min-h-screen bg-black opacity-40 absolute blur-2xl "></div>

            <div className="z-50 p-5 md:p-12">
              <nav className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12  pr-12 gap-5">
                <p className="text-white font-bold text-lg shadow-2xl">
                  Weather App
                </p>
                <div className="w-full md:w-2/5 relative">
                  <input
                    type="text"
                    onChange={(e) => setQuery(e.target.value)}
                    value={query}
                    className="glass-card relative p-3 placeholder-white min-w-full outline-none border-none shadow-2xl text-white"
                    placeholder="Search City"
                  />
                </div>
                <p></p>
              </nav>
              <div className="flex flex-col   md:flex-row min-h-[calc(100vh-250px)] ">
                {error ? (
                  <div className="flex flex-col items-center justify-center min-h-full w-full">
                    <img src={sad} alt="sad" className="w-24 h-24" />
                    <h1 className="text-2xl text-white font-bold text-center ">
                      Location not found
                    </h1>
                  </div>
                ) : (
                  <>
                    <div className=" flex flex-col p-3 md:p-12  justify-end min-h-full gap-3 ">
                      <div className="flex flex-row items-start text-white font-bold">
                        <h1 className="text-8xl">
                          {Math.round(weatherData.current.temp_c)}
                        </h1>
                        <span className="text-2xl mt-3">°C</span>
                        <img
                          src={weatherData.current.condition.icon}
                          alt="weathericon"
                          className="mt-9"
                        />
                      </div>
                      <div className="flex flex-row items-start text-white font-bold">
                        <p className="text-5xl text-start text-wrap">
                          {weatherData.location.name}
                        </p>
                      </div>
                      <div className="flex flex-row gap-3">
                        <p className="text-xl text-nowrap text-white font-semibold shadow-2xl">
                          {getTime(weatherData.location.localtime)}
                        </p>
                        <span className="text-white">|</span>
                        <p className="text-xl  text-white font-semibold">
                          H:{weatherData.current.humidity}°C
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col justify-start items-center min-h-full w-4/5  mr-2   gap-8">
                      <div className="glass-card p-5 rounded-2xl flex flex-col w-full md:w-1/2">
                        <div className="flex justify-between items-center mb-2">
                          <h1 className="text-white text-lg font-semibold tracking-wide">
                            Today's Forecast
                          </h1>
                        </div>
                        <div className="w-full h-[2px] bg-white/40 mb-3"></div>

                        <div className="flex flex-row gap-6 overflow-x-auto no-scrollbar py-2">
                          {weatherData.forecast.forecastday[0].hour.map(
                            (day, index) => (
                              <div
                                key={index}
                                className="flex flex-col items-center "
                              >
                                <p className="text-xs  text-white/80 whitespace-nowrap">
                                  {getTime(day.time)}
                                </p>
                                <img
                                  src={day.condition.icon}
                                  alt="weathericon"
                                  className="w-10 h-10 my-1"
                                />
                                <p className="text-sm font-medium text-white">
                                  {day.temp_c}°C
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                      <div className="glass-card p-5 rounded-2xl flex flex-col w-full md:w-1/2">
                        <div className="flex justify-between items-center mb-2">
                          <h1 className="text-white text-lg font-semibold tracking-wide">
                            6-Day Forecast
                          </h1>
                        </div>
                        <div className="w-full h-[2px] bg-white/40 mb-3"></div>

                        <div className="flex flex-col gap-3 overflow-y-auto no-scrollbar">
                          {weatherData.forecast.forecastday
                            .slice(1)
                            .map((day, index) => (
                              <div
                                key={index}
                                className="flex flex-row items-center justify-between gap-4"
                              >
                                {" "}
                                <div className="flex items-center gap-3">
                                  <p className="text-sm text-white/90 font-medium w-10">
                                    {getDay(day.date).slice(0, 3)}
                                  </p>
                                  <img
                                    src={day?.day?.condition?.icon}
                                    alt="weathericon"
                                    className="w-8 h-8"
                                  />
                                </div>
                                <div className="flex-1 flex items-center gap-2">
                                  <p className="text-xs text-white/70">
                                    {day?.day.mintemp_c}°
                                  </p>
                                  <div className="relative w-full h-[4px] bg-white/20 rounded-full">
                                    <div
                                      className="absolute h-[4px] rounded-full bg-gradient-to-r from-blue-400 to-orange-300"
                                      style={{
                                        left: "10%",
                                        right: "10%",
                                        width: `${
                                          ((day.day.maxtemp_c -
                                            day.day.mintemp_c) /
                                            50) *
                                          100
                                        }%`,
                                      }}
                                    ></div>
                                  </div>
                                  <p className="text-xs text-white/70">
                                    {day?.day.maxtemp_c}°
                                  </p>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default HomePage;
