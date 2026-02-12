import React, { useEffect, useState } from "react";
import Navigation from "../components/Navigation";

const pastelColors = [
  "#f1002c",
  "#ff009d",
  "#bf00ff",
  "#4400ff",
  "#003cff",
  "#0095ff",
  "#00ccff",
  "#00ffe1",
  "#00ffc8",
  "#00ff3c",
  "#26ff00",
  "#ff7300",
  "#ff7700",
  "#ffbb00",
  "#ff2f00",
  "#4000ff",
];

const randomColor = () =>
  pastelColors[Math.floor(Math.random() * pastelColors.length)];

const randomGradient = () => {
  const c1 = randomColor();
  const c2 = randomColor();
  return `
    radial-gradient(circle at 30% 30%, ${c1}, transparent 70%),
    radial-gradient(circle at 70% 70%, ${c2}, transparent 70%)
  `;
};

const Home = () => {
  const COLS = 8;
  const size = window.innerWidth / COLS;
  const ROWS = Math.ceil(window.innerHeight / size);
  const TOTAL = COLS * ROWS;

  const generateGrid = () =>
    Array.from({ length: TOTAL }, () => randomGradient());

  const [cells, setCells] = useState(generateGrid);

  useEffect(() => {
    const interval = setInterval(() => {
      setCells(generateGrid());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home">
      <div className="home-grid">
        {cells.map((bg, i) => (
          <div
            key={i}
            className="grid-cell"
            style={{
              background: bg,
              animationDelay: `${i * 40}ms`,
            }}
          >
            <div className="black-ball" />
          </div>
        ))}
      </div>

      <Navigation />
    </div>
  );
};

export default Home;
