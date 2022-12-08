import React from 'react';

interface DateAndPlaceProps {
  date: string;
  isDxMode: boolean;
  toggleDxMode: () => void;
}
export class DateAndPlace extends React.PureComponent<DateAndPlaceProps> {
  render() {
    const {date, isDxMode} = this.props;
    const place = isDxMode ? "DX" : "CAFE MiLK";
    return (
      <div className="dateAndPlace">
        <div className="date">{date}</div>
        <div className="place" tabIndex={0} onClick={this.props.toggleDxMode}>
          {place}
        </div>
      </div>
    );
  }
}
