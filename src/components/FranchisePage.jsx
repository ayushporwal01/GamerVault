import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useCards } from "../utils/CardContext";
import ShimmerCardList from "../utils/ShimmerCardList";
import GameLinks from "./GameLinks";
import CardTypeToggle from "./CardTypeToggle";
import { API_KEY, GAMES_ENDPOINT, STORES_ENDPOINT } from "../utils/apiConfig";
import { FaStar, FaHeart, FaRegHeart } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { MdBlock, MdMoreVert } from "react-icons/md";
import { IoFlash } from "react-icons/io5";
import { IoMdCheckmark } from "react-icons/io";
import { FaTerminal } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Cache utility functions for RAWG API responses
 * Provides persistent caching to reduce API calls and improve performance
 */
const cacheUtils = {
  /**
   * Generate cache key for different data types
   * @param {string} type - Type of cached data (franchise, stores, etc.)
   * @param {string} identifier - Unique identifier for the data
   * @returns {string} Cache key
   */
  getCacheKey: (type, identifier) => `rawg_cache_${type}_${identifier}`,

  /**
   * Retrieve cached data from localStorage
   * @param {string} key - Cache key
   * @returns {any|null} Cached data or null if not found/invalid
   */
  getCachedData: (key) => {
    try {
      const cached = localStorage.getItem(key);
      if (!cached) return null;
      
      const { data } = JSON.parse(cached);
      return data;
    } catch (error) {
      console.warn('Cache read error:', error);
      return null;
    }
  },

  /**
   * Store data in localStorage cache
   * @param {string} key - Cache key
   * @param {any} data - Data to cache
   */
  setCachedData: (key, data) => {
    try {
      const cacheEntry = {
        data,
        timestamp: Date.now(), // Keep timestamp for reference
      };
      localStorage.setItem(key, JSON.stringify(cacheEntry));
    } catch (error) {
      console.warn('Cache write error:', error);
    }
  },
};

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
                damping: 20
              }
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
                  "drop-shadow(0 0 5px #ff6b6b)"
                ]
              }}
              transition={{
                duration: 0.6,
                ease: "easeInOut"
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
                  x: Math.cos((i * 60) * Math.PI / 180) * 20,
                  y: Math.sin((i * 60) * Math.PI / 180) * 20,
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 0.8,
                  delay: 0.2,
                  ease: "easeOut"
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
              transition: { duration: 0.2 }
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
                damping: 25
              }
            }}
            exit={{ scale: 0, rotate: 90 }}
            className="relative"
          >
            <motion.div
              animate={{
                filter: [
                  "drop-shadow(0 0 8px #ffd700)",
                  "drop-shadow(0 0 20px #ffd700)",
                  "drop-shadow(0 0 8px #ffd700)"
                ],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                repeatType: "reverse"
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
                  rotate: `${i * 45}deg`
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  y: [-5, -15, -5]
                }}
                transition={{
                  duration: 0.6,
                  delay: 0.1 + (i * 0.05),
                  repeat: Infinity,
                  repeatDelay: 2
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
              transition: { duration: 0.2 }
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
                damping: 20
              }
            }}
            exit={{ scale: 0, rotateY: 180 }}
            className="relative"
          >
            <motion.div
              animate={{
                filter: [
                  "drop-shadow(0 0 8px #00ff88)",
                  "drop-shadow(0 0 15px #00ff88)",
                  "drop-shadow(0 0 8px #00ff88)"
                ],
                x: [0, -1, 1, 0]
              }}
              transition={{
                duration: 0.1,
                repeat: Infinity,
                repeatType: "mirror",
                repeatDelay: Math.random() * 2 + 1
              }}
            >
              <FaTerminal className="text-green-400 text-lg" />
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
                  left: "-10px"
                }}
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scaleX: [0, 1, 0],
                  x: [0, 30, 0]
                }}
                transition={{
                  duration: 0.2,
                  delay: Math.random() * 0.1,
                  repeat: Infinity,
                  repeatDelay: Math.random() * 1.5 + 0.5
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
              transition: { duration: 0.2 }
            }}
          >
            <FaTerminal className="text-gray-400 hover:text-green-400 text-lg transition-colors duration-200" />
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
                damping: 30
              }
            }}
            exit={{ scale: 0, rotate: 90 }}
            className="relative"
          >
            <motion.div
              animate={{
                filter: [
                  "drop-shadow(0 0 8px #4ade80)",
                  "drop-shadow(0 0 20px #4ade80)",
                  "drop-shadow(0 0 8px #4ade80)"
                ]
              }}
              transition={{
                duration: 1,
                ease: "easeInOut"
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
                  y: "-50%"
                }}
                initial={{ scale: 0, opacity: 1 }}
                animate={{
                  scale: [0, 1.5],
                  opacity: [1, 0]
                }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.1,
                  ease: "easeOut"
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
              transition: { duration: 0.2 }
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
  const [gameData, setGameData] = useState(null);
  const [localRating, setLocalRating] = useState("0");
  const [franchiseGames, setFranchiseGames] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [showGameModal, setShowGameModal] = useState(false);

  // Hide body scrollbar when modal is open
  useEffect(() => {
    if (showGameModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
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
    removeGameFromCategory
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

  // Helper function to remove all individual games from this franchise from ranking
  const removeIndividualGamesFromRanking = () => {
    if (!franchiseGames) return;
    
    franchiseGames.forEach(game => {
      const gameCard = cards.find(c => c.text?.toLowerCase() === game.name.toLowerCase());
      if (gameCard) {
        const gameRating = localStorage.getItem(`rating-${gameCard.id}`);
        if (getRatingValue(gameRating) > 0) {
          localStorage.removeItem(`rating-${gameCard.id}`);
          
          // If this was a ranking-only card, remove it completely
          // Otherwise, just reset the rating
          if (gameCard.isRankingOnly) {
            setCards(prev => prev.filter(c => c.id !== gameCard.id));
          } else {
            setCards(prev => prev.map(c => c.id === gameCard.id ? { ...c, rating: '0' } : c));
          }
        }
      }
    });
  };

  // Helper function to get rating value from localStorage
  const getRatingValue = (ratingData) => {
    if (!ratingData) return 0;
    try {
      // Try to parse as JSON (new format)
      const parsed = JSON.parse(ratingData);
      return parseFloat(parsed.rating || '0');
    } catch {
      // Fall back to old format (just the number)
      return parseFloat(ratingData || '0');
    }
  };

  // Check if a game can be ranked (allow both franchise and individual games to be ranked)
  const canRankGame = (gameName) => {
    const gameCard = cards.find(c => c.text?.toLowerCase() === gameName.toLowerCase());
    
    // For individual games, only check if this specific game is already ranked
    if (gameName.toLowerCase() !== franchiseName.toLowerCase()) {
      // Check if this specific game is already ranked
      if (gameCard) {
        const gameRating = localStorage.getItem(`rating-${gameCard.id}`);
        if (parseFloat(gameRating || '0') > 0) {
          return false; // Already ranked
        }
      }
      
      return true; // Allow individual games to be ranked regardless of franchise status
    }
    
    // If this is the franchise card itself
    if (gameName.toLowerCase() === franchiseName.toLowerCase()) {
      // Check if franchise is already ranked
      const franchiseCard = cards.find(c => c.text?.toLowerCase() === franchiseName.toLowerCase());
      if (franchiseCard) {
        const franchiseRating = localStorage.getItem(`rating-${franchiseCard.id}`);
        if (parseFloat(franchiseRating || '0') > 0) {
          return false; // Already ranked
        }
      }
      
      return true; // Allow franchise to be ranked regardless of individual game status
    }
    
    return true;
  };

  // Check if a game is already ranked
  const isGameRanked = (gameName) => {
    const gameCard = cards.find(c => c.text?.toLowerCase() === gameName.toLowerCase());
    if (gameCard) {
      const gameRating = localStorage.getItem(`rating-${gameCard.id}`);
      return parseFloat(gameRating || '0') > 0;
    }
    return false;
  };

  // Rank an individual game
  const rankGame = (game) => {
    // Check if game card already exists
    let gameCard = cards.find(c => c.text?.toLowerCase() === game.name.toLowerCase());
    
    if (!gameCard) {
      // Create new card for this game - mark it as ranking-only (not for homepage)
      gameCard = {
        id: Date.now(),
        text: game.name,
        image: game.background_image,
        isRankingOnly: true, // Flag to indicate this card should not appear on homepage
      };
      setCards(prev => [...prev, gameCard]);
    }
    
    // Set a default rating of 5 for ranked games (simple string format)
    localStorage.setItem(`rating-${gameCard.id}`, '5');
    
    // Update cards state to reflect the rating
    setCards(prev => prev.map(c => c.id === gameCard.id ? { ...c, rating: '5' } : c));
  };

  // Unrank an individual game
  const unrankGame = (gameName) => {
    const gameCard = cards.find(c => c.text?.toLowerCase() === gameName.toLowerCase());
    if (gameCard) {
      localStorage.removeItem(`rating-${gameCard.id}`);
      
      // If this was a ranking-only card, remove it completely
      // Otherwise, just reset the rating
      if (gameCard.isRankingOnly) {
        setCards(prev => prev.filter(c => c.id !== gameCard.id));
      } else {
        setCards(prev => prev.map(c => c.id === gameCard.id ? { ...c, rating: '0' } : c));
      }
    }
  };

  // Helper functions to check if a game is in different categories
  const isGameInFavorites = (game) => {
    return favoriteGames.some(favGame => favGame.id === game.id);
  };

  const isGameInCurrentGames = (game) => {
    return currentGames.some(currentGame => currentGame.id === game.id);
  };

  const isGameInNextGames = (game) => {
    return nextGames.some(nextGame => nextGame.id === game.id);
  };

  const isGameInFinishedGames = (game) => {
    return finishedGames.some(finishedGame => finishedGame.id === game.id);
  };

  // Helper function to create a game object suitable for context functions
  const createGameObject = (game) => {
    return {
      id: game.id,
      name: game.name,
      image: game.background_image,
      genres: game.genres?.map(g => g.name).join(", ") || "N/A",
      released: game.released,
      platforms: game.platforms?.map(p => p.platform.name).join(", ") || "N/A"
    };
  };

  // Action handlers for favorites and game categories
  const handleToggleFavorite = (game) => {
    const gameObj = createGameObject(game);
    if (isGameInFavorites(game)) {
      removeFromFavorites(game.id);
    } else {
      addToFavorites(gameObj);
    }
  };

  const handleToggleCurrentGame = (game) => {
    const gameObj = createGameObject(game);
    if (isGameInCurrentGames(game)) {
      removeGameFromCategory(game.id, 'current');
    } else {
      setGameAsCurrentGame(gameObj);
    }
  };

  const handleToggleNextGame = (game) => {
    const gameObj = createGameObject(game);
    if (isGameInNextGames(game)) {
      removeGameFromCategory(game.id, 'next');
    } else {
      setGameAsNextGame(gameObj);
    }
  };

  const handleToggleFinishedGame = (game) => {
    const gameObj = createGameObject(game);
    if (isGameInFinishedGames(game)) {
      removeGameFromCategory(game.id, 'finished');
    } else {
      setGameAsFinishedGame(gameObj);
    }
  };

  useEffect(() => {
const fetchGameData = async () => {
      try {
        const cacheKey = cacheUtils.getCacheKey('franchise', franchiseName);
        const cachedData = cacheUtils.getCachedData(cacheKey);
        if (cachedData) {
          setGameData(cachedData);
          return;
        }

        const searchRes = await fetch(
          `https://api.rawg.io/api/games?search=${encodeURIComponent(
            franchiseName
          )}&page_size=1&key=${API_KEY}`
        );
        const { results } = await searchRes.json();
        if (!results?.length) return;

        const gameRes = await fetch(
          `https://api.rawg.io/api/games/${results[0].id}?key=${API_KEY}`
        );
        const full = await gameRes.json();

        // Determine if header title is actually a franchise name or a game name
        const normalize = (str) => str?.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();
        const headerTitleNormalized = normalize(franchiseName);
        const gameNameNormalized = normalize(full.name);
        
        // Check if the header title exactly matches the game name
        const isExactGameMatch = headerTitleNormalized === gameNameNormalized;
        
        // Check if header title might be a franchise/publisher name
        const publisherNames = full.publishers?.map(p => normalize(p.name)) || [];
        const developerNames = full.developers?.map(d => normalize(d.name)) || [];
        const isPublisherMatch = publisherNames.some(pub => 
          pub.includes(headerTitleNormalized) || headerTitleNormalized.includes(pub)
        );
        const isDeveloperMatch = developerNames.some(dev => 
          dev.includes(headerTitleNormalized) || headerTitleNormalized.includes(dev)
        );
        
        const gameData = {
          name: full.name,
          image: full.background_image,
          genres: full.genres?.map((g) => g.name).join(", ") || "N/A",
          publishers: full.publishers?.map((p) => p.name) || [],
          publisherSlugs: full.publishers?.map((p) => p.slug) || [],
          developers: full.developers?.map((d) => d.name) || [],
          rating: full.rating ?? "N/A",
          // Add flags to determine what the header title represents
          headerIsExactGame: isExactGameMatch,
          headerIsFranchise: !isExactGameMatch && (isPublisherMatch || isDeveloperMatch),
        };
        setGameData(gameData);
        cacheUtils.setCachedData(cacheKey, gameData);
      } catch (err) {
        console.error("Error loading game data:", err);
      }
    };

    fetchGameData();
  }, [franchiseName, localCard?.isFranchiseCard, reloadKey]);

  useEffect(() => {
    if (!gameData?.publisherSlugs?.length || !gameData?.publishers?.length)
      return;
    setFranchiseGames(null);

const fetchFranchiseGames = async () => {
      try {
        const isGameCard = localCard?.isFranchiseCard === false;
        const isFranchiseCard = localCard?.isFranchiseCard === true;
        
        let cacheKey, apiUrl;
        
        // Always use publisher-based search to get games from same franchise
        const slugs = gameData.publisherSlugs.join(",");
        cacheKey = cacheUtils.getCacheKey('franchiseGames', `${slugs}_${isFranchiseCard}`);
        apiUrl = `https://api.rawg.io/api/games?publishers=${slugs}&page_size=40&key=${API_KEY}`;
        
        const cachedData = cacheUtils.getCachedData(cacheKey);
        if (cachedData) {
          setFranchiseGames(cachedData);
          return;
        }

        const res = await fetch(apiUrl);
        const data = await res.json();

        const normalize = (str) => str?.toLowerCase().trim();
        const targetPublishers = gameData.publishers?.map(normalize) || [];

        const filtered = await Promise.all(
          data.results.map(async (game) => {
            try {
              const detailRes = await fetch(
                `https://api.rawg.io/api/games/${game.id}?key=${API_KEY}&add_stores=true`
              );
              const full = await detailRes.json();
              const stores = await fetchStoreLinks(game.id);

              const normalize = (str) =>
                str
                  ?.toLowerCase()
                  .replace(/[^a-z0-9\s]/g, "")
                  .trim();

              const romanToNumber = {
                i: 1,
                ii: 2,
                iii: 3,
                iv: 4,
                v: 5,
                vi: 6,
                vii: 7,
                viii: 8,
                ix: 9,
                x: 10,
                xi: 11,
                xii: 12,
              };

              const normalizeWord = (word) => {
                const lower = word.toLowerCase();
                return romanToNumber[lower]
                  ? romanToNumber[lower].toString()
                  : lower;
              };

              const getNormalizedWords = (text) =>
                normalize(text).split(/\s+/).map(normalizeWord);

              const gameDevNames =
                full.developers?.map((d) => normalize(d.name)) || [];
              const gamePubNames =
                full.publishers?.map((p) => normalize(p.name)) || [];

              const localText = localCard?.text?.toLowerCase().trim();
              const localWords = getNormalizedWords(localText);
              const gameWords = getNormalizedWords(game.name);

              const exactNameMatch =
                normalize(localText) === normalize(game.name);
              const includesSubstring = normalize(game.name).includes(
                normalize(localText)
              );
              const includesAllWords = localWords.every((word) =>
                gameWords.includes(word)
              );

              let matches = false;
              
              if (isFranchiseCard) {
                // Franchise mode: Show all games from same publisher/developer
                matches = targetPublishers.some((targetPub) => {
                  // Check if game's publishers/developers match
                  return gameDevNames.some(gameDev => 
                    gameDev.includes(targetPub) || targetPub.includes(gameDev)
                  ) || gamePubNames.some(gamePub => 
                    gamePub.includes(targetPub) || targetPub.includes(gamePub)
                  );
                });
              } else {
                // Game mode: Show only exact game name matches (and remove duplicates)
                matches = exactNameMatch;
              }

              return matches
                ? {
                    ...full,
                    stores: stores || [],
                  }
                : null;
            } catch {
              return null;
            }
          })
        );

        const filteredGames = filtered.filter(Boolean);
        setFranchiseGames(filteredGames);
        cacheUtils.setCachedData(cacheKey, filteredGames);
      } catch (err) {
        console.error("Error fetching franchise games:", err);
      }
    };

    fetchFranchiseGames();
  }, [gameData?.publisherSlugs, gameData?.publishers]);

  const fetchStoreLinks = async (id) => {
    try {
      const cacheKey = cacheUtils.getCacheKey('stores', id);
      const cachedData = cacheUtils.getCachedData(cacheKey);
      if (cachedData) {
        return cachedData;
      }

      const res = await fetch(
        `https://api.rawg.io/api/games/${id}/stores?key=${API_KEY}`
      );
      const data = await res.json();
      const storeData = data.results || [];
      cacheUtils.setCachedData(cacheKey, storeData);
      return storeData;
    } catch {
      return [];
    }
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
      let newValue = Math.max(0, Math.min(10, parseFloat(localRating) - delta));
      
      const valueStr = newValue.toString();
      const previousRating = parseFloat(localRating);
      
      setLocalRating(valueStr);
      updateRating(valueStr);
      
    };

    input.addEventListener("wheel", handleWheel, { passive: false });
    return () => input.removeEventListener("wheel", handleWheel);
  }, [localRating, localCard?.id, franchiseName, franchiseGames, cards]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#131313] text-white relative px-4 sm:px-6 lg:px-8 pr-16 sm:pr-20 md:pr-24 lg:pr-28">
      {/* Floating 3-dot menu button */}
      <button
        onClick={() => setShowGameModal(true)}
        className="fixed top-4 right-4 sm:top-6 sm:right-6 md:right-8 lg:right-10 z-50 p-2 sm:p-3 bg-[#1b1b1b] hover:bg-[#2a2a2a] text-white rounded-full shadow-lg transition-colors duration-200 border border-gray-600 mb-4"
        title="Manage Games"
      >
        <MdMoreVert className="text-lg sm:text-xl" />
      </button>

      {/* Game Management Modal */}
      {showGameModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-cover bg-center bg-black bg-opacity-50"
          style={{ 
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("/samurai.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backdropFilter: 'blur(3px)'
          }}
        >
          <div className="bg-[#1b1b1b]/95 backdrop-blur-sm rounded-xl border border-gray-600 w-11/12 max-w-4xl max-h-[85vh] sm:max-h-[80vh] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-600">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                Manage {localCard?.text || gameData?.name || "Games"} Collection
              </h2>
              <button
                onClick={() => setShowGameModal(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                <IoMdClose className="text-lg sm:text-xl" />
              </button>
            </div>
            
            <div className="p-3 sm:p-4 overflow-y-auto max-h-[calc(85vh-80px)] sm:max-h-[calc(80vh-80px)] space-y-3">
              {franchiseGames === null ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">Loading games...</p>
                </div>
              ) : franchiseGames.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">No games found in this collection.</p>
                </div>
              ) : (
                franchiseGames
                  .filter((game) => {
                    // Filter out games without store links
                    if (!game.stores || game.stores.length === 0) {
                      // Special case: Allow Minecraft even without store data since it has hardcoded link
                      return game.name?.toLowerCase().includes('minecraft');
                    }
                    // Check if game has any valid store links
                    const hasValidStores = game.stores.some(store => {
                      if ((store.store?.name === 'Steam' || store.store_id === 1) && store.url) {
                        return true;
                      }
                      if ((store.store?.name === 'Epic Games' || store.store_id === 11) && store.url) {
                        return true;
                      }
                      return false;
                    });
                    return hasValidStores;
                  })
                  .sort((a, b) => new Date(b.released) - new Date(a.released))
                  .map((game) => (
                    <div
                      key={game.id}
                      className="flex items-center gap-2 sm:gap-4 bg-[#2a2a2a] p-2 sm:p-3 rounded-lg hover:bg-[#3a3a3a] transition-colors"
                    >
                      <img
                        src={game.background_image || "/fallback.jpg"}
                        onError={(e) => (e.target.src = "/fallback.jpg")}
                        alt={game.name}
                        loading="lazy"
                        className="w-12 h-9 sm:w-16 sm:h-12 object-cover rounded flex-shrink-0"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold text-xs sm:text-sm truncate">
                          {game.name}
                        </h3>
                        <p className="text-gray-400 text-xs">
                          {game.released?.split("-")[0] || "TBA"}
                        </p>
                      </div>
                      
                      {/* Action buttons */}
                      <div className="flex gap-0.5 sm:gap-1 flex-shrink-0">
                        {/* Favorite Button */}
                        <AnimatedHeart
                          isActive={isGameInFavorites(game)}
                          onClick={() => handleToggleFavorite(game)}
                          title={isGameInFavorites(game) ? "Remove from favorites" : "Add to favorites"}
                        />
                        
                        {/* Current Game Button */}
                        <AnimatedFlash
                          isActive={isGameInCurrentGames(game)}
                          onClick={() => handleToggleCurrentGame(game)}
                          title={isGameInCurrentGames(game) ? "Remove from current games" : "Add to current games"}
                        />
                        
                        {/* Next Game Button */}
                        <AnimatedTerminal
                          isActive={isGameInNextGames(game)}
                          onClick={() => handleToggleNextGame(game)}
                          title={isGameInNextGames(game) ? "Remove from next games" : "Add to next games"}
                        />
                        
                        {/* Finished Game Button */}
                        <AnimatedCheckmark
                          isActive={isGameInFinishedGames(game)}
                          onClick={() => handleToggleFinishedGame(game)}
                          title={isGameInFinishedGames(game) ? "Remove from finished games" : "Add to finished games"}
                        />
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-6xl mx-auto mt-6 sm:mt-8 md:mt-10">
        <div className="flex flex-col lg:flex-row items-start gap-4 sm:gap-6 lg:gap-10 border border-white p-4 sm:p-5 rounded-xl bg-[#1b1b1b]">
          <img
            src={localCard?.image || gameData?.image || "/fallback.jpg"}
            onError={(e) => (e.target.src = "/fallback.jpg")}
            alt={gameData?.name}
            loading="lazy"
            className="w-full lg:w-[300px] xl:w-[400px] h-48 sm:h-60 lg:h-72 object-cover rounded-xl flex-shrink-0"
          />
          <div className="flex flex-col space-y-3 sm:space-y-4 lg:space-y-5 w-full">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold break-words">
              {localCard?.text || gameData?.name || "Loading..."}
            </h1>
            <div className="flex flex-col space-y-2 sm:space-y-3 text-sm sm:text-base md:text-lg lg:text-xl">
              <h3 className="break-words">
                <span className="text-[#606e82]">Genre: </span>
                {gameData?.genres || "Loading..."}
              </h3>
              <h3 className="break-words">
                <span className="text-[#606e82]">Publisher: </span>
                {gameData?.publishers?.join(", ") || "Loading..."}
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
        {franchiseGames === null ? (
          <ShimmerCardList count={4} />
        ) : franchiseGames.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm">
            {localCard?.isFranchiseCard ? (
              <>
                No games found from{" "}
                <strong>{gameData.publishers?.join(", ")}</strong>.
              </>
            ) : (
              <>
                No games found with the name <strong>{localCard?.text}</strong>.
              </>
            )}
          </p>
        ) : (
          franchiseGames
            .filter((game) => {
              // Filter out games without store links
              if (!game.stores || game.stores.length === 0) {
                // Special case: Allow Minecraft even without store data since it has hardcoded link
                return game.name?.toLowerCase().includes('minecraft');
              }
              // Check if game has any valid store links
              const hasValidStores = game.stores.some(store => {
                if ((store.store?.name === 'Steam' || store.store_id === 1) && store.url) {
                  return true;
                }
                if ((store.store?.name === 'Epic Games' || store.store_id === 11) && store.url) {
                  return true;
                }
                return false;
              });
              return hasValidStores;
            })
            .sort((a, b) => new Date(b.released) - new Date(a.released))
            .map((game) => (
              <div
                key={game.id}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 bg-[#1b1b1b] p-3 sm:p-4 rounded-xl hover:bg-[#2a2a2a] transition-all cursor-pointer"
              >
                <img
                  src={game.background_image || "/fallback.jpg"}
                  onError={(e) => (e.target.src = "/fallback.jpg")}
                  alt={game.name}
                  loading="lazy"
                  className="w-full sm:w-36 md:w-48 h-20 sm:h-24 md:h-28 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex flex-col justify-between flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-semibold break-words">{game.name}</h2>
                  <p className="text-[#bbbbbb] text-sm sm:text-base">
                    Release Year: {game.released?.split("-")[0] || "TBA"}
                  </p>
                  <p className="text-[#bbbbbb] text-sm sm:text-base break-words">
                    Platforms:{" "}
                    {game.platforms?.map((p) => p.platform.name).join(", ") ||
                      "N/A"}
                  </p>

                  <GameLinks game={game} />
                </div>
                
                {/* Rank Button */}
                <div className="flex flex-col justify-center self-center sm:self-auto flex-shrink-0">
                  {isGameRanked(game.name) ? (
                    <button
                      onClick={() => unrankGame(game.name)}
                      className="p-3 bg-red-600 hover:bg-red-700 text-white text-lg rounded-lg transition-colors duration-200 flex items-center justify-center"
                      title="Remove from ranking"
                    >
                      <IoMdClose />
                    </button>
                  ) : canRankGame(game.name) ? (
                    <button
                      onClick={() => rankGame(game)}
                      className="p-3 bg-blue-600 hover:bg-blue-700 text-white text-lg rounded-lg transition-colors duration-200 flex items-center justify-center"
                      title="Add to ranking"
                    >
                      <FaStar />
                    </button>
                  ) : (
                    <button
                      disabled
                      className="p-3 bg-gray-600 text-gray-400 text-lg rounded-lg cursor-not-allowed flex items-center justify-center"
                      title="Game already ranked"
                    >
                      <MdBlock />
                    </button>
                  )}
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default FranchisePage;
