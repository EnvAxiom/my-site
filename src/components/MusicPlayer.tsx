import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music as MusicIcon, MonitorPlay } from 'lucide-react';
import { motion } from 'framer-motion';

interface Song {
  file: string;
  label: string;
  lrc: string;
}

interface MusicPlayerProps {
  songs: Song[];
  currentIdx: number;
  onNext: () => void;
  onPrev: () => void;
  onChangeVideo: () => void;
  onTimeUpdate: (time: number) => void;
}

export default function MusicPlayer({ songs, currentIdx, onNext, onPrev, onChangeVideo, onTimeUpdate }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = songs[currentIdx].file;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      }
    }
  }, [currentIdx]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const time = audioRef.current.currentTime;
      setCurrentTime(time);
      onTimeUpdate(time);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1 }}
      className="w-[310px] bg-black/80 backdrop-blur-xl border border-white/10 rounded-[20px] p-4 flex flex-col gap-4 shadow-2xl"
    >
      <audio 
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={onNext}
      />

      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center border border-white/10 shadow-inner">
          <MusicIcon className="text-white/40" size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-[13px] font-bold text-white truncate">{songs[currentIdx].label}</h3>
          <p className="text-[11px] text-white/40 font-semibold">{formatTime(currentTime)} / {formatTime(duration)}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="relative group">
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={handleProgressChange}
            className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white hover:h-1.5 transition-all"
            style={{
              background: `linear-gradient(to right, white ${(currentTime / duration) * 100 || 0}%, rgba(255,255,255,0.1) 0%)`
            }}
          />
        </div>

        <div className="flex items-center justify-center gap-6">
          <button onClick={onPrev} className="text-white/60 hover:text-white transition-colors">
            <SkipBack size={20} fill="currentColor" />
          </button>
          <button 
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black hover:scale-110 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="translate-x-0.5" />}
          </button>
          <button onClick={onNext} className="text-white/60 hover:text-white transition-colors">
            <SkipForward size={20} fill="currentColor" />
          </button>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <div className="flex items-center gap-2 flex-1">
            <Volume2 size={14} className="text-white/30" />
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white"
              style={{
                background: `linear-gradient(to right, rgba(255,255,255,0.4) ${volume * 100}%, rgba(255,255,255,0.1) 0%)`
              }}
            />
          </div>
          <button 
            onClick={onChangeVideo}
            className="p-2 rounded-lg bg-white/5 border border-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider"
          >
            <MonitorPlay size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
