import React from 'react';

import {DX_LEVELS, DX_MAX_RATING, DX_PLUS_LEVELS, DX_PLUS_RANKS, DX_RANKS} from './constants';
import {IntervalLines} from './IntervalLines';
import {LvRatingContainer} from './LvRatingContainer';
import {OptionsInput} from './OptionsInput';
import {RatingAxis} from './RatingAxis';
import {RatingTable} from './RatingTable';

interface RatingVisualizerState {
  width: number;
  heightUnit: number;
  maxRating: number;
  isDxPlus: boolean;
  selectedLvTitle?: string;
  minLv?: number;
  maxLv?: number;
  topPadding: number;
  axisLabelStep: number;
  highlightInterval?: [number, number];
}

export class RatingVisualizer extends React.PureComponent<{}, RatingVisualizerState> {
  private removeIntervalTimeout = 0;

  constructor(props: {}) {
    super(props);
    this.state = {
      width: 30,
      heightUnit: 8,
      maxRating: DX_MAX_RATING,
      topPadding: 70,
      isDxPlus: true,
      axisLabelStep: 5,
    };
  }

  render() {
    const {
      isDxPlus,
      heightUnit,
      maxRating,
      axisLabelStep,
      highlightInterval,
      minLv,
      selectedLvTitle,
    } = this.state;
    const levels = this.getLevels();
    const ranks = isDxPlus ? DX_PLUS_RANKS : DX_RANKS;
    const containerHeight = this.getContainerHeight();
    const canZoomIn = !minLv;
    return (
      <div className="ratingVisualizer">
        <OptionsInput
          isDxPlus={isDxPlus}
          onChangeDxPlus={this.handleDxPlusChange}
          onChangeUnit={this.handleChangeHeightUnit}
          onZoomOut={this.handleUnselectLv}
          selectedLv={selectedLvTitle}
          minLv={levels[levels.length - 1].title}
          maxLv={levels[0].title}
          showZoomOutButton={!canZoomIn}
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
            {levels.map((lv) => {
              return (
                <LvRatingContainer
                  key={lv.title}
                  canZoomIn={canZoomIn}
                  lvTitle={lv.title}
                  minLv={lv.minLv}
                  maxLv={lv.maxLv}
                  heightUnit={heightUnit}
                  containerHeight={containerHeight}
                  ranks={ranks}
                  onZoomIn={this.handleSelectLv}
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
          <footer className="footer">
            <hr className="footerSep" />
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

  private getLevels() {
    const {minLv, isDxPlus} = this.state;
    let {maxLv} = this.state;
    if (minLv && maxLv) {
      const lvs = [];
      while (minLv <= maxLv) {
        lvs.push({
          title: maxLv.toFixed(1),
          minLv: maxLv,
          maxLv: maxLv,
        });
        maxLv -= 0.1;
      }
      return lvs;
    }
    return isDxPlus ? DX_PLUS_LEVELS : DX_LEVELS;
  }

  private getContainerHeight() {
    const {axisLabelStep, maxRating, heightUnit, topPadding} = this.state;
    return (maxRating + axisLabelStep) * heightUnit + topPadding;
  }

  private handleDxPlusChange = (isPlus: boolean) => {
    this.setState({isDxPlus: isPlus});
    if (!isPlus && this.state.maxLv > 14) {
      this.handleUnselectLv();
    }
  };

  private handleChangeHeightUnit = (unit: number) => {
    this.setState({heightUnit: unit});
    if (unit === 0) {
      this.removeHighlightInterval();
    }
  };

  private handleSelectLv = (lvTitle: string, minLv: number, maxLv: number) => {
    this.setState({selectedLvTitle: lvTitle, minLv, maxLv});
  };

  private handleUnselectLv = () => {
    this.setState({minLv: undefined, maxLv: undefined, selectedLvTitle: undefined});
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
    console.log("removeInterval");
    console.log(document.activeElement);
    this.removeIntervalTimeout = setTimeout(() => {
      this.setState({highlightInterval: undefined});
      this.removeIntervalTimeout = 0;
    }, 0);
  };

  private cancelRemoveHighlightInterval = () => {
    console.log("cancelRemove");
    console.log(document.activeElement);
    if (this.removeIntervalTimeout) {
      clearTimeout(this.removeIntervalTimeout);
      this.removeIntervalTimeout = 0;
    }
  };
}
