import { useState, useEffect, useMemo } from 'react';
import { useCards } from '../utils/CardContext';
import { FaTrash, FaEllipsisV } from 'react-icons/fa';
import { Reorder } from 'framer-motion';

const Rank = () => {
  const { cards } = useCards();
  const [rankedGames, setRankedGames] = useState([]);
  const [showFranchiseMode, setShowFranchiseMode] = useState(() => {
    // Load ranking mode preference from localStorage
    const saved = localStorage.getItem('rankingMode');
    return saved === 'franchise';
  });
  const [showDropdown, setShowDropdown] = useState(false);

  // Helper function to get rating from localStorage
  const getRating = (cardId) => {
    const ratingData = localStorage.getItem(`rating-${cardId}`);
    return parseFloat(ratingData || '0');
  };

  // Create ranked games based on ratings from cards and current mode
  const createRankedGames = useMemo(() => {
    // Get all cards that have ratings
    const cardsWithRatings = cards
      .map(card => {
        const rating = getRating(card.id);
        return {
          ...card,
          rating: rating
        };
      })
      .filter(card => {
        // Only include cards with ratings > 0
        if (card.rating <= 0) return false;
        
        // Filter based on current ranking mode
        if (showFranchiseMode) {
          // Franchise mode: show only franchise cards (isFranchiseCard === true)
          // Also include cards without the flag set (legacy cards) that aren't ranking-only
          return card.isFranchiseCard === true || 
                 (card.isFranchiseCard === undefined && !card.isRankingOnly);
        } else {
          // Game mode: show only individual game cards (isFranchiseCard === false) 
          // and ranking-only cards (individual games ranked from franchise pages)
          return card.isFranchiseCard === false || card.isRankingOnly === true;
        }
      });

    // Sort by rating (highest first) and by game name alphabetically if equal
    const sorted = cardsWithRatings.sort((a, b) => {
      if (b.rating !== a.rating) {
        return b.rating - a.rating; // Higher rating first
      }
      // Alphabetically by game name
      return a.text.localeCompare(b.text);
    });

    return sorted;
  }, [cards, showFranchiseMode]);

  // Update ranked games when cards or ratings change
  useEffect(() => {
    setRankedGames(createRankedGames);
  }, [createRankedGames]);

  // Clear all rankings (reset all ratings to 0)
  const clearAllRankings = () => {
    cards.forEach(card => {
      localStorage.removeItem(`rating-${card.id}`);
    });
    setRankedGames([]);
  };

  // Remove individual game from ranking
  const removeIndividualRanking = (gameId) => {
    localStorage.removeItem(`rating-${gameId}`);
    setRankedGames(prev => prev.filter(game => game.id !== gameId));
  };

  // Toggle between franchise and game ranking modes
  const toggleRankingMode = () => {
    const newMode = !showFranchiseMode;
    setShowFranchiseMode(newMode);
    // Save preference to localStorage
    localStorage.setItem('rankingMode', newMode ? 'franchise' : 'game');
    setShowDropdown(false); // Close dropdown after action
  };

  // Handle dropdown toggle
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Handle dropdown menu actions
  const handleDropdownAction = (action) => {
    if (action === 'toggle') {
      toggleRankingMode();
    } else if (action === 'clear') {
      clearAllRankings();
      setShowDropdown(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.dropdown-container')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <div className="min-h-screen bg-black text-white font-['Inter',sans-serif] relative pb-20 sm:pb-8">
      {/* Content layer */}
      <div className="relative z-10">
      
      {/* Control buttons - positioned absolutely at top right */}
      <div className="fixed top-4 right-4 z-50">
        {/* Mobile/Tablet/Less than Desktop 3 dots menu */}
        <div className="lg:hidden dropdown-container relative">
          <button
            onClick={toggleDropdown}
            className="p-3 text-white rounded-full transition-all duration-200 hover:bg-gray-700 border border-transparent"
            title="Menu"
          >
            <FaEllipsisV className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          
          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-600 rounded-lg shadow-lg overflow-hidden">
              <button
                onClick={() => handleDropdownAction('toggle')}
                className="w-full px-4 py-3 text-left text-white hover:bg-gray-700 transition-colors duration-200 flex items-center gap-3"
              >
                <span className="text-sm font-medium">
                  Switch to {showFranchiseMode ? 'Games' : 'Franchises'}
                </span>
              </button>
              
              <div className="border-t border-gray-600"></div>
              
              <button
                onClick={() => handleDropdownAction('clear')}
                className="w-full px-4 py-3 text-left text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors duration-200 flex items-center gap-3"
              >
                <FaTrash className="w-4 h-4" />
                <span className="text-sm font-medium">Clear All</span>
              </button>
            </div>
          )}
        </div>
        
        {/* Desktop buttons */}
        <div className="hidden lg:flex gap-2 sm:gap-3">
          {/* Ranking Mode Toggle */}
          <button
            onClick={toggleRankingMode}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-full transition-all duration-200 border border-gray-600"
            title={`Switch to ${showFranchiseMode ? 'Game' : 'Franchise'} Rankings`}
          >
            <span className="text-sm font-medium">
              {showFranchiseMode ? 'Franchises' : 'Games'}
            </span>
          </button>
          
          {/* Clear All Button */}
          <button
            onClick={clearAllRankings}
            className="p-3 hover:bg-gray-300 text-white hover:text-black rounded-full transition-all duration-200"
            title="Clear All Rankings"
          >
            <FaTrash className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-6 pt-6">
        {/* Content */}
        {/* Centered heading */}
        <div className="text-center mt-8 sm:mt-8 pt-4 sm:pt-0 mb-8 pb-2">
          <h1 className="text-4xl font-bold font-['Inter',sans-serif]">
            {showFranchiseMode ? 'Franchise' : 'Game'} Leaderboard
          </h1>
        </div>
        
        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            
            {rankedGames.length === 0 ? (
              <div className="text-center flex items-center justify-center min-h-[50vh]">
                <div>
                  <p className="text-gray-400 text-lg mb-4">
                    No {showFranchiseMode ? 'franchises' : 'games'} ranked yet.
                  </p>
                  <p className="text-gray-500 text-sm">
                    {showFranchiseMode 
                      ? 'Rate franchise collections to see them appear here.'
                      : 'Rate individual games to see them appear here.'
                    }
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Reorder.Group axis="y" onReorder={setRankedGames} values={rankedGames}>
                  {rankedGames.map((game, index) => (
                    <Reorder.Item 
                      key={game.id}
                      value={game}
                      className="bg-gray-950 border border-gray-800 rounded-lg pl-3 pr-3 py-1 min-h-[40px] cursor-grab active:cursor-grabbing mb-4"
                    >
                      <div className="flex items-center justify-between">
                        {/* Left Side: Rank and Game Info */}
                        <div className="flex items-center">
                          {/* Rank with # */}
                          <div className="text-lg font-bold text-white min-w-[60px] pl-2 mr-0">
                            #{index + 1}
                          </div>
                          
                          {/* Game Image and Title with normal spacing */}
                          <div className="flex items-center gap-4">
                            {/* Game Image */}
                            <img
                              src={game.image || '/fallback.jpg'}
                              onError={(e) => (e.target.src = '/fallback.jpg')}
                              alt={game.text}
                              loading="lazy"
                              className="w-10 h-10 object-cover rounded-full"
                            />
                            
                            {/* Game Title */}
                            <div className="min-w-0 flex-1">
                              <h3 className="text-base font-semibold text-white truncate">
                                {game.text}
                              </h3>
                            </div>
                          </div>
                        </div>
                        
                        {/* Right Side: Delete Button */}
                        <button
                          onClick={() => removeIndividualRanking(game.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-3 flex-shrink-0"
                          title="Remove from ranking"
                        >
                          <span className="text-3xl">×</span>
                        </button>
                      </div>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Rank;
