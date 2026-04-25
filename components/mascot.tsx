"use client";

import React from "react";

interface MascotProps {
  type: "bunny" | "bear" | "chick" | "bunny-happy" | "bear-clock" | "bunny-yoga" | "bunny-eating" | "bunny-wink";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizes = {
  xs: { width: 40, height: 40 },
  sm: { width: 60, height: 60 },
  md: { width: 100, height: 100 },
  lg: { width: 150, height: 150 },
  xl: { width: 200, height: 200 },
};

export function Mascot({ type, size = "md", className = "" }: MascotProps) {
  const { width, height } = sizes[size];

  const mascots = {
    // กระต่ายตัวหลัก - สีขาวชมพู ตาม reference
    bunny: (
      <svg viewBox="0 0 200 200" width={width} height={height} className={className}>
        <defs>
          <linearGradient id="bunnyBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF5F7" />
            <stop offset="100%" stopColor="#FFE4EC" />
          </linearGradient>
          <linearGradient id="bunnyEar" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF5F7" />
            <stop offset="100%" stopColor="#FFB6C1" />
          </linearGradient>
        </defs>
        
        {/* หูซ้าย */}
        <ellipse cx="65" cy="50" rx="22" ry="40" fill="url(#bunnyEar)" />
        <ellipse cx="65" cy="55" rx="14" ry="28" fill="#FFE4EC" />
        
        {/* หูขวา */}
        <ellipse cx="135" cy="50" rx="22" ry="40" fill="url(#bunnyEar)" />
        <ellipse cx="135" cy="55" rx="14" ry="28" fill="#FFE4EC" />
        
        {/* หัว */}
        <ellipse cx="100" cy="110" rx="60" ry="55" fill="url(#bunnyBody)" />
        
        {/* แก้ม */}
        <ellipse cx="55" cy="115" rx="15" ry="10" fill="#FFB6C1" opacity="0.6" />
        <ellipse cx="145" cy="115" rx="15" ry="10" fill="#FFB6C1" opacity="0.6" />
        
        {/* ตาซ้าย */}
        <circle cx="75" cy="100" r="10" fill="#5D4E6D" />
        <circle cx="78" cy="97" r="4" fill="#FFFFFF" />
        
        {/* ตาขวา */}
        <circle cx="125" cy="100" r="10" fill="#5D4E6D" />
        <circle cx="128" cy="97" r="4" fill="#FFFFFF" />
        
        {/* จมูก */}
        <ellipse cx="100" cy="120" rx="8" ry="6" fill="#FF8FA3" />
        
        {/* ปากยิ้ม */}
        <path d="M 90 130 Q 100 138 110 130" stroke="#FF8FA3" strokeWidth="3" fill="none" strokeLinecap="round" />
        
        {/* โบว์ชมพู */}
        <path d="M 100 65 L 85 55 L 100 60 L 115 55 Z" fill="#FF8FA3" />
        <circle cx="100" cy="60" r="6" fill="#FF6B85" />
      </svg>
    ),
    
    // กระต่ายยิ้มมีความสุข
    "bunny-happy": (
      <svg viewBox="0 0 200 200" width={width} height={height} className={className}>
        <ellipse cx="65" cy="50" rx="22" ry="40" fill="#FFF5F7" />
        <ellipse cx="65" cy="55" rx="14" ry="28" fill="#FFE4EC" />
        <ellipse cx="135" cy="50" rx="22" ry="40" fill="#FFF5F7" />
        <ellipse cx="135" cy="55" rx="14" ry="28" fill="#FFE4EC" />
        <ellipse cx="100" cy="110" rx="60" ry="55" fill="#FFF5F7" />
        
        {/* แก้มเข้มขึ้น */}
        <ellipse cx="55" cy="115" rx="18" ry="12" fill="#FFB6C1" opacity="0.7" />
        <ellipse cx="145" cy="115" rx="18" ry="12" fill="#FFB6C1" opacity="0.7" />
        
        {/* ตายิ้ม */}
        <path d="M 65 95 Q 75 88 85 95" stroke="#5D4E6D" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M 115 95 Q 125 88 135 95" stroke="#5D4E6D" strokeWidth="4" fill="none" strokeLinecap="round" />
        
        <ellipse cx="100" cy="115" rx="8" ry="6" fill="#FF8FA3" />
        <path d="M 85 125 Q 100 140 115 125" stroke="#FF8FA3" strokeWidth="4" fill="none" strokeLinecap="round" />
        
        {/* ดาวกระพริบ */}
        <text x="30" y="70" fontSize="20" fill="#FFD700">✨</text>
        <text x="155" y="70" fontSize="16" fill="#FFD700">✨</text>
        <text x="165" y="50" fontSize="12" fill="#FFD700">✨</text>
      </svg>
    ),
    
    // หมีถือนาฬิกา
    "bear-clock": (
      <svg viewBox="0 0 200 200" width={width} height={height} className={className}>
        {/* หู */}
        <circle cx="50" cy="60" rx="20" ry="20" fill="#D4A574" />
        <circle cx="50" cy="60" rx="12" ry="12" fill="#E8C4A0" />
        <circle cx="150" cy="60" rx="20" ry="20" fill="#D4A574" />
        <circle cx="150" cy="60" rx="12" ry="12" fill="#E8C4A0" />
        
        {/* หัว */}
        <ellipse cx="100" cy="100" rx="55" ry="50" fill="#E8C4A0" />
        
        {/* แก้ม */}
        <ellipse cx="60" cy="110" rx="12" ry="8" fill="#FFB6C1" opacity="0.5" />
        <ellipse cx="140" cy="110" rx="12" ry="8" fill="#FFB6C1" opacity="0.5" />
        
        {/* ตา */}
        <circle cx="75" cy="95" r="8" fill="#5D4E6D" />
        <circle cx="77" cy="93" r="3" fill="#FFFFFF" />
        <circle cx="125" cy="95" r="8" fill="#5D4E6D" />
        <circle cx="127" cy="93" r="3" fill="#FFFFFF" />
        
        {/* จมูก */}
        <ellipse cx="100" cy="115" rx="10" ry="7" fill="#5D4E6D" />
        
        {/* ปาก */}
        <path d="M 92 125 Q 100 130 108 125" stroke="#5D4E6D" strokeWidth="2" fill="none" />
        
        {/* นาฬิกา */}
        <circle cx="100" cy="155" r="25" fill="#FFFFFF" stroke="#D4A574" strokeWidth="3" />
        <circle cx="100" cy="155" r="2" fill="#5D4E6D" />
        <line x1="100" y1="155" x2="100" y2="140" stroke="#5D4E6D" strokeWidth="2" strokeLinecap="round" />
        <line x1="100" y1="155" x2="110" y2="155" stroke="#5D4E6D" strokeWidth="2" strokeLinecap="round" />
        
        {/* หัวใจ */}
        <text x="140" y="50" fontSize="16" fill="#FF6B85">💕</text>
      </svg>
    ),
    
    // ลูกเจี๊ยบ
    chick: (
      <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
        <ellipse cx="50" cy="55" rx="35" ry="30" fill="#FFE4B5" />
        <circle cx="35" cy="45" r="4" fill="#5D4E6D" />
        <circle cx="65" cy="45" r="4" fill="#5D4E6D" />
        <ellipse cx="50" cy="55" rx="6" ry="4" fill="#FF8C42" />
        <ellipse cx="20" cy="55" rx="12" ry="8" fill="#FFE4B5" />
        <ellipse cx="80" cy="55" rx="12" ry="8" fill="#FFE4B5" />
        <path d="M 45 65 Q 50 70 55 65" stroke="#FF8C42" strokeWidth="2" fill="none" />
        <text x="70" y="25" fontSize="12" fill="#FFD700">✨</text>
      </svg>
    ),
    
    // กระต่ายโยคะ
    "bunny-yoga": (
      <svg viewBox="0 0 200 200" width={width} height={height} className={className}>
        <ellipse cx="65" cy="50" rx="20" ry="35" fill="#FFF5F7" />
        <ellipse cx="65" cy="50" rx="12" ry="22" fill="#FFE4EC" />
        <ellipse cx="135" cy="50" rx="20" ry="35" fill="#FFF5F7" />
        <ellipse cx="135" cy="50" rx="12" ry="22" fill="#FFE4EC" />
        
        {/* ท่าโยคะ - นั่งสมาธิ */}
        <ellipse cx="100" cy="120" rx="50" ry="45" fill="#FFF5F7" />
        <ellipse cx="55" cy="125" rx="15" ry="10" fill="#FFB6C1" opacity="0.6" />
        <ellipse cx="145" cy="125" rx="15" ry="10" fill="#FFB6C1" opacity="0.6" />
        
        {/* ตาปิดผ่อนคลาย */}
        <path d="M 70 110 Q 80 115 90 110" stroke="#5D4E6D" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M 110 110 Q 120 115 130 110" stroke="#5D4E6D" strokeWidth="3" fill="none" strokeLinecap="round" />
        
        <ellipse cx="100" cy="125" rx="6" ry="4" fill="#FF8FA3" />
        <path d="M 92 135 Q 100 140 108 135" stroke="#FF8FA3" strokeWidth="2" fill="none" />
        
        {/* ดอกไม้ */}
        <text x="140" y="80" fontSize="24" fill="#FFB6C1">🌸</text>
        <text x="35" y="80" fontSize="20" fill="#FFB6C1">🌸</text>
      </svg>
    ),
    
    // กระต่ายกิน
    "bunny-eating": (
      <svg viewBox="0 0 200 200" width={width} height={height} className={className}>
        <ellipse cx="65" cy="50" rx="20" ry="35" fill="#FFF5F7" />
        <ellipse cx="65" cy="50" rx="12" ry="22" fill="#FFE4EC" />
        <ellipse cx="135" cy="50" rx="20" ry="35" fill="#FFF5F7" />
        <ellipse cx="135" cy="50" rx="12" ry="22" fill="#FFE4EC" />
        <ellipse cx="100" cy="110" rx="55" ry="50" fill="#FFF5F7" />
        <ellipse cx="55" cy="115" rx="15" ry="10" fill="#FFB6C1" opacity="0.7" />
        <ellipse cx="145" cy="115" rx="15" ry="10" fill="#FFB6C1" opacity="0.7" />
        
        {/* ตายิ้ม */}
        <path d="M 70 100 Q 80 93 90 100" stroke="#5D4E6D" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M 110 100 Q 120 93 130 100" stroke="#5D4E6D" strokeWidth="3" fill="none" strokeLinecap="round" />
        
        <ellipse cx="100" cy="115" rx="8" ry="6" fill="#FF8FA3" />
        <ellipse cx="100" cy="128" rx="10" ry="8" fill="#FF8FA3" />
        
        {/* แครอท */}
        <g transform="translate(130, 130) rotate(-30)">
          <path d="M 0 0 L 15 40 L 25 40 L 40 0 Z" fill="#FF8C42" />
          <path d="M 5 0 L 10 -10 M 20 0 L 20 -12 M 35 0 L 30 -10" stroke="#228B22" strokeWidth="3" fill="none" />
        </g>
        
        <text x="35" y="85" fontSize="16" fill="#FF6B85">💕</text>
        <text x="150" y="90" fontSize="14" fill="#FF6B85">💖</text>
      </svg>
    ),
    
    // กระต่ายขยิบตา
    "bunny-wink": (
      <svg viewBox="0 0 200 200" width={width} height={height} className={className}>
        <ellipse cx="65" cy="50" rx="20" ry="35" fill="#FFF5F7" />
        <ellipse cx="65" cy="50" rx="12" ry="22" fill="#FFE4EC" />
        <ellipse cx="135" cy="50" rx="20" ry="35" fill="#FFF5F7" />
        <ellipse cx="135" cy="50" rx="12" ry="22" fill="#FFE4EC" />
        <ellipse cx="100" cy="110" rx="55" ry="50" fill="#FFF5F7" />
        <ellipse cx="55" cy="115" rx="15" ry="10" fill="#FFB6C1" opacity="0.6" />
        <ellipse cx="145" cy="115" rx="15" ry="10" fill="#FFB6C1" opacity="0.6" />
        
        {/* ตาซ้ายปกติ */}
        <circle cx="75" cy="100" r="10" fill="#5D4E6D" />
        <circle cx="78" cy="97" r="4" fill="#FFFFFF" />
        
        {/* ตาขวาขยิบ */}
        <path d="M 115 100 Q 125 95 135 100" stroke="#5D4E6D" strokeWidth="4" fill="none" strokeLinecap="round" />
        
        <ellipse cx="100" cy="120" rx="8" ry="6" fill="#FF8FA3" />
        <path d="M 90 130 Q 100 138 110 130" stroke="#FF8FA3" strokeWidth="3" fill="none" />
        
        <text x="140" y="70" fontSize="20" fill="#FFD700">✨</text>
      </svg>
    ),
    
    // หมีธรรมดา
    bear: (
      <svg viewBox="0 0 200 200" width={width} height={height} className={className}>
        <circle cx="50" cy="60" rx="18" ry="18" fill="#D4A574" />
        <circle cx="50" cy="60" rx="10" ry="10" fill="#E8C4A0" />
        <circle cx="150" cy="60" rx="18" ry="18" fill="#D4A574" />
        <circle cx="150" cy="60" rx="10" ry="10" fill="#E8C4A0" />
        <circle cx="100" cy="100" rx="50" ry="48" fill="#E8C4A0" />
        <ellipse cx="65" cy="110" rx="10" ry="6" fill="#FFB6C1" opacity="0.5" />
        <ellipse cx="135" cy="110" rx="10" ry="6" fill="#FFB6C1" opacity="0.5" />
        <circle cx="78" cy="95" r="7" fill="#5D4E6D" />
        <circle cx="80" cy="93" r="2.5" fill="#FFFFFF" />
        <circle cx="122" cy="95" r="7" fill="#5D4E6D" />
        <circle cx="124" cy="93" r="2.5" fill="#FFFFFF" />
        <ellipse cx="100" cy="115" rx="18" ry="12" fill="#F5E6D3" />
        <ellipse cx="100" cy="110" rx="7" ry="5" fill="#5D4E6D" />
        <path d="M 95 120 Q 100 124 105 120" stroke="#5D4E6D" strokeWidth="2" fill="none" />
      </svg>
    ),
  };

  return (
    <div className="inline-block">
      {mascots[type]}
    </div>
  );
}

export function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" className={`animate-sparkle ${className}`}>
      <path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z" fill="#FFD700" />
    </svg>
  );
}

export function Heart({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" className={`animate-heartbeat ${className}`}>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#FF6B85" />
    </svg>
  );
}

export function Flower({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" className={className}>
      <text x="0" y="20" fontSize="20">🌸</text>
    </svg>
  );
}
