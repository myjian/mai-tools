import React from 'react';

interface Props {
  isCandidateList?: boolean;
  contentHidden: boolean;
  title: string;
  onClick: (evt: React.SyntheticEvent<HTMLElement>) => void;
}
interface State {
  symbolClassName: string;
}
export class ChartRecordSectionTitle extends React.PureComponent<Props, State> {
  state: State = {symbolClassName: ""};
  componentDidUpdate(prevProps: Props) {
    if (prevProps.contentHidden && !this.props.contentHidden) {
      this.setState({symbolClassName: "crSecShow"})
      window.setTimeout(() => {
        this.setState({symbolClassName: ""});
      }, 300);
    }
  }
  render() {
    const {isCandidateList, contentHidden, title} = this.props;
    let {symbolClassName} = this.state;
    const symbol = isCandidateList ? "▶" : "▷";
    symbolClassName += " crSecTitleSymbol";
    if (contentHidden) {
      symbolClassName += " crSecHidden";
    }
    return (
      <h3 className="crSecTitleContainer">
        <span
          className="crSecTitle"
          tabIndex={0}
          onClick={this.handleClick}
          onKeyPress={this.handleKeyPress}
        >
          <span className={symbolClassName}>{symbol}</span>{title}
        </span>
      </h3>
    );
  }

  private handleClick = (evt: React.SyntheticEvent<HTMLElement>) => {
    evt.preventDefault();
    this.props.onClick(evt);
  };

  private handleKeyPress = (evt: React.KeyboardEvent<HTMLElement>) => {
    evt.preventDefault();
    console.log(evt.key);
    console.log(evt.keyCode);
    if (evt.key === "Enter") {
      this.props.onClick(evt);
    }
  };
}
