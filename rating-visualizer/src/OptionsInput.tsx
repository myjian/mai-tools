import React from 'react';

interface OptionsInputProps {
  onChangeDxPlus: (isPlus: boolean) => void;
  minLv: number | string;
  maxLv: number | string;
  showZoomOutButton: boolean;
  selectedLv: string;
  onZoomOut: () => void;
  onChangeUnit: (heightUnit: number) => void;
  onFocus: () => void;
  onBlur: () => void;
}

export class OptionsInput extends React.PureComponent<OptionsInputProps> {
  render() {
    const {
      minLv, maxLv, selectedLv, showZoomOutButton,
      onZoomOut, onFocus, onBlur,
    } = this.props;
    const lvDisplayed = selectedLv || `${minLv} - ${maxLv}`;
    return (
      <div className="optionsContainer">
        <div className="container" onFocus={onFocus} onBlur={onBlur} tabIndex={-1}>
          <label className="optionGroup">
            Game version:&nbsp;
            <select onChange={this.handleChangeVersion}>
              <option value="dx">DX</option>
              <option value="plus">DX+</option>
            </select>
          </label>
          <label className="optionGroup">
            Scale:&nbsp;
            <select onChange={this.handleChangeHeightUnit}>
              <option value="3">3x</option>
              <option value="4">4x</option>
              <option value="5">5x</option>
              <option value="8" selected>8x</option>
              <option value="12">12x</option>
            </select>
          </label>
          <span className="lvRangeLabelContainer">
            Showing&nbsp;Level&nbsp;
            <span className="lvRangeLabel">{lvDisplayed}</span>
            {showZoomOutButton && (
              <button className="resetZoomButton" onClick={onZoomOut}>Reset</button>
            )}
          </span>
        </div>
      </div>
    );
  }

  private handleChangeVersion = (evt: React.SyntheticEvent<HTMLSelectElement>) => {
    console.log(evt.target);
    const isPlus = evt.currentTarget.value === "plus";
    this.props.onChangeDxPlus(isPlus);
  }

  private handleChangeHeightUnit = (evt: React.SyntheticEvent<HTMLSelectElement>) => {
    console.log(evt.target);
    const unit = parseInt(evt.currentTarget.value);
    this.props.onChangeUnit(unit);
  };
}
