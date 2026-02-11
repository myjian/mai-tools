import {memo, useCallback} from 'react';

interface LvRankRatingSegmentProps {
  minAchv: number;
  minLv: number;
  minFactor: number;
  maxAchv: number;
  maxLv: number;
  maxFactor: number;
  heightUnit: number;
  title: string;
  highlightInterval: (min: number, max: number) => void;
}

export const LvRankRatingSegment = memo(
  ({
    minAchv,
    minLv,
    minFactor,
    maxAchv,
    maxLv,
    maxFactor,
    heightUnit,
    title,
    highlightInterval,
  }: LvRankRatingSegmentProps) => {
    const minRt = Math.floor(minLv * minAchv * minFactor);
    const maxRt = Math.floor(maxLv * maxAchv * maxFactor);
    const hoverText = minRt < maxRt ? `${minRt} - ${maxRt}` : maxRt.toString();

    const handleClick = useCallback(() => {
      highlightInterval(minRt, maxRt);
    }, [minRt, maxRt, highlightInterval]);

    const style = {
      bottom: (minRt - 0.5) * heightUnit + 'px',
      height: (maxRt - minRt + 1) * heightUnit + 'px',
    };
    const className = 'ratingSegment segment' + title.replace('+', 'P');
    return (
      <div className={className} style={style} title={hoverText} tabIndex={0} onClick={handleClick}>
        <div className="ratingSegmentLabel">{title}</div>
      </div>
    );
  },
);
