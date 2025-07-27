import { CardProvider } from "./utils/CardContext";
import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "./components/Header";

/**
 * Main application layout component
 * Provides the card context to all child components and manages header visibility
 */
function AppLayout() {
  const location = useLocation();

  // Show header only on home page
  const shouldShowHeader = location.pathname === "/";

  // Prevent scroll restoration and always start from top on homepage
  useEffect(() => {
    if (location.pathname === "/") {
      // Prevent browser from restoring scroll position
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
      }
      // Always scroll to top immediately
      window.scrollTo({ top: 0, behavior: "instant" });
    } else {
      // Re-enable scroll restoration for other pages
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'auto';
      }
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen">
      <CardProvider>
        {shouldShowHeader && <Header />}
        <main>
          <Outlet />
        </main>
      </CardProvider>
    </div>
  );
}

export default AppLayout;
