import { useEffect, useState, useMemo, useCallback } from "react";
import { FiUpload } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { useCards } from "../utils/CardContext";
import { useNavigate } from "react-router-dom";

/**
 * Individual card component with drag-and-drop, image upload, and editing capabilities
 * Supports both franchise and game card types with navigation to detail pages
 * 
 * @param {Object} card - Card data object
 * @param {boolean} draggable - Whether the card can be dragged
 * @param {Function} onDragStart - Drag start event handler
 * @param {Function} onDragOver - Drag over event handler
 * @param {Function} onDragEnd - Drag end event handler
 * @param {boolean} isDragging - Whether this card is currently being dragged
 */
const CardComponent = ({
  card,
  draggable,
  onDragStart,
  onDragOver,
  onDragEnd,
  isDragging,
  showClearButton = false,
  categoryContext = null,
}) => {
  const { id, text, image } = card;
  const { removeCard, removeFromCategory, setCards } = useCards();
  const navigate = useNavigate();

  // Local state to manage card content before syncing to context
  const [localImage, setLocalImage] = useState(image || null);
  const [localText, setLocalText] = useState(text || "Title");

  // Generate unique input ID for file upload
  const inputId = useMemo(() => `file-upload-${id}`, [id]);
  
  // File size limit configuration
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
  const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  /**
   * Sync local state changes back to the global context
   * Updates the card in the cards array whenever local values change
   * Only sync if this card is not in a category context (i.e., it's on the homepage)
   */
  useEffect(() => {
    if (!categoryContext) {
      // Only update main cards array if this is a homepage card
      setCards((prevCards) =>
        prevCards.map((c) =>
          c.id === id ? { ...c, text: localText, image: localImage } : c
        )
      );
    }
    // For category cards, we don't sync back to main cards - they're independent copies
  }, [localText, localImage, id, setCards, categoryContext]);

  /**
   * Validates and processes uploaded image files
   * @param {File} file - The uploaded file
   * @returns {boolean} - Whether the file was processed successfully
   */
  const processImageFile = useCallback((file) => {
    // Validate file type
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      alert("Please upload a valid image file (JPEG, PNG, GIF, or WebP).");
      return false;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      alert(`Image too large. Please choose a file smaller than ${MAX_FILE_SIZE / (1024 * 1024)}MB.`);
      return false;
    }

    // Convert to base64 for storage
    const reader = new FileReader();
    reader.onload = (e) => {
      setLocalImage(e.target.result);
    };
    reader.onerror = () => {
      alert("Error reading file. Please try again.");
    };
    reader.readAsDataURL(file);
    
    return true;
  }, []);

  /**
   * Handle file input change event
   */
  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
    // Clear input to allow re-selecting the same file
    e.target.value = '';
  }, [processImageFile]);

  /**
   * Handle drag and drop file upload
   */
  const handleDrop = useCallback((e) => {
    // Only handle file drops, not card reordering
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      e.preventDefault();
      e.stopPropagation();
      
      const file = e.dataTransfer.files[0];
      processImageFile(file);
    }
    // Let card reordering events bubble up
  }, [processImageFile]);


  /**
   * Remove the current image
   */
  const removeImage = useCallback(() => {
    setLocalImage(null);
  }, []);

  /**
   * Delete the entire card or remove from category based on context
   */
  const deleteCard = useCallback(() => {
    if (categoryContext) {
      // If card is being displayed in a category page, remove from that category
      removeFromCategory(id, categoryContext);
    } else {
      // If card is on homepage, completely delete it
      removeCard(id);
    }
  }, [removeCard, removeFromCategory, id, categoryContext]);

  /**
   * Navigate to franchise/game detail page
   */
  const handleCardClick = useCallback(() => {
    if (localText && localText !== "Title") {
      navigate(`/franchise/${encodeURIComponent(localText)}`);
    }
  }, [navigate, localText]);

  // Drag event handlers for card reordering
  const handleDragStart = useCallback((e) => {
    if (onDragStart) {
      onDragStart(e, id);
    }
  }, [onDragStart, id]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    if (onDragOver) {
      onDragOver(e, id);
    }
  }, [onDragOver, id]);

  const handleDragEnd = useCallback((e) => {
    if (onDragEnd) {
      onDragEnd(e);
    }
  }, [onDragEnd]);

  return (
    <div
      className={`relative w-64 h-52 bg-[#313131]/30 rounded-xl overflow-hidden backdrop-blur-md border border-white/10 flex flex-col select-none cursor-grab ${
        isDragging ? "opacity-50" : ""
      }`}
      draggable={draggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDrop={handleDrop}
    >
      {/* Delete/Remove Card Button - Show based on showClearButton prop or when no image on homepage */}
      {(showClearButton || (!localImage && !categoryContext)) && (
        <button
          onClick={deleteCard}
          className="absolute top-2 right-2 z-20 bg-black/60 text-white p-1 rounded-full hover:bg-red-500 hover:text-white"
          aria-label={categoryContext ? "Remove from category" : "Delete card"}
          title={categoryContext ? "Remove from category" : "Delete card"}
        >
          <RxCross2 className="text-lg" />
        </button>
      )}

      {/* Main Content Area - Image Preview or Upload Zone */}
      <div className="flex-grow relative flex justify-center items-center group">
        {localImage ? (
          // Image Preview Mode
          <>
            <div
              className="w-full h-full absolute cursor-pointer"
              onClick={handleCardClick}
              draggable="false"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCardClick();
                }
              }}
              aria-label={`View details for ${localText}`}
            >
              <img
                src={localImage}
                alt={localText}
                className="w-full h-full object-cover pointer-events-none select-none"
                draggable="false"
              />
            </div>

            {/* Remove Image Button - Visible on hover */}
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-500"
              aria-label="Remove image"
            >
              <RxCross2 className="text-lg" />
            </button>
          </>
        ) : (
          // Upload Zone Mode
          <div className="flex flex-col items-center gap-1 sm:gap-2 text-white/60 hover:text-white">
            <input
              type="file"
              id={inputId}
              className="hidden"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleFileChange}
            />
            <label 
              htmlFor={inputId} 
              className="z-10 cursor-pointer flex flex-col items-center gap-1 sm:gap-2 p-2 sm:p-4 rounded-lg hover:bg-white/5"
              aria-label="Upload image"
            >
              <FiUpload className="text-2xl sm:text-3xl" />
              <span className="text-xs sm:text-sm text-center px-2">Click or drag to upload</span>
            </label>
          </div>
        )}
      </div>

      {/* Title Input Section */}
      <div className="bg-[#272727]/30 flex justify-center items-center px-2 sm:px-4 py-2 relative">
        <input
          type="text"
          value={localText}
          maxLength={25}
          placeholder="Enter title"
          onChange={(e) => setLocalText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.target.blur();
            }
          }}
          className="text-white text-base sm:text-lg font-semibold text-center outline-none w-full placeholder-white/50 drop-shadow-[0_0_5px_#ffffff] bg-transparent"
          aria-label="Card title"
        />
      </div>
    </div>
  );
};

export default CardComponent;
