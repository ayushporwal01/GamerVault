import { motion } from 'framer-motion';
import { MdClear } from 'react-icons/md';
import { useDragAndDrop } from '../hooks/useDragAndDrop';
import EmptyState from './EmptyState';
import GameCard from './GameCard';

/**
 * Generic GameCategoryPage component that can be configured for different game categories
 * @param {Object} config - Configuration object for the page
 */
const GameCategoryPage = ({ config }) => {
  const {
    games,
    clearGames,
    removeFromCategory,
    reorderGames,
    backgroundImage,
    title,
    titleGradient,
    description,
    emptyTitle,
    emptyDescription,
    categoryName,
    statsIcon: StatsIcon,
    theme
  } = config;

  const {
    draggingId,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd
  } = useDragAndDrop(games, reorderGames);

  if (!games || games.length === 0) {
    return (
      <EmptyState
        backgroundImage={backgroundImage}
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  const handleRemoveGame = (gameId) => {
    removeFromCategory(gameId, categoryName);
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat text-white p-3 sm:p-4 md:p-6 lg:p-8 pr-14 sm:pr-16 md:pr-20 lg:pr-28 relative" 
      style={{backgroundImage: `url(${backgroundImage})`}}
    >
      {/* Blur overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto relative z-10"
      >
        <div className="text-center mb-6 sm:mb-8 relative">
          <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r ${titleGradient} bg-clip-text text-transparent drop-shadow-lg`}>
            {title}
          </h1>
          <p className="text-sm sm:text-base text-gray-200 drop-shadow-md px-4">{description}</p>
          <div className={`w-16 sm:w-20 md:w-24 h-1 bg-gradient-to-r ${titleGradient} mx-auto mt-3 sm:mt-4 rounded-full`}></div>
          
          {games.length > 0 && (
            <motion.button
              onClick={clearGames}
              className={`fixed top-4 right-4 sm:right-6 md:right-8 lg:right-10 flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 bg-gray-700/80 hover:bg-gray-600 border border-gray-500/50 hover:border-${theme.borderColor}/50 text-gray-200 hover:text-white rounded-lg transition-all duration-300 backdrop-blur-sm text-sm sm:text-base z-40 mb-4`}
              title={`Clear all ${categoryName} games`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MdClear className="text-base sm:text-lg" />
              <span className="hidden sm:inline">Clear All</span>
              <span className="sm:hidden">Clear</span>
            </motion.button>
          )}
        </div>

        <motion.div
          className="flex flex-wrap justify-start gap-6 sm:gap-7 md:gap-8 px-6 sm:px-8 md:px-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          onDragOver={(e) => e.preventDefault()}
        >
          {games.map((game, index) => (
            <GameCard
              key={game.id}
              game={game}
              index={index}
              draggingId={draggingId}
              onRemove={handleRemoveGame}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
              onDrop={handleDrop}
              theme={theme}
            />
          ))}
        </motion.div>

        {/* Stats section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 sm:mt-10 md:mt-12 text-center"
        >
          <div className={`inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 ${theme.statsBg} rounded-full border ${theme.statsBorder} backdrop-blur-md`}>
            <StatsIcon className={`${theme.iconColor} text-sm sm:text-base`} />
            <span className={`${theme.statsTextColor} text-sm sm:text-base`}>
              {games.length} {games.length === 1 ? 'Game' : 'Games'} {theme.statsText}
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default GameCategoryPage;
