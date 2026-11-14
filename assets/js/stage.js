// 입체 무대: 색 화면과 깊이 지도를 받아, 포인터 위치에 따라 가까운 곳을 더 많이 밀어 입체로 보이게 한다.
// 첫 화면 영상(색과 깊이가 좌우로 붙은 한 파일)과 "내 사진으로 해보기"가 같은 그리기 코드를 쓴다.
const VERT = 'attribute vec2 p; varying vec2 v; void main(){ v = p * 0.5 + 0.5; v.y = 1.0 - v.y; gl_Position = vec4(p, 0.0, 1.0); }';
const FRAG = `precision mediump float;
uniform sampler2D uTex, uDepth; uniform vec2 uShift, uScale, uPx; uniform float uPacked, uShow, uTime; varying vec2 v;
float depthAt(vec2 uv){ return uPacked > 0.5 ? texture2D(uTex, vec2(0.5 + uv.x * 0.5, uv.y)).r : texture2D(uDepth, uv).r; }
void main(){
  vec2 uv = (v - 0.5) * uScale * 0.92 + 0.5;
  vec2 q = uv + uShift * (depthAt(uv) - 0.5);
  q = clamp(uv + uShift * (depthAt(q) - 0.5), 0.003, 0.997);
  vec2 cq = uPacked > 0.5 ? vec2(q.x * 0.5, q.y) : q;
  vec3 c = texture2D(uTex, cq).rgb;
  // 확대된 화면이 뭉개져 보이지 않게 살짝 선명하게 하고, 고운 입자를 얹는다.
  vec3 around = texture2D(uTex, cq + vec2(uPx.x, 0.0)).rgb + texture2D(uTex, cq - vec2(uPx.x, 0.0)).rgb + texture2D(uTex, cq + vec2(0.0, uPx.y)).rgb + texture2D(uTex, cq - vec2(0.0, uPx.y)).rgb;
  c = clamp(c + (c * 4.0 - around) * 0.35, 0.0, 1.0);
  c += (fract(sin(dot(gl_FragCoord.xy + uTime, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.035;
  gl_FragColor = vec4(mix(c, vec3(depthAt(q)), uShow), 1.0);
}`;

const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function createStage(canvas, { packed = false, strength = 0.06, area = canvas } = {}) {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false });
  if (!gl) return null;
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = Object.fromEntries(['uTex', 'uDepth', 'uShift', 'uScale', 'uPacked', 'uShow', 'uPx', 'uTime'].map((n) => [n, gl.getUniformLocation(prog, n)]));
  const tex = (unit) => {
    const t = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, t);
    for (const [k, val] of [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]]) gl.texParameteri(gl.TEXTURE_2D, k, val);
    return t;
  };
  const tColor = tex(0), tDepth = tex(1);
  gl.uniform1i(U.uTex, 0);
  gl.uniform1i(U.uDepth, 1);
  gl.uniform1f(U.uPacked, packed ? 1 : 0);
  const put = (unit, t, src) => { gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src); };

  let color = null, live = false, mediaAspect = 1, px = [0, 0], show = 0, raf = 0, visible = true, pointerAt = 0;
  const target = [0, 0], now = [0, 0];
  const onMove = (e) => {
    const r = area.getBoundingClientRect();
    target[0] = ((e.clientX - r.left) / r.width - 0.5) * 2;
    target[1] = ((e.clientY - r.top) / r.height - 0.5) * 2;
    pointerAt = performance.now();
  };
  area.addEventListener('pointermove', onMove);

  const frame = (t) => {
    raf = 0;
    if (!visible || !color) return;
    const w = Math.round(canvas.clientWidth * Math.min(devicePixelRatio, 2)), h = Math.round(canvas.clientHeight * Math.min(devicePixelRatio, 2));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    gl.viewport(0, 0, w, h);
    if (live && color.readyState >= 2) put(0, tColor, color);
    // 포인터가 한동안 없으면(터치 기기 포함) 천천히 저절로 흔들린다.
    if (!still && t - pointerAt > 2500) { target[0] = Math.sin(t / 2300) * 0.7; target[1] = Math.cos(t / 3100) * 0.4; }
    now[0] += (target[0] - now[0]) * 0.07;
    now[1] += (target[1] - now[1]) * 0.07;
    const ca = w / h;
    gl.uniform2f(U.uScale, Math.min(1, ca / mediaAspect), Math.min(1, mediaAspect / ca));
    gl.uniform2f(U.uShift, -now[0] * strength, -now[1] * strength);
    gl.uniform1f(U.uShow, show);
    gl.uniform2f(U.uPx, px[0], px[1]);
    gl.uniform1f(U.uTime, still ? 0 : Math.floor(t / 80) % 97);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    kick();
  };
  const kick = () => { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame); };
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; kick(); }).observe(canvas);
  document.addEventListener('visibilitychange', kick);

  return {
    setVideo(video) { color = video; live = true; mediaAspect = video.videoWidth / (packed ? 2 : 1) / video.videoHeight; px = [1 / video.videoWidth, 1 / video.videoHeight]; kick(); },
    setImage(image, depth) { color = image; live = false; mediaAspect = image.width / image.height; px = [1 / image.width, 1 / image.height]; put(0, tColor, image); put(1, tDepth, depth); kick(); },
    showDepth(on) { show = on ? 1 : 0; kick(); },
  };
}

