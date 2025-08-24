outlets = 1;

var root = 60;
var chord_type = "major";
var num_notes = 3;
var inversion = 0;
var use_random_chord = false;

var velocity_min = 70;
var velocity_max = 110;
var duration_min = 100;
var duration_max = 400;

var chord_library = {
  major:     [0, 4, 7],
  minor:     [0, 3, 7],
  diminished:[0, 3, 6],
  augmented: [0, 4, 8],
  sus2:      [0, 2, 7],
  sus4:      [0, 5, 7],
  maj7:      [0, 4, 7, 11],
  min7:      [0, 3, 7, 10],
  dom7:      [0, 4, 7, 10],
  dim7:      [0, 3, 6, 9]
};

// Root note
function msg_int(n) {
  root = clamp(parseInt(n), 0, 127);
}

// Chord type
function setchord(name) {
  if (chord_library[name]) {
    chord_type = name;
    use_random_chord = false;
  } else {
    post("Unknown chord type: " + name + "\n");
  }
}

// Random chord toggle
function setrandom(n) {
  use_random_chord = (parseInt(n) !== 0);
}

// Number of notes
function setvoices(n) {
  num_notes = clamp(parseInt(n), 1, 12);
}

// Inversions
function setinv(n) {
  inversion = clamp(parseInt(n), 0, num_notes - 1);
}

// Velocity range
function setvel(min, max) {
  velocity_min = clamp(parseInt(min), 1, 127);
  velocity_max = clamp(parseInt(max), velocity_min, 127);
}

// Duration range
function setdur(min, max) {
  duration_min = Math.max(1, parseInt(min));
  duration_max = Math.max(duration_min, parseInt(max));
}

// Pick random chord
function choose_random_chord() {
  let keys = Object.keys(chord_library);
  let i = Math.floor(Math.random() * keys.length);
  return keys[i];
}

// Play chord
function bang() {
  let current_chord = chord_type;
  if (use_random_chord) {
    current_chord = choose_random_chord();
  }

  let structure = chord_library[current_chord];
  if (!structure) return;

  let chord = [];

  // Fill chord
  for (let i = 0; i < num_notes; i++) {
    let interval = structure[i % structure.length];
    let octave_offset = 12 * Math.floor(i / structure.length);
    chord.push(interval + octave_offset);
  }

  // Inversions
  for (let i = 0; i < inversion; i++) {
    let note = chord.shift();
    chord.push(note + 12);
  }

  // Random octave spread
  for (let i = 0; i < chord.length; i++) {
    let spread = 12 * Math.floor(Math.random() * 2); // 0 or +12
    chord[i] += spread;
  }

  // Output
  for (let i = 0; i < chord.length; i++) {
    let pitch = clamp(root + chord[i], 0, 127);
    let vel = randInt(velocity_min, velocity_max);
    let dur = randInt(duration_min, duration_max);
    outlet(0, ["note", pitch, vel, dur]);
  }
}

// Helpers
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
