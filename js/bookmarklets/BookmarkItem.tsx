import React from 'react';

import {Bookmarklet} from './bookmarklets';

export class BookmarkItem extends React.PureComponent<Bookmarklet> {
  render() {
    const {itemTitle, feature, howTo, screenshotUrl} = this.props;
    return (
      <div className="bookmarklet">
        <div className="bookmarkletText">
          <h3 className="bookmarkletTitle">{itemTitle}</h3>
          <ul>
            <li>{feature}</li>
            <li>{typeof howTo === "string" ? howTo : howTo()}</li>
          </ul>
        </div>
        <div className="bookmarkletImage">
          <a href={screenshotUrl}>
            <img className="screenshot" alt="screenshot" src={screenshotUrl} />
          </a>
        </div>
      </div>
    );
  }
}
