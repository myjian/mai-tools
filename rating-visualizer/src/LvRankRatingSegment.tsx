import React from 'react';

interface LvRankRatingSegmentProps {
  minAchv: number;
  minLv: number;
  rankFactor: number;
  maxAchv: number;
  maxLv: number;
  maxRankFactor?: number;
  heightUnit: number;
  title: string;
  highlightInterval: (min: number, max: number) => void;
}

export class LvRankRatingSegment extends React.PureComponent<LvRankRatingSegmentProps> {
  private minRt = 0;
  private maxRt = 0;

  render() {
    const {
      minLv,
      minAchv,
      rankFactor,
      maxLv,
      maxAchv,
      maxRankFactor,
      heightUnit,
      title,
    } = this.props;
    this.minRt = Math.floor((minLv * minAchv * rankFactor) / 100);
    this.maxRt = Math.floor((maxLv * maxAchv * (maxRankFactor || rankFactor)) / 100);
    const style = {
      bottom: (this.minRt - 0.5) * heightUnit + "px",
      height: (this.maxRt - this.minRt + 1) * heightUnit + "px",
    };
    const className = "ratingSegment " + "segment" + title.replace("+", "P");
    return (
      <div
        className={className}
        style={style}
        title={this.hoverText()}
        tabIndex={0}
        onClick={this.handleClick}
      >
        <div className="ratingSegmentLabel">{title}</div>
      </div>
    );
  }

  private hoverText(): string {
    if (this.minRt < this.maxRt) {
      return `${this.minRt} - ${this.maxRt}`;
    }
    return this.maxRt.toString();
  }

  private handleClick = () => {
    this.props.highlightInterval(this.minRt, this.maxRt);
  };
}
