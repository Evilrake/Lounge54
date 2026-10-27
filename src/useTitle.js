import { useEffect } from "react";

export default function useTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} — Lounge54` : "Lounge54";
  }, [title]);
}
