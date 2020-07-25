import React from 'react';

export class PageFooter extends React.PureComponent {
  render() {
    return (
      <footer>
        Made by{" "}
        <a className="authorLink" href="https://github.com/myjian/">
          myjian
        </a>
        .
      </footer>
    );
  }
}
