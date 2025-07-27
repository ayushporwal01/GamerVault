import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./App.jsx";
import Body from "./components/Body.jsx";
import Rank from "./components/Rank.jsx";
import FranchisePage from "./components/FranchisePage.jsx";
import CurrentGames from "./components/CurrentGames.jsx";
import NextGames from "./components/NextGames.jsx";
import FinishedGames from "./components/FinishedGames.jsx";
import Favorites from "./components/Favorites.jsx";

/**
 * Application router configuration
 * Defines all routes and their corresponding components
 */
const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "", // Home page - displays card grid
        element: <Body />,
      },
      {
        path: "/franchise/:id", // Dynamic franchise/game details page
        element: <FranchisePage />,
      },
      {
        path: "rank",
        element: <Rank />,
      },
      {
        path: "current-games", 
        element: <CurrentGames />,
      },
      {
        path: "next-games", 
        element: <NextGames />,
      },
      {
        path: "finished-games", 
        element: <FinishedGames />,
      },
      {
        path: "favorites", 
        element: <Favorites />,
      },
    ],
  },
]);

// Initialize and render the React application
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(
  <StrictMode>
    <RouterProvider router={appRouter} />
  </StrictMode>
);
