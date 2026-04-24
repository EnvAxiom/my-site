const audio=document.getElementById('audio');
const progress=document.getElementById('progressBar');
const playBtn=document.getElementById('playBtn');
const volume=document.getElementById('volumeBar');

const songs=[
 {file:"I Don't Like (Remix).mp3",label:"I Don't Like (Remix)"},
 {file:"Roddy Ricch - The Box.mp3",label:"Roddy Ricch — The Box"},
 {file:"Cartoon, Jéja - On & On.mp3",label:"Cartoon & Jéja — On & On"},
 {file:"Ey Reqîb.mp3",label:"Ey Reqîb"}
];

let i=0;

function fmt(t){
 let m=Math.floor(t/60),s=Math.floor(t%60);
 return m+':'+(s<10?'0':'')+s;
}

function load(){
 audio.src=encodeURI(songs[i].file);
 document.getElementById('songTitle').textContent=songs[i].label;
}
load();

function playPause(){
 if(audio.paused){
  audio.play().catch(()=>{});
  playBtn.textContent="⏸";
 }else{
  audio.pause();
  playBtn.textContent="▶";
 }
}

function nextSong(){
 i=(i+1)%songs.length;
 load();
 audio.play().catch(()=>{});
 playBtn.textContent="⏸";
}

function prevSong(){
 i=(i-1+songs.length)%songs.length;
 load();
 audio.play().catch(()=>{});
 playBtn.textContent="⏸";
}

audio.addEventListener('loadedmetadata',()=>{
 document.getElementById('durTime').textContent=fmt(audio.duration||0);
});

audio.ontimeupdate=()=>{
 document.getElementById('curTime').textContent=fmt(audio.currentTime||0);
 if(audio.duration){
  progress.value=(audio.currentTime/audio.duration)*100;
 }
};

progress.oninput=()=>{
 if(audio.duration){
  audio.currentTime=(progress.value/100)*audio.duration;
 }
};

audio.onended=nextSong;

/* VOLUME */
audio.volume=0.7;
volume.value=0.7;
volume.oninput=()=>audio.volume=volume.value;

/* MOBILE FIX */
document.body.addEventListener('click',()=>{
 audio.play().catch(()=>{});
 playBtn.textContent="⏸";
},{once:true});
