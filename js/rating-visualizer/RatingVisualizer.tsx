import React from 'react';

import {DX_SPLASH_GAME_VERSION} from '../common/constants';
import {getRankDefinitions} from '../common/rank-functions';
import {IntervalLines} from './IntervalLines';
import {DX_LEVELS, getLvIndex} from './levels';
import {LvRatingContainer} from './LvRatingContainer';
import {MultiplierTable} from './MultiplierTable';
import {OptionsInput} from './OptionsInput';
import {RatingAxis} from './RatingAxis';
import {RatingTable} from './RatingTable';

interface RatingVisualizerState {
  gameVer: number;
  width: number;
  heightUnit: number;
  maxRating: number;
  minLv: string;
  maxLv: string;
  topPadding: number;
  axisLabelStep: number;
  highlightInterval?: [number, number];
}

export class RatingVisualizer extends React.PureComponent<{}, RatingVisualizerState> {
  private removeIntervalTimeout = 0;

  constructor(props: {}) {
    super(props);
    const gameVer = DX_SPLASH_GAME_VERSION;
    const heightUnit = 8;
    const maxLv = 15;
    this.state = {
      gameVer,
      minLv: "10",
      maxLv: "14",
      width: 30,
      heightUnit,
      maxRating: calculateMaxRating(maxLv, gameVer),
      topPadding: heightUnit * 2 + 50,
      axisLabelStep: 5,
    };
  }

  render() {
    const {
      gameVer,
      heightUnit,
      maxRating,
      axisLabelStep,
      highlightInterval,
      minLv,
      maxLv,
    } = this.state;
    const levels = this.getLevels();
    // Only include SSS+ - A
    const ranks = getRankDefinitions(gameVer).slice(0, 9);
    const containerHeight = this.getContainerHeight();
    const canZoomIn = maxLv !== minLv;
    return (
      <div className="ratingVisualizer">
        <OptionsInput
          onChangeUnit={this.handleChangeHeightUnit}
          onSetGameVer={this.handleSetGameVer}
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
          <MultiplierTable gameVer={gameVer} />
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

  private getDetailLevels(startIdx: number, endIdx: number) {
    const lvs = [];
    let currentLv = DX_LEVELS[startIdx].maxLv;
    const minLv = DX_LEVELS[endIdx].minLv;
    console.log(currentLv, minLv);
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
    const startIdx = getLvIndex(maxLv);
    const endIdx = getLvIndex(minLv);
    console.log(startIdx, endIdx);
    if (endIdx - startIdx < 2) {
      return this.getDetailLevels(startIdx, endIdx);
    }
    return DX_LEVELS.slice(startIdx, endIdx + 1);
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

  private handleSetGameVer = (gameVer: number) => {
    this.setState(({maxLv}) => {
      const lvDef = DX_LEVELS.find((lv) => lv.title === maxLv);
      return {gameVer, maxRating: calculateMaxRating(lvDef.maxLv, gameVer)};
    });
  };

  private handleSetRange = (minLv: string, maxLv: string) => {
    const maxLvDef = DX_LEVELS.find((lv) => lv.title === maxLv);
    this.setState(({gameVer}) => ({
      minLv,
      maxLv,
      maxRating: calculateMaxRating(maxLvDef.maxLv, gameVer),
    }));
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

function calculateMaxRating(maxLv: number, gameVer: number) {
  const maxRank = getRankDefinitions(gameVer)[0];
  return Math.floor((maxRank.minAchv * maxRank.factor * maxLv) / 100);
}
