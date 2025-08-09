import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

/**
 * Reusable GameCard component for displaying games in category pages
 * @param {Object} game - Game object with id, name, image
 * @param {number} index - Index for animation delay
 * @param {string} draggingId - ID of currently dragging game
 * @param {Function} onRemove - Function to call when removing game
 * @param {Function} onDragStart - Drag start handler
 * @param {Function} onDragOver - Drag over handler
 * @param {Function} onDragEnd - Drag end handler
 * @param {Function} onDrop - Drop handler
 * @param {Object} theme - Theme configuration for colors and styling
 */
const GameCard = ({
  game,
  index,
  draggingId,
  onRemove,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDrop,
  theme
}) => {
  return (
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
      onDragOver={(e) => onDragOver(e, game.id)}
      onDrop={(e) => onDrop(e, game.id)}
    >
      <div 
        className={`flex flex-row items-center w-full max-w-2xl min-h-24 bg-[#1e1e1e]/60 rounded-xl overflow-hidden backdrop-blur-md border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 my-2 ${theme.cardBg || ''}`}
        draggable
        onDragStart={(e) => onDragStart(e, game.id)}
        onDragEnd={onDragEnd}
      >
        {/* Remove button */}
        <motion.button
          onClick={() => onRemove(game.id)}
          className="absolute top-3 right-3 z-10 p-2 bg-black/60 text-red-400 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600 hover:text-white transition-all duration-200"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title={`Remove from ${theme.removeTitle || 'games'}`}
        >
          <FaTimes className="text-sm" />
        </motion.button>

        {/* Game Image on the left */}
        <div className="w-20 h-20 flex-shrink-0 relative ml-4 my-2">
          <motion.img
            src={game.image || "/fallback.jpg"}
            onError={(e) => (e.target.src = "/fallback.jpg")}
            alt={game.name}
            loading="lazy"
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105 rounded-lg"
            whileHover={{ filter: "brightness(1.1)" }}
          />
        </div>

        {/* Game Title and Status on the right */}
        <div className="flex-1 flex flex-col justify-center px-6 py-2">
          <motion.h3
            className="text-white font-semibold text-lg leading-tight drop-shadow-lg"
            initial={{ opacity: 0.8 }}
            whileHover={{ opacity: 1 }}
          >
            {game.name}
          </motion.h3>
          {/* Status indicator */}
          <motion.div
            className="flex items-center gap-2 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {theme.statusIcon && <theme.statusIcon className={`text-sm ${theme.iconColor}`} />}
            <span className="text-xs text-gray-300">{theme.statusText}</span>
          </motion.div>
        </div>

        {/* Hover effect border */}
        <div className={`absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-${theme.borderColor}/30 transition-colors duration-300 pointer-events-none`}></div>
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${theme.glowGradient} blur-sm`}></div>
        </div>
      </div>
    </motion.div>
  );
};

export default GameCard;
