function bang() {
  var pitch = Math.floor(Math.random() * 36) + 48;       // Range: 48–83
  var velocity = Math.floor(Math.random() * 60) + 60;    // Range: 60–119
  var duration = Math.floor(Math.random() * 400) + 100;  // Range: 100–499 ms

  outlet(0, ["note", pitch, velocity, duration]);
}