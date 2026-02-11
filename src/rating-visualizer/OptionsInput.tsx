import {memo, useCallback} from 'react';

import {DisplayValue} from './RatingTable';

export const LEVELS: ReadonlyArray<string> = [
  '15',
  '14+',
  '14',
  '13+',
  '13',
  '12+',
  '12',
  '11+',
  '11',
  '10+',
  '10',
];

interface OptionsInputProps {
  heightUnit: number;
  minLv: string;
  maxLv: string;
  minRank: string;
  tableDisplay: DisplayValue;
  onSetRange: (minLv: string, maxLv: string) => void;
  onChangeUnit: (heightUnit: number) => void;
  onSetMinRank: (minRank: string) => void;
  onSetTableDisplay: (display: DisplayValue) => void;
}

const renderLvOptions = () => {
  return LEVELS.map((lv, i) => (
    <option key={i} value={lv}>
      {lv}
    </option>
  ));
};

export const OptionsInput = memo(
  ({
    heightUnit,
    minLv,
    minRank,
    maxLv,
    tableDisplay,
    onSetRange,
    onChangeUnit,
    onSetMinRank,
    onSetTableDisplay,
  }: OptionsInputProps) => {
    const handleChangeMinLv = useCallback(
      (evt: React.SyntheticEvent<HTMLSelectElement>) => {
        const newMinLv = evt.currentTarget.value;
        const minLvIdx = LEVELS.indexOf(newMinLv);
        const maxLvIdx = LEVELS.indexOf(maxLv);
        onSetRange(newMinLv, LEVELS[Math.min(minLvIdx, maxLvIdx)]);
      },
      [maxLv, onSetRange],
    );

    const handleChangeMaxLv = useCallback(
      (evt: React.SyntheticEvent<HTMLSelectElement>) => {
        const newMaxLv = evt.currentTarget.value;
        const minLvIdx = LEVELS.indexOf(minLv);
        const maxLvIdx = LEVELS.indexOf(newMaxLv);
        onSetRange(LEVELS[Math.max(minLvIdx, maxLvIdx)], newMaxLv);
      },
      [minLv, onSetRange],
    );

    const handleChangeHeightUnit = useCallback(
      (evt: React.SyntheticEvent<HTMLSelectElement>) => {
        const unit = parseInt(evt.currentTarget.value);
        onChangeUnit(unit);
      },
      [onChangeUnit],
    );

    const handleChangeMinRank = useCallback(
      (evt: React.SyntheticEvent<HTMLSelectElement>) => {
        onSetMinRank(evt.currentTarget.value);
      },
      [onSetMinRank],
    );

    const handleChangeTableDisplay = useCallback(
      (evt: React.SyntheticEvent<HTMLSelectElement>) => {
        onSetTableDisplay(evt.currentTarget.value as DisplayValue);
      },
      [onSetTableDisplay],
    );

    return (
      <div className="optionsContainer">
        <div className="container" tabIndex={-1}>
          <span className="lvRangeLabelContainer">
            <label className="optionGroup">
              Min&nbsp;Lv:&nbsp;
              <select onChange={handleChangeMinLv} value={minLv}>
                {renderLvOptions()}
              </select>
            </label>
            <label className="optionGroup">
              Max&nbsp;Lv:&nbsp;
              <select onChange={handleChangeMaxLv} value={maxLv}>
                {renderLvOptions()}
              </select>
            </label>
          </span>
          <label className="optionGroup">
            Min Rank:&nbsp;
            <select onChange={handleChangeMinRank} value={minRank}>
              <option value="AAA">AAA</option>
              <option value="S">S</option>
              <option value="SS">SS</option>
              <option value="SSS">SSS</option>
            </select>
          </label>
          <br></br>
          <label className="optionGroup">
            Graph:&nbsp;
            <select onChange={handleChangeHeightUnit} value={heightUnit.toFixed(0)}>
              <option value="0">Hide</option>
              <option value="3">3x</option>
              <option value="4">4x</option>
              <option value="5">5x</option>
              <option value="8">8x</option>
              <option value="12">12x</option>
            </select>
          </label>
          <label className="optionGroup">
            Table values:&nbsp;
            <select onChange={handleChangeTableDisplay} value={tableDisplay}>
              <option value="MIN">MIN</option>
              <option value="MAX">MAX</option>
              <option value="RANGE">RANGE</option>
            </select>
          </label>
        </div>
      </div>
    );
  },
);
