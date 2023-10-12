import "./Marine.css";
import { useState, useEffect } from "react";

export function Marine() {
  const [tidesList, setTidesList] = useState([]);
  const [coordinates, setCoordinates] = useState([]);

  const successCallback = (position) => {
    console.log(position);
    setCoordinates(position.coords);
  };

  const errorCallback = (error) => {
    console.log(error);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  }, []);

  useEffect(() => {
    if (coordinates && coordinates.latitude && coordinates.longitude) {
      fetch(
        `http://api.worldweatheronline.com/premium/v1/marine.ashx?key=f1f00d06db194dd38e4190248232509&q=${coordinates.latitude},${coordinates.longitude}&format=json&tide=yes&tp=string`
      )
        .then((res) => res.json())
        .then((json) => {
          console.log(json);
          const tidesData = json.data.weather;
          console.log(tidesData);
          setTidesList(tidesData);
        })
        .catch((error) => {
          console.error("Error fetching tide data:", error);
        });
    }
  }, [coordinates]);

  return (
    <div>
      <div className="marine-body">
        {tidesList.map((forecast, index) => (
          <div key={index}>
            <p>{forecast.date}</p>
            <p>{forecast.hourly[0].swellDir}</p>
            <p>{forecast.hourly[0].swellDir16Point}</p>
            <p>{forecast.hourly[0].swellHeight_ft}</p>
            <p>{forecast.hourly[0].swellPeriod_secs}</p>
            <p>{forecast.hourly[0].winddir16Point}</p>
            <p>{forecast.hourly[0].winddirDegree}</p>
            <p>{forecast.hourly[0].windspeedMiles}</p>
            <p>{forecast.astronomy[0].sunrise}</p>
            <p>{forecast.astronomy[0].sunset}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
