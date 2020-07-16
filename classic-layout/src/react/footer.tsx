import React from 'react';

export class PageFooter extends React.PureComponent {
  render() {
    return (
      <div className="pageFooter">
        <a className="closePage" href="javascript:window.close()">戻る</a>
      </div>
    );
  }
}
