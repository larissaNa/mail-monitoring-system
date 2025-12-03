import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useNotFoundViewModel() {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return {
    pathname: location.pathname,
  };
}
