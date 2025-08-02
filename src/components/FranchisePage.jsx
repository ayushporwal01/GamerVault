import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useCards } from "../utils/CardContext";
import ShimmerCardList from "../utils/ShimmerCardList";
import GameLinks from "./GameLinks";
import CardTypeToggle from "./CardTypeToggle";
import ToggleSwitch from "./ToggleSwitch";
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
 * Updated: Force deployment trigger
 */
const cacheUtils = {
  /**
   * Generate cache key for different data types
   * @param {string} type - Type of cached data (franchise, stores, etc.)
   * @param {string} identifier - Unique identifier for the data
   * @returns {string} Cache key
   */
  getCacheKey: (type, identifier) => `rawg_cache_v4_${type}_${identifier}`, // v4 for enhanced publisher matching

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
    } catch {
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
    } catch {
      // Silently handle cache write errors
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
    removeGameFromCategory,
  } = useCards();
  const inputRef = useRef(null);

  const localCard = cards.find(
    (c) => c.text?.toLowerCase() === franchiseName.toLowerCase()
  );

  useEffect(() => {
    if (!localCard?.id) return;
    const saved = localStorage.getItem(`rating-${localCard.id}`);
    setLocalRating(saved ?? "0");
  }, [localCard?.id, localCard?.text, localCard?.isFranchiseCard, reloadKey]);

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
    
    setLocalRating(value);
    updateRating(value);
    
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
        // If API limit reached, show basic fallback data
        if (err?.message?.includes("monthly API limit") || err?.toString()?.includes("monthly API limit")) {
          setGameData({
            name: franchiseName,
            image: "/fallback.jpg",
            genres: "N/A (API limit reached)",
            publishers: ["Unknown"],
            publisherSlugs: [],
            developers: ["Unknown"],
            rating: "N/A",
            headerIsExactGame: true,
            headerIsFranchise: false,
          });
        }
      }
    };

    fetchGameData();
  }, [franchiseName, localCard?.isFranchiseCard, reloadKey]);

  useEffect(() => {
    if (!franchiseName) return;
    setFranchiseGames(null);

const fetchFranchiseGames = async () => {
      try {
        // Use the card title directly for searching games
        const searchQuery = franchiseName;
        const cacheKey = cacheUtils.getCacheKey('franchiseGames', `search_${searchQuery}`);
        
        const cachedData = cacheUtils.getCachedData(cacheKey);
        if (cachedData) {
          setFranchiseGames(cachedData);
          return;
        }

        // Multiple search strategies to ensure comprehensive results
        const allResults = new Map(); // Use Map to avoid duplicates
        
        // Strategy 1: Direct search with the franchise name
        const searchUrl1 = `https://api.rawg.io/api/games?search=${encodeURIComponent(searchQuery)}&page_size=40&key=${API_KEY}`;
        const res1 = await fetch(searchUrl1);
        const data1 = await res1.json();
        
        data1.results?.forEach(game => {
          if (game.name.toLowerCase().includes(searchQuery.toLowerCase())) {
            allResults.set(game.id, game);
          }
        });
        
        // Strategy 2: If we have gameData with publisher info, search by publisher names
        if (gameData?.publishers?.length > 0) {
          for (const publisher of gameData.publishers) {
            try {
              // Clean publisher name for search
              const cleanPublisher = publisher.replace(/\s+(entertainment|games?|studios?|interactive|software|inc\.?|ltd\.?|corp\.?|corporation)$/i, '').trim();
              if (cleanPublisher.length >= 3) {
                const publisherSearchUrl = `https://api.rawg.io/api/games?search=${encodeURIComponent(cleanPublisher)}&page_size=40&key=${API_KEY}`;
                const publisherRes = await fetch(publisherSearchUrl);
                const publisherData = await publisherRes.json();
                
                publisherData.results?.forEach(game => {
                  allResults.set(game.id, game);
                });
              }
            } catch (e) {
              console.warn(`Publisher search failed for ${publisher}:`, e);
            }
          }
        }
        
        // Strategy 3: Search with query variations (shortened names, etc.)
        const queryVariations = [];
        const words = searchQuery.toLowerCase().split(' ');
        
        // Add first word if it's substantial
        if (words[0] && words[0].length >= 4) {
          queryVariations.push(words[0]);
        }
        
        // Add combinations of first two words
        if (words.length >= 2 && words[0].length >= 3 && words[1].length >= 3) {
          queryVariations.push(`${words[0]} ${words[1]}`);
        }
        
        for (const variation of queryVariations) {
          try {
            const variationUrl = `https://api.rawg.io/api/games?search=${encodeURIComponent(variation)}&page_size=20&key=${API_KEY}`;
            const variationRes = await fetch(variationUrl);
            const variationData = await variationRes.json();
            
            variationData.results?.forEach(game => {
              allResults.set(game.id, game);
            });
          } catch (e) {
            console.warn(`Variation search failed for ${variation}:`, e);
          }
        }
        
        const filteredResults = Array.from(allResults.values());

        const gamesWithDetails = await Promise.all(
          filteredResults.map(async (game) => {
            try {
              const detailRes = await fetch(
                `https://api.rawg.io/api/games/${game.id}?key=${API_KEY}`
              );
              const full = await detailRes.json();
              const stores = await fetchStoreLinks(game.id);

              return {
                ...full,
                stores: stores || [],
              };
            } catch {
              return {
                ...game,
                stores: [],
              };
            }
          })
        );

// Advanced franchise name matching utilities
        const createAdvancedMatcher = (searchQuery) => {
          const normalizedQuery = searchQuery.toLowerCase().trim();
          
          // Roman numeral mappings
          const romanToNumber = {
            'i': '1', 'ii': '2', 'iii': '3', 'iv': '4', 'v': '5',
            'vi': '6', 'vii': '7', 'viii': '8', 'ix': '9', 'x': '10',
            'xi': '11', 'xii': '12', 'xiii': '13', 'xiv': '14', 'xv': '15',
            'xvi': '16', 'xvii': '17', 'xviii': '18', 'xix': '19', 'xx': '20'
          };
          
          const numberToRoman = Object.fromEntries(
            Object.entries(romanToNumber).map(([roman, num]) => [num, roman])
          );
          
          // Create variations of the search query
          const createQueryVariations = (query) => {
            const variations = new Set([query]);
            
            // Add version with/without common suffixes
            const suffixes = ['game', 'games', 'series', 'collection', 'franchise'];
            suffixes.forEach(suffix => {
              if (query.endsWith(' ' + suffix)) {
                variations.add(query.replace(' ' + suffix, ''));
              } else {
                variations.add(query + ' ' + suffix);
              }
            });
            
            // Handle Roman numerals and numbers
            const words = query.split(' ');
            words.forEach((word, index) => {
              // Convert Roman to number
              if (romanToNumber[word]) {
                const newWords = [...words];
                newWords[index] = romanToNumber[word];
                variations.add(newWords.join(' '));
              }
              
              // Convert number to Roman
              if (numberToRoman[word]) {
                const newWords = [...words];
                newWords[index] = numberToRoman[word];
                variations.add(newWords.join(' '));
              }
              
              // Handle ordinal numbers (1st, 2nd, 3rd, etc.)
              const ordinalMatch = word.match(/^(\d+)(st|nd|rd|th)$/);
              if (ordinalMatch) {
                const number = ordinalMatch[1];
                const newWords = [...words];
                newWords[index] = number;
                variations.add(newWords.join(' '));
                
                if (numberToRoman[number]) {
                  newWords[index] = numberToRoman[number];
                  variations.add(newWords.join(' '));
                }
              }
            });
            
            // Handle colon separators (e.g., "Call of Duty: Modern Warfare" vs "Call of Duty Modern Warfare")
            if (query.includes(':')) {
              variations.add(query.replace(':', ''));
              variations.add(query.replace(':', ' -'));
            }
            
            // Handle ampersand variations
            if (query.includes('&')) {
              variations.add(query.replace('&', 'and'));
            }
            if (query.includes(' and ')) {
              variations.add(query.replace(' and ', ' & '));
            }
            
            return Array.from(variations);
          };
          
          const queryVariations = createQueryVariations(normalizedQuery);
          
          return {
            matchesGameName: (gameName, gamePublishers = [], gameDevelopers = []) => {
              const normalizedGameName = gameName.toLowerCase().trim();
              
              // Direct substring match (original logic)
              if (queryVariations.some(variation => normalizedGameName.includes(variation))) {
                return { matches: true, confidence: 1.0, method: 'direct' };
              }
              
              // Remove publisher names from game title for cleaner matching
              const removePublisherFromTitle = (title, publishers, developers) => {
                let cleanTitle = title;
                [...publishers, ...developers].forEach(company => {
                  const companyLower = company.toLowerCase();
                  // Remove publisher name if it appears at start/end of title
                  const patterns = [
                    new RegExp(`^${companyLower}'?s?\\s+`, 'i'),
                    new RegExp(`\\s+${companyLower}'?s?$`, 'i'),
                    new RegExp(`^${companyLower}\\s*:`, 'i')
                  ];
                  patterns.forEach(pattern => {
                    cleanTitle = cleanTitle.replace(pattern, ' ').trim();
                  });
                });
                return cleanTitle;
              };
              
              const cleanGameName = removePublisherFromTitle(normalizedGameName, gamePublishers, gameDevelopers);
              
              // Try matching with cleaned title
              if (queryVariations.some(variation => cleanGameName.includes(variation))) {
                return { matches: true, confidence: 0.9, method: 'cleaned' };
              }
              
              // Fuzzy matching for partial words
              const calculateSimilarity = (str1, str2) => {
                const words1 = str1.split(/\s+/).filter(w => w.length > 2);
                const words2 = str2.split(/\s+/).filter(w => w.length > 2);
                
                if (words1.length === 0 || words2.length === 0) return 0;
                
                let matchedWords = 0;
                words1.forEach(word1 => {
                  if (words2.some(word2 => 
                    word2.includes(word1) || word1.includes(word2) ||
                    (word1.length > 3 && word2.length > 3 && 
                     (word1.startsWith(word2.substring(0, 3)) || word2.startsWith(word1.substring(0, 3))))
                  )) {
                    matchedWords++;
                  }
                });
                
                return matchedWords / Math.max(words1.length, words2.length);
              };
              
              // Check similarity for each variation
              let bestSimilarity = 0;
              queryVariations.forEach(variation => {
                const similarity = calculateSimilarity(variation, cleanGameName);
                bestSimilarity = Math.max(bestSimilarity, similarity);
              });
              
              if (bestSimilarity > 0.6) {
                return { matches: true, confidence: bestSimilarity * 0.8, method: 'fuzzy' };
              }
              
              return { matches: false, confidence: 0, method: 'none' };
            },
            
            queryVariations
          };
        };
        
        const matcher = createAdvancedMatcher(searchQuery);
        
        // Enhanced filtering logic to include games with publisher/developer names in their titles
        const filterGamesByPublisherDeveloper = (game) => {
          const gamePublishers = game.publishers?.map(p => p.name.toLowerCase()) || [];
          const gameDevelopers = game.developers?.map(d => d.name.toLowerCase()) || [];
          const normalizedGameName = game.name.toLowerCase();
          
          // Check if game name contains any of its own publisher or developer names
          const containsPublisherName = gamePublishers.some(pub => {
            // Remove common suffixes like "entertainment", "games", "studios", etc.
            const cleanPub = pub.replace(/\s+(entertainment|games?|studios?|interactive|software|inc\.?|ltd\.?|corp\.?|corporation)$/i, '').trim();
            if (cleanPub.length < 3) return false; // Skip very short names
            return normalizedGameName.includes(cleanPub);
          });
          
          const containsDeveloperName = gameDevelopers.some(dev => {
            // Remove common suffixes
            const cleanDev = dev.replace(/\s+(entertainment|games?|studios?|interactive|software|inc\.?|ltd\.?|corp\.?|corporation)$/i, '').trim();
            if (cleanDev.length < 3) return false; // Skip very short names
            return normalizedGameName.includes(cleanDev);
          });
          
          return containsPublisherName || containsDeveloperName;
        };

let filteredGames;

        // Enhanced publisher matching function
        const matchesPublisher = (gamePublishers, gameDevelopers, franchisePublishers) => {
          // Normalize all names for comparison
          const normalizeCompanyName = (name) => {
            return name.toLowerCase()
              .replace(/\s+(entertainment|games?|studios?|interactive|software|inc\.?|ltd\.?|corp\.?|corporation|llc)$/i, '')
              .replace(/[^a-z0-9\s]/g, '')
              .trim();
          };
          
          const normalizedGamePublishers = gamePublishers.map(normalizeCompanyName);
          const normalizedGameDevelopers = gameDevelopers.map(normalizeCompanyName);
          const normalizedFranchisePublishers = franchisePublishers.map(normalizeCompanyName);
          
          // Check for exact matches first
          for (const franchisePub of normalizedFranchisePublishers) {
            if (normalizedGamePublishers.includes(franchisePub) || normalizedGameDevelopers.includes(franchisePub)) {
              return true;
            }
          }
          
          // Check for partial matches (company name contains or is contained by franchise publisher)
          for (const franchisePub of normalizedFranchisePublishers) {
            if (franchisePub.length >= 3) {
              for (const gamePub of [...normalizedGamePublishers, ...normalizedGameDevelopers]) {
                if (gamePub.length >= 3) {
                  // Check if names contain each other (bidirectional)
                  if (franchisePub.includes(gamePub) || gamePub.includes(franchisePub)) {
                    return true;
                  }
                  
                  // Check for common abbreviations and variations
                  const franchiseWords = franchisePub.split(' ').filter(w => w.length >= 3);
                  const gameWords = gamePub.split(' ').filter(w => w.length >= 3);
                  
                  // If both have multiple words, check if significant words match
                  if (franchiseWords.length >= 2 && gameWords.length >= 2) {
                    const matchingWords = franchiseWords.filter(fw => 
                      gameWords.some(gw => fw === gw || fw.includes(gw) || gw.includes(fw))
                    );
                    if (matchingWords.length >= Math.min(franchiseWords.length, gameWords.length) * 0.6) {
                      return true;
                    }
                  }
                }
              }
            }
          }
          
          return false;
        };
        
        if (localCard?.isFranchiseCard) {
          filteredGames = gamesWithDetails.filter(game => {
            const gamePublishers = game.publishers?.map(p => p.name) || [];
            const gameDevelopers = game.developers?.map(d => d.name) || [];
            const franchisePublishers = gameData?.publishers || [];
            
            // Use enhanced publisher matching
            const publisherMatch = matchesPublisher(gamePublishers, gameDevelopers, franchisePublishers);
            
            // Also check if game name contains the franchise name (fallback)
            const gameNameMatch = matcher.matchesGameName(game.name, gamePublishers, gameDevelopers);
            
            return publisherMatch || gameNameMatch.matches;
          });
        } else {
          filteredGames = gamesWithDetails.filter(game => {
            const gamePublishers = game.publishers?.map(p => p.name) || [];
            const gameDevelopers = game.developers?.map(d => d.name) || [];
            
            // Use the advanced matcher for name-based matching
            const nameMatch = matcher.matchesGameName(game.name, gamePublishers, gameDevelopers);
            
            // Check if game name contains publisher/developer name
            const containsPublisherDeveloper = filterGamesByPublisherDeveloper(game);
            
            // Also check if any game publisher/developer matches the search query
            const publisherDeveloperQueryMatch = [...gamePublishers, ...gameDevelopers]
              .some(company => {
                const normalizedCompany = company.toLowerCase().replace(/\s+(entertainment|games?|studios?|interactive|software|inc\.?|ltd\.?|corp\.?|corporation)$/i, '').trim();
                return normalizedCompany.includes(searchQuery.toLowerCase()) || 
                       searchQuery.toLowerCase().includes(normalizedCompany);
              });
            
            return nameMatch.matches || containsPublisherDeveloper || publisherDeveloperQueryMatch;
          });
        }

        setFranchiseGames(filteredGames);
        cacheUtils.setCachedData(cacheKey, filteredGames);
      } catch (err) {
        // If API limit reached, show empty games list
        if (err?.message?.includes("monthly API limit") || err?.toString()?.includes("monthly API limit")) {
          setFranchiseGames([]);
        }
      }
    };

    fetchFranchiseGames();
  }, [franchiseName, gameData]);

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
      
      setLocalRating(valueStr);
      updateRating(valueStr);
      
    };

    input.addEventListener("wheel", handleWheel, { passive: false });
    return () => input.removeEventListener("wheel", handleWheel);
  }, [localRating, localCard?.id, franchiseName, franchiseGames, cards, updateRating]);

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
                      return game.name?.toLowerCase() === 'minecraft';
                    }
                    // Check if game has any valid store links
              const hasValidStores = game.stores.some(store => {
                if ((store.store?.name === 'Steam' || store.store_id === 1) && store.url?.startsWith('https://store.steampowered.com')) {
                  return true;
                }
                if ((store.store?.name === 'Epic Games' || store.store_id === 11) && store.url?.startsWith('https://')) {
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
          <div className="text-center py-8">
            <p className="text-gray-400">No games found in this collection.</p>
          </div>
        ) : (
          franchiseGames
            .filter((game) => {
              // Filter out games without store links
              if (!game.stores || game.stores.length === 0) {
                // Special case: Allow Minecraft even without store data since it has hardcoded link
                return game.name?.toLowerCase() === 'minecraft';
              }
              // Check if game has any valid store links
              const hasValidStores = game.stores.some(store => {
                if ((store.store?.name === 'Steam' || store.store_id === 1) && store.url?.startsWith('https://store.steampowered.com')) {
                  return true;
                }
                if ((store.store?.name === 'Epic Games' || store.store_id === 11) && store.url?.startsWith('https://')) {
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
