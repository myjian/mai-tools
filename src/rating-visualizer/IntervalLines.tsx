import {memo} from 'react';

interface IntervalLinesProps {
  interval: [number, number];
  heightUnit: number;
  onClick: () => void;
}

export const IntervalLines = memo(({interval, heightUnit, onClick}: IntervalLinesProps) => {
  const isCollapsed = interval[0] === interval[1];
  const lowLineBottom = (interval[0] - 0.5) * heightUnit - 1;
  const highLineBottom = (interval[1] + 0.5) * heightUnit;
  const lowLineStyle = {bottom: lowLineBottom + 'px'};
  const highLineStyle = {bottom: highLineBottom + 'px'};

  const isNarrow = highLineBottom - lowLineBottom < 14;
  const lowLabelBottom = isCollapsed
    ? lowLineBottom + 4
    : isNarrow
      ? lowLineBottom - 5
      : lowLineBottom;
  const highLabelBottom = isNarrow ? highLineBottom + 2 : highLineBottom;
  const lowLabelStyle = {bottom: lowLabelBottom + 'px'};
  const highLabelStyle = {bottom: highLabelBottom + 'px'};

  return (
    <div onClick={onClick}>
      <div className="intervalBoundary" style={highLineStyle}></div>
      <div className="intervalBoundary" style={lowLineStyle}></div>
      <div className="intervalLabel" style={lowLabelStyle}>
        <span className="intervalLabelText axisLabelText">{interval[0]}</span>
      </div>
      {isCollapsed ? null : (
        <div className="intervalLabel" style={highLabelStyle}>
          <span className="intervalLabelText axisLabelText">{interval[1]}</span>
        </div>
      )}
    </div>
  );
});
