/* =====================
   DISCORD — LANYARD
   ===================== */
var DISCORD_ID = '856911460587012116';

function applyStatus(d) {
  var dot    = document.getElementById('statusDot');
  var sub    = document.getElementById('discordStatus');
  var nameEl = document.getElementById('discordName');
  var img    = document.getElementById('discordAvatar');

  if (d.discord_user) {
    var u = d.discord_user;
    nameEl.textContent = u.global_name || u.username || 'axiomkrd';
    if (u.avatar) {
      img.src = 'https://cdn.discordapp.com/avatars/' + u.id + '/' + u.avatar + '.png?size=64';
    }
  }

  var s = d.discord_status || 'offline';
  dot.className = 'status-dot ' + s;

  if (d.listening_to_spotify && d.spotify) {
    sub.textContent = 'Playing: ' + d.spotify.song + ' by ' + d.spotify.artist;
  } else if (d.activities && d.activities.length > 0) {
    var act = d.activities.find(function(a) { return a.type === 0; }) || d.activities[0];
    sub.textContent = act.name || s;
  } else {
    var labels = { online: 'Online', idle: 'Idle', dnd: 'Do Not Disturb', offline: 'Offline' };
    sub.textContent = labels[s] || 'Offline';
  }
}

fetch('https://api.lanyard.rest/v1/users/' + DISCORD_ID)
  .then(function(r) { return r.json(); })
  .then(function(j) { if (j.data) applyStatus(j.data); })
  .catch(function() {
    document.getElementById('discordStatus').textContent = 'currently doing nothing';
  });

(function connectWS() {
  var w = new WebSocket('wss://api.lanyard.rest/socket');
  var hb;
  w.onmessage = function(e) {
    var m = JSON.parse(e.data);
    if (m.op === 1) {
      w.send(JSON.stringify({ op: 2, d: { subscribe_to_id: DISCORD_ID } }));
      hb = setInterval(function() { w.send(JSON.stringify({ op: 3 })); }, m.d.heartbeat_interval);
    }
    if (m.op === 0) applyStatus(m.d);
  };
  w.onclose = function() { clearInterval(hb); setTimeout(connectWS, 3000); };
})();

/* =====================
   MUSIC PLAYER (mp3s only)
   ===================== */
var songs = [
  { file: "I Don't Like (Remix).mp3",         label: "I Don't Like (Remix)"          },
  { file: "Roddy Ricch - The Box.mp3",         label: "Roddy Ricch - The Box"         },
  { file: "Cartoon, J\u00e9ja - On & On.mp3", label: "Cartoon & J\u00e9ja - On & On" },
  { file: "Ey Reqib.mp3",                      label: "Ey Reqib"                      },
  { file: "Chief Keef - Love Sosa.mp3",        label: "Chief Keef - Love Sosa"        }
  /* Chief Keef - Everyday is a VIDEO — handled separately below */
];

var idx        = 0;
var audioEl    = document.getElementById('audio');
var progress   = document.getElementById('progressBar');
var playPath   = document.getElementById('playPath');
var volBar     = document.getElementById('volumeBar');
var PLAY       = "M8 5v14l11-7z";
var PAUSE      = "M6 19h4V5H6v14zm8-14v14h4V5h-4z";
var currentVol = 0.7;

function fmt(t) {
  if (!t || isNaN(t)) return '0:00';
  var s = Math.floor(t % 60);
  return Math.floor(t / 60) + ':' + (s < 10 ? '0' : '') + s;
}
function setProgress(v) { progress.style.setProperty('--prog', v + '%'); }
function setVolume(v)   { volBar.style.setProperty('--vol', (v * 100) + '%'); }

function loadSong(autoplay) {
  audioEl.pause();
  audioEl.src = songs[idx].file;
  audioEl.load();
  document.getElementById('songTitle').textContent = songs[idx].label;
  document.getElementById('curTime').textContent  = '0:00';
  document.getElementById('curTime2').textContent = '0:00';
  document.getElementById('durTime').textContent  = '0:00';
  document.getElementById('durTime2').textContent = '0:00';
  progress.value = 0;
  setProgress(0);
  if (autoplay) {
    audioEl.play().catch(function() {});
    playPath.setAttribute('d', PAUSE);
  } else {
    playPath.setAttribute('d', PLAY);
  }
}

audioEl.addEventListener('loadedmetadata', function() {
  var d = fmt(audioEl.duration);
  document.getElementById('durTime').textContent  = d;
  document.getElementById('durTime2').textContent = d;
});

audioEl.addEventListener('timeupdate', function() {
  var c = fmt(audioEl.currentTime);
  document.getElementById('curTime').textContent  = c;
  document.getElementById('curTime2').textContent = c;
  if (audioEl.duration) {
    var p = (audioEl.currentTime / audioEl.duration) * 100;
    progress.value = p;
    setProgress(p);
  }
});

audioEl.addEventListener('ended', function() {
  idx = (idx + 1) % songs.length;
  loadSong(true);
});

function playPause() {
  if (audioEl.paused) {
    audioEl.play().catch(function() {});
    playPath.setAttribute('d', PAUSE);
  } else {
    audioEl.pause();
    playPath.setAttribute('d', PLAY);
  }
}

document.getElementById('playBtn').addEventListener('click', playPause);
document.getElementById('nextBtn').addEventListener('click', function() {
  idx = (idx + 1) % songs.length;
  loadSong(true);
});
document.getElementById('prevBtn').addEventListener('click', function() {
  idx = (idx - 1 + songs.length) % songs.length;
  loadSong(true);
});

progress.oninput = function() {
  if (audioEl.duration) {
    audioEl.currentTime = (progress.value / 100) * audioEl.duration;
    setProgress(progress.value);
  }
};

volBar.oninput = function() {
  currentVol = parseFloat(volBar.value);
  audioEl.volume = currentVol;
  setVolume(currentVol);
};

audioEl.volume = currentVol;
setVolume(currentVol);
loadSong(false);

/* =====================
   VIDEO PLAYER (mp4)
   ===================== */
var musicPlayer = document.getElementById('musicPlayer');
var videoPlayer = document.getElementById('videoPlayer');
var videoEl     = document.getElementById('videoEl');

document.getElementById('toVideoBtn').addEventListener('click', function() {
  /* pause music */
  audioEl.pause();
  playPath.setAttribute('d', PLAY);
  /* load and show the video */
  videoEl.src = "Chief Keef - _Everyday_.mp4";
  videoEl.volume = currentVol;
  /* swap panels */
  musicPlayer.style.display = 'none';
  videoPlayer.style.display = 'block';
  videoEl.play().catch(function() {});
});

document.getElementById('toMusicBtn').addEventListener('click', function() {
  /* stop the video */
  videoEl.pause();
  videoEl.src = '';
  /* swap back */
  videoPlayer.style.display = 'none';
  musicPlayer.style.display = 'block';
});
