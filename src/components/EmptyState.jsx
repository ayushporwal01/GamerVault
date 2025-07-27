import { motion } from 'framer-motion';

/**
 * Reusable EmptyState component for category pages with no games
 * @param {string} backgroundImage - Background image URL
 * @param {string} title - Empty state title
 * @param {string} description - Empty state description
 */
const EmptyState = ({ backgroundImage, title, description }) => {
  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center text-white relative pr-16 sm:pr-20 md:pr-24 lg:pr-28" 
      style={{backgroundImage: `url(${backgroundImage})`}}
    >
      {/* Blur overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-4 relative z-10"
      >
        <h2 className="text-2xl font-semibold text-gray-300">{title}</h2>
        <p className="text-gray-400">{description}</p>
      </motion.div>
    </div>
  );
};

export default EmptyState;
