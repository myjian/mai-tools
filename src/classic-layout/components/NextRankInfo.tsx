import {memo} from 'react';

interface NextRankInfoProps {
  nextRank?: {title: string; diff: number};
  showTitle: boolean;
}

function getNextRankDiff(nextRank?: {title: string; diff: number}) {
  if (!nextRank) {
    return '—————';
  }
  const {diff} = nextRank;
  if (typeof diff === 'number') {
    if (Math.round(diff) !== diff) {
      return diff.toFixed(4) + '%';
    }
    return diff.toLocaleString('en');
  }
  return diff;
}

export const NextRankInfo = memo(({nextRank, showTitle}: NextRankInfoProps) => {
  const nextRankTitle = showTitle && nextRank ? nextRank.title : '';
  const nextRankDiff = getNextRankDiff(nextRank);
  return (
    <tr className="nextRank">
      <th className="noRightBorder" colSpan={4}>
        NEXT RANK
      </th>
      <td className="noLeftBorder" colSpan={2}>
        {nextRankTitle && <span className="nextRankTitle">{nextRankTitle}</span>}
        {nextRankDiff && <span className="nextRankDiff">{nextRankDiff}</span>}
      </td>
    </tr>
  );
});
