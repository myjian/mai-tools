import {memo} from 'react';

interface DateAndPlaceProps {
  date: string;
  actualPlace: string;
  isDxMode: boolean;
  toggleDxMode: () => void;
}

export const DateAndPlace = memo(
  ({actualPlace, date, isDxMode, toggleDxMode}: DateAndPlaceProps) => {
    const place = isDxMode ? actualPlace : 'CAFE MiLK';
    return (
      <div className="dateAndPlace">
        <div className="date">{date}</div>
        <button className="place" onClick={toggleDxMode}>
          {place}
        </button>
      </div>
    );
  },
);
