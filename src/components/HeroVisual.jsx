import { useEffect, useRef } from 'react';

// Ray-marched scene in raw WebGL (no 3D library): a 4x4 data matrix feeds a
// 16-9-4-1 neural lattice; a forward pass climbs the connections and lights
// the output node. The key light follows the pointer. Resolution adapts to the
// device's frame time, and rendering stops whenever the hero is off-screen or
// the tab is hidden.

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uM;

const float S=0.5;    // node spacing
const float H=0.25;   // half spacing: xz offset of every connection
const float Y0=-0.74; // input layer height
const float DY=0.49;  // layer gap

mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
float hash(vec2 p){return fract(sin(dot(p,vec2(41.3,289.1)))*43758.5453);}

float sdRBox(vec3 p,vec3 b,float r){vec3 q=abs(p)-b+r;return length(max(q,0.))+min(max(q.x,max(q.y,q.z)),0.)-r;}
float sdSeg(vec3 p,vec3 a,vec3 b,float r){vec3 pa=p-a,ba=b-a;float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.);return length(pa-ba*h)-r;}
float sdSquare(vec2 p,float w){vec2 d=abs(p)-w;return length(max(d,0.))+min(max(d.x,d.y),0.);}

// nearest node centre of an n x n layer
vec2 cellC(vec2 xz,float n){float c=(n-1.)*0.5;return (clamp(floor(xz/S+c+0.5),0.,n-1.)-c)*S;}
// 0 while tracing shadows and AO: hairlines would only add noise there
float gLines=1.;
float act(vec2 c){return 0.5+0.5*sin(uTime*0.8+hash(c)*6.283);}
// forward pass: 0..1 climbs the network once per cycle
float phase(){return fract(uTime*0.17);}

vec3 toObj(vec3 p){
  p.yz*=rot(-0.52+uM.y*0.12);
  p.xz*=rot(0.62+uTime*0.07+uM.x*0.55);
  return p;
}

// x: distance, y: material
// 0 plate, 1 data cell, 2 node, 3 output, 4 pulse, 5 graphite
vec2 map(vec3 w){
  vec3 p=toObj(w);
  vec2 res=vec2(sdRBox(p-vec3(0.,-0.9,0.),vec3(1.06,0.035,1.06),0.035),0.);

  // data matrix: 4 x 4 cells whose height is their activation. Heights
  // differ, so the 2 x 2 nearest cells are checked, not just the closest.
  vec2 fc=floor(p.xz/S+1.);
  for(int j=0;j<4;j++){
    vec2 o=vec2(mod(float(j),2.),floor(float(j)*0.5));
    vec2 cc=(clamp(fc+o,0.,3.)-1.5)*S;
    float hh=0.045+0.09*act(cc);
    float cell=sdRBox(p-vec3(cc.x,-0.865+hh,cc.y),vec3(0.17,hh,0.17),0.03);
    if(cell<res.x)res=vec2(cell,1.);
  }

  // connections between layer g and g+1; each upper node links to the
  // four diagonal nodes below it, so folding |xz| leaves one segment.
  float g=clamp(floor((p.y-Y0)/DY),0.,2.);
  float m=3.-g, c=(m-1.)*0.5;
  float yU=Y0+DY*(g+1.), yL=yU-DY;
  vec2 f=clamp(floor(p.xz/S+c),0.,m-1.);
  float tp=phase()*3.-g;
  float e=1e3, pl=1e3;
  if(gLines>0.5)for(int j=0;j<4;j++){
    vec2 o=vec2(mod(float(j),2.),floor(float(j)*0.5));
    vec2 u=(clamp(f+o,0.,m-1.)-c)*S;
    vec3 q=p-vec3(u.x,0.,u.y); q.xz=abs(q.xz);
    vec3 A=vec3(0.,yU,0.), B=vec3(H,yL,H);
    e=min(e,sdSeg(q,A,B,0.006));
    float k=tp+(hash(u+g)-0.5)*0.25;
    if(k>0.&&k<1.)pl=min(pl,length(q-mix(B,A,k))-0.024);
  }
  if(e<res.x)res=vec2(e,5.);
  if(pl<res.x)res=vec2(pl,4.);

  // nodes and layer frames
  float lk=clamp(floor((p.y-Y0)/DY+0.5),1.,3.);
  float yk=Y0+DY*lk;
  vec3 lp=p-vec3(0.,yk,0.);
  if(lk>2.5){
    float on=length(lp)-0.11;
    if(on<res.x)res=vec2(on,3.);
    float ring=length(vec2(length(lp.xz)-0.27,lp.y))-0.0045+(1.-gLines);
    if(ring<res.x)res=vec2(ring,5.);
  }else{
    float n=4.-lk;
    vec2 nc=cellC(p.xz,n);
    float node=length(lp-vec3(nc.x,0.,nc.y))-0.058;
    if(node<res.x)res=vec2(node,2.);
    float fr=length(vec2(abs(sdSquare(lp.xz,(n-1.)*H+0.2)),lp.y))-0.0045+(1.-gLines);
    if(fr<res.x)res=vec2(fr,5.);
  }
  return res;
}

