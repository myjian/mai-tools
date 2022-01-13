import React from 'react';

import {UIString} from '../i18n';

interface State {
  showTextarea: boolean;
}

export class InternalLvInput extends React.PureComponent<{}, State> {
  state: State = {showTextarea: false};

  private textareaRef = React.createRef<HTMLTextAreaElement>();

  render() {
    const {showTextarea} = this.state;
    return (
      <div className="w90">
        <h2 className="lvInputHeading">{UIString.internalLvHeading}</h2>
        <form>
          <label className="radioLabel">
            <input
              className="radioInput"
              name="showLvInput"
              value="0"
              type="radio"
              checked={!showTextarea}
              onChange={this.handleRadioChange}
            />
            {UIString.autoLv}
          </label>
          <label className="radioLabel">
            <input
              className="radioInput"
              name="showLvInput"
              value="1"
              type="radio"
              checked={showTextarea}
              onChange={this.handleRadioChange}
            />
            {UIString.manualLv}
          </label>
        </form>
        {showTextarea && <textarea className="lvInput" ref={this.textareaRef} />}
      </div>
    );
  }

  getInput(): string {
    if (this.textareaRef.current) {
      return this.textareaRef.current.value;
    }
    return "";
  }

  private handleRadioChange = (evt: React.FormEvent<HTMLInputElement>) => {
    this.setState({showTextarea: evt.currentTarget.value === "1"});
  };
}
