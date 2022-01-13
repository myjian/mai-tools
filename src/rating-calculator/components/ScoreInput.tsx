import React from 'react';

import {UIString} from '../i18n';

export class ScoreInput extends React.PureComponent {
  private textareaRef = React.createRef<HTMLTextAreaElement>();

  render() {
    return (
      <div className="w90">
        <h2 className="scoreInputHeading">{UIString.scoreInputHeading}</h2>
        <div>
          {UIString.scoreInputDescPrefix}
          <a href="/mai-tools/bookmarklets/" target="_blank">{UIString.bookmarketLinkLabel}</a>
          {UIString.scoreInputDescSuffix}
        </div>
        <textarea className="scoreInputArea" ref={this.textareaRef}></textarea>
      </div>
    )
  }

  getInput(): string {
    if (this.textareaRef.current) {
      return this.textareaRef.current.value;
    }
    return "";
  }

  setText(text: string): void {
    if (this.textareaRef.current) {
      this.textareaRef.current.value = text;
    }
  }

  appendText(text: string): void {
    if (this.textareaRef.current) {
      this.textareaRef.current.value += text + "\n";
    }
  }
}
