import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// A single sculptural object: a dark faceted crystal held inside a fine
// wireframe lattice. Slow, weighty motion that follows the pointer.
// Loaded lazily (see Scene3D.jsx) so three.js never blocks first paint.

const ACCENT = new THREE.Color('#2c46d6');
const INK = new THREE.Color('#141413');
const pointer = { x: 0, y: 0 };

function Sculpture() {
  const group = useRef();
  const crystal = useRef();

  const geo = useMemo(() => {
    const lattice = new THREE.IcosahedronGeometry(1.8, 1);
    const pos = lattice.attributes.position;
    const seen = new Map();
    for (let i = 0; i < pos.count; i++) {
      const v = new THREE.Vector3().fromBufferAttribute(pos, i);
      seen.set(`${v.x.toFixed(3)},${v.y.toFixed(3)},${v.z.toFixed(3)}`, v);
    }
    return {
      latticeEdges: new THREE.EdgesGeometry(lattice),
      nodes: new THREE.BufferGeometry().setFromPoints([...seen.values()]),
      crystalEdges: new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.08, 0)),
    };
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const g = group.current;
    g.rotation.y += (pointer.x * 0.35 + t * 0.06 - g.rotation.y) * 0.03;
    g.rotation.x += (-pointer.y * 0.2 + 0.18 - g.rotation.x) * 0.03;
    crystal.current.rotation.y -= delta * 0.12;
    crystal.current.rotation.x += delta * 0.05;
  });

  return (
    <group ref={group}>
      <mesh ref={crystal}>
        <icosahedronGeometry args={[1.08, 0]} />
        <meshPhysicalMaterial color="#e9e6de" metalness={0.08} roughness={0.3} flatShading clearcoat={1} clearcoatRoughness={0.15} />
        <lineSegments geometry={geo.crystalEdges}>
          <lineBasicMaterial color={INK} transparent opacity={0.6} />
        </lineSegments>
      </mesh>
      <lineSegments geometry={geo.latticeEdges}>
        <lineBasicMaterial color={INK} transparent opacity={0.22} />
      </lineSegments>
      <points geometry={geo.nodes}>
        <pointsMaterial color={ACCENT} size={0.06} sizeAttenuation />
      </points>
    </group>
  );
}

// Right of the text on wide screens, centred above it on narrow ones;
// eases upward and away as the page scrolls.
function Rig() {
  const { camera, size } = useThree();
  const ref = useRef();
  useFrame(() => {
    const wide = size.width > 1020;
    const scroll = Math.min(window.scrollY / window.innerHeight, 1.5);
    const g = ref.current;
    g.position.x += ((wide ? 3.0 : 0) - g.position.x) * 0.08;
    g.position.y += ((wide ? 0 : 1.1) + scroll * 1.4 - g.position.y) * 0.08;
    camera.position.x += (pointer.x * 0.4 - camera.position.x) * 0.03;
    camera.position.y += (pointer.y * 0.25 - camera.position.y) * 0.03;
    camera.position.z = (wide ? 9 : 12) + scroll * 1.5;
    camera.lookAt(0, 0, 0);
  });
  return (
    <group ref={ref}>
      <Sculpture />
    </group>
  );
}

export default function Scene() {
  const wrap = useRef();
  const [active, setActive] = useState(true);
  const reduce = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);

  useEffect(() => {
    const onMove = (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    if (!reduce) window.addEventListener('pointermove', onMove, { passive: true });
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting));
    io.observe(wrap.current);
    return () => {
      window.removeEventListener('pointermove', onMove);
      io.disconnect();
    };
  }, [reduce]);

  return (
    <div ref={wrap} className="scene" aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 9], fov: 35 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        frameloop={reduce ? 'demand' : active ? 'always' : 'never'}
      >
        <ambientLight intensity={1.1} />
        <directionalLight position={[4, 6, 5]} intensity={1.6} />
        <directionalLight position={[-5, -2, 3]} intensity={0.5} color="#c9d2ff" />
        <Rig />
      </Canvas>
    </div>
  );
}
