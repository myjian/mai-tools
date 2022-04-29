import React from 'react';

import {
  DxVersion,
  getVersionName,
  RATING_CALCULATOR_SUPPORTED_VERSIONS,
} from '../../common/game-version';
import {UIString} from '../i18n';

interface Props {
  handleVersionSelect: (ver: DxVersion) => void;
  gameVer: DxVersion;
}

export class VersionSelect extends React.PureComponent<Props> {
  render() {
    const {gameVer} = this.props;
    return (
      <label>
        {UIString.gameVer}
        <select className="gameVersion" onChange={this.handleChange}>
          {RATING_CALCULATOR_SUPPORTED_VERSIONS.map((ver) => {
            const verStr = ver.toFixed(0);
            return (
              <option key={verStr} value={verStr} selected={ver === gameVer}>
                {getVersionName(ver)}
              </option>
            );
          })}
        </select>
      </label>
    );
  }

  private handleChange = (evt: React.FormEvent<HTMLSelectElement>) => {
    this.props.handleVersionSelect(parseInt(evt.currentTarget.value));
  };
}
