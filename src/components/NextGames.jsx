import { useCards } from "../utils/CardContext";
import { FaClock, FaListUl } from 'react-icons/fa';
import GameCategoryPage from './GameCategoryPage';

const NextGames = () => {
  const { nextGames, clearNextGames, removeFromCategory, reorderNextGames } = useCards();

  return (
    <GameCategoryPage
      config={{
        games: nextGames,
        clearGames: clearNextGames,
        removeFromCategory,
        reorderGames: reorderNextGames,
        backgroundImage: '/2.jpg',
        title: 'Next in Queue',
        titleGradient: 'from-blue-400 to-cyan-400',
        description: 'Games you\'re planning to play next',
        emptyTitle: 'No Next Games Yet',
        emptyDescription: 'Add your next games from the franchise pages to see them here.',
        categoryName: 'next',
        statsIcon: FaListUl,
        theme: {
          cardBg: 'bg-[#1e1e1e]/50',
          removeTitle: 'next games',
          borderColor: 'blue',
          glowGradient: 'from-blue-400/20 to-cyan-400/20',
          statsBg: 'bg-[#1e1e1e]/50',
          statsBorder: 'border-white/10',
          iconColor: 'text-blue-400',
          statsTextColor: 'text-gray-300',
          statsText: 'in Queue',
          statusIcon: FaClock,
          statusText: 'In Queue'
        }
      }}
    />
  );
};

export default NextGames;
