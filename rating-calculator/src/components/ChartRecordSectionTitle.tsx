import React from 'react';

interface Props {
  isCandidateList?: boolean;
  contentHidden: boolean;
  title: string;
  onClick: (evt: React.SyntheticEvent<HTMLElement>) => void;
}
export class ChartRecordSectionTitle extends React.PureComponent<Props> {
  render() {
    const {isCandidateList, contentHidden, title} = this.props;
    const symbol = isCandidateList ? "▶" : "▷";
    let symbolClasses = "crSecTitleSymbol";
    if (contentHidden) {
      symbolClasses += " crSecHidden";
    }
    return (
      <div className="crSecTitle" tabIndex={0} onClick={this.handleClick} onKeyPress={this.handleKeyPress}>
        <span className={symbolClasses}>{symbol}</span> {title}
      </div>
    );
  }

  private handleClick = (evt: React.SyntheticEvent<HTMLElement>) => {
    evt.preventDefault();
    this.props.onClick(evt);
  }

  private handleKeyPress = (evt: React.KeyboardEvent<HTMLElement>) => {
    evt.preventDefault();
    console.log(evt.key);
    console.log(evt.keyCode);
    if (evt.key === "Enter") {
      this.props.onClick(evt);
    }
  }
}
