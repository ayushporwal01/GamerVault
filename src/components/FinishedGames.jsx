import { useCards } from "../utils/CardContext";
import { FaCheckCircle, FaTrophy } from 'react-icons/fa';
import GameCategoryPage from './GameCategoryPage';

const FinishedGames = () => {
  const { finishedGames, clearFinishedGames, removeFromCategory, reorderFinishedGames } = useCards();

  return (
    <GameCategoryPage
      config={{
        games: finishedGames,
        clearGames: clearFinishedGames,
        removeFromCategory,
        reorderGames: reorderFinishedGames,
        backgroundImage: '/3.jpg',
        title: 'Completed Games',
        titleGradient: 'from-green-400 to-emerald-400',
        description: 'Games you\'ve successfully finished',
        emptyTitle: 'No Finished Games Yet',
        emptyDescription: 'Add games you\'ve finished from the franchise pages to see them here.',
        categoryName: 'finished',
        statsIcon: FaTrophy,
        theme: {
          cardBg: 'bg-[#1e1e1e]/50',
          removeTitle: 'finished games',
          borderColor: 'green',
          glowGradient: 'from-green-400/20 to-emerald-400/20',
          statsBg: 'bg-[#1e1e1e]/50',
          statsBorder: 'border-white/10',
          iconColor: 'text-green-400',
          statsTextColor: 'text-gray-300',
          statsText: 'Completed',
          statusIcon: FaCheckCircle,
          statusText: 'Completed'
        }
      }}
    />
  );
};

export default FinishedGames;
