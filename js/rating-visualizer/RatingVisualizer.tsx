import React from 'react';

import {DX_MAX_RATING, DX_PLUS_RANKS} from './constants';
import {IntervalLines} from './IntervalLines';
import {LvRatingContainer} from './LvRatingContainer';
import {MultiplierTable} from './MultiplierTable';
import {OptionsInput} from './OptionsInput';
import {RatingAxis} from './RatingAxis';
import {RatingTable} from './RatingTable';

interface RatingVisualizerState {
  width: number;
  heightUnit: number;
  maxRating: number;
  minLv: number;
  maxLv: number;
  topPadding: number;
  axisLabelStep: number;
  highlightInterval?: [number, number];
}

export class RatingVisualizer extends React.PureComponent<{}, RatingVisualizerState> {
  private removeIntervalTimeout = 0;

  constructor(props: {}) {
    super(props);
    this.state = {
      minLv: 8,
      maxLv: 15,
      width: 30,
      heightUnit: 8,
      maxRating: DX_MAX_RATING,
      topPadding: 70,
      axisLabelStep: 5,
    };
  }

  render() {
    const {heightUnit, maxRating, axisLabelStep, highlightInterval, minLv, maxLv} = this.state;
    const levels = this.getLevels();
    const ranks = DX_PLUS_RANKS;
    const containerHeight = this.getContainerHeight();
    const canZoomIn = maxLv - minLv > 1;
    return (
      <div className="ratingVisualizer">
        <OptionsInput
          onChangeUnit={this.handleChangeHeightUnit}
          onSetRange={this.handleSetRange}
          minLv={minLv}
          maxLv={maxLv}
          onBlur={this.removeHighlightInterval}
          onFocus={this.cancelRemoveHighlightInterval}
        />
        <div
          className="container"
          onBlur={this.removeHighlightInterval}
          onFocus={this.cancelRemoveHighlightInterval}
          tabIndex={-1}
        >
          <div className="ratingContainer">
            {heightUnit ? (
              <RatingAxis
                maxRating={maxRating}
                heightUnit={heightUnit}
                containerHeight={containerHeight}
                step={axisLabelStep}
                onClick={this.removeHighlightInterval}
              />
            ) : null}
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
                  onZoomIn={this.handleSetRange}
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
        <div className="container">
          <RatingTable ranks={ranks} levels={levels} />
          <hr className="sectionSep" />
          <MultiplierTable />
          <footer className="footer">
            <hr className="sectionSep" />
            <span>Made by </span>
            <a className="authorLink" href="https://github.com/myjian" target="_blank">
              myjian
            </a>
            <span>.</span>
          </footer>
        </div>
      </div>
    );
  }

  private getDetailLevels(minLv: number, maxLv: number) {
    const lvs = [];
    let currentLv = maxLv;
    while (currentLv >= minLv) {
      lvs.push({
        title: currentLv.toFixed(1),
        minLv: currentLv,
        maxLv: currentLv,
      });
      currentLv -= 0.1;
    }
    console.log(lvs);
    return lvs;
  }

  private getLevels() {
    const {minLv, maxLv} = this.state;
    if (maxLv - minLv < 1) {
      return this.getDetailLevels(minLv, maxLv);
    }
    const lvs = [];
    let currentLv = maxLv;
    if (maxLv === 15) {
      lvs.push({title: "15", minLv: 15, maxLv: 15});
    } else {
      lvs.push({title: currentLv.toFixed(0), minLv: currentLv, maxLv: currentLv + 0.6});
    }
    currentLv--;
    while (currentLv >= minLv) {
      lvs.push({
        title: Math.round(currentLv).toFixed(0) + "+",
        minLv: currentLv + 0.7,
        maxLv: currentLv + 0.9,
      });
      lvs.push({
        title: Math.round(currentLv).toFixed(0),
        minLv: currentLv,
        maxLv: currentLv + 0.6,
      });
      currentLv--;
    }
    console.log(lvs);
    return lvs;
  }

  private getContainerHeight() {
    const {axisLabelStep, maxRating, heightUnit, topPadding} = this.state;
    return (maxRating + axisLabelStep) * heightUnit + topPadding;
  }

  private handleChangeHeightUnit = (unit: number) => {
    this.setState({heightUnit: unit});
    if (unit === 0) {
      this.removeHighlightInterval();
    }
  };

  private handleSetRange = (minLv: number, maxLv: number) => {
    this.setState({minLv, maxLv});
  };

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
