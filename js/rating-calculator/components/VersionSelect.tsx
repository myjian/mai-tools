import React from 'react';

import {DxVersion} from '../../common/constants';
import {UIString} from '../i18n';

interface Props {
  handleVersionSelect: (ver: DxVersion) => void;
  gameVer: DxVersion;
}

export class VersionSelect extends React.PureComponent<Props> {
  render() {
    const {gameVer} = this.props;
    const ver = gameVer.toFixed(0);
    return (
      <label>
        {UIString.gameVer}
        <select className="gameVersion" onChange={this.handleChange}>
          <option value="15" selected={ver === "15"}>
            DX Splash
          </option>
          <option value="16" selected={ver === "16"}>
            DX Splash PLUS
          </option>
        </select>
      </label>
    );
  }

  private handleChange = (evt: React.FormEvent<HTMLSelectElement>) => {
    this.props.handleVersionSelect(parseInt(evt.currentTarget.value));
  };
}
