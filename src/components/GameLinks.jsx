import { useMemo } from 'react';

/**
 * Component for displaying game purchase links from various digital stores
 * Supports Steam, Epic Games, and special handling for Minecraft
 * 
 * @param {Object} game - Game object containing store information
 * @param {Array} game.stores - Array of store objects with URLs
 * @param {string} game.name - Game name for special case handling
 */
const GameLinks = ({ game }) => {
  // Store configuration with IDs and styling
  const storeConfig = {
    steam: {
      id: 1,
      name: 'Steam',
      className: 'text-sm text-blue-400 underline hover:text-blue-300 transition-colors',
      matcher: (store) => store.store?.name === 'Steam' || store.store_id === 1,
      urlProcessor: (url) => {
        // Handle relative Steam URLs
        if (url?.startsWith('/') || url?.startsWith('app/')) {
          return `https://store.steampowered.com${url}`;
        }
        return url;
      },
    },
    epic: {
      id: 11,
      name: 'Epic Games',
      className: 'text-sm text-blue-400 underline hover:text-blue-300 transition-colors',
      matcher: (store) => store.store?.name === 'Epic Games' || store.store_id === 11,
      urlProcessor: (url) => url,
    },
  };

  /**
   * Generate store links based on available stores
   */
  const storeLinks = useMemo(() => {
    const links = [];

    // Process configured stores
    Object.entries(storeConfig).forEach(([key, config]) => {
      const store = game.stores?.find(config.matcher);
      if (store) {
        const processedUrl = config.urlProcessor(store.url);
        if (processedUrl) {
          links.push({
            key,
            name: config.name,
            url: processedUrl,
            className: config.className,
          });
        }
      }
    });

    // Special case: Minecraft direct link
    if (game.name?.toLowerCase().includes('minecraft')) {
      links.push({
        key: 'minecraft',
        name: 'Buy Minecraft',
        url: 'https://www.minecraft.net/en-us/store/minecraft-java-bedrock-edition-pc',
        className: 'text-sm text-green-400 underline hover:text-green-300 transition-colors',
      });
    }

    return links;
  }, [game.stores, game.name]);

  if (storeLinks.length === 0) {
    return (
      <div className="mt-2">
        <p className="text-sm text-gray-400">No store links available</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap mt-2 items-center ${storeLinks.length > 1 ? 'gap-2' : ''}`}>
      {storeLinks.map((link) => (
        <a
          key={link.key}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={link.className}
          aria-label={`Buy ${game.name} on ${link.name}`}
        >
          {link.name}
        </a>
      ))}
    </div>
  );
};

export default GameLinks;
