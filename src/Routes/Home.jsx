import "./Home.css";
import { useEffect, useState } from "react";
import Chart from 'chart.js/auto';

export function Home() {
  const [coordinates, setCoordinates] = useState([]);
  const [currentTide, setCurrentTide] = useState(null);
  const [tidePoints, setTidePoints] = useState([]);
  const [flattenedTidePoints, setFlattenedTidePoints] = useState([]);

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
          const currentTide = json.data.weather[0];
          console.log(currentTide);
          setCurrentTide(currentTide);
          const tidePoints = json.data.weather.map((week) =>
            week.tides[0].tide_data.map((tide) => parseFloat(tide.tideHeight_mt))
          );
          console.log(tidePoints);
          setTidePoints(tidePoints);
          const flattenedTidePoints = tidePoints.flat();
          console.log(flattenedTidePoints);
          setFlattenedTidePoints(flattenedTidePoints); // Set flattenedTidePoints state
        })
        .catch((error) => {
          console.error("Error fetching tide data:", error);
        });
    }
  }, [coordinates]);

  useEffect(() => {
    if (flattenedTidePoints.length) {
      const chartCanvas = document.getElementById('acquisitions');

      if (chartCanvas) {
        const existingChart = Chart.getChart(chartCanvas);
        if (existingChart) {
          existingChart.destroy();
        }

        new Chart(chartCanvas, {
          type: 'line',
          data: {
            labels: flattenedTidePoints.map((_, index) => index),
            datasets: [
              {
                label: 'Tide Heights',
                data: flattenedTidePoints,
                tension: 0.5,
              },
            ],
          },
          options: {
            scales: {
              y: {
                suggestedMax: Math.max(...flattenedTidePoints),
                suggestedMin: Math.min(...flattenedTidePoints),
              },
            },
          },
        });
      }
    }
  }, [flattenedTidePoints]);

  return (
    <div>
      <div>
        <canvas id="acquisitions" width="800" height="200"></canvas>
      </div>
      {currentTide && (
        <div>
          <p>{currentTide.maxtempF}°F</p>
          <p>{currentTide.mintempF}°F</p>
          {currentTide.tides[0].tide_data.map((tide, index) => (
            <div key={index}>
              <p>{tide.Height_mt}</p>
              <p>{tide.tideTime}</p>
              <p>{tide.tide_type}</p>
            </div>
          ))}
          <div className="container text-center">
            <div className="row align-items-center">
              {currentTide.hourly.map((current, index) => (
                <div className="col" key={index}>
                  <p>{current.time}</p>
                  <p>{current.swellHeight_ft}</p>
                  <p>{current.swellPeriod_secs}</p>
                  <p>{current.swellDir}</p>
                  <p>{current.swellDir16Point}</p>
                  <p>{current.windspeedMiles}</p>
                  <p>{current.winddir16Point}</p>
                  <p>{current.winddirDegree}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
