import { useEffect, useRef, useState } from "react";
import Navigation from "../components/Navigation";

const randomBetween = (min, max) => Math.random() * (max - min) + min;

const createBall = (x, y) => ({
  x: x ?? randomBetween(50, window.innerWidth - 50),
  y: y ?? randomBetween(50, window.innerHeight - 50),
  vx: randomBetween(-4, 4) || 2,
  vy: randomBetween(-4, 4) || 2,
  size: 18,
});

const BallsCircle = () => {
  const [balls, setBalls] = useState([createBall()]);
  const requestRef = useRef(null);

  const circle = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2 + 50,
    r: 140,
    openingAngle: Math.PI / 3, // ouverture en haut
  };

  const animate = () => {
    setBalls((prev) => {
      let spawned = false;
      let spawnBall = null;

      const updated = prev.map((ball) => {
        let { x, y, vx, vy, size } = ball;

        x += vx;
        y += vy;

        // rebond écran
        if (x <= 0 || x + size >= window.innerWidth) vx *= -1;
        if (y <= 0 || y + size >= window.innerHeight) vy *= -1;

        // ----- STRUCTURE -----
        const cx = x + size / 2 - circle.x;
        const cy = y + size / 2 - circle.y;
        const dist = Math.sqrt(cx * cx + cy * cy);

        const angle = Math.atan2(cy, cx);

        const openMin = -Math.PI / 2 - circle.openingAngle;
        const openMax = -Math.PI / 2 + circle.openingAngle;

        const inOpening = angle > openMin && angle < openMax;

        if (
          !spawned &&
          dist > circle.r - size &&
          dist < circle.r + size &&
          !inOpening
        ) {
          const nx = cx / dist;
          const ny = cy / dist;

          const dot = vx * nx + vy * ny;
          vx -= 2 * dot * nx;
          vy -= 2 * dot * ny;

          // ✅ une seule fois
          spawnBall = createBall(20, 20);
          spawned = true;
        }

        return { ...ball, x, y, vx, vy };
      });

      return spawnBall ? [...updated, spawnBall] : updated;
    });

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  return (
    <div className="balls-page">
      <Navigation />

      <div className="balls-container">
        <div
          className="structure"
          style={{
            width: circle.r * 2,
            height: circle.r * 2,
            left: circle.x - circle.r,
            top: circle.y - circle.r,
          }}
        />

        {balls.map((ball, i) => (
          <div
            key={i}
            className="ball"
            style={{
              width: ball.size,
              height: ball.size,
              transform: `translate(${ball.x}px, ${ball.y}px)`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default BallsCircle;
