import React, {useEffect, useState} from 'react';

import {FullChartRecord} from '../common/chart-record';
import {GameRegion} from '../common/game-region';
import {getMaiToolsBaseUrl} from '../common/script-host';
import {VersionInfo} from './plate_info';
import {PlateProgressDetail} from './PlateProgressDetail';

const BASE_URL = getMaiToolsBaseUrl() + '/data/plate-info';

interface Props {
  region: GameRegion;
  version: string;
  playerScores: FullChartRecord[];
}

export function PlateProgress(props: Props) {
  const {region, version} = props;
  const [versionInfo, setVersionInfo] = useState<VersionInfo | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetch(`${BASE_URL}/${region}${version}.json`).then(async (res) => {
      if (res.ok) {
        const info = await res.json();
        console.log(info);
        setVersionInfo(sanitizeVersionInfo(info));
        setError('');
      } else {
        setVersionInfo(null);
        setError(res.statusText);
      }
    });
  }, [region, version]);

  return (
    <div>
      <div className="error">{error}</div>
      {versionInfo && (
        <PlateProgressDetail versionInfo={versionInfo} playerScores={props.playerScores} />
      )}
    </div>
  );
}

function sanitizeVersionInfo(info: VersionInfo) {
  if (!info.dx_remaster_songs) {
    info.dx_remaster_songs = [];
  }
  if (!info.dx_songs) {
    info.dx_songs = [];
  }
  if (!info.std_remaster_songs) {
    info.std_remaster_songs = [];
  }
  if (!info.std_songs) {
    info.std_songs = [];
  }
  return info;
}
