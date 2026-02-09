import {memo} from 'react';

interface LvLabelProps {
  canZoomIn: boolean;
  title: string;
  onClick: () => void;
}

export const LvLabel = memo(({canZoomIn, onClick, title}: LvLabelProps) => {
  return (
    <div className="lvLabel">
      <div className="lvLabelButtonContainer">
        <button className="lvLabelButton" disabled={!canZoomIn} onClick={onClick}>
          {title}
        </button>
      </div>
    </div>
  );
});
