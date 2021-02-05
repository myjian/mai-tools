import React from 'react';

import {getOfficialLevel} from '../../common/level-helper';
import {UIString} from '../i18n';

function getMaimaiSongsLink(officialLv: string) {
  officialLv = officialLv.replace("+", ".5");
  return `https://maimai-songs.zetaraku.dev/?maxLevelValue=${officialLv}&minLevelValue=${officialLv}`;
}

interface Props {
  lv: number;
}

export class RecommendedLevelCell extends React.PureComponent<Props> {
  render() {
    const {lv} = this.props;
    if (lv < 0) {
      return <td>--</td>;
    }
    const officialLv = getOfficialLevel(lv);
    return (
      <td>
        <a href={getMaimaiSongsLink(officialLv)} target="_blank">
          {officialLv}
        </a>
        <br />({lv.toFixed(1) + UIString.tilde})
      </td>
    );
  }
}
