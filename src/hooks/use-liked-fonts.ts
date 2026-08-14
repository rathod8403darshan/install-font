"use client";

import { useCallback, useEffect, useState } from "react";
import {
  readLikedIds,
  toggleLikedId,
  LIKED_CHANGE_EVENT,
} from "@/lib/liked-fonts";

export function useLikedFonts() {
  const [ids, setIds] = useState<string[]>([]);

  const refresh = useCallback(() => {
    setIds(readLikedIds());
  }, []);

  useEffect(() => {
    refresh();
    const onChange = () => refresh();
    window.addEventListener(LIKED_CHANGE_EVENT, onChange);
    return () => window.removeEventListener(LIKED_CHANGE_EVENT, onChange);
  }, [refresh]);

  const isLiked = useCallback((id: string) => ids.includes(id), [ids]);

  const toggle = useCallback(
    (id: string) => {
      toggleLikedId(id);
      refresh();
    },
    [refresh],
  );

  return {
    ids,
    count: ids.length,
    isLiked,
    toggle,
    refresh,
  };
}
