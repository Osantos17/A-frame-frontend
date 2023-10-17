import { Route, Routes } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Marine } from "./Routes/Marine.jsx"
import { Home } from "./Routes/Home.jsx"
import { useEffect, useState } from "react";

export function Content() {

  const [tidesList, setTidesList] = useState([]);
  const [coordinates, setCoordinates] = useState([]);
  const [currentTide, setCurrentTide] = useState([]);

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
          const currentTide = json.data.weather[0];
          console.log(currentTide);
          setCurrentTide(currentTide);
        })
        .catch((error) => {
          console.error("Error fetching tide data:", error);
        });
    }
  }, [coordinates]);

  return(
    <div>
      <Routes>
        <Route path="/" element={<Home currentTide={currentTide} />} />
        <Route path="/forecast" element={<Marine tidesList={tidesList} />} />
      </Routes>  
    </div>
  )
}