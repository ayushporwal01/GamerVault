import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useCards } from "../utils/CardContext";
import CardComponent from "./CardComponent";
import Sidebar from "./Sidebar";
import useDebounce from "../utils/useDebounce";

/**
 * Main body component that displays the card grid with drag-and-drop functionality
 * Features search filtering, smooth animations, and responsive layout
 */
const Body = () => {
  const { cards, setCards, searchInput, isFranchiseView } = useCards();
  const [draggingId, setDraggingId] = useState(null);
  const [filteredCardIds, setFilteredCardIds] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const lastOverIdRef = useRef(null);

  // Debounce search input to avoid excessive filtering
  const debouncedSearchInput = useDebounce(searchInput, 300);

  // Handle responsive background image
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    // Check initially
    checkIsMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkIsMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  /**
   * Create a lookup map for faster card access during rendering
   * Avoids O(n) lookups for each card in the filtered list
   */
  const cardMap = useMemo(() => {
    const map = new Map();
    cards.forEach((card) => map.set(card.id, card));
    return map;
  }, [cards]);

  /**
   * Filter cards based on search input
   * Only shows cards that are not in any category and not ranking-only (homepage cards only)
   * Updates whenever search input or cards change
   */
  useEffect(() => {
    // Filter to only include cards that should appear on homepage (not ranking-only)
    // Also filter based on global view mode
    const homepageCards = cards.filter(card => {
      if (card.isRankingOnly) return false;
      // Show franchise cards when in franchise view, game cards when in games view
      return isFranchiseView ? card.isFranchiseCard : !card.isFranchiseCard;
    });
    
    if (!debouncedSearchInput.trim()) {
      // Show all homepage cards when no search input
      setFilteredCardIds(homepageCards.map((card) => card.id));
    } else {
      // Filter homepage cards by title (case-insensitive)
      const filtered = homepageCards
        .filter((card) =>
          (card.text || "")
            .toLowerCase()
            .includes(debouncedSearchInput.toLowerCase())
        )
        .map((card) => card.id);
      setFilteredCardIds(filtered);
    }
  }, [debouncedSearchInput, cards, isFranchiseView]);

  /**
   * Handle drag start event
   */
  const handleDragStart = useCallback((e, id) => {
    setDraggingId(id);
    // Add drag effect styling and data
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', `card-${id}`);
  }, []);

  /**
   * Handle drag over event for reordering cards
   * Implements real-time reordering during drag
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

    // Find indices of dragged and target cards
    const draggingIndex = cards.findIndex((card) => card.id === draggingId);
    const overIndex = cards.findIndex((card) => card.id === overId);

    if (draggingIndex === -1 || overIndex === -1) return;

    // Reorder cards array
    const updatedCards = [...cards];
    const [draggedCard] = updatedCards.splice(draggingIndex, 1);
    updatedCards.splice(overIndex, 0, draggedCard);

    setCards(updatedCards);
  }, [draggingId, cards, setCards]);

  /**
   * Handle drop event for reordering cards
   */
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Reset drag state
    setDraggingId(null);
    lastOverIdRef.current = null;
  }, []);

  /**
   * Handle drag end event - cleanup drag state
   */
  const handleDragEnd = useCallback(() => {
    setDraggingId(null);
    lastOverIdRef.current = null;
  }, []);

  return (
    <div
      className="min-h-screen overflow-auto bg-fixed bg-cover bg-center bg-no-repeat px-3 sm:px-4 md:px-6 lg:px-8 pb-20 sm:pb-8"
      style={{
        backgroundImage: isMobile 
          ? "url('/retro-bg-mobile.jpg'), linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)"
          : "url('/retro-bg.jpg'), linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        scrollbarGutter: "stable",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Main card grid */}
      <div
        className="flex flex-wrap justify-center gap-6 sm:gap-7 md:gap-8 lg:gap-10 xl:gap-12 mx-auto w-full max-w-7xl px-6 sm:px-4 md:px-8 pt-28 sm:pt-20 md:pt-24 lg:pt-32"
        onDragOver={(e) => e.preventDefault()}
      >
          {filteredCardIds.map((id) => {
            const card = cardMap.get(id);
            if (!card) return null;
            
            return (
              <div
                key={card.id}
                className={`transition-all duration-200 ${
                  draggingId && draggingId !== card.id 
                    ? 'scale-95 opacity-75' 
                    : ''
                }`}
                onDragOver={(e) => handleDragOver(e, card.id)}
                onDrop={(e) => handleDrop(e)}
              >
                <CardComponent
                  card={card}
                  draggable
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDragEnd={handleDragEnd}
                  isDragging={draggingId === card.id}
                />
              </div>
            );
          })}
          
          {/* Empty state when no cards match search */}
          {filteredCardIds.length === 0 && searchInput && (
            <div className="col-span-full text-center py-8 sm:py-12">
              <p className="text-white/60 text-base sm:text-lg px-4">
                No games found matching "{searchInput}"
              </p>
            </div>
          )}
      </div>
      
      {/* Floating sidebar for actions */}
      <Sidebar />
    </div>
  );
};

export default Body;
