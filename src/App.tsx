import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanyard } from './hooks/useLanyard';
import ProfileCard from './components/ProfileCard';
import MusicPlayer from './components/MusicPlayer';
import LyricsPanel from './components/LyricsPanel';
import SplashScreen from './components/SplashScreen';

const BG_VIDEOS = [
  "https://pub-8d076326079d4a46a9a3b2b4b7c89f7a.r2.dev/Chief%20Keef%20-%20_Everyday_.mp4",
  "https://pub-8d076326079d4a46a9a3b2b4b7c89f7a.r2.dev/Sosa.mp4"
];

const SONGS = [
  { 
    file: "https://pub-8d076326079d4a46a9a3b2b4b7c89f7a.r2.dev/I%20Don't%20Like%20(Remix).mp3", 
    label: "I Don't Like (Remix)",
    lrc: "dont-like-remix.lrc" 
  },
  { 
    file: "https://pub-8d076326079d4a46a9a3b2b4b7c89f7a.r2.dev/Roddy%20Ricch%20-%20The%20Box.mp3", 
    label: "The Box",
    lrc: "thebox.lrc"
  },
  { 
    file: "https://pub-8d076326079d4a46a9a3b2b4b7c89f7a.r2.dev/Cartoon%2C%20J%C3%A9ja%20-%20On%20%26%20On.mp3", 
    label: "On & On",
    lrc: "onandon.lrc"
  },
  { 
    file: "https://pub-8d076326079d4a46a9a3b2b4b7c89f7a.r2.dev/Love%20Sosa.mp3", 
    label: "Love Sosa",
    lrc: "lovesosa.lrc"
  }
];

const DISCORD_ID = '856911460587012116';

export default function App() {
  const [entered, setEntered] = useState(false);
  const [currentVideoIdx, setCurrentVideoIdx] = useState(0);
  const [currentSongIdx, setCurrentSongIdx] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const lanyard = useLanyard(DISCORD_ID);
  const videoRef = useRef<HTMLVideoElement>(null);

  const changeVideo = () => {
    setCurrentVideoIdx((prev) => (prev + 1) % BG_VIDEOS.length);
  };

  useEffect(() => {
    if (entered && videoRef.current) {
      videoRef.current.play().catch(console.error);
    }
  }, [entered, currentVideoIdx]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black font-['DM_Sans'] text-[#f0ede8]">
      <AnimatePresence>
        {!entered && (
          <SplashScreen onEnter={() => setEntered(true)} />
        )}
      </AnimatePresence>

      <video
        ref={videoRef}
        key={BG_VIDEOS[currentVideoIdx]}
        className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none transition-opacity duration-1000"
        src={BG_VIDEOS[currentVideoIdx]}
        muted
        loop
        playsInline
        style={{ opacity: entered ? 1 : 0 }}
      />
      <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[1] pointer-events-none" />

      {entered && (
        <motion.main 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative z-10 flex flex-col md:flex-row items-center justify-center min-h-screen p-4 md:p-8 gap-8"
        >
          <div className="flex flex-col gap-5 items-center md:items-end">
            <ProfileCard lanyard={lanyard} />
            <MusicPlayer 
              songs={SONGS} 
              currentIdx={currentSongIdx} 
              onNext={() => setCurrentSongIdx((prev) => (prev + 1) % SONGS.length)}
              onPrev={() => setCurrentSongIdx((prev) => (prev - 1 + SONGS.length) % SONGS.length)}
              onChangeVideo={changeVideo}
              onTimeUpdate={(time) => setCurrentTime(time)}
            />
          </div>
          
          <LyricsPanel 
            currentSong={SONGS[currentSongIdx]} 
            currentTime={currentTime}
          />
        </motion.main>
      )}
    </div>
  );
}
