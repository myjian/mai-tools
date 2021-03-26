import React from 'react';

import {DX_SPLASH_GAME_VERSION, DX_SPLASH_PLUS_GAME_VERSION} from '../common/constants';
import {DX_LEVELS, getLvIndex} from './levels';

interface OptionsInputProps {
  minLv: string;
  maxLv: string;
  onSetGameVer: (gameVer: number) => void;
  onSetRange: (minLv: string, maxLv: string) => void;
  onChangeUnit: (heightUnit: number) => void;
  onFocus: () => void;
  onBlur: () => void;
}

export class OptionsInput extends React.PureComponent<OptionsInputProps> {
  render() {
    const {minLv, maxLv, onFocus, onBlur} = this.props;
    return (
      <div className="optionsContainer">
        <div className="container" onFocus={onFocus} onBlur={onBlur} tabIndex={-1}>
          <label className="optionGroup">
            Ver:&nbsp;
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
            <label className="optionGroup">
              Max&nbsp;Level:&nbsp;
              <select onChange={this.handleChangeMaxLv}>{this.renderLvOptions(maxLv)}</select>
            </label>
            <label className="optionGroup">
              Min&nbsp;Level:&nbsp;
              <select onChange={this.handleChangeMinLv}>{this.renderLvOptions(minLv)}</select>
            </label>
          </span>
        </div>
      </div>
    );
  }

  private renderLvOptions(selectedLv: string) {
    const options: JSX.Element[] = [];
    for (let i = 0; i < DX_LEVELS.length; i++) {
      const lv = DX_LEVELS[i];
      const isSelected = selectedLv === lv.title;
      options.push(
        <option key={i} value={lv.title} selected={isSelected}>
          {lv.title}
        </option>
      );
    }
    return options;
  }

  private handleSetGameVer = (evt: React.SyntheticEvent<HTMLSelectElement>) => {
    const gameVerText = evt.currentTarget.value;
    this.props.onSetGameVer(parseInt(gameVerText));
  };

  private handleChangeMinLv = (evt: React.SyntheticEvent<HTMLSelectElement>) => {
    const minLv = evt.currentTarget.value;
    const minLvIdx = getLvIndex(minLv);
    const maxLvIdx = getLvIndex(this.props.maxLv);
    this.props.onSetRange(minLv, DX_LEVELS[Math.min(minLvIdx, maxLvIdx)].title);
  };

  private handleChangeMaxLv = (evt: React.SyntheticEvent<HTMLSelectElement>) => {
    const maxLv = evt.currentTarget.value;
    const minLvIdx = getLvIndex(this.props.minLv);
    const maxLvIdx = getLvIndex(maxLv);
    this.props.onSetRange(DX_LEVELS[Math.max(minLvIdx, maxLvIdx)].title, maxLv);
  };

  private handleChangeHeightUnit = (evt: React.SyntheticEvent<HTMLSelectElement>) => {
    console.log(evt.target);
    const unit = parseInt(evt.currentTarget.value);
    this.props.onChangeUnit(unit);
  };
}
