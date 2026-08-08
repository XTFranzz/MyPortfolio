import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { fibonacciSphere, tiltPoints } from "./orbitMath";
import { ORBIT_TECHS } from "./orbitData";
import "./hero-orbit.css";

const TILT_DEG = 16;
const ROTATION_SPEED_DEG = 6;
const PERSPECTIVE = 900;
const INITIAL_ANGLE = 0.6;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mql.matches);
    const onChange = (e) => setReduced(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

export function HeroOrbit() {
  const containerRef = useRef(null);
  const itemRefs = useRef([]);
  const radiusRef = useRef(150);
  const angleRef = useRef(INITIAL_ANGLE);
  const visibleRef = useRef(true);
  const reducedMotion = usePrefersReducedMotion();

  const basePoints = useMemo(
    () => tiltPoints(fibonacciSphere(ORBIT_TECHS.length, 1), TILT_DEG),
    []
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateRadius = () => {
      radiusRef.current = Math.min(el.clientWidth, el.clientHeight) * 0.42;
    };

    updateRadius();
    const ro = new ResizeObserver(updateRadius);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const render = (angleRad) => {
      const R = radiusRef.current;
      const cos = Math.cos(angleRad);
      const sin = Math.sin(angleRad);

      basePoints.forEach((p, i) => {
        const node = itemRefs.current[i];
        if (!node) return;

        const rx = p.x * cos + p.z * sin;
        const rz = -p.x * sin + p.z * cos;
        const ry = p.y;

        const scale = PERSPECTIVE / (PERSPECTIVE - rz * R);
        const screenX = rx * R * scale;
        const screenY = ry * R * scale;

        const depth = (rz + 1) / 2;
        const opacity = 0.35 + depth * 0.65;
        const brightness = 0.55 + depth * 0.65;

        node.style.transform = `translate3d(calc(-50% + ${screenX.toFixed(
          2
        )}px), calc(-50% + ${screenY.toFixed(2)}px), 0) scale(${scale.toFixed(
          3
        )})`;
        node.style.opacity = opacity.toFixed(2);
        node.style.filter = `brightness(${brightness.toFixed(2)})`;
        node.style.zIndex = Math.round((rz + 1) * 500);
      });
    };

    render(angleRef.current);

    if (reducedMotion) return;

    let rafId;
    let lastTime = null;

    const step = (time) => {
      if (lastTime === null) lastTime = time;
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      if (visibleRef.current && document.visibilityState === "visible") {
        angleRef.current += ((ROTATION_SPEED_DEG * Math.PI) / 180) * dt;
        render(angleRef.current);
      }
      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [basePoints, reducedMotion]);

  return (
    <div
      className={`hero-orbit${reducedMotion ? " hero-orbit--static" : ""}`}
      ref={containerRef}
      role="img"
      aria-label={`Technology stack: ${ORBIT_TECHS.map((t) => t.label).join(", ")}`}
    >
      <div className="hero-orbit-glow" aria-hidden="true" />
      {ORBIT_TECHS.map((tech, i) => {
        const Icon = tech.Icon;
        return (
          <div
            className="orbit-item"
            key={tech.id}
            ref={(node) => (itemRefs.current[i] = node)}
            aria-hidden="true"
          >
            <div
              className="orbit-item-bob"
              style={{
                animationDuration: `${3 + (i % 5) * 0.4}s`,
                animationDelay: `${(-(i * 0.37)).toFixed(2)}s`,
              }}
            >
              <motion.div
                className="orbit-item-content"
                initial="rest"
                animate="rest"
                whileHover="hover"
              >
                <motion.span
                  className="orbit-badge"
                  style={{ "--icon-color": tech.color }}
                  variants={{ rest: { scale: 1 }, hover: { scale: 1.35 } }}
                  transition={{ type: "spring", stiffness: 300, damping: 14 }}
                >
                  <Icon />
                </motion.span>
                <motion.span
                  className="orbit-label"
                  variants={{
                    rest: { opacity: 0, y: 6 },
                    hover: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.18 }}
                >
                  {tech.label}
                </motion.span>
              </motion.div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