vec3 nrm(vec3 p){
  vec2 e=vec2(0.0012,-0.0012);
  return normalize(e.xyy*map(p+e.xyy).x+e.yyx*map(p+e.yyx).x+e.yxy*map(p+e.yxy).x+e.xxx*map(p+e.xxx).x);
}

float shadow(vec3 ro,vec3 rd){
  float r=1.,t=0.02;
  gLines=0.;
  for(int i=0;i<18;i++){
    float h=map(ro+rd*t).x;
    r=min(r,5.*h/t);
    t+=clamp(h,0.02,0.2);
    if(r<0.01||t>2.5)break;
  }
  gLines=1.;
  return clamp(r,0.,1.);
}

float ao(vec3 p,vec3 n){
  float o=0.,s=1.;
  gLines=0.;
  for(int i=1;i<5;i++){float h=0.04*float(i);o+=(h-map(p+n*h).x)*s;s*=0.7;}
  gLines=1.;
  return clamp(1.-2.5*o,0.,1.);
}

// Studio environment: warm paper floor, soft sky, two long softboxes.
vec3 env(vec3 r){
  vec3 c=mix(vec3(0.86,0.83,0.77),vec3(0.99,0.985,0.97),smoothstep(-0.4,0.5,r.y));
  c+=vec3(1.,0.97,0.92)*0.9*smoothstep(0.82,0.98,dot(r,normalize(vec3(-0.5,0.7,0.5))));
  c+=vec3(0.85,0.9,1.)*0.35*smoothstep(0.9,0.99,dot(r,normalize(vec3(0.9,0.1,0.4))));
  return c;
}

vec3 shade(vec3 p,vec3 rd,float mat){
  vec3 n=nrm(p);
  vec3 L=normalize(vec3(-0.55+uM.x*0.5,0.85-uM.y*0.3,0.55));
  vec3 blue=vec3(0.13,0.21,0.74);
  vec3 base=vec3(0.955,0.945,0.92);
  float gloss=0.35;
  vec3 glow=vec3(0.);
  float ph=phase();
  if(mat<0.5){base=vec3(0.93,0.92,0.89);gloss=0.2;}
  else if(mat<1.5){
    // the most active data cells light up blue on top
    vec2 cc=cellC(toObj(p).xz,4.);
    float a=smoothstep(0.62,0.95,act(cc))*smoothstep(0.5,0.9,(toObj(n)).y);
    base=mix(base,blue,a*0.85);gloss=mix(0.3,0.8,a);
  }
  else if(mat<2.5){gloss=0.85;}
  else if(mat<3.5){base=blue;gloss=1.;glow=blue*1.6*exp(-ph*9.);}
  else if(mat<4.5){base=blue;gloss=1.;glow=blue*0.9+0.08;}
  else{base=vec3(0.3,0.31,0.34);gloss=0.6;}

  float sh=dot(n,L)>-0.1?shadow(p+n*0.015,L):0.;
  float oc=ao(p,n);
  float wrap=clamp((dot(n,L)+0.35)/1.35,0.,1.);
  float fill=clamp(dot(n,normalize(vec3(0.8,-0.2,0.5)))*0.5+0.5,0.,1.);
  float fr=pow(1.-clamp(dot(n,-rd),0.,1.),4.);

  vec3 col=base*(vec3(1.,0.96,0.9)*wrap*mix(0.45,1.,sh)*0.95+vec3(0.78,0.83,0.95)*fill*0.3+0.24)*oc;
  vec3 hv=normalize(L-rd);
  col+=vec3(1.,0.97,0.92)*pow(clamp(dot(n,hv),0.,1.),mix(24.,140.,gloss))*sh*mix(0.25,0.9,gloss);
  col=mix(col,env(reflect(rd,n))*oc,fr*mix(0.3,0.7,gloss));
  return col+glow;
}

void main(){
  vec2 uv=(gl_FragCoord.xy-0.5*uRes)/uRes.y;
  vec3 ro=vec3(0.,0.,7.);
  vec3 rd=normalize(vec3(uv,-1.75));
  float px=1.75/uRes.y;

  // bounding sphere
  float b=dot(ro,rd),c=dot(ro,ro)-3.4;
  float disc=b*b-c;
  if(disc<0.){gl_FragColor=vec4(0.);return;}
  float t=-b-sqrt(disc),tEnd=-b+sqrt(disc);

  vec2 h;float md=1e3,mt=t;bool hit=false;
  for(int i=0;i<96;i++){
    h=map(ro+rd*t);
    if(h.x<md){md=h.x;mt=t;}
    if(h.x<0.0007*t){hit=true;break;}
    t+=h.x*0.9;
    if(t>tEnd)break;
  }
  float a=1.;
  if(!hit){
    a=1.-smoothstep(0.,px*mt*0.9,md);
    if(a<=0.){gl_FragColor=vec4(0.);return;}
    t=mt;h=map(ro+rd*t);
  }
  vec3 col=shade(ro+rd*t,rd,h.y);
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
