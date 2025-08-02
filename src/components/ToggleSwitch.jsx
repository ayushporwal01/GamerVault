import React from "react";
import { useCards } from "../utils/CardContext";

/**
 * Beautiful smooth toggle switch component for franchise/games view
 * Features smooth animations and modern styling
 */
const ToggleSwitch = () => {
  const { showGames, setShowGames } = useCards();

  const handleToggle = () => {
    setShowGames(!showGames);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Toggle Switch */}
      <div
        onClick={handleToggle}
        className={`
          relative inline-flex h-6 w-11 cursor-pointer rounded-full transition-colors duration-300 ease-in-out
          ${showGames 
            ? 'bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg shadow-purple-500/25' 
            : 'bg-white/20 hover:bg-white/30'
          }
        `}
        role="switch"
        aria-checked={showGames}
        aria-label={`Toggle between franchise and games view. Currently showing: ${showGames ? 'Games' : 'Franchise'}`}
      >
        {/* Toggle Circle */}
        <span
          className={`
            inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-300 ease-in-out
            ${showGames ? 'translate-x-5' : 'translate-x-0.5'}
          `}
          style={{
            marginTop: '2px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(0, 0, 0, 0.1)'
          }}
        />
        
        {/* Glow effect when toggled */}
        {showGames && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 opacity-30 blur-sm animate-pulse" />
        )}
      </div>
    </div>
  );
};

export default ToggleSwitch;

