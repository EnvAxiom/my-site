/* =====================
   VIDEO FILES (FIXED)
   ===================== */
var bgVideoFiles = [
  "Chief Keef - _Everyday_.mp4",
  "Sosa.mp4"
];

var currentBgIdx = Math.floor(Math.random() * bgVideoFiles.length);
var bgVideo = document.getElementById("bgVideo");
var audioEl = document.getElementById("audio");
var entered = false;

function playBgVideo(filename) {
  bgVideo.src = filename;
  bgVideo.muted = true;
  bgVideo.loop = true;
  bgVideo.playsInline = true;

  bgVideo.load();

  bgVideo.play().catch(function (e) {
    console.warn("video play blocked:", e);
  });
}

/* =====================
   SPLASH SCREEN
   ===================== */
var splash = document.getElementById("splash");
var mainScene = document.getElementById("mainScene");

splash.addEventListener("click", function () {
  if (entered) return;
  entered = true;

  splash.classList.add("hidden");
  mainScene.classList.add("visible");

  playBgVideo(bgVideoFiles[currentBgIdx]);
  loadSong(true);
});

/* CHANGE VIDEO */
document.getElementById("changeVidBtn").addEventListener("click", function () {
  var next;
  do {
    next = Math.floor(Math.random() * bgVideoFiles.length);
  } while (next === currentBgIdx && bgVideoFiles.length > 1);

  currentBgIdx = next;
  playBgVideo(bgVideoFiles[currentBgIdx]);
});

/* =====================
   SIMPLE MUSIC (unchanged logic)
   ===================== */
var songs = [
  { file: "I Don't Like (Remix).mp3", label: "I Don't Like (Remix)" },
  { file: "Roddy Ricch - The Box.mp3", label: "Roddy Ricch - The Box" },
  { file: "Cartoon, Jéja - On & On.mp3", label: "Cartoon & Jéja - On & On" },
  { file: "Chief Keef - Love Sosa.mp3", label: "Chief Keef - Love Sosa" }
];

var idx = 0;
var progress = document.getElementById("progressBar");
var playPath = document.getElementById("playPath");
var volBar = document.getElementById("volumeBar");

function loadSong(autoplay) {
  audioEl.src = songs[idx].file;
  audioEl.load();

  document.getElementById("songTitle").textContent = songs[idx].label;

  if (autoplay) {
    audioEl.play().catch(() => {});
    playPath.setAttribute("d", "M6 19h4V5H6v14zm8-14v14h4V5h-4z");
  } else {
    playPath.setAttribute("d", "M8 5v14l11-7z");
  }
}

document.getElementById("playBtn").onclick = function () {
  if (audioEl.paused) {
    audioEl.play();
    playPath.setAttribute("d", "M6 19h4V5H6v14zm8-14v14h4V5h-4z");
  } else {
    audioEl.pause();
    playPath.setAttribute("d", "M8 5v14l11-7z");
  }
};
