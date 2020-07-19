import React from 'react';

interface LvLabelProps {
  canZoomIn: boolean;
  title: string;
  onClick: () => void;
}

export class LvLabel extends React.PureComponent<LvLabelProps> {
  render() {
    const {canZoomIn, onClick, title} = this.props;
    return (
      <div className="lvLabel">
        <div className="lvLabelButtonContainer">
          <button className="lvLabelButton" disabled={!canZoomIn} onClick={onClick}>
            {title}
          </button>
        </div>
      </div>
    );
  }
}
