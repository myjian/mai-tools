import React from 'react';

interface Props {
  handleVersionSelect: (ver: number) => void;
  isDxPlus: boolean;
}
export class VersionSelect extends React.PureComponent<Props> {
  render() {
    const {isDxPlus} =this.props;
    return (
      <div>
        <label htmlFor="gameVersion">遊戲版本：</label>
        <select id="gameVersion" onChange={this.handleChange}>
          <option value="13" selected={!isDxPlus}>DX</option>
          <option value="14" selected={isDxPlus}>DX Plus</option>
        </select>
      </div>
    );
  }

  private handleChange = (evt: React.FormEvent<HTMLSelectElement>) => {
    this.props.handleVersionSelect(parseInt(evt.currentTarget.value));
  }
}
