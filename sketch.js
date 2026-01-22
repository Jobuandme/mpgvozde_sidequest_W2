// Base Blob
let blob = {
  x: 240,
  y: 160,

  r: 40,          // Base radius
  points: 48,     // Smooth circle resolution

  wobble: 8,
  wobbleFreq: 0.8,

  t: 0,
  tSpeed: 0.01,

  // Pulsing
  pulsing: false,
  pulseT: 0,
  pulseDur: 0.5,
  pulseGap: 180,
  frameLast: 0,

  // color changing
  colorT: 0,
  colorSpeed: 0.005,
};

let pulseBtn;

function setup() {
  createCanvas(480, 320);
  noStroke();
  textFont("sans-serif");
  textSize(14);

  pulseBtn = createButton("Make it angry");
  pulseBtn.position(10, height + 10);
  pulseBtn.mousePressed(triggerPulse);
}

// Manually start a pulse
function triggerPulse() {
  blob.pulsing = true;
  blob.pulseT = 0;
}

function draw() {
  background(240);

  // noise time
  blob.t += blob.tSpeed;

  // Auto pulse every few seconds
  if (!blob.pulsing && frameCount - blob.frameLast > blob.pulseGap) {
    triggerPulse();
  }

  let p = 0;
  if (blob.pulsing) {
    blob.pulseT += deltaTime / 1000;
    p = constrain(blob.pulseT / blob.pulseDur, 0, 1);

    if (p >= 1) {
      blob.pulsing = false;
      blob.frameLast = frameCount;
    }
  }

  let pulseAmt = sin(p * PI);

  let pts = floor(lerp(blob.points, 11, pulseAmt));

  let wob = lerp(blob.wobble, 46, pulseAmt);

  let freq = lerp(blob.wobbleFreq, 5.0, pulseAmt);

  let baseR = lerp(blob.r, 75, pulseAmt);

  blob.colorT += blob.colorSpeed;
  let idleAmt = (sin(blob.colorT) + 1) * 0.5;

  let idleCol = lerpColor(
    color(120, 0, 0),
    color(220, 0, 0),
    idleAmt
  );

  // Bright flash colour for pulse
  let pulseCol = color(255, 70, 70);

  let col = lerpColor(idleCol, pulseCol, pulseAmt);

  fill(col);
  beginShape();

  for (let i = 0; i < pts; i++) {
    const a = (i / pts) * TAU;

    const n = noise(
      cos(a) * freq + 100,
      sin(a) * freq + 100,
      blob.t
    );

    const r = baseR + map(n, 0, 1, -wob, wob);

    vertex(
      blob.x + cos(a) * r,
      blob.y + sin(a) * r
    );
  }

  endShape(CLOSE);

  fill(0);
  text(
    "Very angry blob, but it's doing its best to not show it",
    10,
    18
  );
}
