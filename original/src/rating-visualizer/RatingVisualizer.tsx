import React from 'react';

import {RankDef} from '../common/rank-functions';
import {IntervalLines} from './IntervalLines';
import {LevelDef} from './levels';
import {LvRatingContainer} from './LvRatingContainer';
import {RatingAxis} from './RatingAxis';

interface Props {
  heightUnit: number;
  maxRating: number;
  levels: ReadonlyArray<LevelDef>;
  canZoomIn: boolean;
  topPadding: number;
  ranks: ReadonlyArray<RankDef>;
  handleSetRange: (minLv: string, maxLv: string) => void;
  axisLabelStep: number;
}

interface State {
  highlightInterval?: [number, number];
}

export class RatingVisualizer extends React.PureComponent<Props, State> {
  private removeIntervalTimeout = 0;

  state: State = {};

  render() {
    const { axisLabelStep, canZoomIn, handleSetRange, heightUnit, levels, maxRating, ranks } = this.props;
    const { highlightInterval } = this.state;
    const containerHeight = this.getContainerHeight();

    if (!heightUnit) {
      return null;
    }

    return (
      <div
        className="container"
        onBlur={this.removeHighlightInterval}
        onFocus={this.cancelRemoveHighlightInterval}
        tabIndex={-1}
      >
        <div className="ratingContainer">
          <RatingAxis
            maxRating={maxRating}
            heightUnit={heightUnit}
            containerHeight={containerHeight}
            step={axisLabelStep}
            onClick={this.removeHighlightInterval}
          />
          {levels.map((lv, i) => {
            return (
              <LvRatingContainer
                key={i}
                canZoomIn={canZoomIn}
                lvTitle={lv.title}
                minLv={lv.minLv}
                maxLv={lv.maxLv}
                heightUnit={heightUnit}
                containerHeight={containerHeight}
                ranks={ranks}
                onZoomIn={handleSetRange}
                highlightInterval={this.highlightInterval}
              />
            );
          })}
          {highlightInterval && (
            <IntervalLines
              interval={highlightInterval}
              heightUnit={heightUnit}
              onClick={this.removeHighlightInterval}
            />
          )}
        </div>
      </div>
    );
  }


  private getContainerHeight(): number {
    const {axisLabelStep, maxRating, heightUnit, topPadding} = this.props;
    return (maxRating + axisLabelStep) * heightUnit + topPadding;
  }

  private highlightInterval = (minRt: number, maxRt: number) => {
    const curItvl = this.state.highlightInterval;
    if (curItvl && curItvl[0] === minRt && curItvl[1] === maxRt) {
      this.removeHighlightInterval();
    } else {
      this.setState({highlightInterval: [minRt, maxRt]});
    }
  };

  private removeHighlightInterval = () => {
    this.removeIntervalTimeout = window.setTimeout(() => {
      this.setState({highlightInterval: undefined});
      this.removeIntervalTimeout = 0;
    }, 0);
  };

  private cancelRemoveHighlightInterval = () => {
    if (this.removeIntervalTimeout) {
      clearTimeout(this.removeIntervalTimeout);
      this.removeIntervalTimeout = 0;
    }
  };
}

