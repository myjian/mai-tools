import React from 'react';

import {LvLabel} from './LvLabel';
import {LvRankRatingSegment} from './LvRankRatingSegment';
import {RankDef} from './types';

interface LvRatingContainerProps {
  canZoomIn: boolean;
  lvTitle: string;
  minLv: number;
  maxLv: number;
  ranks: ReadonlyArray<RankDef>;
  heightUnit: number;
  containerHeight: number;
  onZoomIn: (lvTitle: string, minLv: number, maxLv: number) => void;
  highlightInterval: (min: number, max: number) => void;
}

export class LvRatingContainer extends React.PureComponent<LvRatingContainerProps> {
  render() {
    const {canZoomIn, lvTitle, minLv, maxLv, heightUnit, containerHeight, ranks} = this.props;
    const style = {
      height: containerHeight + "px",
    };
    return (
      <div className="lvRatingContainer" style={style}>
        <LvLabel title={lvTitle} onClick={this.handleLabelClick} canZoomIn={canZoomIn} />
        {ranks.map((rank) => (
          <LvRankRatingSegment
            key={rank.title}
            minLv={minLv}
            maxLv={maxLv}
            minAchv={rank.minAchv}
            maxAchv={rank.maxAchv}
            rankFactor={rank.rankFactor}
            maxRankFactor={rank.maxRankFactor}
            heightUnit={heightUnit}
            title={rank.title}
            highlightInterval={this.props.highlightInterval}
          />
        ))}
      </div>
    );
  }

  private handleLabelClick = () => {
    const {lvTitle, minLv, maxLv} = this.props;
    this.props.onZoomIn(lvTitle, minLv, maxLv);
  };
}
