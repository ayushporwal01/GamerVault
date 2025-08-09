import { AnimatePresence } from "framer-motion";
import { useCallback } from "react";

/**
 * Toggle component for switching between Franchise and Game card types
 * Features smooth animations and intuitive arrow-based navigation
 * 
 * @param {Object} card - The card object to modify
 * @param {Function} setCards - Function to update cards state
 * @param {Function} setReloadKey - Function to trigger data reload
 */
const CardTypeToggle = ({ card, setCards, setReloadKey }) => {
  /**
   * Toggles the card type in an infinite loop (Franchise <-> Game)
   */
  const toggleType = useCallback(() => {
    if (!card?.id) return;
    
    const newType = !card.isFranchiseCard;
    
    setCards((prev) =>
      prev.map((c) =>
        c.id === card.id ? { ...c, isFranchiseCard: newType } : c
      )
    );
    
    // Trigger reload to fetch appropriate data for the new type
    setReloadKey((prev) => prev + 1);
  }, [card?.id, card?.isFranchiseCard, setCards, setReloadKey]);

  const isCurrentlyFranchise = card?.isFranchiseCard;
  const displayText = isCurrentlyFranchise ? "Franchise" : "Game";

  return (
    <div className="flex items-center gap-2" role="group" aria-label="Card type selector">
      {/* Left Toggle Arrow */}
      <button
        onClick={toggleType}
        className="text-2xl text-white hover:text-green-400 cursor-pointer transition-colors duration-200"
        aria-label="Toggle card type"
      >
        &#8249; {/* Left single angle quotation mark */}
      </button>

      {/* Animated Type Label */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={displayText}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="w-[90px] text-center text-white text-sm sm:text-base font-medium"
        >
          {displayText}
        </motion.span>
      </AnimatePresence>

      {/* Right Toggle Arrow */}
      <button
        onClick={toggleType}
        className="text-2xl text-white hover:text-green-400 cursor-pointer transition-colors duration-200"
        aria-label="Toggle card type"
      >
        &#8250; {/* Right single angle quotation mark */}
      </button>
    </div>
  );
};

export default CardTypeToggle;
