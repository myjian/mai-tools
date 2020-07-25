import React from 'react';

import {Bookmarklet} from './bookmarklets';

export const BookmarkItem: React.FC<Bookmarklet> = ({
  itemTitle,
  feature,
  howTo,
  screenshotUrl,
  scriptUrl,
}) => (
  <React.Fragment>
    <div className="bookmarklet">
      <div className="bookmarkletText">
        <h3 className="bookmarkletTitle">
          <a href={scriptUrl}>{itemTitle}</a>
        </h3>
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
  </React.Fragment>
);
