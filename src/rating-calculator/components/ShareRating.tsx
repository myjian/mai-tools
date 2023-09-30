import React, {useEffect, useState} from 'react';

import {ChartType} from '../../common/chart-type';
import {GameRegion} from '../../common/game-region';
import {GameVersion} from '../../common/game-version';
import {Language} from '../../common/lang';
import {useLanguage} from '../../common/lang-react';
import {QueryParam} from '../../common/query-params';
import {SongDatabase} from '../../common/song-props';
import {RatingData} from '../types';

const MessagesByLang = {
  [Language.en_US]: {
    share: 'Share',
  },
  [Language.zh_TW]: {
    share: '分享',
  },
  [Language.ko_KR]: {
    share: '공유',
  },
};

export function ShareRating(props: {
  gameRegion: GameRegion;
  gameVer: GameVersion;
  ratingData: RatingData;
  songDb: SongDatabase;
}) {
  const {gameRegion, gameVer, ratingData, songDb} = props;
  const [encodedSongImages, setEncodedSongImages] = useState<string>('');
  const [encodedChartTypes, setEncodedChartTypes] = useState<string>('');
  const [encodedDifficulties, setEncodedDifficulties] = useState<string>('');
  const [encodedAchievements, setEncodedAchievements] = useState<string>('');

  useEffect(() => {
    const topRecords = ratingData.newChartRecords
      .slice(0, ratingData.newTopChartsCount)
      .concat(ratingData.oldChartRecords.slice(0, ratingData.oldTopChartsCount));

    const songProps = topRecords
      .map(
        (rec) =>
          songDb.getSongProperties(rec.songName, rec.genre, ChartType.DX) ||
          songDb.getSongProperties(rec.songName, rec.genre, ChartType.STANDARD)
      )
      .filter((sp) => sp?.ico);

    if (songProps.length < topRecords.length) {
      // We can only create URL if we have ico for every song.
      setEncodedSongImages('');
      setEncodedChartTypes('');
      setEncodedDifficulties('');
      setEncodedAchievements('');
      return;
    }

    setEncodedSongImages(songProps.map((sp) => sp.ico).join('_'));
    setEncodedChartTypes(topRecords.reduce<string>((acc, rec) => acc + rec.chartType, ''));
    setEncodedDifficulties(topRecords.reduce<string>((acc, rec) => acc + rec.difficulty, ''));
    setEncodedAchievements(topRecords.map((res) => res.achievement).join('_'));
  }, [ratingData, songDb]);

  const messages = MessagesByLang[useLanguage()];

  if (encodedSongImages && encodedChartTypes && encodedDifficulties && encodedAchievements) {
    const queryParams = new URLSearchParams();
    queryParams.set(QueryParam.GameRegion, gameRegion);
    queryParams.set(QueryParam.GameVersion, gameVer.toString());
    if (ratingData.playerName) {
      queryParams.set(QueryParam.PlayerName, ratingData.playerName);
    }
    queryParams.set(QueryParam.Date, ratingData.date.getTime().toString());

    // We choose to use image name to identify songs because it makes the URL shorter than 2000 bytes.
    // In local testing the URL length was around 1600.
    queryParams.set(QueryParam.SongImage, encodedSongImages);
    queryParams.set(QueryParam.ChartType, encodedChartTypes);
    queryParams.set(QueryParam.Difficulty, encodedDifficulties);
    queryParams.set(QueryParam.Achievement, encodedAchievements);

    return (
      <div>
        <a href={'?' + queryParams}>{messages.share}</a>
      </div>
    );
  }
  return null;
}
