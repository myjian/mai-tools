import {memo, useCallback} from 'react';

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

export const LvRatingContainer = memo(
  ({
    canZoomIn,
    lvTitle,
    minLv,
    maxLv,
    heightUnit,
    containerHeight,
    ranks,
    onZoomIn,
    highlightInterval,
  }: LvRatingContainerProps) => {
    const handleLabelClick = useCallback(() => {
      onZoomIn(lvTitle, lvTitle);
    }, [lvTitle, onZoomIn]);

    const style = {
      height: containerHeight + 'px',
    };
    return (
      <div className="lvRatingContainer" style={style}>
        <LvLabel title={lvTitle} onClick={handleLabelClick} canZoomIn={canZoomIn} />
        {heightUnit
          ? ranks.map((rank, idx) => {
              const maxAchv =
                rank.maxAchv || (idx === 0 ? rank.minAchv : ranks[idx - 1].minAchv - 0.0001);
              return (
                <LvRankRatingSegment
                  key={rank.title}
                  minLv={minLv}
                  maxLv={maxLv}
                  minAchv={rank.minAchv}
                  maxAchv={maxAchv}
                  minFactor={rank.factor}
                  maxFactor={rank.maxFactor || rank.factor}
                  heightUnit={heightUnit}
                  title={rank.title}
                  highlightInterval={highlightInterval}
                />
              );
            })
          : null}
      </div>
    );
  },
);
