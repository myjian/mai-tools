import React, {useCallback} from 'react';

import {Difficulty, DIFFICULTY_CLASSNAME_MAP} from '../common/difficulties';
import {PlateType} from './plate_info';

interface Props {
  useTh?: boolean;
  d: Difficulty;
  className?: string;
  plateType?: PlateType;
  value: string | number;
  onClick?: (plate: PlateType, d: Difficulty) => void;
}
export function PlateProgressTableCell(props: Props) {
  const {onClick, plateType} = props;
  const handleClick = useCallback(() => {
    if (plateType) {
      onClick(plateType, props.d);
    }
  }, []);
  const handleKeyDown = useCallback((evt: React.KeyboardEvent) => {
    if (evt.ctrlKey || evt.altKey || evt.metaKey || evt.shiftKey) {
      return;
    }
    if (evt.key === 'Enter' || evt.key == ' ') {
      evt.preventDefault();
      handleClick();
    }
  }, []);
  const clickableProps =
    plateType && onClick
      ? {
          onClick: handleClick,
          onKeyDown: handleKeyDown,
          tabIndex: 0,
        }
      : {};
  return props.useTh ? (
    <th className={DIFFICULTY_CLASSNAME_MAP.get(props.d)} {...clickableProps}>
      {props.value}
    </th>
  ) : (
    <td className={props.className} {...clickableProps}>
      {props.value}
    </td>
  );
}
