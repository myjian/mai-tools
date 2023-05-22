export const enum GameRegion {
  Jp = 'https://maimaidx.jp',
  Intl = 'https://maimaidx-eng.com',
}

export const MAIMAI_NET_ORIGINS = [GameRegion.Jp, GameRegion.Intl];

export function isMaimaiNetOrigin(origin: string) {
  return origin === GameRegion.Jp || origin === GameRegion.Intl;
}

export function getGameRegionFromOrigin(origin: string): GameRegion {
  return origin === GameRegion.Jp ? GameRegion.Jp : GameRegion.Intl;
}
