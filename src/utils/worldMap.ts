// src/utils/worldMap.ts

export const WORLD_NAME_MAP = {
  아케인: "arcane",
  오로라: "aurora",
  베라: "bera",
  버닝: "bunning",
  버닝2: "bunning",
  버닝3: "bunning",
  버닝4: "bunning",
  챌린저스: "challengers",
  챌린저스2: "challengers",
  챌린저스3: "challengers",
  챌린저스4: "challengers",
  크로아: "croa",
  엘리시움: "elysium",
  이노시스: "enosis",
  에오스: "eos",
  헬리오스: "helios",
  루나: "luna",
  노바: "nova",
  레드: "red",
  스카니아: "scania",
  유니온: "union",
  제니스: "zenith",
};

export type KoreanWorldName = keyof typeof WORLD_NAME_MAP;
