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

/* REST fetch on load */
fetch('https://api.lanyard.rest/v1/users/' + DISCORD_ID)
  .then(function(r) { return r.json(); })
  .then(function(j) { if (j.data) applyStatus(j.data); })
  .catch(function() {
    document.getElementById('discordStatus').textContent = 'currently doing nothing';
  });

/* WebSocket for live updates */
(function connectWS() {
  var w = new WebSocket('wss://api.lanyard.rest/socket');
  var hb;

  w.onmessage = function(e) {
    var m = JSON.parse(e.data);
    if (m.op === 1) {
      w.send(JSON.stringify({ op: 2, d: { subscribe_to_id: DISCORD_ID } }));
      hb = setInterval(function() {
        w.send(JSON.stringify({ op: 3 }));
      }, m.d.heartbeat_interval);
    }
    if (m.op === 0) applyStatus(m.d);
  };

  w.onclose = function() {
    clearInterval(hb);
    setTimeout(connectWS, 3000);
  };
})();

/* =====================
   MUSIC PLAYER
   ===================== */
var songs = [
  { file: "I Don't Like (Remix).mp3",    label: "I Don't Like (Remix)"     },
  { file: "Roddy Ricch - The Box.mp3",   label: "Roddy Ricch - The Box"    },
  { file: "Cartoon, Jeja - On & On.mp3", label: "Cartoon & Jeja - On & On" },
  { file: "Ey Reqib.mp3",                label: "Ey Reqib"                 },
  { file: "Chief Keef - Love Sosa.mp3",  label: "Chief Keef - Love Sosa"   },
  { file: "Chief Keef - _Everyday_.mp4", label: "Chief Keef - Everyday"    }
];

var idx      = 0;
var audio    = document.getElementById('audio');
var progress = document.getElementById('progressBar');
var playPath = document.getElementById('playPath');
var volBar   = document.getElementById('volumeBar');
var PLAY     = "M8 5v14l11-7z";
var PAUSE    = "M6 19h4V5H6v14zm8-14v14h4V5h-4z";

function fmt(t) {
  if (!t || isNaN(t)) return '0:00';
  var s = Math.floor(t % 60);
  return Math.floor(t / 60) + ':' + (s < 10 ? '0' : '') + s;
}

function setProgress(v) { progress.style.setProperty('--prog', v + '%'); }
function setVolume(v)    { volBar.style.setProperty('--vol', (v * 100) + '%'); }

function loadSong() {
  audio.src = encodeURI(songs[idx].file);
  document.getElementById('songTitle').textContent = songs[idx].label;
}

loadSong();
audio.volume = 0.7;
setVolume(0.7);

function playPause() {
  if (audio.paused) {
    audio.play().catch(function() {});
    playPath.setAttribute('d', PAUSE);
  } else {
    audio.pause();
    playPath.setAttribute('d', PLAY);
  }
}

function nextSong() {
  idx = (idx + 1) % songs.length;
  loadSong();
  audio.play().catch(function() {});
  playPath.setAttribute('d', PAUSE);
}

function prevSong() {
  idx = (idx - 1 + songs.length) % songs.length;
  loadSong();
  audio.play().catch(function() {});
  playPath.setAttribute('d', PAUSE);
}

document.getElementById('playBtn').addEventListener('click', playPause);
document.getElementById('nextBtn').addEventListener('click', nextSong);
document.getElementById('prevBtn').addEventListener('click', prevSong);

audio.addEventListener('loadedmetadata', function() {
  var d = fmt(audio.duration);
  document.getElementById('durTime').textContent  = d;
  document.getElementById('durTime2').textContent = d;
});

audio.ontimeupdate = function() {
  var c = fmt(audio.currentTime);
  document.getElementById('curTime').textContent  = c;
  document.getElementById('curTime2').textContent = c;
  if (audio.duration) {
    var p = (audio.currentTime / audio.duration) * 100;
    progress.value = p;
    setProgress(p);
  }
};

progress.oninput = function() {
  if (audio.duration) {
    audio.currentTime = (progress.value / 100) * audio.duration;
    setProgress(progress.value);
  }
};

audio.onended = nextSong;

volBar.oninput = function() {
  audio.volume = volBar.value;
  setVolume(volBar.value);
};

/* Mobile unlock */
document.body.addEventListener('click', function() {
  audio.play().catch(function() {});
  playPath.setAttribute('d', PAUSE);
}, { once: true });