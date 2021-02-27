import React from 'react';

import {getZhWikiLink} from '../../common/wiki-link';

const DifficultyInfo: React.FC<{difficulty?: string}> = React.memo((props) => {
  const {difficulty} = props;
  if (!difficulty) {
    return null;
  }
  const difficultyClass = difficulty.toLowerCase().replace(":", "");
  return (
    <span className={"difficulty " + difficultyClass}>
      【<span id="difficulty">{difficulty}</span>】
    </span>
  );
});

interface SongInfoProps {
  songTitle: string;
  track: string;
  difficulty?: string;
}
export class SongInfo extends React.PureComponent<SongInfoProps> {
  render() {
    const {songTitle, track, difficulty} = this.props;
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
  }
}
