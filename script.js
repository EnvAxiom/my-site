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
  { file: "I Don't Like (Remix).mp3",      label: "I Don't Like (Remix)",      isVideo: false },
  { file: "Roddy Ricch - The Box.mp3",     label: "Roddy Ricch - The Box",     isVideo: false },
  { file: "Cartoon, J\u00e9ja - On & On.mp3", label: "Cartoon & J\u00e9ja - On & On", isVideo: false },
  { file: "Ey Reqib.mp3",                  label: "Ey Reqib",                  isVideo: false },
  { file: "Chief Keef - Love Sosa.mp3",    label: "Chief Keef - Love Sosa",    isVideo: false },
  { file: "Chief Keef - _Everyday_.mp4",   label: "Chief Keef - Everyday",     isVideo: true  }
];

var idx      = 0;
var audio    = document.getElementById('audio');
var progress = document.getElementById('progressBar');
var playPath = document.getElementById('playPath');
var volBar   = document.getElementById('volumeBar');
var PLAY     = "M8 5v14l11-7z";
var PAUSE    = "M6 19h4V5H6v14zm8-14v14h4V5h-4z";

/* Hidden video element for .mp4 audio playback */
var videoEl = document.createElement('video');
videoEl.style.cssText = 'position:fixed;width:0;height:0;opacity:0;pointer-events:none;';
videoEl.muted = false;
document.body.appendChild(videoEl);

/* The currently active media element (audio or video) */
var activeMedia = audio;

function fmt(t) {
  if (!t || isNaN(t)) return '0:00';
  var s = Math.floor(t % 60);
  return Math.floor(t / 60) + ':' + (s < 10 ? '0' : '') + s;
}

function setProgress(v) { progress.style.setProperty('--prog', v + '%'); }
function setVolume(v)    { volBar.style.setProperty('--vol', (v * 100) + '%'); }

function bindMediaEvents(media) {
  media.onloadedmetadata = function() {
    var d = fmt(media.duration);
    document.getElementById('durTime').textContent  = d;
    document.getElementById('durTime2').textContent = d;
  };

  media.ontimeupdate = function() {
    var c = fmt(media.currentTime);
    document.getElementById('curTime').textContent  = c;
    document.getElementById('curTime2').textContent = c;
    if (media.duration) {
      var p = (media.currentTime / media.duration) * 100;
      progress.value = p;
      setProgress(p);
    }
  };

  media.onended = nextSong;
}

bindMediaEvents(audio);
bindMediaEvents(videoEl);

function loadSong() {
  var song = songs[idx];
  document.getElementById('songTitle').textContent = song.label;

  /* Pause & reset both elements */
  audio.pause();
  audio.src = '';
  videoEl.pause();
  videoEl.src = '';

  if (song.isVideo) {
    activeMedia = videoEl;
    videoEl.src = encodeURI(song.file);
    videoEl.volume = parseFloat(volBar.value);
    audio.src = '';
  } else {
    activeMedia = audio;
    audio.src = encodeURI(song.file);
    audio.volume = parseFloat(volBar.value);
    videoEl.src = '';
  }
}

loadSong();
audio.volume = 0.7;
videoEl.volume = 0.7;
setVolume(0.7);

function playPause() {
  if (activeMedia.paused) {
    activeMedia.play().catch(function() {});
    playPath.setAttribute('d', PAUSE);
  } else {
    activeMedia.pause();
    playPath.setAttribute('d', PLAY);
  }
}

function nextSong() {
  idx = (idx + 1) % songs.length;
  loadSong();
  activeMedia.play().catch(function() {});
  playPath.setAttribute('d', PAUSE);
}

function prevSong() {
  idx = (idx - 1 + songs.length) % songs.length;
  loadSong();
  activeMedia.play().catch(function() {});
  playPath.setAttribute('d', PAUSE);
}

document.getElementById('playBtn').addEventListener('click', playPause);
document.getElementById('nextBtn').addEventListener('click', nextSong);
document.getElementById('prevBtn').addEventListener('click', prevSong);

progress.oninput = function() {
  if (activeMedia.duration) {
    activeMedia.currentTime = (progress.value / 100) * activeMedia.duration;
    setProgress(progress.value);
  }
};

volBar.oninput = function() {
  var v = parseFloat(volBar.value);
  audio.volume = v;
  videoEl.volume = v;
  setVolume(v);
};

/* Mobile unlock */
document.body.addEventListener('click', function() {
  activeMedia.play().catch(function() {});
  playPath.setAttribute('d', PAUSE);
}, { once: true });
