import { NavigateFunction } from "react-router-dom";

export const handleCoordinatorClick = (
  coordinatorId: string,
  navigate: NavigateFunction,
  e: React.MouseEvent
) => {
  e.preventDefault();
  e.stopPropagation();
  navigate(`/users/${coordinatorId}`);
};
