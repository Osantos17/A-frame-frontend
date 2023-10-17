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
          <div className="container text-center">
            <div className="row align-items-center">
                {forecast.hourly.slice(0, 8).map((hourlyData, hourlyIndex) =>(
                <div className="col" key={hourlyIndex}>
                  <ul>
                    <p>{hourlyData.time}</p>
                    <div className="swell">
                      <p>Swell</p>
                      <p>{hourlyData.swellHeight_ft}ft</p>
                      <p>{hourlyData.swellDir}</p>
                      <p>{forecast.hourly[0].swellDir16Point}</p>
                      <div className="swell-time">
                        <p>{hourlyData.swellPeriod_secs}</p>
                        <p>secs</p>
                      </div>
                    </div>
                    <div className="wind">
                      <p>Wind</p>
                      <p>{hourlyData.windspeedMiles}mph</p>
                      <p>{hourlyData.winddir16Point}</p>
                      <p>{hourlyData.winddirDegree}</p>
                    </div>
                  </ul>
                </div>
                ))}
            </div>    
            <p>{forecast.astronomy[0].sunrise}</p>
            <p>{forecast.astronomy[0].sunset}</p>
          </div>  
        </div>  
        ))} 
      </div>
    </div>
  );
}
