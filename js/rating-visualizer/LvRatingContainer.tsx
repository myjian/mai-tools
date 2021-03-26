import React from 'react';

import {RankDef} from '../common/rank-functions';
import {LvLabel} from './LvLabel';
import {LvRankRatingSegment} from './LvRankRatingSegment';

interface LvRatingContainerProps {
  canZoomIn: boolean;
  lvTitle: string;
  minLv: number;
  maxLv: number;
  ranks: ReadonlyArray<RankDef>;
  heightUnit: number;
  containerHeight: number;
  onZoomIn: (minLv: string, maxLv: string) => void;
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
        {heightUnit
          ? ranks.map((rank, idx) => {
              const maxAchv = idx === 0 ? rank.minAchv : ranks[idx - 1].minAchv - 0.0001;
              return (
                <LvRankRatingSegment
                  key={rank.title}
                  minLv={minLv}
                  maxLv={maxLv}
                  minAchv={rank.minAchv}
                  maxAchv={maxAchv}
                  rankFactor={rank.factor}
                  heightUnit={heightUnit}
                  title={rank.title}
                  highlightInterval={this.props.highlightInterval}
                />
              );
            })
          : null}
      </div>
    );
  }

  private handleLabelClick = () => {
    const {lvTitle} = this.props;
    this.props.onZoomIn(lvTitle, lvTitle);
  };
}
