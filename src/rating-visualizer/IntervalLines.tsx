import React from 'react';

interface IntervalLinesProps {
  interval: [number, number];
  heightUnit: number;
  onClick: () => void;
}

export class IntervalLines extends React.PureComponent<IntervalLinesProps> {
  render() {
    const {interval, heightUnit, onClick} = this.props;
    const isCollapsed = interval[0] === interval[1];
    let lowLabelBottom, highLabelBottom;
    const lowLineBottom = lowLabelBottom = (interval[0] - 0.5) * heightUnit - 1;
    const highLineBottom = highLabelBottom = (interval[1] + 0.5) * heightUnit;
    const lowLineStyle = {bottom: lowLineBottom + "px"};
    const highLineStyle = {bottom: highLineBottom + "px"};
    if (isCollapsed) {
      lowLabelBottom += 4;
    } else if (highLabelBottom - lowLabelBottom < 14) {
      highLabelBottom += 2;
      lowLabelBottom -= 5;
    }

    const lowLabelStyle = {bottom: lowLabelBottom + "px"};
    const highLabelStyle = {bottom: highLabelBottom + "px"};
    return (
      <div onClick={onClick}>
        <div className="intervalBoundary" style={highLineStyle}></div>
        <div className="intervalBoundary" style={lowLineStyle}></div>
        <div className="intervalLabel" style={lowLabelStyle}>
          <span className="intervalLabelText axisLabelText">{interval[0]}</span>
        </div>
        {!isCollapsed && (
          <div className="intervalLabel" style={highLabelStyle}>
            <span className="intervalLabelText axisLabelText">{interval[1]}</span>
          </div>
        )}
      </div>
    );
  }
}
