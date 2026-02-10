import { useEffect, useRef } from "react";
import Navigation from "../components/Navigation";

const randomBetween = (min, max) => Math.random() * (max - min) + min;

const rotate = (vx, vy, sin, cos, reverse) => ({
  x: reverse ? vx * cos + vy * sin : vx * cos - vy * sin,
  y: reverse ? vy * cos - vx * sin : vy * cos + vx * sin,
});

const BallsCircle = () => {
  const canvasRef = useRef(null);
  const ballsRef = useRef([]);
  const rafRef = useRef(null);
  const soundRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const W = canvas.width;
    const H = canvas.height;

    soundRef.current = new Audio("/sounds/passball.wav");
    soundRef.current.load();

    const playSound = () => {
      const s = soundRef.current.cloneNode();
      s.volume = 0.4;
      s.play();
    };

    const createBall = () => ({
      x: randomBetween(10, W - 10),
      y: randomBetween(10, H - 10),
      vx: randomBetween(-1.5, 1.5) || 1,
      vy: randomBetween(-1.5, 1.5) || 1,
      r: 6,
    });

    // ✅ single init (fix strict mode)
    ballsRef.current = [createBall()];

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

        if (hit) {
          playSound();
          newBalls.push(createBall());
        }
      }

      // ✅ collisions between balls
      for (let i = 0; i < ballsRef.current.length; i++) {
        for (let j = i + 1; j < ballsRef.current.length; j++) {
          const b1 = ballsRef.current[i];
          const b2 = ballsRef.current[j];

          const dx = b2.x - b1.x;
          const dy = b2.y - b1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = b1.r + b2.r;

          if (dist < minDist) {
            const angle = Math.atan2(dy, dx);
            const sin = Math.sin(angle);
            const cos = Math.cos(angle);

            const v1 = rotate(b1.vx, b1.vy, sin, cos, true);
            const v2 = rotate(b2.vx, b2.vy, sin, cos, true);

            [v1.x, v2.x] = [v2.x, v1.x];

            const f1 = rotate(v1.x, v1.y, sin, cos, false);
            const f2 = rotate(v2.x, v2.y, sin, cos, false);

            b1.vx = f1.x;
            b1.vy = f1.y;
            b2.vx = f2.x;
            b2.vy = f2.y;

            const overlap = minDist - dist;
            const ax = (overlap / 2) * cos;
            const ay = (overlap / 2) * sin;

            b1.x -= ax;
            b1.y -= ay;
            b2.x += ax;
            b2.y += ay;
          }
        }
      }

      // draw
      for (let ball of ballsRef.current) {
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
        <canvas ref={canvasRef} width={1000} height={700} />
      </div>
    </div>
  );
};

export default BallsCircle;

// Garde cette structure car elle est intéressante, les balles ne ralentissent pas trop et font moins ramer l'ordi qu'auparavant
