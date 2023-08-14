import React from 'react';

import {VersionInfo} from './plate_info';

interface Props {
  versionInfo?: VersionInfo;
  onChange: (evt: React.SyntheticEvent<HTMLSelectElement>) => void;
}

export function PlateSelect(props: Props) {
  if (!props.versionInfo) {
    return (
      <select>
        <option value="">== Plate Name ===</option>
      </select>
    );
  }
  const {plate_name} = props.versionInfo;
  return (
    <select onChange={props.onChange}>
      <option value="">== Plate Name ===</option>
      {plate_name.CLEAR && <option value="CLEAR">{plate_name.CLEAR}</option>}
      <option value="FC">{plate_name.FC}</option>
      {plate_name.SSS && <option value="SSS">{plate_name.SSS}</option>}
      <option value="FSD">{plate_name.FSD}</option>
      <option value="AP">{plate_name.AP}</option>
    </select>
  );
}
