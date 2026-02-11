import {useMemo} from 'react';

interface NextRankInfoProps {
  nextRank?: {title: string; diff: number};
  showTitle: boolean;
}

export const NextRankInfo = ({nextRank, showTitle}: NextRankInfoProps) => {
  const nextRankTitle = showTitle && nextRank ? nextRank.title : '';
  const nextRankDiff = useMemo(() => {
    if (!nextRank) {
      return '—————';
    }
    const {diff} = nextRank;
    return typeof diff !== 'number'
      ? diff
      : Math.round(diff) === diff
        ? diff.toLocaleString('en')
        : diff.toFixed(4) + '%';
  }, [nextRank]);
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
};