// 첫 화면: 색과 깊이가 좌우로 붙은 영상을 받아 입체로 그린다. 움직임 줄이기 설정이면 멈춘 사진을 그대로 둔다.
const heroCanvas = document.querySelector('.hero__stage canvas');
if (heroCanvas && !still) {
  const stage = createStage(heroCanvas, { packed: true, area: document.querySelector('.hero') });
  if (stage) {
    const video = Object.assign(document.createElement('video'), { muted: true, loop: true, playsInline: true, preload: 'auto', src: window.matchMedia('(max-width: 44rem)').matches ? heroCanvas.dataset.srcSmall : heroCanvas.dataset.src });
    video.addEventListener('playing', () => { stage.setVideo(video); heroCanvas.classList.add('is-on'); }, { once: true });
    video.play().catch(() => {});
  }
}

// 내 사진으로 해보기: 깊이 추정 모델을 방문자 기기에서 직접 돌린다. 사진은 어디에도 보내지 않는다.
const tryBox = document.querySelector('.try');
if (tryBox) {
  const canvas = tryBox.querySelector('canvas');
  const status = tryBox.querySelector('.try__status');
  const sample = tryBox.querySelector('.try__stage img');
  const depthBtn = tryBox.querySelector('[data-depth]');
  const say = (t) => { status.textContent = t; };
  let stage = null, pipe = null, device = '', busy = false;

  const load = async () => {
    if (pipe) return pipe;
    const { pipeline } = await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.2');
    const model = 'onnx-community/depth-anything-v2-small';
    const progress_callback = (p) => { if (p.status === 'progress' && p.file.endsWith('.onnx')) say(`AI 모델을 내려받는 중입니다. ${Math.round(p.progress)}%`); };
    if (navigator.gpu) {
      try { pipe = await pipeline('depth-estimation', model, { device: 'webgpu', dtype: 'fp16', progress_callback }); device = '그래픽카드(WebGPU)'; } catch { pipe = null; }
    }
    if (!pipe) { pipe = await pipeline('depth-estimation', model, { device: 'wasm', dtype: 'q8', progress_callback }); device = '프로세서(WebAssembly)'; }
    return pipe;
  };

  const run = async (source) => {
    if (busy) return;
    busy = true;
    tryBox.setAttribute('aria-busy', 'true');
    try {
      // 큰 사진은 긴 변 1024로 줄여서 계산한다.
      const k = Math.min(1, 1024 / Math.max(source.width, source.height));
      const input = Object.assign(document.createElement('canvas'), { width: Math.round(source.width * k), height: Math.round(source.height * k) });
      input.getContext('2d').drawImage(source, 0, 0, input.width, input.height);
      say('AI 모델을 준비하는 중입니다.');
      const estimate = await load();
      say('깊이를 계산하는 중입니다.');
      const t0 = performance.now();
      const out = await estimate(input.toDataURL('image/jpeg', 0.92));
      const sec = ((performance.now() - t0) / 1000).toFixed(1);
      stage ??= createStage(canvas, { strength: 0.08, area: canvas });
      if (!stage) throw new Error('webgl');
      canvas.style.aspectRatio = `${input.width} / ${input.height}`;
      stage.setImage(input, out.depth.toCanvas());
      canvas.classList.add('is-on');
      depthBtn.hidden = false;
      say(`이 기기의 ${device}에서 ${sec}초 만에 계산했습니다. 사진 위에서 움직여 보세요.`);
    } catch (e) {
      console.error(e);
      say('이 브라우저에서는 모델을 돌리지 못했습니다. 최신 크롬이나 엣지에서 다시 해보세요.');
    }
    busy = false;
    tryBox.removeAttribute('aria-busy');
  };

  tryBox.querySelector('[data-sample]').addEventListener('click', () => run(sample));
  tryBox.querySelector('input[type=file]').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) run(await createImageBitmap(file));
  });
  depthBtn.addEventListener('click', () => {
    const on = depthBtn.getAttribute('aria-pressed') !== 'true';
    depthBtn.setAttribute('aria-pressed', String(on));
    stage?.showDepth(on);
  });
}
