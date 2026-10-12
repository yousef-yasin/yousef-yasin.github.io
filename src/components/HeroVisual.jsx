import { useEffect, useRef } from 'react';

// Ray-marched sculpture in raw WebGL (no 3D library): a twisted ceramic ribbon
// whose hidden face is ink-blue, crossed by a graphite orbit and a single bead.
// The key light follows the pointer. Resolution adapts to the device's frame
// time, and rendering stops whenever the hero is off-screen or the tab is hidden.

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uM;

mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}

float sdRect(vec2 p,vec2 b,float r){vec2 d=abs(p)-b+r;return length(max(d,0.))+min(max(d.x,d.y),0.)-r;}

vec3 toObj(vec3 p){
  p.yz*=rot(0.55+uM.y*0.35);
  p.xy*=rot(-0.28);
  p.xz*=rot(uTime*0.11+uM.x*0.7);
  return p;
}

// x: distance, y: material (0 ribbon, 1 orbit, 2 bead), z: ribbon face (-1..1)
vec3 map(vec3 w){
  vec3 p=toObj(w);
  float a=atan(p.z,p.x);
  vec2 q=vec2(length(p.xz)-1.0,p.y);
  q*=rot(a*1.5+uTime*0.22);
  float wd=0.34+0.07*sin(a*2.+uTime*0.5);
  float rib=sdRect(q,vec2(wd,0.07),0.065)*0.62;
  vec3 res=vec3(rib,0.,q.y);

  vec3 o=p; o.xy*=rot(1.05); o.yz*=rot(0.35);
  float ring=length(vec2(length(o.xz)-1.42,o.y))-0.014;
  if(ring<res.x)res=vec3(ring,1.,0.);
  float t=uTime*0.42;
  float bead=length(o-vec3(cos(t)*1.42,0.,sin(t)*1.42))-0.062;
  if(bead<res.x)res=vec3(bead,2.,0.);
  return res;
}

vec3 nrm(vec3 p){
  vec2 e=vec2(0.0015,-0.0015);
  return normalize(e.xyy*map(p+e.xyy).x+e.yyx*map(p+e.yyx).x+e.yxy*map(p+e.yxy).x+e.xxx*map(p+e.xxx).x);
}

float shadow(vec3 ro,vec3 rd){
  float r=1.,t=0.03;
  for(int i=0;i<22;i++){
    float h=map(ro+rd*t).x;
    r=min(r,9.*h/t);
    t+=clamp(h,0.025,0.25);
    if(r<0.01||t>3.)break;
  }
  return clamp(r,0.,1.);
}

float ao(vec3 p,vec3 n){
  float o=0.,s=1.;
  for(int i=1;i<5;i++){float h=0.05*float(i);o+=(h-map(p+n*h).x)*s;s*=0.7;}
  return clamp(1.-2.2*o,0.,1.);
}

// Studio environment: warm paper floor, soft sky, two long softboxes.
vec3 env(vec3 r){
  vec3 c=mix(vec3(0.86,0.83,0.77),vec3(0.99,0.985,0.97),smoothstep(-0.4,0.5,r.y));
  c+=vec3(1.,0.97,0.92)*0.9*smoothstep(0.82,0.98,dot(r,normalize(vec3(-0.5,0.7,0.5))));
  c+=vec3(0.85,0.9,1.)*0.35*smoothstep(0.9,0.99,dot(r,normalize(vec3(0.9,0.1,0.4))));
  return c;
}

vec3 shade(vec3 p,vec3 rd,vec3 h){
  vec3 n=nrm(p);
  vec3 L=normalize(vec3(-0.55+uM.x*0.5,0.85-uM.y*0.3,0.55));
  float face=smoothstep(-0.03,0.03,h.z);
  vec3 base=vec3(0.955,0.945,0.92);
  float gloss=0.35;
  if(h.y<0.5){base=mix(vec3(0.13,0.21,0.74),base,face);gloss=mix(0.85,0.35,face);}
  else if(h.y<1.5){base=vec3(0.09,0.09,0.1);gloss=1.;}
  else{base=vec3(0.13,0.21,0.74);gloss=1.;}

  float sh=shadow(p+n*0.004,L);
  float oc=ao(p,n);
  float wrap=clamp((dot(n,L)+0.35)/1.35,0.,1.);
  float fill=clamp(dot(n,normalize(vec3(0.8,-0.2,0.5)))*0.5+0.5,0.,1.);
  float fr=pow(1.-clamp(dot(n,-rd),0.,1.),4.);

  vec3 col=base*(vec3(1.,0.96,0.9)*wrap*mix(0.45,1.,sh)*0.95+vec3(0.78,0.83,0.95)*fill*0.3+0.24)*oc;
  // subsurface hint on the ceramic face
  col+=base*vec3(1.,0.85,0.7)*0.08*pow(clamp(1.-dot(n,-rd),0.,1.),2.)*face;
  vec3 hv=normalize(L-rd);
  col+=vec3(1.,0.97,0.92)*pow(clamp(dot(n,hv),0.,1.),mix(24.,140.,gloss))*sh*mix(0.25,0.9,gloss);
  col=mix(col,env(reflect(rd,n))*oc,fr*mix(0.35,0.75,gloss));
  return col;
}

