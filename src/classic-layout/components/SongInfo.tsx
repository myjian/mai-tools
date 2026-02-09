import {memo} from 'react';

import {getZhWikiLink} from '../../common/wiki-link';

const DifficultyInfo = memo((props: {difficulty?: string}) => {
  const {difficulty} = props;
  if (!difficulty) {
    return null;
  }
  const difficultyClass = difficulty.toLowerCase().replace(':', '');
  return (
    <span className={'difficulty ' + difficultyClass}>
      【<span id="difficulty">{difficulty}</span>】
    </span>
  );
});

interface SongInfoProps {
  songTitle: string;
  track: string;
  difficulty?: string;
}
export const SongInfo = memo(({songTitle, track, difficulty}: SongInfoProps) => {
  return (
    <div className="songInfoContainer">
      <div>
        <span className="track" id="track">
          {track}
        </span>
        <DifficultyInfo difficulty={difficulty} />
      </div>
      <h2 className="songTitle" id="songTitle">
        <a className="songWikiLink" href={getZhWikiLink(songTitle)} target="_blank">
          {songTitle}
        </a>
      </h2>
    </div>
  );
});
