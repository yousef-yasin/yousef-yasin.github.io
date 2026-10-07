import { lazy, Suspense, useEffect, useState } from 'react';

// three.js + react-three-fiber live in a separate chunk, loaded after first
// paint and only when WebGL is available.
const Scene = lazy(() => import('./three/Scene.jsx'));

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch {
    return false;
  }
}

export default function Scene3D() {
  const [show, setShow] = useState(false);
  useEffect(() => setShow(hasWebGL()), []);

  return (
    <div className="scene-slot">
      {show && (
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      )}
    </div>
  );
}
