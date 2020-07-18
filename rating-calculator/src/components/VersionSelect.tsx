import React from 'react';

import {UIString} from '../i18n';

interface Props {
  handleVersionSelect: (ver: number) => void;
  isDxPlus: boolean;
}
export class VersionSelect extends React.PureComponent<Props> {
  render() {
    const {isDxPlus} =this.props;
    return (
      <label>
        {UIString.gameVer}
        <select className="gameVersion" onChange={this.handleChange}>
          <option value="13" selected={!isDxPlus}>DX</option>
          <option value="14" selected={isDxPlus}>DX Plus</option>
        </select>
      </label>
    );
  }

  private handleChange = (evt: React.FormEvent<HTMLSelectElement>) => {
    this.props.handleVersionSelect(parseInt(evt.currentTarget.value));
  }
}
