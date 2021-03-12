import {LevelDef, RankRangeDef} from './types';

export const DX_MAX_RATING = 211; // 15.0 * 14 * 1.005

export const DX_PLUS_RANKS: ReadonlyArray<RankRangeDef> = [
  {
    title: "SSS+",
    minAchv: 100.5,
    rankFactor: 14,
    maxAchv: 100.5,
  },
  {
    title: "SSS",
    minAchv: 100,
    rankFactor: 13.5,
    maxAchv: 100.4999,
  },
  {
    title: "SS+",
    minAchv: 99.5,
    rankFactor: 13.2,
    maxAchv: 99.9999,
  },
  {
    title: "SS",
    minAchv: 99,
    rankFactor: 13,
    maxAchv: 99.4999,
  },
  {
    title: "S+",
    minAchv: 98,
    rankFactor: 12.7,
    maxAchv: 98.9999,
  },
  {
    title: "S",
    minAchv: 97,
    rankFactor: 12.5,
    maxAchv: 97.9999,
  },
  {
    title: "AAA",
    minAchv: 94,
    rankFactor: 10.5,
    maxAchv: 96.9999,
  },
  {
    title: "AA",
    minAchv: 90,
    rankFactor: 9.5,
    maxAchv: 93.9999,
  },
  {
    title: "A",
    minAchv: 80,
    rankFactor: 8.5,
    maxAchv: 89.9999,
  },
];

const dxPlusLevels = [
  {title: "15", minLv: 15.0, maxLv: 15.0},
  {title: "14+", minLv: 14.7, maxLv: 14.9},
  {title: "14", minLv: 14.0, maxLv: 14.6},
  {title: "13+", minLv: 13.7, maxLv: 13.9},
  {title: "13", minLv: 13.0, maxLv: 13.6},
  {title: "12+", minLv: 12.7, maxLv: 12.9},
  {title: "12", minLv: 12.0, maxLv: 12.6},
  {title: "11+", minLv: 11.7, maxLv: 11.9},
  {title: "11", minLv: 11.0, maxLv: 11.6},
  {title: "10+", minLv: 10.7, maxLv: 10.9},
  {title: "10", minLv: 10.0, maxLv: 10.6},
  {title: "9+", minLv: 9.7, maxLv: 9.9},
  {title: "9", minLv: 9.0, maxLv: 9.6},
  {title: "8+", minLv: 8.7, maxLv: 8.9},
  {title: "8", minLv: 8.0, maxLv: 8.6},
];

export const DX_PLUS_LEVELS: ReadonlyArray<LevelDef> = dxPlusLevels;
