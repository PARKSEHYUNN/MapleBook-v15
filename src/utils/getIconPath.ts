// src/utils/getIconPath.ts

import { WORLD_NAME_MAP, KoreanWorldName } from "./worldMap";

export function getWorldIconPath(koreanName: string): string {
  const englishName = WORLD_NAME_MAP[koreanName as KoreanWorldName];

  if (englishName) return `/world_icons/${englishName}.png`;
  return "/world_icons/default.png";
}
