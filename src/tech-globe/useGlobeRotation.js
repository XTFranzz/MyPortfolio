import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";

const AUTO_ROTATE_SPEED = 0.12; // rad/s
const ATTRACT_K = 2.0; // rate at which velocity eases back to AUTO_ROTATE_SPEED
const DRAG_TO_RAD = 0.008; // px -> rad while dragging
const TILT_DRAG_TO_RAD = 0.006;
const TILT_LIMIT = Math.PI / 9; // ~20deg
const TILT_SPRING_K = 4.0;

export function useGlobeRotation(groupRef, { active = true } = {}) {
  const { gl } = useThree();

  const velocityY = useRef(AUTO_ROTATE_SPEED);
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0, t: 0 });

  useEffect(() => {
    const el = gl.domElement;
    el.style.touchAction = "none";

    function onPointerDown(e) {
      isDragging.current = true;
      lastPos.current = { x: e.clientX, y: e.clientY, t: performance.now() };
      el.setPointerCapture(e.pointerId);
    }

    function onPointerMove(e) {
      if (!isDragging.current || !groupRef.current) return;
      const now = performance.now();
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      const dt = Math.max((now - lastPos.current.t) / 1000, 1 / 120);

      const dRotY = dx * DRAG_TO_RAD;
      groupRef.current.rotation.y += dRotY;

      const nextTiltX = groupRef.current.rotation.x + dy * TILT_DRAG_TO_RAD;
      groupRef.current.rotation.x = Math.max(-TILT_LIMIT, Math.min(TILT_LIMIT, nextTiltX));

      const instVel = dRotY / dt;
      velocityY.current += (instVel - velocityY.current) * 0.25;

      lastPos.current = { x: e.clientX, y: e.clientY, t: now };
    }

    function onPointerUp(e) {
      isDragging.current = false;
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        /* pointer capture may already be released */
      }
    }

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointerleave", onPointerUp);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointerleave", onPointerUp);
    };
  }, [gl, groupRef]);

  useFrame((_, delta) => {
    if (!active || !groupRef.current) return;

    if (!isDragging.current) {
      velocityY.current += (AUTO_ROTATE_SPEED - velocityY.current) * (1 - Math.exp(-ATTRACT_K * delta));
      groupRef.current.rotation.y += velocityY.current * delta;

      groupRef.current.rotation.x += (0 - groupRef.current.rotation.x) * (1 - Math.exp(-TILT_SPRING_K * delta));
    }
  });
}
