import { useCards } from "../utils/useCards";

/**
 * Smooth purple-pink gradient toggle switch for franchise/games view
 */
const GradientToggle = () => {
  const { isFranchiseView, setIsFranchiseView } = useCards();

  const handleToggle = () => {
    setIsFranchiseView(prev => !prev);
  };

  return (
    <div className="flex items-center">
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only"
          checked={isFranchiseView}
          onChange={handleToggle}
        />
        <div className="w-11 h-6 bg-gray-700 rounded-full peer transition-all duration-300 ease-in-out relative overflow-hidden">
          {/* Purple-pink gradient background */}
          <div 
            className={`absolute inset-0 rounded-full transition-all duration-300 ease-in-out ${
              isFranchiseView 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 opacity-100' 
                : 'bg-gradient-to-r from-purple-500 to-pink-500 opacity-0'
            }`}
          />
          
          {/* Toggle circle */}
          <div 
            className={`absolute top-0.5 left-0.5 bg-white rounded-full h-5 w-5 transition-all duration-300 ease-in-out shadow-md ${
              isFranchiseView ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </div>
      </label>
    </div>
  );
};

export default GradientToggle;
