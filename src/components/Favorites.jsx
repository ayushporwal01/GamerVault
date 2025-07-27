import { useCards } from '../utils/CardContext';
import { motion } from 'framer-motion';
import { FaHeart } from 'react-icons/fa';
import { MdClear } from 'react-icons/md';
import { useState, useRef, useCallback } from 'react';

const Favorites = () => {
  const { favoriteGames, removeFromFavorites, reorderFavoriteGames, clearFavorites } = useCards();
  const [draggingId, setDraggingId] = useState(null);
  const lastOverIdRef = useRef(null);

  /**
   * Handle drag start event
   */
  const handleDragStart = useCallback((e, id) => {
    setDraggingId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', `game-${id}`);
  }, []);

  /**
   * Handle drag over event for reordering games
   */
  const handleDragOver = useCallback((e, overId) => {
    e.preventDefault();
    e.stopPropagation();

    // Skip if no drag in progress or invalid conditions
    if (
      draggingId === null ||
      draggingId === overId ||
      lastOverIdRef.current === overId
    ) {
      return;
    }

    lastOverIdRef.current = overId;

    // Find indices of dragged and target games
    const draggingIndex = favoriteGames.findIndex((game) => game.id === draggingId);
    const overIndex = favoriteGames.findIndex((game) => game.id === overId);

    if (draggingIndex === -1 || overIndex === -1) return;

    // Reorder games array
    const updatedGames = [...favoriteGames];
    const [draggedGame] = updatedGames.splice(draggingIndex, 1);
    updatedGames.splice(overIndex, 0, draggedGame);

    reorderFavoriteGames(updatedGames);
  }, [draggingId, favoriteGames, reorderFavoriteGames]);

  /**
   * Handle drop event
   */
  const handleDrop = useCallback((e, overId) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Reset drag state
    setDraggingId(null);
    lastOverIdRef.current = null;
  }, []);

  /**
   * Handle drag end event
   */
  const handleDragEnd = useCallback(() => {
    setDraggingId(null);
    lastOverIdRef.current = null;
  }, []);

  if (!favoriteGames || favoriteGames.length === 0) {
    return (
      <div className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center text-white relative" style={{backgroundImage: 'url(/4.jpg)'}}>
        {/* Blur overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4 relative z-10"
        >
          <h2 className="text-2xl font-semibold text-gray-300">No Favorite Games Yet</h2>
          <p className="text-gray-400">Add your favorite games from the franchise pages to see them here.</p>
        </motion.div>
      </div>
    );
  }

  const handleRemoveFavorite = (gameId) => {
    removeFromFavorites(gameId);
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat text-white p-4 sm:p-6 md:p-8 relative" style={{backgroundImage: 'url(/4.jpg)'}}>
        {/* Blur overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto relative z-10"
      >
        <div className="text-center mb-8 relative">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
            Favorite Games
          </h1>
          <p className="text-gray-200 drop-shadow-md">Your personally curated collection of amazing games</p>
          <div className="w-24 h-1 bg-gradient-to-r from-red-400 to-pink-400 mx-auto mt-4 rounded-full"></div>
          
          {favoriteGames.length > 0 && (
            <motion.button
              onClick={clearFavorites}
              className="absolute right-0 top-0 flex items-center gap-2 px-4 py-2 bg-gray-700/80 hover:bg-gray-600 border border-gray-500/50 hover:border-red-400/50 text-gray-200 hover:text-white rounded-lg transition-all duration-300 backdrop-blur-sm"
              title="Clear all favorite games"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MdClear className="text-lg" />
              <span>Clear All</span>
            </motion.button>
          )}
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          onDragOver={(e) => e.preventDefault()}
        >
          {favoriteGames.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ 
                scale: draggingId && draggingId !== game.id ? 0.95 : 1.05,
                rotateY: 5,
                transition: { duration: 0.3 }
              }}
              className={`group relative cursor-pointer transition-all duration-200 ${
                draggingId && draggingId !== game.id 
                  ? 'scale-95 opacity-75' 
                  : ''
              }`}
              onDragOver={(e) => handleDragOver(e, game.id)}
              onDrop={(e) => handleDrop(e, game.id)}
            >
              <div 
                className="relative w-full h-72 bg-[#1e1e1e]/50 rounded-xl overflow-hidden backdrop-blur-md border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300"
                draggable
                onDragStart={(e) => handleDragStart(e, game.id)}
                onDragEnd={handleDragEnd}
              >
                {/* Remove from favorites button */}
                <motion.button
                  onClick={() => handleRemoveFavorite(game.id)}
                  className="absolute top-3 right-3 z-10 p-2 bg-black/60 text-red-400 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600 hover:text-white transition-all duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  title="Remove from favorites"
                >
                  <FaHeart className="text-sm" />
                </motion.button>

                {/* Game Image */}
                <div className="relative w-full h-48 overflow-hidden">
                  <motion.img
                    src={game.image || "/fallback.jpg"}
                    onError={(e) => (e.target.src = "/fallback.jpg")}
                    alt={game.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    whileHover={{ filter: "brightness(1.1)" }}
                  />
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Game Title Section */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                  <motion.h3
                    className="text-white font-semibold text-lg leading-tight drop-shadow-lg"
                    initial={{ opacity: 0.8 }}
                    whileHover={{ opacity: 1 }}
                  >
                    {game.name}
                  </motion.h3>
                  
                  {/* Favorite indicator */}
                  <motion.div
                    className="flex items-center gap-2 mt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <FaHeart className="text-red-400 text-sm" />
                    <span className="text-xs text-gray-300">Favorite</span>
                  </motion.div>
                </div>

                {/* Hover effect border */}
                <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-red-400/30 transition-colors duration-300 pointer-events-none"></div>
                
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-400/20 to-pink-400/20 blur-sm"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-[#1e1e1e]/50 rounded-full border border-white/10 backdrop-blur-md">
            <FaHeart className="text-red-400" />
            <span className="text-gray-300">
              {favoriteGames.length} {favoriteGames.length === 1 ? 'Favorite Game' : 'Favorite Games'}
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Favorites;

