import '../css/collapsible-container.css';

import {memo} from 'react';

interface Props {
  className?: string;
  hidden?: boolean;
  children?: React.ReactNode;
}
export const CollapsibleContainer = memo(({className, hidden, children}: Props) => {
  let composedClassName = 'collapsibleContainer';
  if (className) {
    composedClassName += ' ' + className;
  }
  if (hidden) {
    composedClassName += ' hidden';
  }
  return <div className={composedClassName}>{children}</div>;
});