void main(){
  vec2 uv=(gl_FragCoord.xy-0.5*uRes)/uRes.y;
  vec3 ro=vec3(0.,0.,6.4);
  vec3 rd=normalize(vec3(uv,-1.75));
  float px=1.75/uRes.y;

  // bounding sphere
  float b=dot(ro,rd),c=dot(ro,ro)-2.75;
  float disc=b*b-c;
  if(disc<0.){gl_FragColor=vec4(0.);return;}
  float t=-b-sqrt(disc),tEnd=-b+sqrt(disc);

  vec3 h;float md=1e3,mt=t;bool hit=false;
  for(int i=0;i<84;i++){
    h=map(ro+rd*t);
    if(h.x<md){md=h.x;mt=t;}
    if(h.x<0.0008*t){hit=true;break;}
    t+=h.x;
    if(t>tEnd)break;
  }
  float a=1.;
  if(!hit){
    a=1.-smoothstep(0.,px*mt*0.8,md);
    if(a<=0.){gl_FragColor=vec4(0.);return;}
    t=mt;h=map(ro+rd*t);
  }
  vec3 col=shade(ro+rd*t,rd,h);
  col=pow(col,vec3(0.94));
  gl_FragColor=vec4(col*a,a);
}`;

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
}

export default function HeroVisual() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, powerPreference: 'high-performance' });
    if (!gl) { wrap.classList.add('is-static'); return; }

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram();
    if (!vs || !fs) { wrap.classList.add('is-static'); return; }
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { wrap.classList.add('is-static'); return; }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(prog, 'uRes');
    const uTime = gl.getUniformLocation(prog, 'uTime');
    const uM = gl.getUniformLocation(prog, 'uM');

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(pointer: fine)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    // Small canvases are cheap, so they render at full density to stay crisp.
    let scale = canvas.clientWidth < 480 ? dpr : dpr * (fine ? 0.9 : 0.75);
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(r.width * scale));
      canvas.height = Math.max(1, Math.round(r.height * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    resize();

    const target = { x: 0, y: 0 };
    const m = { x: 0, y: 0 };
    const onMove = (e) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    let raf = 0;
    let visible = true;
    let last = performance.now();
    let time = 4;
    let slow = 0;
    let frames = 0;

    const draw = () => {
      gl.uniform1f(uTime, time);
      gl.uniform2f(uM, m.x, m.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = (now) => {
      const dt = Math.min(now - last, 100);
      last = now;
      time += dt / 1000;
      m.x += (target.x - m.x) * 0.06;
      m.y += (target.y - m.y) * 0.06;
      draw();
      // Step resolution down if the device can't hold ~50fps.
      if (++frames > 10) {
        slow = dt > 21 ? slow + 1 : Math.max(0, slow - 1);
        if (slow > 20 && scale > 0.45) { scale *= 0.8; slow = 0; resize(); }
      }
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (raf || reduce || !visible || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      visible ? start() : stop();
    });
    io.observe(wrap);
    const onVis = () => (document.hidden ? stop() : start());
    const onResize = () => { resize(); if (!raf) draw(); };

    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('resize', onResize);
    if (fine && !reduce) window.addEventListener('pointermove', onMove, { passive: true });

    draw();
    wrap.classList.add('is-ready');
    start();

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <div ref={wrapRef} className="hero-visual" aria-hidden="true">
      <div className="hv-floor" />
      <canvas ref={canvasRef} className="hv-canvas" />
    </div>
  );
}
