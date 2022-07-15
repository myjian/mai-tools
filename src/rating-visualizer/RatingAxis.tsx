import React from 'react';

interface RatingAxisProps {
  maxRating: number;
  containerHeight: number;
  heightUnit: number;
  step: number;
  onClick: () => void;
}

/**
 * The y-axis displaying the rating values.
 */
export const RatingAxis = ({
  step,
  maxRating,
  heightUnit,
  containerHeight,
  onClick,
}: RatingAxisProps) => {
  const containerStyle = {
    height: containerHeight + "px",
  };
  const values = [];
  // values should include maxRating
  for (let r = 0; r < maxRating + step; r += step) {
    values.push(r);
  }
  return (
    <div className="axisLabelContainer" style={containerStyle} onClick={onClick}>
      {values.map((v) => (
        <AxisLabel key={v} value={v} heightUnit={heightUnit} />
      ))}
    </div>
  );
};

const AxisLabel = ({value, heightUnit}: {value: number; heightUnit: number}) => {
  const childStyle = {bottom: value * heightUnit + "px"};
  return (
    <div className="axisLabel" style={childStyle}>
      <span className="axisLabelText">{value}</span>
    </div>
  );
};
