import { useContext } from "react";
import { CardContext } from "./CardContext.js";

export const useCards = () => {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error('useCards must be used within a CardProvider');
  }
  return context;
};