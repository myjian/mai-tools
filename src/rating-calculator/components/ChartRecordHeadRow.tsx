import React, {useCallback} from 'react';

import {Language} from '../../common/lang';
import {useLanguage} from '../../common/lang-react';
import {CommonMessages} from '../common-messages';
import {ColumnType} from '../types';
import {ChartRecordRow} from './ChartRecordRow';

const MessagesByLang = {
  [Language.en_US]: {
    num: '#',
    song: 'Song',
    nextGoal: 'Next Goal',
    nextRating: '+Rating',
  },
  [Language.zh_TW]: {
    num: '#',
    song: '歌曲',
    nextGoal: '下個\n目標',
    nextRating: 'R 值\n加分',
  },
  [Language.ko_KR]: {
    num: '#',
    song: '노래',
    nextGoal: '다음 목표',
    nextRating: '+레이팅',
  },
};

function getColumnTitle(lang: Language, col: ColumnType): string {
  const messages = MessagesByLang[lang];
  return {
    [ColumnType.NO]: messages.num,
    [ColumnType.SONG_TITLE]: messages.song,
    [ColumnType.CHART_TYPE]: CommonMessages[lang].chartType,
    [ColumnType.LEVEL]: CommonMessages[lang].level,
    [ColumnType.ACHIEVEMENT]: CommonMessages[lang].achievementAbbr,
    [ColumnType.RANK]: CommonMessages[lang].rank,
    [ColumnType.RATING]: CommonMessages[lang].rating,
    [ColumnType.NEXT_RANK]: messages.nextGoal,
    [ColumnType.NEXT_RATING]: messages.nextRating,
  }[col];
}

interface Props {
  columns?: ReadonlyArray<ColumnType>;
  sortBy?: (col: ColumnType) => void;
}

export const ChartRecordHeadRow = React.memo(({columns, sortBy}: Props) => {
  const lang = useLanguage();
  const handleClick = sortBy && ((index: number) => sortBy(columns[index]));
  const renderCell = useCallback((col: ColumnType) => getColumnTitle(lang, col), [lang]);

  return (
    <ChartRecordRow columns={columns} onClickCell={handleClick} isHeading renderCell={renderCell} />
  );
});
