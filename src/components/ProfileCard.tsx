import { LanyardData } from '../hooks/useLanyard';
import { Eye } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

interface ProfileCardProps {
  lanyard: LanyardData | null;
}

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const TwitchIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/>
  </svg>
);

const SteamIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.455 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.252 0-2.265-1.014-2.265-2.265z"/>
  </svg>
);

const SnapchatIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.029c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.479-.105l-.031-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.775.807l.419-.015h.012z"/>
  </svg>
);

const SOCIALS = [
  { Icon: YoutubeIcon, href: "https://www.youtube.com/@EnvAxiom", color: "hover:text-red-500 hover:bg-red-500/10" },
  { Icon: TwitchIcon, href: "https://www.twitch.tv/axiomkrd", color: "hover:text-purple-500 hover:bg-purple-500/10" },
  { Icon: SteamIcon, href: "https://steamcommunity.com/profiles/76561199501656181/", color: "hover:text-blue-400 hover:bg-blue-400/10" },
  { Icon: SnapchatIcon, href: "https://www.snapchat.com/@dilsherderkurde", color: "hover:text-yellow-400 hover:bg-yellow-400/10" },
];

export default function ProfileCard({ lanyard }: ProfileCardProps) {
  const statusColor = {
    online: 'bg-[#3ba55d]',
    idle: 'bg-[#faa81a]',
    dnd: 'bg-[#ed4245]',
    offline: 'bg-[#747f8d]',
  };

  const statusLabel = {
    online: 'Online',
    idle: 'Idle',
    dnd: 'Do Not Disturb',
    offline: 'Offline',
  };

  const getStatusText = () => {
    if (!lanyard) return 'Loading...';
    if (lanyard.listening_to_spotify && lanyard.spotify) {
      return `Listening to ${lanyard.spotify.song}`;
    }
    const customActivity = lanyard.activities.find(a => a.type === 0);
    if (customActivity) return customActivity.name;
    return statusLabel[lanyard.discord_status];
  };

  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="w-[310px] bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[24px] p-7 flex flex-col items-center gap-5 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none" />
      
      {/* Avatar */}
      <div className="relative">
        <div className="w-[90px] h-[90px] rounded-full p-[2px] bg-gradient-to-tr from-white/30 via-white/5 to-transparent shadow-2xl">
          <img 
            src={lanyard?.discord_user.avatar ? `https://cdn.discordapp.com/avatars/${lanyard.discord_user.id}/${lanyard.discord_user.avatar}.png?size=256` : 'https://api.dicebear.com/7.x/avataaars/svg?seed=axiom'} 
            className="w-full h-full rounded-full object-cover"
            alt="Avatar"
          />
        </div>
      </div>

      {/* Name & Bio */}
      <div className="text-center space-y-1.5">
        <h2 className="font-['Syne'] font-extrabold text-[28px] leading-none tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          dilsher
        </h2>
        <p className="text-[12px] text-white/40 font-bold uppercase tracking-[0.2em]">
          16 • Sunni • Kurdish
        </p>
      </div>

      {/* Discord Status */}
      <div className="w-full bg-white/[0.03] border border-white/[0.06] rounded-[20px] p-3.5 flex items-center gap-3.5 hover:bg-white/[0.05] transition-colors duration-300">
        <div className="relative flex-shrink-0">
          <img 
            src={lanyard?.discord_user.avatar ? `https://cdn.discordapp.com/avatars/${lanyard.discord_user.id}/${lanyard.discord_user.avatar}.png?size=64` : 'https://api.dicebear.com/7.x/avataaars/svg?seed=axiom'} 
            className="w-10 h-10 rounded-full object-cover"
            alt="Status Avatar"
          />
          <div className={cn(
            "absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-[2.5px] border-[#121212]",
            lanyard ? statusColor[lanyard.discord_status] : 'bg-gray-500'
          )} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-bold text-white/90 truncate">
            {lanyard?.discord_user.global_name || 'axiomkrd'}
          </p>
          <p className="text-[11px] text-white/40 truncate font-semibold">
            {getStatusText()}
          </p>
        </div>
      </div>

      {/* Socials */}
      <div className="flex gap-3 w-full justify-center">
        {SOCIALS.map((social, i) => (
          <a
            key={i}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex-1 flex justify-center py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] transition-all duration-300 hover:scale-[1.05] hover:-translate-y-1 text-white/60",
              social.color
            )}
          >
            <social.Icon />
          </a>
        ))}
      </div>

      {/* View Counter */}
      <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-[9px] text-white/10 font-black tracking-widest uppercase">
        <Eye size={10} />
        <span>Live Views: 1,337</span>
      </div>
    </motion.div>
  );
}
