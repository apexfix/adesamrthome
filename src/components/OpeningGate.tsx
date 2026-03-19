"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function OpeningGate() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (isVisible) {
      // Preload image and open gate
      const img = new Image();
      img.src = '/img/1.png';
      
      const triggerOpen = () => {
        setTimeout(handleOpen, 500);
      };

      if (img.complete) {
        triggerOpen();
      } else {
        img.onload = triggerOpen;
        img.onerror = triggerOpen;
      }

      // Safety fallback: force open after 3 seconds anyway
      const timer = setTimeout(triggerOpen, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const handleOpen = () => {
    setIsOpen(true);
    // Remove component from DOM after animation
    setTimeout(() => {
      setIsVisible(false);
    }, 2000); // Wait for transition to finish
  };

  if (!isVisible) return null;

  return (
    <div 
      className={cn(
        "fixed inset-0 z-[9999] flex transition-opacity duration-1000",
        isOpen ? "pointer-events-none opacity-0" : "opacity-100"
      )}
    >
      <style>{`
        html, body {
          overflow: hidden !important;
        }
      `}</style>
      
      {/* Left Door Container */}
      <div 
        className={cn(
          "relative h-full w-1/2 overflow-hidden bg-black transition-transform duration-[1500ms] ease-in-out border-r border-white/10",
          isOpen ? "-translate-x-full" : "translate-x-0"
        )}
      >
        {/* Inner Image Div - simulates full screen cover */}
        <div 
          className="absolute inset-0 w-[200%] h-full bg-no-repeat"
          style={{ 
            backgroundImage: "url('/img/1.png')",
            backgroundPosition: "center",
            backgroundSize: "contain"
          }}
        />
        {/* Shading */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20 pointer-events-none" />
      </div>

      {/* Right Door Container */}
      <div 
        className={cn(
          "relative h-full w-1/2 overflow-hidden bg-black transition-transform duration-[1500ms] ease-in-out border-l border-white/10",
          isOpen ? "translate-x-full" : "translate-x-0"
        )}
      >
        {/* Inner Image Div - simulates full screen cover, shifted left by 100% of parent (50vw) */}
        <div 
          className="absolute inset-0 w-[200%] h-full bg-no-repeat -ml-[100%]"
          style={{ 
            backgroundImage: "url('/img/1.png')",
            backgroundPosition: "center",
            backgroundSize: "contain"
          }}
        />
        {/* Shading */}
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/20 pointer-events-none" />
      </div>

      {/* Interaction Button - Removed */}
    </div>
  );
}
