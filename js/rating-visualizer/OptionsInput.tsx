import React from 'react';

import {DX_SPLASH_GAME_VERSION, DX_SPLASH_PLUS_GAME_VERSION} from '../common/constants';

const PRESET_OPTIONS = ["8-15", "8-11", "9-12", "10-13", "11-14", "12-15"];

interface OptionsInputProps {
  minLv: number;
  maxLv: number;
  onSetGameVer: (gameVer: number) => void;
  onSetRange: (minLv: number, maxLv: number) => void;
  onChangeUnit: (heightUnit: number) => void;
  onFocus: () => void;
  onBlur: () => void;
}

export class OptionsInput extends React.PureComponent<OptionsInputProps> {
  render() {
    const {onFocus, onBlur} = this.props;
    return (
      <div className="optionsContainer">
        <div className="container" onFocus={onFocus} onBlur={onBlur} tabIndex={-1}>
          <label className="optionGroup">
            Game ver:&nbsp;
            <select onChange={this.handleSetGameVer}>
              <option value={DX_SPLASH_GAME_VERSION} selected>
                Splash
              </option>
              <option value={DX_SPLASH_PLUS_GAME_VERSION}>Splash PLUS</option>
            </select>
          </label>
          <label className="optionGroup">
            Scale:&nbsp;
            <select onChange={this.handleChangeHeightUnit}>
              <option value="0">Hide</option>
              <option value="3">3x</option>
              <option value="4">4x</option>
              <option value="5">5x</option>
              <option value="8" selected>
                8x
              </option>
              <option value="12">12x</option>
            </select>
          </label>
          <span className="lvRangeLabelContainer">
            Showing&nbsp;Level&nbsp;
            <select onChange={this.handleChangeRange}>{this.renderOptions()}</select>
          </span>
        </div>
      </div>
    );
  }

  private renderOptions() {
    const {minLv, maxLv} = this.props;
    const selectedRange =
      maxLv - minLv > 1
        ? minLv.toFixed(0) + "-" + maxLv.toFixed(0)
        : minLv - Math.floor(minLv) > 0
        ? Math.floor(minLv) + "+"
        : minLv.toFixed(0);
    let isPresetRange = false;
    const options: JSX.Element[] = [];
    PRESET_OPTIONS.forEach((range, i) => {
      const isSelected = selectedRange === range;
      if (isSelected) isPresetRange = true;
      options.push(
        <option key={i} value={range} selected={isSelected}>
          {range.replace("-", " - ")}
        </option>
      );
    });
    if (!isPresetRange) {
      options.push(
        <option key={PRESET_OPTIONS.length} value={selectedRange} selected>
          {selectedRange}
        </option>
      );
    }
    return options;
  }

  private handleSetGameVer = (evt: React.SyntheticEvent<HTMLSelectElement>) => {
    const gameVerText = evt.currentTarget.value;
    this.props.onSetGameVer(parseInt(gameVerText));
  };

  private handleChangeRange = (evt: React.SyntheticEvent<HTMLSelectElement>) => {
    const rangeText = evt.currentTarget.value.split("-");
    this.props.onSetRange(parseInt(rangeText[0]), parseInt(rangeText[1]));
  };

  private handleChangeHeightUnit = (evt: React.SyntheticEvent<HTMLSelectElement>) => {
    console.log(evt.target);
    const unit = parseInt(evt.currentTarget.value);
    this.props.onChangeUnit(unit);
  };
}
