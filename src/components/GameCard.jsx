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
        className={`relative w-full bg-[#1e1e1e]/50 rounded-xl overflow-hidden backdrop-blur-md border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 flex justify-between items-center ${theme.cardBg || ''}`}
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
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/90 to-transparent">
          <motion.h3
            className="text-white font-semibold text-base sm:text-lg leading-tight drop-shadow-lg"
            initial={{ opacity: 0.8 }}
            whileHover={{ opacity: 1 }}
          >
            {game.name}
          </motion.h3>
          
        {/* Status indicator */}
          <motion.div
            className="flex items-center gap-1 sm:gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <theme.statusIcon className={`text-xs sm:text-sm ${theme.iconColor}`} />
            <span className="text-xs text-gray-300">{theme.statusText}</span>
          </motion.div>
          
          {/* Icons */}
          <div className="flex flex-col items-end gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white/10 w-8 h-8 rounded-full flex items-center justify-center">
                <theme.icon className={`text-white text-xs`} />
              </div>
            ))}
          </div>
        </div>

        {/* Hover effect border */}
        <div className={`absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-${theme.borderColor}/30 transition-colors duration-300 pointer-events-none`}></div>
        
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${theme.glowGradient} blur-sm`}></div>
        </div>
      </div>
    </motion.div>
  );
};

export default GameCard;
