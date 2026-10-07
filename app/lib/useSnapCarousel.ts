"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

interface SnapCarousel {
  trackRef: React.RefObject<HTMLDivElement | null>;
  index: number;
  atStart: boolean;
  atEnd: boolean;
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
}

export function useSnapCarousel(
  itemCount: number
): SnapCarousel {
  const trackRef = useRef<HTMLDivElement>(null);

  const [index, setIndex] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(itemCount <= 1);

  const getItems = useCallback(() => {
    const track = trackRef.current;

    if (!track) return [];

    return Array.from(track.children) as HTMLElement[];
  }, []);

  const goTo = useCallback(
    (target: number) => {
      const track = trackRef.current;

      if (!track) return;

      const items = getItems();

      const clamped = Math.max(
        0,
        Math.min(target, items.length - 1)
      );

      const item = items[clamped];

      if (!item) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const delta =
        item.getBoundingClientRect().left -
        track.getBoundingClientRect().left;

      track.scrollTo({
        left: track.scrollLeft + delta,
        behavior: reduced ? "auto" : "smooth",
      });
    },
    [getItems]
  );

  const next = useCallback(
    () => goTo(index + 1),
    [goTo, index]
  );

  const prev = useCallback(
    () => goTo(index - 1),
    [goTo, index]
  );

  useEffect(() => {
    const track = trackRef.current;

    if (!track) return;

    let frame = 0;

    const sync = () => {
      cancelAnimationFrame(frame);

      frame = requestAnimationFrame(() => {
        const items = getItems();

        const trackLeft =
          track.getBoundingClientRect().left;

        let closest = 0;
        let shortest = Number.POSITIVE_INFINITY;

        items.forEach((item, i) => {
          const distance = Math.abs(
            item.getBoundingClientRect().left - trackLeft
          );

          if (distance < shortest) {
            shortest = distance;
            closest = i;
          }
        });

        setIndex(closest);

        setAtStart(track.scrollLeft <= 1);

        setAtEnd(
          track.scrollLeft + track.clientWidth >=
            track.scrollWidth - 1
        );
      });
    };

    sync();

    track.addEventListener("scroll", sync, {
      passive: true,
    });

    window.addEventListener("resize", sync);

    return () => {
      cancelAnimationFrame(frame);

      track.removeEventListener("scroll", sync);

      window.removeEventListener("resize", sync);
    };
  }, [getItems, itemCount]);

  return {
    trackRef,
    index,
    atStart,
    atEnd,
    next,
    prev,
    goTo,
  };
}
