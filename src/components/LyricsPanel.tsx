import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

interface LyricLine {
  time: number;
  text: string;
}

interface LyricsPanelProps {
  currentSong: {
    label: string;
    lrc: string;
  };
  currentTime: number;
}

export default function LyricsPanel({ currentSong, currentTime }: LyricsPanelProps) {
  const [lyrics, setLyrics] = useState<LyricLine[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchLyrics = async () => {
      setLoading(true);
      setLyrics([]);
      
      try {
        const mockLyrics: Record<string, LyricLine[]> = {
          "I Don't Like (Remix)": [
            { time: 0, text: "♪" },
            { time: 2, text: "A bitch nigga, that's that shit I don't like" },
            { time: 5, text: "A snitch nigga, that's that shit I don't like" },
            { time: 8, text: "A fake nigga, that's that shit I don't like" },
            { time: 11, text: "Done nigga, that's that shit I don't like" },
            { time: 14, text: "A bitch nigga, that's that shit I don't like" },
            { time: 17, text: "Snitch nigga, that's that shit I don't like" },
          ],
          "The Box": [
            { time: 0, text: "Pullin' out the lot, at the 5-0-1" },
            { time: 3, text: "Brought the big bag, and it's full of blue strips" },
            { time: 6, text: "ee-er, ee-er" },
            { time: 9, text: "I put the pussy in a box" },
          ],
          "On & On": [
            { time: 0, text: "♪" },
            { time: 10, text: "Crying over yesterday" },
            { time: 13, text: "You're living for today" },
          ],
          "Love Sosa": [
            { time: 0, text: "These bitches love Sosa" },
            { time: 3, text: "O-End or no end" },
            { time: 6, text: "Fucking with them O-boys" },
          ]
        };

        setLyrics(mockLyrics[currentSong.label] || [
          { time: 0, text: "♪ Instrumentals ♪" },
          { time: 5, text: "Enjoy the rhythm" },
        ]);
      } catch (e) {
        console.error("Failed to load lyrics", e);
      } finally {
        setLoading(false);
      }
    };

    fetchLyrics();
  }, [currentSong]);

  const activeIndex = useMemo(() => {
    let index = -1;
    for (let i = 0; i < lyrics.length; i++) {
      if (currentTime >= lyrics[i].time) {
        index = i;
      } else {
        break;
      }
    }
    return index;
  }, [currentTime, lyrics]);

  return (
    <motion.aside 
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="hidden lg:flex flex-col w-[420px] h-[580px] bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[32px] p-10 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
      
      <div className="flex items-center justify-between mb-10 relative z-10">
        <h3 className="font-['Syne'] font-bold text-[11px] tracking-[0.4em] uppercase text-white/20">Lyrics</h3>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" />
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative z-10">
        <div className="h-full flex flex-col justify-center items-center text-center">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-white/10 font-black uppercase tracking-[0.3em] text-[10px]"
              >
                Syncing...
              </motion.div>
            ) : lyrics.length > 0 ? (
              <div className="space-y-8 py-20">
                {lyrics.map((line, i) => {
                  const isActive = i === activeIndex;
                  const isPast = i < activeIndex;
                  const isNext = i === activeIndex + 1;
                  
                  // Only show current, previous and next for a focused look
                  if (Math.abs(i - activeIndex) > 2 && activeIndex !== -1) return null;
                  if (activeIndex === -1 && i > 2) return null;

                  return (
                    <motion.p
                      key={i}
                      layout
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ 
                        opacity: isActive ? 1 : isNext ? 0.3 : isPast ? 0.15 : 0.1,
                        scale: isActive ? 1.1 : 1,
                        filter: isActive ? 'blur(0px)' : 'blur(2px)',
                        y: 0
                      }}
                      transition={{ duration: 0.4 }}
                      className={cn(
                        "text-[22px] font-black leading-tight tracking-tight px-4",
                        isActive ? "text-white" : "text-white/40"
                      )}
                    >
                      {line.text}
                    </motion.p>
                  );
                })}
              </div>
            ) : (
              <p className="text-white/10 font-black uppercase tracking-[0.3em] text-[10px]">No lyrics found</p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}
