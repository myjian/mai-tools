import React from 'react';

export class CreditInfo extends React.PureComponent {
  render() {
    return (
      <div className="credit">
        <span className="madeBy">
          Made by{" "}
        </span>
        <a className="authorLink" href="https://github.com/myjian" target="_blank">
          myjian
        </a>
        .
      </div>
    );
  }
}
