autowatch = 1;
inlets = 1;
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
  major:      [0, 4, 7],
  minor:      [0, 3, 7],
  diminished: [0, 3, 6],
  augmented:  [0, 4, 8],
  sus2:       [0, 2, 7],
  sus4:       [0, 5, 7],
  maj7:       [0, 4, 7, 11],
  min7:       [0, 3, 7, 10],
  dom7:       [0, 4, 7, 10],
  dim7:       [0, 3, 6, 9],
a_b: 			[0, 1, 2],
  a_c:			[0, 1, 3],
  a_d: 			[0, 1, 4],
  a_e: 			[0, 1, 5],
  a_f: 			[0, 1, 6],
  b_d:			[0, 2, 4],
  b_e: 			[0, 2, 5],
  b_f: 			[0, 2, 6],
  b_g: 			[0, 2, 7],
  c_f:			[0, 3, 6],
  c_g:			[0, 3, 7],
  d_h:			[0, 4, 8],
  a_b_c:	    [0, 1, 2, 3],
  a_b_d:		[0, 1, 2, 4],
  a_b_e:		[0, 1, 2, 5],
  a_b_f:		[0, 1, 2, 6],
  a_b_g:		[0, 1, 2, 7],
  a_c_d:		[0, 1, 3, 4],
  a_c_e:		[0, 1, 3, 5],
  a_c_f:		[0, 1, 3, 6],
  a_c_g:		[0, 1, 3, 7],
  a_d_e:		[0, 1, 4, 5],
  a_d_f:		[0, 1, 4, 6],
  a_d_g:		[0, 1, 4, 7],
  a_d_h:		[0, 1, 4, 8],
  a_e_f:		[0, 1, 5, 6],
  a_e_g:		[0, 1, 5, 7],
  a_e_h:		[0, 1, 5, 8],
  a_f_g:		[0, 1, 6, 7],
  b_c_e:		[0, 2, 3, 5],
  b_c_g:		[0, 2, 3, 7],
  b_d_f:		[0, 2, 4, 6],
  b_d_g:		[0, 2, 4, 7],
  b_d_h:		[0, 2, 4, 8],
  b_e_g:		[0, 2, 5, 7],
  b_e_h:		[0, 2, 5, 8],
  b_f_h:		[0, 2, 6, 8],
  c_d_g:		[0, 3, 4, 7],
  c_e_h:		[0, 3, 5, 8],
  c_f_i:		[0, 3, 6, 9]
};

// ---------- Setters ----------
function msg_int(n) {
  root = clamp(parseInt(n, 10), 0, 127);
}

function setchord(name) {
  if (chord_library[name]) {
    chord_type = name;
    use_random_chord = false;
  } else {
    post("Unknown chord type: " + name + "\n");
  }
}

function setrandom(n) {
  use_random_chord = (parseInt(n, 10) !== 0);
}

function setvoices(n) {
  num_notes = clamp(parseInt(n, 10), 1, 12);
  // keep inversion in range after voices change
  inversion = clamp(inversion, 0, num_notes - 1);
}

function setinv(n) {
  inversion = clamp(parseInt(n, 10), 0, Math.max(0, num_notes - 1));
}

function setvel(min, max) {
  min = clamp(parseInt(min, 10), 1, 127);
  max = clamp(parseInt(max, 10), 1, 127);
  velocity_min = Math.min(min, max);
  velocity_max = Math.max(min, max);
}

function setdur(min, max) {
  min = Math.max(1, parseInt(min, 10));
  max = Math.max(1, parseInt(max, 10));
  duration_min = Math.min(min, max);
  duration_max = Math.max(min, max);
}

// ---------- Helpers ----------
function clamp(value, min, max) {
  if (isNaN(value)) value = min;
  return Math.min(Math.max(value, min), max);
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Safer than Object.keys for old engines
function choose_random_chord() {
  var keys = [];
  for (var k in chord_library) {
    if (chord_library.hasOwnProperty(k)) keys.push(k);
  }
  var i = Math.floor(Math.random() * keys.length);
  return keys[i];
}

// ---------- Main ----------
function bang() {
  var current_chord = chord_type;
  if (use_random_chord) current_chord = choose_random_chord();

  var structure = chord_library[current_chord];
  if (!structure) return;

  var chord = [];

  // Fill chord with repeated structure across octaves as needed
  for (var i = 0; i < num_notes; i++) {
    var interval = structure[i % structure.length];
    var octave_offset = 12 * Math.floor(i / structure.length);
    chord.push(interval + octave_offset);
  }

  // Apply inversions (move lowest up an octave)
  for (var inv = 0; inv < inversion; inv++) {
    var note = chord.shift();
    chord.push(note + 12);
  }

  // Random octave spread (0 or +12)
  for (var j = 0; j < chord.length; j++) {
    var spread = 12 * Math.floor(Math.random() * 2);
    chord[j] += spread;
  }

  // Output each note as ["note", pitch, vel, dur]
  for (var n = 0; n < chord.length; n++) {
    var pitch = clamp(root + chord[n], 0, 127);
    var vel = randInt(velocity_min, velocity_max);
    var dur = randInt(duration_min, duration_max);
    outlet(0, [pitch, vel, dur]);
  }
}
