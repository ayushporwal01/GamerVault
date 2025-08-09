import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useCards } from "../utils/CardContext";
import CardTypeToggle from "./CardTypeToggle";
import {
  FaStar,
  FaHeart,
  FaRegHeart,
  FaPlus,
  FaTrash,
  FaLink,
} from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { IoFlash } from "react-icons/io5";
import { IoMdCheckmark } from "react-icons/io";
import { FaTerminal } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";

// Animated Icon Components
const AnimatedHeart = ({ isActive, onClick, title }) => {
  return (
    <motion.button
      onClick={onClick}
      className="p-2 text-sm rounded-lg transition-colors duration-300 bg-transparent hover:bg-white/10 relative overflow-hidden"
      title={title}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <AnimatePresence mode="wait">
        {isActive ? (
          <motion.div
            key="filled-heart"
            initial={{ scale: 0, rotate: -180 }}
            animate={{
              scale: 1,
              rotate: 0,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 20,
              },
            }}
            exit={{ scale: 0, rotate: 180 }}
            className="relative"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                filter: [
                  "drop-shadow(0 0 5px #ff6b6b)",
                  "drop-shadow(0 0 20px #ff6b6b)",
                  "drop-shadow(0 0 5px #ff6b6b)",
                ],
              }}
              transition={{
                duration: 0.6,
                ease: "easeInOut",
              }}
            >
              <FaHeart className="text-red-500 text-lg" />
            </motion.div>
            {/* Particle effects */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-red-400 rounded-full"
                style={{
                  top: "50%",
                  left: "50%",
                }}
                initial={{ scale: 0, x: 0, y: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  x: Math.cos((i * 60 * Math.PI) / 180) * 20,
                  y: Math.sin((i * 60 * Math.PI) / 180) * 20,
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 0.8,
                  delay: 0.2,
                  ease: "easeOut",
                }}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty-heart"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileHover={{
              filter: "drop-shadow(0 0 8px #ff6b6b)",
              transition: { duration: 0.2 },
            }}
          >
            <FaRegHeart className="text-gray-400 hover:text-red-400 text-lg transition-colors duration-200" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

