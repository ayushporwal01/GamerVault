import { createContext, useState, useEffect, useContext, useMemo, useCallback } from "react";

/**
 * Context for managing card state across the application
 * Handles card CRUD operations, search functionality, and localStorage persistence
 */


/**
 * Custom hook for accessing card context
 * @returns {Object} Card context value with state and methods
 * @throws {Error} If used outside of CardProvider
 */
export const useCards = () => {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error('useCards must be used within a CardProvider');
  }
  return context;
};

/**
 * Card provider component that manages global card state
 * Provides card management functionality to all child components
 */
export const CardProvider = ({ children }) => {
  const [cards, setCards] = useState([]);
  const [currentGames, setCurrentGames] = useState([]);
  const [nextGames, setNextGames] = useState([]);
  const [finishedGames, setFinishedGames] = useState([]);
  const [favoriteGames, setFavoriteGames] = useState([]);
  const [rankedGames, setRankedGames] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [draggedGame, setDraggedGame] = useState(null);
  const [isFranchiseView, setIsFranchiseView] = useState(false);

  /**
   * Load cards and category arrays from localStorage on component mount
   * Handles parsing errors gracefully
   */
  useEffect(() => {
    try {
      const savedCards = localStorage.getItem("cards");
      if (savedCards) {
        const parsedCards = JSON.parse(savedCards);
        if (Array.isArray(parsedCards) && parsedCards.length > 0) {
          setCards(parsedCards);
        }
      }

      // Load category arrays
      const savedCurrentGames = localStorage.getItem("currentGames");
      if (savedCurrentGames) {
        const parsedCurrentGames = JSON.parse(savedCurrentGames);
        if (Array.isArray(parsedCurrentGames)) {
          setCurrentGames(parsedCurrentGames);
        }
      }

      const savedNextGames = localStorage.getItem("nextGames");
      if (savedNextGames) {
        const parsedNextGames = JSON.parse(savedNextGames);
        if (Array.isArray(parsedNextGames)) {
          setNextGames(parsedNextGames);
        }
      }

      const savedFinishedGames = localStorage.getItem("finishedGames");
      if (savedFinishedGames) {
        const parsedFinishedGames = JSON.parse(savedFinishedGames);
        if (Array.isArray(parsedFinishedGames)) {
          setFinishedGames(parsedFinishedGames);
        }
      }

      const savedRankedGames = localStorage.getItem("rankedGames");
      if (savedRankedGames) {
        const parsedRankedGames = JSON.parse(savedRankedGames);
        if (Array.isArray(parsedRankedGames)) {
          setRankedGames(parsedRankedGames);
        }
      }
    } catch (error) {
      console.error("Failed to load data from localStorage:", error);
      // Clear corrupted data
      localStorage.removeItem("cards");
      localStorage.removeItem("currentGames");
      localStorage.removeItem("nextGames");
      localStorage.removeItem("finishedGames");
      localStorage.removeItem("rankedGames");
    }
  }, []);

  /**
   * Persist cards to localStorage whenever cards state changes
   * Removes storage entry when no cards exist
   */
  useEffect(() => {
    try {
      if (cards.length > 0) {
        localStorage.setItem("cards", JSON.stringify(cards));
      } else {
        localStorage.removeItem("cards");
      }
    } catch (error) {
      console.error("Failed to save cards to localStorage:", error);
    }
  }, [cards]);

  /**
   * Persist category arrays to localStorage
   */
  useEffect(() => {
    try {
      if (currentGames.length > 0) {
        localStorage.setItem("currentGames", JSON.stringify(currentGames));
      } else {
        localStorage.removeItem("currentGames");
      }
    } catch (error) {
      console.error("Failed to save currentGames to localStorage:", error);
    }
  }, [currentGames]);

  useEffect(() => {
    try {
      if (nextGames.length > 0) {
        localStorage.setItem("nextGames", JSON.stringify(nextGames));
      } else {
        localStorage.removeItem("nextGames");
      }
    } catch (error) {
      console.error("Failed to save nextGames to localStorage:", error);
    }
  }, [nextGames]);

  useEffect(() => {
    try {
      if (finishedGames.length > 0) {
        localStorage.setItem("finishedGames", JSON.stringify(finishedGames));
      } else {
        localStorage.removeItem("finishedGames");
      }
    } catch (error) {
      console.error("Failed to save finishedGames to localStorage:", error);
    }
  }, [finishedGames]);

  useEffect(() => {
    try {
      if (rankedGames.length > 0) {
        localStorage.setItem("rankedGames", JSON.stringify(rankedGames));
      } else {
        localStorage.removeItem("rankedGames");
      }
    } catch (error) {
      console.error("Failed to save rankedGames to localStorage:", error);
    }
  }, [rankedGames]);

  /**
   * Helper function to remove a card from all category arrays
   * @param {number} id - The ID of the card to remove
   */
  const removeCardFromAllCategories = useCallback((id) => {
    setCurrentGames(prev => prev.filter(card => card.id !== id));
    setNextGames(prev => prev.filter(card => card.id !== id));
    setFinishedGames(prev => prev.filter(card => card.id !== id));
  }, []);

  /**
   * Helper function to remove a game from all category arrays (for game objects)
   * @param {number} id - The ID of the game to remove
   */
  const removeGameFromAllCategories = useCallback((id) => {
    setCurrentGames(prev => prev.filter(game => game.id !== id));
    setNextGames(prev => prev.filter(game => game.id !== id));
    setFinishedGames(prev => prev.filter(game => game.id !== id));
  }, []);

  /**
   * Creates and adds a new card with default values
   * Cards are view-specific based on current franchise view state
   */
  const addCard = useCallback(() => {
    const newCard = {
      id: Date.now(),
      text: "Title",
      image: null,
      isFranchiseCard: isFranchiseView, // Set based on current view
    };
    setCards((prev) => [...prev, newCard]);
  }, [isFranchiseView]);

  /**
   * Helper function to clean up all localStorage data related to a card
   * @param {number} id - The ID of the card to clean up
   */
  const cleanupCardLocalStorage = useCallback((id) => {
    // Remove all possible localStorage entries for this card
    localStorage.removeItem(`rating-${id}`);
    localStorage.removeItem(`franchise-genre-${id}`);
    localStorage.removeItem(`franchise-publisher-${id}`);
    localStorage.removeItem(`franchise_data_${id}`);
  }, []);

  /**
   * Removes a card by its ID and cleans up all related localStorage data
   * @param {number} id - The ID of the card to remove
   */
  const removeCard = useCallback((id) => {
    setCards((prev) => prev.filter((card) => card.id !== id));
    // Also remove from all categories when main card is deleted
    removeCardFromAllCategories(id);
    // Clean up all localStorage data for this card
    cleanupCardLocalStorage(id);
  }, [removeCardFromAllCategories, cleanupCardLocalStorage]);

  /**
   * Clears cards from the current view only and related localStorage entries
   * View-specific: only clears franchise cards when in franchise view, game cards when in games view
   */
  const clearAllCards = useCallback(() => {
    // Get cards to be removed (current view only)
    const cardsToRemove = cards.filter(card => {
      if (card.isRankingOnly) return false; // Don't clear ranking-only cards
      // Clear franchise cards when in franchise view, game cards when in games view
      return isFranchiseView ? card.isFranchiseCard : !card.isFranchiseCard;
    });

    // Remove cards from current view only
    setCards(prev => prev.filter(card => {
      if (card.isRankingOnly) return true; // Keep ranking-only cards
      // Keep cards from the opposite view
      return isFranchiseView ? !card.isFranchiseCard : card.isFranchiseCard;
    }));

    // Clean up localStorage entries for removed cards
    cardsToRemove.forEach(card => {
      cleanupCardLocalStorage(card.id);
    });

    // Clean up legacy storage entries only for removed cards
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("card-") || 
            key.startsWith("image-") || 
            key.startsWith("rating-")) {
          const cardId = key.split('-')[1];
          if (cardsToRemove.some(card => card.id.toString() === cardId)) {
            localStorage.removeItem(key);
          }
        }
      });
    } catch (error) {
      console.error("Error cleaning up localStorage:", error);
    }
  }, [cards, isFranchiseView, cleanupCardLocalStorage]);

  /**
   * Clear only ranking-only cards (used when clearing rankings)
   */
  const clearRankingOnlyCards = useCallback(() => {
    setCards(prev => prev.filter(card => !card.isRankingOnly));
  }, []);

  /**
   * Helper function to find a card by ID
   * @param {number} id - The ID of the card to find
   * @returns {Object|null} - The card object or null if not found
   */
  const findCardById = useCallback((id) => {
    return cards.find(card => card.id === id) || null;
  }, [cards]);


  /**
   * Creates a deep copy of a card using pass-by-value concept
   * Ensures complete independence between original and copy
   * @param {Object} card - The original card object
   * @returns {Object} - A completely independent copy
   */
  const createCardCopy = useCallback((card) => {
    // Deep clone using JSON methods (pass-by-value)
    // This ensures no references are shared between original and copy
    return JSON.parse(JSON.stringify({
      ...card,
      // Add a timestamp to make it unique (optional)
      copiedAt: new Date().toISOString(),
      // Keep the original ID to maintain relationships
      originalId: card.id
    }));
  }, []);

  /**
   * Persist favoriteGames to localStorage
   */
  useEffect(() => {
    try {
      if (favoriteGames.length > 0) {
        localStorage.setItem("favoriteGames", JSON.stringify(favoriteGames));
      } else {
        localStorage.removeItem("favoriteGames");
      }
    } catch (error) {
      console.error("Failed to save favoriteGames to localStorage:", error);
    }
  }, [favoriteGames]);

  /**
   * Load favorite games from localStorage
   */
  useEffect(() => {
    try {
      const savedFavoriteGames = localStorage.getItem("favoriteGames");
      if (savedFavoriteGames) {
        const parsedFavoriteGames = JSON.parse(savedFavoriteGames);
        if (Array.isArray(parsedFavoriteGames)) {
          setFavoriteGames(parsedFavoriteGames);
        }
      }
    } catch (error) {
      console.error("Failed to load favoriteGames from localStorage:", error);
      localStorage.removeItem("favoriteGames");
    }
  }, []);

  // Add to favorites, but remove from current/next/finished first
  const addToFavorites = useCallback((game) => {
    // Remove from other categories
    removeGameFromAllCategories(game.id);
    setCurrentGames(prev => prev.filter(g => g.id !== game.id));
    setNextGames(prev => prev.filter(g => g.id !== game.id));
    setFinishedGames(prev => prev.filter(g => g.id !== game.id));
    setFavoriteGames(prev => {
      const exists = prev.some(g => g.id === game.id);
      if (!exists) {
        return [...prev, game];
      }
      return prev;
    });
  }, [removeGameFromAllCategories]);

  /**
   * Removes a game from favorites
   * @param {number} gameId - The ID of the game to remove
   */
  const removeFromFavorites = useCallback((gameId) => {
    setFavoriteGames(prev => prev.filter(game => game.id !== gameId));
  }, []);

  /**
   * Clears all favorite games
   */
  const clearFavorites = useCallback(() => {
    setFavoriteGames([]);
  }, []);

  // Add to current, but remove from next/finished/favorites first
  const setGameAsCurrentGame = useCallback((game) => {
    removeGameFromAllCategories(game.id);
    setFavoriteGames(prev => prev.filter(g => g.id !== game.id));
    setCurrentGames(prev => {
      const exists = prev.some(g => g.id === game.id);
      if (!exists) {
        return [...prev, { ...game, addedAt: new Date().toISOString() }];
      }
      return prev;
    });
  }, [removeGameFromAllCategories]);

  // Add to next, but remove from current/finished/favorites first
  const setGameAsNextGame = useCallback((game) => {
    removeGameFromAllCategories(game.id);
    setFavoriteGames(prev => prev.filter(g => g.id !== game.id));
    setNextGames(prev => {
      const exists = prev.some(g => g.id === game.id);
      if (!exists) {
        return [...prev, { ...game, addedAt: new Date().toISOString() }];
      }
      return prev;
    });
  }, [removeGameFromAllCategories]);

  // Add to finished, but remove from current/next/favorites first
  const setGameAsFinishedGame = useCallback((game) => {
    removeGameFromAllCategories(game.id);
    setFavoriteGames(prev => prev.filter(g => g.id !== game.id));
    setFinishedGames(prev => {
      const exists = prev.some(g => g.id === game.id);
      if (!exists) {
        return [...prev, { ...game, addedAt: new Date().toISOString() }];
      }
      return prev;
    });
  }, [removeGameFromAllCategories]);

  /**
   * Removes a game from a specific category by game ID
   * @param {number} gameId - The ID of the game to remove
   * @param {string} category - The category to remove from ('current', 'next', 'finished')
   */
  const removeGameFromCategory = useCallback((gameId, category) => {
    switch (category) {
      case 'current':
        setCurrentGames(prev => prev.filter(game => game.id !== gameId));
        break;
      case 'next':
        setNextGames(prev => prev.filter(game => game.id !== gameId));
        break;
      case 'finished':
        setFinishedGames(prev => prev.filter(game => game.id !== gameId));
        break;
    }
  }, []);




  /**
   * Removes a card from a specific category
   * @param {number} id - The ID of the card to remove
   * @param {string} category - The category to remove from ('current', 'next', 'finished')
   */
  const removeFromCategory = useCallback((id, category) => {
    switch (category) {
      case 'current':
        setCurrentGames(prev => prev.filter(card => card.id !== id));
        break;
      case 'next':
        setNextGames(prev => prev.filter(card => card.id !== id));
        break;
      case 'finished':
        setFinishedGames(prev => prev.filter(card => card.id !== id));
        break;
    }
  }, []);

  /**
   * Clears all cards from the current games category
   */
  const clearCurrentGames = useCallback(() => {
    setCurrentGames([]);
  }, []);

  /**
   * Clears all cards from the next games category
   */
  const clearNextGames = useCallback(() => {
    setNextGames([]);
  }, []);

  /**
   * Clears all cards from the finished games category
   */
  const clearFinishedGames = useCallback(() => {
    setFinishedGames([]);
  }, []);

  /**
   * Creates a simple rank entry with only title
   * @param {Object} card - The original card object
   * @returns {Object} - A simplified rank entry
   */
  const createRankEntry = useCallback((card) => {
    return {
      id: card.id,
      text: card.text,
      rankedAt: new Date().toISOString()
    };
  }, []);

  /**
   * Adds a card to the ranking list or creates a new ranking item
   * @param {number|Object} idOrItem - The ID of the card to add or a direct item object
   */
  const addToRanking = useCallback((idOrItem) => {
    // If it's a direct item object (for new ranking items)
    if (typeof idOrItem === 'object' && idOrItem !== null) {
      setRankedGames(prev => [...prev, idOrItem]);
      return;
    }

    // If it's an ID, find the card and add it
    const originalCard = findCardById(idOrItem);
    if (!originalCard) return;

    // Check if already ranked
    const alreadyRanked = rankedGames.some(game => game.id === idOrItem);
    if (alreadyRanked) return;

    // Create a simple rank entry with only title
    const rankEntry = createRankEntry(originalCard);
    
    // Add to the end of the ranking
    setRankedGames(prev => [...prev, rankEntry]);
  }, [findCardById, rankedGames, createRankEntry]);

  /**
   * Removes a card from the ranking list
   * @param {number} id - The ID of the card to remove from ranking
   */
  const removeFromRanking = useCallback((id) => {
    setRankedGames(prev => prev.filter(game => game.id !== id));
  }, []);

  /**
   * Reorders the ranking list
   * @param {Array} newOrder - The new order of ranked games
   */
  const reorderRanking = useCallback((newOrder) => {
    setRankedGames(newOrder);
  }, []);

  /**
   * Clears all cards from the ranking
   */
  const clearRanking = useCallback(() => {
    setRankedGames([]);
  }, []);

  /**
   * Reorders the current games array
   * @param {Array} newOrder - The new order of current games
   */
  const reorderCurrentGames = useCallback((newOrder) => {
    setCurrentGames(newOrder);
  }, []);

  /**
   * Reorders the next games array
   * @param {Array} newOrder - The new order of next games
   */
  const reorderNextGames = useCallback((newOrder) => {
    setNextGames(newOrder);
  }, []);

  /**
   * Reorders the finished games array
   * @param {Array} newOrder - The new order of finished games
   */
  const reorderFinishedGames = useCallback((newOrder) => {
    setFinishedGames(newOrder);
  }, []);

  /**
   * Reorders the favorite games array
   * @param {Array} newOrder - The new order of favorite games
   */
  const reorderFavoriteGames = useCallback((newOrder) => {
    setFavoriteGames(newOrder);
  }, []);

  /**
   * Toggles a game in a category: if present, removes from all; if not, removes from all and adds to selected
   * @param {Object} game - The game object
   * @param {string} category - One of 'current', 'next', 'finished', 'favorites'
   */
  const toggleGameInCategory = useCallback((game, category) => {
    let isAlreadyInCategory = false;
    switch (category) {
      case 'current':
        isAlreadyInCategory = currentGames.some(g => g.id === game.id);
        break;
      case 'next':
        isAlreadyInCategory = nextGames.some(g => g.id === game.id);
        break;
      case 'finished':
        isAlreadyInCategory = finishedGames.some(g => g.id === game.id);
        break;
      case 'favorites':
        isAlreadyInCategory = favoriteGames.some(g => g.id === game.id);
        break;
      default:
        break;
    }
    if (isAlreadyInCategory) return;
    // Remove from all categories using functional updates
    setCurrentGames(prev => prev.filter(g => g.id !== game.id));
    setNextGames(prev => prev.filter(g => g.id !== game.id));
    setFinishedGames(prev => prev.filter(g => g.id !== game.id));
    setFavoriteGames(prev => prev.filter(g => g.id !== game.id));
    // Add to the selected category after removals
    setTimeout(() => {
      switch (category) {
        case 'current':
          setCurrentGames(prev => [...prev, { ...game, addedAt: new Date().toISOString() }]);
          break;
        case 'next':
          setNextGames(prev => [...prev, { ...game, addedAt: new Date().toISOString() }]);
          break;
        case 'finished':
          setFinishedGames(prev => [...prev, { ...game, addedAt: new Date().toISOString() }]);
          break;
        case 'favorites':
          setFavoriteGames(prev => [...prev, game]);
          break;
        default:
          break;
      }
    }, 0);
  }, [currentGames, nextGames, finishedGames, favoriteGames]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      // State
      cards,
      currentGames,
      nextGames,
      finishedGames,
      favoriteGames,
      rankedGames,
      searchInput,
      draggedGame,
      isFranchiseView,
      
      // Essential setters
      setCards,
      setSearchInput,
      setDraggedGame,
      setIsFranchiseView,
      
      // Actions
      addCard,
      removeCard,
      clearAllCards,
      
      // Category management (for cards)
      removeFromCategory,
      
      // Game-level category management
      setGameAsCurrentGame,
      setGameAsNextGame,
      setGameAsFinishedGame,
      removeGameFromCategory,
      
      // Favorites management
      addToFavorites,
      removeFromFavorites,
      clearFavorites,
      
      // Section clearing
      clearCurrentGames,
      clearNextGames,
      clearFinishedGames,
      
      // Ranking management
      addToRanking,
      removeFromRanking,
      reorderRanking,
      clearRanking,
      
      // Game category reordering
      reorderCurrentGames,
      reorderNextGames,
      reorderFinishedGames,
      reorderFavoriteGames,
      toggleGameInCategory,
    }),
    [cards, currentGames, nextGames, finishedGames, favoriteGames, rankedGames, searchInput, draggedGame, isFranchiseView, addCard, removeCard, clearAllCards, removeFromCategory, setGameAsCurrentGame, setGameAsNextGame, setGameAsFinishedGame, removeGameFromCategory, addToFavorites, removeFromFavorites, clearFavorites, clearCurrentGames, clearNextGames, clearFinishedGames, addToRanking, removeFromRanking, reorderRanking, clearRanking, reorderCurrentGames, reorderNextGames, reorderFinishedGames, reorderFavoriteGames, toggleGameInCategory]
  );

  return (
    <CardContext.Provider value={contextValue}>
      {children}
    </CardContext.Provider>
  );
};
