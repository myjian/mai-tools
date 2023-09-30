export const enum GameRegion {
  Jp = 'jp',
  Intl = 'intl',
}

const MaimaiNetOriginByRegion: Record<GameRegion, string> = {
  [GameRegion.Jp]: 'https://maimaidx.jp',
  [GameRegion.Intl]: 'https://maimaidx-eng.com',
};

const REGIONS = [GameRegion.Jp, GameRegion.Intl];

export const MAIMAI_NET_ORIGINS = REGIONS.map((reg) => MaimaiNetOriginByRegion[reg]);

export function isMaimaiNetOrigin(origin: string) {
  return MAIMAI_NET_ORIGINS.includes(origin);
}

export function getGameRegionFromOrigin(origin: string): GameRegion {
  const region = REGIONS.find((reg) => MaimaiNetOriginByRegion[reg] === origin);
  return region || GameRegion.Jp;
}

export function getGameRegionFromShortString(region: string): GameRegion {
  region = (region || '').toLowerCase();
  return region === GameRegion.Jp ? GameRegion.Jp : GameRegion.Intl;
}