const AnimatedFlash = ({ isActive, onClick, title }) => {
  return (
    <motion.button
      onClick={onClick}
      className="p-2 text-sm rounded-lg transition-colors duration-300 bg-transparent hover:bg-white/10 relative overflow-hidden"
      title={title}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <AnimatePresence mode="wait">
        {isActive ? (
          <motion.div
            key="active-flash"
            initial={{ scale: 0, rotate: -90 }}
            animate={{
              scale: 1,
              rotate: 0,
              transition: {
                type: "spring",
                stiffness: 400,
                damping: 25,
              },
            }}
            exit={{ scale: 0, rotate: 90 }}
            className="relative"
          >
            <motion.div
              animate={{
                filter: [
                  "drop-shadow(0 0 8px #ffd700)",
                  "drop-shadow(0 0 20px #ffd700)",
                  "drop-shadow(0 0 8px #ffd700)",
                ],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <IoFlash className="text-yellow-400 text-lg" />
            </motion.div>
            {/* Lightning spark effects */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-0.5 h-2 bg-yellow-300 rounded-full"
                style={{
                  top: "50%",
                  left: "50%",
                  transformOrigin: "center",
                  rotate: `${i * 45}deg`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  y: [-5, -15, -5],
                }}
                transition={{
                  duration: 0.6,
                  delay: 0.1 + i * 0.05,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="inactive-flash"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileHover={{
              filter: "drop-shadow(0 0 8px #ffd700)",
              transition: { duration: 0.2 },
            }}
          >
            <IoFlash className="text-gray-400 hover:text-yellow-400 text-lg transition-colors duration-200" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

const AnimatedTerminal = ({ isActive, onClick, title }) => {
  return (
    <motion.button
      onClick={onClick}
      className="p-2 text-sm rounded-lg transition-colors duration-300 bg-transparent hover:bg-white/10 relative overflow-hidden"
      title={title}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <AnimatePresence mode="wait">
        {isActive ? (
          <motion.div
            key="active-terminal"
            initial={{ scale: 0, rotateY: -180 }}
            animate={{
              scale: 1,
              rotateY: 0,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 20,
              },
            }}
            exit={{ scale: 0, rotateY: 180 }}
            className="relative"
          >
            <motion.div
              animate={{
                filter: [
                  "drop-shadow(0 0 8px #00ff88)",
                  "drop-shadow(0 0 15px #00ff88)",
                  "drop-shadow(0 0 8px #00ff88)",
                ],
                x: [0, -1, 1, 0],
              }}
              transition={{
                duration: 0.1,
                repeat: Infinity,
                repeatType: "mirror",
                repeatDelay: Math.random() * 2 + 1,
              }}
            >
              <FaTerminal className="text-blue-400 text-lg" />
            </motion.div>
            {/* Glitch lines */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute bg-green-400 rounded-full"
                style={{
                  width: "20px",
                  height: "1px",
                  top: `${30 + i * 5}%`,
                  left: "-10px",
                }}
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scaleX: [0, 1, 0],
                  x: [0, 30, 0],
                }}
                transition={{
                  duration: 0.2,
                  delay: Math.random() * 0.1,
                  repeat: Infinity,
                  repeatDelay: Math.random() * 1.5 + 0.5,
                }}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="inactive-terminal"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileHover={{
              filter: "drop-shadow(0 0 8px #00ff88)",
              transition: { duration: 0.2 },
            }}
          >
            <FaTerminal className="text-gray-400 hover:text-blue-400 text-lg transition-colors duration-200" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

const AnimatedCheckmark = ({ isActive, onClick, title }) => {
  return (
    <motion.button
      onClick={onClick}
      className="p-2 text-sm rounded-lg transition-colors duration-300 bg-transparent hover:bg-white/10 relative overflow-hidden"
      title={title}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <AnimatePresence mode="wait">
        {isActive ? (
          <motion.div
            key="active-checkmark"
            initial={{ scale: 0, rotate: -90 }}
            animate={{
              scale: 1,
              rotate: 0,
              transition: {
                type: "spring",
                stiffness: 500,
                damping: 30,
              },
            }}
            exit={{ scale: 0, rotate: 90 }}
            className="relative"
          >
            <motion.div
              animate={{
                filter: [
                  "drop-shadow(0 0 8px #4ade80)",
                  "drop-shadow(0 0 20px #4ade80)",
                  "drop-shadow(0 0 8px #4ade80)",
                ],
              }}
              transition={{
                duration: 1,
                ease: "easeInOut",
              }}
            >
              <IoMdCheckmark className="text-green-400 text-lg" />
            </motion.div>
            {/* Check animation circles */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute border-2 border-green-400 rounded-full"
                style={{
                  width: `${16 + i * 8}px`,
                  height: `${16 + i * 8}px`,
                  top: "50%",
                  left: "50%",
                  x: "-50%",
                  y: "-50%",
                }}
                initial={{ scale: 0, opacity: 1 }}
                animate={{
                  scale: [0, 1.5],
                  opacity: [1, 0],
                }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.1,
                  ease: "easeOut",
                }}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="inactive-checkmark"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileHover={{
              filter: "drop-shadow(0 0 8px #4ade80)",
              transition: { duration: 0.2 },
            }}
          >
            <IoMdCheckmark className="text-gray-400 hover:text-green-400 text-lg transition-colors duration-200" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

const FranchisePage = () => {
  const { id } = useParams();
  const franchiseName = decodeURIComponent(id);
  const [localRating, setLocalRating] = useState("0");
  const [reloadKey, setReloadKey] = useState(0);
  const [showGameModal, setShowGameModal] = useState(false);
  const [linkDialog, setLinkDialog] = useState({
    open: false,
    cardId: null,
    links: [],
  });
  // --- Persisted state ---
  const [gameCards, setGameCards] = useState(() => {
    try {
      const saved = localStorage.getItem(
        `franchise-gameCards-${franchiseName}`
      );
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [gameRatings, setGameRatings] = useState(() => {
    try {
      const saved = localStorage.getItem(
        `franchise-gameRatings-${franchiseName}`
      );
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  // Persist gameCards and gameRatings on change
  useEffect(() => {
    localStorage.setItem(
      `franchise-gameCards-${franchiseName}`,
      JSON.stringify(gameCards)
    );
  }, [gameCards, franchiseName]);
  useEffect(() => {
    localStorage.setItem(
      `franchise-gameRatings-${franchiseName}`,
      JSON.stringify(gameRatings)
    );
  }, [gameRatings, franchiseName]);

  // Function to remove a single game card
  const removeGameCard = (cardId) => {
    setGameCards((prev) => {
      const newCards = { ...prev };
      delete newCards[cardId];
      return newCards;
    });
    setGameRatings((prev) => {
      const newRatings = { ...prev };
      delete newRatings[cardId];
      return newRatings;
    });
  };

  // Function to remove all game cards
  const removeAllGameCards = () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear all games from this franchise?"
    );
    if (confirmed) {
      setGameCards({});
      setGameRatings({});
    }
  };

  // Hide body scrollbar when modal is open
  useEffect(() => {
    if (showGameModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showGameModal]);

  const {
    cards,
    setCards,
    favoriteGames,
    currentGames,
    nextGames,
    finishedGames,
    addToFavorites,
    removeFromFavorites,
    setGameAsCurrentGame,
    setGameAsNextGame,
    setGameAsFinishedGame,
    removeGameFromCategory,
    addToRanking,
    removeFromRanking,
    toggleGameInCategory,
  } = useCards();
  const inputRef = useRef(null);

  const localCard = cards.find(
    (c) => c.text?.toLowerCase() === franchiseName.toLowerCase()
  );

  useEffect(() => {
    if (!localCard?.id) return;
    const saved = localStorage.getItem(`rating-${localCard.id}`);
    setLocalRating(saved ?? "0");
  }, [localCard?.text, localCard?.isFranchiseCard, reloadKey]);

  const updateRating = (value) => {
    if (!localCard?.id) return;
    localStorage.setItem(`rating-${localCard.id}`, value);
    setCards((prev) =>
      prev.map((c) => (c.id === localCard.id ? { ...c, rating: value } : c))
    );
  };

  const handleRatingChange = (e) => {
    let value = Math.max(
      0,
      Math.min(10, parseFloat(e.target.value) || 0)
    ).toString();

    const numericValue = parseFloat(value);
    const previousRating = parseFloat(localRating);

    setLocalRating(value);
    updateRating(value);
  };

  // Helper function to get rating value from localStorage
  const getRatingValue = (ratingData) => {
    if (!ratingData) return 0;
    try {
      // Try to parse as JSON (new format)
      const parsed = JSON.parse(ratingData);
      return parseFloat(parsed.rating || "0");
    } catch {
      // Fall back to old format (just the number)
      return parseFloat(ratingData || "0");
    }
  };

  // Helper functions to check if a game is in different categories
  const isGameInFavorites = (game) => {
    return favoriteGames.some(
      (favGame) => Number(favGame.id) === Number(game.id)
    );
  };

  const isGameInCurrentGames = (game) => {
    return currentGames.some(
      (currentGame) => Number(currentGame.id) === Number(game.id)
    );
  };

  const isGameInNextGames = (game) => {
    return nextGames.some(
      (nextGame) => Number(nextGame.id) === Number(game.id)
    );
  };

  const isGameInFinishedGames = (game) => {
    return finishedGames.some(
      (finishedGame) => Number(finishedGame.id) === Number(game.id)
    );
  };

  // Helper function to create a game object suitable for context functions
  const createGameObject = (game) => {
    return {
      id: Number(game.id), // Always use the card's id as a number
      name: game.title || game.name,
      image: game.image || game.background_image,
      genres: game.genres || "N/A",
      released: game.releaseYear || game.released || "N/A",
      platforms: game.platforms || "N/A",
    };
  };

  // Action handlers for favorites and game categories
  const handleToggleFavorite = (game) => {
    const gameObj = createGameObject(game);
    if (isGameInFavorites(game)) return; // Do nothing if already in favorites
    toggleGameInCategory(gameObj, "favorites");
    showToast(`Added ${game.title || game.name} to Favorites`);
  };

  const handleToggleCurrentGame = (game) => {
    const gameObj = createGameObject(game);
    if (isGameInCurrentGames(game)) return; // Do nothing if already in current
    toggleGameInCategory(gameObj, "current");
    showToast(`Added ${game.title || game.name} to Current Games`);
  };

  const handleToggleNextGame = (game) => {
    const gameObj = createGameObject(game);
    if (isGameInNextGames(game)) return; // Do nothing if already in next
    toggleGameInCategory(gameObj, "next");
    showToast(`Added ${game.title || game.name} to Next Games`);
  };

  const handleToggleFinishedGame = (game) => {
    const gameObj = createGameObject(game);
    if (isGameInFinishedGames(game)) return; // Do nothing if already in finished
    toggleGameInCategory(gameObj, "finished");
    showToast(`Added ${game.title || game.name} to Finished Games`);
  };

  // Force update when franchise rating changes to block/unblock individual game star buttons
  useEffect(() => {
    // No-op to trigger re-render on rating change
  }, [localRating, cards]);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const handleWheel = (e) => {
      if (document.activeElement !== input) return;

      e.preventDefault();
      const delta = Math.sign(e.deltaY);
      const previousRating = parseFloat(localRating);
      let newValue = Math.max(0, Math.min(10, previousRating - delta));

      if (newValue !== previousRating) {
        setLocalRating(newValue.toString());
        updateRating(newValue.toString());
      }
    };

    input.addEventListener("wheel", handleWheel, { passive: false });
    return () => input.removeEventListener("wheel", handleWheel);
  }, [localRating, updateRating, localCard?.id, franchiseName, cards]);

  // Add an effect to sync gameRatings state with localStorage changes for each card
  useEffect(() => {
    const interval = setInterval(() => {
      setGameRatings((prev) => {
        const updated = { ...prev };
        Object.keys(gameCards).forEach((cardId) => {
          const rating = localStorage.getItem(`rating-${cardId}`) || "0";
          if (updated[cardId] !== rating) {
            updated[cardId] = rating;
          }
        });
        return updated;
      });
    }, 500);
    return () => clearInterval(interval);
  }, [gameCards]);

  // Helper to check if a card is complete (links not required)
  const isGameCardComplete = (card) => {
    return (
      card.title &&
      card.title.trim() !== "" &&
      card.releaseYear &&
      card.releaseYear.trim() !== "" &&
      card.platforms &&
      card.platforms.trim() !== "" &&
      card.image
    );
  };

  // Add a helper to show a notification
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#131313] text-white relative px-4 sm:px-6 lg:px-8 pr-16 sm:pr-20 md:pr-24 lg:pr-28">
      {/* Toast Notification at top of page */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            key="toast"
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
            className="fixed top-0 left-0 right-0 z-[9999]"
          >
            <div className="bg-white/10 backdrop-blur-md text-white px-6 py-4 shadow-lg border-b border-white/20">
              <p className="text-sm font-medium text-center">{toast.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Floating buttons */}
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 md:right-8 lg:right-10 z-50 flex gap-2 sm:gap-3">
        {/* Add new game card button */}
        <button
          onClick={() => {
            const newCardId = Date.now();
            setGameCards((prev) => ({
              ...prev,
              [newCardId]: {
                title: "Title",
                image: null,
                releaseYear: "Empty",
                platforms: "Empty",
                links: [],
              },
            }));
            setGameRatings((prev) => ({ ...prev, [newCardId]: "0" }));
          }}
          className="p-2 sm:p-3 bg-[#1b1b1b] hover:bg-[#2a2a2a] text-white rounded-full shadow-lg transition-colors duration-200 border border-gray-600"
          title="Add New Game Card"
        >
          <FaPlus className="text-lg sm:text-xl" />
        </button>

        {/* Clear all cards button - only show if there are cards */}
        {Object.keys(gameCards).length > 0 && (
          <button
            onClick={removeAllGameCards}
            className="p-2 sm:p-3 bg-[#1b1b1b] hover:bg-[#2a2a2a] text-white rounded-full shadow-lg transition-colors duration-200 border border-gray-600"
            title="Remove All Game Cards"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FaTrash className="text-lg sm:text-xl" />
          </button>
        )}

        {/* 3-dot menu button */}
        <button
          onClick={() => setShowGameModal(true)}
          className="p-2 sm:p-3 bg-[#1b1b1b] hover:bg-[#2a2a2a] text-white rounded-full shadow-lg transition-colors duration-200 border border-gray-600"
          title="Manage Games"
        >
          <MdMoreVert className="text-lg sm:text-xl" />
        </button>
      </div>

      {/* Game Management Modal */}
      {showGameModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-cover bg-center bg-black bg-opacity-50"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("/samurai.jpg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backdropFilter: "blur(3px)",
          }}
        >
          <div className="bg-[#1b1b1b]/95 backdrop-blur-sm rounded-xl border border-gray-600 w-11/12 max-w-4xl max-h-[85vh] sm:max-h-[80vh] overflow-hidden shadow-2xl relative">
            {/* Toast Notification inside modal (removed) */}

            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-600">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                Manage {localCard?.text || "Games"} Collection
              </h2>
              <button
                onClick={() => setShowGameModal(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                <IoMdClose className="text-lg sm:text-xl" />
              </button>
            </div>

            <div className="p-3 sm:p-4 overflow-y-auto max-h-[calc(85vh-80px)] sm:max-h-[calc(80vh-80px)] space-y-3">
              {Object.keys(gameCards).length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">
                    No games found in this collection. Add your own!
                  </p>
                </div>
              ) : (
                Object.entries(gameCards).map(([cardId, card]) => (
                  <div
                    key={cardId}
                    className="flex items-center gap-3 bg-[#232323] p-3 rounded-lg"
                  >
                    <img
                      src={card.image || "/fallback.jpg"}
                      alt={card.title}
                      className="w-12 h-9 sm:w-16 sm:h-12 object-cover rounded flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold text-xs sm:text-sm truncate">
                        {card.title}
                      </h3>
                      {/* Release year removed */}
                    </div>
                    {/* Action buttons for favorites, current, next, finished games */}
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => {
                          handleToggleFavorite(card);
                        }}
                        className="group p-1 bg-transparent border-none shadow-none rounded-full"
                        title={
                          isGameInFavorites(card)
                            ? "Already in favorites"
                            : "Add to favorites"
                        }
                        style={{ lineHeight: 0 }}
                        disabled={isGameInFavorites(card)}
                      >
                        <FaHeart
                          className={
                            isGameInFavorites(card)
                              ? "text-red-500"
                              : "text-white"
                          }
                        />
                      </button>
                      <button
                        onClick={() => {
                          handleToggleCurrentGame(card);
                        }}
                        className="group p-1 bg-transparent border-none shadow-none rounded-full"
                        title={
                          isGameInCurrentGames(card)
                            ? "Already in current games"
                            : "Add to current games"
                        }
                        style={{ lineHeight: 0 }}
                        disabled={isGameInCurrentGames(card)}
                      >
                        <IoFlash
                          className={
                            isGameInCurrentGames(card)
                              ? "text-yellow-400"
                              : "text-white"
                          }
                        />
                      </button>
                      <button
                        onClick={() => {
                          handleToggleNextGame(card);
                        }}
                        className="group p-1 bg-transparent border-none shadow-none rounded-full"
                        title={
                          isGameInNextGames(card)
                            ? "Already in next games"
                            : "Add to next games"
                        }
                        style={{ lineHeight: 0 }}
                        disabled={isGameInNextGames(card)}
                      >
                        <FaTerminal
                          className={
                            isGameInNextGames(card)
                              ? "text-cyan-400"
                              : "text-white"
                          }
                        />
                      </button>
                      <button
                        onClick={() => {
                          handleToggleFinishedGame(card);
                        }}
                        className="group p-1 bg-transparent border-none shadow-none rounded-full"
                        title={
                          isGameInFinishedGames(card)
                            ? "Already in finished games"
                            : "Add to finished games"
                        }
                        style={{ lineHeight: 0 }}
                        disabled={isGameInFinishedGames(card)}
                      >
                        <IoMdCheckmark
                          className={
                            isGameInFinishedGames(card)
                              ? "text-green-400"
                              : "text-white"
                          }
                        />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Link Management Dialog */}
      {linkDialog.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1b1b1b] rounded-xl p-6 w-full max-w-lg shadow-2xl border border-gray-700 relative">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Manage Links</h2>
              <button
                className="text-gray-400 hover:text-white transition-colors p-1"
                onClick={() =>
                  setLinkDialog({ open: false, cardId: null, links: [] })
                }
                title="Close"
              >
                <IoMdClose className="text-lg" />
              </button>
            </div>

            <div className="space-y-6 max-h-80 overflow-y-auto">
              {linkDialog.links.length === 0 ? (
                <div className="text-center py-8">
                  <FaLink className="text-gray-500 text-3xl mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">No links added yet</p>
                </div>
              ) : (
                linkDialog.links.map((link, idx) => (
                  <div
                    key={link.id || idx}
                    className="bg-[#232323] rounded-lg p-4 border border-gray-700"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <FaLink className="text-gray-400 text-sm flex-shrink-0" />
                      <input
                        type="text"
                        value={link.text || ""}
                        onChange={(e) => {
                          const newLinks = [...linkDialog.links];
                          newLinks[idx].text = e.target.value;
                          setLinkDialog((ld) => ({ ...ld, links: newLinks }));
                        }}
                        placeholder="Link title"
                        className="bg-[#181818] border border-gray-600 rounded px-3 py-2 text-white text-sm flex-1 focus:outline-none focus:border-blue-500 transition-colors"
                      />
                      <button
                        onClick={() => {
                          const newLinks = [...linkDialog.links];
                          newLinks.splice(idx, 1);
                          setLinkDialog((ld) => ({ ...ld, links: newLinks }));
                        }}
                        className="text-red-400 hover:text-red-300 transition-colors p-1"
                        title="Remove link"
                      >
                        <IoMdClose className="text-sm" />
                      </button>
                    </div>
                    <input
                      type="url"
                      value={link.url || ""}
                      onChange={(e) => {
                        const newLinks = [...linkDialog.links];
                        newLinks[idx].url = e.target.value;
                        setLinkDialog((ld) => ({ ...ld, links: newLinks }));
                      }}
                      placeholder="https://example.com"
                      className="bg-[#181818] border border-gray-600 rounded px-3 py-2 text-white text-sm w-full focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-700">
              <button
                onClick={() => {
                  setLinkDialog((ld) => ({
                    ...ld,
                    links: [...ld.links, { id: Date.now(), text: "", url: "" }],
                  }));
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors flex items-center gap-2"
              >
                <FaPlus className="text-xs" />
                Add Link
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setLinkDialog({ open: false, cardId: null, links: [] })
                  }
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const newCards = { ...gameCards };
                    newCards[linkDialog.cardId].links = linkDialog.links.filter(
                      (l) => l.url
                    );
                    setGameCards(newCards);
                    setLinkDialog({ open: false, cardId: null, links: [] });
                  }}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-6xl mx-auto mt-6 sm:mt-8 md:mt-10">
        <div className="flex flex-col lg:flex-row items-start gap-4 sm:gap-6 lg:gap-10 border border-white p-4 sm:p-5 rounded-xl bg-[#1b1b1b]">
          <img
            src={localCard?.image || "/fallback.jpg"}
            onError={(e) => (e.currentTarget.src = "/fallback.jpg")}
            alt={localCard?.text}
            loading="lazy"
            className="w-full lg:w-[300px] xl:w-[400px] h-48 sm:h-60 lg:h-72 object-cover rounded-xl flex-shrink-0"
          />
          <div className="flex flex-col space-y-3 sm:space-y-4 lg:space-y-5 w-full">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold break-words">
              {localCard?.text || "Loading..."}
            </h1>
            <div className="flex flex-col space-y-2 sm:space-y-3 text-sm sm:text-base md:text-lg lg:text-xl">
              <h3 className="break-words">
                <span className="text-[#606e82]">Genre: </span>
                Empty
              </h3>
              <h3 className="break-words">
                <span className="text-[#606e82]">Publisher: </span>
                Empty
              </h3>
              <h3>
                <span className="text-[#606e82]">Rating: </span>
                <input
                  ref={inputRef}
                  type="number"
                  min="0"
                  max="10"
                  className="w-[3ch] text-center bg-transparent focus:outline-none"
                  value={localRating}
                  onChange={handleRatingChange}
                  onKeyDown={(e) =>
                    ["ArrowUp", "ArrowDown"].includes(e.key) &&
                    e.stopPropagation()
                  }
                />
                /10
              </h3>
              <h3 className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <span className="text-[#606e82]">Type:</span>
                <div className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm sm:text-base font-semibold select-none">
                  <CardTypeToggle
                    card={localCard}
                    setCards={setCards}
                    setReloadKey={setReloadKey}
                  />
                </div>
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto mt-6 sm:mt-8 md:mt-10 space-y-4 sm:space-y-5">
        {/* Manual Game Cards Section */}
        {Object.entries(gameCards).map(([cardId, card]) => (
          <div
            key={cardId}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 bg-[#1b1b1b] p-3 sm:p-4 rounded-xl hover:bg-[#2a2a2a] transition-all cursor-pointer"
          >
            {/* Image Section */}
            <div className="w-full sm:w-36 md:w-48 h-20 sm:h-24 md:h-28 flex-shrink-0 relative group">
              {card.image ? (
                <div className="relative w-full h-full">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ lineHeight: 0 }}
                    title="Remove image"
                    onClick={(e) => {
                      e.stopPropagation();
                      const newCards = { ...gameCards };
                      newCards[cardId].image = null;
                      setGameCards(newCards);
                    }}
                  >
                    <IoMdClose className="text-white text-xs sm:text-base" />
                  </button>
                  {/* Overlay upload button when no image */}
                  {!card.image && (
                    <label className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/40 rounded-lg">
                      <span className="text-gray-200">Add Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const newCards = { ...gameCards };
                              newCards[cardId].image = event.target.result;
                              setGameCards(newCards);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  )}
                </div>
              ) : (
                <div className="w-full h-full bg-[#2a2a2a] rounded-lg flex items-center justify-center border-2 border-solid border-gray-600">
                  <label className="cursor-pointer text-gray-400 hover:text-white transition-colors text-sm text-center p-2">
                    Add Image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const newCards = { ...gameCards };
                            newCards[cardId].image = event.target.result;
                            setGameCards(newCards);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Game Info Section */}
            <div className="flex flex-col justify-between flex-1 min-w-0 space-y-2">
              <input
                type="text"
                value={card.title}
                onChange={(e) => {
                  const newCards = { ...gameCards };
                  newCards[cardId].title = e.target.value;
                  setGameCards(newCards);
                }}
                className="text-lg sm:text-xl md:text-2xl font-semibold break-words bg-transparent border-none outline-none text-white placeholder-gray-500"
                placeholder="Enter game title"
              />

              <div className="flex flex-col sm:flex-row gap-2 text-sm sm:text-base">
                <div className="flex items-center gap-2">
                  <span className="text-[#bbbbbb]">Release Year:</span>
                  <input
                    type="text"
                    value={card.releaseYear}
                    onChange={(e) => {
                      const newCards = { ...gameCards };
                      newCards[cardId].releaseYear = e.target.value;
                      setGameCards(newCards);
                    }}
                    className="bg-transparent border-none outline-none text-[#bbbbbb] placeholder-gray-500 w-20"
                    placeholder="Year"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm sm:text-base">
                <span className="text-[#bbbbbb]">Platforms:</span>
                <input
                  type="text"
                  value={card.platforms}
                  onChange={(e) => {
                    const newCards = { ...gameCards };
                    newCards[cardId].platforms = e.target.value;
                    setGameCards(newCards);
                  }}
                  className="bg-transparent border-none outline-none text-[#bbbbbb] placeholder-gray-500 flex-1"
                  placeholder="Enter platforms"
                />
              </div>

              <div className="flex items-center gap-2 text-sm sm:text-base">
                <button
                  onClick={() =>
                    setLinkDialog({
                      open: true,
                      cardId,
                      links: card.links || [],
                    })
                  }
                  className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors flex-shrink-0"
                  title="Manage links"
                >
                  <FaLink className="text-sm" />
                </button>
                {card.links.length > 0 && (
                  <div className="flex flex-wrap gap-2 flex-1">
                    {card.links.map((link) => (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline text-sm"
                        title={link.url}
                      >
                        {link.text || "Link"}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Action Section */}
            <div className="flex flex-col justify-center self-center sm:self-auto flex-shrink-0 gap-2 pr-4">
              {/* Rating Button */}
              {parseFloat(gameRatings[cardId] || "0") > 0 ? (
                <button
                  onClick={() => {
                    const newRatings = { ...gameRatings };
                    newRatings[cardId] = "0";
                    setGameRatings(newRatings);
                    // Remove rating from localStorage for leaderboard sync
                    localStorage.removeItem(`rating-${cardId}`);
                    removeFromRanking(Number(cardId));
                  }}
                  className="p-3 bg-red-600 hover:bg-red-700 text-white text-lg rounded-lg transition-colors duration-200 flex items-center justify-center"
                  title="Remove rating"
                  disabled={!isGameCardComplete(card)}
                  style={
                    !isGameCardComplete(card)
                      ? { opacity: 0.5, cursor: "not-allowed" }
                      : {}
                  }
                >
                  <IoMdClose className="text-white" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    const newRatings = { ...gameRatings };
                    newRatings[cardId] = "5";
                    setGameRatings(newRatings);
                    // Add to global cards if not present
                    if (!cards.some((c) => c.id === Number(cardId))) {
                      setCards((prev) => [
                        ...prev,
                        {
                          id: Number(cardId),
                          text: card.title,
                          image: card.image,
                          releaseYear: card.releaseYear,
                          platforms: card.platforms,
                          links: card.links,
                          isRankingOnly: true,
                          rating: "5",
                        },
                      ]);
                    }
                    // Set rating in localStorage for leaderboard sync
                    localStorage.setItem(`rating-${cardId}`, "5");
                    addToRanking({
                      ...card,
                      id: Number(cardId),
                      rating: "5",
                      isRankingOnly: true,
                    });
                  }}
                  className="p-3 bg-blue-600 hover:bg-blue-700 text-white text-lg rounded-lg transition-colors duration-200 flex items-center justify-center"
                  title="Rate this game"
                  disabled={!isGameCardComplete(card)}
                  style={
                    !isGameCardComplete(card)
                      ? { opacity: 0.5, cursor: "not-allowed" }
                      : {}
                  }
                >
                  <FaStar className="text-white" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FranchisePage;
