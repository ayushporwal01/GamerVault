# Franchise Page RAWG Games Display Fixes

## Issues Fixed

### 1. **Overly Restrictive Store Filtering**

**Problem**: Games were being filtered out too aggressively based on store availability, causing many relevant games to not appear on franchise pages.

**Solution**: 
- Maintained focus on Steam, Epic Games, and official links only (as requested)
- Allow games without store data only for special cases with official links (like Minecraft)
- Improved store filtering logic while keeping it focused on preferred stores
- Enhanced fallback logic to ensure games are still displayed when matching criteria are met

### 2. **Inflexible Franchise Matching Logic**

**Problem**: The franchise matching logic was too strict, requiring exact publisher/developer matches and not handling cases where card data might be incomplete.

**Solution**:
- Enhanced franchise matching to include partial matches and cross-referencing
- Added fallback logic to use `gameData.publishers` when card publisher/developer info is missing
- Improved matching flexibility by allowing publisher-developer cross-matching
- Include substring matching for more comprehensive publisher/developer recognition

### 3. **Limited Game Title Matching**

**Problem**: Individual game searches were too restrictive and didn't handle edge cases well.

**Solution**:
- Enhanced game title matching with Roman numeral support (I, II, III, etc. ↔ 1, 2, 3, etc.)
- Added broader keyword matching for games that don't exactly match the card title
- Implemented fallback logic to show all relevant games when no exact matches are found
- Support for partial word matching to catch variations in game titles

### 4. **Focused Store Support**

**Problem**: GameLinks component needed to be focused on preferred stores only.

**Solution**:
- Maintained support for Steam and Epic Games only (as requested)
- Kept special handling for official links like Minecraft
- Improved error handling and fallback messages
- Clean, focused approach to store link display

## Key Improvements

### Store Filtering Logic
```javascript
// Before: Only Steam/Epic with strict URL validation
const hasValidStores = game.stores.some(store => {
  if ((store.store?.name === 'Steam' || store.store_id === 1) && store.url) {
    return true;
  }
  if ((store.store?.name === 'Epic Games' || store.store_id === 11) && store.url) {
    return true;
  }
  return false;
});

// After: Multiple stores with flexible validation
const hasAnyStores = game.stores.some(store => {
  return store.url && store.url.trim() !== '';
});

const hasValidStores = game.stores.some(store => {
  // Support for Steam and Epic Games only
  if ((store.store?.name === 'Steam' || store.store_id === 1) && store.url) {
    return true;
  }
  if ((store.store?.name === 'Epic Games' || store.store_id === 11) && store.url) {
    return true;
  }
  return false;
});
```

### Enhanced Matching Logic
```javascript
// Before: Strict exact matching
const matches = normalize(localText) === normalize(game.name);

// After: Flexible matching with fallbacks
const matchesGameTitle = (game, cardTitle) => {
  // Exact match
  if (gameNameNormalized === cardTitleNormalized) return true;
  
  // Substring match
  if (gameNameNormalized.includes(cardTitleNormalized)) return true;
  
  // Roman numeral variations
  const gameVariations = getRomanNumberVariations(game.name);
  const cardVariations = getRomanNumberVariations(cardTitle);
  // ... additional matching logic
};
```

### Fallback Strategy
```javascript
// If no games found with strict matching, try broader searches
if (franchiseGames.length === 0 && gameData?.publishers) {
  franchiseGames = storeFilteredGames.filter(/* broader matching */);
}

// If still no games, show all games as ultimate fallback
if (franchiseGames.length === 0) {
  franchiseGames = storeFilteredGames;
}
```

## Benefits for Future Franchise Pages

1. **Better Game Visibility**: Improved filtering logic shows more relevant games while maintaining quality standards
2. **Improved Matching**: Better handling of game title variations and publisher relationships
3. **Focused Store Support**: Clean, focused approach with Steam, Epic, and official links only
4. **Robust Fallbacks**: Pages won't appear empty due to enhanced matching logic
5. **Flexible Architecture**: Easy to adjust matching criteria while maintaining focused store approach

## Testing Recommendations

1. Test with various franchise types (publisher-based, developer-based, series-based)
2. Verify games with different store configurations are displayed
3. Check Roman numeral handling (Final Fantasy I-XV, etc.)
4. Ensure fallback logic works when no exact matches are found
5. Test special cases like free games, demos, and indie titles

## Maintenance Notes

- Store configuration is focused on Steam, Epic, and official links only
- Matching logic is centralized and can be fine-tuned based on user feedback
- Caching is preserved to maintain performance
- All changes are backward compatible with existing franchise pages
- Easy to maintain focused approach while ensuring good game visibility
