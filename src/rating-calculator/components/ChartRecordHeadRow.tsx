import React from 'react';

import {Language} from '../../common/lang';
import {useLanguage} from '../../common/lang-react';
import {CommonMessages} from '../common-messages';
import {ColumnType} from '../types';
import {ChartRecordRow} from './ChartRecordRow';

const MessagesByLang = {
  [Language.en_US]: {
    num: '#',
    song: 'Song',
    level: 'Level',
    rating: 'Rating',
    nextGoal: 'Next Goal',
    nextRating: '+Rating',
    rank: 'Rank',
    achievementAbbr: 'Achv',
  },
  [Language.zh_TW]: {
    num: '#',
    song: '歌曲',
    level: '等級',
    rating: 'R 值',
    nextGoal: '下個\n目標',
    nextRating: 'R 值\n加分',
    rank: 'Rank',
    achievementAbbr: '達成率',
  },
  [Language.ko_KR]: {
    num: '#',
    song: '노래',
    level: '레벨',
    rating: '레이팅',
    nextGoal: '다음 목표',
    nextRating: '+레이팅',
    rank: '등급',
    achievementAbbr: '정확도',
  },
};

function getColumnTitle(lang: Language, col: ColumnType): string {
  const messages = MessagesByLang[lang];
  return {
    [ColumnType.NO]: messages.num,
    [ColumnType.SONG_TITLE]: messages.song,
    [ColumnType.DIFFICULTY]: CommonMessages[lang].difficulty,
    [ColumnType.LEVEL]: CommonMessages[lang].level,
    [ColumnType.ACHIEVEMENT]: messages.achievementAbbr,
    [ColumnType.RANK]: messages.rank,
    [ColumnType.RATING]: messages.rating,
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
  const columnTitles = columns.map((c) => getColumnTitle(lang, c));
  const handleClick = sortBy && ((index: number) => sortBy(columns[index]));
  return <ChartRecordRow columnValues={columnTitles} onClickCell={handleClick} isHeading />;
});
