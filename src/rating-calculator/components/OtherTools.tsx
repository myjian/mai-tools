import React from 'react';

import {DxVersion} from '../../common/constants';
import {UIString} from '../i18n';

function getMapDistanceCalcLink() {
  return "https://renawevin.weebly.com/rw-maimaidxsplash-chiho-calculate.html";
}

interface Props {
  gameVer: DxVersion;
}

export class OtherTools extends React.PureComponent<Props> {
  render() {
    const {gameVer} = this.props;
    const visualizerLink = `../rating-visualizer/?gameVer=${gameVer}`;
    return (
      <div className="otherToolsContainer">
        <hr className="sectionSep" />
        <h2 className="otherToolsHeading">{UIString.otherToolsHeading}</h2>
        <ul>
          <li className="toolItem">
            <a href={visualizerLink} target="_blank">
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
          <li className="toolItem">
            <a href={getMapDistanceCalcLink()} target="_blank">
              {UIString.mapDistanceCalc}
            </a>
          </li>
        </ul>
      </div>
    );
  }
}
