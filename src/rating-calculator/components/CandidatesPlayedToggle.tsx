import React from 'react';

import {UIString} from '../i18n';

interface Props {
  name: string; // e.g. old / new
  showPlayed: boolean;
  toggleShowPlayed: (showPlayed: boolean) => void;
}

export class CandidatesPlayedToggle extends React.PureComponent<Props> {
  render() {
    const {name, showPlayed} = this.props;
    return (
      <div className="w90">
        <form className="playedToggleForm">
          <label className="radioLabel">
            <input
              className="radioInput"
              name={`showPlayed-${name}`}
              value="1"
              type="radio"
              checked={showPlayed}
              onChange={this.handleRadioChange}
            />
            {UIString.showPlayed}
          </label>
          <label className="radioLabel">
            <input
              className="radioInput"
              name={`showPlayed-${name}`}
              value="0"
              type="radio"
              checked={!showPlayed}
              onChange={this.handleRadioChange}
            />
            {UIString.showNotPlayed}
          </label>
        </form>
      </div>
    );
  }

  private handleRadioChange = () => {
    this.props.toggleShowPlayed(!this.props.showPlayed);
  };
}
