import {LevelDef} from '../common/level-helper';

export const DX_LEVELS: ReadonlyArray<LevelDef> = [
  {title: '8', minLv: 8.0, maxLv: 8.6},
  {title: '8+', minLv: 8.7, maxLv: 8.9},
  {title: '9', minLv: 9.0, maxLv: 9.6},
  {title: '9+', minLv: 9.7, maxLv: 9.9},
  {title: '10', minLv: 10.0, maxLv: 10.6},
  {title: '10+', minLv: 10.7, maxLv: 10.9},
  {title: '11', minLv: 11.0, maxLv: 11.6},
  {title: '11+', minLv: 11.7, maxLv: 11.9},
  {title: '12', minLv: 12.0, maxLv: 12.6},
  {title: '12+', minLv: 12.7, maxLv: 12.9},
  {title: '13', minLv: 13.0, maxLv: 13.6},
  {title: '13+', minLv: 13.7, maxLv: 13.9},
  {title: '14', minLv: 14.0, maxLv: 14.6},
  {title: '14+', minLv: 14.7, maxLv: 14.9},
  {title: '15', minLv: 15.0, maxLv: 15.0},
];

export function getLvIndex(title: string) {
  return DX_LEVELS.findIndex((lv) => lv.title === title);
}
