/**
 * Loading skeleton component for game cards
 * Displays animated placeholders while data is loading
 * 
 * @param {number} count - Number of skeleton cards to display (default: 4)
 */
const ShimmerCardList = ({ count = 4 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }, (_, index) => (
        <div
          key={`shimmer-${index}`}
          className="animate-pulse flex items-center gap-5 bg-[#1b1b1b] p-4 rounded-xl"
        >
          {/* Game image placeholder */}
          <div className="w-48 h-28 bg-[#2a2a2a] rounded-lg flex-shrink-0" />
          
          {/* Game details placeholder */}
          <div className="flex flex-col space-y-2 flex-1">
            {/* Game title */}
            <div className="h-6 bg-[#2a2a2a] rounded w-2/3" />
            {/* Release year */}
            <div className="h-4 bg-[#2a2a2a] rounded w-1/4" />
            {/* Platforms */}
            <div className="h-4 bg-[#2a2a2a] rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShimmerCardList;
