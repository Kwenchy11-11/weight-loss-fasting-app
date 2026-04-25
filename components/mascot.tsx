"use client";

import React from "react";

interface MascotProps {
  type: "bunny" | "bear" | "bunny-happy" | "bear-sleepy" | "bunny-eating";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizes = {
  sm: { width: 60, height: 60 },
  md: { width: 100, height: 100 },
  lg: { width: 150, height: 150 },
  xl: { width: 200, height: 200 },
};

export function Mascot({ type, size = "md", className = "" }: MascotProps) {
  const { width, height } = sizes[size];

  const mascots = {
    bunny: (
      <svg viewBox="0 0 200 200" width={width} height={height} className={className}>
        {/* Bunny Body */}
        <ellipse cx="100" cy="160" rx="50" ry="40" fill="#FFE4E9" />
        {/* Bunny Head */}
        <ellipse cx="100" cy="100" rx="55" ry="50" fill="#FFF5F7" />
        {/* Left Ear */}
        <ellipse cx="65" cy="45" rx="18" ry="35" fill="#FFF5F7" />
        <ellipse cx="65" cy="45" rx="12" ry="25" fill="#FFE4E9" />
        {/* Right Ear */}
        <ellipse cx="135" cy="45" rx="18" ry="35" fill="#FFF5F7" />
        <ellipse cx="135" cy="45" rx="12" ry="25" fill="#FFE4E9" />
        {/* Left Eye */}
        <circle cx="80" cy="95" r="8" fill="#5D4E6D" />
        <circle cx="82" cy="93" r="3" fill="#FFFFFF" />
        {/* Right Eye */}
        <circle cx="120" cy="95" r="8" fill="#5D4E6D" />
        <circle cx="122" cy="93" r="3" fill="#FFFFFF" />
        {/* Nose */}
        <ellipse cx="100" cy="110" rx="6" ry="4" fill="#FF8FA3" />
        {/* Mouth */}
        <path d="M 95 118 Q 100 122 105 118" stroke="#FF8FA3" strokeWidth="2" fill="none" />
        {/* Cheeks */}
        <ellipse cx="70" cy="108" rx="10" ry="6" fill="#FFB4C2" opacity="0.6" />
        <ellipse cx="130" cy="108" rx="10" ry="6" fill="#FFB4C2" opacity="0.6" />
        {/* Bow */}
        <path d="M 100 55 L 90 45 L 100 50 L 110 45 Z" fill="#FF8FA3" />
        <circle cx="100" cy="50" r="5" fill="#FF6B85" />
      </svg>
    ),
    "bunny-happy": (
      <svg viewBox="0 0 200 200" width={width} height={height} className={className}>
        {/* Bunny Body */}
        <ellipse cx="100" cy="160" rx="50" ry="40" fill="#FFE4E9" />
        {/* Bunny Head */}
        <ellipse cx="100" cy="100" rx="55" ry="50" fill="#FFF5F7" />
        {/* Left Ear */}
        <ellipse cx="65" cy="45" rx="18" ry="35" fill="#FFF5F7" />
        <ellipse cx="65" cy="45" rx="12" ry="25" fill="#FFE4E9" />
        {/* Right Ear */}
        <ellipse cx="135" cy="45" rx="18" ry="35" fill="#FFF5F7" />
        <ellipse cx="135" cy="45" rx="12" ry="25" fill="#FFE4E9" />
        {/* Happy Eyes (curved) */}
        <path d="M 72 95 Q 80 88 88 95" stroke="#5D4E6D" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M 112 95 Q 120 88 128 95" stroke="#5D4E6D" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Nose */}
        <ellipse cx="100" cy="105" rx="6" ry="4" fill="#FF8FA3" />
        {/* Big Smile */}
        <path d="M 85 115 Q 100 130 115 115" stroke="#FF8FA3" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Cheeks */}
        <ellipse cx="70" cy="108" rx="12" ry="8" fill="#FFB4C2" opacity="0.7" />
        <ellipse cx="130" cy="108" rx="12" ry="8" fill="#FFB4C2" opacity="0.7" />
        {/* Sparkles */}
        <text x="40" y="70" fontSize="20" fill="#FFD700">✨</text>
        <text x="150" y="70" fontSize="20" fill="#FFD700">✨</text>
      </svg>
    ),
    bear: (
      <svg viewBox="0 0 200 200" width={width} height={height} className={className}>
        {/* Bear Body */}
        <ellipse cx="100" cy="160" rx="55" ry="42" fill="#D4A574" />
        {/* Bear Head */}
        <circle cx="100" cy="100" r="55" fill="#E8C4A0" />
        {/* Left Ear */}
        <circle cx="55" cy="60" r="18" fill="#D4A574" />
        <circle cx="55" cy="60" r="10" fill="#E8C4A0" />
        {/* Right Ear */}
        <circle cx="145" cy="60" r="18" fill="#D4A574" />
        <circle cx="145" cy="60" r="10" fill="#E8C4A0" />
        {/* Left Eye */}
        <circle cx="80" cy="95" r="7" fill="#5D4E6D" />
        <circle cx="82" cy="93" r="2.5" fill="#FFFFFF" />
        {/* Right Eye */}
        <circle cx="120" cy="95" r="7" fill="#5D4E6D" />
        <circle cx="122" cy="93" r="2.5" fill="#FFFFFF" />
        {/* Snout */}
        <ellipse cx="100" cy="115" rx="20" ry="14" fill="#F5E6D3" />
        {/* Nose */}
        <ellipse cx="100" cy="110" rx="8" ry="5" fill="#5D4E6D" />
        {/* Mouth */}
        <path d="M 95 120 Q 100 125 105 120" stroke="#5D4E6D" strokeWidth="2" fill="none" />
        {/* Cheeks */}
        <ellipse cx="65" cy="110" rx="10" ry="6" fill="#FFB4C2" opacity="0.5" />
        <ellipse cx="135" cy="110" rx="10" ry="6" fill="#FFB4C2" opacity="0.5" />
      </svg>
    ),
    "bear-sleepy": (
      <svg viewBox="0 0 200 200" width={width} height={height} className={className}>
        {/* Bear Body */}
        <ellipse cx="100" cy="160" rx="55" ry="42" fill="#D4A574" />
        {/* Bear Head */}
        <circle cx="100" cy="100" r="55" fill="#E8C4A0" />
        {/* Left Ear */}
        <circle cx="55" cy="60" r="18" fill="#D4A574" />
        <circle cx="55" cy="60" r="10" fill="#E8C4A0" />
        {/* Right Ear */}
        <circle cx="145" cy="60" r="18" fill="#D4A574" />
        <circle cx="145" cy="60" r="10" fill="#E8C4A0" />
        {/* Closed Eyes */}
        <path d="M 72 95 Q 80 100 88 95" stroke="#5D4E6D" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M 112 95 Q 120 100 128 95" stroke="#5D4E6D" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {/* Snout */}
        <ellipse cx="100" cy="115" rx="20" ry="14" fill="#F5E6D3" />
        {/* Nose */}
        <ellipse cx="100" cy="110" rx="8" ry="5" fill="#5D4E6D" />
        {/* Small Smile */}
        <path d="M 95 120 Q 100 122 105 120" stroke="#5D4E6D" strokeWidth="2" fill="none" />
        {/* Zzz */}
        <text x="140" y="50" fontSize="16" fill="#8B7B8B" fontWeight="bold">Z</text>
        <text x="150" y="40" fontSize="14" fill="#8B7B8B" fontWeight="bold">z</text>
        <text x="158" y="32" fontSize="12" fill="#8B7B8B" fontWeight="bold">z</text>
      </svg>
    ),
    "bunny-eating": (
      <svg viewBox="0 0 200 200" width={width} height={height} className={className}>
        {/* Bunny Body */}
        <ellipse cx="100" cy="160" rx="50" ry="40" fill="#FFE4E9" />
        {/* Bunny Head */}
        <ellipse cx="100" cy="100" rx="55" ry="50" fill="#FFF5F7" />
        {/* Left Ear */}
        <ellipse cx="65" cy="45" rx="18" ry="35" fill="#FFF5F7" />
        <ellipse cx="65" cy="45" rx="12" ry="25" fill="#FFE4E9" />
        {/* Right Ear */}
        <ellipse cx="135" cy="45" rx="18" ry="35" fill="#FFF5F7" />
        <ellipse cx="135" cy="45" rx="12" ry="25" fill="#FFE4E9" />
        {/* Happy Eyes */}
        <path d="M 72 95 Q 80 88 88 95" stroke="#5D4E6D" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M 112 95 Q 120 88 128 95" stroke="#5D4E6D" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Nose */}
        <ellipse cx="100" cy="105" rx="6" ry="4" fill="#FF8FA3" />
        {/* Eating Expression */}
        <ellipse cx="100" cy="118" rx="8" ry="6" fill="#FF8FA3" />
        {/* Cheeks */}
        <ellipse cx="70" cy="108" rx="12" ry="8" fill="#FFB4C2" opacity="0.7" />
        <ellipse cx="130" cy="108" rx="12" ry="8" fill="#FFB4C2" opacity="0.7" />
        {/* Carrot */}
        <g transform="translate(130, 130) rotate(-30)">
          <path d="M 0 0 L 15 40 L 25 40 L 40 0 Z" fill="#FF8C42" />
          <path d="M 5 0 L 10 -10 M 20 0 L 20 -12 M 35 0 L 30 -10" stroke="#228B22" strokeWidth="3" fill="none" />
        </g>
        {/* Hearts */}
        <text x="35" y="80" fontSize="16" fill="#FF6B85">💕</text>
        <text x="150" y="85" fontSize="14" fill="#FF6B85">💖</text>
      </svg>
    ),
  };

  return (
    <div className="inline-block animate-float">
      {mascots[type]}
    </div>
  );
}

export function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" className={`animate-sparkle ${className}`}>
      <path
        d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z"
        fill="#FFD700"
      />
    </svg>
  );
}

export function Heart({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" className={`animate-pulse ${className}`}>
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill="#FF6B85"
      />
    </svg>
  );
}
