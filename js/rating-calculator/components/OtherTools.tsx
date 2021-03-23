import React from 'react';

import {UIString} from '../i18n';

export class OtherTools extends React.PureComponent {
  render() {
    return (
      <div className="otherToolsContainer">
        <h2 className="otherToolsHeading">{UIString.otherToolsHeading}</h2>
        <ul>
          <li className="toolItem">
            <a href="../rating-visualizer/" target="_blank">
              {UIString.ratingVisualizer}
            </a>
          </li>
          <li className="toolItem">
            <a href="../bookmarklets/" target="_blank">
              {UIString.bookmarketList}
            </a>
          </li>
          <li className="toolItem">
            <a href="https://maimai-songs.zetaraku.dev/" target="_blank">
              maimai-songs
            </a>
          </li>
          <li className="toolItem">
            <a href="https://otohi.me/" target="_blank">
              {UIString.otohime}
            </a>
          </li>
        </ul>
        <hr className="sectionSep" />
      </div>
    );
  }
}
