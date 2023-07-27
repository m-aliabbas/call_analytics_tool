import React, { useEffect, useState } from 'react';
import Plotly from 'plotly.js-dist';

const Home = () => {
  const [dataPoints, setDataPoints] = useState([
    { country: "Italy", value: 55 },
    { country: "France", value: 49 },
    { country: "Spain", value: 44 },
    { country: "USA", value: 24 },
    { country: "Argentina", value: 15 },
  ]);

  useEffect(() => {
    const xArray = dataPoints.map(point => point.country);
    const yArray = dataPoints.map(point => point.value);

    const data = [{
      x: xArray,
      y: yArray,
      type: "bar",
      orientation: "v",
      marker: { color: "rgba(0,0,255,0.6)" }
    }];

    const layout = { title: "" };

    Plotly.newPlot("myPlot", data, layout);

    // Clean up Plotly when the component unmounts
    return () => Plotly.purge("myPlot");
  }, [dataPoints]);

  return (
    <div id="myPlot" style={{ width: "100%", maxWidth: "1200px" }}></div>
  );
};

export default Home;
