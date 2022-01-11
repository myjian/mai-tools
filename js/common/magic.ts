import {DxVersion} from './constants';

const MAGIC_SAUCE_SPLASH = [
  105, 117, 117, 113, 116, 59, 48, 48, 116, 104, 106, 110, 102, 115, 98, 47, 104, 106, 117, 105,
  118, 99, 47, 106, 112, 48, 110, 98, 106, 96, 83, 98, 117, 106, 111, 104, 66, 111, 98, 109, 122,
  123, 102, 115, 48, 116, 100, 115, 106, 113, 117, 116, 96, 110, 98, 106, 110, 98, 106, 48, 110, 98,
  106, 101, 121, 96, 106, 111, 96, 109, 119, 96, 116, 113, 109, 98, 116, 105, 47, 107, 116,
];

const MAGIC_SAUCE_SPLASH_PLUS = [
  105, 117, 117, 113, 116, 59, 48, 48, 116, 104, 106, 110, 102, 115, 98, 47, 104, 106, 117, 105,
  118, 99, 47, 106, 112, 48, 110, 98, 106, 96, 83, 98, 117, 106, 111, 104, 66, 111, 98, 109, 122,
  123, 102, 115, 48, 116, 100, 115, 106, 113, 117, 116, 96, 110, 98, 106, 110, 98, 106, 48, 110, 98,
  106, 101, 121, 96, 106, 111, 96, 109, 119, 96, 116, 113, 109, 98, 116, 105, 113, 109, 118, 116,
  47, 107, 116,
];

export async function iWantSomeMagic(gameVer: DxVersion): Promise<string> {
  let sauce = MAGIC_SAUCE_SPLASH;
  switch (gameVer) {
    case DxVersion.SPLASH_PLUS:
      sauce = MAGIC_SAUCE_SPLASH_PLUS;
      break;
  }
  const lessMagic = sauce.map((k) => k - 1);
  const res = await fetch(String.fromCharCode(...lessMagic));
  return await res.text();
}
