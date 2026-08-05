import { useMemo, useRef } from "react";
import { fibonacciSphere } from "./fibonacciSphere";
import { TechIcon } from "./TechIcon";
import { useGlobeRotation } from "./useGlobeRotation";
import { TECHS } from "./techData";

const RADIUS = 2.5;

export function Globe({ active }) {
  const groupRef = useRef(null);
  const occluderRef = useRef(null);

  const points = useMemo(() => fibonacciSphere(TECHS.length, RADIUS), []);

  useGlobeRotation(groupRef, { active });

  return (
    <group ref={groupRef}>
      <mesh ref={occluderRef} visible={false}>
        <sphereGeometry args={[RADIUS * 0.94, 24, 24]} />
        <meshBasicMaterial />
      </mesh>

      {TECHS.map((tech, i) => (
        <TechIcon
          key={tech.id}
          label={tech.label}
          Icon={tech.Icon}
          color={tech.color}
          position={points[i]}
          phase={points[i].phase}
          occluderRef={occluderRef}
          active={active}
        />
      ))}
    </group>
  );
}
