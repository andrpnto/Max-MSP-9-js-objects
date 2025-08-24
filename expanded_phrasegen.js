// Expanded phrase generator with:
// - Rhythm variation
// - Polyphonic output
// - UI control via inlets
// - Optional jsui visual support (requires jsui setup separately)

outlets = 2; // outlet 0: notes, outlet 1: visualization (jsui or print)

var scale = [0, 2, 4, 5, 7, 9, 11];
var root = 60;
var sequence = [];
var index = 0;
var transpose_amt = 0;
var num_voices = 2;
var rhythm_patterns = [125, 250, 375, 500];
var density = 0.9; // probability of note per voice per step

function bang() {
  if (sequence.length === 0) generate_polyphonic(8);

  var step = sequence[index % sequence.length];
  for (let v = 0; v < step.length; v++) {
    let note = step[v];
    if (Math.random() < density) {
      let pitch = note.pitch + transpose_amt;
      outlet(0, ["note", pitch, note.velocity, note.dur]);
    }
  }
  outlet(1, JSON.stringify(step)); // for jsui or print visual
  index++;
}

function generate_polyphonic(len) {
  sequence = [];
  for (let i = 0; i < len; i++) {
    let chord = [];
    for (let v = 0; v < num_voices; v++) {
      let step = scale[Math.floor(Math.random() * scale.length)];
      let octave = 12 * Math.floor(Math.random() * 2);
      let pitch = root + step + octave;
      let dur = rhythm_patterns[Math.floor(Math.random() * rhythm_patterns.length)];
      chord.push({ pitch: pitch, velocity: 100, dur: dur });
    }
    sequence.push(chord);
  }
  index = 0;
}

// --- Control functions from UI ---
function setvoices(n) {
  num_voices = Math.max(1, parseInt(n));
}

function setroot(n) {
  root = parseInt(n);
}

function setdensity(f) {
  density = Math.min(1.0, Math.max(0.0, parseFloat(f)));
}

function setscale() {
  scale = arrayfromargs(arguments);
}

function reset() {
  index = 0;
}

function transpose(n) {
  transpose_amt = parseInt(n);
}

function anything() {
  let args = arrayfromargs(messagename, arguments);
  if (args[0] === "generate") generate_polyphonic(parseInt(args[1]) || 8);
}
