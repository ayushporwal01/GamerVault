import { useState, useRef, useCallback } from 'react';

/**
 * Custom hook for handling drag and drop functionality in game lists
 * @param {Array} games - Array of games to reorder
 * @param {Function} reorderFunction - Function to call when reordering games
 * @returns {Object} - Drag and drop handlers and state
 */
export const useDragAndDrop = (games, reorderFunction) => {
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
    const draggingIndex = games.findIndex((game) => game.id === draggingId);
    const overIndex = games.findIndex((game) => game.id === overId);

    if (draggingIndex === -1 || overIndex === -1) return;

    // Reorder games array
    const updatedGames = [...games];
    const [draggedGame] = updatedGames.splice(draggingIndex, 1);
    updatedGames.splice(overIndex, 0, draggedGame);

    reorderFunction(updatedGames);
  }, [draggingId, games, reorderFunction]);

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

  return {
    draggingId,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd
  };
};
