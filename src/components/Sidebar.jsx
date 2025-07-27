import { IoAddSharp, IoFlash } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { FaTerminal, FaHeart, FaGamepad, FaStar, FaClock, FaTrophy } from "react-icons/fa6";
import { IoMdCheckmark } from "react-icons/io";
import { useCards } from "../utils/CardContext";
import { useNavigate } from "react-router-dom";
import { useState, useCallback } from "react";

/**
 * Sidebar component for quick actions
 * Fixed at bottom on small screens, vertical sidebar on desktop and tablets
 */
const Sidebar = () => {
  const {
    addCard,
    clearAllCards,
    draggedGame,
    setGameAsCurrentGame,
    setGameAsNextGame,
    setGameAsFinishedGame,
    addToFavorites,
  } = useCards();
  const navigate = useNavigate();
  const [dragOverButton, setDragOverButton] = useState(null);

  // Handle drag over events - only respond to game drags, not card drags
  const handleDragOver = useCallback(
    (e, dropZone) => {
      e.preventDefault();
      e.stopPropagation();

      // Only show visual feedback if we're dragging a game, not a card
      if (draggedGame) {
        setDragOverButton(dropZone);
      }
    },
    [draggedGame]
  );

  // Handle drag leave events
  const handleDragLeave = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Only clear visual feedback if we were showing it for games
      if (draggedGame) {
        setDragOverButton(null);
      }
    },
    [draggedGame]
  );

  // Handle drop events for games only (cards can no longer be dropped)
  const handleDrop = useCallback(
    (e, gameDropHandler) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOverButton(null);

      // Only handle game drops (individual games from franchise page)
      if (draggedGame && gameDropHandler) {
        gameDropHandler(draggedGame);
      }
    },
    [draggedGame]
  );

  const sidebarButtons = [
    {
      icon: <IoAddSharp />,
      onClick: addCard,
      ariaLabel: "Add new card",
      size: "text-2xl",
      isActionButton: true,
    },
    {
      icon: <MdDelete />,
      onClick: clearAllCards,
      ariaLabel: "Clear all cards",
      size: "text-lg sm:text-xl",
      isActionButton: true,
    },
    {
      icon: <IoFlash />,
      onClick: () => navigate("/current-games"),
      onGameDrop: setGameAsCurrentGame,
      ariaLabel: "Current Games - Drop games here or click to view",
      size: "text-lg sm:text-xl",
      dropZone: "current",
      isDropZone: true,
    },
    {
      icon: <FaTerminal />,
      onClick: () => navigate("/next-games"),
      onGameDrop: setGameAsNextGame,
      ariaLabel: "Next Games - Drop games here or click to view",
      size: "text-lg sm:text-xl",
      dropZone: "next",
      isDropZone: true,
    },
    {
      icon: <IoMdCheckmark />,
      onClick: () => navigate("/finished-games"),
      onGameDrop: setGameAsFinishedGame,
      ariaLabel: "Finished Games - Drop games here or click to view",
      size: "text-lg sm:text-xl",
      dropZone: "finished",
      isDropZone: true,
    },
    {
      icon: <FaHeart />,
      onClick: () => navigate("/favorites"),
      onGameDrop: addToFavorites,
      ariaLabel: "Favorites - Drop games here or click to view",
      size: "text-base sm:text-lg",
      dropZone: "favorites",
      isDropZone: true,
    },
  ];

  return (
    <>
      {/* Mobile Horizontal Sidebar - Bottom of screen */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-center px-4">
        <div className="w-full max-w-[320px] h-18 mb-5 px-4 bg-black/50 text-white font-primary rounded-xl shadow-lg backdrop-blur-md border border-white/10 flex justify-center items-center">
          <ul className="flex justify-around w-full items-center">
            {sidebarButtons.map((button, index) => (
              <li key={index}>
                <button
                  className={`group w-10 h-10 rounded-full text-white hover:text-white ${button.size || 'text-xl'} transition-colors duration-300 hover:bg-white/10 flex justify-center items-center cursor-pointer ${
                    button.isDropZone && dragOverButton === button.dropZone
                      ? "bg-blue-500/30 border-2 border-blue-400 scale-110"
                      : ""
                  } ${
                    button.isDropZone && draggedGame
                      ? "ring-2 ring-white/20 ring-offset-2 ring-offset-transparent"
                      : ""
                  }`}
                  onClick={button.onClick}
                  aria-label={button.ariaLabel}
                  {...(button.isDropZone && draggedGame && {
                    onDragOver: (e) => handleDragOver(e, button.dropZone),
                    onDragLeave: handleDragLeave,
                    onDrop: (e) => handleDrop(e, button.onGameDrop),
                  })}
                >
                  {button.icon}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Desktop/Tablet Vertical Sidebar - Right side */}
      <div className="hidden sm:block fixed right-4 top-32 z-40">
        <div className="w-18 h-auto px-4 py-6 bg-black/50 text-white font-primary rounded-xl shadow-lg backdrop-blur-md border border-white/10 flex flex-col justify-center items-center">
          <ul className="flex flex-col justify-around items-center gap-5">
            {sidebarButtons.map((button, index) => (
              <li key={index}>
                <button
                  className={`group w-10 h-10 rounded-full text-white hover:text-white ${button.size || 'text-xl'} transition-colors duration-300 hover:bg-white/10 flex justify-center items-center cursor-pointer ${
                    button.isDropZone && dragOverButton === button.dropZone
                      ? "bg-blue-500/30 border-2 border-blue-400 scale-110"
                      : ""
                  } ${
                    button.isDropZone && draggedGame
                      ? "ring-2 ring-white/20 ring-offset-2 ring-offset-transparent"
                      : ""
                  }`}
                  onClick={button.onClick}
                  aria-label={button.ariaLabel}
                  {...(button.isDropZone && draggedGame && {
                    onDragOver: (e) => handleDragOver(e, button.dropZone),
                    onDragLeave: handleDragLeave,
                    onDrop: (e) => handleDrop(e, button.onGameDrop),
                  })}
                >
                  {button.icon}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
