import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Globe } from "./Globe";
import { TECHS } from "./techData";
import "./tech-globe.css";

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

function useOnScreen(ref) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.05,
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);

  return visible;
}

function StaticFallback() {
  return (
    <div className="tech-globe-fallback">
      {TECHS.map(({ id, label, Icon, color }) => (
        <div key={id} className="tech-globe-fallback-item" title={label}>
          <Icon style={{ color }} />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

export function TechGlobeApp() {
  const containerRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();
  const onScreen = useOnScreen(containerRef);

  if (reducedMotion) {
    return (
      <div ref={containerRef} className="tech-globe-container">
        <StaticFallback />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="tech-globe-container">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 6.5], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.8} />
        <pointLight position={[5, 5, 5]} intensity={0.5} />
        <Globe active={onScreen} />
      </Canvas>
    </div>
  );
}
