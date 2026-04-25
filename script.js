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
   MUSIC PLAYER
   ===================== */
var songs = [
  { file: "I Don't Like (Remix).mp3",         label: "I Don't Like (Remix)"          },
  { file: "Roddy Ricch - The Box.mp3",         label: "Roddy Ricch - The Box"         },
  { file: "Cartoon, J\u00e9ja - On & On.mp3", label: "Cartoon & J\u00e9ja - On & On" },
  { file: "Ey Reqib.mp3",                      label: "Ey Reqib"                      },
  { file: "Chief Keef - Love Sosa.mp3",        label: "Chief Keef - Love Sosa"        },
  { file: "Chief Keef - _Everyday_.mp4",       label: "Chief Keef - Everyday"         }
];

var idx        = 0;
var progress   = document.getElementById('progressBar');
var playPath   = document.getElementById('playPath');
var volBar     = document.getElementById('volumeBar');
var PLAY       = "M8 5v14l11-7z";
var PAUSE      = "M6 19h4V5H6v14zm8-14v14h4V5h-4z";
var currentVol = 0.7;

/* Both elements are declared in index.html */
var audioEl = document.getElementById('audio');
var videoEl = document.getElementById('video');

function isMP4() { return songs[idx].file.slice(-4).toLowerCase() === '.mp4'; }
function activeEl() { return isMP4() ? videoEl : audioEl; }

function fmt(t) {
  if (!t || isNaN(t)) return '0:00';
  var s = Math.floor(t % 60);
  return Math.floor(t / 60) + ':' + (s < 10 ? '0' : '') + s;
}
function setProgress(v) { progress.style.setProperty('--prog', v + '%'); }
function setVolume(v)   { volBar.style.setProperty('--vol', (v * 100) + '%'); }

function resetDisplay() {
  document.getElementById('curTime').textContent  = '0:00';
  document.getElementById('curTime2').textContent = '0:00';
  document.getElementById('durTime').textContent  = '0:00';
  document.getElementById('durTime2').textContent = '0:00';
  progress.value = 0;
  setProgress(0);
}

function stopAll() {
  audioEl.pause();
  audioEl.removeAttribute('src');
  audioEl.load();
  videoEl.pause();
  videoEl.removeAttribute('src');
  videoEl.load();
  resetDisplay();
}

function loadSong(autoplay) {
  stopAll();
  var song = songs[idx];
  document.getElementById('songTitle').textContent = song.label;
  var el = activeEl();
  el.volume = currentVol;
  el.src = song.file;
  el.load();
  if (autoplay) {
    setTimeout(function() {
      el.play().catch(function(err) { console.warn('play blocked:', err); });
    }, 80);
    playPath.setAttribute('d', PAUSE);
  } else {
    playPath.setAttribute('d', PLAY);
  }
}

[audioEl, videoEl].forEach(function(el) {
  el.addEventListener('loadedmetadata', function() {
    if (el !== activeEl()) return;
    var d = fmt(el.duration);
    document.getElementById('durTime').textContent  = d;
    document.getElementById('durTime2').textContent = d;
  });

  el.addEventListener('timeupdate', function() {
    if (el !== activeEl()) return;
    var c = fmt(el.currentTime);
    document.getElementById('curTime').textContent  = c;
    document.getElementById('curTime2').textContent = c;
    if (el.duration) {
      var p = (el.currentTime / el.duration) * 100;
      progress.value = p;
      setProgress(p);
    }
  });

  el.addEventListener('ended', nextSong);
});

function playPause() {
  var el = activeEl();
  if (el.paused) {
    el.play().catch(function() {});
    playPath.setAttribute('d', PAUSE);
  } else {
    el.pause();
    playPath.setAttribute('d', PLAY);
  }
}

function nextSong() {
  idx = (idx + 1) % songs.length;
  loadSong(true);
}

function prevSong() {
  idx = (idx - 1 + songs.length) % songs.length;
  loadSong(true);
}

document.getElementById('playBtn').addEventListener('click', playPause);
document.getElementById('nextBtn').addEventListener('click', nextSong);
document.getElementById('prevBtn').addEventListener('click', prevSong);

progress.oninput = function() {
  var el = activeEl();
  if (el.duration) {
    el.currentTime = (progress.value / 100) * el.duration;
    setProgress(progress.value);
  }
};

volBar.oninput = function() {
  currentVol = parseFloat(volBar.value);
  audioEl.volume = currentVol;
  videoEl.volume = currentVol;
  setVolume(currentVol);
};

audioEl.volume = currentVol;
videoEl.volume = currentVol;
setVolume(currentVol);
loadSong(false);

document.body.addEventListener('click', function() {
  var el = activeEl();
  if (el.paused) {
    el.play().catch(function() {});
    playPath.setAttribute('d', PAUSE);
  }
}, { once: true });
