import React from 'react';

import {DIFFICULTY_CLASSNAME_MAP} from '../../common/constants';
import {getRankTitle} from '../../common/rank-functions';
import {SongProperties} from '../../common/song-props';
import {getSongNickname} from '../../common/song-util';
import {ChartRecordWithRating, ColumnType} from '../types';
import {ChartRecordRow} from './ChartRecordRow';

function getSongNameDisplay(
  record: ChartRecordWithRating,
  songPropsByName: Map<string, ReadonlyArray<SongProperties>>
): string {
  const songPropsArray = songPropsByName.get(record.songName);
  if (songPropsArray && songPropsArray.length > 1) {
    return getSongNickname(record.songName, record.genre, record.chartType === "DX");
  }
  return record.songName;
}

interface Props {
  songPropsByName: Map<string, ReadonlyArray<SongProperties>>;
  record: ChartRecordWithRating;
  columns: ReadonlyArray<ColumnType>;
  index: number;
}
export const ChartRecordDataRow: React.FC<Props> = React.memo((props) => {
  const {record, index, columns, songPropsByName} = props;
  const columnValues = columns.map<string | number>((c) => {
    switch (c) {
      case ColumnType.NO:
        return index;
      case ColumnType.SONG_TITLE:
        return getSongNameDisplay(record, songPropsByName);
      case ColumnType.DIFFICULTY:
        return record.difficulty;
      case ColumnType.LEVEL:
        const lvText = record.level.toFixed(1);
        return record.levelIsEstimate ? "*" + lvText : lvText;
      case ColumnType.ACHIEVEMENT:
        return record.achievement.toFixed(4) + "%";
      case ColumnType.RANK:
        return getRankTitle(record.achievement);
      case ColumnType.NEXT_RANK:
        return Array.from(record.nextRanks.values())
          .map((r) => r.rank.th + "%")
          .join("\n");
      case ColumnType.NEXT_RATING:
        return Array.from(record.nextRanks.values())
          .map((r) => "+" + r.minRt.toFixed(0))
          .join("\n");
      case ColumnType.RATING:
        return Math.floor(record.rating).toString();
    }
  });
  return (
    <ChartRecordRow
      className={DIFFICULTY_CLASSNAME_MAP.get(record.difficulty)}
      columnValues={columnValues}
    />
  );
});
