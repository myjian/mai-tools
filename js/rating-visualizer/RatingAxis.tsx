import React from 'react';

interface RatingAxisProps {
  maxRating: number;
  containerHeight: number;
  heightUnit: number;
  step: number;
  onClick: () => void;
}
export class RatingAxis extends React.PureComponent<RatingAxisProps> {
  render() {
    const {step, maxRating, containerHeight, onClick} = this.props;
    const containerStyle = {
      height: containerHeight + "px",
    }
    const children = [];
    let i = 0;
    for (i = 0; i < maxRating; i += step) {
      children.push(this.renderLabel(i));
    }
    children.push(this.renderLabel(i));
    return (
      <div className="axisLabelContainer" style={containerStyle} onClick={onClick}>
        {children}
      </div>
    );
  }

  private renderLabel(i: number) {
    const childStyle = {bottom: i * this.props.heightUnit + "px"};
    return (
      <div className="axisLabel" style={childStyle}>
        <span className="axisLabelText">{i}</span>
      </div>
    );
  }
}
