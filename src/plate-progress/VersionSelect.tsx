import React from 'react';

import {GameVersion, getVersionName, LATEST_VERSION} from '../common/game-version';

const VERSIONS = (function () {
  let a = ['0-1'];
  for (let i = 2; i <= GameVersion.FiNALE; i++) {
    a.push(i.toFixed(0));
  }
  a.push(`0-${GameVersion.FiNALE}`);
  for (let i = GameVersion.DX; i < LATEST_VERSION; i++) {
    a.push(i.toFixed(0));
  }
  return a;
})();

interface Props {
  version: string;
  onChange: (evt: React.SyntheticEvent<HTMLSelectElement>) => void;
}

export function VersionSelect(props: Props) {
  return (
    <select onChange={props.onChange} value={props.version}>
      {VERSIONS.map((ver, idx) => {
        const label = ver
          .split('-')
          .map((v) => getVersionName(parseInt(v)))
          .join(' ~ ');
        return (
          <option key={idx} value={ver}>
            {label}
          </option>
        );
      })}
    </select>
  );
}
