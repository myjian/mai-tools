import {DxVersion} from './game-version';

const MagicSauce: Record<DxVersion, string> = {
  [DxVersion.UNIVERSE]: "aHR0cHM6Ly9zZ2ltZXJhLmdpdGh1Yi5pby9tYWlfUmF0aW5nQW5hbHl6ZXIvc2NyaXB0c19tYWltYWkvbWFpZHhfaW5fbHZfdW5pdmVyc2UuanM=",
  [DxVersion.UNIVERSE_PLUS]: "aHR0cHM6Ly9naXN0LmdpdGh1YnVzZXJjb250ZW50LmNvbS9teWppYW4vZWU1NjlkNzRmNDIyZDRlMjU1MDY1ZDhiMDJlYTI5NGEvcmF3LzkzMmZiMDNhMzgxMjEyMTAwODBkNmY1Mzc5MTNhMDg0MjQ3ZTUzMWMvbWFpZHhfaW5fbHZfdW5pdmVyc2VwbHVzLmpz",
  [DxVersion.FESTiVAL]: "aHR0cHM6Ly9zZ2ltZXJhLmdpdGh1Yi5pby9tYWlfUmF0aW5nQW5hbHl6ZXIvc2NyaXB0c19tYWltYWkvbWFpZHhfaW5fbHZfZmVzdGl2YWwuanM=",
};

export async function iWantSomeMagic(gameVer: DxVersion): Promise<string> {
  const sauce = MagicSauce[gameVer] || MagicSauce[DxVersion.UNIVERSE_PLUS];
  const res = await fetch(atob(sauce));
  return await res.text();
}
