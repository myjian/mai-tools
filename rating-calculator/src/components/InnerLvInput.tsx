import React from 'react';
import ReactDOM from 'react-dom';

import {UIString} from '../i18n';

interface Props {
  textareaId: string;
}

interface State {
  showTextarea: boolean;
}

class InnerLvInput extends React.PureComponent<Props, State> {
  state: State = {showTextarea: false};

  render() {
    const {textareaId} = this.props;
    const {showTextarea} = this.state;
    return (
      <React.Fragment>
        <h2 className="lvInputHeading">{UIString.innerLvHeading}</h2>
        <form>
          <label className="lvFormLabel">
            <input
              className="lvFormRadio"
              name="showLvInput"
              value="0"
              type="radio"
              checked={!showTextarea}
              onChange={this.handleRadioChange}
            />
            {UIString.autoLv}
          </label>
          <label className="lvFormLabel">
            <input
              className="lvFormRadio"
              name="showLvInput"
              value="1"
              type="radio"
              checked={showTextarea}
              onChange={this.handleRadioChange}
            />
            {UIString.manualLv}
          </label>
        </form>
        {showTextarea && <textarea className="lvInput" id={textareaId}></textarea>}
      </React.Fragment>
    );
  }

  private handleRadioChange = (evt: React.FormEvent<HTMLInputElement>) => {
    this.setState({showTextarea: evt.currentTarget.value === "1"});
  };
}

export function renderInnerLvInput(container: HTMLElement, props: Props) {
  ReactDOM.render(<InnerLvInput {...props} />, container);
}
