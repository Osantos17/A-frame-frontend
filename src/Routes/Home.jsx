import "./Home.css";
import { useEffect, useState } from "react";
import Chart from 'chart.js/auto';

export function Home() {
  const [coordinates, setCoordinates] = useState([]);
  const [currentTide, setCurrentTide] = useState(null);
  const [tidePoints, setTidePoints] = useState([]);
  const [flattenedTidePoints, setFlattenedTidePoints] = useState([]);
  const [timePoints, setTimePoints] = useState([]); // Initialize timePoints
  const [flattenedTimePoints, setFlattenedTimePoints] = useState([]);

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

          const tidePoints = json.data.weather[0].tides[0].tide_data.map((tide) => parseFloat(tide.tideHeight_mt));
          console.log(tidePoints);
          setTidePoints(tidePoints);
          const flattenedTidePoints = tidePoints.flat();
          console.log(flattenedTidePoints);
          setFlattenedTidePoints(flattenedTidePoints);

          const timePoints = json.data.weather[0].tides[0].tide_data.map((tide) => tide.tideTime)
          console.log(timePoints);
          setTimePoints(timePoints);
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

        const yLabels = [
          '00:00', '03:00', '06:00', '09:00',
          '12:00', '15:00', '18:00', '21:00', '24:00'
        ];

        // Create a new array for flattenedTidePoints with null values
        const updatedFlattenedTidePoints = new Array(timePoints.length).fill(null);

        // Add the new data point at 12:30
        const newDataPointIndex = timePoints.indexOf("12:30");
        if (newDataPointIndex !== -1) {
          updatedFlattenedTidePoints[newDataPointIndex] = 1.2;
        }

        new Chart(chartCanvas, {
          type: 'line',
          data: {
            labels: timePoints, // Use updated timePoints as labels
            datasets: [
              {
                label: 'Tide Heights',
                data: updatedFlattenedTidePoints,
                tension: 0.5,
              },
            ],
          },
          options: {
            scales: {
              x: { labels: yLabels },
              y: {
                suggestedMax: Math.max(...updatedFlattenedTidePoints),
                suggestedMin: Math.min(...updatedFlattenedTidePoints),
              },
            },
          },
        });
      }
    }
  }, [flattenedTidePoints, timePoints]);

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
