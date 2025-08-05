import { useState, useCallback } from "react";
import { IoIosSearch, IoMdClose } from "react-icons/io";
import { Link } from "react-router-dom";
import { useCards } from "../utils/CardContext";
import GradientToggle from "./GradientToggle";

/**
 * Main navigation header component
 * Features morphing animation between navigation and search modes
 */
const Header = () => {
  const [showSearch, setShowSearch] = useState(false);
  const { searchInput, setSearchInput } = useCards();

  /**
   * Closes search bar and clears search input
   */
  const handleCloseSearch = useCallback(() => {
    setSearchInput("");
    setShowSearch(false);
  }, [setSearchInput]);

  /**
   * Opens search bar
   */
  const handleOpenSearch = useCallback(() => {
    setShowSearch(true);
  }, []);


  return (
    <div className="fixed top-0 left-0 right-0 flex justify-center z-50 px-4">
      <div className="w-full max-w-[320px] sm:max-w-[360px] md:max-w-[400px] h-16 mt-5 px-6 sm:px-4 md:px-4 bg-black/50 text-white font-primary rounded-xl shadow-lg backdrop-blur-md border border-white/10 flex justify-between items-center overflow-hidden">
        {showSearch ? (
          <div className="flex items-center w-full">
            {/* Search Input */}
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search Your Games..."
              className="flex-grow bg-transparent border-none outline-none text-white placeholder-white/50 text-sm sm:text-base"
              autoFocus
            />
            {/* Close Search Button */}
            <IoMdClose
              className="text-xl sm:text-2xl text-white hover:text-white cursor-pointer ml-2 sm:ml-4 flex-shrink-0"
              onClick={handleCloseSearch}
              aria-label="Close search"
            />
          </div>
        ) : (
          <div className="flex justify-between items-center w-full">
            {/* Brand Logo */}
            <div className="text-white">GamerVault</div>

            {/* Navigation Menu */}
            <nav>
              <ul className="flex gap-3 sm:gap-4 md:gap-6 items-center">
                <li>
                  <Link
                    to="/"
                    className="text-sm sm:text-base hover:text-white transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/rank"
                    className="text-sm sm:text-base hover:text-white transition-colors"
                  >
                    Rank
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleOpenSearch}
                    className="text-xl sm:text-2xl mt-1 hover:text-white cursor-pointer transition-colors"
                    aria-label="Open search"
                  >
                    <IoIosSearch />
                  </button>
                </li>
                <li>
                  <GradientToggle />
                </li>
              </ul>
            </nav>
          </div>
        )}
        </div>
    </div>
  );
};

export default Header;
