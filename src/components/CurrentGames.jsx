import { useCards } from "../utils/CardContext";
import { FaGamepad, FaPlay } from 'react-icons/fa';
import GameCategoryPage from './GameCategoryPage';

const CurrentGames = () => {
  const { currentGames, clearCurrentGames, removeFromCategory, reorderCurrentGames } = useCards();

  return (
    <GameCategoryPage
      config={{
        games: currentGames,
        clearGames: clearCurrentGames,
        removeFromCategory,
        reorderGames: reorderCurrentGames,
        backgroundImage: '/1.jpg',
        title: 'Currently Playing',
        titleGradient: 'from-gray-400 to-gray-600',
        description: 'Games you\'re actively playing right now',
        emptyTitle: 'No Current Games Yet',
        emptyDescription: 'Add games you\'re actively playing from the franchise pages to see them here.',
        categoryName: 'current',
        statsIcon: FaGamepad,
        theme: {
          cardBg: 'bg-gray-800/30',
          removeTitle: 'current games',
          borderColor: 'gray',
          glowGradient: 'from-gray-400/10 to-gray-300/10',
          statsBg: 'bg-gray-800/40',
          statsBorder: 'border-gray-600/30',
          iconColor: 'text-gray-400',
          statsTextColor: 'text-gray-200',
          statsText: 'Currently Playing',
          statusIcon: FaPlay,
          statusText: 'Currently Playing'
        }
      }}
    />
  );
};

export default CurrentGames;
