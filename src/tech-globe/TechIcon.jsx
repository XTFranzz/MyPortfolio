import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";

function pseudoRandom(seed) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

export function TechIcon({ label, Icon, color, position, phase, occluderRef, active = true }) {
  const wrapperRef = useRef(null);
  const glowRef = useRef(null);
  const hoverRef = useRef(false);
  const glowScale = useRef(0.001);
  const [hovered, setHovered] = useState(false);

  const bobSpeed = 0.6 + 0.4 * pseudoRandom(phase);
  const bobAmplitude = 0.08 + 0.05 * pseudoRandom(phase + 1);

  useFrame((state, delta) => {
    if (!active) return;
    const t = state.clock.elapsedTime;

    if (wrapperRef.current) {
      wrapperRef.current.position.y = position.y + Math.sin(t * bobSpeed + phase) * bobAmplitude;
    }

    const targetScale = hoverRef.current ? 1 : 0.001;
    glowScale.current += (targetScale - glowScale.current) * (1 - Math.exp(-8 * delta));
    if (glowRef.current) {
      glowRef.current.scale.setScalar(glowScale.current);
    }
  });

  function handlePointerOver(e) {
    e.stopPropagation();
    hoverRef.current = true;
    setHovered(true);
    document.body.style.cursor = "pointer";
  }

  function handlePointerOut(e) {
    e.stopPropagation();
    hoverRef.current = false;
    setHovered(false);
    document.body.style.cursor = "auto";
  }

  return (
    <group position={[position.x, position.y, position.z]}>
      <group ref={wrapperRef}>
        <mesh
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <sphereGeometry args={[0.42, 12, 12]} />
          <meshBasicMaterial visible={false} />
        </mesh>

        <mesh ref={glowRef} scale={0.001}>
          <sphereGeometry args={[0.55, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={0.35} depthWrite={false} />
        </mesh>

        <Html
          center
          transform={false}
          distanceFactor={undefined}
          occlude={occluderRef ? [occluderRef] : undefined}
          zIndexRange={[10, 0]}
          style={{ pointerEvents: "none" }}
        >
          <div className="tech-icon-html">
            <motion.div
              className="tech-icon-badge"
              style={{ "--tech-color": color }}
              animate={{ scale: hovered ? 1.28 : 1 }}
              transition={{ type: "spring", stiffness: 320, damping: 22 }}
            >
              <Icon
                className={`tech-icon-glyph${hovered ? " is-hovered" : ""}`}
                style={{ color }}
              />
            </motion.div>
            <AnimatePresence>
              {hovered && (
                <motion.span
                  className="tech-icon-tooltip"
                  initial={{ opacity: 0, y: 6, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.9 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </Html>
      </group>
    </group>
  );
}
