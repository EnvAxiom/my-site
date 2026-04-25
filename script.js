/* =====================
   VIDEO FILES
   ===================== */
var bgVideoFiles = [
  'Chief Keef - _Everyday_.mp4',
  'Sosa.mp4'
];

var currentBgIdx = Math.floor(Math.random() * bgVideoFiles.length);
var bgVideo      = document.getElementById('bgVideo');
var audioEl      = document.getElementById('audio');
var entered      = false;

function playBgVideo(filename) {
  if (!bgVideo) return;

  bgVideo.pause();
  bgVideo.removeAttribute('src');
  bgVideo.load();

  bgVideo.src = encodeURI(filename);
  bgVideo.muted = true;
  bgVideo.loop = true;
  bgVideo.playsInline = true;
  bgVideo.setAttribute('playsinline', '');
  bgVideo.setAttribute('webkit-playsinline', '');

  bgVideo.load();

  bgVideo.play().catch(function(e) {
    console.warn('Background video play error:', e);
  });
}

/* =====================
   SPLASH SCREEN
   ===================== */
var splash    = document.getElementById('splash');
var mainScene = document.getElementById('mainScene');

splash.addEventListener('click', function() {
  if (entered) return;
  entered = true;

  splash.classList.add('hidden');
  mainScene.classList.add('visible');

  playBgVideo(bgVideoFiles[currentBgIdx]);
  loadSong(true);
});

/* Change video button */
document.getElementById('changeVidBtn').addEventListener('click', function() {
  var next;
  do { next = Math.floor(Math.random() * bgVideoFiles.length); }
  while (next === currentBgIdx && bgVideoFiles.length > 1);
  currentBgIdx = next;
  playBgVideo(bgVideoFiles[currentBgIdx]);
});

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
   VIEWS COUNTER
   ===================== */
fetch('https://api.countapi.xyz/hit/dilsherkrd-bio/pageviews')
  .then(function(r) { return r.json(); })
  .then(function(j) {
    document.getElementById('viewCount').textContent =
      j.value !== undefined ? j.value.toLocaleString() : '—';
  })
  .catch(function() {
    document.getElementById('viewCount').textContent = '—';
  });

/* =====================
   MUSIC PLAYER
   ===================== */
var songs = [
  { file: "I Don't Like (Remix).mp3",    label: "I Don't Like (Remix)"     },
  { file: "Roddy Ricch - The Box.mp3",   label: "Roddy Ricch - The Box"    },
  { file: "Cartoon, Jéja - On & On.mp3", label: "Cartoon & Jéja - On & On" },
  { file: "Chief Keef - Love Sosa.mp3",  label: "Chief Keef - Love Sosa"   }
];

var idx        = 0;
var progress   = document.getElementById('progressBar');
var playPath   = document.getElementById('playPath');
var volBar     = document.getElementById('volumeBar');
var PLAY       = 'M8 5v14l11-7z';
var PAUSE      = 'M6 19h4V5H6v14zm8-14v14h4V5h-4z';
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
  audioEl.src = encodeURI(songs[idx].file);
  audioEl.load();

  document.getElementById('songTitle').textContent = songs[idx].label;
  progress.value = 0;
  setProgress(0);

  document.getElementById('curTime').textContent   = '0:00';
  document.getElementById('curTime2').textContent  = '0:00';
  document.getElementById('durTime').textContent   = '0:00';
  document.getElementById('durTime2').textContent  = '0:00';

  if (autoplay) {
    audioEl.play().catch(function(e) { console.warn('Audio play error:', e); });
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
    audioEl.play().catch(function(e) { console.warn('Audio play error:', e); });
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



/* =====================
   SPOTIFY-STYLE LRC LYRICS
   Name your lyric file exactly:
   dont-like-remix.lrc
   Put it in the same folder as index.html and script.js.
   ===================== */
var lyricsList = document.getElementById('lyricsList');
var currentLyrics = [];
var loadedLyricsFor = '';

var lyricsFiles = {
  "I Don't Like (Remix)": "dont-like-remix.lrc"
};

function escapeHTML(text) {
  return String(text).replace(/[&<>"']/g, function(ch) {
    return ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    })[ch];
  });
}

function parseTimestampToSeconds(stamp) {
  var parts = stamp.split(':');
  if (parts.length < 2) return 0;

  var minutes = parseInt(parts[0], 10) || 0;
  var seconds = parseFloat(parts[1]) || 0;

  return minutes * 60 + seconds;
}

function parseLRC(text) {
  var lines = [];
  text.split(/\r?\n/).forEach(function(rawLine) {
    var matches = rawLine.match(/\[(\d{1,2}:\d{2}(?:\.\d{1,3})?)\]/g);
    if (!matches) return;

    var lyricText = rawLine.replace(/\[(\d{1,2}:\d{2}(?:\.\d{1,3})?)\]/g, '').trim();
    if (!lyricText) lyricText = '♪';

    matches.forEach(function(stamp) {
      var cleanStamp = stamp.replace('[', '').replace(']', '');
      lines.push({
        time: parseTimestampToSeconds(cleanStamp),
        text: lyricText
      });
    });
  });

  lines.sort(function(a, b) {
    return a.time - b.time;
  });

  return lines;
}

function loadLyricsForCurrentSong() {
  var songName = songs[idx].label;
  var lrcFile = lyricsFiles[songName];

  currentLyrics = [];
  loadedLyricsFor = songName;

  if (!lyricsList) return;

  if (!lrcFile) {
    lyricsList.innerHTML = '<div class="lyrics-empty">No lyrics for this song</div>';
    return;
  }

  lyricsList.innerHTML = '<div class="lyrics-empty">Loading lyrics...</div>';

  fetch(lrcFile + '?v=' + Date.now())
    .then(function(response) {
      if (!response.ok) throw new Error('Could not load ' + lrcFile);
      return response.text();
    })
    .then(function(text) {
      if (loadedLyricsFor !== songName) return;

      currentLyrics = parseLRC(text);

      if (!currentLyrics.length) {
        lyricsList.innerHTML = '<div class="lyrics-empty">LRC file has no timed lines</div>';
        return;
      }

      renderSpotifyLyrics(0);
    })
    .catch(function(error) {
      console.warn(error);
      lyricsList.innerHTML = '<div class="lyrics-empty">Add dont-like-remix.lrc to show lyrics</div>';
    });
}

function getActiveLyricIndex(currentTime) {
  if (!currentLyrics.length) return -1;

  var activeIndex = 0;

  for (var i = 0; i < currentLyrics.length; i++) {
    if (currentTime >= currentLyrics[i].time) {
      activeIndex = i;
    } else {
      break;
    }
  }

  return activeIndex;
}

function renderSpotifyLyrics(currentTime) {
  if (!lyricsList || !currentLyrics.length) return;

  var activeIndex = getActiveLyricIndex(currentTime);
  var start = Math.max(0, activeIndex - 2);
  var end = Math.min(currentLyrics.length, activeIndex + 4);
  var html = '';

  for (var i = start; i < end; i++) {
    var cls = 'lyric-line';

    if (i < activeIndex) cls += ' past';
    if (i === activeIndex) cls += ' active';
    if (i > activeIndex) cls += ' next';

    html += '<div class="' + cls + '">' + escapeHTML(currentLyrics[i].text) + '</div>';
  }

  lyricsList.innerHTML = html;
}

/* Hook lyrics into your existing player */
audioEl.addEventListener('timeupdate', function() {
  renderSpotifyLyrics(audioEl.currentTime || 0);
});

audioEl.addEventListener('seeked', function() {
  renderSpotifyLyrics(audioEl.currentTime || 0);
});

