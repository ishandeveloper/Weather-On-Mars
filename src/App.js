import React, { useState, useEffect } from "react";

import { formatDate } from "./helpers";
import { API_URL } from "./api";

// Components
import WeatherData from "./components/WeatherData";
import Info from "./components/Info";
import Unit from "./components/Unit";
import Previous from "./components/Previous";

import Image from "./img/mars.jpg";

import {
  AppWrapper,
  GlobalStyle,
  MarsWeather,
  InfoWrapper,
} from "./App.styles";

const App = () => {
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState([]);
  const [selectSol, setSelectSol] = useState(true);
  const [previous, setPrevious] = useState(false);
  const [metric, setMetric] = useState(true);

  console.log(weather);

  useEffect(() => {
    const fetchFromAPI = async () => {
      const weather = await fetch(API_URL).then((data) => data.json());
      console.log(weather);
      const marsWeather = weather.sol_keys.map((solKey) => {
        return {
          sol: solKey,
          maxTemp: weather[solKey].AT?.mx || "No Data",
          minTemp: weather[solKey].AT?.mn || "No Data",
          windSpeed: Math.round(weather[solKey].HWS?.av || 0),
          windDirectionDegrees:
            weather[solKey].WD?.most_common?.compass_degrees || 0,
          date: formatDate(new Date(weather[solKey].First_UTC)),
        };
      });
      setWeather(marsWeather);
      setSelectSol(marsWeather.length - 1);
      setLoading(false);
    };

    fetchFromAPI();
  }, []);

  return (
    <>
      <GlobalStyle bgImage={Image} />
      <AppWrapper>
        <MarsWeather>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <>
              <h1 className="main-title">
                Latest Weather at Elysium Plantitia
              </h1>
              <WeatherData sol={weather[selectSol]} isMetric={metric} />
              <InfoWrapper>
                <Info />
                <Unit metric={metric} setMetric={setMetric} />
              </InfoWrapper>
            </>
          )}
        </MarsWeather>
        <Previous
          weather={weather}
          previous={previous}
          setPrevious={setPrevious}
          setSelectedSol={setSelectSol}
          isMetric={metric}
        />
      </AppWrapper>
    </>
  );
};

export default App;
