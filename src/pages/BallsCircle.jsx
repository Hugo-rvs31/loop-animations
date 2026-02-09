import { useEffect, useRef } from "react";
import Navigation from "../components/Navigation";

const randomBetween = (min, max) => Math.random() * (max - min) + min;

const BallsCircle = () => {
  const canvasRef = useRef(null);
  const ballsRef = useRef([]);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const W = canvas.width;
    const H = canvas.height;

    const createBall = () => ({
      x: randomBetween(10, W - 10),
      y: randomBetween(10, H - 10),
      vx: randomBetween(-1.5, 1.5) || 1,
      vy: randomBetween(-1.5, 1.5) || 1,
      r: 6,
    });

    ballsRef.current.push(createBall());

    const animate = () => {
      ctx.clearRect(0, 0, W, H);

      const newBalls = [];

      for (let ball of ballsRef.current) {
        ball.x += ball.vx;
        ball.y += ball.vy;

        let hit = false;

        if (ball.x <= ball.r || ball.x >= W - ball.r) {
          ball.vx *= -1;
          hit = true;
        }

        if (ball.y <= ball.r || ball.y >= H - ball.r) {
          ball.vy *= -1;
          hit = true;
        }

        if (hit) newBalls.push(createBall());

        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
        ctx.fillStyle = "#7dd3fc";
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#7dd3fc";
        ctx.fill();
      }

      ballsRef.current.push(...newBalls);

      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div className="balls-page">
      <Navigation />

      <div className="canvas-wrapper">
        <canvas ref={canvasRef} width={600} height={300} />
      </div>
    </div>
  );
};

export default BallsCircle;

// Garde cette structure car elle est intéressante, les balles ne ralentissent pas trop et font moins ramer l'ordi qu'auparavant
