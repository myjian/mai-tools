import React from 'react';

interface NextRankInfoProps {
  nextRank?: {title: string, diff: number};
  showTitle: boolean;
}

export class NextRankInfo extends React.PureComponent<NextRankInfoProps> {
  state = {showTitle: false};
  render() {
    const {nextRank, showTitle} = this.props;
    const nextRankTitle = (showTitle && nextRank) ? nextRank.title : "";
    const nextRankDiff = this.getNextRankDiff();
    return (
      <tr className="nextRank">
        <th className="noRightBorder" colSpan={4}>NEXT RANK</th>
        <td className="noLeftBorder" colSpan={2} id="nextRank">
          {nextRankTitle && <span className="nextRankTitle">{nextRankTitle}</span>}
          {nextRankDiff && <span className="nextRankDiff">{nextRankDiff}</span>}
        </td>
      </tr>
    );
  }
  
  private getNextRankDiff() {
    const {nextRank} = this.props;
    if (!nextRank) {
      return "—————";
    }
    const {diff} = nextRank;
    if (typeof diff === "number") {
      if (Math.round(diff) !== diff) {
        return diff.toFixed(4) + "%";
      }
      return diff.toLocaleString("en");
    }
    return diff;
  }
}
