import React from 'react';

interface Props {
  className?: string;
  hidden?: boolean;
  children?: React.ReactNode;
}
export class CollapsibleContainer extends React.PureComponent<Props> {
  render() {
    let className = "collapsibleContainer";
    if (this.props.className) {
      className += " " + this.props.className;
    }
    if (this.props.hidden) {
      className += " hidden";
    }
    return (
      <div className={className}>{this.props.children}</div>
    )
  }
}
